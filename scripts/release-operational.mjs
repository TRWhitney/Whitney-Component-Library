import {execFileSync} from 'node:child_process';
import {mkdir, rm, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createOperationalProofSource} from './operational-proof-source.mjs';

const root = resolve(import.meta.dirname, '..');
const app = resolve(root, '.typecheck-release-operational');
await mkdir(app, {recursive: true});
const [archive] = JSON.parse(
  execFileSync('npm', ['pack', '--json', '--pack-destination', app], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  }),
);
await writeFile(
  resolve(app, 'package.json'),
  JSON.stringify({
    name: 'release-operational-proof',
    private: true,
    type: 'module',
    dependencies: {
      '@trwhitney/component-library': `file:./${archive.filename}`,
      react: '19.2.8',
      'react-dom': '19.2.8',
    },
  }),
);
await rm(resolve(app, 'node_modules/@trwhitney/component-library'), {recursive: true, force: true});
execFileSync(
  'npm',
  ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false'],
  {cwd: app, stdio: 'inherit'},
);
await writeFile(
  resolve(app, 'index.html'),
  '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Operational integration proof</title></head><body><main id="root"></main><script type="module" src="/main.js"></script></body></html>',
);
await writeFile(
  resolve(app, 'main.js'),
  `
import React from 'react';
import {createRoot} from 'react-dom/client';
import {AppearanceProvider, Button, ButtonGroup, DescriptionList, Dialog, FieldGroup, FormSection, InlineAlert, PageHeader, ProcessTracker, ProgressBar, RadioGroup, Stack, StatusIndicator, Surface, TextField} from '@trwhitney/component-library';
import '@trwhitney/component-library/styles.css';
${createOperationalProofSource()}
createRoot(document.getElementById('root')).render(React.createElement(AppearanceProvider, {appearance: 'dark', accent: '#2474ff'}, React.createElement(Surface, {padding: 'regular'}, React.createElement(PackedOperationalProof))));
`,
);
execFileSync(
  process.execPath,
  [
    resolve(root, 'node_modules/vite/bin/vite.js'),
    app,
    '--host',
    '0.0.0.0',
    '--port',
    '5179',
    '--strictPort',
  ],
  {cwd: root, stdio: 'inherit'},
);
