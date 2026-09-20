import assert from 'node:assert/strict';
import {mkdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const output = resolve(process.env.RELEASE_EVIDENCE || '/tmp/wcl-release-evidence');
await mkdir(output, {recursive: true});
const browser = await chromium.launch();
const reports = [];
try {
  for (const [name, url] of [
    ['showcase', process.env.SHOWCASE_URL || 'http://localhost:5173'],
    ['showcase-light', process.env.SHOWCASE_URL || 'http://localhost:5173'],
    ['showcase-compact', process.env.SHOWCASE_URL || 'http://localhost:5173'],
    ['showcase-compact-wide', process.env.SHOWCASE_URL || 'http://localhost:5173'],
    ['operational', process.env.OPERATIONAL_URL || 'http://localhost:5179'],
    ['energy', process.env.ANALYSIS_URL || 'http://localhost:5174'],
    ['fieldnotes', process.env.MARKDOWN_URL || 'http://localhost:5176'],
    ['docket', process.env.DOCKET_URL || 'http://localhost:5177'],
  ]) {
    const context = await browser.newContext({
      viewport: {width: name === 'showcase-compact' ? 390 : 1440, height: 1000},
    });
    const page = await context.newPage();
    await page.goto(url);
    await page.getByRole('main').waitFor();
    if (name === 'showcase-light') {
      await page.getByRole('button', {name: 'Dark', exact: true}).first().press('Space');
      await page.getByLabel('Accent', {exact: true}).fill('#d14f00');
    }
    if (name.startsWith('showcase-compact')) {
      await page.getByRole('switch', {name: 'Compact application density'}).press('Space');
      await page.getByLabel('Accent', {exact: true}).fill('#8e44cc');
    }
    const result = await new AxeBuilder({page})
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    await writeFile(resolve(output, `${name}-axe.json`), JSON.stringify(result, null, 2));
    const reviewed = [];
    const blocking = [];
    for (const violation of result.violations) {
      let authoredColor = violation.id === 'color-contrast';
      for (const node of violation.nodes) {
        if (!authoredColor || node.target.length !== 1 || typeof node.target[0] !== 'string') {
          authoredColor = false;
          break;
        }
        authoredColor = await page
          .locator(node.target[0])
          .evaluate((el) => el.hasAttribute('data-wcl-markdown-rgba'));
      }
      if (authoredColor) {
        reviewed.push({
          id: violation.id,
          reason:
            'Authored RGBA is preserved exactly across themes under the accepted Markdown contract. Contrast of authored colors belongs to the author/application; built-in treatments remain subject to this gate.',
        });
        continue;
      }
      // axe 4.13 parses fallback role lists as one role in this rule. Keep the raw
      // finding, and verify the actual browser semantics before classifying it.
      let fallbackMeter = violation.id === 'aria-allowed-attr';
      for (const node of violation.nodes) {
        if (!fallbackMeter || node.target.length !== 1 || typeof node.target[0] !== 'string') {
          fallbackMeter = false;
          break;
        }
        const element = page.locator(node.target[0]);
        fallbackMeter = await element.evaluate(
          (el) =>
            el.hasAttribute('data-wcl-meter') && el.getAttribute('role') === 'meter progressbar',
        );
        fallbackMeter &&= node.all.every(
          (check) =>
            Array.isArray(check.data) &&
            check.data.every((attribute) => /^aria-value(now|min|max|text)=/.test(attribute)),
        );
        fallbackMeter &&= /meter /.test(await element.ariaSnapshot());
      }
      if (fallbackMeter)
        reviewed.push({
          id: violation.id,
          reason:
            'Valid meter role with progressbar fallback; browser exposes meter. See verification.md for axe source and WAI-ARIA evidence.',
        });
      else blocking.push(violation.id);
    }
    reports.push({
      name,
      blocking,
      reviewed,
      violations: result.violations.map(({id, impact, nodes}) => ({
        id,
        impact,
        nodes: nodes.map(({target, html, failureSummary}) => ({target, html, failureSummary})),
      })),
      incomplete: result.incomplete.map(({id, nodes}) => ({id, count: nodes.length})),
    });
    console.log(name, JSON.stringify(reports.at(-1), null, 2));
    await context.close();
  }
} finally {
  await browser.close();
  await writeFile(resolve(output, 'accessibility.json'), JSON.stringify(reports, null, 2));
}
assert(
  reports.every((report) => report.blocking.length === 0),
  'Review accessibility.json and the complete axe reports. Incomplete checks require manual review.',
);
