import {resolve} from 'node:path';

import {build} from 'vite';

const projectRoot = resolve(import.meta.dirname, '..');
const includedModules = new Set();
const ordinaryEntry = resolve(projectRoot, 'scripts', 'fixtures', 'ordinary-component-entry.js');

await build({
  build: {
    lib: {
      entry: ordinaryEntry,
      formats: ['es'],
      name: 'WclOrdinaryComponentIsolation',
    },
    minify: false,
    rolldownOptions: {
      external: (id) => id === 'react' || id.startsWith('react/') || id.startsWith('react-dom/'),
    },
    write: false,
  },
  configFile: false,
  logLevel: 'error',
  plugins: [
    {
      generateBundle(_options, bundle) {
        for (const output of Object.values(bundle)) {
          if (output.type !== 'chunk') continue;
          for (const [id, module] of Object.entries(output.modules)) {
            if (module.renderedLength > 0) includedModules.add(id);
          }
        }
      },
      name: 'wcl-chart-isolation-proof',
    },
  ],
});

const unexpectedModules = [...includedModules].filter(
  (id) => id.includes('/dist/charts/') || /\/node_modules\/d3-(?:array|scale|shape)\//.test(id),
);

if (unexpectedModules.length > 0) {
  throw new Error(
    `An ordinary public component bundle included private chart modules:\n${unexpectedModules.join('\n')}`,
  );
}

process.stdout.write('Ordinary public component bundle excludes private chart renderer modules.\n');
