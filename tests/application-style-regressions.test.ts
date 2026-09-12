import {readFile} from 'node:fs/promises';
import {expect, it} from 'vitest';
it('gives actionable tree rows a pointer cursor and disabled rows their own cursor', async () => {
  const css = await readFile('src/styles.css', 'utf8');
  expect(/\[data-wcl-tree-item\][^{]*\{[^}]*cursor:\s*pointer/.test(css)).toBe(true);
  expect(/\[data-wcl-tree-item\]\[data-disabled\]\s*\{[^}]*cursor:\s*not-allowed/.test(css)).toBe(
    true,
  );
});
