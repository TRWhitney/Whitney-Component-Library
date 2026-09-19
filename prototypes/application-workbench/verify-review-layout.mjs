/* global document, innerWidth, innerHeight */
import assert from 'node:assert/strict';
const {chromium, firefox} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
for (const [name, engine, executablePath] of [
  ['chromium', chromium, process.env.CHROMIUM_EXECUTABLE],
  ['firefox', firefox, process.env.FIREFOX_EXECUTABLE],
]) {
  const browser = await engine.launch(executablePath ? {executablePath} : {});
  const page = await browser.newPage({viewport: {width: 2560, height: 1440}});
  try {
    await page.goto(process.env.DOCKET_URL || 'http://localhost:5177/#commissioning');
    await page.getByRole('heading', {name: 'Commissioning review', exact: true}).waitFor();
    for (const [width, height] of [
      [2560, 1440],
      [2048, 1120],
      [1440, 900],
    ]) {
      await page.setViewportSize({width, height});
      await page.waitForTimeout(250);
      const chart = await page.locator('.review-chart').boundingBox();
      const actions = await page.locator('.review-actions').boundingBox();
      assert(chart && actions);
      assert(chart.height <= 390, `chart should stay compact at ${width}: ${chart.height}`);
      assert(
        chart.y + chart.height <= actions.y,
        `all chart axes should be visible above actions at ${width}`,
      );
      const notes = await page
        .getByRole('textbox', {name: 'Review notes', exact: true})
        .boundingBox();
      assert(
        notes && notes.y + notes.height <= actions.y,
        `notes should fit above the action bar at ${width}`,
      );
      const scrolls = await page.evaluate(() =>
        [...document.querySelectorAll('.system-review, .review-form, .review-evidence')].map(
          (el) => ({
            label: el.className,
            x: el.scrollWidth - el.clientWidth,
            y: el.scrollHeight - el.clientHeight,
          }),
        ),
      );
      assert(
        scrolls.every((s) => s.x <= 1 && s.y <= 1),
        `default review needs no scrolling at ${width}: ${JSON.stringify(scrolls)}`,
      );
      assert.equal(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <= innerWidth &&
            document.documentElement.scrollHeight <= innerHeight,
        ),
        true,
      );
    }

    const notes = page.getByRole('textbox', {name: 'Review notes', exact: true});
    await notes.fill('Keep this review draft through resizing.');
    const separator = page.getByRole('separator', {name: 'Resize review and evidence'});
    await separator.focus();
    await page.keyboard.press('End');
    assert.equal(await notes.inputValue(), 'Keep this review draft through resizing.');
    await page.getByRole('button', {name: 'Hide review evidence', exact: true}).click();
    await page.getByRole('button', {name: 'Show review evidence', exact: true}).click();
    await page.getByRole('button', {name: 'Hide review form', exact: true}).click();
    await page.getByRole('button', {name: 'Show review form', exact: true}).click();
    for (const [width, height] of [
      [1366, 768],
      [1280, 720],
      [900, 700],
      [390, 844],
      [320, 650],
    ]) {
      await page.setViewportSize({width, height});
      await page.waitForTimeout(200);
      const before = await page.locator('.review-actions').boundingBox();
      await notes.fill('Retained draft at ' + width);
      await notes.press('Control+End');
      assert.deepEqual(
        await page.locator('.review-actions').boundingBox(),
        before,
        'review actions stay fixed while the form scrolls',
      );
      assert.equal(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <= innerWidth &&
            document.documentElement.scrollHeight <= innerHeight,
        ),
        true,
      );
      assert.equal(
        await page.locator('.review-form').evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
        true,
      );
      if (width <= 1280) {
        await page.getByRole('button', {name: 'Evidence', exact: true}).click();
        const drawer = page.getByRole('dialog', {name: 'System evidence', exact: true});
        await drawer.waitFor();
        assert.equal(await drawer.evaluate((el) => el.scrollWidth <= el.clientWidth + 1), true);
        await drawer.locator('input[type=file]').setInputFiles({
          name: `evidence-${width}.txt`,
          mimeType: 'text/plain',
          buffer: Buffer.from('Review evidence'),
        });
        await page
          .getByRole('button', {name: `Remove evidence-${width}.txt`, exact: true})
          .waitFor();
        await page.getByRole('button', {name: 'Close system evidence', exact: true}).click();
        assert.equal(await notes.inputValue(), 'Retained draft at ' + width);
      }
    }
    await page.setViewportSize({width: 1440, height: 900});
    await page.getByRole('button', {name: 'Remove evidence-320.txt', exact: true}).waitFor();
    await page.setViewportSize({width: 390, height: 844});
    await page.getByRole('button', {name: 'Evidence', exact: true}).click();
    await page.getByRole('button', {name: 'Read commissioning notes', exact: true}).click();
    await page
      .getByRole('dialog', {name: 'System evidence', exact: true})
      .waitFor({state: 'hidden'});
    await page.locator('.document-titlebar h1').filter({hasText: 'Commissioning notes'}).waitFor();
    console.log(
      `${name}: review geometry, fixed controls, resizing, evidence drawer and retained drafts/files PASS`,
    );
  } finally {
    await browser.close();
  }
}
