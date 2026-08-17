export function createConsumerVerificationSource(packageName) {
  return `
import React from 'react';
import {JSDOM} from 'jsdom';
import {renderToString} from 'react-dom/server';
import {
  AppearanceProvider,
  Button,
  ButtonGroup,
  Divider,
  Field,
  FieldGroup,
  FormSection,
  IconButton,
  InlineGroup,
  Link,
  NumberField,
  ResponsiveGrid,
  ScrollRegion,
  SearchField,
  Section,
  Stack,
  Surface,
  TextArea,
  TextField,
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
globalThis.HTMLTextAreaElement = dom.window.HTMLTextAreaElement;
globalThis.InputEvent = dom.window.InputEvent;
globalThis.KeyboardEvent = dom.window.KeyboardEvent;
globalThis.MouseEvent = dom.window.MouseEvent;
globalThis.Node = dom.window.Node;
globalThis.NodeFilter = dom.window.NodeFilter;
globalThis.SVGElement = dom.window.SVGElement;
Object.defineProperty(globalThis, 'navigator', {value: dom.window.navigator, configurable: true});

const {hydrateRoot} = await import('react-dom/client');
hydrateRoot(document.getElementById('root'), view, {
  onRecoverableError(error) { recoverableErrors.push(error); },
});
await new Promise((resolve) => setTimeout(resolve, 25));
console.error = originalConsoleError;
console.warn = originalConsoleWarn;

if (consoleMessages.length > 0 || recoverableErrors.length > 0) {
  throw new Error('SSR or hydration emitted warnings or recoverable errors.');
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
const runNameInput = document.querySelector('input[value="North chamber"]');
if (!runNameInput?.getAttribute('aria-describedby')) {
  throw new Error('Packed text field did not preserve its generated description relationship.');
}
`;
}
