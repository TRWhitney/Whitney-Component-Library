/* global document, innerWidth */
// Independent checks for pilot task 1. Does not repair generated applications.
import {spawn} from 'node:child_process';
import {writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';

const [trial, evidence, portText] = process.argv.slice(2);
if (!trial || !evidence || !portText)
  throw new Error('Pass trial, evidence directory, and free port.');
const port = Number(portText);
const server = spawn(
  'npm',
  ['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
  {cwd: trial, stdio: 'pipe', detached: true},
);
let output = '';
server.stdout.on('data', (data) => {
  output += data;
});
server.stderr.on('data', (data) => {
  output += data;
});
const origin = `http://127.0.0.1:${port}`;
let browser;
const results = [];
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null) throw new Error(`Server stopped: ${output}`);
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
    const result = {width, checks: {}, errors: []};
    page.on('pageerror', (error) => result.errors.push(error.message));
    await page.goto(origin);
    const email = page.getByRole('textbox', {name: /recipient email/i});
    const desktop = page.getByRole('switch', {name: /desktop alerts/i});
    const save = page.getByRole('button', {name: /save/i});
    const reset = page.getByRole('button', {name: /reset/i});
    try {
      result.checks.initialEmail = (await email.inputValue()) === 'alex@example.test';
      const desktopBefore = await desktop.isChecked();
      await desktop.focus();
      await page.keyboard.press('Space');
      const desktopAfter = await desktop.isChecked();
      result.checks.immediateKeyboardToggle = desktopAfter !== desktopBefore;
      await email.fill('changed@example.test');
      result.checks.savedSummaryRetained =
        (await page.getByText('alex@example.test', {exact: true}).count()) > 0;
      await page.getByRole('radio', {name: /^weekly/i}).focus();
      await page.keyboard.press('ArrowUp');
      result.checks.frequencyKeyboardSelection = await page
        .getByRole('radio', {name: /^daily/i})
        .isChecked();
      await save.focus();
      await page.keyboard.press('Enter');
      result.checks.validSave =
        (await page.getByText('changed@example.test', {exact: true}).count()) > 0;
      await email.fill('invalid-email');
      await save.click();
      result.checks.invalidCannotSave =
        (await page.getByText('changed@example.test', {exact: true}).count()) > 0 &&
        (await page.getByText('invalid-email', {exact: true}).count()) === 0;
      result.checks.invalidFeedback =
        (await email.getAttribute('aria-invalid')) === 'true' ||
        (await email.evaluate((node) => !node.validity.valid));
      await email.fill('');
      await save.click();
      result.checks.emptyCannotSave =
        (await page.getByText('changed@example.test', {exact: true}).count()) > 0;
      await reset.click();
      result.checks.resetEmail = (await email.inputValue()) === 'alex@example.test';
      result.checks.resetFrequency = await page.getByRole('radio', {name: /^weekly/i}).isChecked();
      result.checks.resetPreservesDesktop = (await desktop.isChecked()) === desktopAfter;
      result.checks.noHorizontalClipping = await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      );
      result.resetSavedSummary =
        (await page.getByText('changed@example.test', {exact: true}).count()) > 0
          ? 'retained'
          : 'reset-or-absent';
      await page.screenshot({path: `${evidence}/preferences-${width}.png`, fullPage: true});
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
