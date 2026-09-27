/* global document, getComputedStyle, innerWidth, NodeFilter */
// Independent, frozen browser evaluation. Does not read or modify application source.
// node check.mjs <app-directory> <evidence-directory> <port> [--only=<scenario>]
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdir, writeFile} from 'node:fs/promises';
import {createServer} from 'node:net';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const [appArgument, outputArgument, portArgument, selection] = process.argv.slice(2);
const mode = 'archive';
const only = selection?.startsWith('--only=') ? selection.slice(7) : undefined;
const port = Number(portArgument);
if (
  !appArgument ||
  !outputArgument ||
  !Number.isInteger(port) ||
  port < 1024 ||
  port > 65535 ||
  (selection !== undefined && only === undefined)
)
  throw new Error(
    'Usage: node check.mjs <app-directory> <evidence-directory> <port> [--only=<scenario>]',
  );
const app = resolve(appArgument);
const output = resolve(outputArgument);
const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const origin = `http://127.0.0.1:${port}`;
const timeout = 4000;
const delay = (ms) => new Promise((done) => setTimeout(done, ms));
const seeds = [
  {name: 'Alpine shelter', category: 'Shelter', weight: 1800},
  {name: 'Pocket stove', category: 'Cooking', weight: 240},
  {name: 'Headlamp', category: 'Lighting', weight: 85},
];
const longName =
  'Expedition shelter with extended vestibule and reinforced storm panels for high altitude winter camping';
const evidence = {
  app,
  origin,
  mode,
  started: new Date().toISOString(),
  boundaries: [
    'Chromium only. Each scenario uses a fresh page in both appearances and at both widths. Optional scenario selection is for checker proof; candidate evaluation uses the full suite.',
    'Accessible roles and exact requested names select controls; no dependency-internal selectors are used.',
    'Computed contrast composites transparent ancestor backgrounds over the browser white canvas. Ancestor opacity, gradients/images, filters and text shadows make affected samples unverified.',
    'Text contrast excludes hidden text, disabled controls, placeholders, generated content, SVG and canvas. These remain for screenshot review.',
    'Focus styles and screenshots are evidence, not an automatic visibility or accessibility verdict. Tab containment is sampled.',
    'Stable data IDs, supported styling APIs and private selector overrides require separate source review. Duplicate behavior and repeated names are tested here.',
    'Human style and feel acceptance is unmeasured. Screenshots and focus styles support separate review. Role-based views accept button, tab or radio; no particular layout is required.',
  ],
  scenarios: [],
  artifacts: [],
};
let browser;
let server;
let serverLog = '';

function assert(condition, message, observed) {
  if (!condition) {
    const error = new Error(message);
    error.observed = observed;
    throw error;
  }
  return observed;
}
async function poll(read, accept, description) {
  const started = Date.now();
  let observed;
  let lastError;
  while (Date.now() - started < timeout) {
    try {
      observed = await read();
      if (accept(observed)) return observed;
    } catch (error) {
      lastError = error.message;
    }
    await delay(40);
  }
  assert(false, `${description}${lastError ? `: ${lastError}` : ''}`, observed);
}
const articles = (page) => page.getByRole('article');
const item = (page, name) => page.getByRole('article', {name, exact: true});
const button = (root, name) => root.getByRole('button', {name, exact: true});
const search = (page) =>
  page
    .getByRole('textbox', {name: 'Search items', exact: true})
    .or(page.getByRole('searchbox', {name: 'Search items', exact: true}));
const dialog = (page, type) => page.getByRole('dialog', {name: `${type} item`, exact: true});
const nameField = (page) =>
  dialog(page, 'Edit').getByRole('textbox', {name: 'Item name', exact: true});
const themeControl = (page) =>
  page
    .getByRole('checkbox', {name: 'Dark appearance', exact: true})
    .or(page.getByRole('switch', {name: 'Dark appearance', exact: true}));
async function toggleTheme(page) {
  const control = themeControl(page);
  const before = await control.isChecked();
  await control.focus();
  await page.keyboard.press('Space');
  const after = await poll(
    () => control.isChecked(),
    (checked) => checked !== before,
    'Appearance control did not toggle after keyboard activation',
  );
  return {before, after};
}
async function focusInfo(page) {
  return page.evaluate(() => {
    const node = document.activeElement;
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return {
      tag: node.tagName,
      text: node.textContent?.trim().slice(0, 100),
      label: node.getAttribute('aria-label'),
      id: node.id,
      focusVisible: node.matches(':focus-visible'),
      outline: style.outline,
      outlineOffset: style.outlineOffset,
      boxShadow: style.boxShadow,
      border: style.border,
      background: style.backgroundColor,
      color: style.color,
      rect: {x: rect.x, y: rect.y, width: rect.width, height: rect.height},
    };
  });
}
async function focused(page, target) {
  await poll(
    () => target.evaluate((node) => node === document.activeElement),
    Boolean,
    'Focus did not return to the required control',
  );
  return focusInfo(page);
}
async function closed(page) {
  await page.getByRole('dialog').waitFor({state: 'hidden'});
}
async function names(page) {
  const result = [];
  for (const article of await articles(page).all())
    result.push(await article.getByRole('heading').innerText());
  return result;
}
async function expectNames(page, expected) {
  const actual = await poll(
    () => names(page),
    (value) => JSON.stringify(value) === JSON.stringify(expected),
    'Item names or order differ',
  );
  for (const name of new Set(expected)) {
    assert(
      (await item(page, name).count()) ===
        expected.filter((candidate) => candidate === name).length,
      'Article accessible name differs from current item name',
      {name},
    );
  }
  return actual;
}
async function countText(page, visible, total) {
  const text = await page.locator('body').innerText();
  const pattern = new RegExp(`\\b${visible}\\s+of\\s+${total}\\s+items?\\b`, 'i');
  assert(pattern.test(text), 'Missing visible and total item count', {visible, total, text});
  return {visible, total};
}
async function open(page, type, name = seeds[0].name) {
  await button(item(page, name), type).click();
  await dialog(page, type).waitFor();
  return dialog(page, type).ariaSnapshot();
}
async function contain(page, type) {
  const modal = dialog(page, type);
  await poll(
    () => modal.evaluate((node) => node.contains(document.activeElement)),
    Boolean,
    'Modal did not receive focus',
  );
  const samples = [await focusInfo(page)];
  for (const key of [...Array(10).fill('Tab'), ...Array(10).fill('Shift+Tab')]) {
    await page.keyboard.press(key);
    assert(
      await modal.evaluate((node) => node.contains(document.activeElement)),
      `${key} escaped the modal`,
      await focusInfo(page),
    );
    samples.push(await focusInfo(page));
  }
  return samples;
}
async function rename(page, from, to) {
  await open(page, 'Edit', from);
  await nameField(page).fill(to);
  await button(dialog(page, 'Edit'), 'Save').click();
  await closed(page);
}
async function geometry(page) {
  return page.evaluate(() => {
    const visible = (node) => {
      const rect = node.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && getComputedStyle(node).visibility !== 'hidden';
    };
    const records = [
      ...document.querySelectorAll(
        'article,[role="article"],dialog,[role="dialog"],button,[role="button"],input,[role="textbox"],[role="searchbox"],h1,h2,h3',
      ),
    ]
      .filter(visible)
      .map((node) => {
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return {
          tag: node.tagName,
          role: node.getAttribute('role'),
          text: (node.getAttribute('aria-label') || node.textContent || '').trim().slice(0, 150),
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          scrollWidth: node.scrollWidth,
          clientWidth: node.clientWidth,
          overflowX: style.overflowX,
          background: style.backgroundColor,
          color: style.color,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
        };
      });
    return {viewportWidth: innerWidth, scrollWidth: document.documentElement.scrollWidth, records};
  });
}
function geometryVerdict(observed) {
  assert(observed.scrollWidth <= observed.viewportWidth + 1, 'Page scrolls horizontally', observed);
  const clipped = observed.records.filter(
    (rect) => rect.x < -1 || rect.x + rect.width > observed.viewportWidth + 1,
  );
  assert(
    clipped.length === 0,
    'A heading, control, article or dialog extends outside the viewport',
    clipped,
  );
  return observed;
}
// Browser code measures direct rendered text, including input values, against composited ancestors.
async function contrast(page) {
  return page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d', {willReadFrequently: true});
    const rgba = (color) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      const p = ctx.getImageData(0, 0, 1, 1).data;
      return [p[0], p[1], p[2], p[3] / 255];
    };
    const over = (a, b) => [0, 1, 2].map((i) => a[i] * a[3] + b[i] * (1 - a[3])).concat(1);
    const luminance = (color) =>
      color
        .slice(0, 3)
        .map((c) => {
          c /= 255;
          return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        })
        .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
    const samples = [];
    const measured = new Set();
    const measure = (node, text) => {
      if (!text.trim() || measured.has(node)) return;
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      if (
        !rect.width ||
        !rect.height ||
        style.visibility === 'hidden' ||
        style.display === 'none' ||
        node.closest('[aria-hidden="true"], [hidden], [inert], :disabled') ||
        style.clipPath !== 'none' ||
        style.clip !== 'auto'
      )
        return;
      measured.add(node);
      const ancestors = [];
      for (let ancestor = node; ancestor; ancestor = ancestor.parentElement)
        ancestors.unshift(ancestor);
      let background = [255, 255, 255, 1];
      const uncertain = [];
      for (const ancestor of ancestors) {
        const current = getComputedStyle(ancestor);
        background = over(rgba(current.backgroundColor), background);
        if (Number(current.opacity) !== 1) uncertain.push(`ancestor opacity ${current.opacity}`);
        if (current.backgroundImage !== 'none') uncertain.push('background image or gradient');
        if (current.filter !== 'none' || current.backdropFilter !== 'none')
          uncertain.push('filter');
      }
      if (style.textShadow !== 'none') uncertain.push('text shadow');
      const foreground = over(rgba(style.color), background);
      const a = luminance(foreground),
        b = luminance(background);
      const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      const large =
        parseFloat(style.fontSize) >= 24 ||
        (parseFloat(style.fontSize) >= 18.666 && Number(style.fontWeight) >= 700);
      samples.push({
        text: text.trim().slice(0, 180),
        tag: node.tagName,
        foreground: style.color,
        effectiveBackground: background,
        ratio,
        required: large ? 3 : 4.5,
        uncertain: [...new Set(uncertain)],
        status: uncertain.length
          ? 'unverified'
          : ratio + 0.005 >= (large ? 3 : 4.5)
            ? 'pass'
            : 'fail',
      });
    };
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.parentElement.closest('script,style,svg'))
        measure(node.parentElement, node.textContent);
    }
    for (const input of document.querySelectorAll('input,textarea')) measure(input, input.value);
    return samples;
  });
}
async function appearance(page) {
  const observed = await page.evaluate(() => {
    const background = (node) => {
      const values = [];
      for (let current = node; current; current = current.parentElement)
        values.push(getComputedStyle(current).backgroundColor);
      return values;
    };
    return {
      body: [
        background(document.body),
        background(document.elementFromPoint(5, 5) || document.body),
        background(document.elementFromPoint(innerWidth / 2, 10) || document.body),
      ],
      articles: [...document.querySelectorAll('article,[role="article"]')].map(background),
      dialogs: [...document.querySelectorAll('dialog,[role="dialog"]')].map(background),
    };
  });
  return observed;
}
async function capture(page, context, suffix) {
  await poll(
    () =>
      page.evaluate(
        () =>
          document
            .getAnimations()
            .filter(
              (animation) =>
                animation.playState === 'running' &&
                animation.effect?.getTiming().iterations !== Infinity,
            ).length,
      ),
    (value) => value === 0,
    'Finite animation did not settle',
  );
  const filename = `${context.width}-${context.theme}-${context.slug}-${suffix}.png`;
  await page.screenshot({path: resolve(output, filename), fullPage: true});
  const result = {
    screenshot: filename,
    geometry: await geometry(page),
    contrast: await contrast(page),
    appearance: await appearance(page),
    focus: await focusInfo(page),
  };
  evidence.artifacts.push({
    scenario: context.name,
    width: context.width,
    theme: context.theme,
    ...result,
  });
  return result;
}
function contrastVerdict(samples) {
  assert(samples.length > 0, 'No text contrast samples could be measured');
  assert(
    !samples.some((sample) => sample.status === 'fail'),
    'Computed text contrast below the required ratio',
    samples.filter((sample) => sample.status === 'fail'),
  );
  return {
    samples,
    status: samples.some((sample) => sample.status === 'unverified') ? 'unverified' : 'pass',
  };
}
const view = (page, name) =>
  page
    .getByRole('button', {name, exact: true})
    .or(page.getByRole('tab', {name, exact: true}))
    .or(page.getByRole('radio', {name, exact: true}));
async function viewState(control) {
  return control.evaluate((node) => ({
    selected: node.getAttribute('aria-selected'),
    checked: node.getAttribute('aria-checked'),
    pressed: node.getAttribute('aria-pressed'),
    current: node.getAttribute('aria-current'),
    nativeChecked: node.matches('input[type="radio"]') ? node.checked : undefined,
  }));
}
function isSelected(state) {
  return (
    state.nativeChecked === true ||
    [state.selected, state.checked, state.pressed].includes('true') ||
    (state.current !== null && !['false', ''].includes(state.current))
  );
}
async function selectedView(page, name) {
  const selected = await viewState(view(page, name));
  const other = await viewState(view(page, name === 'Active' ? 'Archived' : 'Active'));
  assert(
    isSelected(selected) && !isSelected(other),
    'Selected view is not exposed accessibly and exclusively',
    {name, selected, other},
  );
  return {name, selected, other};
}
async function switchView(page, name, keyboard = false) {
  const control = view(page, name);
  if (keyboard) {
    await control.focus();
    const role = await control.getAttribute('role');
    await page.keyboard.press(role === 'tab' ? 'Enter' : 'Space');
  } else await control.click();
  await poll(
    async () => isSelected(await viewState(control)),
    Boolean,
    `View ${name} did not become selected`,
  );
  return selectedView(page, name);
}
async function resultsStatus(page, visible, total) {
  const observed = await countText(page, visible, total);
  const matches = await page.locator('body').innerText();
  const phrases = matches.match(/\b\d+\s+of\s+\d+\s+items?\b/gi) || [];
  assert(phrases.length === 1, 'Expected one visible results status', phrases);
  return observed;
}
async function stableFocus(page, target) {
  await focused(page, target);
  const start = Date.now();
  const samples = [];
  while (Date.now() - start < 180) {
    assert(
      await target.evaluate((node) => document.activeElement === node),
      'Focus did not stay on its expected destination',
      await focusInfo(page),
    );
    samples.push(await focusInfo(page));
    await delay(30);
  }
  return samples;
}
async function move(page, name, action = 'Archive', method = 'pointer') {
  const control = button(item(page, name), action);
  if (method === 'pointer') await control.click();
  else {
    await control.focus();
    await page.keyboard.press(method);
  }
  await closed(page);
}
async function archiveAll(page) {
  for (const seed of seeds) await move(page, seed.name);
  await expectNames(page, []);
  await switchView(page, 'Archived');
  await expectNames(
    page,
    seeds.map((seed) => seed.name),
  );
}
async function metadata(page, name, category = 'Shelter', weight = 1800) {
  const text = await item(page, name).innerText();
  assert(text.toLowerCase().includes(category.toLowerCase()), 'Category changed or disappeared', {
    name,
    text,
  });
  assert(
    new RegExp(
      `\\b${weight.toLocaleString('en-US').replace(',', ',?')}\\s*(g\\b|grams?\\b)`,
      'i',
    ).test(text),
    'Weight changed or disappeared',
    {name, text},
  );
  return text;
}
async function actionGeometry(page) {
  const measurements = [];
  for (const article of await articles(page).all()) {
    const boxes = [];
    for (const control of await article.getByRole('button').all())
      boxes.push({name: await control.innerText(), box: await control.boundingBox()});
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i].box,
          b = boxes[j].box;
        assert(a && b, 'Action is not visibly available', boxes);
        const overlap =
          Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) > 1 &&
          Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y) > 1;
        assert(!overlap, 'Item action controls overlap', {a: boxes[i], b: boxes[j]});
      }
    const heading = article.getByRole('heading');
    const text = await heading.evaluate((node) => {
      const range = document.createRange();
      range.selectNodeContents(node);
      return [...range.getClientRects()].map((r) => ({
        x: r.x,
        y: r.y,
        width: r.width,
        height: r.height,
      }));
    });
    for (const control of boxes)
      assert(
        !text.some(
          (r) =>
            Math.min(r.x + r.width, control.box.x + control.box.width) -
              Math.max(r.x, control.box.x) >
              1 &&
            Math.min(r.y + r.height, control.box.y + control.box.height) -
              Math.max(r.y, control.box.y) >
              1,
        ),
        'Item heading overlaps an action',
        {text, control},
      );
    measurements.push({text, boxes});
  }
  return measurements;
}
async function visual(page, context, suffix) {
  const observed = await capture(page, context, suffix);
  geometryVerdict(observed.geometry);
  observed.actions = await actionGeometry(page);
  const contrastResult = contrastVerdict(observed.contrast);
  return {...observed, status: contrastResult.status};
}
async function fullNames(page) {
  const evidence = [];
  for (const article of await articles(page).all()) {
    const observed = await article.getByRole('heading').evaluate((node) => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(node);
      return {
        text: node.textContent,
        clientWidth: node.clientWidth,
        scrollWidth: node.scrollWidth,
        clientHeight: node.clientHeight,
        scrollHeight: node.scrollHeight,
        lineClamp: style.webkitLineClamp,
        rect: {x: rect.x, y: rect.y, width: rect.width, height: rect.height},
        fragments: [...range.getClientRects()].map((r) => ({
          x: r.x,
          y: r.y,
          width: r.width,
          height: r.height,
        })),
      };
    });
    assert(['none', ''].includes(observed.lineClamp), 'Long name is line-clamped', observed);
    assert(
      (!observed.clientWidth || observed.scrollWidth <= observed.clientWidth + 1) &&
        (!observed.clientHeight || observed.scrollHeight <= observed.clientHeight + 1),
      'Long name clips text',
      observed,
    );
    evidence.push(observed);
  }
  return evidence;
}
const scenarios = [];
const scenario = (name, steps) => {
  if (!only || name === only) scenarios.push({name, steps});
};
scenario('views and preserved search', [
  [
    'fresh Active state and view keyboard operation',
    async (page) => {
      await selectedView(page, 'Active');
      await expectNames(
        page,
        seeds.map((seed) => seed.name),
      );
      await resultsStatus(page, 3, 3);
      await search(page).focus();
      let reachable = false;
      for (let i = 0; i < 22; i++) {
        await page.keyboard.press('Shift+Tab');
        if (
          (await view(page, 'Active').evaluate((node) => node === document.activeElement)) ||
          (await view(page, 'Archived').evaluate((node) => node === document.activeElement))
        ) {
          reachable = true;
          break;
        }
      }
      assert(reachable, 'View controls are not reachable by sampled keyboard navigation');
      await switchView(page, 'Archived', true);
      await expectNames(page, []);
      await resultsStatus(page, 0, 0);
      await switchView(page, 'Active', true);
      return expectNames(
        page,
        seeds.map((seed) => seed.name),
      );
    },
  ],
  [
    'search and empty recovery preserve selected view',
    async (page) => {
      await move(page, 'Pocket stove');
      await search(page).fill('  STOVE  ');
      await expectNames(page, []);
      await resultsStatus(page, 0, 2);
      await switchView(page, 'Archived');
      assert((await search(page).inputValue()) === '  STOVE  ', 'Switching views changed search');
      await expectNames(page, ['Pocket stove']);
      await resultsStatus(page, 1, 1);
      await search(page).fill('no-match');
      await expectNames(page, []);
      await resultsStatus(page, 0, 1);
      await button(page, 'Clear search').click();
      assert((await search(page).inputValue()) === '', 'Clear search did not clear value');
      await selectedView(page, 'Archived');
      await expectNames(page, ['Pocket stove']);
      await resultsStatus(page, 1, 1);
      await switchView(page, 'Active');
      return expectNames(page, ['Alpine shelter', 'Headlamp']);
    },
  ],
]);
scenario('archive restore underlying order', [
  [
    'moves preserve data and original order',
    async (page) => {
      await move(page, 'Pocket stove');
      await move(page, 'Alpine shelter');
      await expectNames(page, ['Headlamp']);
      await resultsStatus(page, 1, 1);
      await switchView(page, 'Archived');
      await expectNames(page, ['Alpine shelter', 'Pocket stove']);
      await resultsStatus(page, 2, 2);
      await metadata(page, 'Alpine shelter');
      await metadata(page, 'Pocket stove', 'Cooking', 240);
      await move(page, 'Pocket stove', 'Restore');
      await move(page, 'Alpine shelter', 'Restore');
      await expectNames(page, []);
      await resultsStatus(page, 0, 0);
      await switchView(page, 'Active');
      await expectNames(
        page,
        seeds.map((seed) => seed.name),
      );
      return resultsStatus(page, 3, 3);
    },
  ],
  [
    'restoring is a move and repeated round trips stay independent',
    async (page) => {
      await move(page, 'Pocket stove');
      await switchView(page, 'Archived');
      await move(page, 'Pocket stove', 'Restore');
      await expectNames(page, []);
      await switchView(page, 'Active');
      await expectNames(
        page,
        seeds.map((seed) => seed.name),
      );
      await resultsStatus(page, 3, 3);
      return metadata(page, 'Headlamp', 'Lighting', 85);
    },
  ],
]);
for (const action of ['Archive', 'Restore'])
  scenario(`${action.toLowerCase()} neighbor focus`, [
    [
      'next, previous and empty destinations with pointer and keyboard',
      async (page) => {
        if (action === 'Restore') await archiveAll(page);
        await move(page, 'Pocket stove', action, 'Enter');
        await expectNames(page, ['Alpine shelter', 'Headlamp']);
        const next = await stableFocus(page, button(item(page, 'Headlamp'), action));
        await move(page, 'Headlamp', action, 'Space');
        await expectNames(page, ['Alpine shelter']);
        const previous = await stableFocus(page, button(item(page, 'Alpine shelter'), action));
        await move(page, 'Alpine shelter', action);
        await expectNames(page, []);
        await resultsStatus(page, 0, 0);
        const empty = await stableFocus(page, search(page));
        return {next, previous, empty};
      },
    ],
  ]);
for (const action of ['Archive', 'Restore'])
  scenario(`${action.toLowerCase()} filtered focus`, [
    [
      'focus follows only visible filtered neighbors',
      async (page) => {
        await rename(page, 'Alpine shelter', 'Match shelter');
        await rename(page, 'Headlamp', 'Match lamp');
        await button(item(page, 'Match shelter'), 'Duplicate').click();
        if (action === 'Restore') {
          await move(page, 'Match shelter');
          await move(page, 'Match shelter copy');
          await move(page, 'Pocket stove');
          await move(page, 'Match lamp');
          await switchView(page, 'Archived');
        }
        await search(page).fill('  MATCH  ');
        await expectNames(page, ['Match shelter', 'Match shelter copy', 'Match lamp']);
        await resultsStatus(page, 3, 4);
        await move(page, 'Match shelter copy', action);
        await expectNames(page, ['Match shelter', 'Match lamp']);
        await resultsStatus(page, 2, 3);
        const next = await stableFocus(page, button(item(page, 'Match lamp'), action));
        await move(page, 'Match lamp', action);
        await expectNames(page, ['Match shelter']);
        await resultsStatus(page, 1, 2);
        const previous = await stableFocus(page, button(item(page, 'Match shelter'), action));
        await move(page, 'Match shelter', action);
        await expectNames(page, []);
        await resultsStatus(page, 0, 1);
        const empty = await stableFocus(page, search(page));
        assert((await search(page).inputValue()) === '  MATCH  ', 'Move changed search');
        await button(page, 'Clear search').click();
        await selectedView(page, action === 'Archive' ? 'Active' : 'Archived');
        await expectNames(page, ['Pocket stove']);
        return {next, previous, empty};
      },
    ],
  ]);
scenario('archive restore no delayed focus theft', [
  [
    'focus moved during archive remains at search',
    async (page) => {
      const target = await search(page).elementHandle();
      await button(item(page, 'Pocket stove'), 'Archive').evaluate((node, searchNode) => {
        node.click();
        searchNode.focus();
      }, target);
      await expectNames(page, ['Alpine shelter', 'Headlamp']);
      return stableFocus(page, search(page));
    },
  ],
  [
    'focus moved during restore remains at search',
    async (page) => {
      await move(page, 'Alpine shelter');
      await switchView(page, 'Archived');
      await expectNames(page, ['Alpine shelter', 'Pocket stove']);
      const target = await search(page).elementHandle();
      await button(item(page, 'Alpine shelter'), 'Restore').evaluate((node, searchNode) => {
        node.click();
        searchNode.focus();
      }, target);
      await expectNames(page, ['Pocket stove']);
      return stableFocus(page, search(page));
    },
  ],
]);
scenario('archived copies independent state and order', [
  [
    'copies remain archived and insert after their source',
    async (page) => {
      await move(page, 'Alpine shelter');
      await switchView(page, 'Archived');
      await button(item(page, 'Alpine shelter'), 'Duplicate').click();
      await closed(page);
      await stableFocus(page, button(item(page, 'Alpine shelter'), 'Duplicate'));
      await expectNames(page, ['Alpine shelter', 'Alpine shelter copy']);
      await resultsStatus(page, 2, 2);
      await metadata(page, 'Alpine shelter copy');
      await button(item(page, 'Alpine shelter'), 'Duplicate').click();
      await expectNames(page, ['Alpine shelter', 'Alpine shelter copy', 'Alpine shelter copy']);
      await resultsStatus(page, 3, 3);
      await button(item(page, 'Alpine shelter copy').nth(0), 'Edit').click();
      await nameField(page).fill('Independent copy');
      await button(dialog(page, 'Edit'), 'Save').click();
      await closed(page);
      await stableFocus(page, button(item(page, 'Independent copy'), 'Edit'));
      return expectNames(page, ['Alpine shelter', 'Independent copy', 'Alpine shelter copy']);
    },
  ],
  [
    'copy restoration and nested duplication preserve originals',
    async (page) => {
      await button(item(page, 'Independent copy'), 'Duplicate').click();
      await stableFocus(page, button(item(page, 'Independent copy'), 'Duplicate'));
      await expectNames(page, [
        'Alpine shelter',
        'Independent copy',
        'Independent copy copy',
        'Alpine shelter copy',
      ]);
      await move(page, 'Independent copy', 'Restore');
      await expectNames(page, ['Alpine shelter', 'Independent copy copy', 'Alpine shelter copy']);
      await resultsStatus(page, 3, 3);
      await switchView(page, 'Active');
      await expectNames(page, ['Independent copy', 'Pocket stove', 'Headlamp']);
      await resultsStatus(page, 3, 3);
      await metadata(page, 'Independent copy');
      await move(page, 'Independent copy');
      await switchView(page, 'Archived');
      await expectNames(page, [
        'Alpine shelter',
        'Independent copy',
        'Independent copy copy',
        'Alpine shelter copy',
      ]);
      await open(page, 'Delete', 'Independent copy');
      await button(dialog(page, 'Delete'), 'Delete item').click();
      await closed(page);
      await stableFocus(page, search(page));
      await expectNames(page, ['Alpine shelter', 'Independent copy copy', 'Alpine shelter copy']);
      await switchView(page, 'Active');
      return expectNames(page, ['Pocket stove', 'Headlamp']);
    },
  ],
]);
scenario('archived edit validation and dismissal', [
  [
    'archive then reject empty and whitespace names',
    async (page) => {
      await move(page, 'Alpine shelter');
      await switchView(page, 'Archived');
      for (const value of ['', '   ']) {
        await open(page, 'Edit');
        await nameField(page).fill(value);
        const save = button(dialog(page, 'Edit'), 'Save');
        if (!(await save.isDisabled())) await save.click();
        await delay(180);
        assert(await dialog(page, 'Edit').isVisible(), 'Invalid archived edit closed dialog');
        await button(dialog(page, 'Edit'), 'Cancel').click();
        await closed(page);
        await stableFocus(page, button(item(page, 'Alpine shelter'), 'Edit'));
        await expectNames(page, ['Alpine shelter']);
      }
    },
  ],
  [
    'Cancel and Escape discard drafts with stable focus',
    async (page) => {
      for (const method of ['Cancel', 'Escape']) {
        await open(page, 'Edit');
        await nameField(page).fill('Discard archived draft');
        if (method === 'Escape') await page.keyboard.press('Escape');
        else await button(dialog(page, 'Edit'), 'Cancel').click();
        await closed(page);
        await stableFocus(page, button(item(page, 'Alpine shelter'), 'Edit'));
        await open(page, 'Edit');
        assert(
          (await nameField(page).inputValue()) === 'Alpine shelter',
          'Archived draft survived dismissal',
        );
        await page.keyboard.press('Escape');
        await closed(page);
        await stableFocus(page, button(item(page, 'Alpine shelter'), 'Edit'));
      }
    },
  ],
  [
    'save trims and retains archived identity and metadata',
    async (page) => {
      await rename(page, 'Alpine shelter', '  Expedition shelter  ');
      await expectNames(page, ['Expedition shelter']);
      await stableFocus(page, button(item(page, 'Expedition shelter'), 'Edit'));
      await metadata(page, 'Expedition shelter');
      await move(page, 'Expedition shelter', 'Restore');
      await switchView(page, 'Active');
      return expectNames(page, ['Expedition shelter', 'Pocket stove', 'Headlamp']);
    },
  ],
]);
scenario('archived delete cancel escape and confirm', [
  [
    'delete dialog preserves until confirmation',
    async (page) => {
      await archiveAll(page);
      await search(page).fill('stove');
      for (const method of ['Cancel', 'Escape']) {
        await open(page, 'Delete', 'Pocket stove');
        assert(
          (await dialog(page, 'Delete').innerText()).includes('Pocket stove'),
          'Delete dialog lacks archived target name',
        );
        if (method === 'Escape') await page.keyboard.press('Escape');
        else await button(dialog(page, 'Delete'), 'Cancel').click();
        await closed(page);
        await expectNames(page, ['Pocket stove']);
        await stableFocus(page, button(item(page, 'Pocket stove'), 'Delete'));
        await resultsStatus(page, 1, 3);
      }
    },
  ],
  [
    'confirmed deletion is permanent and respects view/filter counts',
    async (page) => {
      await open(page, 'Delete', 'Pocket stove');
      await button(dialog(page, 'Delete'), 'Delete item').click();
      await closed(page);
      await expectNames(page, []);
      await resultsStatus(page, 0, 2);
      await stableFocus(page, search(page));
      await button(page, 'Clear search').click();
      await selectedView(page, 'Archived');
      await expectNames(page, ['Alpine shelter', 'Headlamp']);
      await move(page, 'Alpine shelter', 'Restore');
      await move(page, 'Headlamp', 'Restore');
      await expectNames(page, []);
      await resultsStatus(page, 0, 0);
      await switchView(page, 'Active');
      return expectNames(page, ['Alpine shelter', 'Headlamp']);
    },
  ],
]);
scenario('long names across archive and restore', [
  [
    'long archived name and copy remain fully available',
    async (page, context) => {
      await rename(page, 'Alpine shelter', longName);
      await move(page, longName);
      await search(page).fill('  REINFORCED STORM  ');
      await switchView(page, 'Archived');
      assert(
        (await search(page).inputValue()) === '  REINFORCED STORM  ',
        'View switch lost long-name filter',
      );
      await expectNames(page, [longName]);
      await button(item(page, longName), 'Duplicate').click();
      await expectNames(page, [longName, `${longName} copy`]);
      await stableFocus(page, button(item(page, longName), 'Duplicate'));
      await resultsStatus(page, 2, 2);
      await fullNames(page);
      return visual(page, context, 'archived-long-filtered');
    },
  ],
  [
    'restore preserves long name, identity and independent copy',
    async (page, context) => {
      await move(page, longName, 'Restore');
      await expectNames(page, [`${longName} copy`]);
      await stableFocus(page, button(item(page, `${longName} copy`), 'Restore'));
      await resultsStatus(page, 1, 1);
      await switchView(page, 'Active');
      await expectNames(page, [longName]);
      await resultsStatus(page, 1, 3);
      await button(item(page, longName), 'Duplicate').click();
      await expectNames(page, [longName, `${longName} copy`]);
      await resultsStatus(page, 2, 4);
      await fullNames(page);
      return visual(page, context, 'restored-long-filtered');
    },
  ],
]);
scenario('archive view and dialog visual evidence', [
  ['active view fits with new controls', async (page, context) => visual(page, context, 'active')],
  [
    'archived view fits and exposes all actions',
    async (page, context) => {
      await archiveAll(page);
      for (const seed of seeds) {
        for (const name of ['Edit', 'Delete', 'Duplicate', 'Restore'])
          await button(item(page, seed.name), name).waitFor();
        assert(
          (await button(item(page, seed.name), 'Archive').count()) === 0,
          'Archived article still offers Archive',
        );
      }
      return visual(page, context, 'archived');
    },
  ],
  [
    'archived edit modal focus, geometry and contrast',
    async (page, context) => {
      await open(page, 'Edit');
      await contain(page, 'Edit');
      const observed = await visual(page, context, 'archived-edit');
      await page.keyboard.press('Escape');
      await closed(page);
      await stableFocus(page, button(item(page, 'Alpine shelter'), 'Edit'));
      return observed;
    },
  ],
  [
    'archived delete modal focus, geometry and contrast',
    async (page, context) => {
      await open(page, 'Delete');
      await contain(page, 'Delete');
      return visual(page, context, 'archived-delete');
    },
  ],
]);
assert(scenarios.length > 0, 'Unknown selected scenario', only);

await mkdir(output, {recursive: true});
for (const width of [390, 1280])
  for (const theme of ['dark', 'light'])
    for (const definition of scenarios) {
      evidence.scenarios.push({
        width,
        theme,
        name: definition.name,
        slug: definition.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase(),
        status: 'unverified',
        checks: definition.steps.map(([name]) => ({name, status: 'unverified'})),
        errors: [],
      });
    }
try {
  const probe = createServer();
  await new Promise((done, reject) => {
    probe.once('error', reject);
    probe.listen(port, '127.0.0.1', done);
  });
  await new Promise((done, reject) => probe.close((error) => (error ? reject(error) : done())));
  const command = [
    resolve(repo, 'node_modules/vite/bin/vite.js'),
    app,
    '--host',
    '127.0.0.1',
    '--port',
    String(port),
    '--strictPort',
    '--clearScreen',
    'false',
  ];
  evidence.serverCommand = [process.execPath, ...command];
  server = spawn(process.execPath, command, {cwd: app, stdio: ['ignore', 'pipe', 'pipe']});
  server.on('error', (error) => {
    serverLog += error.message;
  });
  server.stdout.on('data', (data) => {
    serverLog += data.toString();
  });
  server.stderr.on('data', (data) => {
    serverLog += data.toString();
  });
  await poll(
    async () => {
      if (server.exitCode !== null) throw new Error(`Vite exited ${server.exitCode}`);
      return (await fetch(origin, {signal: AbortSignal.timeout(700)})).status;
    },
    (status) => status === 200,
    'Vite did not start',
  );
  browser = await chromium.launch({headless: true});
  for (const result of evidence.scenarios) {
    const definition = scenarios.find((candidate) => candidate.name === result.name);
    const page = await browser.newPage({viewport: {width: result.width, height: 1000}});
    page.setDefaultTimeout(timeout);
    page.on('pageerror', (error) => result.errors.push(error.message));
    try {
      await page.goto(origin, {waitUntil: 'networkidle'});
      await search(page).waitFor();
      {
        assert(
          await themeControl(page).isChecked(),
          'Dark appearance must be checked on fresh load',
        );
        if (result.theme === 'light') await toggleTheme(page);
        assert(
          (await themeControl(page).isChecked()) === (result.theme === 'dark'),
          'Appearance control did not toggle',
        );
      }
      for (let index = 0; index < definition.steps.length; index++) {
        const check = result.checks[index];
        try {
          check.observed = await definition.steps[index][1](page, result);
          check.status = check.observed?.status === 'unverified' ? 'unverified' : 'pass';
          if (check.status === 'unverified')
            check.reason = 'Computed sample has an explicitly recorded rendering uncertainty';
        } catch (error) {
          check.status = 'fail';
          check.error = error.message;
          check.observed = error.observed;
          for (const later of result.checks.slice(index + 1))
            later.reason = `Prerequisite failed: ${check.name}`;
          await page
            .screenshot({
              path: resolve(output, `${result.width}-${result.theme}-${result.slug}-failure.png`),
              fullPage: true,
            })
            .catch(() => {});
          break;
        }
      }
    } catch (error) {
      result.setupError = error.message;
      result.setupObserved = error.observed;
      for (const check of result.checks) check.reason ??= 'Scenario setup failed';
    } finally {
      await page.close();
    }
    result.status =
      result.setupError ||
      result.errors.length ||
      result.checks.some((check) => check.status === 'fail')
        ? 'fail'
        : result.checks.some((check) => check.status === 'unverified')
          ? 'unverified'
          : 'pass';
    console.log(`${result.width} ${result.theme} ${result.name}: ${result.status}`);
  }
} catch (error) {
  evidence.infrastructureError = error.message;
  for (const result of evidence.scenarios)
    for (const check of result.checks.filter((check) => check.status === 'unverified'))
      check.reason ??= 'Infrastructure failure';
} finally {
  await browser?.close();
  if (server && server.exitCode === null) {
    server.kill('SIGTERM');
    await Promise.race([new Promise((done) => server.once('exit', done)), delay(2000)]);
    if (server.exitCode === null && server.signalCode === null) server.kill('SIGKILL');
  }
  evidence.finished = new Date().toISOString();
  evidence.summary = {pass: 0, fail: 0, unverified: 0};
  for (const result of evidence.scenarios) evidence.summary[result.status]++;
  evidence.manualReview = {
    status: 'unverified',
    reason:
      'Screenshot rubric and source checks require independent review; computed checks do not establish full acceptance.',
  };
  await writeFile(resolve(output, 'server.log'), serverLog);
  await writeFile(resolve(output, 'results.json'), `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(
    JSON.stringify({
      output,
      summary: evidence.summary,
      infrastructureError: evidence.infrastructureError,
    }),
  );
  if (evidence.infrastructureError || evidence.summary.fail) process.exitCode = 1;
}
