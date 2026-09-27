import type {Page, Locator} from 'playwright';
import {waitForFocus, waitForVisualState, assertTextContrast} from './testing.mjs';

declare const page: Page;
declare const locator: Locator;
await waitForFocus(locator, {timeout: 2000});
await waitForVisualState(page);
const samples = await assertTextContrast(locator);
const ratio: number = samples[0].ratio;
void ratio;
// @ts-expect-error A DOM element is not a live locator.
await waitForFocus(document.body);
// @ts-expect-error Timeout values use milliseconds as numbers.
await waitForVisualState(page, {timeout: '2000'});
