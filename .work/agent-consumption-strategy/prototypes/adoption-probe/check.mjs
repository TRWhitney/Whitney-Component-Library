/* global document, innerWidth, getComputedStyle */
import {chromium} from 'playwright';
import {mkdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const origin = process.argv[2] ?? 'http://127.0.0.1:4391';
const output = process.argv[3] ?? '/tmp/wcl-adoption-evidence';
await mkdir(output, {recursive: true});
const browser = await chromium.launch({headless: true});
const results = [];
try {
  for (const width of [390, 1280]) {
    for (const variant of ['native', 'library']) {
      const page = await browser.newPage({viewport: {width, height: 1000}});
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(`${origin}/?variant=${variant}`);
      const email = page.getByRole('textbox', {name: 'Recipient email'});
      const desktop = page.getByRole('switch');
      const save = page.getByRole('button', {name: 'Save', exact: true});
      const summary = page.getByRole('complementary');
      const before = await desktop.isChecked();
      await desktop.focus();
      await page.keyboard.press('Space');
      const toggled = (await desktop.isChecked()) !== before;
      await email.fill('changed@example.test');
      const draftSeparate =
        (await summary.getByText('alex@example.test', {exact: true}).count()) === 1;
      await page.getByRole('radio', {name: 'Weekly', exact: true}).focus();
      await page.keyboard.press('ArrowUp');
      await save.focus();
      await page.keyboard.press('Enter');
      await summary.getByText('changed@example.test', {exact: true}).waitFor();
      const dailySaved = (await summary.getByText('daily', {exact: true}).count()) === 1;
      await email.fill('invalid-email');
      await save.click();
      const invalidBlocked =
        (await summary.getByText('changed@example.test', {exact: true}).count()) === 1;
      const invalidFeedback = await email.evaluate((node) => !node.validity.valid);
      await email.fill('');
      await save.click();
      const emptyBlocked =
        (await summary.getByText('changed@example.test', {exact: true}).count()) === 1;
      await page.getByRole('button', {name: 'Reset', exact: true}).click();
      const reset =
        (await email.inputValue()) === 'alex@example.test' &&
        (await page.getByRole('radio', {name: 'Weekly', exact: true}).isChecked());
      await page.waitForFunction(
        () => document.querySelector('input[type=email]')?.getAttribute('aria-invalid') !== 'true',
      );
      const resetValidity = await email.evaluate((node) => node.validity.valid);
      const desktopPreserved = (await desktop.isChecked()) !== before;
      const layout = await page.locator('.custom-layout').evaluate((node) => ({
        columns: getComputedStyle(node).gridTemplateColumns,
        width: node.getBoundingClientRect().width,
        overflow: document.documentElement.scrollWidth > innerWidth,
      }));
      await page.screenshot({path: resolve(output, `${variant}-${width}.png`), fullPage: true});
      results.push({
        kind: 'preferences',
        variant,
        width,
        checks: {
          toggled,
          draftSeparate,
          dailySaved,
          invalidBlocked,
          invalidFeedback,
          emptyBlocked,
          reset,
          resetValidity,
          desktopPreserved,
          noOverflow: !layout.overflow,
        },
        layout,
        errors,
      });
      await page.close();
    }
    for (const variant of ['native', 'current', 'extended']) {
      const page = await browser.newPage({viewport: {width, height: 600}});
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(`${origin}/?style&variant=${variant}`);
      const input = page.getByRole('textbox', {name: 'Email', exact: true});
      await input.fill('new@example.test');
      await input.focus();
      const metrics = await page.evaluate(() => {
        const metricsFor = (node) => {
          const rect = node.getBoundingClientRect();
          const style = getComputedStyle(node);
          return {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            font: style.font,
            color: style.color,
            background: style.backgroundColor,
            radius: style.borderRadius,
          };
        };
        return {
          input: metricsFor(document.querySelector('input')),
          label: metricsFor(document.querySelector('label')),
          button: metricsFor(document.querySelector('button')),
        };
      });
      await page.screenshot({
        path: resolve(output, `style-${variant}-${width}.png`),
        fullPage: true,
      });
      results.push({kind: 'style', variant, width, metrics, errors});
      await page.close();
    }
    const page = await browser.newPage({viewport: {width, height: 1000}});
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`${origin}/?board`);
    await page.getByRole('button', {name: 'Square 1, occupied', exact: true}).focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await page.getByText('Piece on square 2. Moves: 1.', {exact: true}).waitFor();
    const keyboardMove = true;
    await page.getByRole('button', {name: 'Square 16', exact: true}).click();
    const illegalIgnored =
      (await page.getByText('Piece on square 2. Moves: 1.', {exact: true}).count()) === 1;
    await page.getByRole('button', {name: 'Undo move', exact: true}).click();
    await page.getByText('Piece on square 1. Moves: 0.', {exact: true}).waitFor();
    const undo = true;
    await page.getByRole('switch', {name: 'Show legal moves', exact: true}).focus();
    await page.keyboard.press('Space');
    const movesHidden = (await page.locator('.board-cell[data-legal]').count()) === 0;
    const rules = page.getByRole('button', {name: 'Read rules', exact: true});
    await rules.click();
    const dialog = page.getByRole('dialog', {name: 'Movement rules', exact: true});
    await dialog.waitFor();
    await page.keyboard.press('Escape');
    await dialog.waitFor({state: 'hidden'});
    await page.waitForFunction(() => document.activeElement?.textContent === 'Read rules');
    const focusReturned = true;
    const noOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    );
    await page.screenshot({path: resolve(output, `board-${width}.png`), fullPage: true});
    results.push({
      kind: 'board',
      width,
      checks: {keyboardMove, illegalIgnored, undo, movesHidden, focusReturned, noOverflow},
      errors,
    });
    await page.close();
  }
} finally {
  await browser.close();
  await writeFile(resolve(output, 'results.json'), JSON.stringify(results, null, 2));
}
console.log(JSON.stringify(results, null, 2));
if (
  results.some(
    (result) => result.errors.length || Object.values(result.checks ?? {}).some((value) => !value),
  )
)
  process.exitCode = 1;
