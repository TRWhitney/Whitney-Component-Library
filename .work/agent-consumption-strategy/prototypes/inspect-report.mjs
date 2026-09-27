/* global document, innerWidth */
// Independent checks for pilot task 3. Does not repair generated applications.
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
    async function choose(name) {
      if (await page.locator('select:visible').count()) {
        await page.locator('select:visible').selectOption({label: name});
      } else if (await page.getByRole('radio', {name, exact: true}).count()) {
        await page.getByRole('radio', {name, exact: true}).focus();
        await page.keyboard.press('Space');
      } else if (await page.getByRole('button', {name, exact: true}).count()) {
        await page.getByRole('button', {name, exact: true}).click();
      } else {
        await page.getByRole('button', {name: /report state/i}).click();
        await page.getByRole('option', {name, exact: true}).click();
      }
    }
    try {
      const values = [
        ['Monday', 12],
        ['Tuesday', 18],
        ['Wednesday', 15],
        ['Thursday', 23],
        ['Friday', 21],
        ['Saturday', 28],
        ['Sunday', 24],
      ];
      result.checks.exactValues = true;
      for (const [day, value] of values) {
        const rows = page.getByRole('row').filter({hasText: day});
        if (
          !(await rows.count()) ||
          !new RegExp(`\\b${value}\\b`).test(await rows.first().innerText())
        )
          result.checks.exactValues = false;
      }
      result.checks.units = (await page.locator('main').innerText()).includes('kWh');
      result.checks.noHorizontalClipping = await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      );
      await page.screenshot({path: `${evidence}/report-${width}.png`, fullPage: true});
      await choose('Loading');
      result.checks.loading =
        /loading|preparing/i.test(await page.locator('main').innerText()) &&
        (await page.getByRole('row').filter({hasText: 'Monday'}).count()) === 0;
      await choose('Empty');
      result.checks.empty =
        /no.*measurements/i.test(await page.locator('main').innerText()) &&
        (await page.getByRole('row').filter({hasText: 'Monday'}).count()) === 0;
      await choose('Error');
      result.checks.error =
        /could not|unable|couldn't|failed|error/i.test(await page.locator('main').innerText()) &&
        (await page.getByRole('row').filter({hasText: 'Monday'}).count()) === 0;
      const retry = page.getByRole('button', {name: /retry/i});
      await retry.focus();
      await page.keyboard.press('Enter');
      result.checks.retry = (await page.getByRole('row').filter({hasText: 'Monday'}).count()) > 0;
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
