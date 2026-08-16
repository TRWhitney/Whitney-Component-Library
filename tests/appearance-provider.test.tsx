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
  it('applies appearance, accent, and accessible derived accent roles', () => {
    const {getByTestId} = render(
      <AppearanceProvider appearance="light" accent="#f5d90a">
        <span data-testid="child">Ready</span>
      </AppearanceProvider>,
    );

    const provider = getByTestId('child').parentElement;

    expect(provider?.getAttribute('data-wcl-appearance')).toBe('light');
    expect(provider?.style.getPropertyValue('--wcl-accent')).toBe('#f5d90a');
    expect(provider?.style.getPropertyValue('--wcl-accent-contrast')).toBe('#152027');
    expect(provider?.style.getPropertyValue('--wcl-accent-text')).not.toBe('#f5d90a');
  });

  it.each(
    (['light', 'dark'] as const).flatMap((appearance) =>
      (['#2474ff', '#ff0000', '#777777', '#949494', '#f5d90a', '#ffffff', '#000000'] as const).map(
        (accent) => [appearance, accent] as const,
      ),
    ),
  )('derives readable roles in %s appearance for the %s accent', (appearance, accent) => {
    const {container} = render(
      <AppearanceProvider appearance={appearance} accent={accent}>
        <span />
      </AppearanceProvider>,
    );
    const provider = container.firstElementChild as HTMLElement;
    const surfaces =
      appearance === 'light'
        ? ['#e9edef', '#ffffff', '#edf1f3']
        : ['#11171b', '#182126', '#202b31', '#243138'];

    const fill = provider.style.getPropertyValue('--wcl-accent-fill');
    const soft = provider.style.getPropertyValue('--wcl-accent-soft');

    expect(
      contrastRatio(fill, provider.style.getPropertyValue('--wcl-accent-contrast')),
    ).toBeGreaterThanOrEqual(4.5);
    for (const surface of surfaces) {
      expect(contrastRatio(surface, fill)).toBeGreaterThanOrEqual(3);
      expect(
        contrastRatio(surface, provider.style.getPropertyValue('--wcl-accent-text')),
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrastRatio(surface, provider.style.getPropertyValue('--wcl-accent-focus')),
      ).toBeGreaterThanOrEqual(3);
      expect(
        contrastRatio(surface, provider.style.getPropertyValue('--wcl-accent-rail')),
      ).toBeGreaterThanOrEqual(3);
    }
    expect(
      contrastRatio(soft, provider.style.getPropertyValue('--wcl-accent-rail')),
    ).toBeGreaterThanOrEqual(3);
    expect(
      contrastRatio(soft, provider.style.getPropertyValue('--wcl-accent-text')),
    ).toBeGreaterThanOrEqual(4.5);
  });

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
