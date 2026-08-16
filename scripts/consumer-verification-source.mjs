export function createConsumerVerificationSource(packageName) {
  return `
import React from 'react';
import {JSDOM} from 'jsdom';
import {renderToString} from 'react-dom/server';
import {
  AppearanceProvider,
  Divider,
  InlineGroup,
  ResponsiveGrid,
  ScrollRegion,
  Section,
  Stack,
  Surface,
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
    ),
  ),
);
const serverMarkup = renderToString(view);
const dom = new JSDOM('<div id="root">' + serverMarkup + '</div>');
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Node = dom.window.Node;
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
`;
}
