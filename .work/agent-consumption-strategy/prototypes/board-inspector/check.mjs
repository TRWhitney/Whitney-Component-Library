/* global document, getComputedStyle, innerWidth */
// Non-production, independent browser evidence for the board inspector experiment.
// Usage: node check.mjs <app-directory> <evidence-directory> <fixed-free-port> [--single]
// Reads the app as supplied. It does not build, edit, or repair consumer source.
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdir, writeFile} from 'node:fs/promises';
import {createServer} from 'node:net';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const [appArgument, outputArgument, portArgument] = process.argv.slice(2);
const port = Number(portArgument);
const single = process.argv.slice(5).includes('--single');
if (!appArgument || !outputArgument || !Number.isInteger(port) || port < 1024 || port > 65535) {
  throw new Error('Usage: node check.mjs <app-directory> <evidence-directory> <fixed-free-port>');
}
const app = resolve(appArgument);
const output = resolve(outputArgument);
const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const origin = `http://127.0.0.1:${port}`;
const timeout = 4500;
const delay = (ms) => new Promise((done) => setTimeout(done, ms));
const evidence = {
  purpose: 'Prototype evaluation; consumer source is assessed without repairs.',
  app,
  origin,
  fixture: single ? 'one-piece reference' : 'two-piece agent variation',
  started: new Date().toISOString(),
  limitations: [
    'Chromium only; Tab containment is sampled, not an exhaustive accessibility audit.',
    'Geometry compares each app before and after interaction; initial metrics support comparison against the seed.',
  ],
  scenarios: [],
};
let server;
let browser;
let serverLog = '';

function requireCondition(condition, message, observed) {
  if (!condition)
    throw new Error(
      `${message}${observed === undefined ? '' : `; observed ${JSON.stringify(observed)}`}`,
    );
  return observed;
}

async function poll(read, accept, description, stableFor = 0) {
  const start = Date.now();
  let stableSince;
  let observed;
  let lastError;
  while (Date.now() - start < timeout) {
    try {
      observed = await read();
      if (accept(observed)) {
        stableSince ??= Date.now();
        if (Date.now() - stableSince >= stableFor) return observed;
      } else stableSince = undefined;
    } catch (error) {
      lastError = error.message;
      stableSince = undefined;
    }
    await delay(40);
  }
  throw new Error(
    `${description}; observed ${JSON.stringify(observed)}${lastError ? `; ${lastError}` : ''}`,
  );
}

const square = (page, index, name) =>
  page.getByRole('button', {
    name: name ? `Square ${index}, ${name}` : new RegExp(`^Square ${index}, `),
    exact: Boolean(name),
  });
const squares = (page) => page.getByRole('button', {name: /^Square \d+, /});
const reset = (page) => page.getByRole('button', {name: 'Reset board', exact: true});
const inspector = (page) => page.getByRole('dialog', {name: /Scout/});
const pieceName = (dialog) => dialog.getByRole('textbox', {name: 'Piece name', exact: true});
const control = (dialog, name) => dialog.getByRole('button', {name, exact: true});
const focusInfo = (page) =>
  page.evaluate(() => {
    const element = document.activeElement;
    return {
      tag: element?.tagName,
      label: element?.getAttribute('aria-label'),
      text: element?.textContent?.trim().slice(0, 120),
    };
  });

async function focusOn(page, target) {
  await poll(
    () => target.evaluate((node) => node === document.activeElement),
    Boolean,
    'Focus did not settle on the exact expected element',
    160,
  );
  return focusInfo(page);
}

async function hidden(page) {
  await page.getByRole('dialog').waitFor({state: 'hidden', timeout});
  return {visibleDialogs: await page.getByRole('dialog').count()};
}

async function settledScreenshot(page, path) {
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
    (count) => count === 0,
    'Finite animations did not finish before the evidence screenshot',
    80,
  );
  await page.screenshot({path, fullPage: true});
}

async function initialState(page) {
  await square(page, 1, 'Scout').waitFor({timeout});
  if (!single) await square(page, 6, 'Tower').waitFor({timeout});
  const labels = await squares(page).evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute('aria-label')),
  );
  requireCondition(labels.length === 16, 'Expected 16 squares', labels);
  for (let index = 1; index <= 16; index++) {
    const expected = `Square ${index}, ${index === 1 ? 'Scout' : index === 6 && !single ? 'Tower' : 'empty'}`;
    requireCondition(labels.includes(expected), `Missing ${expected}`, labels);
  }
  return labels;
}

async function geometry(page) {
  return squares(page).evaluateAll((nodes) =>
    nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return {
        label: node.getAttribute('aria-label'),
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        background: style.backgroundColor,
        radius: style.borderRadius,
        font: style.font,
        border: style.border,
      };
    }),
  );
}

async function unclipped(page) {
  const documentSize = await page.evaluate(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  requireCondition(
    documentSize.scrollWidth <= documentSize.width + 1,
    'Page has horizontal overflow',
    documentSize,
  );
  const boxes = await squares(page).evaluateAll((nodes) =>
    nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return {left: rect.left, right: rect.right};
    }),
  );
  requireCondition(
    boxes.every((box) => box.left >= -1 && box.right <= documentSize.width + 1),
    'Board square extends beyond the viewport',
    boxes,
  );
  for (const dialog of await page.getByRole('dialog').all()) {
    const box = await dialog.boundingBox();
    requireCondition(
      box && box.x >= -1 && box.x + box.width <= documentSize.width + 1,
      'Dialog extends beyond the viewport',
      box,
    );
  }
  return documentSize;
}

async function open(page, method = 'pointer') {
  const target = square(page, 1, 'Scout');
  if (method === 'pointer') await target.click();
  else {
    await target.focus();
    await page.keyboard.press(method);
  }
  await inspector(page).waitFor({timeout});
  return {
    dialog: await inspector(page).getAttribute('aria-label'),
    snapshot: await inspector(page).ariaSnapshot(),
  };
}

async function containment(page) {
  const dialog = inspector(page);
  await poll(
    () => dialog.evaluate((node) => node.contains(document.activeElement)),
    Boolean,
    'Dialog did not receive focus',
    160,
  );
  const samples = [await focusInfo(page)];
  for (let index = 0; index < 16; index++) {
    await page.keyboard.press('Tab');
    requireCondition(
      await dialog.evaluate((node) => node.contains(document.activeElement)),
      'Tab escaped the inspector',
      await focusInfo(page),
    );
    samples.push(await focusInfo(page));
  }
  for (let index = 0; index < 8; index++) {
    await page.keyboard.press('Shift+Tab');
    requireCondition(
      await dialog.evaluate((node) => node.contains(document.activeElement)),
      'Shift+Tab escaped the inspector',
      await focusInfo(page),
    );
    samples.push(await focusInfo(page));
  }
  return samples;
}

const scenarios = [
  {
    name: 'board baseline',
    steps: [
      [`initial ${single ? 'one-piece' : 'two-piece'} state`, initialState],
      [
        'native square and reset buttons',
        async (page) => {
          const tags = await squares(page).evaluateAll((nodes) =>
            nodes.map((node) => node.tagName),
          );
          tags.push(await reset(page).evaluate((node) => node.tagName));
          return requireCondition(
            tags.every((tag) => tag === 'BUTTON'),
            'Squares and Reset must be native buttons',
            tags,
          );
        },
      ],
      [
        'four-by-four square geometry',
        async (page) => {
          const boxes = await geometry(page);
          const unique = (key) => new Set(boxes.map((box) => Math.round(box[key]))).size;
          requireCondition(
            unique('x') === 4 && unique('y') === 4,
            'Expected four rows and columns',
            boxes,
          );
          requireCondition(
            boxes.every((box) => box.width > 0 && box.height > 0),
            'Cells have empty bounds',
            boxes,
          );
          return boxes;
        },
      ],
      [
        'arrow-key board navigation',
        async (page) => {
          await square(page, 1).focus();
          await page.keyboard.press('ArrowRight');
          await focusOn(page, square(page, 2));
          await page.keyboard.press('ArrowDown');
          await focusOn(page, square(page, 6));
          await page.keyboard.press('ArrowLeft');
          await focusOn(page, square(page, 5));
          await page.keyboard.press('ArrowUp');
          return focusOn(page, square(page, 1));
        },
      ],
      ['no horizontal clipping', unclipped],
    ],
  },
  ...['pointer', 'Enter', 'Space'].map((method) => ({
    name: `open using ${method}`,
    steps: [
      ['accessible named inspector opens', (page) => open(page, method)],
      ['focus enters and stays inside for sampled Tab keys', containment],
      [
        'required inspector controls',
        async (page) => {
          const dialog = inspector(page);
          requireCondition(
            (await pieceName(dialog).inputValue()) === 'Scout',
            'Initial name is not Scout',
          );
          for (const label of [
            'Save',
            'Cancel',
            'Move to next empty square',
            'Remove piece',
            'Close inspector',
          ]) {
            await control(dialog, label).waitFor({timeout});
          }
          return {
            name: 'Scout',
            actions: [
              'Save',
              'Cancel',
              'Move to next empty square',
              'Remove piece',
              'Close inspector',
            ],
          };
        },
      ],
      ['no horizontal clipping while open', unclipped],
      [
        'close dismisses inspector',
        async (page) => {
          await control(inspector(page), 'Close inspector').click();
          return hidden(page);
        },
      ],
      ['focus returns to original square', (page) => focusOn(page, square(page, 1, 'Scout'))],
    ],
  })),
  {
    name: 'save rename',
    steps: [
      ['open inspector', (page) => open(page)],
      [
        'save commits and closes',
        async (page) => {
          await pieceName(inspector(page)).fill('Pathfinder');
          await control(page.getByRole('dialog'), 'Save').click();
          await hidden(page);
          await square(page, 1, 'Pathfinder').waitFor({timeout});
          return {label: 'Square 1, Pathfinder'};
        },
      ],
      ['save returns focus to same square', (page) => focusOn(page, square(page, 1, 'Pathfinder'))],
      [
        'saved name persists on reopening',
        async (page) => {
          await square(page, 1, 'Pathfinder').click();
          const dialog = page.getByRole('dialog', {name: /Pathfinder/});
          await dialog.waitFor({timeout});
          return requireCondition(
            (await pieceName(dialog).inputValue()) === 'Pathfinder',
            'Saved name was lost',
          );
        },
      ],
    ],
  },
  ...['Cancel', 'Close inspector', 'Escape'].map((method) => ({
    name: `discard using ${method}`,
    steps: [
      ['open inspector', (page) => open(page)],
      [
        'dismiss draft',
        async (page) => {
          await pieceName(inspector(page)).fill('Discard me');
          if (method === 'Escape') await page.keyboard.press('Escape');
          else await control(page.getByRole('dialog'), method).click();
          return hidden(page);
        },
      ],
      [
        'original name and exact focus target preserved',
        async (page) => {
          await square(page, 1, 'Scout').waitFor({timeout});
          return focusOn(page, square(page, 1, 'Scout'));
        },
      ],
      [
        'reopening discards draft value',
        async (page) => {
          await open(page);
          return requireCondition(
            (await pieceName(inspector(page)).inputValue()) === 'Scout',
            'Cancelled draft remains',
          );
        },
      ],
    ],
  })),
  {
    name: 'move selected piece',
    steps: [
      ['open inspector', (page) => open(page)],
      [
        'move goes from square 1 to next empty square 2',
        async (page) => {
          await control(inspector(page), 'Move to next empty square').click();
          await hidden(page);
          await square(page, 1, 'empty').waitFor({timeout});
          await square(page, 2, 'Scout').waitFor({timeout});
          if (!single) await square(page, 6, 'Tower').waitFor({timeout});
          return single ? {Scout: 2} : {Scout: 2, Tower: 6};
        },
      ],
      [
        'move returns focus to destination square',
        (page) => focusOn(page, square(page, 2, 'Scout')),
      ],
      [
        'reset restores initial pieces',
        async (page) => {
          await reset(page).click();
          return initialState(page);
        },
      ],
    ],
  },
  {
    name: 'remove selected piece',
    steps: [
      ['open inspector', (page) => open(page)],
      [
        'remove closes and preserves other piece',
        async (page) => {
          await control(inspector(page), 'Remove piece').click();
          await hidden(page);
          await square(page, 1, 'empty').waitFor({timeout});
          if (!single) await square(page, 6, 'Tower').waitFor({timeout});
          const labels = await squares(page).evaluateAll((nodes) =>
            nodes.map((node) => node.getAttribute('aria-label')),
          );
          return requireCondition(
            !labels.some((label) => label.endsWith(', Scout')),
            'Removed Scout still occupies a square',
            labels,
          );
        },
      ],
      ['removal returns focus to Reset board', (page) => focusOn(page, reset(page))],
      [
        'reset restores initial pieces',
        async (page) => {
          await reset(page).click();
          return initialState(page);
        },
      ],
    ],
  },
  {
    name: 'existing triggered rules dialog',
    steps: [
      [
        'rules dialog opens',
        async (page) => {
          await page.getByRole('button', {name: 'Read rules', exact: true}).click();
          const dialog = page.getByRole('dialog', {name: /rules/i});
          await dialog.waitFor({timeout});
          await poll(
            () => dialog.evaluate((node) => node.contains(document.activeElement)),
            Boolean,
            'Rules dialog did not receive focus',
            160,
          );
          return dialog.ariaSnapshot();
        },
      ],
      [
        'Escape closes rules dialog',
        async (page) => {
          await page.keyboard.press('Escape');
          return hidden(page);
        },
      ],
      [
        'rules trigger receives focus',
        (page) => focusOn(page, page.getByRole('button', {name: 'Read rules', exact: true})),
      ],
    ],
  },
];

scenarios.push({
  name: 'existing adjacent movement rule',
  steps: [
    [
      'distant empty activation leaves pieces unchanged',
      async (page) => {
        await square(page, 16, 'empty').click();
        return initialState(page);
      },
    ],
    [
      'adjacent empty activation moves selected Scout',
      async (page) => {
        await square(page, 1, 'Scout').focus();
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('Enter');
        await square(page, 1, 'empty').waitFor({timeout});
        await square(page, 2, 'Scout').waitFor({timeout});
        if (!single) await square(page, 6, 'Tower').waitFor({timeout});
        return {Scout: 2};
      },
    ],
  ],
});

if (!single)
  scenarios.push(
    {
      name: 'second piece identity',
      steps: [
        [
          'Tower opens its own named inspector',
          async (page) => {
            await square(page, 6, 'Tower').focus();
            await page.keyboard.press('Space');
            const dialog = page.getByRole('dialog', {name: /Tower/});
            await dialog.waitFor({timeout});
            return requireCondition(
              (await pieceName(dialog).inputValue()) === 'Tower',
              'Wrong piece draft',
            );
          },
        ],
        [
          'renaming Tower preserves Scout',
          async (page) => {
            await pieceName(page.getByRole('dialog')).fill('Keep');
            await control(page.getByRole('dialog'), 'Save').click();
            await hidden(page);
            await square(page, 6, 'Keep').waitFor({timeout});
            await square(page, 1, 'Scout').waitFor({timeout});
            return focusOn(page, square(page, 6, 'Keep'));
          },
        ],
        [
          'moving second piece preserves Scout and focuses destination',
          async (page) => {
            await square(page, 6, 'Keep').click();
            const dialog = page.getByRole('dialog', {name: /Keep/});
            await dialog.waitFor({timeout});
            await control(dialog, 'Move to next empty square').click();
            await hidden(page);
            await square(page, 6, 'empty').waitFor({timeout});
            await square(page, 7, 'Keep').waitFor({timeout});
            await square(page, 1, 'Scout').waitFor({timeout});
            return focusOn(page, square(page, 7, 'Keep'));
          },
        ],
      ],
    },
    {
      name: 'next empty skips occupied destination',
      steps: [
        [
          'successive moves skip Tower on square 6',
          async (page) => {
            let previous = 1;
            const destinations = [];
            for (const destination of [2, 3, 4, 5, 7]) {
              await square(page, previous, 'Scout').click();
              await inspector(page).waitFor({timeout});
              await control(inspector(page), 'Move to next empty square').click();
              await hidden(page);
              await square(page, previous, 'empty').waitFor({timeout});
              await square(page, destination, 'Scout').waitFor({timeout});
              await square(page, 6, 'Tower').waitFor({timeout});
              destinations.push({
                square: destination,
                focus: await focusOn(page, square(page, destination, 'Scout')),
              });
              previous = destination;
            }
            return destinations;
          },
        ],
      ],
    },
  );

await mkdir(output, {recursive: true});
for (const width of [390, 1280]) {
  for (const definition of scenarios) {
    evidence.scenarios.push({
      width,
      name: definition.name,
      checks: definition.steps.map(([name]) => ({name, status: 'unverified'})),
      errors: [],
    });
  }
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
      if (server.exitCode !== null) throw new Error(`Vite exited ${server.exitCode}: ${serverLog}`);
      const response = await fetch(origin, {signal: AbortSignal.timeout(700)});
      return response.status;
    },
    (status) => status === 200,
    'Vite did not start on the assigned port',
  );
  browser = await chromium.launch({headless: true});
  for (const result of evidence.scenarios) {
    const definition = scenarios.find((scenario) => scenario.name === result.name);
    const page = await browser.newPage({viewport: {width: result.width, height: 1000}});
    page.setDefaultTimeout(timeout);
    page.on('pageerror', (error) => result.errors.push(error.message));
    try {
      await page.goto(origin, {waitUntil: 'networkidle'});
      await square(page, 1).waitFor({timeout});
      result.initialGeometry = await geometry(page);
      for (let index = 0; index < definition.steps.length; index++) {
        const check = result.checks[index];
        try {
          check.observed = await definition.steps[index][1](page);
          check.status = 'pass';
          if (!result.openScreenshot && (await page.getByRole('dialog').count())) {
            result.openScreenshot = `${result.width}-${result.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-open.png`;
            await settledScreenshot(page, resolve(output, result.openScreenshot));
          }
        } catch (error) {
          check.status = 'fail';
          check.error = error.message;
          check.focus = await focusInfo(page).catch(() => null);
          for (const remaining of result.checks.slice(index + 1))
            remaining.reason = `Prerequisite failed: ${check.name}`;
          break;
        }
      }
      result.screenshot = `${result.width}-${result.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`;
      await settledScreenshot(page, resolve(output, result.screenshot));
      const geometryCheck = {name: 'board geometry stable after interaction', status: 'unverified'};
      result.checks.push(geometryCheck);
      try {
        if (await page.getByRole('dialog').count()) await page.keyboard.press('Escape');
        await hidden(page);
        await reset(page).click();
        await initialState(page);
        result.finalGeometry = await geometry(page);
        requireCondition(
          result.initialGeometry.length === result.finalGeometry.length,
          'Square count changed',
        );
        const differences = result.initialGeometry.flatMap((before, index) => {
          const after = result.finalGeometry[index];
          return ['x', 'y', 'width', 'height']
            .filter((key) => Math.abs(before[key] - after[key]) > 1)
            .map((key) => ({square: index + 1, key, before: before[key], after: after[key]}));
        });
        requireCondition(
          differences.length === 0,
          'Board geometry changed after interaction',
          differences,
        );
        geometryCheck.status = 'pass';
        geometryCheck.observed = {tolerancePixels: 1, differences};
      } catch (error) {
        geometryCheck.status = 'fail';
        geometryCheck.error = error.message;
      }
    } catch (error) {
      result.setupError = error.message;
      for (const check of result.checks.filter((check) => check.status === 'unverified'))
        check.reason = 'Scenario setup failed';
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
    console.log(`${result.width} ${result.name}: ${result.status}`);
  }
} catch (error) {
  evidence.infrastructureError = error.message;
  for (const result of evidence.scenarios) {
    result.status ??= 'unverified';
    for (const check of result.checks.filter((check) => check.status === 'unverified'))
      check.reason ??= 'Infrastructure failure';
  }
} finally {
  await browser?.close();
  if (server && server.exitCode === null) {
    server.kill('SIGTERM');
    await Promise.race([new Promise((done) => server.once('exit', done)), delay(2000)]);
    if (server.exitCode === null) server.kill('SIGKILL');
  }
  evidence.finished = new Date().toISOString();
  evidence.summary = {pass: 0, fail: 0, unverified: 0};
  for (const result of evidence.scenarios)
    for (const check of result.checks) evidence.summary[check.status]++;
  await writeFile(resolve(output, 'server.log'), serverLog);
  await writeFile(resolve(output, 'results.json'), `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(
    JSON.stringify({
      output,
      summary: evidence.summary,
      infrastructureError: evidence.infrastructureError,
    }),
  );
  if (evidence.infrastructureError || evidence.scenarios.some((result) => result.status !== 'pass'))
    process.exitCode = 1;
}
