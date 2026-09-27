export interface WaitOptions {
  /** Total polling deadline in milliseconds. Default 4000. */
  timeout?: number;
  /** Required consecutive good samples spanning this duration. Default 80ms, at least three frames. */
  stableFor?: number;
}

/** The small subset of Playwright Page used by these optional helpers. */
export interface TestingPage {
  evaluate<R, A>(fn: (arg: A) => R | Promise<R>, arg: A): Promise<R>;
  evaluate<R>(fn: () => R | Promise<R>): Promise<R>;
}

/** Locators are resolved again on every sample. No captured element handles. */
export interface TestingLocator {
  page(): TestingPage;
  evaluateAll<R>(fn: (elements: Element[]) => R | Promise<R>): Promise<R>;
}

export interface ContrastSample {
  text: string;
  ratio: number;
  minimum: number;
  unsupported: string[];
}

export function waitForFocus(locator: TestingLocator, options?: WaitOptions): Promise<void>;
export function waitForVisualState(page: TestingPage, options?: WaitOptions): Promise<void>;
export function assertTextContrast(
  locator: TestingLocator,
  options?: WaitOptions,
): Promise<ContrastSample[]>;
