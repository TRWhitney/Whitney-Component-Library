/* global window, document, requestAnimationFrame, MutationObserver */
import {execFileSync} from 'node:child_process';
import {createServer} from 'node:http';
import {mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {cpus, tmpdir, platform, release} from 'node:os';
import {resolve, join, extname} from 'node:path';
import {pathToFileURL} from 'node:url';

// Playwright is supplied by the verification environment, not shipped with the library.
const playwrightModule = process.env.WCL_PLAYWRIGHT_MODULE;
const {chromium} = await import(
  playwrightModule ? pathToFileURL(resolve(playwrightModule)).href : 'playwright'
);
const root = resolve(import.meta.dirname, '..');
const output = resolve(
  process.env.WCL_PERFORMANCE_OUTPUT ?? join(tmpdir(), 'chart-performance.json'),
);
const build = await mkdtemp(join(tmpdir(), 'wcl-chart-performance-'));
const kinds = (
  process.env.WCL_PERFORMANCE_KINDS ??
  'line,columns,bars,scatter,bubble,histogram,box,pie,donut,radar,heatmap,sparkline'
).split(',');
const samples = Number(process.env.WCL_PERFORMANCE_SAMPLES ?? 12);
if (!Number.isInteger(samples) || samples < 2) throw new Error('Samples must be an integer >= 2.');
const profiles = [
  {name: 'desktop', width: 1280, height: 900, cpu: 1, frameBudget: 34},
  {name: 'constrained', width: 390, height: 844, cpu: 4, frameBudget: 50},
].filter(
  (p) => !process.env.WCL_PERFORMANCE_PROFILE || p.name === process.env.WCL_PERFORMANCE_PROFILE,
);
if (!profiles.length) throw new Error('Profile must be desktop or constrained.');
const supportedKinds = new Set([
  'line',
  'columns',
  'bars',
  'scatter',
  'bubble',
  'histogram',
  'box',
  'pie',
  'donut',
  'radar',
  'heatmap',
  'sparkline',
]);
if (kinds.some((kind) => !supportedKinds.has(kind))) throw new Error('Unknown chart kind.');
const results = [];
let browser;
const server = createServer(async (req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  const file = resolve(build, path === '/' ? 'index.html' : `.${path}`);
  if (!file.startsWith(`${build}/`)) {
    res.writeHead(403).end();
    return;
  }
  try {
    const body = await readFile(file);
    const type = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css'}[
      extname(file)
    ];
    res.writeHead(200, {'Content-Type': type ?? 'application/octet-stream'}).end(body);
  } catch {
    res.writeHead(404).end();
  }
});
function percentile(values, fraction) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.ceil(sorted.length * fraction) - 1] ?? 0;
}
try {
  execFileSync(
    process.execPath,
    [
      'node_modules/vite/bin/vite.js',
      'build',
      '--config',
      'scripts/fixtures/chart-performance/vite.config.ts',
      '--outDir',
      build,
      '--emptyOutDir',
    ],
    {cwd: root, stdio: 'inherit'},
  );
  await new Promise((done) => server.listen(0, '127.0.0.1', done));
  browser = await chromium.launch({
    headless: true,
    ...(process.env.WCL_CHROMIUM_PATH ? {executablePath: process.env.WCL_CHROMIUM_PATH} : {}),
  });
  for (const profile of profiles) {
    const page = await browser.newPage({viewport: profile, hasTouch: profile.cpu > 1});
    page.setDefaultTimeout(10000);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', {rate: profile.cpu});
    await page.addInitScript(() => {
      const tasks = [];
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries())
          tasks.push({start: entry.startTime, duration: entry.duration});
      });
      observer.observe({type: 'longtask', buffered: true});
      window.chartPerformance = {tasks, observer};
    });
    for (const kind of kinds) {
      await page.goto(`http://127.0.0.1:${server.address().port}/?kind=${kind}`);
      const canvas = page.locator('[data-wcl-chart-canvas]').first();
      try {
        await canvas.waitFor({state: 'visible'});
      } catch (error) {
        throw new Error(
          `${kind} did not render: ${errors.join('; ') || (await page.locator('body').innerText())}`,
          {cause: error},
        );
      }
      await canvas.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await canvas.focus();
      await page.keyboard.press('Home');
      await page.waitForTimeout(100);
      const operations = [];
      async function measure(name, selector, action, animated = false) {
        const latencies = [],
          frames = [],
          tasks = [];
        for (let i = 0; i < samples; i++) {
          if (
            name === 'visibility' &&
            kind === 'heatmap' &&
            i % 2 &&
            !(await page.getByRole('dialog', {name: 'Manage visibility', exact: true}).count())
          )
            await page.getByRole('button', {name: /^Restore .* hidden dimensions$/}).click();
          await page.evaluate(
            ({selector, animated, name}) => {
              const state = window.chartPerformance;
              const read = () => {
                if (selector === 'visibility')
                  return [...document.querySelectorAll('button')]
                    .map((e) => e.getAttribute('aria-label'))
                    .join('|');
                if (selector === 'drag') {
                  const box = document.querySelector('[data-wcl-chart-selection-box]');
                  return box
                    ? ['x', 'y', 'width', 'height'].map((a) => box.getAttribute(a)).join('|')
                    : null;
                }
                if (selector === 'visual') {
                  const canvas = document.querySelector('[data-wcl-chart-canvas]');
                  const marks = canvas.querySelectorAll(
                    '[data-wcl-chart-line], [data-wcl-chart-bar], [data-wcl-statistical-point], [data-wcl-histogram-bin], [data-wcl-box-quartile], [data-wcl-radial-slice], [data-wcl-radar-point], [data-wcl-heatmap-cell]',
                  );
                  if (!marks.length)
                    throw new Error('No production marks for animation measurement');
                  return JSON.stringify([
                    marks.length,
                    ...[...marks]
                      .slice(0, 3)
                      .map((e) =>
                        [
                          'd',
                          'x',
                          'y',
                          'width',
                          'height',
                          'cx',
                          'cy',
                          'r',
                          'transform',
                          'fill',
                          'style',
                          'opacity',
                        ].map((a) => e.getAttribute(a)),
                      ),
                  ]);
                }
                return document.querySelector(selector)?.textContent;
              };
              const before = read();
              state.pending = new Promise((resolve, reject) => {
                let start, previous, changedAt, paintedAt;
                const frameTimes = [];
                const input = () => {
                  start ??= performance.now();
                };
                const inputEvents = ['reading', 'selection'].includes(name)
                  ? ['keydown']
                  : name.includes('drag')
                    ? ['pointerdown']
                    : ['pointerup'];
                for (const type of inputEvents) document.addEventListener(type, input, true);
                const changed = () => {
                  if (start !== undefined && changedAt === undefined && read() !== before)
                    changedAt = performance.now();
                };
                const changes = new MutationObserver(changed);
                const canvas = document.querySelector('[data-wcl-chart-canvas]');
                const targets =
                  selector === 'visual'
                    ? [
                        ...canvas.querySelectorAll(
                          '[data-wcl-chart-line], [data-wcl-chart-bar], [data-wcl-statistical-point], [data-wcl-histogram-bin], [data-wcl-box-quartile], [data-wcl-radial-slice], [data-wcl-radar-point], [data-wcl-heatmap-cell]',
                        ),
                      ].slice(0, 3)
                    : selector === 'visibility'
                      ? [...document.querySelectorAll('button')]
                      : selector === 'drag'
                        ? [canvas]
                        : [document.querySelector(selector)];
                for (const target of targets) {
                  if (!target) throw new Error(`Missing measurement target ${selector}`);
                  changes.observe(target, {
                    attributes: true,
                    childList: true,
                    characterData: true,
                    subtree: selector !== 'visual',
                  });
                }
                // Ranked or paged charts may replace the sampled elements.
                if (selector === 'visual')
                  changes.observe(canvas, {childList: true, subtree: true});
                const cleanup = () => {
                  changes.disconnect();
                  for (const type of inputEvents) document.removeEventListener(type, input, true);
                };
                const armedAt = performance.now();
                const tick = (now) => {
                  if (now - armedAt > 3000) {
                    cleanup();
                    reject(new Error(`No visible change for ${selector}; before=${before}`));
                    return;
                  }
                  if (start !== undefined) {
                    // Observe the actual DOM change, then allow its next paint. Polling before
                    // React's animation callback would charge the chart two extra frames.
                    if (changedAt !== undefined && now > changedAt) {
                      if (previous !== undefined) frameTimes.push(now - previous);
                      previous = now;
                      paintedAt ??= now;
                    }
                    if (paintedAt !== undefined && (!animated || now - changedAt >= 240)) {
                      cleanup();
                      for (const entry of state.observer.takeRecords())
                        state.tasks.push({start: entry.startTime, duration: entry.duration});
                      resolve({
                        latency: paintedAt - start,
                        frames: animated ? frameTimes : [],
                        tasks: state.tasks
                          .filter((e) => e.start + e.duration > start && e.start <= now)
                          .map((e) => e.duration),
                      });
                      return;
                    }
                  }
                  requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
              });
            },
            {selector, animated, name},
          );
          await action(i);
          const sample = await page.evaluate(() => window.chartPerformance.pending);
          if (
            name === 'visibility' &&
            kind === 'heatmap' &&
            i % 2 &&
            !(await page.getByRole('dialog', {name: 'Manage visibility', exact: true}).count())
          )
            await page.keyboard.press('Escape');
          latencies.push(sample.latency);
          frames.push(...sample.frames);
          tasks.push(...sample.tasks);
        }
        const result = {
          name,
          samples: latencies.length,
          latencyP95: percentile(latencies, 0.95),
          latencyMax: Math.max(...latencies),
          frameP95: percentile(frames, 0.95),
          frameMax: Math.max(0, ...frames),
          longTaskMax: Math.max(0, ...tasks),
          latencies,
          frames,
          tasks,
        };
        result.pass =
          Math.round(result.latencyP95) <= 100 &&
          Math.round(result.frameP95) <= profile.frameBudget &&
          result.longTaskMax <= 200;
        operations.push(result);
        process.stdout.write(
          `${profile.name} ${kind} ${name}: feedback ${result.latencyP95.toFixed(1)}ms, frames ${result.frameP95.toFixed(1)}ms, task ${result.longTaskMax.toFixed(1)}ms ${result.pass ? 'PASS' : 'FAIL'}\n`,
        );
      }
      await measure('reading', '[data-wcl-chart-tooltip]', (i) =>
        page.keyboard.press(
          kind === 'bars' ? (i % 2 ? 'ArrowUp' : 'ArrowDown') : i % 2 ? 'ArrowLeft' : 'ArrowRight',
        ),
      );
      await measure('selection', '[data-perf-selection]', () => page.keyboard.press('Enter'));
      if (['line', 'scatter', 'bubble', 'heatmap'].includes(kind)) {
        await canvas.scrollIntoViewIfNeeded();
        await measure('drag selection', 'drag', async (i) => {
          const box = await canvas.boundingBox();
          const x = box.x + box.width * (i % 2 ? 0.55 : 0.25);
          const y = box.y + box.height * 0.3;
          const before = await page.locator('[data-perf-selection]').textContent();
          await page.mouse.move(x, y);
          await page.mouse.down();
          await page.mouse.move(x + box.width * 0.2, box.y + box.height * 0.8, {steps: 6});
          await page.waitForTimeout(35);
          await page.mouse.up();
          await page.waitForFunction(
            (before) => document.querySelector('[data-perf-selection]').textContent !== before,
            before,
          );
        });
      }
      const manager = page.getByRole('button', {name: 'Manage visibility', exact: true});
      if (kind === 'heatmap' && (await manager.count())) await manager.click();
      const hide = page.getByRole('button', {name: /^Hide /}).first();
      if (await hide.count()) {
        const hideName = await hide.getAttribute('aria-label');
        await hide.scrollIntoViewIfNeeded();
        await measure(
          'visibility',
          'visibility',
          (i) =>
            page
              .getByRole('button', {
                name: i % 2 ? hideName.replace(/^Hide /, 'Show ') : hideName,
                exact: true,
              })
              .click(),
          true,
        );
      }
      const managementDialog = page.getByRole('dialog', {name: 'Manage visibility', exact: true});
      if (await managementDialog.count()) {
        await page.keyboard.press('Escape');
        await managementDialog.waitFor({state: 'hidden'});
      }
      const zoom = page.getByRole('button', {name: 'Zoom in', exact: true});
      if (await zoom.count()) {
        await zoom.scrollIntoViewIfNeeded();
        await measure(
          'zoom',
          '[data-perf-window]',
          (i) =>
            page
              .getByRole('button', {
                name: i % 2 ? 'Reset view' : 'Zoom in',
                exact: true,
              })
              .click(),
          true,
        );
        await zoom.click();
        const right = page.getByRole('button', {
          name: kind === 'bars' ? 'Pan down' : 'Pan right',
          exact: true,
        });
        await measure('pan', '[data-perf-window]', (i) =>
          (i % 2
            ? page.getByRole('button', {name: kind === 'bars' ? 'Pan up' : 'Pan left', exact: true})
            : right
          ).click(),
        );
        await page.getByRole('button', {name: 'Overview', exact: true}).click();
        const overviewWindow = page
          .locator('[data-wcl-chart-exploration-window], [data-wcl-chart-rectangular-window]')
          .first();
        await overviewWindow.waitFor({state: 'visible'});
        await measure('overview drag', '[data-perf-window]', async (i) => {
          const box = await overviewWindow.boundingBox();
          const x = box.x + box.width / 2,
            y = box.y + box.height / 2;
          await page.mouse.move(x, y);
          await page.mouse.down();
          await page.mouse.move(x + (i % 2 ? -18 : 18), y, {steps: 6});
          await page.mouse.up();
        });
        await page.getByRole('button', {name: 'Done', exact: true}).click();
        await page.getByRole('dialog', {name: 'Overview', exact: true}).waitFor({state: 'hidden'});
        await page.getByRole('button', {name: 'Reset view', exact: true}).click();
      }
      await canvas.scrollIntoViewIfNeeded();
      const clear = page.getByRole('button', {name: 'Clear selection', exact: true});
      if ((await clear.count()) && (await clear.isEnabled())) await clear.click();
      await canvas.focus();
      await page.keyboard.press('Home');
      await page.keyboard.press('Enter');
      const update = page.getByRole('button', {name: 'Update values', exact: true});
      await update.scrollIntoViewIfNeeded();
      await measure('animation', 'visual', () => update.click(), true);
      if (errors.length) throw new Error(errors.join('\n'));
      results.push({profile, kind, operations});
      await writeReport();
    }
    await page.close();
  }
  async function writeReport() {
    await writeFile(
      output,
      `${JSON.stringify(
        {
          environment: {
            date: new Date().toISOString(),
            browser: browser.version(),
            node: process.version,
            platform: `${platform()} ${release()}`,
            cpu: cpus()[0]?.model,
            logicalCpus: cpus().length,
          },
          budgets: {
            feedbackP95: 100,
            desktopFrameP95: 34,
            constrainedFrameP95: 50,
            longTaskMax: 200,
          },
          results,
        },
        null,
        2,
      )}\n`,
    );
  }
  if (results.some((r) => r.operations.some((o) => !o.pass))) process.exitCode = 1;
} finally {
  await browser?.close();
  await new Promise((done) => server.close(done));
  await rm(build, {recursive: true, force: true});
}
