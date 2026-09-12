import {execFileSync} from 'node:child_process';
import {rename, rm} from 'node:fs/promises';
import {resolve} from 'node:path';

const root = resolve(import.meta.dirname, '..');
const app = resolve(root, 'prototypes/data-analysis');
const buildOnly = process.argv.includes('--build');

// Install the actual archive, including its export restrictions. No source aliases.
const packed = JSON.parse(
  execFileSync('npm', ['pack', '--json', '--pack-destination', app], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  }),
);
await rename(
  resolve(app, Object.values(packed)[0].filename),
  resolve(app, 'component-library.tgz'),
);
// npm can otherwise reuse an older installation of a local archive with the same version.
await rm(resolve(app, 'node_modules/@trwhitney/component-library'), {recursive: true, force: true});
execFileSync(
  'npm',
  ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false'],
  {
    cwd: app,
    stdio: 'inherit',
  },
);
execFileSync(process.execPath, [resolve(root, 'node_modules/typescript/bin/tsc'), '-p', app], {
  cwd: root,
  stdio: 'inherit',
});
execFileSync(
  process.execPath,
  [
    resolve(root, 'node_modules/vite/bin/vite.js'),
    ...(buildOnly
      ? ['build', app, '--outDir', '../../.showcase-dist/data-analysis', '--emptyOutDir']
      : [app, '--force', '--host', '0.0.0.0', '--port', '5174', '--strictPort']),
  ],
  {cwd: root, stdio: 'inherit'},
);
