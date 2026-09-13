import {act, cleanup, fireEvent, render, within} from '@testing-library/react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {Component, useState, type ReactNode} from 'react';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {
  AppearanceProvider,
  Button,
  ButtonGroup,
  IconButton,
  Link,
  ToggleButton,
  Toolbar,
} from '../src/index.js';

afterEach(cleanup);

class CompositeErrorBoundary extends Component<
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

describe('action family', () => {
  it('names an icon toggle and shows its label on keyboard focus while retaining selection', async () => {
    vi.useFakeTimers();
    try {
      const {getByRole, container} = render(
        <AppearanceProvider appearance="dark" accent="#2474ff">
          <ToggleButton label="Bold" defaultSelected>
            <svg aria-hidden="true" viewBox="0 0 20 20">
              <path d="M5 3v14" />
            </svg>
          </ToggleButton>
        </AppearanceProvider>,
      );
      const button = getByRole('button', {name: 'Bold'});
      expect(button.getAttribute('aria-pressed')).toBe('true');
      act(() => button.focus());
      fireEvent.focus(button);
      await act(async () => vi.runAllTimersAsync());
      expect(container.querySelector('[role="tooltip"]')?.textContent).toBe('Bold');
      fireEvent.click(button);
      expect(button.getAttribute('aria-pressed')).toBe('false');
    } finally {
      vi.useRealTimers();
    }
  });
  it('keeps commands and navigation as distinct native elements', () => {
    const onPress = vi.fn();
    const {getByRole} = render(
      <>
        <Button onPress={onPress}>Review conditions</Button>
        <Link href="/runs/0284">Open run</Link>
      </>,
    );
    const button = getByRole('button', {name: 'Review conditions'});
    const link = getByRole('link', {name: 'Open run'});

    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('type')).toBe('button');
    expect(button.hasAttribute('href')).toBe(false);
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/runs/0284');

    fireEvent.click(button);
    expect(onPress).toHaveBeenCalledOnce();
  });

  it('keeps submit and reset behavior explicit and native', () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    const onReset = vi.fn();
    const {getByRole} = render(
      <form onSubmit={onSubmit} onReset={onReset}>
        <Button type="submit">Save profile</Button>
        <Button type="reset" variant="quiet">
          Reset
        </Button>
      </form>,
    );

    fireEvent.click(getByRole('button', {name: 'Save profile'}));
    fireEvent.click(getByRole('button', {name: 'Reset'}));

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onReset).toHaveBeenCalledOnce();
  });

  it('requires an accessible name for icon-only commands', () => {
    const {getByRole} = render(
      <IconButton label="Close panel">
        <span aria-hidden="true">×</span>
      </IconButton>,
    );
    const button = getByRole('button', {name: 'Close panel'});

    expect(button.getAttribute('aria-label')).toBe('Close panel');
    expect(button.hasAttribute('data-wcl-icon-button')).toBe(true);
  });

  it('keeps icon guidance inside the active appearance scope', async () => {
    vi.useFakeTimers();
    try {
      const {container} = render(
        <AppearanceProvider appearance="dark" accent="#2474ff">
          <IconButton label="More actions">
            <span aria-hidden="true">•••</span>
          </IconButton>
        </AppearanceProvider>,
      );
      const button = container.querySelector('button');

      expect(button).not.toBeNull();
      button?.focus();
      if (button) fireEvent.focus(button);
      await act(async () => vi.runAllTimersAsync());

      expect(container.querySelector('[role="tooltip"]')?.textContent).toBe('More actions');
    } finally {
      vi.useRealTimers();
    }
  });

  it('distinguishes toggle selection from ordinary activation', () => {
    const onChange = vi.fn();
    const {getByRole, rerender} = render(
      <ToggleButton defaultSelected onChange={onChange}>
        Pin inspector
      </ToggleButton>,
    );
    const toggle = getByRole('button', {name: 'Pin inspector'});

    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(toggle);
    expect(onChange).toHaveBeenLastCalledWith(false);
    expect(toggle.getAttribute('aria-pressed')).toBe('false');

    rerender(
      <ToggleButton isSelected onChange={onChange}>
        Pin inspector
      </ToggleButton>,
    );
    fireEvent.click(getByRole('button', {name: 'Pin inspector'}));
    expect(onChange).toHaveBeenLastCalledWith(false);
    expect(getByRole('button', {name: 'Pin inspector'}).getAttribute('aria-pressed')).toBe('true');
  });

  it('groups adjacent commands without replacing their normal tab stops', () => {
    const {getByRole} = render(
      <ButtonGroup label="Review actions" equalItems>
        <Button>Review</Button>
        <Button>Run profile</Button>
      </ButtonGroup>,
    );
    const group = getByRole('group', {name: 'Review actions'});
    const buttons = group.querySelectorAll('button');

    expect(group).toMatchObject({dataset: {equalItems: 'true', orientation: 'horizontal'}});
    expect([...buttons].map((button) => button.tabIndex)).toEqual([0, 0]);
  });

  it('preserves consumer component boundaries that render valid direct actions', () => {
    function HistoryActions() {
      return (
        <>
          <Button>Undo</Button>
          <Button>Redo</Button>
        </>
      );
    }

    function ReviewActions() {
      return (
        <>
          <Button>Review</Button>
          <IconButton label="More review actions">
            <span aria-hidden="true">•••</span>
          </IconButton>
        </>
      );
    }

    const {getByRole} = render(
      <>
        <Toolbar label="History commands">
          <HistoryActions />
          <ToggleButton>Track changes</ToggleButton>
        </Toolbar>
        <ButtonGroup label="Review commands">
          <ReviewActions />
        </ButtonGroup>
      </>,
    );

    expect(
      getByRole('toolbar', {name: 'History commands'}).querySelectorAll('button'),
    ).toHaveLength(3);
    expect(getByRole('group', {name: 'Review commands'}).querySelectorAll('button')).toHaveLength(
      2,
    );
  });

  it('rejects rendered controls and DOM wrappers that change composite relationships', async () => {
    const navigation = render(
      <CompositeErrorBoundary>
        <Toolbar label="Unsupported navigation">
          <Link href="/runs">Runs</Link>
        </Toolbar>
      </CompositeErrorBoundary>,
      {onCaughtError: () => undefined},
    );
    expect((await navigation.findByRole('alert')).textContent).toMatch(
      /Toolbar.*render.*Button, IconButton, or ToggleButton/i,
    );
    navigation.unmount();

    const arbitraryContent = render(
      <CompositeErrorBoundary>
        <ButtonGroup label="Unsupported content">
          <span>Explanation</span>
        </ButtonGroup>
      </CompositeErrorBoundary>,
      {onCaughtError: () => undefined},
    );
    expect((await arbitraryContent.findByRole('alert')).textContent).toMatch(
      /ButtonGroup.*render.*Button or IconButton/i,
    );
    arbitraryContent.unmount();

    function WrappedActions() {
      return (
        <div>
          <Button>Undo</Button>
          <Button>Redo</Button>
        </div>
      );
    }

    const wrapper = render(
      <CompositeErrorBoundary>
        <Toolbar label="Wrapped commands">
          <WrappedActions />
        </Toolbar>
      </CompositeErrorBoundary>,
      {onCaughtError: () => undefined},
    );
    expect((await wrapper.findByRole('alert')).textContent).toMatch(/Toolbar.*DOM wrapper/i);
  });

  it('does not accept public styling markers as action identity', async () => {
    const {findByRole} = render(
      <CompositeErrorBoundary>
        <Toolbar label="Forged commands">
          <button data-wcl-button="" type="button">
            Forged command
          </button>
        </Toolbar>
      </CompositeErrorBoundary>,
      {onCaughtError: () => undefined},
    );

    expect((await findByRole('alert')).textContent).toMatch(/Toolbar.*unsupported direct child/i);
  });

  it('revalidates when a consumer bundle changes its rendered relationship', async () => {
    function DynamicActions() {
      const [wrapped, setWrapped] = useState(false);
      return wrapped ? (
        <div>
          <Button>Undo</Button>
        </div>
      ) : (
        <Button onPress={() => setWrapped(true)}>Change structure</Button>
      );
    }

    const {findByRole, getByRole} = render(
      <CompositeErrorBoundary>
        <Toolbar label="Dynamic commands">
          <DynamicActions />
        </Toolbar>
      </CompositeErrorBoundary>,
      {onCaughtError: () => undefined},
    );

    fireEvent.click(getByRole('button', {name: 'Change structure'}));

    expect((await findByRole('alert')).textContent).toMatch(/Toolbar.*DOM wrapper/i);
  });

  it('moves toolbar focus with orientation-aware arrow keys', () => {
    const {container} = render(
      <Toolbar label="Editor commands">
        <Button>Undo</Button>
        <ToggleButton>Bold</ToggleButton>
        <Button>Redo</Button>
      </Toolbar>,
    );
    const undo = within(container).getByRole('button', {name: 'Undo'});
    const bold = within(container).getByRole('button', {name: 'Bold'});

    undo.focus();
    fireEvent.keyDown(undo, {key: 'ArrowRight'});

    expect(document.activeElement).toBe(bold);
  });

  it('follows inherited writing direction for horizontal toolbar navigation', () => {
    const {container} = render(
      <div dir="rtl">
        <Toolbar label="Editor commands">
          <Button>Undo</Button>
          <ToggleButton>Bold</ToggleButton>
          <Button>Redo</Button>
        </Toolbar>
      </div>,
    );
    const undo = within(container).getByRole('button', {name: 'Undo'});
    const bold = within(container).getByRole('button', {name: 'Bold'});

    undo.focus();
    fireEvent.keyDown(undo, {key: 'ArrowLeft'});

    expect(document.activeElement).toBe(bold);
  });

  it('uses the toolbar owning document for cross-realm keyboard navigation', () => {
    const iframe = document.createElement('iframe');
    document.body.append(iframe);
    const iframeDocument = iframe.contentDocument;
    const iframeWindow = iframe.contentWindow;
    if (!iframeDocument || !iframeWindow) throw new Error('The test iframe did not initialize.');

    const container = iframeDocument.createElement('div');
    container.dir = 'rtl';
    iframeDocument.body.append(container);

    try {
      const view = render(
        <Toolbar label="Iframe commands">
          <Button>Undo</Button>
          <Button>Redo</Button>
        </Toolbar>,
        {baseElement: iframeDocument.body, container},
      );
      const undo = view.getByRole('button', {name: 'Undo'});
      const redo = view.getByRole('button', {name: 'Redo'});

      const iframeElement = (iframeWindow as unknown as typeof globalThis).Element;

      expect(undo).toBeInstanceOf(iframeElement);
      expect(undo).not.toBeInstanceOf(Element);

      undo.focus();
      fireEvent.keyDown(undo, {key: 'ArrowLeft'});

      expect(iframeDocument.activeElement).toBe(redo);
    } finally {
      iframe.remove();
    }
  });

  it('keeps pending commands stable, focusable, and inert', () => {
    const onPress = vi.fn();
    const {container} = render(
      <Button isPending pendingLabel="Running profile" onPress={onPress}>
        Run profile
      </Button>,
    );
    const button = container.querySelector('button');

    expect(button).not.toBeNull();
    if (!button) return;

    expect(button.querySelector('[data-wcl-action-label]')?.textContent).toBe('Run profile');
    const descriptionId = button.getAttribute('aria-describedby');
    expect(descriptionId).not.toBeNull();
    expect(container.querySelector(`#${descriptionId}`)?.textContent).toBe('Running profile');
    expect(container.querySelector(`#${descriptionId}`)?.getAttribute('role')).toBe('status');
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.hasAttribute('disabled')).toBe(false);

    button.focus();
    fireEvent.click(button);
    expect(document.activeElement).toBe(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('keeps a pending command and its announcement support valid inside composites', () => {
    const {getByRole} = render(
      <ButtonGroup label="Run actions" equalItems>
        <Button>Review</Button>
        <Button isPending pendingLabel="Running profile">
          Run profile
        </Button>
      </ButtonGroup>,
    );

    const group = getByRole('group', {name: 'Run actions'});
    expect(group.querySelectorAll('[data-wcl-button]')).toHaveLength(2);
    expect(group.querySelector('[data-wcl-action-support]')?.textContent).toBe('Running profile');
  });

  it('announces a pending transition from a persistent status beside the button', () => {
    const {container, rerender} = render(
      <Button isPending={false} pendingLabel="Running profile">
        Run profile
      </Button>,
    );
    const button = within(container).getByRole('button', {name: 'Run profile'});
    const status = within(container).getByRole('status');

    expect(button.contains(status)).toBe(false);
    expect(status.textContent).toBe('');

    rerender(
      <Button isPending pendingLabel="Running profile">
        Run profile
      </Button>,
    );

    expect(within(container).getByRole('status')).toBe(status);
    expect(status.textContent).toBe('Running profile');
  });

  it('server-renders and hydrates an action composition deterministically', async () => {
    const view = (
      <AppearanceProvider appearance="dark" accent="#2474ff">
        <Toolbar label="Run controls">
          <Button variant="primary">Run profile</Button>
          <ToggleButton defaultSelected>Pin status</ToggleButton>
          <IconButton label="More actions">
            <span aria-hidden="true">•••</span>
          </IconButton>
        </Toolbar>
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
    expect(container.querySelector('[data-wcl-toolbar]')?.textContent).toContain('Run profile');

    act(() => root.unmount());
  });
});
