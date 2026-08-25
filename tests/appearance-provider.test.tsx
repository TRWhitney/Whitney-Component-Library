import {cleanup, render} from '@testing-library/react';
import {act} from 'react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {afterEach, describe, expect, it} from 'vitest';

import {AppearanceProvider} from '../src/index.js';

(globalThis as typeof globalThis & {IS_REACT_ACT_ENVIRONMENT: boolean}).IS_REACT_ACT_ENVIRONMENT =
  true;

afterEach(cleanup);

describe('AppearanceProvider', () => {
  it('keeps deep-purple identity rich while structural roles stay saturated and visible', () => {
    const {getByTestId} = render(
      <AppearanceProvider appearance="dark" accent="#2d0548">
        <span data-testid="child">Ready</span>
      </AppearanceProvider>,
    );

    const provider = getByTestId('child').parentElement;
    if (!provider) throw new Error('Expected an appearance provider boundary.');
    const fill = provider.style.getPropertyValue('--wcl-accent-fill');
    const boundary = provider.style.getPropertyValue('--wcl-accent-fill-boundary-on-base');
    const focus = provider.style.getPropertyValue('--wcl-accent-focus-on-base');
    const muted = provider.style.getPropertyValue('--wcl-accent-muted-on-base');
    const rail = provider.style.getPropertyValue('--wcl-accent-rail-on-base');
    const soft = provider.style.getPropertyValue('--wcl-accent-soft-on-base');
    const source = oklch(fill);

    expect(provider.getAttribute('data-wcl-appearance')).toBe('dark');
    expect(provider.style.getPropertyValue('--wcl-accent')).toBe('#2d0548');
    expect(fill).toBe('#2d0548');
    expect(soft).not.toBe('#1b1d2a');
    expect(hueDistance(oklch(soft).hue, source.hue)).toBeLessThanOrEqual(6);
    expect(oklch(soft).chroma).toBeGreaterThanOrEqual(source.chroma * 0.7);

    for (const structuralRole of [boundary, focus, muted, rail]) {
      const role = oklch(structuralRole);
      expect(hueDistance(role.hue, source.hue)).toBeLessThanOrEqual(6);
      expect(role.chroma).toBeGreaterThan(source.chroma);
      expect(contrastRatio(structuralRole, '#182126')).toBeGreaterThanOrEqual(3);
    }
    expect(contrastRatio(boundary, fill)).toBeGreaterThanOrEqual(3);
    expect(
      contrastRatio(soft, provider.style.getPropertyValue('--wcl-accent-hover-contrast-on-base')),
    ).toBeGreaterThanOrEqual(4.5);
    expect(provider.style.getPropertyValue('--wcl-accent-text')).toBe('');
  });

  it('derives support against each owned surface instead of one shared approximation', () => {
    const {container} = render(
      <AppearanceProvider appearance="dark" accent="#5f6b72">
        <span />
      </AppearanceProvider>,
    );
    const provider = container.firstElementChild as HTMLElement;

    expect(provider.style.getPropertyValue('--wcl-accent-fill-boundary-on-canvas')).toBe(
      'transparent',
    );
    expect(provider.style.getPropertyValue('--wcl-accent-fill-boundary-on-base')).not.toBe(
      'transparent',
    );
    expect(provider.style.getPropertyValue('--wcl-accent-fill-boundary-on-raised')).not.toBe(
      'transparent',
    );
    expect(provider.style.getPropertyValue('--wcl-accent-fill-boundary-on-subtle')).not.toBe(
      'transparent',
    );
  });

  it('gives every literal primary fill a distinct hover edge', () => {
    const {container} = render(
      <AppearanceProvider appearance="dark" accent="#2474ff">
        <span />
      </AppearanceProvider>,
    );
    const provider = container.firstElementChild as HTMLElement;
    const fill = provider.style.getPropertyValue('--wcl-accent-fill');
    const hoverEdge = provider.style.getPropertyValue('--wcl-accent-hover-edge');

    expect(provider.style.getPropertyValue('--wcl-accent-fill-boundary-on-base')).toBe(
      'transparent',
    );
    expect(hoverEdge).not.toBe('');
    expect(hoverEdge).not.toBe('transparent');
    expect(contrastRatio(fill, hoverEdge)).toBeGreaterThanOrEqual(3);
  });

  it.each(
    (['light', 'dark'] as const).flatMap((appearance) =>
      (
        [
          '#2474ff',
          '#2b0a64',
          '#ff0000',
          '#777777',
          '#949494',
          '#f5d90a',
          '#ffffff',
          '#000000',
        ] as const
      ).map((accent) => [appearance, accent] as const),
    ),
  )(
    'preserves the %s appearance fill and derives support for the %s accent',
    (appearance, accent) => {
      const {container} = render(
        <AppearanceProvider appearance={appearance} accent={accent}>
          <span />
        </AppearanceProvider>,
      );
      const provider = container.firstElementChild as HTMLElement;
      const fill = provider.style.getPropertyValue('--wcl-accent-fill');
      const surfaces =
        appearance === 'light'
          ? {base: '#ffffff', canvas: '#e9edef', raised: '#ffffff', subtle: '#edf1f3'}
          : {base: '#182126', canvas: '#11171b', raised: '#202b31', subtle: '#243138'};

      expect(fill).toBe(accent);
      expect(
        contrastRatio(fill, provider.style.getPropertyValue('--wcl-accent-contrast')),
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrastRatio(fill, provider.style.getPropertyValue('--wcl-accent-hover-edge')),
      ).toBeGreaterThanOrEqual(3);

      for (const [surfaceName, componentSurface] of Object.entries(surfaces)) {
        const fillBoundary = provider.style.getPropertyValue(
          `--wcl-accent-fill-boundary-on-${surfaceName}`,
        );
        const muted = provider.style.getPropertyValue(`--wcl-accent-muted-on-${surfaceName}`);
        const soft = provider.style.getPropertyValue(`--wcl-accent-soft-on-${surfaceName}`);
        const focus = provider.style.getPropertyValue(`--wcl-accent-focus-on-${surfaceName}`);
        const rail = provider.style.getPropertyValue(`--wcl-accent-rail-on-${surfaceName}`);

        expect(
          contrastRatio(
            soft,
            provider.style.getPropertyValue(`--wcl-accent-hover-contrast-on-${surfaceName}`),
          ),
        ).toBeGreaterThanOrEqual(4.5);

        const needsBoundary = contrastRatio(componentSurface, fill) < 3;
        if (needsBoundary) {
          expect(fillBoundary).not.toBe('transparent');
          expect(contrastRatio(fill, fillBoundary)).toBeGreaterThanOrEqual(3);
          expect(contrastRatio(componentSurface, fillBoundary)).toBeGreaterThanOrEqual(3);
        } else {
          expect(fillBoundary).toBe('transparent');
        }
        expect(contrastRatio(componentSurface, focus)).toBeGreaterThanOrEqual(3);
        expect(contrastRatio(componentSurface, rail)).toBeGreaterThanOrEqual(3);
        expect(contrastRatio(componentSurface, muted)).toBeGreaterThanOrEqual(3);
      }
      expect(provider.style.getPropertyValue('--wcl-accent-text')).toBe('');
    },
  );

  it.each(['light', 'dark'] as const)(
    'derives five distinct chart hues from a chromatic accent in %s appearance',
    (appearance) => {
      const {container} = render(
        <AppearanceProvider appearance={appearance} accent="#e11919">
          <span />
        </AppearanceProvider>,
      );
      const provider = container.firstElementChild as HTMLElement;
      const series = [2, 3, 4, 5, 6].map((index) =>
        provider.style.getPropertyValue(`--wcl-chart-series-${index}-on-canvas`),
      );

      expect(new Set(series).size).toBe(5);
      expect(series.every((color) => /^#[0-9a-f]{6}$/.test(color))).toBe(true);
      expect(series.every((color) => oklch(color).chroma >= 0.08)).toBe(true);
      expect(
        series.every(
          (color) => contrastRatio(color, appearance === 'light' ? '#e9edef' : '#11171b') >= 3,
        ),
      ).toBe(true);
    },
  );

  it.each(['light', 'dark'] as const)(
    'uses the default blue orbit for achromatic accents in %s appearance',
    (appearance) => {
      const {container} = render(
        <>
          <AppearanceProvider appearance={appearance} accent="#000000">
            <span />
          </AppearanceProvider>
          <AppearanceProvider appearance={appearance} accent="#111111">
            <span />
          </AppearanceProvider>
          <AppearanceProvider appearance={appearance} accent="#eeeeee">
            <span />
          </AppearanceProvider>
          <AppearanceProvider appearance={appearance} accent="#ffffff">
            <span />
          </AppearanceProvider>
          <AppearanceProvider appearance={appearance} accent="#2878ff">
            <span />
          </AppearanceProvider>
        </>,
      );
      const [black, nearBlack, nearWhite, white, blue] = [
        ...container.querySelectorAll<HTMLElement>('[data-wcl-provider]'),
      ];
      const palette = (provider: HTMLElement | undefined) =>
        [2, 3, 4, 5, 6].map((index) =>
          provider?.style.getPropertyValue(`--wcl-chart-series-${index}-on-canvas`),
        );

      expect(palette(black)).toEqual(palette(blue));
      expect(palette(nearBlack)).toEqual(palette(blue));
      expect(palette(nearWhite)).toEqual(palette(blue));
      expect(palette(white)).toEqual(palette(blue));
      expect(black?.style.getPropertyValue('--wcl-accent')).toBe('#000000');
      expect(nearBlack?.style.getPropertyValue('--wcl-accent')).toBe('#111111');
      expect(nearWhite?.style.getPropertyValue('--wcl-accent')).toBe('#eeeeee');
      expect(white?.style.getPropertyValue('--wcl-accent')).toBe('#ffffff');
    },
  );

  it('updates the scoped appearance without mutating the document root', () => {
    const {getByTestId, rerender} = render(
      <AppearanceProvider appearance="light" accent="#2474ff">
        <span data-testid="child" />
      </AppearanceProvider>,
    );

    rerender(
      <AppearanceProvider appearance="dark" accent="#2474ff">
        <span data-testid="child" />
      </AppearanceProvider>,
    );

    expect(getByTestId('child').parentElement?.getAttribute('data-wcl-appearance')).toBe('dark');
    expect(document.documentElement.hasAttribute('data-wcl-appearance')).toBe(false);
  });

  it('renders the same deterministic provider boundary on the server', () => {
    const first = renderToString(
      <AppearanceProvider appearance="dark" accent="#2474ff">
        <span>Profile</span>
      </AppearanceProvider>,
    );
    const second = renderToString(
      <AppearanceProvider appearance="dark" accent="#2474ff">
        <span>Profile</span>
      </AppearanceProvider>,
    );

    expect(first).toBe(second);
    expect(first).toContain('data-wcl-appearance="dark"');
  });

  it('hydrates the server boundary without a recoverable mismatch', async () => {
    const view = (
      <AppearanceProvider appearance="dark" accent="#2474ff">
        <span>Profile</span>
      </AppearanceProvider>
    );
    const container = document.createElement('div');
    const recoverableErrors: unknown[] = [];
    container.innerHTML = renderToString(view);

    const root = hydrateRoot(container, view, {
      onRecoverableError(error) {
        recoverableErrors.push(error);
      },
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(recoverableErrors).toEqual([]);
    expect(container.querySelector('[data-wcl-provider]')?.textContent).toBe('Profile');

    act(() => {
      root.unmount();
    });
  });

  it('rejects accent values outside the documented six-digit hex boundary', () => {
    expect(() =>
      renderToString(
        <AppearanceProvider appearance="light" accent={'red' as `#${string}`}>
          <span />
        </AppearanceProvider>,
      ),
    ).toThrow(/six-digit hexadecimal/i);
  });
});

function contrastRatio(first: string, second: string): number {
  const luminance = (color: string) => {
    const channels = [1, 3, 5].map((offset) =>
      Number.parseInt(color.slice(offset, offset + 2), 16),
    );
    const [red = 0, green = 0, blue = 0] = channels.map((channel) => {
      const normalized = channel / 255;
      return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return ((values[0] ?? 0) + 0.05) / ((values[1] ?? 0) + 0.05);
}

function oklch(color: string): {chroma: number; hue: number; lightness: number} {
  const [red, green, blue] = [1, 3, 5]
    .map((offset) => Number.parseInt(color.slice(offset, offset + 2), 16) / 255)
    .map((channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));
  const lRoot = Math.cbrt(
    0.4122214708 * (red ?? 0) + 0.5363325363 * (green ?? 0) + 0.0514459929 * (blue ?? 0),
  );
  const mRoot = Math.cbrt(
    0.2119034982 * (red ?? 0) + 0.6806995451 * (green ?? 0) + 0.1073969566 * (blue ?? 0),
  );
  const sRoot = Math.cbrt(
    0.0883024619 * (red ?? 0) + 0.2817188376 * (green ?? 0) + 0.6299787005 * (blue ?? 0),
  );
  const lightness = 0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot;
  const a = 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot;
  const b = 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot;

  return {
    chroma: Math.hypot(a, b),
    hue: (Math.atan2(b, a) * 180) / Math.PI,
    lightness,
  };
}

function hueDistance(first: number, second: number): number {
  const difference = Math.abs(first - second) % 360;
  return Math.min(difference, 360 - difference);
}
