/* global document, getComputedStyle, innerWidth, NodeFilter */
// Independent, frozen browser evaluation. Does not read or modify application source.
// node check.mjs <app-directory> <evidence-directory> <port> initial|maintenance
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdir, writeFile} from 'node:fs/promises';
import {createServer} from 'node:net';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const [appArgument, outputArgument, portArgument, mode] = process.argv.slice(2);
const port = Number(portArgument);
if (
  !appArgument ||
  !outputArgument ||
  !Number.isInteger(port) ||
  port < 1024 ||
  port > 65535 ||
  !['initial', 'maintenance'].includes(mode)
)
  throw new Error(
    'Usage: node check.mjs <app-directory> <evidence-directory> <port> initial|maintenance',
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
    'Chromium only. Each scenario uses a fresh page; maintenance scenarios run in both appearances.',
    'Accessible roles and exact requested names select controls; no dependency-internal selectors are used.',
    'Computed contrast composites transparent ancestor backgrounds over the browser white canvas. Ancestor opacity, gradients/images, filters and text shadows make affected samples unverified.',
    'Text contrast excludes hidden text, disabled controls, placeholders, generated content, SVG and canvas. These remain for screenshot review.',
    'Focus styles and screenshots are evidence, not an automatic visibility or accessibility verdict. Tab containment is sampled.',
    'Stable data IDs, supported styling APIs and private selector overrides require separate source review. Duplicate behavior and repeated names are tested here.',
    'Human review must assess hierarchy, spacing, palette, surface separation, action distinction, focus indication and identify-mode region usefulness.',
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
const scenarios = [];
const scenario = (name, steps, maintenanceOnly = false) => {
  if (!maintenanceOnly || mode === 'maintenance') scenarios.push({name, steps});
};
scenario('baseline', [
  [
    'initial items, labels and counts',
    async (page) => {
      await page.getByRole('heading', {name: /^Trail kit\.?$/}).waitFor();
      await expectNames(
        page,
        seeds.map((seed) => seed.name),
      );
      for (const seed of seeds) {
        const article = item(page, seed.name);
        const text = await article.innerText();
        assert(text.toLowerCase().includes(seed.category.toLowerCase()), 'Missing category', seed);
        assert(
          new RegExp(
            `\\b${seed.weight.toLocaleString('en-US').replace(',', ',?')}\\s*(g\\b|grams?\\b)`,
            'i',
          ).test(text),
          'Missing weight in grams',
          {seed, text},
        );
        for (const action of ['Edit', 'Delete', ...(mode === 'maintenance' ? ['Duplicate'] : [])])
          await button(article, action).waitFor();
      }
      await search(page).waitFor();
      return countText(page, 3, 3);
    },
  ],
  [
    'initial screenshot and geometry',
    async (page, context) => {
      const result = await capture(page, context, 'initial');
      geometryVerdict(result.geometry);
      const boxes = await articles(page).evaluateAll((nodes) =>
        nodes.map((node) => {
          const r = node.getBoundingClientRect();
          return {x: r.x, y: r.y, width: r.width, height: r.height};
        }),
      );
      assert(
        boxes.every(
          (box, index) => !index || box.y >= boxes[index - 1].y + boxes[index - 1].height - 1,
        ),
        'Items are not a vertical list',
        boxes,
      );
      if (context.width === 390)
        assert(
          boxes.every((box) => box.x >= 16 && box.x + box.width <= 374),
          'Articles need at least 16px outer side space',
          boxes,
        );
      if (context.width === 1280)
        assert(
          boxes.every(
            (box) =>
              box.width >= 899 &&
              box.width <= 1151 &&
              Math.abs(box.x - (1280 - box.x - box.width)) <= 2,
          ),
          'Content should be centered at 900 to 1150px',
          boxes,
        );
      const field = await search(page).boundingBox();
      assert(field.y + field.height <= boxes[0].y + 1, 'Search is not above the item list', {
        field,
        boxes,
      });
      return result;
    },
  ],
  ['initial text contrast', async (page) => contrastVerdict(await contrast(page))],
  [
    'keyboard focus evidence',
    async (page, context) => {
      await search(page).focus();
      await page.keyboard.press('Tab');
      return capture(page, context, 'keyboard-focus');
    },
  ],
]);
scenario('search and empty recovery', [
  [
    'case and whitespace filtering',
    async (page) => {
      await search(page).fill('  ALPINE  ');
      await expectNames(page, ['Alpine shelter']);
      await countText(page, 1, 3);
      await search(page).fill('p');
      await expectNames(
        page,
        seeds.map((seed) => seed.name),
      );
      return countText(page, 3, 3);
    },
  ],
  [
    'empty and clear',
    async (page) => {
      await search(page).fill('unmatched-xyz');
      await poll(
        () => articles(page).count(),
        (value) => value === 0,
        'Search failed to remove nonmatches',
      );
      await page.getByText('No items found', {exact: true}).waitFor();
      await countText(page, 0, 3);
      await button(page, 'Clear search').click();
      assert((await search(page).inputValue()) === '', 'Clear search did not empty field');
      await expectNames(
        page,
        seeds.map((seed) => seed.name),
      );
      return countText(page, 3, 3);
    },
  ],
]);
for (const type of ['Edit', 'Delete'])
  scenario(`${type.toLowerCase()} modal`, [
    [
      'open and screenshot',
      async (page, context) => {
        await open(page, type);
        if (type === 'Edit') {
          assert(
            (await nameField(page).inputValue()) === 'Alpine shelter',
            'Edit draft has wrong initial value',
          );
          assert(
            await nameField(page).evaluate(
              (node) => node.required || node.getAttribute('aria-required') === 'true',
            ),
            'Name field is not exposed as required',
          );
          await button(dialog(page, type), 'Save').waitFor();
        } else {
          assert(
            (await dialog(page, type).innerText()).includes('Alpine shelter'),
            'Deletion dialog does not identify the target',
          );
          await button(dialog(page, type), 'Delete item').waitFor();
        }
        await button(dialog(page, type), 'Cancel').waitFor();
        return capture(page, context, type.toLowerCase());
      },
    ],
    ['focus enters and sampled Tab navigation stays inside', (page) => contain(page, type)],
    ['modal geometry', async (page) => geometryVerdict(await geometry(page))],
    ['modal text contrast', async (page) => contrastVerdict(await contrast(page))],
  ]);
scenario('save trimmed name', [
  [
    'save changes only selected item and returns focus',
    async (page) => {
      await rename(page, 'Pocket stove', '  Camp stove  ');
      await expectNames(page, ['Alpine shelter', 'Camp stove', 'Headlamp']);
      await countText(page, 3, 3);
      return focused(page, button(item(page, 'Camp stove'), 'Edit'));
    },
  ],
  [
    'saved name persists in reopened draft',
    async (page) => {
      await open(page, 'Edit', 'Camp stove');
      return assert((await nameField(page).inputValue()) === 'Camp stove', 'Saved name was lost');
    },
  ],
]);
for (const value of ['', '   '])
  scenario(value ? 'reject whitespace name' : 'reject empty name', [
    [
      'invalid save remains open and does not mutate item',
      async (page) => {
        await open(page, 'Edit');
        await nameField(page).fill(value);
        const save = button(dialog(page, 'Edit'), 'Save');
        const saveDisabled = await save.isDisabled();
        if (!saveDisabled) await save.click();
        await delay(200);
        assert(await dialog(page, 'Edit').isVisible(), 'Invalid save closed dialog');
        await button(dialog(page, 'Edit'), 'Cancel').click();
        await closed(page);
        await expectNames(
          page,
          seeds.map((seed) => seed.name),
        );
        return {
          saveDisabled,
          focus: await focused(page, button(item(page, 'Alpine shelter'), 'Edit')),
        };
      },
    ],
  ]);
for (const type of ['Edit', 'Delete'])
  for (const method of ['Cancel', 'Escape'])
    scenario(`${type.toLowerCase()} ${method.toLowerCase()}`, [
      [
        'discard and restore exact trigger focus',
        async (page) => {
          await open(page, type);
          if (type === 'Edit') await nameField(page).fill('Discard this');
          if (method === 'Escape') await page.keyboard.press('Escape');
          else await button(dialog(page, type), 'Cancel').click();
          await closed(page);
          await expectNames(
            page,
            seeds.map((seed) => seed.name),
          );
          const focus = await focused(page, button(item(page, 'Alpine shelter'), type));
          if (type === 'Edit') {
            await open(page, type);
            assert(
              (await nameField(page).inputValue()) === 'Alpine shelter',
              'Discarded draft survived reopening',
            );
          }
          return focus;
        },
      ],
    ]);
scenario('delete confirmation', [
  [
    'delete filtered target and focus search',
    async (page) => {
      await search(page).fill('stove');
      await open(page, 'Delete', 'Pocket stove');
      await button(dialog(page, 'Delete'), 'Delete item').click();
      await closed(page);
      await expectNames(page, []);
      await countText(page, 0, 2);
      await page.getByText('No items found', {exact: true}).waitFor();
      const focus = await focused(page, search(page));
      await button(page, 'Clear search').click();
      await expectNames(page, ['Alpine shelter', 'Headlamp']);
      await countText(page, 2, 2);
      return focus;
    },
  ],
]);
scenario(
  'duplicate identity and isolation',
  [
    [
      'insert copy immediately after original and retain focus',
      async (page) => {
        await button(item(page, 'Alpine shelter'), 'Duplicate').click();
        await closed(page);
        await expectNames(page, [
          'Alpine shelter',
          'Alpine shelter copy',
          'Pocket stove',
          'Headlamp',
        ]);
        await countText(page, 4, 4);
        const text = await item(page, 'Alpine shelter copy').innerText();
        assert(
          text.toLowerCase().includes('shelter') && /1,?800\s*(g\b|grams?\b)/i.test(text),
          'Copy category or weight differs',
          text,
        );
        return focused(page, button(item(page, 'Alpine shelter'), 'Duplicate'));
      },
    ],
    [
      'repeated same-name copies remain separate',
      async (page) => {
        await button(item(page, 'Alpine shelter'), 'Duplicate').click();
        await expectNames(page, [
          'Alpine shelter',
          'Alpine shelter copy',
          'Alpine shelter copy',
          'Pocket stove',
          'Headlamp',
        ]);
        await countText(page, 5, 5);
        await button(item(page, 'Alpine shelter copy').nth(0), 'Edit').click();
        await nameField(page).fill('Independent copy');
        await button(dialog(page, 'Edit'), 'Save').click();
        await closed(page);
        await expectNames(page, [
          'Alpine shelter',
          'Independent copy',
          'Alpine shelter copy',
          'Pocket stove',
          'Headlamp',
        ]);
        return focused(page, button(item(page, 'Independent copy'), 'Edit'));
      },
    ],
    [
      'copy can duplicate, filter and delete independently',
      async (page) => {
        await button(item(page, 'Independent copy'), 'Duplicate').click();
        await expectNames(page, [
          'Alpine shelter',
          'Independent copy',
          'Independent copy copy',
          'Alpine shelter copy',
          'Pocket stove',
          'Headlamp',
        ]);
        await search(page).fill('independent');
        await expectNames(page, ['Independent copy', 'Independent copy copy']);
        await countText(page, 2, 6);
        await open(page, 'Delete', 'Independent copy');
        await button(dialog(page, 'Delete'), 'Delete item').click();
        await closed(page);
        await focused(page, search(page));
        await expectNames(page, ['Independent copy copy']);
        await countText(page, 1, 5);
        await search(page).fill('');
        return expectNames(page, [
          'Alpine shelter',
          'Independent copy copy',
          'Alpine shelter copy',
          'Pocket stove',
          'Headlamp',
        ]);
      },
    ],
  ],
  true,
);
scenario(
  'long name wrapping',
  [
    [
      'rename, duplicate and filter long name',
      async (page) => {
        await rename(page, 'Alpine shelter', longName);
        await button(item(page, longName), 'Duplicate').click();
        await search(page).fill('  REINFORCED STORM  ');
        await expectNames(page, [longName, `${longName} copy`]);
        return countText(page, 2, 4);
      },
    ],
    [
      'long name geometry and screenshot',
      async (page, context) => {
        const observed = await capture(page, context, 'long-name');
        geometryVerdict(observed.geometry);
        const bounds = [];
        for (const article of await articles(page).all()) {
          const heading = article.getByRole('heading');
          const value = await heading.evaluate((node) => {
            const range = document.createRange();
            range.selectNodeContents(node);
            const text = [...range.getClientRects()].map((rect) => ({
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
            }));
            const style = getComputedStyle(node);
            const rect = node.getBoundingClientRect();
            return {
              text,
              rect: {x: rect.x, y: rect.y, width: rect.width, height: rect.height},
              scrollWidth: node.scrollWidth,
              clientWidth: node.clientWidth,
              scrollHeight: node.scrollHeight,
              clientHeight: node.clientHeight,
              overflow: style.overflow,
              textOverflow: style.textOverflow,
              lineClamp: style.webkitLineClamp,
            };
          });
          assert(
            value.lineClamp === 'none' || value.lineClamp === '',
            'Long heading uses line clamping',
            value,
          );
          assert(
            (!value.clientWidth || value.scrollWidth <= value.clientWidth + 1) &&
              (!value.clientHeight || value.scrollHeight <= value.clientHeight + 1),
            'Long heading clips its text',
            value,
          );
          for (const action of ['Edit', 'Delete', 'Duplicate']) {
            const box = await button(article, action).boundingBox();
            assert(box && box.width > 0 && box.height > 0, 'Long name hides an action', {
              action,
              box,
            });
            assert(
              !value.text.some(
                (r) =>
                  Math.min(r.x + r.width, box.x + box.width) - Math.max(r.x, box.x) > 1 &&
                  Math.min(r.y + r.height, box.y + box.height) - Math.max(r.y, box.y) > 1,
              ),
              'Long name overlaps an action',
              {action, box, value},
            );
          }
          bounds.push(value);
        }
        return {...observed, bounds};
      },
    ],
    ['long name text contrast', async (page) => contrastVerdict(await contrast(page))],
  ],
  true,
);
scenario(
  'theme changes propagate',
  [
    [
      'page and article colors change between appearances',
      async (page) => {
        const before = await appearance(page);
        await toggleTheme(page);
        const after = await appearance(page);
        assert(
          JSON.stringify(before.body) !== JSON.stringify(after.body),
          'Theme toggle does not change page background',
          {before, after},
        );
        assert(
          JSON.stringify(before.articles) !== JSON.stringify(after.articles),
          'Theme toggle does not change item surfaces',
          {before, after},
        );
        return {before, after};
      },
    ],
    ...['Edit', 'Delete'].map((type) => [
      `${type.toLowerCase()} dialog follows appearance`,
      async (page) => {
        await open(page, type);
        const before = await appearance(page);
        await page.keyboard.press('Escape');
        await closed(page);
        await toggleTheme(page);
        await open(page, type);
        const after = await appearance(page);
        assert(
          JSON.stringify(before.dialogs) !== JSON.stringify(after.dialogs),
          'Dialog backgrounds do not change with appearance',
          {before, after},
        );
        await page.keyboard.press('Escape');
        await closed(page);
        return {before, after};
      },
    ]),
  ],
  true,
);
scenario('identify review evidence', [
  [
    'normal and identify geometry',
    async (page, context) => {
      const before = await geometry(page);
      await page.goto(`${origin}/?identify`, {waitUntil: 'networkidle'});
      if (mode === 'maintenance' && context.theme === 'light') await toggleTheme(page);
      await search(page).waitFor();
      await search(page).hover();
      const after = await capture(page, context, 'identify-hover');
      const simplify = (value) =>
        value.records.map(({tag, role, x, y, width, height}) => ({tag, role, x, y, width, height}));
      assert(
        JSON.stringify(simplify(before)) === JSON.stringify(simplify(after.geometry)),
        'Identify mode changes normal content geometry',
        {before, after},
      );
      await search(page).focus();
      return capture(page, context, 'identify-focus');
    },
  ],
]);

await mkdir(output, {recursive: true});
for (const width of [390, 1280])
  for (const theme of mode === 'maintenance' ? ['dark', 'light'] : ['light'])
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
      if (mode === 'maintenance') {
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
