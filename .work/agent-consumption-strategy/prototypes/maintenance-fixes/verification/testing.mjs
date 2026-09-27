// Optional browser-check helpers. No application or Playwright runtime imports.
const defaults = {timeout: 4000, stableFor: 80};

async function untilStable(page, read, description, options = {}) {
  const {timeout, stableFor} = {...defaults, ...options};
  if (!Number.isFinite(timeout) || timeout <= 0 || !Number.isFinite(stableFor) || stableFor < 0)
    throw new Error('timeout must be positive and stableFor must be nonnegative');
  const deadline = Date.now() + timeout;
  let since;
  let samples = 0;
  let observed;
  while (Date.now() < deadline) {
    observed = await read();
    if (observed.ready) {
      since ??= Date.now();
      samples += 1;
      if (samples >= 3 && Date.now() - since >= stableFor) return;
    } else {
      since = undefined;
      samples = 0;
    }
    const remaining = deadline - Date.now();
    if (remaining <= 0) break;
    await page.evaluate(
      (remaining) =>
        new Promise((resolve) => {
          const timer = setTimeout(() => {
            cancelAnimationFrame(frame);
            resolve();
          }, remaining);
          const frame = requestAnimationFrame(() => {
            clearTimeout(timer);
            resolve();
          });
        }),
      remaining,
    );
  }
  throw new Error(`${description} within ${timeout}ms. Last sample: ${JSON.stringify(observed)}`);
}

export async function waitForFocus(locator, options) {
  await untilStable(
    locator.page(),
    async () => {
      const sample = await locator.evaluateAll((nodes) => ({
        count: nodes.length,
        ready: nodes.length === 1 && nodes[0] === nodes[0].ownerDocument.activeElement,
        active: document.activeElement?.outerHTML.slice(0, 200),
      }));
      if (sample.count > 1) throw new Error('waitForFocus requires a locator matching one element');
      return sample;
    },
    'Expected stable focus',
    options,
  );
}

export async function waitForVisualState(page, options) {
  await untilStable(
    page,
    () =>
      page.evaluate(() => {
        const active = document
          .getAnimations()
          .filter((animation) => animation.pending || animation.playState === 'running');
        return {
          ready: active.length === 0 && document.fonts.status === 'loaded',
          activeAnimations: active.length,
          fonts: document.fonts.status,
        };
      }),
    'Expected completed animations and loaded fonts',
    options,
  );
}

export async function assertTextContrast(locator, options) {
  await waitForVisualState(locator.page(), options);
  const samples = await locator.evaluateAll((roots) => {
    if (roots.length !== 1) throw new Error('assertTextContrast requires one root element');
    const root = roots[0];
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d', {willReadFrequently: true});
    const rgba = (color) => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      const pixel = context.getImageData(0, 0, 1, 1).data;
      return [pixel[0], pixel[1], pixel[2], pixel[3] / 255];
    };
    const over = (a, b) => [0, 1, 2].map((i) => a[i] * a[3] + b[i] * (1 - a[3])).concat(1);
    const luminance = (color) =>
      color
        .slice(0, 3)
        .map((value) => {
          const s = value / 255;
          return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        })
        .reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i], 0);
    const results = [];
    for (const node of [root, ...root.querySelectorAll('*')]) {
      if (
        node.closest('script,style,svg,canvas,[hidden],[inert],:disabled') ||
        !node.checkVisibility({checkOpacity: true, checkVisibilityCSS: true})
      )
        continue;
      const text =
        [...node.childNodes]
          .filter((child) => child.nodeType === Node.TEXT_NODE)
          .map((child) => child.textContent)
          .join('')
          .trim() || (node.matches('input,textarea') ? node.value : '');
      if (!text) continue;
      const style = getComputedStyle(node);
      const ancestors = [];
      for (let ancestor = node; ancestor; ancestor = ancestor.parentElement)
        ancestors.unshift(ancestor);
      let background = [255, 255, 255, 1];
      const unsupported = new Set();
      for (const ancestor of ancestors) {
        const current = getComputedStyle(ancestor);
        background = over(rgba(current.backgroundColor), background);
        if (Number(current.opacity) !== 1) unsupported.add('opacity');
        if (current.backgroundImage !== 'none') unsupported.add('background image');
        if (current.filter !== 'none' || current.backdropFilter !== 'none')
          unsupported.add('filter');
        if (current.mixBlendMode !== 'normal' || current.backgroundBlendMode !== 'normal')
          unsupported.add('blend mode');
        if (current.clipPath !== 'none' || current.clip !== 'auto') unsupported.add('clipping');
      }
      if (style.textShadow !== 'none') unsupported.add('text shadow');
      const a = luminance(over(rgba(style.color), background));
      const b = luminance(background);
      const large =
        parseFloat(style.fontSize) >= 24 ||
        (parseFloat(style.fontSize) >= 18.6667 && Number(style.fontWeight) >= 700);
      results.push({
        text: text.slice(0, 100),
        ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
        minimum: large ? 3 : 4.5,
        unsupported: [...unsupported],
      });
    }
    return results;
  });
  if (!samples.length) throw new Error('No supported visible text found');
  const unsupported = samples.filter((sample) => sample.unsupported.length);
  if (unsupported.length)
    throw new Error(`Text contrast needs visual review: ${JSON.stringify(unsupported)}`);
  const failed = samples.filter((sample) => sample.ratio < sample.minimum);
  if (failed.length) throw new Error(`Text contrast below minimum: ${JSON.stringify(failed)}`);
  return samples;
}
