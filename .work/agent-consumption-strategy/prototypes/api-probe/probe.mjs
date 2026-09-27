// Run from repository root: node .work/agent-consumption-strategy/prototypes/api-probe/probe.mjs
/* global window, document */
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';
import {createServer} from 'vite';
import {chromium} from 'playwright';

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, '../../../..');
const cases = [];
function check(name, jsx, accepted) {
  cases.push({name, jsx, accepted});
}
for (const [name, tag, props] of [
  ['layout', 'Stack', 'children="x"'],
  ['field', 'TextField', 'label="x"'],
  ['action', 'Button', 'children="x"'],
  ['choice', 'Checkbox', 'label="x"'],
]) {
  for (const [prop, value] of [
    ['id', '"consumer"'],
    ['className', '"consumer"'],
    ['style', '{{color: "red"}}'],
    ['ref', '{createRef<any>()}'],
    ['onBlur', '{() => {}}'],
    ['onPointerDown', '{() => {}}'],
    ['onKeyDown', '{() => {}}'],
  ])
    check(`${name}: ${prop}`, `<${tag} ${props} ${prop}=${value} />`, false);
  for (const prop of ['data-consumer', 'aria-description'])
    check(`${name}: ${prop}`, `<${tag} ${props} ${prop}="consumer" />`, true);
}
check('action: onClick', '<Button onClick={() => {}}>x</Button>', false);
check('action: onPress', '<Button onPress={() => {}}>x</Button>', true);
check(
  'action: typed press event unavailable',
  '<Button onPress={event => event.preventDefault()}>x</Button>',
  false,
);
check(
  'field: event-shaped onChange',
  '<TextField label="x" onChange={event => event.target.value} />',
  false,
);
check(
  'field: value onChange',
  '<TextField label="x" onChange={value => value.toUpperCase()} />',
  true,
);
check(
  'choice: event-shaped onChange',
  '<Checkbox label="x" onChange={event => event.target.checked} />',
  false,
);
check(
  'choice: boolean onChange',
  '<Checkbox label="x" onChange={value => { const checked: boolean = value; }} />',
  true,
);
check('field: disabled', '<TextField label="x" disabled />', false);
check('field: type', '<TextField label="x" type="email" />', false);
check(
  'field: native form attributes',
  '<TextField label="x" name="x" form="f" inputType="email" autoComplete="email" minLength={2} maxLength={80} pattern=".+" isRequired />',
  true,
);
check(
  'action: native form attributes',
  '<Button type="submit" form="f" formNoValidate name="intent" value="save">x</Button>',
  true,
);
check(
  'choice: native form attributes',
  '<Checkbox label="x" name="choice" form="f" value="yes" defaultSelected />',
  true,
);
check(
  'layout: native wrapper composition',
  '<section id="x" className="consumer"><Stack><span>x</span></Stack></section>',
  true,
);
check(
  'field: custom native control via Field',
  '<Field label="x">{controlProps => <input {...controlProps} ref={createRef<HTMLInputElement>()} data-consumer="x" onBlur={() => {}} />}</Field>',
  true,
);
check(
  'choice: mapped segmented options',
  '<SegmentedControl label="x" options={["a", "b"].map(value => ({value, label: value}))} />',
  false,
);
check(
  'choice: literal segmented options',
  '<SegmentedControl label="x" options={[{value: "a", label: "A"}, {value: "b", label: "B"}]} />',
  true,
);
check(
  'overlay: native trigger compiles',
  '<Dialog title="x" description="x" closeLabel="Close" trigger={<button>x</button>}>x</Dialog>',
  true,
);
const virtualPath = path.join(dir, '__virtual_cases.tsx');
const source = [
  'import {createRef} from "react";',
  'import {Stack, TextField, Button, Checkbox, Dialog, Field, SegmentedControl} from "@trwhitney/component-library";',
  ...cases.map((entry, index) => `const c${index} = ${entry.jsx};`),
].join('\n');
const options = {
  strict: true,
  noEmit: true,
  skipLibCheck: true,
  exactOptionalPropertyTypes: true,
  jsx: ts.JsxEmit.ReactJSX,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.NodeNext,
  moduleResolution: ts.ModuleResolutionKind.NodeNext,
};
const host = ts.createCompilerHost(options);
const getSourceFile = host.getSourceFile.bind(host);
host.getSourceFile = (name, languageVersion, onError, shouldCreateNewSourceFile) =>
  name === virtualPath
    ? ts.createSourceFile(name, source, languageVersion, true, ts.ScriptKind.TSX)
    : getSourceFile(name, languageVersion, onError, shouldCreateNewSourceFile);
const program = ts.createProgram([virtualPath], options, host);
const diagnostics = ts.getPreEmitDiagnostics(program);
assert(
  diagnostics.every((d) => d.file?.fileName === virtualPath),
  'No unrelated declaration errors',
);
const types = cases.map((entry, index) => {
  const errors = diagnostics
    .filter((d) => d.file.getLineAndCharacterOfPosition(d.start).line === index + 2)
    .map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'));
  assert.equal(errors.length === 0, entry.accepted, entry.name + ': ' + errors.join('\n'));
  return {...entry, errors};
});

const server = await createServer({
  configFile: false,
  root: dir,
  cacheDir: path.join(dir, '.vite-cache'),
  resolve: {
    alias: [
      {
        find: '@trwhitney/component-library/styles.css',
        replacement: path.join(root, 'dist/styles.css'),
      },
      {find: '@trwhitney/component-library', replacement: path.join(root, 'dist/index.js')},
    ],
  },
  server: {host: '127.0.0.1', port: 0, fs: {allow: [root]}},
});
let browser;
try {
  await server.listen();
  const port = server.httpServer.address().port;
  browser = await chromium.launch({headless: true});
  const page = await browser.newPage({hasTouch: true});
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${port}`);
  const button = page.getByRole('button', {name: 'Library action'});
  await button.click();
  await button.press('Enter');
  await button.press('Space');
  await button.tap();
  const native = page.getByRole('button', {name: 'Native action'});
  await native.click();
  await native.press('Enter');
  await native.press('Space');
  await native.tap();
  await page.getByRole('textbox', {name: 'Probe text'}).fill('updated');
  await page.getByRole('checkbox', {name: 'Probe choice'}).press('Space');
  const runtime = await page.evaluate(() => ({
    presses: window.probe.presses,
    nativeClicks: window.probe.nativeClicks,
    nativePointerDown: window.probe.nativePointerDown,
    nativeKeyDown: window.probe.nativeKeyDown,
    changes: window.probe.changes,
    choices: window.probe.choices,
    customFieldRef: window.probe.customFieldRef.current?.tagName,
    customFieldAttribute: document
      .querySelector('[data-native-field]')
      ?.getAttribute('data-native-field'),
    refs: Object.fromEntries(
      Object.entries(window.probe.refs).map(([name, ref]) => [
        name,
        ref.current === null ? null : ref.current.tagName,
      ]),
    ),
    consumerDataAttributes: document.querySelectorAll('[data-consumer]').length,
    consumerAriaDescriptions: document.querySelectorAll('[aria-description]').length,
    consumerIds: document.querySelectorAll('[id^="consumer-"]').length,
    consumerClasses: document.querySelectorAll('[class^="consumer-"]').length,
    consumerStyles: document.querySelectorAll('[style*="7px"]').length,
    nativeInput: {
      name: document.querySelector('input[name="probe-text"]').name,
      autocomplete: document.querySelector('input[name="probe-text"]').autocomplete,
    },
  }));
  assert.deepEqual(runtime.presses, ['mouse', 'keyboard', 'keyboard', 'touch']);
  assert.equal(runtime.nativeClicks, 4);
  assert.equal(runtime.nativePointerDown, 2);
  assert.equal(runtime.nativeKeyDown, 2);
  assert.equal(runtime.customFieldRef, 'INPUT');
  assert.equal(runtime.customFieldAttribute, 'yes');
  assert.deepEqual(runtime.changes, [{type: 'string', value: 'updated'}]);
  assert.deepEqual(runtime.choices, [{type: 'boolean', value: true}]);
  for (const key of [
    'consumerDataAttributes',
    'consumerAriaDescriptions',
    'consumerIds',
    'consumerClasses',
    'consumerStyles',
  ])
    assert.equal(runtime[key], 0, key);
  assert.deepEqual(runtime.refs, {stack: null, field: null, button: null, choice: null});
  assert.equal(errors.length, 0, errors.join('\n'));
  await page.goto(`http://127.0.0.1:${port}/?trigger=custom`);
  await page.getByRole('button', {name: 'Open probe dialog'}).click();
  await page.getByRole('dialog', {name: 'Probe dialog'}).waitFor();
  const customTriggerOpens = await page.getByRole('dialog', {name: 'Probe dialog'}).isVisible();
  await page.goto(`http://127.0.0.1:${port}/?trigger=native`);
  const nativeTriggerError = await page.getByRole('alert').textContent();
  assert.equal(nativeTriggerError, 'Dialog trigger must render exactly one Button or IconButton.');
  const overlays = {customTriggerOpens, nativeTriggerError};
  const result = {
    date: new Date().toISOString(),
    typescript: ts.version,
    typeCaseCount: types.length,
    types,
    runtime,
    overlays,
    browserErrors: errors,
  };
  writeFileSync(path.join(dir, 'results.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(
    JSON.stringify(
      {typeCaseCount: types.length, runtime, overlays, browserErrors: errors},
      null,
      2,
    ),
  );
} finally {
  await browser?.close();
  await server.close();
}
