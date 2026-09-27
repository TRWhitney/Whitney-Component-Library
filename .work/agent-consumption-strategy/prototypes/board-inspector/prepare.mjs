// Pack two isolated package variants and prepare identical independent consumer fixtures.
import {cp, mkdir, mkdtemp, readFile, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import ts from 'typescript';

const here = import.meta.dirname;
const repo = resolve(here, '../../../..');
const root = await mkdtemp(resolve(tmpdir(), 'wcl-board-inspector-'));
const json = (path, data) => writeFile(path, JSON.stringify(data, null, 2) + '\n');
const commonGuide = `# Dialog\n\nImport Dialog from @trwhitney/component-library. Import styles.css once and render beneath AppearanceProvider.\n\nDialog owns modal focus containment, Escape/close dismissal, title, description, and a close control. Applications own content, draft state, save/cancel semantics, and the surrounding layout. The actions callback receives close(). Use isOpen with onOpenChange when the application owns open state. Keep the Dialog mounted while controlling isOpen so closing animations and focus cleanup finish.\n\n`;
const guides = {
  current:
    commonGuide +
    `The trigger prop is required and must render a library Button or IconButton, including in controlled mode. Native controls do not participate in trigger registration. Focus normally returns to the opener through the underlying modal behavior. There is no public explicit return-focus target prop. Applications own any additional focus handling.\n\n\`\`\`tsx\n<Dialog title="Details" description="Item details" closeLabel="Close details" isOpen={open} onOpenChange={setOpen} trigger={<Button>Details</Button>}>\n  <p>Item content</p>\n</Dialog>\n\`\`\`\n`,
  experimental:
    commonGuide +
    `With a rendered trigger, existing behavior is unchanged. Alternatively, omit trigger and supply isOpen, onOpenChange, and returnFocusRef. Open it from consumer-owned controls. returnFocusRef is a React RefObject<HTMLElement | null>; the Dialog reads its latest current target after the closing overlay is removed. Keep the target connected and focusable. If it is missing, normal restoration to the connected original opener remains. This experimental path is tested for single LTR dialogs; nested overlays and local RTL are outside this experiment.\n\n\`\`\`tsx\nconst target = useRef<HTMLButtonElement>(null);\n<button ref={target} onClick={() => setOpen(true)}>Details</button>\n<Dialog title="Details" description="Item details" closeLabel="Close details" isOpen={open} onOpenChange={setOpen} returnFocusRef={target}>\n  <p>Item content</p>\n</Dialog>\n\`\`\`\n`,
};
const artifacts = {};
for (const condition of ['current', 'experimental']) {
  const staging = resolve(root, `${condition}-package`);
  await mkdir(staging);
  await cp(resolve(repo, 'dist'), resolve(staging, 'dist'), {recursive: true});
  await cp(resolve(repo, 'README.md'), resolve(staging, 'README.md'));
  const pkg = JSON.parse(await readFile(resolve(repo, 'package.json'), 'utf8'));
  pkg.description =
    'React components. Installed usage guidance: ./dist/agent-index.md and ./dist/dialog-guide.md.';
  pkg.exports['./dialog-guide.md'] = './dist/dialog-guide.md';
  await json(resolve(staging, 'package.json'), pkg);
  await writeFile(resolve(staging, 'dist/dialog-guide.md'), guides[condition]);
  for (const path of ['dist/agent-index.md', 'dist/index.d.ts']) {
    const prefix = path.endsWith('.d.ts')
      ? '/** Dialog usage: ./dialog-guide.md. */\n'
      : 'For Dialog usage and focus behavior, read [Dialog guide](dialog-guide.md).\n\n';
    await writeFile(
      resolve(staging, path),
      prefix + (await readFile(resolve(staging, path), 'utf8')),
    );
  }
  if (condition === 'experimental') {
    const source = await readFile(resolve(here, 'extension/dialog.tsx'), 'utf8');
    const compiled = ts.transpileModule(source, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
        jsx: ts.JsxEmit.ReactJSX,
      },
    });
    await writeFile(resolve(staging, 'dist/overlays/dialog.js'), compiled.outputText);
    await cp(resolve(here, 'extension/dialog.d.ts'), resolve(staging, 'dist/overlays/dialog.d.ts'));
    const index = resolve(staging, 'dist/overlays/index.d.ts');
    await writeFile(
      index,
      (await readFile(index, 'utf8')).replace(
        'ContextMenuProps, DialogProps,',
        'ContextMenuProps,',
      ) + '\nexport type {DialogProps} from "./dialog.js";\n',
    );
    const manifestPath = resolve(staging, 'dist/manifest.json');
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    const contract = manifest.exports.find((item) => item.exportName === 'Dialog');
    contract.composition.unshift(
      'Experimental controlled mode may omit trigger when isOpen, onOpenChange, and returnFocusRef are supplied. Read ./dialog-guide.md for this additional mode; existing trigger restrictions apply only when a trigger is supplied.',
    );
    await json(manifestPath, manifest);
  }
  const packDir = resolve(root, `${condition}-artifact`);
  await mkdir(packDir);
  const packed = JSON.parse(
    execFileSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', packDir], {
      cwd: staging,
      encoding: 'utf8',
    }),
  )[0];
  artifacts[condition] = {
    path: resolve(packDir, packed.filename),
    sha256: createHash('sha256')
      .update(await readFile(resolve(packDir, packed.filename)))
      .digest('hex'),
    guideCharacters: guides[condition].length,
  };
}
for (const [index, condition] of ['current', 'experimental'].entries()) {
  for (const kind of ['reference', 'trial']) {
    const app = resolve(root, `${condition}-${kind}`);
    await cp(resolve(here, 'seed'), app, {recursive: true});
    const port = 4421 + index * 2 + (kind === 'trial' ? 1 : 0);
    await json(resolve(app, 'package.json'), {
      name: `board-${condition}-${kind}`,
      private: true,
      type: 'module',
      scripts: {
        dev: `vite --host 127.0.0.1 --port ${port} --strictPort`,
        check: 'tsc --noEmit && vite build',
      },
      dependencies: {
        '@trwhitney/component-library': `file:${artifacts[condition].path}`,
        react: '19.2.8',
        'react-dom': '19.2.8',
      },
      devDependencies: {
        typescript: '5.9.3',
        vite: '8.2.1',
        playwright: '1.61.1',
        '@types/react': '19.2.18',
        '@types/react-dom': '19.2.4',
      },
    });
    await json(resolve(app, 'tsconfig.json'), {
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'Bundler',
        jsx: 'react-jsx',
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        strict: true,
        skipLibCheck: true,
        noEmit: true,
      },
      include: ['src'],
    });
    await writeFile(
      resolve(app, 'index.html'),
      '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Piece inspector experiment</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n',
    );
    const install = execFileSync(
      'npm',
      ['install', '--ignore-scripts', '--no-audit', '--no-fund'],
      {cwd: app, encoding: 'utf8'},
    );
    const evidence = resolve(root, `${condition}-${kind}-evidence`);
    await mkdir(evidence);
    await writeFile(resolve(evidence, 'install.log'), install);
    await cp(resolve(here, 'task.txt'), resolve(evidence, 'prompt.txt'));
    console.log(JSON.stringify({app, port}));
  }
}
await json(resolve(root, 'packages.json'), {
  sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], {cwd: repo, encoding: 'utf8'}).trim(),
  node: process.version,
  model: 'gpt-6-astra',
  reasoning: 'medium',
  artifacts,
});
console.log(root);
