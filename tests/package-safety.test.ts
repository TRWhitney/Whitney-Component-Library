import {describe, expect, it} from 'vitest';

// The package-safety utility is Node-only repository tooling, not part of the public library.
import {
  findBrowserBundleHazards,
  findNodeOnlyReferences,
  findStyleImports,
} from '../scripts/package-safety.mjs';

describe('browser package safety', () => {
  it.each([
    ["import {execFile} from 'node:child_process';", 'node:child_process'],
    ["import {execFile} from 'child_process';", 'child_process'],
    ["export {promisify} from 'util';", 'util'],
    ["const module = await import('module');", 'module'],
    ['const module = await import(`node:module`);', 'node:module'],
    ["const fs = await import('node:fs', {with: {type: 'json'}});", 'node:fs'],
    ['const value = process.env.VALUE;', 'process'],
    ['const runtime = process;', 'process'],
    ['const value = process?.env.VALUE;', 'process'],
    ['const {env} = process;', 'process'],
    ['const value = globalThis.process;', 'process'],
    ["const value = globalThis['process'];", 'process'],
    ['const bytes = window.Buffer.from(value);', 'Buffer'],
    ['const value = `${process.env.VALUE}`;', 'process'],
    ['const bytes = Buffer.from(value);', 'Buffer'],
    ['global.value = true;', 'global'],
    ['const root = global;', 'global'],
    ['module.exports = value;', 'module'],
    ["module['exports'] = value;", 'module'],
    ['exports.value = true;', 'exports'],
    ['const load = require;', 'require'],
    ['setImmediate(run);', 'setImmediate'],
    ['clearImmediate(handle);', 'clearImmediate'],
  ])('detects %s', (source, expected) => {
    expect(findNodeOnlyReferences(source)).toContain(expected);
  });

  it('detects Node imports with comments before their specifiers', () => {
    expect(findNodeOnlyReferences("import /* bundler hint */ 'node:fs';")).toContain('node:fs');
  });

  it.each([
    "import './styles.css';",
    "import styles from './styles.css';",
    "const styles = await import('./styles.css');",
  ])('detects a JavaScript stylesheet dependency in %s', (source) => {
    expect(findStyleImports(source)).toEqual(['./styles.css']);
  });

  it('does not reject ordinary browser ESM', () => {
    expect(
      findNodeOnlyReferences(
        "import {jsx} from 'react/jsx-runtime'; export const value = jsx('p', {});",
      ),
    ).toEqual([]);
  });

  it('reports browser bundle externalization hazards without interpreting dependency fallbacks', () => {
    expect(findBrowserBundleHazards("import runtime from 'node:module';")).toEqual(['node:module']);
    expect(findBrowserBundleHazards('const runtime = "__vite-browser-external";')).toEqual([
      '__vite-browser-external',
    ]);
    expect(
      findBrowserBundleHazards(
        "const schedule = typeof setImmediate !== 'undefined' ? setImmediate : null;",
      ),
    ).toEqual([]);
  });

  it('does not confuse object keys or string content with Node globals', () => {
    expect(
      findNodeOnlyReferences(
        "export const manifest = {exports: []}; const message = 'process.env is unavailable';",
      ),
    ).toEqual([]);
  });

  it('does not confuse lexically bound names with Node globals', () => {
    expect(
      findNodeOnlyReferences(`
        const process = applicationProcess;
        function encode(Buffer) { return Buffer.from('value'); }
        process.run(encode);
      `),
    ).toEqual([]);
  });
});
