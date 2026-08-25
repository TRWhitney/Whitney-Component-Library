import {readFile} from 'node:fs/promises';

import {describe, expect, it} from 'vitest';

describe('chart renderer isolation proof', () => {
  it('bundles an ordinary public import and rejects chart geometry modules', async () => {
    const source = await readFile('scripts/verify-chart-isolation.mjs', 'utf8');
    const entry = await readFile('scripts/fixtures/ordinary-component-entry.js', 'utf8');

    expect(entry).toContain('export {Button}');
    expect(entry).toContain("from '../../dist/index.js'");
    expect(source).toContain("id.includes('/dist/charts/')");
    expect(source).toMatch(/node_modules\\\/d3-/);
    expect(source).toContain('write: false');
  });
});
