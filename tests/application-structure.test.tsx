import {act, cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {useState} from 'react';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {AppearanceProvider, PageHeader, SplitView} from '../src/index.js';

afterEach(cleanup);

describe('application structure', () => {
  it('keeps page identity, status, breadcrumbs, and actions distinct', () => {
    const {container} = render(
      <PageHeader
        actions={<button type="button">Run profile</button>}
        breadcrumbs={<nav aria-label="Run location">Workspace / Runs</nav>}
        description="Evaluate the 18-minute ramp profile."
        headingLevel={2}
        identity="SIM / THERMAL / 0284"
        status={<span role="status">Converged</span>}
        statusTone="success"
        title="North chamber"
      />,
    );

    expect(screen.getByRole('heading', {level: 2, name: 'North chamber'})).toBeTruthy();
    expect(screen.getByRole('navigation', {name: 'Run location'})).toBeTruthy();
    expect(screen.getByRole('status').textContent).toBe('Converged');
    expect(screen.getByRole('button', {name: 'Run profile'})).toBeTruthy();
    expect(screen.getByRole('region', {name: 'North chamber'})).toBeTruthy();
    expect(
      container.querySelector('[data-wcl-page-header-route]')?.getAttribute('aria-hidden'),
    ).toBe('true');
    expect(container.querySelector('[data-wcl-page-header-identity]')?.textContent).toBe(
      'SIM / THERMAL / 0284',
    );
  });

  it('renders Route only between two meaningful endpoints', () => {
    const {container} = render(
      <>
        <PageHeader identity="RUN 0284" title="Identity only" />
        <PageHeader status="Converged" statusTone="success" title="Status only" />
        <PageHeader
          identity={null as unknown as string}
          status={false as unknown as string}
          statusTone="neutral"
          title="Empty endpoints"
        />
      </>,
    );

    expect(container.querySelector('[data-wcl-page-header-route]')).toBeNull();
    expect(container.querySelectorAll('[data-wcl-page-header-context]')).toHaveLength(2);
  });

  it('binds free-form status content to a separate semantic Route tone', () => {
    const {container} = render(
      <PageHeader
        identity="RUN 0284"
        status={
          <span>
            <small>Run state</small>
            <strong>Needs review</strong>
          </span>
        }
        statusTone="warning"
        title="North chamber"
      />,
    );

    expect(screen.getByText('Run state')).toBeTruthy();
    expect(screen.getByText('Needs review')).toBeTruthy();
    expect(
      container.querySelector('[data-wcl-page-header-context]')?.getAttribute('data-tone'),
    ).toBe('warning');
    expect(container.querySelector('[data-wcl-page-header-route-origin]')).toBeTruthy();
    expect(container.querySelector('[data-wcl-page-header-route-track]')).toBeTruthy();
    expect(container.querySelector('[data-wcl-page-header-route-endpoint]')).toBeTruthy();
  });

  it('resizes a split view with bounded logical keyboard steps', () => {
    const onPrimarySizeChange = vi.fn();
    render(
      <SplitView
        ariaLabel="Run comparison"
        collapsePrimaryLabel="Collapse primary pane"
        collapseSecondaryLabel="Collapse inspector"
        defaultPrimarySize={60}
        restoreSecondaryLabel="Expand inspector"
        maxPrimarySize={70}
        minPrimarySize={30}
        onPrimarySizeChange={onPrimarySizeChange}
        primary={<button type="button">Run list</button>}
        primaryLabel="Runs"
        resizeLabel="Resize run inspector"
        restorePrimaryLabel="Expand primary pane"
        secondary={<button type="button">Inspector content</button>}
        secondaryLabel="Inspector"
      />,
    );
    const separator = screen.getByRole('separator', {name: 'Resize run inspector'});

    expect(separator.getAttribute('aria-valuemin')).toBe('30');
    expect(separator.getAttribute('aria-valuemax')).toBe('70');
    expect(separator.getAttribute('aria-valuenow')).toBe('60');

    fireEvent.keyDown(separator, {key: 'ArrowRight'});
    expect(separator.getAttribute('aria-valuenow')).toBe('65');
    fireEvent.keyDown(separator, {key: 'End'});
    expect(separator.getAttribute('aria-valuenow')).toBe('70');
    fireEvent.keyDown(separator, {key: 'ArrowRight'});
    expect(separator.getAttribute('aria-valuenow')).toBe('70');
    fireEvent.keyDown(separator, {key: 'Home'});
    expect(separator.getAttribute('aria-valuenow')).toBe('30');
    expect(onPrimarySizeChange).toHaveBeenLastCalledWith(30);
  });

  it('uses writing direction for split-view arrow movement', () => {
    render(
      <div dir="rtl">
        <SplitView
          ariaLabel="RTL comparison"
          collapsePrimaryLabel="Collapse primary pane"
          collapseSecondaryLabel="Collapse details"
          defaultPrimarySize={50}
          restoreSecondaryLabel="Expand details"
          primary="Primary"
          primaryLabel="Primary pane"
          resizeLabel="Resize details"
          restorePrimaryLabel="Expand primary pane"
          secondary="Secondary"
          secondaryLabel="Secondary pane"
        />
      </div>,
    );
    const separator = screen.getByRole('separator', {name: 'Resize details'});

    fireEvent.keyDown(separator, {key: 'ArrowLeft'});
    expect(separator.getAttribute('aria-valuenow')).toBe('55');
    fireEvent.keyDown(separator, {key: 'ArrowRight'});
    expect(separator.getAttribute('aria-valuenow')).toBe('50');
  });

  it('resizes a split view from pointer position within the same bounds', () => {
    const onPrimarySizeChange = vi.fn();
    const {container} = render(
      <SplitView
        ariaLabel="Pointer comparison"
        collapsePrimaryLabel="Collapse primary pane"
        collapseSecondaryLabel="Collapse details"
        defaultPrimarySize={50}
        restoreSecondaryLabel="Expand details"
        maxPrimarySize={70}
        minPrimarySize={30}
        onPrimarySizeChange={onPrimarySizeChange}
        primary="Primary"
        primaryLabel="Primary pane"
        resizeLabel="Resize details"
        restorePrimaryLabel="Expand primary pane"
        secondary="Secondary"
        secondaryLabel="Secondary pane"
      />,
    );
    const root = container.querySelector<HTMLElement>('[data-wcl-split-view]');
    const separator = screen.getByRole('separator', {name: 'Resize details'});
    let capturedPointer: number | undefined;

    expect(root).not.toBeNull();
    vi.spyOn(root!, 'getBoundingClientRect').mockReturnValue({
      bottom: 500,
      height: 400,
      left: 100,
      right: 1100,
      toJSON: () => undefined,
      top: 100,
      width: 1000,
      x: 100,
      y: 100,
    });
    Object.assign(separator, {
      hasPointerCapture: (pointerId: number) => capturedPointer === pointerId,
      releasePointerCapture: (pointerId: number) => {
        if (capturedPointer === pointerId) capturedPointer = undefined;
      },
      setPointerCapture: (pointerId: number) => {
        capturedPointer = pointerId;
      },
    });

    fireEvent.pointerDown(separator, {clientX: 620, pointerId: 9});
    fireEvent.pointerMove(separator, {clientX: 620, pointerId: 9});

    expect(separator.getAttribute('aria-valuenow')).toBe('50');
    expect(onPrimarySizeChange).not.toHaveBeenCalled();

    fireEvent.pointerMove(separator, {clientX: 820, pointerId: 9});

    expect(separator.getAttribute('aria-valuenow')).toBe('70');
    expect(onPrimarySizeChange).toHaveBeenLastCalledWith(70);
  });

  it('does not begin pointer resizing while its secondary pane is collapsed', () => {
    const onPrimarySizeChange = vi.fn();
    render(
      <SplitView
        ariaLabel="Collapsed comparison"
        collapsePrimaryLabel="Collapse primary pane"
        collapseSecondaryLabel="Collapse details"
        defaultPrimarySize={50}
        defaultCollapsedPane="secondary"
        restoreSecondaryLabel="Expand details"
        onPrimarySizeChange={onPrimarySizeChange}
        primary="Primary"
        primaryLabel="Primary pane"
        resizeLabel="Resize details"
        restorePrimaryLabel="Expand primary pane"
        secondary="Secondary"
        secondaryLabel="Secondary pane"
      />,
    );
    const separator = screen.getByRole('separator', {name: 'Resize details'});
    const setPointerCapture = vi.fn();
    Object.assign(separator, {setPointerCapture});

    fireEvent.pointerDown(separator, {clientX: 600, pointerId: 9});
    fireEvent.pointerMove(separator, {clientX: 800, pointerId: 9});
    fireEvent.keyDown(separator, {key: 'ArrowRight'});

    expect(setPointerCapture).not.toHaveBeenCalled();
    expect(separator.getAttribute('aria-valuenow')).toBe('50');
    expect(onPrimarySizeChange).not.toHaveBeenCalled();
  });

  it('identifies and collapses either pane without directional chevrons', () => {
    render(
      <SplitView
        ariaLabel="Bidirectional comparison"
        collapsePrimaryLabel="Hide run configuration"
        collapseSecondaryLabel="Hide run inspector"
        primary="Configuration"
        primaryLabel="Run configuration"
        resizeLabel="Resize run inspector"
        restorePrimaryLabel="Show run configuration"
        restoreSecondaryLabel="Show run inspector"
        secondary="Inspector"
        secondaryLabel="Run inspector"
      />,
    );

    expect(screen.getByRole('button', {name: 'Hide run configuration'})).toBeTruthy();
    expect(screen.getByRole('button', {name: 'Hide run inspector'})).toBeTruthy();
    expect(document.querySelectorAll('[data-wcl-split-view-pane-icon]')).toHaveLength(2);
    expect(document.querySelector('[data-wcl-split-view-collapse-icon]')).toBeNull();

    fireEvent.click(screen.getByRole('button', {name: 'Hide run configuration'}));
    expect(screen.queryByRole('region', {name: 'Run configuration'})).toBeNull();
    expect(screen.getByRole('region', {name: 'Run inspector'})).toBeTruthy();
    expect(screen.queryByRole('button', {name: 'Hide run inspector'})).toBeNull();
    fireEvent.click(screen.getByRole('button', {name: 'Show run configuration'}));

    fireEvent.click(screen.getByRole('button', {name: 'Hide run inspector'}));
    expect(screen.getByRole('region', {name: 'Run configuration'})).toBeTruthy();
    expect(screen.queryByRole('region', {name: 'Run inspector'})).toBeNull();
    expect(screen.queryByRole('button', {name: 'Hide run configuration'})).toBeNull();
    fireEvent.click(screen.getByRole('button', {name: 'Show run inspector'}));

    expect(screen.getByRole('region', {name: 'Run configuration'})).toBeTruthy();
    expect(screen.getByRole('region', {name: 'Run inspector'})).toBeTruthy();
  });

  it('preserves either pane state across collapse and expansion', () => {
    render(
      <SplitView
        ariaLabel="Stateful comparison"
        collapsePrimaryLabel="Collapse configuration"
        collapseSecondaryLabel="Collapse details"
        restoreSecondaryLabel="Expand details"
        primary={<input aria-label="Configuration note" defaultValue="Initial" />}
        primaryLabel="Primary pane"
        resizeLabel="Resize details"
        restorePrimaryLabel="Expand configuration"
        secondary={<input aria-label="Inspector note" defaultValue="Initial" />}
        secondaryLabel="Secondary pane"
      />,
    );
    const configuration = screen.getByRole('textbox', {name: 'Configuration note'});
    const inspector = screen.getByRole('textbox', {name: 'Inspector note'});
    fireEvent.change(configuration, {target: {value: 'Configuration preserved'}});
    fireEvent.change(inspector, {target: {value: 'Inspector preserved'}});

    fireEvent.click(screen.getByRole('button', {name: 'Collapse configuration'}));
    expect(screen.queryByRole('textbox', {name: 'Configuration note'})).toBeNull();
    fireEvent.click(screen.getByRole('button', {name: 'Expand configuration'}));

    expect(screen.getByRole<HTMLInputElement>('textbox', {name: 'Configuration note'}).value).toBe(
      'Configuration preserved',
    );

    fireEvent.click(screen.getByRole('button', {name: 'Collapse details'}));
    expect(screen.queryByRole('textbox', {name: 'Inspector note'})).toBeNull();
    fireEvent.click(screen.getByRole('button', {name: 'Expand details'}));

    expect(screen.getByRole<HTMLInputElement>('textbox', {name: 'Inspector note'}).value).toBe(
      'Inspector preserved',
    );
  });

  it('uses the rendered compact layout state and owning document for focus recovery', () => {
    let resize: (() => void) | undefined;
    const iframe = document.createElement('iframe');
    document.body.append(iframe);
    const iframeDocument = iframe.contentDocument!;
    const iframeWindow = iframe.contentWindow!;
    const iframeGlobal = iframeWindow as unknown as typeof globalThis;
    const clientWidth = vi.spyOn(iframeGlobal.HTMLElement.prototype, 'clientWidth', 'get');
    clientWidth.mockReturnValue(800);
    class ResizeObserverMock implements ResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        resize = () => callback([], this);
      }
      disconnect() {}
      observe(target: Element, options?: ResizeObserverOptions) {
        void target;
        void options;
      }
      takeRecords() {
        return [];
      }
      unobserve(target: Element) {
        void target;
      }
    }
    Object.defineProperty(iframeWindow, 'ResizeObserver', {
      configurable: true,
      value: ResizeObserverMock,
    });
    const rendered = render(
      <SplitView
        ariaLabel="Iframe comparison"
        collapsePrimaryLabel="Collapse primary pane"
        collapseSecondaryLabel="Collapse details"
        restoreSecondaryLabel="Expand details"
        primary="Primary"
        primaryLabel="Primary pane"
        resizeLabel="Resize details"
        restorePrimaryLabel="Expand primary pane"
        secondary="Secondary"
        secondaryLabel="Secondary pane"
      />,
      {container: iframeDocument.body},
    );
    const separator = iframeDocument.querySelector<HTMLElement>('[data-wcl-split-view-separator]')!;
    const collapse = iframeDocument.querySelector<HTMLButtonElement>(
      '[data-wcl-split-view-pane-control][data-pane="primary"]',
    )!;
    separator.focus();
    separator.style.display = 'none';

    act(() => resize?.());

    expect(separator.getAttribute('tabindex')).toBe('-1');
    expect(separator.getAttribute('aria-orientation')).toBe('horizontal');
    expect(iframeDocument.activeElement).toBe(collapse);
    rendered.unmount();
    clientWidth.mockRestore();
    iframe.remove();
  });

  it('restores focus to the collapse control when its secondary pane closes', async () => {
    function ControlledSplitView() {
      const [isCollapsed, setCollapsed] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setCollapsed(true)}>
            Close inspector externally
          </button>
          <SplitView
            ariaLabel="Controlled split"
            collapsePrimaryLabel="Collapse primary pane"
            collapseSecondaryLabel="Collapse inspector"
            restoreSecondaryLabel="Expand inspector"
            collapsedPane={isCollapsed ? 'secondary' : null}
            onCollapsedPaneChange={(pane) => setCollapsed(pane === 'secondary')}
            primary="Primary"
            primaryLabel="Primary pane"
            resizeLabel="Resize inspector"
            restorePrimaryLabel="Expand primary pane"
            secondary={<button type="button">Focused inspector action</button>}
            secondaryLabel="Inspector"
          />
        </>
      );
    }

    render(<ControlledSplitView />);
    const inspectorAction = screen.getByRole('button', {name: 'Focused inspector action'});
    inspectorAction.focus();
    fireEvent.click(screen.getByRole('button', {name: 'Close inspector externally'}));

    const expand = screen.getByRole('button', {name: 'Expand inspector'});
    await waitFor(() => expect(document.activeElement).toBe(expand));
    expect(screen.queryByRole('button', {name: 'Focused inspector action'})).toBeNull();
  });

  it('moves separator focus to the affected restore control when a pane closes', () => {
    const splitProps = {
      ariaLabel: 'Controlled focus split',
      collapsePrimaryLabel: 'Collapse configuration',
      collapseSecondaryLabel: 'Collapse inspector',
      onCollapsedPaneChange: () => undefined,
      primary: 'Configuration',
      primaryLabel: 'Configuration pane',
      resizeLabel: 'Resize inspector',
      restorePrimaryLabel: 'Expand configuration',
      restoreSecondaryLabel: 'Expand inspector',
      secondary: 'Inspector',
      secondaryLabel: 'Inspector pane',
    } as const;
    const {rerender} = render(<SplitView {...splitProps} collapsedPane={null} />);
    const separator = screen.getByRole('separator', {name: 'Resize inspector'});
    separator.focus();

    rerender(<SplitView {...splitProps} collapsedPane="primary" />);

    expect(document.activeElement).toBe(screen.getByRole('button', {name: 'Expand configuration'}));
    expect(separator.getAttribute('tabindex')).toBe('-1');
  });

  it('does not restore stale separator focus after focus leaves the split view', () => {
    const splitProps = {
      ariaLabel: 'Controlled focus split',
      collapsePrimaryLabel: 'Collapse configuration',
      collapseSecondaryLabel: 'Collapse inspector',
      onCollapsedPaneChange: () => undefined,
      primary: 'Configuration',
      primaryLabel: 'Configuration pane',
      resizeLabel: 'Resize inspector',
      restorePrimaryLabel: 'Expand configuration',
      restoreSecondaryLabel: 'Expand inspector',
      secondary: 'Inspector',
      secondaryLabel: 'Inspector pane',
    } as const;
    const {rerender} = render(<SplitView {...splitProps} collapsedPane={null} />);
    const separator = screen.getByRole('separator', {name: 'Resize inspector'});
    separator.focus();
    separator.blur();
    expect(document.activeElement).toBe(document.body);

    rerender(<SplitView {...splitProps} collapsedPane="primary" />);

    expect(document.activeElement).toBe(document.body);
  });

  it('rejects invalid split bounds before rendering an unusable separator', () => {
    expect(() =>
      render(
        <SplitView
          ariaLabel="Invalid split"
          collapsePrimaryLabel="Collapse primary pane"
          collapseSecondaryLabel="Collapse details"
          defaultPrimarySize={50}
          restoreSecondaryLabel="Expand details"
          maxPrimarySize={40}
          minPrimarySize={60}
          primary="Primary"
          primaryLabel="Primary pane"
          resizeLabel="Resize details"
          restorePrimaryLabel="Expand primary pane"
          secondary="Secondary"
          secondaryLabel="Secondary pane"
        />,
      ),
    ).toThrow(/minimum.*less than.*maximum/i);
  });

  it('server-renders and hydrates page and split structure deterministically', async () => {
    const view = (
      <AppearanceProvider accent="#2878ff" appearance="dark">
        <PageHeader
          identity="RUN 0284"
          status="Converged"
          statusTone="success"
          title="North chamber"
        />
        <SplitView
          ariaLabel="Run workspace"
          collapsePrimaryLabel="Collapse primary pane"
          collapseSecondaryLabel="Collapse inspector"
          restoreSecondaryLabel="Expand inspector"
          primary="Configuration"
          primaryLabel="Configuration"
          resizeLabel="Resize inspector"
          restorePrimaryLabel="Expand primary pane"
          secondary="Inspector"
          secondaryLabel="Inspector"
        />
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
    await act(async () => Promise.resolve());

    expect(recoverableErrors).toEqual([]);
    expect(container.querySelector('[data-wcl-page-header]')).toBeTruthy();
    expect(container.querySelector('[data-wcl-split-view]')).toBeTruthy();

    act(() => root.unmount());
  });
});
