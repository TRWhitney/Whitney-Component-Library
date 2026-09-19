/* global document, innerWidth, innerHeight */
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
  const button = (label) => page.getByRole('button', {name: label, exact: true});
  const mode = (label) =>
    page.getByRole('radio', {name: label, exact: true}).locator('xpath=ancestor::label[1]').click();
  const source = () => page.locator('.editor-session:visible textarea').inputValue();
  const navigate = async (label) => {
    if (page.viewportSize().width <= 760) await button('Open document navigator').click();
    await page.getByRole('link', {name: label, exact: true}).click();
  };
  const check = async (label) =>
    page
      .getByRole('checkbox', {name: label, exact: true})
      .locator('xpath=ancestor::label[1]')
      .click();
  const radio = async (label) =>
    page
      .getByRole('radio', {name: new RegExp(`^${label}`)})
      .locator('xpath=ancestor::label[1]')
      .click();
  const fit = async () =>
    assert.equal(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <= innerWidth &&
          document.documentElement.scrollHeight <= innerHeight,
      ),
      true,
      'page fits viewport',
    );
  try {
    await page.goto(process.env.DOCKET_URL || 'http://localhost:5177');
    await page.getByRole('textbox', {name: 'Document content', exact: true}).waitFor();
    await navigate('Handover register');
    await page.goBack();
    await page.locator('.document-titlebar h1').waitFor();
    await mode('Source');
    await page.getByRole('textbox', {name: 'Document content', exact: true}).click();
    await page.keyboard.press('Control+End');
    await page.keyboard.insertText('\n\nSelection remains');
    for (let i = 0; i < 7; i++) await page.keyboard.press('Shift+ArrowLeft');
    const draft = await source();
    await navigate('Handover register');
    const grid = page.getByRole('grid', {name: 'Handover documents'});
    await grid.getByRole('row', {name: 'Handover brief NS-01', exact: true}).click();
    await grid.getByRole('row', {name: 'Opening checklist NS-03', exact: true}).click();
    await button('Mark 1 ready').click();
    assert.match(
      await grid.getByRole('row', {name: 'Handover brief NS-01', exact: true}).innerText(),
      /Unsaved/,
    );
    assert.match(
      await grid.getByRole('row', {name: 'Opening checklist NS-03', exact: true}).innerText(),
      /Ready/,
    );
    await button('Clear selection').click();
    const checklistRow = grid.getByRole('row', {name: 'Opening checklist NS-03', exact: true});
    await checklistRow.focus();
    await page.keyboard.press('Space');
    assert.equal(await checklistRow.getAttribute('aria-selected'), 'true');
    await page.keyboard.press('Shift+F10');
    await page.getByRole('menuitem', {name: 'Open document', exact: true}).waitFor();
    await page.keyboard.press('Escape');
    await button('Clear selection').click();
    await grid.getByRole('columnheader', {name: 'Document', exact: true}).click();
    assert.match(await grid.getByRole('row').nth(1).innerText(), /Team contacts/);
    await page.getByRole('searchbox', {name: 'Search register'}).fill('no-such-document');
    await page.getByText('No documents match these filters', {exact: true}).waitFor();
    await button('Clear filters').last().click();
    await button('Any owner Owner').click();
    await page.getByRole('option', {name: 'Jamie Chen', exact: true}).click();
    assert.equal(await grid.getByRole('row').count(), 2);
    await navigate('Commissioning review');
    await navigate('Handover register');
    assert.equal(await grid.getByRole('row').count(), 2);
    await navigate('Documents');
    assert.equal(await source(), draft);
    await button('Bold').click();
    assert.match(await source(), /Selection \*\*remains\*\*/);
    await navigate('Commissioning review');
    await page.screenshot({
      path: resolve(output, `${name}-review-desktop.png`),
      animations: 'disabled',
    });
    await button('Create review document').click();
    await page.locator('.review-errors').waitFor();
    assert.equal(
      await page.locator('.review-errors').evaluate((el) => el === document.activeElement),
      true,
    );
    await radio('Pass');
    await button('Create review document').click();
    assert.equal(await page.getByRole('dialog', {name: 'Record system review'}).count(), 0);
    await check('Occupied test completed');
    await check('Night purge schedule verified');
    await page
      .getByRole('textbox', {name: 'Review notes', exact: true})
      .fill('Occupied test accepted. Retain September settings.');
    await page.locator('.review-attachments input[type=file]').setInputFiles({
      name: 'sensor-check.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Calibration confirmed'),
    });
    await page.getByRole('button', {name: 'Remove sensor-check.txt'}).waitFor();
    await page.locator('.review-attachments input[type=file]').setInputFiles({
      name: 'oversize.txt',
      mimeType: 'text/plain',
      buffer: Buffer.alloc(8 * 1024 * 1024 + 1),
    });
    await page.getByText('Evidence not attached', {exact: true}).waitFor();
    assert.equal(await button('Remove oversize.txt').count(), 0);
    await page
      .getByRole('grid', {name: 'Commissioning systems'})
      .getByRole('row', {name: 'Dome drive', exact: true})
      .click();
    await page
      .getByRole('grid', {name: 'Commissioning systems'})
      .getByRole('row', {name: 'Ventilation', exact: true})
      .click();
    assert.equal(
      await page.getByRole('textbox', {name: 'Review notes', exact: true}).inputValue(),
      'Occupied test accepted. Retain September settings.',
    );
    await button('Choose review date Review date').click();
    await page.getByRole('dialog').waitFor();
    await page.keyboard.press('Escape');
    await button('Create review document').click();
    await page.getByRole('dialog', {name: 'Record system review'}).waitFor();
    await button('Create document').click();
    await page.locator('.document-titlebar h1').filter({hasText: 'Ventilation review'}).waitFor();
    await mode('Source');
    assert.match(await source(), /Decision: \*\*Pass\*\*/);
    assert.match(await source(), /sensor-check.txt/);
    assert.match(await page.locator('.document-status').innerText(), /Unsaved/);
    await button('Save').click();
    await page.locator('.document-status').filter({hasText: 'All changes saved'}).waitFor();
    await button('Mark ready').click();
    await navigate('Handover register');
    // Filters persist, so clear the owner chip to reveal the new document.
    await button('Clear filters').first().click();
    await grid.getByRole('row', {name: /Ventilation review/}).waitFor();
    assert.match(await grid.getByRole('row', {name: /Ventilation review/}).innerText(), /Ready/);
    await page.screenshot({
      path: resolve(output, `${name}-register-desktop.png`),
      animations: 'disabled',
    });
    await page
      .locator('.application-bar')
      .getByRole('button', {name: /Review packet/})
      .click();
    const download = page.waitForEvent('download');
    await page.getByRole('button', {name: /^Export [0-9]+ documents$/}).click();
    assert.match(await readFile(await (await download).path(), 'utf8'), /Ventilation review/);
    await page.getByRole('dialog', {name: 'Handover packet'}).waitFor({state: 'hidden'});
    await page.setViewportSize({width: 390, height: 844});
    await fit();
    await button('Filter documents').click();
    await page.getByRole('searchbox', {name: 'Search register'}).fill('not-present');
    await button('Show 0 documents').click();
    await page.getByText('No documents match these filters', {exact: true}).waitFor();
    await button('Clear filters').last().click();
    await page.screenshot({
      path: resolve(output, `${name}-register-phone.png`),
      animations: 'disabled',
    });
    await navigate('Commissioning review');
    await button('Ventilation System to review').click();
    await page.getByRole('option', {name: 'Visitor access', exact: true}).click();
    await page.getByRole('textbox', {name: 'Review notes', exact: true}).fill('');
    await button('Create review document').click();
    await page.locator('.review-errors').waitFor();
    await page
      .getByRole('textbox', {name: 'Review notes', exact: true})
      .fill('Keep west stair closed pending inspection.');
    await page.screenshot({
      path: resolve(output, `${name}-hold-phone.png`),
      animations: 'disabled',
    });
    await fit();
    await button('Create review document').click();
    await button('Create document').click();
    await page
      .locator('.document-titlebar h1')
      .filter({hasText: 'Visitor access review'})
      .waitFor();
    await mode('Source');
    assert.match(await source(), /Decision: \*\*Hold\*\*/);
    assert.match(await source(), /\[ \] West stair/);
    await navigate('Commissioning review');
    await button('Open review document').waitFor();
    for (const width of [320, 768, 1100, 1440]) {
      await page.setViewportSize({width, height: width === 320 ? 650 : 900});
      await page.waitForTimeout(150);
      await fit();
      await page.screenshot({
        path: resolve(output, `${name}-review-${width}.png`),
        animations: 'disabled',
      });
    }
    assert.deepEqual(errors, []);
    console.log(
      `${name}: register, retained editor selection, pass/hold reviews, attachments, generated document, save/readiness/export, phone filters and bounded layouts passed`,
    );
  } catch (error) {
    await page.screenshot({path: resolve(output, `${name}-expansion-failure.png`)});
    console.log(await page.locator('body').ariaSnapshot());
    throw error;
  } finally {
    await browser.close();
  }
}
