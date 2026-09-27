// Research artifact. Not a package API or a semantic correctness checker.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../../..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'dist/manifest.json'), 'utf8'));
const contracts = new Map(manifest.exports.map((contract) => [contract.exportName, contract]));
const packageName = '@trwhitney/component-library';
const print = (value) => process.stdout.write(`${JSON.stringify(value)}\n`);

// This decision table is manually authored from choice/selection contracts.
// It is not inferred from arbitrary user prose or encoded in the current manifest.
export function choose(input) {
  const fields = {
    intent: ['value', 'panels', 'route'],
    cardinality: ['boolean', 'one', 'many'],
    apply: ['immediate', 'submit'],
    display: ['visible', 'segments', 'collapsed', 'search'],
    details: [true, false],
    customText: [true, false],
  };
  for (const [key, value] of Object.entries(input)) {
    // Unknown application intents are valid inputs. The optional helper abstains.
    if (key === 'intent' && typeof value === 'string' && value.trim()) continue;
    if (!fields[key]?.includes(value))
      return {status: 'invalid', field: key, allowed: fields[key] ?? []};
  }
  if (!input.intent) return {status: 'needs-input', field: 'intent', allowed: fields.intent};
  if (input.intent !== 'value')
    return {
      status: 'outside-scope',
      reason:
        'This optional probe selects value controls only. Native or custom interactions remain available for any application.',
      inspect:
        input.intent === 'panels'
          ? ['Tabs']
          : input.intent === 'route'
            ? ['Link', 'SideNavigation']
            : [],
    };
  if (input.customText)
    return {
      status: 'outside-scope',
      reason:
        'Custom text is not a ComboBox selection. Inspect TextField or a separate text entry flow.',
    };
  if (!input.cardinality)
    return {status: 'needs-input', field: 'cardinality', allowed: fields.cardinality};
  let name;
  if (input.cardinality === 'boolean') {
    if (input.display || input.details !== undefined)
      return {status: 'invalid', reason: 'display and details only apply to collections.'};
    if (!input.apply) return {status: 'needs-input', field: 'apply', allowed: fields.apply};
    name = input.apply === 'immediate' ? 'Switch' : 'Checkbox';
  } else {
    if (!input.display) return {status: 'needs-input', field: 'display', allowed: fields.display};
    if (input.cardinality === 'many') {
      if (input.display !== 'visible')
        return {
          status: 'outside-scope',
          reason: 'This probe has no collapsed or searchable multiple-selection recipe.',
        };
      name = 'CheckboxGroup';
    } else {
      name = {
        visible: 'RadioGroup',
        segments: 'SegmentedControl',
        collapsed: 'Select',
        search: 'ComboBox',
      }[input.display];
      if (name === 'SegmentedControl' && input.details !== false)
        return {
          status: input.details === true ? 'conflict' : 'needs-input',
          reason: 'SegmentedControl needs short labels without per-option descriptions.',
          field: 'details',
          alternatives: ['RadioGroup'],
        };
    }
  }
  const contract = contracts.get(name);
  return {
    status: 'selected',
    export: name,
    use: contract.appropriateUses,
    setup: contract.composition,
    control: contract.controlBehavior,
    events: contract.events,
    scope:
      'Conditional on supplied intent. No layout, state persistence, or semantic verification.',
  };
}

// One inspected, typechecked recipe is enough to test the cost of exact usage output.
export function fragment(name) {
  if (name !== 'RadioGroup')
    throw new Error('Fragment emission is limited to RadioGroup in this probe.');
  return `'use client';
import {useState} from 'react';
import {RadioGroup} from '${packageName}';
import '${packageName}/styles.css';

// Render beneath the application's AppearanceProvider.
// Consumer-owned state and options. Place the control in any layout.
const options = [
  {value: 'daily', label: 'Daily'},
  {value: 'weekly', label: 'Weekly'},
  {value: 'never', label: 'Never'},
] as const;
type Frequency = (typeof options)[number]['value'];

export function FrequencyExample() {
  const [value, setValue] = useState<Frequency | null>('weekly');
  return (
    <RadioGroup
      label="Digest frequency"
      name="frequency"
      options={options}
      value={value}
      onChange={setValue}
    />
  );
}
`;
}

export function audit(paths) {
  const findings = [];
  let jsxFiles = 0;
  for (const filename of paths) {
    const source = fs.readFileSync(filename, 'utf8');
    const relative = path.relative(root, filename);
    const add = (code, pos, message) =>
      findings.push({file: relative, line: source.slice(0, pos).split('\n').length, code, message});
    if (filename.endsWith('.css')) {
      // Deliberately limited lexical scan. Comments can produce false positives.
      const hooks = [...source.matchAll(/\[data-wcl-[\w-]+/g)];
      if (hooks.length)
        add(
          'private-selector',
          hooks[0].index,
          `${hooks.length} private data-wcl attribute selectors. Inspect public props before depending on internal DOM.`,
        );
      continue;
    }
    if (!/\.[jt]sx$/.test(filename)) continue;
    jsxFiles++;
    const tree = ts.createSourceFile(
      filename,
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    const imports = new Map();
    for (const statement of tree.statements) {
      if (!ts.isImportDeclaration(statement) || statement.moduleSpecifier.text !== packageName)
        continue;
      const bindings = statement.importClause?.namedBindings;
      if (bindings && ts.isNamedImports(bindings)) {
        for (const element of bindings.elements)
          imports.set(element.name.text, element.propertyName?.text ?? element.name.text);
      }
    }
    let libraryElement;
    let localProvider = false;
    function visit(node) {
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        const tag = node.tagName.getText(tree);
        const imported = imports.get(tag);
        if (imported === 'AppearanceProvider') localProvider = true;
        else if (contracts.has(imported)) libraryElement ??= node;
        for (const attribute of node.attributes.properties) {
          if (!ts.isJsxAttribute(attribute)) continue;
          const name = attribute.name.getText(tree);
          if (name.startsWith('data-wcl-'))
            add(
              'private-attribute',
              attribute.getStart(tree),
              'Consumer writes a private data-wcl attribute. This does not reproduce provider context or component behavior.',
            );
          if (
            contracts.has(imported) &&
            ['label', 'ariaLabel'].includes(name) &&
            attribute.initializer &&
            ts.isStringLiteral(attribute.initializer) &&
            !attribute.initializer.text.trim()
          ) {
            add(
              'empty-label',
              attribute.getStart(tree),
              `${imported} has an empty literal ${name}. Supply meaningful text.`,
            );
          }
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(tree);
    if (libraryElement && !localProvider)
      add(
        'provider-unverified',
        libraryElement.getStart(tree),
        'No AppearanceProvider JSX appears in this file. Verify an ancestor supplies it. This is not proof of a missing provider.',
      );
  }
  return {
    findings,
    coverage: `${jsxFiles} JSX files; named imports, literal private hooks and labels, file-local provider presence only.`,
    unchecked:
      'Intent, focus, ancestor coverage, dynamic/spread props, aliases through variables, wrappers, import shadowing and application behavior. No findings does not establish correctness.',
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [command, ...args] = process.argv.slice(2);
    if (command === 'choose') {
      const result = choose(JSON.parse(args[0] ?? '{}'));
      if (args.includes('--fragment')) {
        if (result.status !== 'selected')
          throw new Error('Resolve component choice before requesting a fragment.');
        process.stdout.write(fragment(result.export));
      } else print(result);
    } else if (command === 'audit' && args.length)
      print(audit(args.map((filename) => path.resolve(filename))));
    else
      throw new Error(
        'Usage: node probe.mjs choose JSON [--fragment] | audit file.tsx [file.css ...]',
      );
  } catch (error) {
    print({status: 'error', message: error.message});
    process.exitCode = 1;
  }
}
