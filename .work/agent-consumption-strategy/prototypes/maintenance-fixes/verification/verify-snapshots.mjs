// node verify-snapshots.mjs <existing-consumer-node_modules> <snapshot> [<snapshot> ...]
// Copies snapshots unchanged into this prototype directory and checks common collection CRUD roles.
import assert from 'node:assert/strict';
import {cp, mkdir, readFile, readdir, rm, symlink, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import {createServer} from 'vite';
import {waitForFocus, assertTextContrast} from './testing.mjs';

const [dependencies, ...snapshots] = process.argv.slice(2).map((path) => resolve(path));
assert(
  dependencies && snapshots.length,
  'Provide existing consumer node_modules and snapshot paths',
);
const directory = dirname(fileURLToPath(import.meta.url));
const results = [];
const browser = await chromium.launch();
async function hashes(root) {
  const output = {};
  for (const path of ['index.html', 'src']) {
    const visit = async (relative) => {
      if (relative === 'src' || !relative.includes('.')) {
        for (const entry of await readdir(join(root, relative))) await visit(join(relative, entry));
      } else
        output[relative] = createHash('sha256')
          .update(await readFile(join(root, relative)))
          .digest('hex');
    };
    await visit(path);
  }
  return output;
}
try {
  for (const [index, snapshot] of snapshots.entries()) {
    const root = join(directory, `.runtime-${index}`);
    const before = await hashes(snapshot);
    await mkdir(root, {recursive: true});
    for (const path of ['index.html', 'src', 'package.json'])
      await cp(join(snapshot, path), join(root, path), {recursive: true});
    await symlink(dependencies, join(root, 'node_modules'), 'dir');
    const server = await createServer({
      root,
      configFile: false,
      cacheDir: join(root, '.vite'),
      server: {
        host: '127.0.0.1',
        port: 4493 + index,
        strictPort: true,
        fs: {allow: [root, dependencies]},
      },
      logLevel: 'error',
    });
    const record = {snapshot, sourceHashes: before, scenarios: []};
    results.push(record);
    try {
      await server.listen();
      for (const width of [390, 1280]) {
        for (const theme of ['initial', 'alternate']) {
          const page = await browser.newPage({viewport: {width, height: 900}});
          try {
            await page.goto(`http://127.0.0.1:${4493 + index}`);
            const articles = page.getByRole('article');
            await articles.first().waitFor();
            const toggle = page.getByRole('checkbox');
            if (theme === 'alternate') {
              if (!(await toggle.count())) continue;
              await toggle.focus();
              await page.keyboard.press('Space');
              assert.equal(await toggle.isChecked(), false);
            }
            const observed = {width, theme, contrastMinimum: Infinity, focusChecks: 0};
            const contrast = async (root) => {
              const samples = await assertTextContrast(root);
              observed.contrastMinimum = Math.min(
                observed.contrastMinimum,
                ...samples.map((sample) => sample.ratio),
              );
            };
            const focused = async (target) => {
              await waitForFocus(target);
              observed.focusChecks++;
            };
            const first = articles.first();
            const action = (root, name) => root.getByRole('button', {name, exact: true});
            const modal = page.getByRole('dialog');
            const field = modal.getByRole('textbox');
            await contrast(page.locator('main'));
            await action(first, 'Edit').click();
            await focused(field);
            await contrast(modal);
            await field.fill(' ');
            await action(modal, 'Save').click();
            await contrast(modal);
            await field.fill(
              'An unusually long record name for independent verification of focus after a data update',
            );
            await action(modal, 'Save').click();
            await modal.waitFor({state: 'hidden'});
            await focused(action(first, 'Edit'));
            const duplicate = action(first, 'Duplicate');
            if (await duplicate.count()) {
              const count = await articles.count();
              await duplicate.focus();
              await page.keyboard.press('Enter');
              await focused(duplicate);
              await duplicate.click();
              await focused(duplicate);
              assert.equal(await articles.count(), count + 2);
              assert.equal(
                await articles.nth(1).getByRole('heading').textContent(),
                await articles.nth(2).getByRole('heading').textContent(),
              );
            }
            await action(first, 'Edit').click();
            await focused(field);
            await action(modal, 'Cancel').click();
            await focused(action(first, 'Edit'));
            await action(first, 'Edit').click();
            await focused(field);
            await page.keyboard.press('Escape');
            await focused(action(first, 'Edit'));
            await action(first, 'Delete').click();
            await focused(action(modal, 'Cancel'));
            await contrast(modal);
            await action(modal, 'Cancel').click();
            await focused(action(first, 'Delete'));
            await action(first, 'Delete').click();
            await focused(action(modal, 'Cancel'));
            await action(modal, 'Delete item').click();
            await focused(page.getByRole('searchbox'));
            await contrast(page.locator('main'));
            record.scenarios.push({...observed, pass: true});
            console.log(
              `PASS snapshot ${index + 1} ${width}px ${theme}: ${observed.focusChecks} stable-focus checks, minimum contrast ${observed.contrastMinimum.toFixed(2)}`,
            );
          } finally {
            await page.close();
          }
        }
      }
      assert.deepEqual(await hashes(root), before);
      assert.deepEqual(await hashes(snapshot), before);
      record.sourceUnchanged = true;
    } finally {
      await server.close();
      await rm(root, {recursive: true, force: true});
    }
  }
} finally {
  await browser.close();
  await writeFile(
    join(directory, 'snapshot-evidence.json'),
    JSON.stringify({results}, null, 2) + '\n',
  );
}
