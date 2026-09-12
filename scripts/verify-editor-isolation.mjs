import {resolve, dirname} from 'node:path';
import {readFile} from 'node:fs/promises';

import {build} from 'vite';

const projectRoot = resolve(import.meta.dirname, '..');
const includedModules = new Set();
const ordinaryEntry = resolve(projectRoot, 'scripts', 'fixtures', 'ordinary-component-entry.js');

await build({
  build: {
    lib: {
      entry: ordinaryEntry,
      formats: ['es'],
      name: 'WclOrdinaryEditorIsolation',
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
      name: 'wcl-editor-isolation-proof',
    },
  ],
});

const unexpectedModules = [...includedModules].filter(
  (id) =>
    id.includes('/dist/markdown/') ||
    /\/node_modules\/(?:@codemirror|@lezer|react-markdown|remark[^/]*|rehype[^/]*|micromark[^/]*|mdast[^/]*|unified)\//.test(
      id,
    ),
);

if (unexpectedModules.length > 0) {
  throw new Error(
    `An ordinary public component bundle included private Markdown modules:\n${unexpectedModules.join('\n')}`,
  );
}

process.stdout.write(
  'Ordinary public component bundle excludes private Markdown editor and parser modules.\n',
);

// Follow only declarations reachable from the public entry, not intentionally private modules.
const seen = new Set();
async function checkDeclaration(file) {
  if (seen.has(file)) return;
  seen.add(file);
  const source = await readFile(file, 'utf8');
  if (/@codemirror|@lezer|react-markdown|micromark|mdast|remark|unified/.test(source)) {
    throw new Error(`Public declaration exposes a private Markdown dependency: ${file}`);
  }
  for (const match of source.matchAll(/from ['"](\.[^'"]+)['"]/g)) {
    await checkDeclaration(resolve(dirname(file), match[1].replace(/\.js$/, '.d.ts')));
  }
}
await checkDeclaration(resolve(projectRoot, 'dist/index.d.ts'));
process.stdout.write('Public declarations exclude private Markdown types.\n');
