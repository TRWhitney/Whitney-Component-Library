import {act, cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {Component, type ReactNode} from 'react';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {
  AppearanceProvider,
  Button,
  ContextMenu,
  IconButton,
  Menu,
  Popover,
  Tooltip,
  ToggleButton,
  Toolbar,
} from '../src/index.js';

if (globalThis.CSS === undefined) {
  Object.defineProperty(globalThis, 'CSS', {
    configurable: true,
    value: {escape: (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, '\\$&')},
  });
}

afterEach(cleanup);

function AnchoredOverlays({children}: {readonly children: ReactNode}) {
  return (
    <AppearanceProvider accent="#2878ff" appearance="dark">
      {children}
    </AppearanceProvider>
  );
}

class AnchoredOverlayErrorBoundary extends Component<
  {readonly children: ReactNode},
  {readonly message: string | null}
> {
  override state = {message: null};

  static getDerivedStateFromError(error: Error) {
    return {message: error.message};
  }

  override render() {
    return this.state.message ? <div role="alert">{this.state.message}</div> : this.props.children;
  }
}

describe('anchored overlays', () => {
  it('does not select an item beneath the pointer when releasing the menu-opening press', async () => {
    const onAction = vi.fn();
    render(
      <AnchoredOverlays>
        <Toolbar label="Commands">
          <Menu
            trigger={
              <IconButton label="Commands">
                <span aria-hidden="true">…</span>
              </IconButton>
            }
            items={[{id: 'action', type: 'action', label: 'Run action', onAction}]}
          />
        </Toolbar>
      </AnchoredOverlays>,
    );
    const trigger = screen.getByRole('button', {name: 'Commands'});
    fireEvent.pointerDown(trigger, {
      pointerId: 1,
      pointerType: 'mouse',
      button: 0,
      clientX: 20,
      clientY: 20,
    });
    const item = await screen.findByRole('menuitem', {name: 'Run action'});
    fireEvent.pointerUp(item, {
      pointerId: 1,
      pointerType: 'mouse',
      button: 0,
      clientX: 20,
      clientY: 20,
    });
    expect(onAction).not.toHaveBeenCalled();
    fireEvent.click(item);
    expect(onAction).toHaveBeenCalledOnce();
  });

  it('retains deliberate dragging from a menu trigger onto an action', async () => {
    const onAction = vi.fn();
    render(
      <AnchoredOverlays>
        <Menu
          trigger={<Button>Commands</Button>}
          items={[{id: 'action', type: 'action', label: 'Run action', onAction}]}
        />
      </AnchoredOverlays>,
    );
    fireEvent.pointerDown(screen.getByRole('button', {name: 'Commands'}), {
      pointerId: 1,
      pointerType: 'mouse',
      button: 0,
      clientX: 20,
      clientY: 20,
    });
    const item = await screen.findByRole('menuitem', {name: 'Run action'});
    fireEvent.pointerMove(item, {pointerId: 1, pointerType: 'mouse', clientX: 60, clientY: 60});
    fireEvent.pointerUp(item, {
      pointerId: 1,
      pointerType: 'mouse',
      button: 0,
      clientX: 60,
      clientY: 60,
    });
    expect(onAction).toHaveBeenCalledOnce();
  });
  it('moves focus into an interactive popover and restores it after dismissal', async () => {
    render(
      <AnchoredOverlays>
        <Popover
          closeLabel="Close run summary"
          description="Review the active run without leaving the current task."
          placement="bottom"
          title="Run summary"
          trigger={<Button>Inspect run</Button>}
        >
          <Button>Copy run ID</Button>
        </Popover>
      </AnchoredOverlays>,
    );

    const trigger = screen.getByRole('button', {name: 'Inspect run'});
    trigger.focus();
    fireEvent.click(trigger);

    const popover = await screen.findByRole('dialog', {name: 'Run summary'});
    expect(popover.getAttribute('aria-describedby')).toBeTruthy();
    expect(within(popover).getByText('Review the active run without leaving the current task.'));
    await waitFor(() =>
      expect(document.activeElement).toBe(
        within(popover).getByRole('button', {name: 'Close run summary'}),
      ),
    );
    expect(
      popover.closest('[data-wcl-popover]')?.querySelector('[data-wcl-anchor-arrow]'),
    ).toBeTruthy();

    fireEvent.keyDown(popover, {key: 'Escape'});
    await waitFor(() => expect(screen.queryByRole('dialog', {name: 'Run summary'})).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('adds a supplemental tooltip description on hover and focus without replacing the name', async () => {
    vi.useFakeTimers();
    try {
      render(
        <AnchoredOverlays>
          <Tooltip content="Copies the immutable run identifier." placement="top">
            <Button>Copy run ID</Button>
          </Tooltip>
        </AnchoredOverlays>,
      );

      const trigger = screen.getByRole('button', {name: 'Copy run ID'});
      trigger.focus();
      fireEvent.focus(trigger);
      await act(async () => vi.runAllTimersAsync());
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.textContent).toBe('Copies the immutable run identifier.');
      expect(trigger.getAttribute('aria-describedby')).toContain(tooltip.id);
      expect(trigger.getAttribute('aria-label')).toBeNull();
      expect(tooltip.querySelector('[data-wcl-anchor-arrow]')).toBeTruthy();

      fireEvent.blur(trigger);
      await act(async () => vi.runAllTimersAsync());
      expect(screen.queryByRole('tooltip')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('owns command focus, typeahead, disabled items, grouping, and action dismissal', async () => {
    const actions = {
      duplicate: vi.fn(),
      rename: vi.fn(),
      retry: vi.fn(),
    };
    render(
      <AnchoredOverlays>
        <Menu
          items={[
            {
              description: 'Create a new run from the current inputs.',
              id: 'duplicate',
              label: 'Duplicate run',
              onAction: actions.duplicate,
              shortcut: 'Ctrl+D',
              type: 'action',
            },
            {id: 'primary-separator', type: 'separator'},
            {
              id: 'edit-actions',
              items: [
                {
                  id: 'rename',
                  label: 'Rename run',
                  onAction: actions.rename,
                  type: 'action',
                },
                {
                  id: 'retry',
                  isDisabled: true,
                  label: 'Retry completed run',
                  onAction: actions.retry,
                  type: 'action',
                },
              ],
              label: 'Edit actions',
              type: 'group',
            },
          ]}
          trigger={<Button>Open run actions</Button>}
        />
      </AnchoredOverlays>,
    );

    const trigger = screen.getByRole('button', {name: 'Open run actions'});
    trigger.focus();
    fireEvent.click(trigger);
    const menu = await screen.findByRole('menu', {name: 'Open run actions'});
    expect(within(menu).getByRole('group', {name: 'Edit actions'})).toBeTruthy();
    expect(within(menu).getByRole('separator')).toBeTruthy();
    expect(
      within(menu)
        .getByRole('menuitem', {name: /Retry completed run/})
        .getAttribute('aria-disabled'),
    ).toBe('true');

    fireEvent.keyDown(menu, {key: 'd'});
    const duplicate = within(menu).getByRole('menuitem', {name: /Duplicate run/});
    await waitFor(() => expect(duplicate.getAttribute('data-focused')).not.toBeNull());
    fireEvent.click(duplicate);

    expect(actions.duplicate).toHaveBeenCalledOnce();
    expect(actions.retry).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole('menu', {name: 'Open run actions'})).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('opens nested command menus and closes the full menu path after an action', async () => {
    const archive = vi.fn();
    render(
      <AnchoredOverlays>
        <Menu
          items={[
            {
              id: 'more',
              items: [
                {
                  id: 'archive',
                  label: 'Archive run',
                  onAction: archive,
                  type: 'action',
                },
              ],
              label: 'More actions',
              type: 'submenu',
            },
          ]}
          trigger={<Button>Open run actions</Button>}
        />
      </AnchoredOverlays>,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Open run actions'}));
    const rootMenu = await screen.findByRole('menu', {name: 'Open run actions'});
    const submenuTrigger = within(rootMenu).getByRole('menuitem', {name: 'More actions'});
    await waitFor(() => expect(submenuTrigger.getAttribute('data-focused')).not.toBeNull());
    fireEvent.keyDown(submenuTrigger, {key: 'ArrowRight'});

    const submenu = await screen.findByRole('menu', {name: 'More actions'});
    fireEvent.click(within(submenu).getByRole('menuitem', {name: 'Archive run'}));
    expect(archive).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryAllByRole('menu')).toHaveLength(0));
  });

  it('preserves a locally scoped RTL direction on the portalled menu surface', async () => {
    render(
      <AnchoredOverlays>
        <div dir="rtl">
          <Menu
            items={[
              {
                id: 'inspect',
                label: 'Inspect run',
                onAction: () => undefined,
                type: 'action',
              },
            ]}
            trigger={<Button>Open run actions</Button>}
          />
        </div>
      </AnchoredOverlays>,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Open run actions'}));
    const menu = await screen.findByRole('menu', {name: 'Open run actions'});

    expect(menu.closest('[data-wcl-menu-popover]')?.getAttribute('dir')).toBe('rtl');
  });

  it('uses the logical inward arrow key to open an RTL submenu', async () => {
    render(
      <AnchoredOverlays>
        <div dir="rtl">
          <Menu
            items={[
              {
                id: 'more',
                items: [
                  {
                    id: 'archive',
                    label: 'Archive run',
                    onAction: () => undefined,
                    type: 'action',
                  },
                ],
                label: 'More actions',
                type: 'submenu',
              },
            ]}
            trigger={<Button>Open run actions</Button>}
          />
        </div>
      </AnchoredOverlays>,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Open run actions'}));
    const rootMenu = await screen.findByRole('menu', {name: 'Open run actions'});
    const submenuTrigger = within(rootMenu).getByRole('menuitem', {name: 'More actions'});
    await waitFor(() => expect(submenuTrigger.getAttribute('data-focused')).not.toBeNull());
    fireEvent.keyDown(submenuTrigger, {key: 'ArrowLeft'});

    expect(await screen.findByRole('menu', {name: 'More actions'})).toBeTruthy();
  });

  it('opens context actions at an owned target and restores focus after selection', async () => {
    const inspect = vi.fn();
    render(
      <AnchoredOverlays>
        <ContextMenu
          items={[
            {
              id: 'inspect',
              label: 'Inspect boundary',
              onAction: inspect,
              type: 'action',
            },
          ]}
          targetLabel="Boundary condition BC-12"
        >
          <span>BC-12 · insulated</span>
        </ContextMenu>
      </AnchoredOverlays>,
    );

    const target = screen.getByRole('group', {name: 'Boundary condition BC-12'});
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(new DOMRect(60, 120, 240, 80));
    expect(document.activeElement).not.toBe(target);
    fireEvent.contextMenu(target, {clientX: 120, clientY: 180});
    const menu = await screen.findByRole('menu', {name: 'Boundary condition BC-12'});
    const surface = menu.closest<HTMLElement>('[data-context-menu]');
    expect(surface).toBeTruthy();
    expect(surface?.style.getPropertyValue('--trigger-width')).toBe('240px');
    fireEvent.click(within(menu).getByRole('menuitem', {name: 'Inspect boundary'}));

    expect(inspect).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(target));
  });

  it('keeps the context target as a named focusable region without interaction-role warnings', async () => {
    const warnings = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    try {
      render(
        <AnchoredOverlays>
          <ContextMenu
            items={[
              {
                id: 'inspect',
                label: 'Inspect boundary',
                onAction: () => undefined,
                type: 'action',
              },
            ]}
            targetLabel="Boundary condition BC-12"
          >
            <span>BC-12 · insulated</span>
          </ContextMenu>
        </AnchoredOverlays>,
      );

      const target = screen.getByRole('group', {name: 'Boundary condition BC-12'});
      expect(target.tabIndex).toBe(0);
      await act(() => Promise.resolve());
      expect(warnings).not.toHaveBeenCalledWith(
        expect.stringContaining('child must have an interactive ARIA role'),
      );
    } finally {
      warnings.mockRestore();
    }
  });

  it('server renders and hydrates every anchored overlay without changing its closed structure', async () => {
    function ServerAnchoredOverlays() {
      return (
        <AnchoredOverlays>
          <Popover
            closeLabel="Close details"
            description="Inspect the active run."
            title="Run details"
            trigger={<Button>Inspect run</Button>}
          >
            RUN 0284
          </Popover>
          <Tooltip content="Copies the immutable identifier.">
            <Button>Copy run ID</Button>
          </Tooltip>
          <Menu
            items={[
              {
                id: 'duplicate',
                label: 'Duplicate run',
                onAction: () => undefined,
                type: 'action',
              },
            ]}
            trigger={<Button>Run actions</Button>}
          />
          <ContextMenu
            items={[
              {
                id: 'inspect',
                label: 'Inspect boundary',
                onAction: () => undefined,
                type: 'action',
              },
            ]}
            targetLabel="Boundary BC-12"
          >
            BC-12
          </ContextMenu>
        </AnchoredOverlays>
      );
    }

    const html = renderToString(<ServerAnchoredOverlays />);
    expect(html).toContain('Inspect run');
    expect(html).toContain('Copy run ID');
    expect(html).toContain('Boundary BC-12');
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.append(container);
    const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const root = hydrateRoot(container, <ServerAnchoredOverlays />);

    await act(() => Promise.resolve());
    expect(errors).not.toHaveBeenCalled();
    act(() => root.unmount());
    container.remove();
  });

  it('rejects IconButton as a public Tooltip trigger because IconButton already owns its label tooltip', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    render(
      <AnchoredOverlayErrorBoundary>
        <Tooltip content="A second tooltip would compete with the icon label.">
          <IconButton label="Copy run ID">
            <span aria-hidden="true">+</span>
          </IconButton>
        </Tooltip>
      </AnchoredOverlayErrorBoundary>,
    );

    expect(await screen.findByRole('alert')).toHaveProperty(
      'textContent',
      'Tooltip trigger must render exactly one Button.',
    );
    expect(errors).toHaveBeenCalled();
  });

  it('rejects extra interactive controls inside an anchored overlay trigger', async () => {
    render(
      <AnchoredOverlayErrorBoundary>
        <Tooltip content="Inspect the current run.">
          <>
            <Button>Inspect run</Button>
            <ToggleButton>Pin run</ToggleButton>
          </>
        </Tooltip>
      </AnchoredOverlayErrorBoundary>,
      {onCaughtError: () => undefined},
    );

    expect(await screen.findByRole('alert')).toHaveProperty(
      'textContent',
      'Tooltip trigger must render exactly one Button.',
    );
  });
});
