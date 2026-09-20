/* global document */
import assert from 'node:assert/strict';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {chromium, firefox, webkit} from 'playwright';
import {expect} from 'playwright/test';

const output = resolve(process.env.RELEASE_EVIDENCE || '/tmp/wcl-release-evidence');
await mkdir(output, {recursive: true});
const engines = {chromium, firefox, webkit};
const results = [];
const scenarios = {
  operational: {
    url: process.env.OPERATIONAL_URL || 'http://localhost:5179',
    async run({page, activate, enter}) {
      await expect(page.getByRole('button', {name: 'Run operation'})).toBeDisabled();
      const stageList = page.getByRole('list', {name: 'Operation stages'});
      for (const stage of await stageList.getByRole('listitem').all()) {
        const text = await stage.textContent();
        assert((text.match(/pending/gi) || []).length <= 1, `Repeated stage status: ${text}`);
      }
      await expect(page.getByRole('status')).toHaveCount(1);
      assert(
        !(await stageList.evaluate((el) =>
          Boolean(el.closest('[role="status"], [role="alert"], [aria-live]')),
        )),
      );
      for (const label of ['Validate configuration', 'Review configuration']) {
        const bounds = await page.getByRole('button', {name: label}).boundingBox();
        assert(
          bounds && bounds.x >= 0 && bounds.x + bounds.width <= page.viewportSize().width,
          label,
        );
      }
      await activate(page.getByRole('button', {name: 'Validate configuration'}));
      await expect(page.getByRole('textbox', {name: 'Operation name'})).toHaveAttribute(
        'aria-invalid',
        'true',
      );
      await expect(page.getByRole('status')).toContainText(/enter an operation name/i);
      await enter(page.getByRole('textbox', {name: 'Operation name'}), 'Release thermal solve');
      await activate(page.getByRole('button', {name: 'Validate configuration'}));
      await expect(page.getByRole('status')).toContainText(/ready for review/i);
      await activate(page.getByRole('button', {name: 'Review configuration'}));
      const dialog = page.getByRole('dialog', {name: 'Review operation', exact: true});
      await expect(dialog).toContainText('Release thermal solve');
      await activate(dialog.getByRole('button', {name: 'Accept review'}));
      await expect(page.getByRole('status')).toContainText(/review accepted/i);
      await activate(page.getByRole('button', {name: 'Run operation'}));
      await expect(stageList.locator('[aria-current="step"]')).toContainText('Solve');
      await expect(stageList.locator('[aria-current="step"]')).toHaveAttribute(
        'data-status',
        'active',
      );
      await expect(page.getByRole('status')).toContainText(/running.*18 of 25/i);
      await expect(
        page.getByRole('progressbar', {name: 'Solving boundary passes'}),
      ).toHaveAttribute('aria-valuenow', '18');
    },
  },
  energy: {
    url: process.env.ANALYSIS_URL || 'http://localhost:5174',
    async run({page, activate, enter, mode, reach}) {
      if (mode === 'touch')
        await activate(page.getByRole('button', {name: 'Buildings', exact: true}));
      await enter(page.getByRole('searchbox', {name: 'Find a building'}), 'North Library');
      const row = page.getByRole('row', {name: 'North Library', exact: true});
      if (mode === 'touch') await row.tap();
      else {
        await reach(
          page.getByRole('treegrid', {name: 'Campus buildings'}).getByRole('row').first(),
        );
        await page.keyboard.press('ArrowDown');
        assert(await row.evaluate((el) => el.contains(document.activeElement)));
        await page.keyboard.press('Enter');
      }
      await expect(page.getByRole('heading', {name: 'North Library', exact: true})).toBeVisible();
      await activate(page.getByRole('button', {name: 'Pin comparison', exact: true}));
      await activate(page.getByRole('button', {name: 'Investigate', exact: true}));
      if (mode === 'touch')
        await activate(page.getByRole('button', {name: /^Investigations/}).first());
      await enter(
        page.getByRole('textbox', {name: 'Investigation reason'}),
        'Review the September demand.',
      );
      const download = page.waitForEvent('download');
      download.catch(() => {});
      await activate(page.getByRole('button', {name: 'Export investigations', exact: true}));
      assert.match(
        await readFile(await (await download).path(), 'utf8'),
        /Review the September demand/,
      );
    },
  },
  fieldnotes: {
    url: process.env.MARKDOWN_URL || 'http://localhost:5176',
    async run({page, activate, enter, mode, reach}) {
      await activate(page.getByRole('button', {name: 'Open Arrival brief', exact: true}));
      await enter(
        page.getByRole('textbox', {name: 'Document body', exact: true}),
        '# Arrival brief\n\nRelease review text.',
      );
      await activate(page.getByRole('button', {name: 'Save', exact: true}));
      await expect(page.getByText('Saved in this session', {exact: true})).toBeVisible();
      if (mode === 'touch')
        await activate(page.getByRole('button', {name: 'Navigator', exact: true}));
      await activate(page.getByRole('link', {name: 'Review & export', exact: true}));
      if (mode === 'keyboard') {
        await reach(page.getByRole('grid', {name: 'Document review'}));
        await page.keyboard.press('Control+Home');
        for (let cell = 0; cell < 3; cell++) await page.keyboard.press('ArrowRight');
      }
      while (await page.getByRole('button', {name: 'Mark reviewed', exact: true}).count()) {
        const remaining = await page
          .getByRole('button', {name: 'Mark reviewed', exact: true})
          .count();
        await activate(page.getByRole('button', {name: 'Mark reviewed', exact: true}).first());
        await expect(page.getByRole('button', {name: 'Mark reviewed', exact: true})).toHaveCount(
          remaining - 1,
        );
        if (mode === 'keyboard') {
          await expect(
            remaining > 1
              ? page.getByRole('button', {name: 'Mark reviewed', exact: true}).first()
              : page.getByRole('button', {name: 'Export field guide', exact: true}),
          ).toBeFocused();
        }
      }
      const download = page.waitForEvent('download');
      download.catch(() => {});
      await activate(page.getByRole('button', {name: 'Export field guide', exact: true}));
      assert.match(await readFile(await (await download).path(), 'utf8'), /Release review text/);
      await expect(page.getByRole('heading', {name: 'Guide exported'})).toBeVisible();
    },
  },
  docket: {
    url: process.env.DOCKET_URL || 'http://localhost:5177',
    async run({page, activate, enter, mode}) {
      await enter(
        page.getByRole('textbox', {name: 'Document content', exact: true}),
        '# Handover brief\n\nRelease packet text.',
      );
      await activate(page.getByRole('button', {name: 'Save', exact: true}));
      await expect(page.getByText('All changes saved', {exact: true})).toBeVisible();
      if (mode === 'touch')
        await activate(page.getByRole('button', {name: 'Details', exact: true}));
      await activate(page.getByRole('button', {name: 'Mark ready', exact: true}));
      if (mode === 'touch')
        await activate(page.getByRole('button', {name: 'Close document details'}));
      await activate(page.getByRole('button', {name: /^(Review packet|Packet)/}).first());
      const dialog = page.getByRole('dialog', {name: 'Review handover packet'});
      const download = page.waitForEvent('download');
      download.catch(() => {});
      await activate(dialog.getByRole('button', {name: 'Export 3 documents'}));
      assert.match(await readFile(await (await download).path(), 'utf8'), /Release packet text/);
    },
  },
};

for (const browserName of (process.env.RELEASE_BROWSERS || 'chromium,firefox,webkit').split(',')) {
  const browser = await engines[browserName].launch();
  for (const mode of (process.env.RELEASE_INPUTS || 'keyboard,touch').split(',')) {
    for (const [name, scenario] of Object.entries(scenarios)) {
      if (process.env.RELEASE_FIXTURE && process.env.RELEASE_FIXTURE !== name) continue;
      const context = await browser.newContext({
        viewport: mode === 'touch' ? {width: 390, height: 844} : {width: 1440, height: 1000},
        hasTouch: mode === 'touch',
      });
      const page = await context.newPage();
      page.setDefaultTimeout(10000);
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      const reach = async (locator) => {
        await expect(locator).toBeVisible();
        for (let step = 0; step < 180; step++) {
          if (
            await locator.evaluate(
              (el) =>
                el === document.activeElement ||
                (['row', 'grid'].includes(el.getAttribute('role')) &&
                  el.contains(document.activeElement)),
            )
          )
            return;
          const inToolbar = await locator.evaluate(
            (el) => el.closest('[role="toolbar"]')?.contains(document.activeElement) ?? false,
          );
          if (inToolbar) {
            const direction = await locator.evaluate((el) => {
              const controls = [...el.closest('[role="toolbar"]').querySelectorAll('button')];
              return controls.indexOf(el) < controls.indexOf(document.activeElement)
                ? 'ArrowLeft'
                : 'ArrowRight';
            });
            await page.keyboard.press(direction);
            continue;
          }
          const direction = await locator.evaluate((el) =>
            el.compareDocumentPosition(document.activeElement) & 4 ? 'Shift+Tab' : 'Tab',
          );
          await page.keyboard.press(direction);
        }
        throw new Error(`Unreachable by Tab: ${await locator.ariaSnapshot()}`);
      };
      const activate = async (locator) => {
        if (mode === 'touch') await locator.tap();
        else {
          await reach(locator);
          await page.keyboard.press('Enter');
        }
      };
      const enter = async (locator, text) => {
        if (mode === 'touch') await locator.tap();
        else await reach(locator);
        await page.keyboard.press('Control+Home');
        await page.keyboard.press('Control+A');
        await page.keyboard.insertText(text);
      };
      try {
        await page.goto(scenario.url);
        await scenario.run({page, activate, enter, mode, reach});
        assert.deepEqual(errors, []);
        await page.screenshot({path: resolve(output, `${browserName}-${name}-${mode}.png`)});
        results.push({
          browser: browserName,
          version: browser.version(),
          fixture: name,
          input: mode,
          result: 'pass',
        });
        console.log(`${browserName} ${name} ${mode}: PASS`);
      } catch (error) {
        results.push({
          browser: browserName,
          fixture: name,
          input: mode,
          result: 'fail',
          message: error.message,
        });
        await writeFile(
          resolve(output, `${browserName}-${name}-${mode}-failure.yml`),
          await page.locator('body').ariaSnapshot(),
        );
        console.error(`${browserName} ${name} ${mode}:`, error.message);
      } finally {
        await context.close();
      }
    }
  }
  await browser.close();
}
await writeFile(resolve(output, 'integrations.json'), JSON.stringify(results, null, 2));
if (results.some((result) => result.result === 'fail')) process.exitCode = 1;
