import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';

const root = fileURLToPath(new URL('../../../', import.meta.url));

export default defineConfig({
  root,
  cacheDir: `${root}node_modules/.vite-visual-character`,
  optimizeDeps: {
    entries: [
      'prototypes/application-workbench/main.tsx',
      'prototypes/markdown-authoring/main.tsx',
      'prototypes/data-analysis/main.tsx',
    ],
  },
  server: {host: '0.0.0.0', port: 5180, strictPort: true},
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: [
      {
        find: '@trwhitney/component-library/styles.css',
        replacement: `${root}dist/styles.css`,
      },
      {find: '@trwhitney/component-library', replacement: `${root}dist/index.js`},
    ],
  },
  plugins: [
    {
      name: 'visual-study-demo-entry',
      enforce: 'pre',
      resolveId(id, importer) {
        if (
          id === './publication.js' &&
          importer?.endsWith('/prototypes/markdown-authoring/app.tsx')
        ) {
          return `${root}.work/visual-character/prototypes/publication-study.tsx`;
        }
      },
      transformIndexHtml(html, context) {
        const match = context.path.match(/^\/prototypes\/([^/]+)\//);
        return match
          ? html.replace('src="/main.tsx"', `src="/prototypes/${match[1]}/main.tsx"`)
          : html;
      },
    },
  ],
});
