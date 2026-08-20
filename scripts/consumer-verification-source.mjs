export function createConsumerVerificationSource(packageName) {
  return `
import React from 'react';
import {JSDOM} from 'jsdom';
import {renderToString} from 'react-dom/server';
import {
  AppearanceProvider,
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  ComboBox,
  DateField,
  DatePicker,
  DateRangePicker,
  Divider,
  Field,
  FieldGroup,
  FormSection,
  IconButton,
  InlineGroup,
  Link,
  NumberField,
  RadioGroup,
  RangeSlider,
  ResponsiveGrid,
  ScrollRegion,
  SearchField,
  Section,
  Select,
  SegmentedControl,
  Slider,
  Stack,
  Surface,
  Switch,
  TextArea,
  TextField,
  TimeField,
  ToggleButton,
  Toolbar,
} from '${packageName}';

const manifest = (await import('${packageName}/manifest.json', {with: {type: 'json'}})).default;
if (manifest.exports[0]?.name !== 'AppearanceProvider') {
  throw new Error('Generated manifest is not available from its public subpath.');
}
for (const subpath of ['styles.css', 'agent-index.md']) {
  if (!import.meta.resolve('${packageName}/' + subpath)) {
    throw new Error('Unable to resolve public subpath ' + subpath + '.');
  }
}
try {
  await import('${packageName}/appearance/accent.js');
  throw new Error('An internal module was importable through the package boundary.');
} catch (error) {
  if (error?.code !== 'ERR_PACKAGE_PATH_NOT_EXPORTED') throw error;
}

const consoleMessages = [];
const recoverableErrors = [];
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
console.error = (...messages) => consoleMessages.push(messages);
console.warn = (...messages) => consoleMessages.push(messages);

const view = React.createElement(
  AppearanceProvider,
  {appearance: 'dark', accent: '#2474ff'},
  React.createElement(
    Surface,
    {variant: 'raised'},
    React.createElement(
      Section,
      {title: 'Thermal envelope'},
      React.createElement(
        Stack,
        {gap: 'regular'},
        React.createElement(
          ResponsiveGrid,
          {minimumItemWidth: 'compact', equalItems: true},
          React.createElement(
            Stack,
            {gap: 'tight'},
            React.createElement('strong', null, 'Solver'),
            React.createElement('span', null, 'Adaptive mesh'),
          ),
          React.createElement(
            Stack,
            {gap: 'tight'},
            React.createElement(
              InlineGroup,
              {equalItems: true},
              React.createElement('span', null, 'Ready'),
              React.createElement('span', null, 'Review'),
            ),
            React.createElement(Divider),
            React.createElement(
              ScrollRegion,
              {label: 'Run history', size: 'compact'},
              React.createElement('span', null, 'Iteration 0284'),
            ),
          ),
        ),
        React.createElement(Link, {href: '/runs/0284'}, 'Open run'),
        React.createElement('form', {id: 'packed-choice-form'}),
        React.createElement(
          FormSection,
          {title: 'Solver setup'},
          React.createElement(
            FieldGroup,
            {legend: 'Boundary inputs'},
            React.createElement(TextField, {
              label: 'Run name',
              description: 'Visible in reports.',
              defaultValue: 'North chamber',
            }),
            React.createElement(NumberField, {
              label: 'Tolerance',
              locale: 'en-US',
              defaultValue: 0.0025,
              step: 0.0005,
            }),
            React.createElement(SearchField, {
              label: 'Search runs',
              clearLabel: 'Clear query',
              defaultValue: 'thermal',
            }),
            React.createElement(TextArea, {
              label: 'Notes',
              defaultValue: 'Review boundary conditions.',
              rows: 3,
            }),
            React.createElement(
              Field,
              {label: 'Queue', description: 'Choose compute priority.'},
              (controlProps) => React.createElement(
                'select',
                controlProps,
                React.createElement('option', {value: 'standard'}, 'Standard'),
              ),
            ),
          ),
        ),
        React.createElement(
          ButtonGroup,
          {label: 'Profile actions', equalItems: true},
          React.createElement(Button, {variant: 'secondary'}, 'Review conditions'),
          React.createElement(Button, {variant: 'primary', type: 'submit'}, 'Run profile'),
        ),
        React.createElement(Checkbox, {
          defaultSelected: true,
          form: 'packed-choice-form',
          label: 'Include mesh',
          name: 'features',
          value: 'mesh',
        }),
        React.createElement(CheckboxGroup, {
          defaultValue: ['thermal'],
          form: 'packed-choice-form',
          label: 'Result layers',
          name: 'layers',
          options: [
            {label: 'Thermal', value: 'thermal'},
            {label: 'Pressure', value: 'pressure'},
          ],
        }),
        React.createElement(RadioGroup, {
          defaultValue: 'balanced',
          form: 'packed-choice-form',
          label: 'Run mode',
          name: 'mode',
          options: [
            {label: 'Conservative', value: 'conservative'},
            {label: 'Balanced', value: 'balanced'},
          ],
        }),
        React.createElement(Switch, {
          defaultSelected: true,
          form: 'packed-choice-form',
          label: 'Pin result',
          name: 'pin',
          value: 'yes',
        }),
        React.createElement(SegmentedControl, {
          defaultValue: 'balanced',
          form: 'packed-choice-form',
          label: 'Display density',
          name: 'density',
          options: [
            {label: 'Compact', value: 'compact'},
            {label: 'Balanced', value: 'balanced'},
          ],
        }),
        React.createElement(Select, {
          defaultValue: 'balanced',
          emptyMessage: 'No modes',
          form: 'packed-choice-form',
          label: 'Bounded mode',
          name: 'select-mode',
          options: [
            {label: 'Conservative', value: 'conservative'},
            {label: 'Balanced', value: 'balanced'},
          ],
        }),
        React.createElement(ComboBox, {
          defaultValue: 'balanced',
          emptyMessage: 'No matching modes',
          form: 'packed-choice-form',
          label: 'Filter mode',
          name: 'combo-mode',
          options: [
            {label: 'Conservative', value: 'conservative'},
            {label: 'Balanced', value: 'balanced'},
          ],
        }),
        React.createElement(DateField, {
          calendar: 'gregory',
          defaultValue: {year: 2026, month: 8, day: 20},
          form: 'packed-choice-form',
          label: 'Run date',
          locale: 'en-US',
          name: 'run-date',
        }),
        React.createElement(TimeField, {
          defaultValue: {hour: 14, minute: 30, second: 0},
          form: 'packed-choice-form',
          granularity: 'minute',
          hourCycle: 24,
          label: 'Run time',
          locale: 'en-US',
          name: 'run-time',
        }),
        React.createElement(DatePicker, {
          calendar: 'japanese',
          calendarButtonLabel: 'Choose review date',
          defaultValue: {year: 2026, month: 8, day: 21},
          form: 'packed-choice-form',
          label: 'Review date',
          locale: 'ja-JP',
          name: 'review-date',
          placeholderValue: {year: 2026, month: 8, day: 20},
        }),
        React.createElement(DateRangePicker, {
          calendar: 'gregory',
          calendarButtonLabel: 'Choose review window',
          defaultValue: {
            start: {year: 2026, month: 8, day: 20},
            end: {year: 2026, month: 8, day: 24},
          },
          form: 'packed-choice-form',
          label: 'Review dates',
          locale: 'en-US',
          names: ['review-start', 'review-end'],
          placeholderValue: {year: 2026, month: 8, day: 20},
        }),
        React.createElement(Slider, {
          defaultValue: 0.4,
          form: 'packed-choice-form',
          formatOptions: {style: 'percent'},
          label: 'Confidence',
          locale: 'en-US',
          maxValue: 1,
          minValue: 0,
          name: 'confidence',
          step: 0.05,
        }),
        React.createElement(RangeSlider, {
          defaultValue: [20, 80],
          form: 'packed-choice-form',
          label: 'Review window',
          locale: 'en-US',
          maxValue: 100,
          minValue: 0,
          names: ['window-start', 'window-end'],
          step: 5,
          thumbLabels: ['Window start', 'Window end'],
        }),
        React.createElement(
          Toolbar,
          {label: 'Inspector commands'},
          React.createElement(
            IconButton,
            {label: 'More actions', variant: 'quiet'},
            React.createElement('span', {'aria-hidden': true}, '•••'),
          ),
          React.createElement(
            ToggleButton,
            {defaultSelected: true, variant: 'quiet'},
            'Pin inspector',
          ),
        ),
      ),
    ),
  ),
);
const serverMarkup = renderToString(view);
const dom = new JSDOM('<div id="root">' + serverMarkup + '</div>');
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.Element = dom.window.Element;
globalThis.Event = dom.window.Event;
globalThis.FocusEvent = dom.window.FocusEvent;
globalThis.HTMLButtonElement = dom.window.HTMLButtonElement;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.HTMLInputElement = dom.window.HTMLInputElement;
globalThis.HTMLSelectElement = dom.window.HTMLSelectElement;
globalThis.HTMLTemplateElement = dom.window.HTMLTemplateElement;
globalThis.HTMLTextAreaElement = dom.window.HTMLTextAreaElement;
globalThis.InputEvent = dom.window.InputEvent;
globalThis.KeyboardEvent = dom.window.KeyboardEvent;
globalThis.MouseEvent = dom.window.MouseEvent;
globalThis.Node = dom.window.Node;
globalThis.NodeFilter = dom.window.NodeFilter;
globalThis.SVGElement = dom.window.SVGElement;
Object.defineProperty(globalThis, 'navigator', {value: dom.window.navigator, configurable: true});

// React Aria installs these browser-only template hooks when its client bundle is evaluated.
// This single-process SSR fixture imports the package before JSDOM exists, so reproduce that
// client initialization before hydration rather than testing a module lifecycle browsers cannot have.
Object.defineProperties(globalThis.HTMLTemplateElement.prototype, {
  firstChild: {
    configurable: true,
    enumerable: true,
    get() { return this.content.firstChild; },
  },
  appendChild: {
    configurable: true,
    enumerable: true,
    value(node) { return this.content.appendChild(node); },
  },
  removeChild: {
    configurable: true,
    enumerable: true,
    value(node) { return this.content.removeChild(node); },
  },
  insertBefore: {
    configurable: true,
    enumerable: true,
    value(node, child) { return this.content.insertBefore(node, child); },
  },
});

const {hydrateRoot} = await import('react-dom/client');
hydrateRoot(document.getElementById('root'), view, {
  onRecoverableError(error) { recoverableErrors.push(error); },
});
await new Promise((resolve) => setTimeout(resolve, 25));
console.error = originalConsoleError;
console.warn = originalConsoleWarn;

if (consoleMessages.length > 0 || recoverableErrors.length > 0) {
  const details = [
    ...consoleMessages.map((messages) => messages.map(String).join(' ')),
    ...recoverableErrors.map(String),
  ].join('\\n');
  throw new Error('SSR or hydration emitted warnings or recoverable errors.\\n' + details);
}
if (!document.querySelector('[data-wcl-responsive-grid]')?.textContent?.includes('Adaptive mesh')) {
  throw new Error('Packed layout primitives did not hydrate their server-rendered content.');
}
if (document.querySelector('[aria-label="Run history"]')?.getAttribute('tabindex') !== '0') {
  throw new Error('Packed scroll region is not a labeled keyboard focus target.');
}
if (!document.querySelector('[data-wcl-toolbar]')) {
  throw new Error('Packed toolbar did not render its public marker.');
}
if (document.querySelector('[data-wcl-toggle-button]')?.getAttribute('aria-pressed') !== 'true') {
  throw new Error('Packed toggle button did not preserve selected semantics.');
}
if (document.querySelector('[data-wcl-button][type="submit"]')?.textContent !== 'Run profile') {
  throw new Error('Packed button did not preserve explicit native form behavior.');
}
if (!document.querySelector('[data-wcl-number-field]')) {
  throw new Error('Packed number field did not render its private localized behavior composition.');
}
if (!document.querySelector('[data-wcl-checkbox] input:checked')) {
  throw new Error('Packed checkbox did not preserve native selected state.');
}
if (document.querySelectorAll('[data-wcl-checkbox-group] input[type="checkbox"]').length !== 2) {
  throw new Error('Packed checkbox group did not render its native option inputs.');
}
if (!document.querySelector('[data-wcl-radio-group] input[value="balanced"]:checked')) {
  throw new Error('Packed radio group did not preserve exclusive selection.');
}
if (document.querySelector('[data-wcl-switch] input')?.getAttribute('role') !== 'switch') {
  throw new Error('Packed switch did not preserve switch semantics.');
}
if (!document.querySelector('[data-wcl-segmented-control] input[value="balanced"]:checked')) {
  throw new Error('Packed segmented control did not preserve exclusive selection.');
}
if (!document.querySelector('[data-wcl-selection-field]')) {
  throw new Error('Packed selection family did not render its private collection composition.');
}
if (document.querySelector('[data-wcl-combo-box] input')?.getAttribute('role') !== 'combobox') {
  throw new Error('Packed combo box did not preserve editable autocomplete semantics.');
}
if (document.querySelectorAll('[data-wcl-range-field] input[type="range"]').length !== 3) {
  throw new Error('Packed range family did not preserve one single and two paired range inputs.');
}
if (document.querySelectorAll('[data-wcl-date-segment]').length < 12) {
  throw new Error('Packed date and time family did not render localized segmented controls.');
}
const packedChoiceForm = document.getElementById('packed-choice-form');
const packedChoiceEntries = [...new dom.window.FormData(packedChoiceForm).entries()];
if (JSON.stringify(packedChoiceEntries) !== JSON.stringify([
  ['features', 'mesh'],
  ['layers', 'thermal'],
  ['mode', 'balanced'],
  ['pin', 'yes'],
  ['density', 'balanced'],
  ['select-mode', 'balanced'],
  ['combo-mode', 'balanced'],
  ['run-date', '2026-08-20'],
  ['run-time', '14:30:00'],
  ['review-date', '2026-08-21'],
  ['review-start', '2026-08-20'],
  ['review-end', '2026-08-24'],
  ['confidence', '0.4'],
  ['window-start', '20'],
  ['window-end', '80'],
])) {
  throw new Error('Packed choices did not preserve external native form association.');
}
const packedDateInput = document.querySelector('input[name="run-date"]');
const packedTimeInput = document.querySelector('input[name="run-time"]');
const packedDateDay = packedDateInput
  ?.closest('[data-wcl-date-field]')
  ?.querySelector('[data-wcl-date-segment][data-type="day"]');
const packedTimeMinute = packedTimeInput
  ?.closest('[data-wcl-time-field]')
  ?.querySelector('[data-wcl-date-segment][data-type="minute"]');
for (const segment of [packedDateDay, packedTimeMinute]) {
  segment?.dispatchEvent(
    new dom.window.KeyboardEvent('keydown', {bubbles: true, key: 'ArrowUp'}),
  );
}
await new Promise((resolve) => setTimeout(resolve, 25));
const changedDateTimeEntries = [...new dom.window.FormData(packedChoiceForm).entries()].filter(
  ([name]) => name === 'run-date' || name === 'run-time',
);
if (JSON.stringify(changedDateTimeEntries) !== JSON.stringify([
  ['run-date', '2026-08-21'],
  ['run-time', '14:31:00'],
])) {
  throw new Error('Packed date and time fields did not accept segmented changes.');
}
const packedRangeInputs = [...document.querySelectorAll(
  '[data-wcl-range-field] input[type="range"]',
)];
for (const [input, value] of [
  [packedRangeInputs[0], '0.7'],
  [packedRangeInputs[1], '35'],
]) {
  input.value = value;
  input.dispatchEvent(new dom.window.Event('input', {bubbles: true}));
  input.dispatchEvent(new dom.window.Event('change', {bubbles: true}));
}
await new Promise((resolve) => setTimeout(resolve, 25));
const changedRangeEntries = [...new dom.window.FormData(packedChoiceForm).entries()].slice(-3);
if (JSON.stringify(changedRangeEntries) !== JSON.stringify([
  ['confidence', '0.7'],
  ['window-start', '35'],
  ['window-end', '80'],
])) {
  throw new Error('Packed ranges did not accept stepped changes.');
}
packedChoiceForm.reset();
await new Promise((resolve) => setTimeout(resolve, 25));
const resetDateTimeEntries = [...new dom.window.FormData(packedChoiceForm).entries()].filter(
  ([name]) => name === 'run-date' || name === 'run-time',
);
if (JSON.stringify(resetDateTimeEntries) !== JSON.stringify([
  ['run-date', '2026-08-20'],
  ['run-time', '14:30:00'],
])) {
  throw new Error('Packed date and time fields did not restore defaults on form reset.');
}
const resetRangeEntries = [...new dom.window.FormData(packedChoiceForm).entries()].slice(-3);
if (JSON.stringify(resetRangeEntries) !== JSON.stringify([
  ['confidence', '0.4'],
  ['window-start', '20'],
  ['window-end', '80'],
])) {
  throw new Error('Packed ranges did not restore defaults on form reset.');
}
const runNameInput = document.querySelector('input[value="North chamber"]');
if (!runNameInput?.getAttribute('aria-describedby')) {
  throw new Error('Packed text field did not preserve its generated description relationship.');
}
`;
}
