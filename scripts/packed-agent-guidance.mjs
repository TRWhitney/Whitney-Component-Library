import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';

// Validate files in the installed archive, rather than relying on the repository's dist tree.
export async function inspectPackedAgentGuidance(packageDirectory) {
  const dist = resolve(packageDirectory, 'dist');
  const packageJson = JSON.parse(await readFile(resolve(packageDirectory, 'package.json'), 'utf8'));
  const manifest = JSON.parse(await readFile(resolve(dist, 'manifest.json'), 'utf8'));
  const index = await readFile(resolve(dist, 'agent-index.md'), 'utf8');
  const links = [...index.matchAll(/^- \[([^\]]+)\]\((usage\/[^)]+)\)/gm)];
  assert.deepEqual(
    links.map((link) => link[1]).sort(),
    manifest.exports.map((contract) => contract.exportName).sort(),
  );
  const examples = [];
  const shortNames = [
    'AppearanceProvider',
    'Button',
    'Checkbox',
    'Dialog',
    'SearchField',
    'Table',
    'Tabs',
    'TextField',
  ];
  for (const [, name, relative] of links) {
    const path = resolve(dist, relative);
    const page = await readFile(path, 'utf8');
    for (const [, link] of page.matchAll(/\]\(([^)]+)\)/g)) {
      await readFile(resolve(dirname(path), link), 'utf8');
    }
    const propsPath = relative.replace(/^usage\//, 'types/').replace(/\.md$/, '.ts');
    const props = await readFile(resolve(dist, propsPath), 'utf8');
    assert.ok(page.includes(`\n${props}\n`), `${name} inline props differ from standalone props.`);
    if (shortNames.includes(name)) {
      for (const [i, match] of [...page.matchAll(/```tsx\n([\s\S]*?)\n```/g)].entries()) {
        examples.push(`export function Guidance${name}${i}() { return (${match[1]}); }`);
      }
    }
  }
  const types = (await readdir(resolve(dist, 'types'))).map((file) => resolve(dist, 'types', file));
  assert.equal(types.length, links.length);
  assert.equal(examples.length, 9);
  return {
    types,
    examples: `import {${shortNames.join(', ')}} from '${packageJson.name}';\n${examples.join('\n')}`,
  };
}
