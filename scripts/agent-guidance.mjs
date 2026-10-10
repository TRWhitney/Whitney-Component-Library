import {createHash} from 'node:crypto';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

import {essentials, examples, layoutSupplements} from './agent-guidance/editorial.mjs';
import {createPropsReader} from './agent-guidance/props.mjs';
import summaries from './agent-guidance/summaries.json' with {type: 'json'};
import sources from './agent-guidance/sources.json' with {type: 'json'};

const slug = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const digest = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

export function validateEditorialSources(contracts) {
  const names = contracts.map((contract) => contract.exportName).sort();
  for (const data of [summaries, sources.summaries]) {
    if (JSON.stringify(Object.keys(data).sort()) !== JSON.stringify(names)) {
      throw new Error('Agent summaries must cover every canonical component exactly once.');
    }
  }
  for (const contract of contracts) {
    const name = contract.exportName;
    if (!summaries[name]?.trim() || digest(contract.summary) !== sources.summaries[name]) {
      throw new Error(`Review the shortened ${name} summary and its source fingerprint.`);
    }
    if (essentials[name] && digest(contract) !== sources.essentials[name]) {
      throw new Error(`Review the shortened ${name} guidance and its source fingerprint.`);
    }
  }
  const shortNames = Object.keys(essentials).sort();
  for (const data of [examples, sources.essentials]) {
    if (JSON.stringify(Object.keys(data).sort()) !== JSON.stringify(shortNames)) {
      throw new Error('Every shortened behavior page needs an example and source fingerprint.');
    }
  }
}

function renderIndex(contracts, packageName) {
  return [
    '# Component guide',
    '',
    `Import from '${packageName}' and import '${packageName}/styles.css' once.`,
    'Wrap components in AppearanceProvider with appearance="light" or "dark" and a six-digit accent.',
    'Use public props. Applications own data, routing, and domain behavior; native/custom React composition is allowed.',
    '',
    'Choose a component; read its usage and exact props. Full selection, structure, state, forms, access, and visual details are in its linked full contract.',
    '',
    ...contracts.map(
      (contract) =>
        `- [${contract.exportName}](usage/${slug(contract.exportName)}.md): ${summaries[contract.exportName]}`,
    ),
    '',
  ].join('\n');
}

function renderUsage(contract, props) {
  const name = contract.exportName;
  const facts = essentials[name] ?? [
    ...new Set(
      [
        'composition',
        'controlBehavior',
        'events',
        'validation',
        'labeling',
        'accessibility',
        'keyboardBehavior',
        'formBehavior',
      ].flatMap((field) => contract[field]),
    ),
  ];
  return [
    `# ${name}`,
    '',
    summaries[name],
    '',
    'Setup: [package guide](../agent-index.md).',
    '',
    '## Behavior',
    '',
    ...facts.map((fact) => `- ${fact}`),
    '',
    '## Minimal example',
    '',
    '```tsx',
    examples[name] ?? contract.examples[0].code,
    '```',
    '',
    ...(layoutSupplements[name] ? [layoutSupplements[name].trimEnd(), ''] : []),
    '## Exact props',
    '',
    '```ts',
    props,
    '```',
    '',
    `More examples, selection advice, and full behavior: [full contract](../full/${slug(name)}.md).`,
    '',
  ].join('\n');
}

const pointerFiles = {
  AppearanceProvider: 'appearance/appearance-provider.d.ts',
  Button: 'actions/button.d.ts',
  Checkbox: 'choices/checkbox.d.ts',
  Dialog: 'overlays/dialog.d.ts',
  SearchField: 'fields/search-field.d.ts',
  Table: 'collections/table.d.ts',
  Tabs: 'navigation/tabs.d.ts',
  TextField: 'fields/text-field.d.ts',
};

async function prependPointer(dist, file, pointer) {
  const path = resolve(dist, file);
  await writeFile(path, pointer + (await readFile(path, 'utf8')));
  // The added declaration line has no source. Retain the original mappings one line later.
  const mapPath = `${path}.map`;
  const map = JSON.parse(await readFile(mapPath, 'utf8'));
  map.mappings = `;${map.mappings}`;
  await writeFile(mapPath, JSON.stringify(map));
}

export async function writeAgentGuidance({dist, contracts, packageName, renderFull}) {
  validateEditorialSources(contracts);
  const propsFor = createPropsReader(dist);
  for (const folder of ['usage', 'full', 'types']) {
    await mkdir(resolve(dist, folder), {recursive: true});
  }
  await writeFile(resolve(dist, 'agent-index.md'), renderIndex(contracts, packageName));
  for (const contract of contracts) {
    const id = slug(contract.exportName);
    const props = propsFor(contract.exportName);
    await writeFile(resolve(dist, 'usage', `${id}.md`), renderUsage(contract, props));
    await writeFile(resolve(dist, 'types', `${id}.ts`), props);
    await writeFile(resolve(dist, 'full', `${id}.md`), renderFull(contract, packageName));
  }
  for (const [name, file] of Object.entries(pointerFiles)) {
    await prependPointer(
      dist,
      file,
      `/** ${name} usage, behavior, and exact props: ../usage/${slug(name)}.md */\n`,
    );
  }
  await prependPointer(
    dist,
    'index.d.ts',
    '/** Component usage, behavior, and exact props: ./agent-index.md */\n',
  );
}
