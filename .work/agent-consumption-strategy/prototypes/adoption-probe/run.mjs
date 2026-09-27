// Isolated current-API comparison and a temporary styling experiment. No production writes.
import {cp, mkdir, mkdtemp, readFile, symlink, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {spawnSync, spawn} from 'node:child_process';

const here = import.meta.dirname;
const repo = resolve(here, '../../../..');
const scratch = await mkdtemp(resolve(tmpdir(), 'wcl-adoption-'));
await symlink(resolve(repo, 'node_modules'), resolve(scratch, 'node_modules'), 'dir');
await cp(resolve(repo, 'dist'), resolve(scratch, 'custom'), {recursive: true});
const fieldPath = resolve(scratch, 'custom/fields/text-field.js');
let field = await readFile(fieldPath, 'utf8');
field = field
  .replace('TextField({ autoComplete', 'TextField({ classNames = {}, autoComplete')
  .replace('_jsxs(AriaTextField, {', '_jsxs(AriaTextField, { className: classNames.root,')
  .replace('_jsxs(Label, {', '_jsxs(Label, { className: classNames.label,')
  .replace(
    '_jsx("div", { "data-wcl-field-control"',
    '_jsx("div", { className: classNames.control, "data-wcl-field-control"',
  )
  .replace('_jsx(Input, {', '_jsx(Input, { className: classNames.input,');
await writeFile(fieldPath, field);
const buttonPath = resolve(scratch, 'custom/actions/button.js');
let button = await readFile(buttonPath, 'utf8');
button = button
  .replace('Button({ children', 'Button({ className, children')
  .replace('_jsx(AriaButton, {', '_jsx(AriaButton, { className,');
await writeFile(buttonPath, button);
const fieldTypes = resolve(scratch, 'custom/fields/field-types.d.ts');
await writeFile(
  fieldTypes,
  (await readFile(fieldTypes, 'utf8')).replace(
    'export type TextFieldProps =',
    "export type TextFieldProps = {readonly classNames?: Partial<Record<'root' | 'label' | 'control' | 'input', string>>} &",
  ),
);
const buttonTypes = resolve(scratch, 'custom/actions/button.d.ts');
await writeFile(
  buttonTypes,
  (await readFile(buttonTypes, 'utf8')).replace(
    'interface ButtonBaseProps extends ActionChildrenProps {',
    'interface ButtonBaseProps extends ActionChildrenProps { readonly className?: string;',
  ),
);
const app = resolve(scratch, 'app');
await mkdir(app);
for (const file of [
  'app.tsx',
  'native.tsx',
  'library.tsx',
  'style-probe.tsx',
  'board.tsx',
  'shared.tsx',
  'styles.css',
  'index.html',
])
  await cp(resolve(here, file), resolve(app, file));
await writeFile(resolve(scratch, 'package.json'), JSON.stringify({type: 'module'}));
await writeFile(
  resolve(app, 'tsconfig.json'),
  JSON.stringify({
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'Bundler',
      jsx: 'react-jsx',
      lib: ['ES2022', 'DOM', 'DOM.Iterable'],
      strict: true,
      skipLibCheck: true,
      noEmit: true,
      paths: {
        '@trwhitney/component-library': [resolve(repo, 'dist/index.d.ts')],
        '@probe/custom-controls': [resolve(scratch, 'custom/index.d.ts')],
      },
    },
    include: ['*.tsx'],
  }),
);
const checked = spawnSync(
  process.execPath,
  [resolve(repo, 'node_modules/typescript/bin/tsc'), '-p', app],
  {encoding: 'utf8'},
);
if (checked.status) throw new Error(checked.stdout + checked.stderr);
await writeFile(
  resolve(app, 'vite.config.mjs'),
  `export default ${JSON.stringify({root: app, resolve: {alias: {'@trwhitney/component-library/styles.css': resolve(repo, 'dist/styles.css'), '@trwhitney/component-library': resolve(repo, 'dist/index.js'), '@probe/custom-controls': resolve(scratch, 'custom/index.js')}}, server: {host: '127.0.0.1', port: Number(process.env.PROBE_PORT ?? 4391), strictPort: true}})};`,
);
console.log(JSON.stringify({scratch, app, typecheck: 'passed'}));
const child = spawn(
  process.execPath,
  [resolve(repo, 'node_modules/vite/bin/vite.js'), '--config', resolve(app, 'vite.config.mjs')],
  {cwd: app, stdio: 'inherit'},
);
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', (code) => process.exit(code ?? 0));
