const {test, expect} = require('@playwright/test');

const prototypeUrl = 'file:///home/trwhitney/projects/whitney_component_library/.work/library-foundation/prototypes/visual-directions.html';

test('exercises the accepted Focus + Rail + Momentum + Route direction', async ({page}) => {
  await page.setViewportSize({width: 1440, height: 1100});
  await page.goto(prototypeUrl);

  await expect(page.locator('html')).toHaveAttribute('data-direction', 'synthesis');
  await expect(page.locator('html')).toHaveAttribute('data-signature', 'base');
  await expect(page.locator('html')).toHaveAttribute('data-header', 'route');
  await expect(page.locator('[data-control="direction"], [data-control="signature"], [data-control="header"]')).toHaveCount(0);
  await expect(page.locator('#direction-code')).toHaveText('Accepted visual direction');
  await expect(page.locator('#signature-title')).toHaveText('Focus + Rail + Momentum + Route');

  const statusContrast = async () => page.locator('#run-status').evaluate((element) => {
    const parse = (value) => value.match(/[\d.]+/g).slice(0, 3).map(Number);
    const luminance = (rgb) => {
      const channels = rgb.map((value) => value / 255).map((value) => value <= .03928 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
      return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2];
    };
    const style = getComputedStyle(element);
    const foreground = luminance(parse(style.color));
    const background = luminance(parse(style.backgroundColor));
    return (Math.max(foreground, background) + .05) / (Math.min(foreground, background) + .05);
  });

  const routeStyle = async () => page.locator('.header-track').evaluate((element) => {
    const style = getComputedStyle(element);
    return {display: style.display, background: style.backgroundImage, width: element.clientWidth};
  });

  const assertRoute = async () => {
    const route = await routeStyle();
    expect(route.display).toBe('block');
    expect(route.background).toContain('linear-gradient');
    expect(route.width).toBeGreaterThan(17);
    expect(await page.locator('.run-code').evaluate((element) => getComputedStyle(element).boxShadow)).toBe('none');
    expect(await page.locator('.status-pill').evaluate((element) => getComputedStyle(element).boxShadow)).toBe('none');
  };

  const assertGlowSeparation = async () => {
    const field = await page.locator('.summary-field').evaluate((element) => {
      const style = getComputedStyle(element, '::before');
      return {
        content: style.content,
        background: style.backgroundImage,
        transform: style.transform,
        width: style.width,
        height: style.height,
        clientWidth: element.clientWidth,
        clientHeight: element.clientHeight
      };
    });
    const panel = await page.locator('.summary').evaluate((element) => ({
      glowContent: getComputedStyle(element, '::before').content,
      background: getComputedStyle(element).backgroundColor
    }));
    expect(field.content).not.toBe('none');
    expect(field.background).toContain('radial-gradient');
    expect(field.transform).toContain('-14');
    expect(Math.abs(parseFloat(field.width) + 8 - field.clientWidth)).toBeLessThanOrEqual(1);
    expect(Math.abs(parseFloat(field.height) + 8 - field.clientHeight)).toBeLessThanOrEqual(1);
    expect(panel.glowContent).toBe('none');
    expect(panel.background).not.toContain('rgba');
  };

  expect(await statusContrast()).toBeGreaterThanOrEqual(4.5);
  await assertRoute();
  await assertGlowSeparation();
  await page.getByRole('button', {name: 'Dark'}).click();
  expect(await statusContrast()).toBeGreaterThanOrEqual(4.5);
  await assertRoute();
  await page.getByRole('button', {name: 'Light', exact: true}).click();

  const conservative = page.getByRole('button', {name: 'Conservative'});
  const balanced = page.getByRole('button', {name: 'Balanced'});
  const fast = page.getByRole('button', {name: 'Fast'});
  const segmented = page.locator('.segmented');
  const railAtConservative = await segmented.evaluate((element) => getComputedStyle(element, '::after').transform);
  await balanced.hover();
  expect(await conservative.evaluate((element) => getComputedStyle(element).zIndex)).toBe('2');
  expect(await balanced.evaluate((element) => getComputedStyle(element).zIndex)).toBe('1');
  await balanced.click();
  await page.waitForTimeout(450);
  const railAtBalanced = await segmented.evaluate((element) => getComputedStyle(element, '::after').transform);
  expect(railAtBalanced).not.toBe(railAtConservative);
  await fast.hover();
  expect(await balanced.evaluate((element) => getComputedStyle(element).zIndex)).toBe('2');
  expect(await fast.evaluate((element) => getComputedStyle(element).zIndex)).toBe('1');
  await expect(balanced).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  expect(await balanced.evaluate((element) => getComputedStyle(element).boxShadow)).toBe('none');

  await page.getByRole('button', {name: 'Error'}).click();
  const solverBox = await page.locator('#solver').boundingBox();
  const toleranceBox = await page.locator('#tolerance').boundingBox();
  const profileLabelBox = await page.locator('#profile-label').boundingBox();
  const inlineErrorBox = await page.locator('#tolerance-error').boundingBox();
  expect(solverBox.y).toBe(toleranceBox.y);
  expect(solverBox.height).toBe(toleranceBox.height);
  expect(profileLabelBox.y - (toleranceBox.y + toleranceBox.height)).toBeGreaterThanOrEqual(27);
  expect(profileLabelBox.y - (toleranceBox.y + toleranceBox.height)).toBeLessThanOrEqual(29);
  expect(inlineErrorBox.y + inlineErrorBox.height).toBeLessThanOrEqual(profileLabelBox.y);

  await page.getByRole('button', {name: 'Compact'}).click();
  await expect(page.locator('.viewport')).toHaveCSS('width', '430px');
  await expect(page.locator('.workspace')).toHaveCSS('border-bottom-width', '0px');
  const compactWorkspace = await page.locator('.workspace').boundingBox();
  const compactSummary = await page.locator('.summary').boundingBox();
  expect(compactSummary.y - (compactWorkspace.y + compactWorkspace.height)).toBeGreaterThanOrEqual(11);
  await assertGlowSeparation();
  await assertRoute();
  expect(await page.locator('.app-shell').evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await page.screenshot({path: '.work/library-foundation/prototypes/inspection-accepted-compact.png', fullPage: true});

  await page.getByRole('button', {name: 'Wide'}).click();
  await page.getByRole('button', {name: 'Ready'}).click();
  await page.locator('#accent').fill('#8f4bd8');
  await page.getByRole('button', {name: 'Review conditions'}).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const readyColor = await dialog.getByText('Ready', {exact: true}).evaluate((element) => getComputedStyle(element).color);
  const reviewColor = await dialog.getByText('Review', {exact: true}).first().evaluate((element) => getComputedStyle(element).color);
  expect(readyColor).not.toBe(reviewColor);
  await page.getByRole('button', {name: 'Mark reviewed'}).click();
  await expect(page.getByText('6 of 6 conditions resolved')).toBeVisible();

  const readyRoute = (await routeStyle()).background;
  const runButton = page.getByRole('button', {name: 'Run profile'});
  await runButton.hover();
  expect(await runButton.evaluate((element) => getComputedStyle(element).transform)).not.toBe('none');
  await runButton.click();
  await expect(page.locator('.app-shell')).toHaveAttribute('data-running', 'true');
  await expect(page.locator('#run-status')).toHaveText('Solving');
  await expect(page.locator('#run-status')).toHaveAttribute('data-tone', 'warning');
  expect(await statusContrast()).toBeGreaterThanOrEqual(4.5);
  expect((await routeStyle()).background).not.toBe(readyRoute);
  expect(await page.locator('.summary-field').evaluate((element) => getComputedStyle(element, '::before').animationName)).toContain('focus-atmosphere');
  expect(await page.locator('.workflow').evaluate((element) => getComputedStyle(element, '::before').animationName)).toContain('momentum-surge');
  expect(await page.locator('.step.active .step-mark').evaluate((element) => getComputedStyle(element, '::after').animationIterationCount)).toBe('infinite');
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '72');
  await page.screenshot({path: '.work/library-foundation/prototypes/inspection-accepted-running.png', fullPage: true});

  await page.getByRole('button', {name: 'Disabled'}).click();
  await expect(page.locator('#solver')).toBeDisabled();
  await expect(page.locator('#tolerance')).toBeDisabled();
  await expect(page.locator('#run')).toBeDisabled();

  await page.getByRole('button', {name: 'Ready'}).click();
  await page.getByRole('button', {name: 'Dark'}).click();
  await page.getByRole('button', {name: 'Compact'}).click();
  await expect(page.locator('.viewport')).toHaveCSS('width', '430px');
  await assertGlowSeparation();
  await assertRoute();
  expect(await page.locator('.app-shell').evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await page.screenshot({path: '.work/library-foundation/prototypes/inspection-accepted-dark-compact.png', fullPage: true});

  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.getByRole('button', {name: 'Wide'}).click();
  await page.getByRole('button', {name: 'Run profile'}).click();
  expect(await page.locator('.step.active .step-mark').evaluate((element) => getComputedStyle(element, '::after').animationIterationCount)).toBe('1');
});
