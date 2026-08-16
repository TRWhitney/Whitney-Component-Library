import {act, render} from '@testing-library/react';
import {renderToString} from 'react-dom/server';
import {hydrateRoot} from 'react-dom/client';
import {describe, expect, it} from 'vitest';

import {
  AppearanceProvider,
  Divider,
  InlineGroup,
  ResponsiveGrid,
  ScrollRegion,
  Section,
  Stack,
  Surface,
} from '../src/index.js';

describe('layout and surface primitives', () => {
  it('expresses bounded spacing, alignment, wrapping, and equal-item choices', () => {
    const {container} = render(
      <Stack gap="relaxed" align="center">
        <InlineGroup gap="tight" align="stretch" wrap={false} equalItems>
          <span>Solver</span>
          <span>Tolerance</span>
        </InlineGroup>
        <ResponsiveGrid gap="regular" minimumItemWidth="wide" equalItems>
          <article>North chamber</article>
          <article>South chamber</article>
        </ResponsiveGrid>
      </Stack>,
    );

    expect(container.querySelector('[data-wcl-stack]')).toMatchObject({
      dataset: {align: 'center', gap: 'relaxed'},
    });
    expect(container.querySelector('[data-wcl-inline-group]')).toMatchObject({
      dataset: {align: 'stretch', equalItems: 'true', gap: 'tight', wrap: 'false'},
    });
    expect(container.querySelector('[data-wcl-responsive-grid]')).toMatchObject({
      dataset: {equalItems: 'true', gap: 'regular', minimumItemWidth: 'wide'},
    });
  });

  it('keeps surface treatment separate from semantic section structure', () => {
    const {getByRole, getByText} = render(
      <Surface variant="raised" padding="spacious">
        <Section
          title="Boundary conditions"
          description="Resolve every condition before running."
          headingLevel={5}
          actions={<button type="button">Review</button>}
        >
          <p>Six of six conditions resolved.</p>
        </Section>
      </Surface>,
    );

    expect(getByText('Boundary conditions').tagName).toBe('H5');
    expect(getByRole('region', {name: 'Boundary conditions'})).not.toBeNull();
    expect(getByRole('button', {name: 'Review'})).not.toBeNull();
    expect(getByText('Boundary conditions').closest('[data-wcl-surface]')).toMatchObject({
      dataset: {padding: 'spacious', variant: 'raised'},
    });
  });

  it('distinguishes semantic and decorative dividers', () => {
    const {getByRole, rerender, queryByRole} = render(<Divider orientation="vertical" />);

    expect(getByRole('separator').getAttribute('aria-orientation')).toBe('vertical');

    rerender(<Divider decorative />);

    expect(queryByRole('separator')).toBeNull();
  });

  it('makes bounded scroll content a labeled keyboard focus target', () => {
    const {getByRole} = render(
      <ScrollRegion label="Solver history" size="compact" orientation="both">
        <pre>Iteration 0284</pre>
      </ScrollRegion>,
    );
    const region = getByRole('region', {name: 'Solver history'});

    expect(region.getAttribute('tabindex')).toBe('0');
    expect(region).toMatchObject({
      dataset: {orientation: 'both', size: 'compact'},
    });

    region.focus();
    expect(document.activeElement).toBe(region);
  });

  it('server-renders and hydrates a composed layout deterministically', async () => {
    const view = (
      <AppearanceProvider appearance="dark" accent="#2474ff">
        <Surface>
          <Section title="Thermal envelope">
            <ResponsiveGrid>
              <Stack>
                <span>Solver</span>
                <span>Adaptive mesh</span>
              </Stack>
              <ScrollRegion label="Run history">
                <span>Iteration 0284</span>
              </ScrollRegion>
            </ResponsiveGrid>
          </Section>
        </Surface>
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
    expect(container.querySelector('[data-wcl-section]')?.textContent).toContain(
      'Thermal envelope',
    );

    act(() => {
      root.unmount();
    });
  });
});
