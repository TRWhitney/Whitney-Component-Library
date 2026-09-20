/* global innerWidth, innerHeight, getComputedStyle */
import assert from 'node:assert/strict';
import {mkdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {expect} from 'playwright/test';

const engines = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const output = resolve(process.env.RELEASE_EVIDENCE || '/tmp/wcl-release-evidence');
await mkdir(output, {recursive: true});
const results = [];
for (const name of (process.env.RELEASE_BROWSERS || 'chromium,firefox,webkit').split(',')) {
  const executablePath = process.env[`${name.toUpperCase()}_EXECUTABLE`];
  const browser = await engines[name].launch(executablePath ? {executablePath} : {});
  const page = await browser.newPage({viewport: {width: 1440, height: 1000}});
  page.setDefaultTimeout(10000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const specimen = (component) => page.locator(`[data-showcase-component="${component}"]`);
  const equalAttribute = (locator, attribute, expected) =>
    expect(locator).toHaveAttribute(attribute, expected);
  const focused = (locator) => expect(locator).toBeFocused();
  const check = async (label, run) => {
    await run();
    results.push({browser: name, version: browser.version(), check: label, result: 'pass'});
    console.log(`${name}: ${label} PASS`);
  };
  try {
    await page.goto(process.env.SHOWCASE_URL || 'http://localhost:5173');
    await specimen('Select').waitFor();
    await check('catalog and layout', async () => {
      const links = await page
        .getByRole('navigation', {name: 'Component catalog'})
        .getByRole('link')
        .allTextContents();
      const names = await page
        .locator('[data-showcase-component]')
        .evaluateAll((items) => items.map((el) => el.dataset.showcaseComponent));
      assert.deepEqual([...names].sort(), [...links].sort());
      for (const component of [
        'Stack',
        'InlineGroup',
        'ResponsiveGrid',
        'Divider',
        'Surface',
        'FocusField',
        'Section',
        'ScrollRegion',
        'PageHeader',
        'SplitView',
      ]) {
        assert(await specimen(component).isVisible(), component);
      }
      await writeFile(
        resolve(output, `${name}-catalog.yml`),
        await page.locator('main').ariaSnapshot(),
      );
    });
    await check('actions and choices', async () => {
      const toggle = specimen('ToggleButton').getByRole('button').first();
      const selected = await toggle.getAttribute('aria-pressed');
      await toggle.press('Space');
      await equalAttribute(toggle, 'aria-pressed', selected === 'true' ? 'false' : 'true');
      const checkbox = specimen('Checkbox').getByRole('checkbox', {name: 'Include mesh'});
      assert(await checkbox.isChecked());
      await checkbox.press('Space');
      assert(!(await checkbox.isChecked()));
      const readOnly = specimen('Switch').getByRole('switch', {name: 'Pin approved result'});
      await readOnly.press('Space');
      assert(await readOnly.isChecked());
      assert(
        (await specimen('Button')
          .getByRole('button', {name: /unavailable|disabled/i})
          .count()) || (await specimen('Button').locator('button:disabled').count()),
      );
    });
    await check('fields and ranges', async () => {
      const input = specimen('TextField').getByRole('textbox', {name: 'Run name', exact: true});
      await input.fill('Release check');
      assert.equal(await input.inputValue(), 'Release check');
      const slider = specimen('Slider').getByRole('slider', {name: 'Confidence', exact: true});
      const initial = Number(await slider.inputValue());
      await slider.press('ArrowRight');
      assert(Number(await slider.inputValue()) > initial);
      const day = specimen('DateField').getByRole('spinbutton', {
        name: 'day, Run date',
        exact: true,
      });
      const before = await day.getAttribute('aria-valuenow');
      await day.press('ArrowUp');
      assert.notEqual(await day.getAttribute('aria-valuenow'), before);
    });
    await check('select and combobox keyboard selection', async () => {
      const select = specimen('Select').getByRole('button');
      const before = await select.innerText();
      await select.press('Space');
      await page.getByRole('listbox', {name: 'Run mode', exact: true}).waitFor();
      await page.keyboard.press('Home');
      await page.keyboard.press('Enter');
      assert.notEqual(await select.innerText(), before);
      await focused(select);
      const combo = specimen('ComboBox').getByRole('combobox', {name: 'Find run mode'});
      await combo.fill('Bal');
      await page.getByRole('option', {name: /Balanced/}).waitFor();
      await combo.press('ArrowDown');
      await combo.press('Enter');
      await expect(combo).toHaveValue('Balanced');
    });
    await check('navigation and collections', async () => {
      const tabs = specimen('Tabs');
      await tabs.getByRole('tab', {name: 'Summary'}).press('ArrowRight');
      await focused(tabs.getByRole('tab', {name: 'Inputs'}));
      await equalAttribute(tabs.getByRole('tab', {name: 'Summary'}), 'aria-selected', 'true');
      await page.keyboard.press('Enter');
      await equalAttribute(tabs.getByRole('tab', {name: 'Inputs'}), 'aria-selected', 'true');
      const list = specimen('ListBox');
      await list.getByRole('option', {name: /Alpha/}).press('ArrowDown');
      await page.keyboard.press('Space');
      await equalAttribute(list.getByRole('option', {name: /Beta/}), 'aria-selected', 'true');
      const tree = specimen('Tree').getByRole('treegrid', {name: 'Study run hierarchy'});
      await tree.focus();
      await page.keyboard.press('Home');
      await focused(tree.getByRole('row', {name: 'Thermal study', exact: true}));
      await page.keyboard.press('ArrowLeft');
      await expect(tree.getByRole('row', {name: 'RUN 0284', exact: true})).toHaveCount(0);
      await page.keyboard.press('ArrowRight');
      await tree.getByRole('row', {name: 'RUN 0284', exact: true}).waitFor();
      const search = specimen('Tree').getByRole('searchbox', {name: 'Find a building'});
      const results = specimen('Tree').getByRole('status', {name: 'Building search results'});
      await search.fill('Elm');
      await expect(results).toHaveText('1 building found.');
      await search.fill('zzzz');
      await expect(results).toHaveText('No matching buildings.');
      await focused(search);
      await specimen('Tree').getByRole('button', {name: 'Clear building search'}).click();
      await expect(results).toHaveText('3 buildings found.');
      await focused(search);
    });
    await check('nested overlay focus and narrow pointer selection', async () => {
      const trigger = specimen('Dialog').getByRole('button', {name: 'Edit run name'});
      await trigger.press('Enter');
      const dialog = page.getByRole('dialog', {name: 'Edit run name', exact: true});
      await dialog.waitFor();
      await dialog.getByRole('button', {name: 'Inspect current run'}).press('Enter');
      await page.getByRole('dialog', {name: 'Current run inspector'}).waitFor();
      await page.keyboard.press('Escape');
      await focused(dialog.getByRole('button', {name: 'Inspect current run'}));
      await page.keyboard.press('Escape');
      await focused(trigger);
      await page.setViewportSize({width: 390, height: 844});
      await specimen('Popover').getByRole('button', {name: 'Inspect run summary'}).click();
      const popover = page.getByRole('dialog', {name: 'Run summary', exact: true});
      for (const value of ['Loading', 'Ready', 'Empty workspace', 'Ready', 'Load error']) {
        await popover.getByRole('button', {name: /Review state/}).click();
        await page.getByRole('option', {name: value, exact: true}).click();
        await expect(popover.getByRole('button', {name: /Review state/})).toHaveText(value);
        await expect(page.getByRole('listbox', {name: 'Review state', exact: true})).toBeHidden();
        await focused(popover.getByRole('button', {name: /Review state/}));
      }
      await page.keyboard.press('Escape');
      await expect(popover).toBeHidden();
      await page.setViewportSize({width: 1440, height: 1000});
    });
    await check('file acquisition and feedback', async () => {
      await specimen('FileTrigger')
        .locator('input[type="file"]')
        .nth(1)
        .setInputFiles({
          name: 'release.png',
          mimeType: 'image/png',
          buffer: Buffer.from('release evidence'),
        });
      await expect(specimen('DropZone')).toContainText('Latest: release.png');
      await expect(
        specimen('FileTrigger').getByRole('button', {
          name: 'Choose replacement dataset',
          exact: true,
        }),
      ).toBeDisabled();
      const meter = specimen('Meter').getByRole('meter', {name: 'Thermal load'});
      await expect(meter).toHaveAttribute('aria-valuenow', '76');
      assert.match(await specimen('Meter').ariaSnapshot(), /meter "Thermal load"/);
      await specimen('NotificationProvider')
        .getByRole('button', {name: 'Show error notification'})
        .press('Enter');
      await page.getByRole('button', {name: 'Retry export', exact: true}).waitFor();
      await page.getByRole('button', {name: 'Dismiss notification', exact: true}).press('Enter');
      await expect(page.getByRole('button', {name: 'Retry export', exact: true})).toBeHidden();
    });
    await check('calendar, confirmation and menu keyboard flows', async () => {
      const calendarTrigger = specimen('DatePicker').getByRole('button', {
        name: 'Choose review date Review date',
        exact: true,
      });
      await calendarTrigger.press('Enter');
      await page.getByRole('dialog').waitFor();
      await page.keyboard.press('Escape');
      await focused(calendarTrigger);
      const confirmTrigger = specimen('AlertDialog').getByRole('button', {
        name: 'Delete archived run',
        exact: true,
      });
      await confirmTrigger.press('Enter');
      await focused(page.getByRole('button', {name: 'Keep archived run', exact: true}));
      await page.keyboard.press('Enter');
      await focused(confirmTrigger);
      const menuTrigger = specimen('Menu').getByRole('button', {name: 'Open run actions'});
      await menuTrigger.press('Enter');
      await page.getByRole('menu').waitFor();
      await page.keyboard.press('End');
      await page.keyboard.press('ArrowRight');
      await page.getByRole('menuitem', {name: 'Archive run', exact: true}).waitFor();
      await page.keyboard.press('Escape');
      await page.keyboard.press('Escape');
      await focused(menuTrigger);
    });
    await check('Markdown mode continuity and read-only', async () => {
      const editor = specimen('MarkdownEditor');
      await editor.getByRole('radio', {name: 'Live Preview', exact: true}).press('ArrowRight');
      await editor.getByRole('radio', {name: 'Source', exact: true}).press('ArrowRight');
      const reading = editor.getByRole('document', {name: 'Markdown review notes', exact: true});
      await reading.press('Shift+Tab');
      await page.keyboard.press('Tab');
      await focused(reading);
      await expect(
        reading.getByRole('heading', {name: 'Boundary review', exact: true}),
      ).toBeVisible();
      await expect(reading.getByRole('table')).toHaveCount(1);
      await page.keyboard.press('Tab');
      await focused(reading.getByRole('link').first());
      await editor.getByRole('radio', {name: 'Preview', exact: true}).press('ArrowLeft');
      await expect(editor.locator('[data-wcl-markdown-editor]')).toHaveAttribute(
        'data-mode',
        'source',
      );
      const text = editor.getByRole('textbox', {name: 'Markdown review notes', exact: true});
      await text.press('Control+Home');
      await text.press('Control+A');
      await page.keyboard.insertText('# Release check\n\nRetained text.');
      await editor.getByRole('radio', {name: 'Source', exact: true}).press('ArrowLeft');
      await expect(text).toContainText('Retained text');
      await editor.getByRole('switch', {name: 'Read-only', exact: true}).press('Space');
      await equalAttribute(text, 'aria-readonly', 'true');
      await editor.getByRole('switch', {name: 'Read-only', exact: true}).press('Space');
      await editor.getByRole('radio', {name: 'Live Preview', exact: true}).press('ArrowRight');
      await expect(editor.locator('textarea')).toHaveValue('# Release check\n\nRetained text.');
    });
    await check('all chart family semantics', async () => {
      for (const component of [
        'LineChart',
        'AreaChart',
        'ColumnChart',
        'BarChart',
        'PieChart',
        'DonutChart',
        'RadarChart',
        'Heatmap',
        'Sparkline',
        'CartesianChart',
        'ScatterChart',
        'BubbleChart',
        'Histogram',
        'BoxPlot',
      ]) {
        const chart = specimen(component);
        assert((await chart.getByRole('table').count()) > 0, `${component} exposes data`);
        const plot = chart.locator('[tabindex="0"][role="group"]').first();
        assert(await plot.count(), `${component} has a keyboard plot`);
        await plot.press('ArrowRight');
        await focused(plot);
        await writeFile(resolve(output, `${name}-${component}.yml`), await chart.ariaSnapshot());
      }
    });
    await check('heatmap keyboard entry and cell readings', async () => {
      const heatmap = page.getByRole('figure', {
        name: 'Sequential Heatmap with zero and missing cells',
        exact: true,
      });
      const plot = heatmap.locator('[data-wcl-heatmap-canvas]');
      await heatmap.getByRole('button', {name: 'Hide time Morning', exact: true}).focus();
      await page.keyboard.press('Shift+Tab');
      await focused(plot);
      await page.keyboard.press('Home');
      const reading = heatmap.locator('[data-wcl-chart-reading-announcement]');
      await expect(reading).toHaveText('North room. Morning. 0 °C');
      await page.keyboard.press('Shift+ArrowRight');
      await expect(reading).toHaveText('North room. Midday. 18 °C');
      await page.keyboard.press('End');
      await expect(reading).toHaveText('North room. Night. No reading');
    });
    await check('selection popups keep options visible in a short viewport', async () => {
      await page.setViewportSize({width: 360, height: 228});
      const select = specimen('Select').getByRole('button');
      await select.evaluate((el) => el.scrollIntoView({block: 'center'}));
      await select.press('Space');
      await page.getByRole('listbox', {name: 'Run mode', exact: true}).waitFor();
      await page.keyboard.press('End');
      const last = page.getByRole('option', {name: 'Fast', exact: true});
      await focused(last);
      await expect
        .poll(() =>
          last.evaluate((el) => {
            const option = el.getBoundingClientRect();
            const popup = el.closest('[data-wcl-selection-popover]').getBoundingClientRect();
            return (
              option.top >= popup.top &&
              option.bottom <= popup.bottom &&
              popup.top >= 0 &&
              popup.bottom <= innerHeight
            );
          }),
        )
        .toBe(true);
      await page.keyboard.press('Enter');
      await expect(select).toContainText('Fast');
      await focused(select);
      const combo = specimen('ComboBox').getByRole('combobox', {name: 'Find run mode'});
      await combo.fill('');
      await combo.evaluate((el) => el.scrollIntoView({block: 'center'}));
      await combo.press('ArrowDown');
      await combo.press('End');
      await expect
        .poll(() =>
          last.evaluate((el) => {
            const option = el.getBoundingClientRect();
            const popup = el.closest('[data-wcl-selection-popover]').getBoundingClientRect();
            return (
              option.top >= popup.top &&
              option.bottom <= popup.bottom &&
              popup.top >= 0 &&
              popup.bottom <= innerHeight
            );
          }),
        )
        .toBe(true);
      await combo.press('Enter');
      await expect(combo).toHaveValue('Fast');
      await focused(combo);
      await page.setViewportSize({width: 1440, height: 1000});
    });
    await check('appearance and responsive bounds', async () => {
      for (const width of [1440, 720, 390, 320]) {
        await page.setViewportSize({width, height: 900});
        for (const component of [
          'TextField',
          'Select',
          'Table',
          'ProcessTracker',
          'Dialog',
          'MarkdownEditor',
        ]) {
          const target = specimen(component);
          await target.scrollIntoViewIfNeeded();
          assert(
            await target.evaluate((el) => el.getBoundingClientRect().right <= innerWidth + 1),
            `${component} at ${width}`,
          );
        }
      }
      await page.getByRole('button', {name: 'Dark', exact: true}).first().press('Space');
      await page.getByLabel('Accent', {exact: true}).fill('#d14f00');
      await page.getByRole('switch', {name: 'Compact application density'}).press('Space');
      await specimen('ProcessTracker').scrollIntoViewIfNeeded();
      await page.screenshot({path: resolve(output, `${name}-light-compact.png`)});
      await page.emulateMedia({reducedMotion: 'reduce'});
      const animations = await specimen('ProcessTracker').evaluate((el) =>
        [...el.querySelectorAll('*')]
          .flatMap((child) => [
            getComputedStyle(child).animationName,
            getComputedStyle(child, '::before').animationName,
            getComputedStyle(child, '::after').animationName,
          ])
          .filter((value) => value !== 'none'),
      );
      assert.deepEqual(animations, []);
      await page.emulateMedia({forcedColors: 'active'});
      await page.screenshot({path: resolve(output, `${name}-forced-colors.png`)});
      assert.match(await specimen('ProcessTracker').ariaSnapshot(), /Complete|Active|Pending/);
    });
    assert.deepEqual(errors, []);
  } catch (error) {
    results.push({browser: name, result: 'fail', message: error.message});
    await page.screenshot({path: resolve(output, `${name}-failure.png`)});
    console.error(error);
  } finally {
    await browser.close();
    await writeFile(resolve(output, 'results.json'), JSON.stringify(results, null, 2));
  }
}
if (results.some((result) => result.result === 'fail')) process.exitCode = 1;
