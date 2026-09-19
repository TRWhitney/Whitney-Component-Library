import {act, cleanup, fireEvent, render} from '@testing-library/react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {AppearanceProvider, FocusField, Surface} from '../src/index.js';

let resize: (() => void) | undefined;
let anchorLeft = 24;
let anchorTop = 24;
let anchorWidth = 640;
beforeEach(() => {
  anchorLeft = 24;
  anchorTop = 24;
  anchorWidth = 640;
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: () => void) {
        resize = callback;
      }
      observe() {}
      disconnect() {}
    },
  );
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ) {
    if (this.hasAttribute('data-wcl-focus-field')) return new DOMRect(0, 0, 1000, 700);
    if (this.hasAttribute('data-wcl-focus-field-anchor'))
      return new DOMRect(anchorLeft, anchorTop, anchorWidth, 300);
    return new DOMRect(720, 24, 256, 400);
  });
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

function view(active: boolean, anchored = true) {
  return (
    <AppearanceProvider appearance="dark" accent="#2474ff">
      <FocusField isActive={active}>
        <div>
          <Surface focusFieldAnchor={anchored}>
            <button type="button">Review document</button>
          </Surface>
          <Surface variant="raised">Publication</Surface>
        </div>
      </FocusField>
    </AppearanceProvider>
  );
}

describe('FocusField', () => {
  it('positions atmosphere behind the chosen panel and keeps child interaction and surfaces stable', () => {
    const {container, getByRole, rerender} = render(view(false));
    const field = container.querySelector<HTMLElement>('[data-wcl-focus-field]')!;
    const panel = getByRole('button').parentElement!;
    const panelBefore = panel.outerHTML;
    expect(field.hasAttribute('data-positioned')).toBe(true);
    const x = parseFloat(field.style.getPropertyValue('--wcl-field-x'));
    const y = parseFloat(field.style.getPropertyValue('--wcl-field-y')) - 24;
    expect(x).toBeGreaterThan(24);
    expect(x).toBeLessThan(664);
    expect(y).toBeGreaterThan(174);
    expect(y).toBeLessThan(210);
    rerender(view(true));
    expect(field.getAttribute('data-active')).toBe('true');
    expect(panel.outerHTML).toBe(panelBefore);
    getByRole('button').focus();
    fireEvent.click(getByRole('button'));
    expect(document.activeElement).toBe(getByRole('button'));
    expect(field.hasAttribute('tabindex')).toBe(false);
  });

  it('blooms only on activation, stops when inactive, and can activate again', () => {
    vi.useFakeTimers();
    const {container, rerender, unmount} = render(view(true));
    const field = container.querySelector('[data-wcl-focus-field]')!;
    expect(field.hasAttribute('data-pulse')).toBe(false);
    rerender(view(false));
    rerender(view(true));
    expect(field.hasAttribute('data-pulse')).toBe(true);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(field.hasAttribute('data-pulse')).toBe(false);
    rerender(view(false));
    rerender(view(true));
    expect(field.hasAttribute('data-pulse')).toBe(true);
    rerender(view(false));
    expect(field.hasAttribute('data-pulse')).toBe(false);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('suppresses missing or ambiguous anchors and restores a valid composition', async () => {
    const {container, rerender} = render(view(true, false));
    const field = container.querySelector('[data-wcl-focus-field]')!;
    expect(field.hasAttribute('data-positioned')).toBe(false);
    rerender(view(true));
    await act(async () => {
      await Promise.resolve();
    });
    expect(field.hasAttribute('data-positioned')).toBe(true);
    rerender(
      <FocusField isActive>
        <Surface focusFieldAnchor>A</Surface>
        <Surface focusFieldAnchor>B</Surface>
      </FocusField>,
    );
    await act(async () => {
      await Promise.resolve();
    });
    expect(container.querySelector('[data-positioned]')).toBeNull();
  });

  it('isolates nested fields and updates geometry on resize', () => {
    const {container} = render(
      <FocusField isActive>
        <Surface focusFieldAnchor>Outer</Surface>
        <FocusField isActive>
          <Surface focusFieldAnchor>Inner</Surface>
        </FocusField>
      </FocusField>,
    );
    expect(container.querySelectorAll('[data-positioned]')).toHaveLength(2);
    act(() => resize?.());
    expect(container.querySelectorAll('[data-positioned]')).toHaveLength(2);
  });

  it('resizes its spread and suppresses an anchor that becomes hidden', () => {
    const {container} = render(view(true));
    const field = container.querySelector<HTMLElement>('[data-wcl-focus-field]')!;
    const radius = parseFloat(field.style.getPropertyValue('--wcl-field-radius-x'));
    anchorWidth = 400;
    act(() => resize?.());
    expect(parseFloat(field.style.getPropertyValue('--wcl-field-radius-x'))).toBeLessThan(radius);
    anchorWidth = 0;
    act(() => resize?.());
    expect(field.hasAttribute('data-positioned')).toBe(false);
    anchorWidth = 640;
    act(() => resize?.());
    expect(field.hasAttribute('data-positioned')).toBe(true);
  });

  it('keeps the field attached when a nested scroller moves the anchor', () => {
    const {container, getByRole} = render(view(true));
    const field = container.querySelector<HTMLElement>('[data-wcl-focus-field]')!;
    const before = parseFloat(field.style.getPropertyValue('--wcl-field-y'));
    anchorTop = -40;
    fireEvent.scroll(getByRole('button').parentElement!.parentElement!);
    expect(parseFloat(field.style.getPropertyValue('--wcl-field-y'))).toBeLessThan(before);
  });

  it('tracks text-only reflow when the frame and panel dimensions do not change', async () => {
    const {container, getByText} = render(
      <FocusField isActive>
        <div>
          <p>Review guidance</p>
          <Surface focusFieldAnchor>Documents</Surface>
        </div>
        <Surface>Publication</Surface>
      </FocusField>,
    );
    const field = container.querySelector<HTMLElement>('[data-wcl-focus-field]')!;
    const before = parseFloat(field.style.getPropertyValue('--wcl-field-y'));
    anchorTop = 90;
    await act(async () => {
      getByText('Review guidance').firstChild!.nodeValue =
        'Longer review guidance wraps above the documents';
      await Promise.resolve();
    });
    expect(parseFloat(field.style.getPropertyValue('--wcl-field-y'))).toBeGreaterThan(before);
  });

  it('tracks inherited direction changes that move a panel without resizing it', async () => {
    const {container} = render(view(true));
    const field = container.querySelector<HTMLElement>('[data-wcl-focus-field]')!;
    const before = parseFloat(field.style.getPropertyValue('--wcl-field-x'));
    anchorLeft = 336;
    await act(async () => {
      container.dir = 'rtl';
      await Promise.resolve();
    });
    expect(parseFloat(field.style.getPropertyValue('--wcl-field-x'))).toBeGreaterThan(before);
  });

  it('hydrates without changing the consumer tree or introducing an initial pulse', async () => {
    const container = document.createElement('div');
    container.innerHTML = renderToString(view(true));
    const errors: unknown[] = [];
    let root: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(container, view(true), {
        onRecoverableError: (error) => errors.push(error),
      });
      await Promise.resolve();
    });
    expect(errors).toEqual([]);
    expect(container.querySelector('[data-pulse]')).toBeNull();
    act(() => root.unmount());
  });
});
