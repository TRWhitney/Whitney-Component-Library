import {readFile} from 'node:fs/promises';
import {expect, it} from 'vitest';
it('gives actionable tree rows a pointer cursor and disabled rows their own cursor', async () => {
  const css = await readFile('src/styles.css', 'utf8');
  expect(/\[data-wcl-tree-item\][^{]*\{[^}]*cursor:\s*pointer/.test(css)).toBe(true);
  expect(/\[data-wcl-tree-item\]\[data-disabled\]\s*\{[^}]*cursor:\s*not-allowed/.test(css)).toBe(
    true,
  );
});
it('curves both lower corner feedback borders on the final table row', async () => {
  const css = await readFile('src/styles.css', 'utf8');
  expect(
    /\[data-wcl-table-row\]:last-child\s+\[data-wcl-table-cell\]:first-child::after\s*\{[^}]*border-end-start-radius/.test(
      css,
    ),
  ).toBe(true);
  expect(
    /\[data-wcl-table-row\]:last-child\s+\[data-wcl-table-cell\]:last-child::after\s*\{[^}]*border-end-end-radius/.test(
      css,
    ),
  ).toBe(true);
});
