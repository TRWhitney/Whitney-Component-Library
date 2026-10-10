import {execFileSync} from 'node:child_process';
import {mkdtemp, readFile, readdir, rm, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';

import ts from 'typescript';
import {beforeAll, describe, expect, it} from 'vitest';

import {componentContracts} from '../src/contracts/index.js';
import {validateEditorialSources} from '../scripts/agent-guidance.mjs';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const shortComponents = [
  'AppearanceProvider',
  'Button',
  'Checkbox',
  'Dialog',
  'SearchField',
  'Table',
  'Tabs',
  'TextField',
];

beforeAll(() => {
  execFileSync(process.execPath, ['scripts/build.mjs', '--check'], {cwd: root});
}, 30000);

describe('installed agent guidance', () => {
  it('requires editorial review after a canonical summary or shortened behavior changes', () => {
    expect(() => validateEditorialSources(componentContracts)).not.toThrow();
    const changed = (name, change) =>
      componentContracts.map((contract) =>
        contract.exportName === name ? {...contract, ...change} : contract,
      );
    expect(() =>
      validateEditorialSources(changed('Button', {formBehavior: ['Changed form behavior.']})),
    ).toThrow(/Review the shortened Button guidance/);
    expect(() =>
      validateEditorialSources(changed('LineChart', {summary: 'Changed selection scope.'})),
    ).toThrow(/Review the shortened LineChart summary/);
    expect(() => validateEditorialSources(componentContracts.slice(1))).toThrow(
      /cover every canonical component/,
    );
  });

  it('links every component to a bundled page with reachable complete references', async () => {
    const index = await readFile(resolve(dist, 'agent-index.md'), 'utf8');
    const links = [...index.matchAll(/^- \[([^\]]+)\]\((usage\/[^)]+)\)/gm)];
    expect(links).toHaveLength(85);
    for (const [, name, relative] of links) {
      const path = resolve(dist, relative);
      const page = await readFile(path, 'utf8');
      expect(page).toContain(`# ${name}\n`);
      expect(page).toContain('## Exact props\n');
      for (const [, link] of page.matchAll(/\]\(([^)]+)\)/g)) {
        await expect(readFile(resolve(dirname(path), link), 'utf8')).resolves.toBeTruthy();
      }
      const file = relative.replace('usage/', '');
      expect(await readFile(resolve(dist, 'full', file), 'utf8')).toBe(
        await readFile(resolve(root, 'docs/components', file), 'utf8'),
      );
    }
  });

  it('offers standalone compilable props and usable short/layout examples', async () => {
    const fixture = await mkdtemp(resolve(root, '.typecheck-guidance-'));
    try {
      const types = await readdir(resolve(dist, 'types'));
      expect(types).toHaveLength(85);
      const examples = [];
      for (const name of shortComponents) {
        const slug = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
        const page = await readFile(resolve(dist, 'usage', `${slug}.md`), 'utf8');
        for (const [i, match] of [...page.matchAll(/```tsx\n([\s\S]*?)\n```/g)].entries()) {
          examples.push(`export function Example${name}${i}() { return (${match[1]}); }`);
        }
      }
      expect(examples).toHaveLength(9);
      const path = resolve(fixture, 'examples.tsx');
      await writeFile(
        path,
        `import {${shortComponents.join(', ')}} from '../dist/index.js';\n${examples.join('\n')}`,
      );
      const program = ts.createProgram(
        [path, ...types.map((file) => resolve(dist, 'types', file))],
        {
          noEmit: true,
          strict: true,
          skipLibCheck: false,
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.NodeNext,
          moduleResolution: ts.ModuleResolutionKind.NodeNext,
          jsx: ts.JsxEmit.ReactJSX,
          types: ['react', 'react-dom'],
        },
      );
      const diagnostics = ts.getPreEmitDiagnostics(program);
      expect(diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'))).toEqual(
        [],
      );
    } finally {
      await rm(fixture, {recursive: true, force: true});
    }
  }, 30000);

  it('leaves navigation pointers in the public declaration entry and eight components', async () => {
    const index = await readFile(resolve(dist, 'index.d.ts'), 'utf8');
    expect(index).toMatch(/^\/\*\*[^\n]*\.\/agent-index\.md \*\//);
    const files = {
      AppearanceProvider: 'appearance/appearance-provider.d.ts',
      Button: 'actions/button.d.ts',
      Checkbox: 'choices/checkbox.d.ts',
      Dialog: 'overlays/dialog.d.ts',
      SearchField: 'fields/search-field.d.ts',
      Table: 'collections/table.d.ts',
      Tabs: 'navigation/tabs.d.ts',
      TextField: 'fields/text-field.d.ts',
    };
    for (const file of Object.values(files)) {
      const path = resolve(dist, file);
      const source = await readFile(path, 'utf8');
      const link = source.match(/^\/\*\*[^\n]* (\.\.\/usage\/[^ ]+\.md) \*\//)?.[1];
      expect(link).toBeDefined();
      await expect(readFile(resolve(dirname(path), link), 'utf8')).resolves.toBeTruthy();
    }
  });
});
