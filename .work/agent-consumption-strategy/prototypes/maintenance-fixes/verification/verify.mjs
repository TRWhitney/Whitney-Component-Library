// Run from any directory: node <this-file>
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {waitForFocus, waitForVisualState, assertTextContrast} from './testing.mjs';

const browser = await chromium.launch();
const page = await browser.newPage();
const results = [];
async function check(name, test) {
  const started = Date.now();
  await test();
  results.push({name, pass: true, milliseconds: Date.now() - started});
  console.log(`PASS ${name}`);
}
try {
  await check('delayed focus resolves a replacement through the locator', async () => {
    await page.setContent('<button id="target">Target</button><button id="other">Other</button>');
    await page.evaluate(() => {
      setTimeout(() => {
        const replacement = document.createElement('button');
        replacement.id = 'target';
        replacement.textContent = 'Replacement';
        document.querySelector('#target').replaceWith(replacement);
        requestAnimationFrame(() => requestAnimationFrame(() => replacement.focus()));
      }, 120);
    });
    await waitForFocus(page.locator('#target'));
    assert.equal(await page.locator('#target').textContent(), 'Replacement');
  });
  await check('momentary correct focus cannot conceal subsequent wrong focus', async () => {
    await page.evaluate(() => {
      document.querySelector('#target').focus();
      requestAnimationFrame(() =>
        requestAnimationFrame(() => document.querySelector('#other').focus()),
      );
    });
    await assert.rejects(
      waitForFocus(page.locator('#target'), {timeout: 300}),
      /Expected stable focus/,
    );
  });
  await check('missing focus target fails at the configured deadline', async () => {
    await assert.rejects(waitForFocus(page.locator('#missing'), {timeout: 200}), /"count":0/);
  });
  await check('permanent wrong focus fails at the configured deadline', async () => {
    await page.locator('#other').focus();
    await assert.rejects(
      waitForFocus(page.locator('#target'), {timeout: 200}),
      /Expected stable focus/,
    );
  });
  await check('ambiguous focus target fails without masking a selector error', async () => {
    await assert.rejects(waitForFocus(page.locator('button')), /matching one element/);
  });
  await check('finite theme transition finishes before contrast is measured', async () => {
    await page.setContent(
      '<style>body {background:white} p {color:white;transition:color 220ms linear}</style><p id="sample">Readable after transition</p>',
    );
    await page.evaluate(() => {
      const target = document.querySelector('#sample');
      getComputedStyle(target).color;
      requestAnimationFrame(() => {
        target.style.color = 'black';
      });
    });
    const samples = await assertTextContrast(page.locator('#sample'));
    assert.equal(samples.length, 1);
    assert.equal(samples[0].ratio, 21);
    assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
  });
  await check('new animations queued during settling also finish', async () => {
    await page.evaluate(() => {
      const target = document.querySelector('#sample');
      const first = target.animate([{opacity: 0.2}, {opacity: 1}], {duration: 90});
      first.onfinish = () => {
        target.animate([{opacity: 0.2}, {opacity: 1}], {duration: 90});
      };
    });
    await waitForVisualState(page);
    assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
  });
  await check('permanent low contrast fails after settling', async () => {
    await page.setContent('<p style="color:#bbb;background:white">Unreadable</p>');
    await assert.rejects(assertTextContrast(page.locator('p')), /Text contrast below minimum/);
  });
  await check('infinite animation fails rather than being disabled or ignored', async () => {
    await page
      .locator('p')
      .evaluate((target) =>
        target.animate([{opacity: 0.2}, {opacity: 1}], {duration: 100, iterations: Infinity}),
      );
    await assert.rejects(waitForVisualState(page, {timeout: 200}), /activeAnimations":1/);
  });
  await check('unsupported rendering requires review', async () => {
    await page.setContent(
      '<p style="background:linear-gradient(white,black)">Review this background</p>',
    );
    await assert.rejects(assertTextContrast(page.locator('p')), /needs visual review/);
  });
  await check('empty and missing contrast roots fail', async () => {
    await page.setContent('<main></main>');
    await assert.rejects(assertTextContrast(page.locator('main')), /No supported visible text/);
    await assert.rejects(assertTextContrast(page.locator('p')), /requires one root/);
  });
  await check('composited translucent text and backgrounds keep their actual ratio', async () => {
    await page.setContent(
      '<main style="background:black"><p style="background:rgba(255,255,255,.5);color:rgba(255,255,255,.5)">Blended</p></main>',
    );
    await assert.rejects(assertTextContrast(page.locator('p')), /Text contrast below minimum/);
  });
} finally {
  await browser.close();
  await writeFile(
    new URL('./evidence.json', import.meta.url),
    JSON.stringify({node: process.version, results}, null, 2) + '\n',
  );
}
