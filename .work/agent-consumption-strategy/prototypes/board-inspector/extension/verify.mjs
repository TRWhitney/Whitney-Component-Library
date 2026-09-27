/* global document */
// Focus experiment only. Builds a disposable package replacement and browser fixture.
import {mkdtemp, cp, readFile, writeFile, symlink, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';

const sourceDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(sourceDir, '../../../../..');
const require = createRequire(join(root, 'package.json'));
const ts = require('typescript');
const {createServer} = await import(require.resolve('vite'));
const {chromium} = require('playwright');
const temp = await mkdtemp(join(tmpdir(), 'wcl-dialog-focus-'));
let server;
let browser;
try {
  await symlink(join(root, 'node_modules'), join(temp, 'node_modules'));
  await cp(join(root, 'dist'), join(temp, 'dist'), {recursive: true});
  await writeFile(join(temp, 'package.json'), '{"type":"module"}');
  const source = await readFile(join(sourceDir, 'dialog.tsx'), 'utf8');
  await writeFile(join(temp, 'dist/overlays/dialog.tsx'), source);
  await cp(join(sourceDir, 'dialog.d.ts'), join(temp, 'dist/overlays/dialog.d.ts'));
  await writeFile(
    join(temp, 'dist/overlays/dialog.js'),
    ts.transpileModule(source, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
        jsx: ts.JsxEmit.ReactJSX,
      },
    }).outputText,
  );
  execFileSync(
    process.execPath,
    [
      require.resolve('typescript/bin/tsc'),
      '--noEmit',
      '--strict',
      '--exactOptionalPropertyTypes',
      '--skipLibCheck',
      '--target',
      'ES2022',
      '--module',
      'NodeNext',
      '--moduleResolution',
      'NodeNext',
      '--jsx',
      'react-jsx',
      join(temp, 'dist/overlays/dialog.tsx'),
    ],
    {stdio: 'pipe'},
  );
  await writeFile(
    join(temp, 'index.html'),
    '<div id="root"></div><script type="module" src="/fixture.tsx"></script>',
  );
  await cp(join(sourceDir, 'fixture.tsx'), join(temp, 'fixture.tsx'));
  server = await createServer({
    root: temp,
    cacheDir: join(temp, '.vite-cache'),
    logLevel: 'error',
    configFile: false,
    server: {host: '127.0.0.1', port: 0},
    resolve: {
      alias: [
        {
          find: '@trwhitney/component-library/styles.css',
          replacement: join(temp, 'dist/styles.css'),
        },
        {find: '@trwhitney/component-library', replacement: join(temp, 'dist/index.js')},
      ],
    },
  });
  await server.listen();
  browser = await chromium.launch({headless: true});
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  await page.goto(server.resolvedUrls.local[0]);
  const waitFocus = (id) => page.waitForFunction((id) => document.activeElement?.id === id, id);
  const open = async () => {
    await page.locator('#opener').click();
    await page.getByRole('dialog').waitFor();
    await page.waitForFunction(
      () => document.activeElement?.getAttribute('aria-label') === 'Close inspector',
    );
  };
  const closed = () => page.getByRole('dialog').waitFor({state: 'detached'});
  await open();
  for (const key of [
    'Tab',
    'Tab',
    'Tab',
    'Tab',
    'Shift+Tab',
    'Shift+Tab',
    'Shift+Tab',
    'Shift+Tab',
  ]) {
    await page.keyboard.press(key);
    if (!(await page.getByRole('dialog').evaluate((el) => el.contains(document.activeElement))))
      throw Error(`Focus escaped dialog on ${key}`);
  }
  await page.keyboard.press('Escape');
  await closed();
  await waitFocus('target-0');
  await open();
  await page.getByRole('button', {name: 'Move target and close', exact: true}).click();
  await closed();
  await waitFocus('target-1');
  await open();
  await page.getByRole('button', {name: 'Close inspector', exact: true}).click();
  await closed();
  await waitFocus('target-1');
  await open();
  await page.getByRole('button', {name: 'Remove target and close', exact: true}).click();
  await closed();
  await waitFocus('opener');
  await page.getByRole('button', {name: 'Existing trigger', exact: true}).click();
  await page.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape');
  await closed();
  await page.waitForFunction(() => document.activeElement?.textContent === 'Existing trigger');
  if (errors.length) throw Error(errors.join('\n'));
  console.log(
    JSON.stringify(
      {
        result: 'pass',
        checks: [
          'strict TypeScript',
          'StrictMode mount/ref behavior',
          'native opener',
          'initial focus',
          'Tab containment',
          'Escape return',
          'close button return',
          'latest ref after simultaneous move and close',
          'removed target fallback to original opener',
          'existing triggered Dialog Escape return',
        ],
        errors,
      },
      null,
      2,
    ),
  );
} catch (error) {
  if (error.stdout) console.error(error.stdout.toString());
  throw error;
} finally {
  await browser?.close();
  await server?.close();
  await rm(temp, {recursive: true, force: true});
}
