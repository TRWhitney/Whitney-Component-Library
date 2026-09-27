/* global document, innerWidth */
// Independent checks for pilot task 2. Does not repair generated applications.
import {spawn} from 'node:child_process';
import {writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';

const [trial, evidence, portText] = process.argv.slice(2);
const origin = `http://127.0.0.1:${Number(portText)}`;
const server = spawn(
  'npm',
  ['run', 'dev', '--', '--host', '127.0.0.1', '--port', portText, '--strictPort'],
  {cwd: trial, stdio: 'ignore', detached: true},
);
const results = [];
let browser;
try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    if (server.exitCode !== null) throw new Error('Server stopped');
    try {
      if ((await fetch(origin)).ok) {
        ready = true;
        break;
      }
    } catch {
      // The server may not be listening yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  if (!ready) throw new Error('Server did not become ready');
  browser = await chromium.launch({headless: true});
  for (const width of [390, 1280]) {
    const page = await browser.newPage({viewport: {width, height: 1000}});
    page.setDefaultTimeout(5000);
    const result = {width, checks: {}, errors: []};
    page.on('pageerror', (error) => result.errors.push(error.message));
    await page.goto(origin);
    const dialog = page.locator(
      'dialog:visible, [role="dialog"]:visible, [role="alertdialog"]:visible',
    );
    const search = page.getByLabel(/search equipment/i);
    try {
      result.checks.fourRecords = (await page.getByRole('button', {name: /edit/i}).count()) === 4;
      await search.fill('zzz-not-found');
      result.checks.noResults =
        (await page.getByRole('button', {name: /edit/i}).count()) === 0 &&
        /no.*(?:equipment|results|match)/i.test(await page.locator('main').innerText());
      await search.fill('');
      const edit = page.getByRole('button', {name: /edit/i}).first();
      await edit.focus();
      await page.keyboard.press('Enter');
      await dialog.waitFor();
      result.checks.editorNamesRecord =
        (await dialog.innerText()).includes('EQ-1') ||
        (await dialog.getByRole('textbox').inputValue()) === 'Atlas pump';
      await dialog.getByRole('textbox').fill('Uncommitted name');
      await dialog.getByRole('button', {name: /^cancel$/i}).click();
      result.checks.cancelKeepsName =
        (await page.getByText('Atlas pump', {exact: true}).count()) > 0;
      result.checks.cancelFocus = await page.evaluate(
        () => document.activeElement?.tagName === 'BUTTON',
      );
      await edit.click();
      await dialog.getByRole('textbox').fill('Atlas revised');
      await dialog.getByRole('button', {name: /save/i}).click();
      result.checks.saveUpdatesName =
        (await page.getByText('Atlas revised', {exact: true}).count()) > 0;
      await page
        .getByRole('button', {name: /delete/i})
        .first()
        .click();
      await dialog.waitFor();
      result.checks.deleteNamesRecord = (await dialog.innerText()).includes('Atlas revised');
      result.checks.cancelInitiallyFocused = await dialog
        .getByRole('button', {name: /^cancel$/i})
        .evaluate((node) => node === document.activeElement);
      for (let i = 0; i < 7; i++) await page.keyboard.press('Tab');
      result.checks.modalFocusContained = await dialog.evaluate((node) =>
        node.contains(document.activeElement),
      );
      await page.keyboard.press('Escape');
      await dialog.waitFor({state: 'hidden', timeout: 1000}).catch(() => {});
      result.checks.escapeKeepsRecord =
        (await page.getByText('Atlas revised', {exact: true}).count()) > 0 &&
        (await dialog.count()) === 0;
      await page
        .getByRole('button', {name: /delete/i})
        .first()
        .click();
      await dialog.getByRole('button', {name: /delete/i}).click();
      await page.waitForFunction(
        () => !document.querySelector('dialog[open], [role="alertdialog"], [role="dialog"]'),
      );
      result.checks.explicitDeletion =
        (await page.getByText('Atlas revised', {exact: true}).count()) === 0 &&
        (await page.getByRole('button', {name: /edit/i}).count()) === 3;
      await page
        .waitForFunction(
          () => ['BUTTON', 'INPUT'].includes(document.activeElement?.tagName),
          undefined,
          {timeout: 1000},
        )
        .catch(() => {});
      result.checks.postDeleteFocus = await page.evaluate(() =>
        ['BUTTON', 'INPUT'].includes(document.activeElement?.tagName),
      );
      result.checks.noHorizontalClipping = await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      );
      await page.screenshot({path: `${evidence}/register-${width}.png`, fullPage: true});
    } catch (error) {
      result.errors.push(error.message);
    }
    results.push(result);
    await page.close();
  }
} finally {
  if (browser) await browser.close();
  try {
    process.kill(-server.pid, 'SIGTERM');
  } catch {
    // The server may already have exited.
  }
  await writeFile(`${evidence}/independent-checks.json`, JSON.stringify(results, null, 2));
}
console.log(JSON.stringify(results, null, 2));
