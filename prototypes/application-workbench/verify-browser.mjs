/* global document, innerWidth */
import assert from 'node:assert/strict';
import {mkdir, readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const {chromium, firefox} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const output = process.env.DOCKET_EVIDENCE || '/tmp/docket-proof';
await mkdir(output, {recursive: true});
for (const [name, engine, executablePath] of [
  ['chromium', chromium, process.env.CHROMIUM_EXECUTABLE],
  ['firefox', firefox, process.env.FIREFOX_EXECUTABLE],
]) {
  const browser = await engine.launch(executablePath ? {executablePath} : {});
  const page = await browser.newPage({viewport: {width: 1440, height: 900}});
  page.setDefaultTimeout(8000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const mode = (label) =>
    page.getByRole('radio', {name: label, exact: true}).locator('xpath=ancestor::label[1]').click();
  const editor = () => page.getByRole('textbox', {name: 'Document content', exact: true});
  const source = () => page.locator('.editor-session:visible textarea').inputValue();
  const button = (label) => page.getByRole('button', {name: label, exact: true});
  const settings = async () => {
    await button('Demo controls').click();
    await page.getByRole('dialog', {name: 'Demo controls'}).waitFor();
  };
  const saveStatus = () => page.locator('.document-status');
  const waitText = async (locator, text) => {
    await locator.filter({hasText: text}).waitFor();
  };
  try {
    await page.goto(process.env.DOCKET_URL || 'http://localhost:5177');
    await editor().waitFor();
    await page.screenshot({animations: 'disabled', path: resolve(output, `${name}-desktop.png`)});
    assert.equal(await page.locator('main').count(), 1);
    const summary = page.getByRole('textbox', {name: 'Summary', exact: true});
    await summary.focus();
    await summary.evaluate((el) => el.setSelectionRange(4, 9));
    await page.setViewportSize({width: 390, height: 844});
    await page.waitForTimeout(350);
    assert.equal(
      await summary.evaluate((el) => el === document.activeElement),
      true,
      'inspector focus transfers into the drawer',
    );
    assert.deepEqual(await summary.evaluate((el) => [el.selectionStart, el.selectionEnd]), [4, 9]);
    await page.setViewportSize({width: 1440, height: 900});
    await page.waitForTimeout(350);
    assert.equal(
      await summary.evaluate((el) => el === document.activeElement),
      true,
      'inspector focus transfers back into the pane',
    );
    await page.getByRole('searchbox', {name: 'Find a document'}).focus();
    await page.setViewportSize({width: 390, height: 844});
    await page.waitForTimeout(350);
    assert.equal(
      await page
        .getByRole('searchbox', {name: 'Find a document'})
        .evaluate((el) => el === document.activeElement),
      true,
    );
    await page.setViewportSize({width: 1440, height: 900});
    await page.waitForTimeout(350);

    await mode('Source');
    await editor().click();
    await page.keyboard.press('Control+Home');
    await page.keyboard.press('Control+A');
    await page.keyboard.insertText('# Handover brief\n\nAlpha beta gamma.');
    await page.keyboard.press('Control+Home');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Home');
    for (let i = 0; i < 5; i++) await page.keyboard.press('Shift+ArrowRight');
    await mode('Read');
    await mode('Write');
    await mode('Source');
    await button('Bold').click();
    assert.equal(
      await source(),
      '# Handover brief\n\n**Alpha** beta gamma.',
      'mode changes must retain the source selection',
    );
    await button('Undo').click();
    assert.equal(await source(), '# Handover brief\n\nAlpha beta gamma.');
    await page.getByRole('link', {name: 'Team contacts', exact: true}).click();
    await page.getByRole('link', {name: 'Handover brief *', exact: true}).click();
    assert.equal(
      await source(),
      '# Handover brief\n\nAlpha beta gamma.',
      'navigation must retain unsaved drafts',
    );
    await button('Bold').click();
    assert.match(await source(), /\*\*Alpha\*\*/, 'navigation must retain selection');
    await button('Save').click();
    await editor().click();
    await page.keyboard.press('Control+End');
    await page.keyboard.insertText(' Later edit.');
    await page.waitForTimeout(1100);
    assert.match(
      await saveStatus().innerText(),
      /Unsaved changes/,
      'edits during save remain dirty',
    );
    await page.keyboard.press('Control+s');
    await waitText(saveStatus(), 'All changes saved');
    await button('Mark ready').click();
    await waitText(page.locator('.readiness'), 'Ready for handover');
    await page
      .getByRole('button', {name: /^Review packet/})
      .first()
      .click();
    const review = page.getByRole('dialog', {name: 'Review handover packet'});
    await review.waitFor();
    const downloadPromise = page.waitForEvent('download');
    await review.getByRole('button', {name: 'Export 3 documents'}).click();
    const exported = await downloadPromise;
    const contents = await readFile(await exported.path(), 'utf8');
    assert.match(contents, /Later edit\./);
    assert.match(contents, /Commissioning notes/);
    assert.doesNotMatch(contents, /# Opening checklist/);
    await page.getByRole('textbox', {name: 'Summary', exact: true}).fill('Updated handover scope.');
    assert.match(await saveStatus().innerText(), /Unsaved changes/);
    assert.match(await page.locator('.readiness').innerText(), /Draft/);
    await settings();
    await page
      .getByRole('switch', {name: 'Simulate save failure'})
      .locator('xpath=ancestor::label[1]')
      .click();
    await button('Close demo controls').click();
    await button('Save').click();
    await page.getByText('Document not saved', {exact: true}).waitFor();
    assert.match(await source(), /Later edit/);
    await page.screenshot({
      animations: 'disabled',
      path: resolve(output, `${name}-save-error.png`),
    });
    await button('Reconnect').click();
    await button('Save').click();
    await waitText(saveStatus(), 'All changes saved');
    // Overlay restoration and keyboard menu operation.
    await button('More document actions').click();
    await page.getByRole('menu').waitFor();
    await page.keyboard.press('Escape');
    await page.waitForFunction(
      () => document.activeElement?.getAttribute('aria-label') === 'More document actions',
    );
    assert.equal(
      await button('More document actions').evaluate((el) => el === document.activeElement),
      true,
    );
    await button('More document actions').focus();
    await page.keyboard.press('Enter');
    await page.getByRole('menuitem', {name: 'Duplicate document'}).focus();
    await page.keyboard.press('Enter');
    await page.getByRole('heading', {name: 'Handover brief copy', exact: true}).waitFor();
    await page.getByRole('link', {name: 'Commissioning notes', exact: true}).click();
    await page
      .locator('.reference-chart')
      .getByText('Control-room temperature', {exact: true})
      .waitFor();
    await page.locator('.reference-chart').scrollIntoViewIfNeeded();
    await page.screenshot({animations: 'disabled', path: resolve(output, `${name}-readings.png`)});
    await page.getByRole('link', {name: 'Handover brief', exact: true}).click();
    await mode('Source');
    // A source selection survives the live desktop-to-phone transition.
    await editor().click();
    await page.keyboard.press('Control+End');
    for (let i = 0; i < 5; i++) await page.keyboard.press('Shift+ArrowLeft');
    const preResize = await source();
    await page.setViewportSize({width: 390, height: 844});
    await button('Italic').click();
    assert.notEqual(await source(), preResize);
    await button('Undo').click();
    assert.equal(await source(), preResize);
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true,
    );
    await mode('Write');
    await page.screenshot({animations: 'disabled', path: resolve(output, `${name}-phone.png`)});
    // Narrow navigation and details drawers use the same controlled document state.
    await button('Open document navigator').click();
    const nav = page.getByRole('dialog', {name: 'Project documents'});
    await nav.waitFor();
    await nav.getByRole('link', {name: 'Opening checklist'}).click();
    await nav.waitFor({state: 'hidden'});
    await page.locator('.inspector-toggle button').click();
    const details = page.getByRole('dialog', {name: 'Document details'});
    await details.waitFor();
    await details.getByRole('textbox', {name: 'Summary', exact: true}).fill('Phone review notes.');
    await page.screenshot({
      animations: 'disabled',
      path: resolve(output, `${name}-phone-details.png`),
    });
    await button('Close document details').click();
    assert.match(await saveStatus().innerText(), /Unsaved changes/);
    await button('Open document navigator').click();
    await nav.getByRole('searchbox', {name: 'Find a document'}).fill('No matching record');
    await nav.getByText('No matching documents', {exact: true}).waitFor();
    await nav.getByRole('button', {name: 'Clear search'}).click();
    await nav.getByRole('button', {name: 'New document', exact: true}).click();
    const create = page.getByRole('dialog', {name: 'New document', exact: true});
    await create.waitFor();
    await create.getByRole('textbox', {name: 'New document title'}).fill('Night-shift notes');
    await create.getByRole('button', {name: 'Create document'}).click();
    await editor().waitFor();
    assert.equal(await source(), '');
    await mode('Read');
    await page.screenshot({
      animations: 'disabled',
      path: resolve(output, `${name}-empty-document.png`),
    });
    await mode('Source');
    await editor().click();
    await page.keyboard.insertText('# Night-shift notes\n\nKeep the west stair closed.');
    await button('Save').click();
    await waitText(saveStatus(), 'All changes saved');
    await settings();
    await button('Simulate loading error').click();
    await page.getByRole('status', {name: 'Loading documents'}).waitFor();
    await page.screenshot({animations: 'disabled', path: resolve(output, `${name}-loading.png`)});
    await page.getByText('The documents could not be loaded', {exact: true}).waitFor();
    await page.screenshot({
      animations: 'disabled',
      path: resolve(output, `${name}-load-error.png`),
    });
    await button('Try again').click();
    await editor().waitFor();
    assert.match(await source(), /west stair/);
    await settings();
    await button('Show empty workspace').click();
    await page.getByText('Start a handover document', {exact: true}).waitFor();
    await page.screenshot({
      animations: 'disabled',
      path: resolve(output, `${name}-empty-workspace.png`),
    });
    await settings();
    await button('Restore workspace').click();
    await editor().waitFor();
    assert.match(await source(), /west stair/);
    await settings();
    await page
      .getByRole('switch', {name: 'Dark appearance'})
      .locator('xpath=ancestor::label[1]')
      .click();
    await button('Close demo controls').click();
    await page.screenshot({
      animations: 'disabled',
      path: resolve(output, `${name}-dark-phone.png`),
    });
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.setViewportSize({width: 1440, height: 900});
    await page.screenshot({
      animations: 'disabled',
      path: resolve(output, `${name}-dark-desktop.png`),
    });
    const align = await page.evaluate(() => {
      const track = document.querySelector('[data-wcl-segment-track]').getBoundingClientRect();
      const save = document.querySelector('.editing-controls button').getBoundingClientRect();
      return {
        trackHeight: track.height,
        saveHeight: save.height,
        centerDelta: Math.abs(track.y + track.height / 2 - save.y - save.height / 2),
        overflow: document.documentElement.scrollWidth - innerWidth,
      };
    });
    assert(align.centerDelta < 1, JSON.stringify(align));
    assert(Math.abs(align.trackHeight - align.saveHeight) < 2, JSON.stringify(align));
    assert.equal(align.overflow, 0);
    await page.setViewportSize({width: 320, height: 650});
    await page.waitForTimeout(250);
    assert.equal(
      await page
        .locator('.application-bar button')
        .evaluateAll((buttons) =>
          buttons.every((button) => button.getBoundingClientRect().right <= innerWidth),
        ),
      true,
      'all header controls fit a 320px phone',
    );
    await page.screenshot({animations: 'disabled', path: resolve(output, `${name}-320.png`)});

    assert.deepEqual(errors, []);
    console.log(
      `${name}: document workflow, selection, save races, export, drawers, failure recovery, empty/loading states, themes and alignment PASS`,
      align,
    );
  } catch (error) {
    await page.screenshot({animations: 'disabled', path: resolve(output, `${name}-failure.png`)});
    console.error(await page.locator('body').ariaSnapshot());
    throw error;
  } finally {
    await browser.close();
  }
}
