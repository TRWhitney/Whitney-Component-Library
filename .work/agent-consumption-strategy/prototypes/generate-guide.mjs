// Experimental package-local reading path. Does not modify production artifacts.
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {resolve, relative, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const output = process.argv[2];
if (!output) throw new Error('Supply an output directory outside production paths.');
const dist = resolve(repo, 'dist');
const manifest = JSON.parse(await readFile(resolve(dist, 'manifest.json'), 'utf8'));
const program = ts.createProgram([resolve(dist, 'index.d.ts')], {
  module: ts.ModuleKind.NodeNext,
  moduleResolution: ts.ModuleResolutionKind.NodeNext,
  target: ts.ScriptTarget.ES2022,
  skipLibCheck: true,
});
const checker = program.getTypeChecker();
const index = program.getSourceFile(resolve(dist, 'index.d.ts'));
const exports = checker.getExportsOfModule(checker.getSymbolAtLocation(index));
const byName = new Map(exports.map((symbol) => [symbol.name, symbol]));
const printer = ts.createPrinter();
const slug = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

function propsFor(name) {
  const start = byName.get(`${name}Props`);
  if (!start) throw new Error(`No public props found for ${name}`);
  const declarations = new Map();
  const external = new Map();
  const visitSymbol = (original, referenceName) => {
    if (!original) return;
    let symbol = original;
    if (symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
    for (const declaration of symbol.declarations ?? []) {
      if (!ts.isInterfaceDeclaration(declaration) && !ts.isTypeAliasDeclaration(declaration))
        continue;
      const file = declaration.getSourceFile();
      if (!file.fileName.startsWith(`${dist}/`)) {
        // Public React types are external; standard TS utility types need no import.
        if (file.fileName.includes('/@types/react/') && ts.isExternalModule(file))
          external.set(referenceName, 'react');
        continue;
      }
      const key = `${file.fileName}:${declaration.pos}`;
      if (declarations.has(key)) continue;
      declarations.set(key, declaration);
      const walk = (node) => {
        if (ts.isTypeReferenceNode(node)) {
          visitSymbol(checker.getSymbolAtLocation(node.typeName), node.typeName.getText(file));
        }
        if (ts.isExpressionWithTypeArguments(node)) {
          visitSymbol(checker.getSymbolAtLocation(node.expression), node.expression.getText(file));
        }
        ts.forEachChild(node, walk);
      };
      walk(declaration);
    }
  };
  visitSymbol(start, `${name}Props`);
  const names = [...declarations.values()].map((node) => node.name.text);
  if (new Set(names).size !== names.length) throw new Error(`Duplicate type names for ${name}`);
  const imports = [...external.keys()].sort();
  return [
    ...(imports.length ? [`import type {${imports.join(', ')}} from 'react';`, ''] : []),
    ...[...declarations.values()].map((node) =>
      printer.printNode(ts.EmitHint.Unspecified, node, node.getSourceFile()),
    ),
  ].join('\n\n');
}

const groups = [
  [
    'Set appearance and arrange content',
    'AppearanceProvider Stack InlineGroup ResponsiveGrid Surface Section Divider ScrollRegion FocusField PageHeader SplitView',
  ],
  [
    'Run commands or navigate',
    'Button IconButton Link ToggleButton ButtonGroup Toolbar Breadcrumbs Pagination CollapsibleNavigationPane',
  ],
  [
    'Enter or choose values',
    'TextField TextArea NumberField SearchField Checkbox CheckboxGroup Switch RadioGroup SegmentedControl Select ComboBox ListBox Slider RangeSlider DateField TimeField DatePicker DateRangePicker Field FieldGroup FormSection',
  ],
  ['Show collections', 'List DescriptionList CardCollection Table Tree CollectionFilterBar'],
  [
    'Open focused work or secondary actions',
    'Dialog AlertDialog Drawer Popover Menu ContextMenu Tooltip',
  ],
  ['Switch or reveal content', 'Tabs Disclosure Accordion'],
  [
    'Explain state and progress',
    'StatusIndicator Badge InlineAlert AlertBanner EmptyState Skeleton Spinner ProgressBar Meter ProcessTracker NotificationProvider',
  ],
  ['Acquire files or edit Markdown', 'FileTrigger DropZone MarkdownEditor'],
  [
    'Compare or inspect data',
    'LineChart AreaChart BarChart ColumnChart CartesianChart ScatterChart BubbleChart Histogram BoxPlot PieChart DonutChart RadarChart Heatmap Sparkline',
  ],
];
const covered = groups.flatMap(([, names]) => names.split(' '));
if (
  covered.length !== manifest.exports.length ||
  new Set(covered).size !== covered.length ||
  manifest.exports.some((contract) => !covered.includes(contract.exportName))
) {
  throw new Error('Task groups must cover every component exactly once.');
}
await mkdir(resolve(output, 'components'), {recursive: true});
await mkdir(resolve(output, 'full'), {recursive: true});
await mkdir(resolve(output, 'types'), {recursive: true});
const contracts = new Map(manifest.exports.map((contract) => [contract.exportName, contract]));
const introduction = [
  '# Component guide',
  '',
  'Import from `@trwhitney/component-library`. Import `@trwhitney/component-library/styles.css` once.',
  'Wrap the application in `AppearanceProvider` with `appearance="light"` or `"dark"` and a six-digit `accent` color.',
  'Use public props, not React Aria props or private styles. Applications own routing, data, and page layout.',
  'Use native HTML when no library component fits. Prefer uncontrolled state when the application does not need to own it.',
  '',
  'Choose by task below. Each component link contains usage, a working example, and an exact props reference.',
  '',
  'For immediate settings use Switch; for submitted binary values use Checkbox. Use RadioGroup for visible exclusive choices, Select for a collapsed finite list, or ComboBox for filtering.',
  'Use Dialog for ordinary focused work and AlertDialog for consequential confirmation. Use a Menu for commands, not form values.',
  'Use StatusIndicator for current state, Badge for metadata, and InlineAlert for a local explanation. Loading, empty, and error are different states.',
  '',
];
const sizes = [];
for (const [title, names] of groups) {
  introduction.push(`## ${title}`, '');
  for (const name of names.split(' ')) {
    const contract = contracts.get(name);
    const id = slug(name);
    introduction.push(`- [${name}](components/${id}.md): ${contract.summary}`);
    const example = contract.examples[0];
    const related = contract.relatedExports.filter(
      (n) => n === 'AppearanceProvider' || new RegExp(`<${n}(?:\\s|/|>)`).test(example.code),
    );
    const text = [
      `# ${name}`,
      '',
      contract.purpose,
      '',
      '## Choose',
      '',
      ...contract.appropriateUses.map((s) => `- Use for ${s}.`),
      ...contract.preferredAlternatives.map((s) => `- ${s}`),
      '',
      '## Use',
      '',
      ...[...contract.composition, ...contract.controlBehavior, ...contract.validation].map(
        (s) => `- ${s}`,
      ),
      '',
      '## Example',
      '',
      example.description,
      '',
      '```tsx',
      `import {${[name, ...related].sort().join(', ')}} from '@trwhitney/component-library';`,
      '',
      example.code,
      '```',
      '',
      `Read [exact props](../types/${id}.ts) for required fields, value shapes, and valid state combinations.`,
      `Read the [full contract](../full/${id}.md) for remaining states, keyboard behavior, and appearance.`,
      '',
    ].join('\n');
    await writeFile(resolve(output, 'components', `${id}.md`), text);
    await writeFile(resolve(output, 'types', `${id}.ts`), propsFor(name));
    await writeFile(
      resolve(output, 'full', `${id}.md`),
      await readFile(resolve(repo, 'docs/components', `${id}.md`), 'utf8'),
    );
    sizes.push({name, referenceCharacters: text.length});
  }
  introduction.push('');
}
await writeFile(resolve(output, 'agent-index.md'), introduction.join('\n'));
await writeFile(
  resolve(output, 'generation.json'),
  JSON.stringify({source: relative(repo, dist), components: sizes}, null, 2),
);
console.log(
  JSON.stringify({
    components: sizes.length,
    indexCharacters: introduction.join('\n').length,
    output,
  }),
);
