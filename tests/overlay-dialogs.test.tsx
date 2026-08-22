import {act, cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {Component, useEffect, useState, type ReactNode} from 'react';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {
  AlertDialog,
  AppearanceProvider,
  Button,
  ButtonGroup,
  Dialog,
  Drawer,
  TextField,
  Toolbar,
} from '../src/index.js';

afterEach(cleanup);

function Overlays({children}: {readonly children: ReactNode}) {
  return (
    <AppearanceProvider accent="#2878ff" appearance="dark">
      {children}
    </AppearanceProvider>
  );
}

class OverlayErrorBoundary extends Component<
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

describe('dialog and drawer overlays', () => {
  it('contains focus and restores it after Escape dismisses an ordinary dialog', async () => {
    render(
      <Overlays>
        <Dialog
          actions={({close}) => <Button onPress={close}>Save name</Button>}
          closeLabel="Close rename dialog"
          description="Choose the label shown in run history."
          title="Rename run"
          trigger={<Button>Rename run</Button>}
        >
          <TextField label="Run name" />
        </Dialog>
        <Button>Outside action</Button>
      </Overlays>,
    );

    const trigger = screen.getByRole('button', {name: 'Rename run'});
    const outsideAction = screen.getByRole('button', {name: 'Outside action'});
    trigger.focus();
    fireEvent.click(trigger);

    const dialog = await screen.findByRole('dialog', {name: 'Rename run'});
    expect(dialog.getAttribute('aria-describedby')).toBeTruthy();
    expect(within(dialog).getByText('Choose the label shown in run history.')).toBeTruthy();
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));

    outsideAction.focus();
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));

    fireEvent.keyDown(dialog, {key: 'Escape'});
    await waitFor(() => expect(screen.queryByRole('dialog', {name: 'Rename run'})).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('supports close actions, backdrop dismissal, and controlled programmatic dismissal', async () => {
    const changes = vi.fn();

    function ControlledDialog() {
      const [isOpen, updateOpen] = useState(false);
      return (
        <>
          <Dialog
            actions={({close}) => <Button onPress={close}>Done</Button>}
            closeLabel="Close details"
            description="Review the current solver inputs."
            isOpen={isOpen}
            onOpenChange={(nextOpen) => {
              changes(nextOpen);
              updateOpen(nextOpen);
            }}
            title="Run details"
            trigger={<Button>Review details</Button>}
          >
            <p>Boundary profile 4</p>
          </Dialog>
          <Button onPress={() => updateOpen(false)}>Dismiss details programmatically</Button>
        </>
      );
    }

    render(
      <Overlays>
        <ControlledDialog />
      </Overlays>,
    );
    const trigger = screen.getByRole('button', {name: 'Review details'});
    const programmaticDismiss = screen.getByRole('button', {
      name: 'Dismiss details programmatically',
    });

    trigger.focus();
    fireEvent.click(trigger);
    await screen.findByRole('dialog', {name: 'Run details'});
    fireEvent.click(screen.getByRole('button', {name: 'Close details'}));
    await waitFor(() => expect(screen.queryByRole('dialog', {name: 'Run details'})).toBeNull());
    expect(changes).toHaveBeenLastCalledWith(false);

    trigger.focus();
    fireEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', {name: 'Run details'});
    const underlay = dialog.closest('[data-wcl-overlay]');
    if (!underlay) throw new Error('Expected the dialog underlay.');
    fireEvent.pointerDown(underlay, {pointerId: 1});
    fireEvent.pointerUp(underlay, {pointerId: 1});
    fireEvent.click(underlay);
    await waitFor(() => expect(screen.queryByRole('dialog', {name: 'Run details'})).toBeNull());

    trigger.focus();
    fireEvent.click(trigger);
    await screen.findByRole('dialog', {name: 'Run details'});
    fireEvent.click(programmaticDismiss);
    await waitFor(() => expect(screen.queryByRole('dialog', {name: 'Run details'})).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('keeps alert decisions explicit and prevents backdrop dismissal', async () => {
    const confirm = vi.fn();
    render(
      <Overlays>
        <AlertDialog
          actionKind="destructive"
          cancelLabel="Keep run"
          confirmLabel="Delete run"
          description="This removes the run and its generated result."
          onConfirm={confirm}
          title="Delete this run?"
          trigger={<Button variant="danger">Delete run</Button>}
        />
      </Overlays>,
    );

    const trigger = screen.getByRole('button', {name: 'Delete run'});
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = await screen.findByRole('alertdialog', {name: 'Delete this run?'});
    const cancel = within(dialog).getByRole('button', {name: 'Keep run'});
    const destructive = within(dialog).getByRole('button', {name: 'Delete run'});
    expect(destructive.getAttribute('data-variant')).toBe('danger');
    await waitFor(() => expect(document.activeElement).toBe(cancel));

    const underlay = dialog.closest('[data-wcl-overlay]');
    if (!underlay) throw new Error('Expected the alert underlay.');
    fireEvent.pointerDown(underlay, {pointerId: 2});
    fireEvent.pointerUp(underlay, {pointerId: 2});
    fireEvent.click(underlay);
    expect(screen.getByRole('alertdialog', {name: 'Delete this run?'})).toBeTruthy();

    fireEvent.click(destructive);
    expect(confirm).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('places drawers on logical edges and preserves dialog dismissal behavior', async () => {
    render(
      <Overlays>
        <div dir="rtl">
          <Drawer
            actions={({close}) => <Button onPress={close}>Apply filters</Button>}
            closeLabel="Close filters"
            description="Limit the visible run history."
            placement="start"
            title="Run filters"
            trigger={<Button>Filter runs</Button>}
          >
            <p>Filter controls</p>
          </Drawer>
        </div>
      </Overlays>,
    );

    const trigger = screen.getByRole('button', {name: 'Filter runs'});
    trigger.focus();
    fireEvent.click(trigger);
    const drawer = await screen.findByRole('dialog', {name: 'Run filters'});
    expect(drawer.closest('[data-wcl-overlay]')?.getAttribute('data-placement')).toBe('start');
    expect(drawer.closest('[data-wcl-overlay]')?.getAttribute('data-kind')).toBe('drawer');
    expect(drawer.closest('[data-wcl-overlay]')?.getAttribute('dir')).toBe('rtl');

    fireEvent.click(within(drawer).getByRole('button', {name: 'Apply filters'}));
    await waitFor(() => expect(screen.queryByRole('dialog', {name: 'Run filters'})).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('rejects triggers that do not render exactly one library action', async () => {
    const nativeTrigger = render(
      <Overlays>
        <OverlayErrorBoundary>
          <Dialog
            closeLabel="Close native trigger example"
            description="This trigger cannot consume the overlay behavior."
            title="Native trigger"
            trigger={<button type="button">Open native trigger</button>}
          >
            <p>Unsupported trigger</p>
          </Dialog>
        </OverlayErrorBoundary>
      </Overlays>,
      {onCaughtError: () => undefined},
    );

    expect((await nativeTrigger.findByRole('alert')).textContent).toMatch(
      /Dialog trigger.*Button or IconButton/i,
    );
    nativeTrigger.unmount();

    const ambiguousTrigger = render(
      <Overlays>
        <OverlayErrorBoundary>
          <Drawer
            closeLabel="Close ambiguous trigger example"
            description="Multiple controls cannot share trigger focus restoration."
            title="Ambiguous trigger"
            trigger={
              <>
                <Button>First trigger</Button>
                <Button>Second trigger</Button>
              </>
            }
          >
            <p>Unsupported trigger</p>
          </Drawer>
        </OverlayErrorBoundary>
      </Overlays>,
      {onCaughtError: () => undefined},
    );

    expect((await ambiguousTrigger.findByRole('alert')).textContent).toMatch(
      /Drawer trigger.*exactly one.*Button or IconButton/i,
    );
  });

  it('accepts a consumer component that renders one library action directly', async () => {
    function RunTrigger() {
      return <Button>Open composed trigger</Button>;
    }

    render(
      <Overlays>
        <Dialog
          closeLabel="Close composed trigger example"
          description="Consumer component boundaries remain supported."
          title="Composed trigger"
          trigger={<RunTrigger />}
        >
          <p>Supported trigger</p>
        </Dialog>
      </Overlays>,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Open composed trigger'}));
    expect(await screen.findByRole('dialog', {name: 'Composed trigger'})).toBeTruthy();
  });

  it('revalidates when a consumer trigger changes its own rendered actions', async () => {
    function DynamicTrigger() {
      const [isAmbiguous, setIsAmbiguous] = useState(false);
      useEffect(() => {
        const makeAmbiguous = () => setIsAmbiguous(true);
        window.addEventListener('wcl-test-ambiguous-trigger', makeAmbiguous);
        return () => window.removeEventListener('wcl-test-ambiguous-trigger', makeAmbiguous);
      }, []);
      return isAmbiguous ? (
        <>
          <Button>First dynamic trigger</Button>
          <Button>Second dynamic trigger</Button>
        </>
      ) : (
        <Button>Stable dynamic trigger</Button>
      );
    }

    render(
      <Overlays>
        <OverlayErrorBoundary>
          <Dialog
            closeLabel="Close dynamic trigger example"
            description="Rendered trigger changes retain the same invariant."
            title="Dynamic trigger"
            trigger={<DynamicTrigger />}
          >
            <p>Dynamic trigger content</p>
          </Dialog>
        </OverlayErrorBoundary>
      </Overlays>,
      {onCaughtError: () => undefined},
    );

    expect(screen.getByRole('button', {name: 'Stable dynamic trigger'})).toBeTruthy();
    await act(() => window.dispatchEvent(new Event('wcl-test-ambiguous-trigger')));
    expect((await screen.findByRole('alert')).textContent).toMatch(
      /Dialog trigger.*exactly one.*Button or IconButton/i,
    );
  });

  it('keeps overlay triggers direct and navigable inside action composites', async () => {
    render(
      <Overlays>
        <Toolbar label="Run commands">
          <Dialog
            closeLabel="Close toolbar dialog"
            description="The trigger remains a direct toolbar command."
            title="Toolbar dialog"
            trigger={<Button>Open toolbar dialog</Button>}
          >
            <p>Toolbar-triggered content</p>
          </Dialog>
          <Button>Next toolbar command</Button>
        </Toolbar>
        <ButtonGroup label="Decision commands">
          <AlertDialog
            actionKind="confirm"
            cancelLabel="Keep decision"
            confirmLabel="Confirm decision"
            description="The trigger remains a direct grouped command."
            onConfirm={() => undefined}
            title="Grouped decision"
            trigger={<Button>Open grouped decision</Button>}
          />
          <Button>Next grouped command</Button>
        </ButtonGroup>
      </Overlays>,
    );

    const toolbarTrigger = screen.getByRole('button', {name: 'Open toolbar dialog'});
    const nextToolbarCommand = screen.getByRole('button', {name: 'Next toolbar command'});
    toolbarTrigger.focus();
    fireEvent.keyDown(toolbarTrigger, {key: 'ArrowRight'});
    expect(document.activeElement).toBe(nextToolbarCommand);

    fireEvent.click(toolbarTrigger);
    expect(await screen.findByRole('dialog', {name: 'Toolbar dialog'})).toBeTruthy();
    fireEvent.keyDown(screen.getByRole('dialog', {name: 'Toolbar dialog'}), {key: 'Escape'});
    await waitFor(() => expect(screen.queryByRole('dialog', {name: 'Toolbar dialog'})).toBeNull());

    fireEvent.click(screen.getByRole('button', {name: 'Open grouped decision'}));
    expect(await screen.findByRole('alertdialog', {name: 'Grouped decision'})).toBeTruthy();
  });

  it('restores focus through nested overlays without closing the parent', async () => {
    render(
      <Overlays>
        <Dialog
          closeLabel="Close run dialog"
          description="Review one completed run."
          title="Run review"
          trigger={<Button>Review run</Button>}
        >
          <Drawer
            closeLabel="Close run history"
            description="Inspect earlier results without leaving the review."
            title="Run history"
            trigger={<Button>Open run history</Button>}
          >
            <p>Three earlier results</p>
          </Drawer>
        </Dialog>
      </Overlays>,
    );

    const outerTrigger = screen.getByRole('button', {name: 'Review run'});
    outerTrigger.focus();
    fireEvent.click(outerTrigger);
    const outer = await screen.findByRole('dialog', {name: 'Run review'});
    const innerTrigger = within(outer).getByRole('button', {name: 'Open run history'});
    innerTrigger.focus();
    fireEvent.click(innerTrigger);
    const inner = await screen.findByRole('dialog', {name: 'Run history'});

    fireEvent.keyDown(inner, {key: 'Escape'});
    await waitFor(() => expect(screen.queryByRole('dialog', {name: 'Run history'})).toBeNull());
    expect(screen.getByRole('dialog', {name: 'Run review'})).toBeTruthy();
    await waitFor(() => expect(document.activeElement).toBe(innerTrigger));

    fireEvent.keyDown(outer, {key: 'Escape'});
    await waitFor(() => expect(screen.queryByRole('dialog', {name: 'Run review'})).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(outerTrigger));
  });

  it('server-renders and hydrates without mounting an overlay portal early', () => {
    const specimen = (
      <Overlays>
        <Drawer
          closeLabel="Close run details"
          defaultOpen
          description="Inspect a run."
          title="Run details"
          trigger={<Button>Open run details</Button>}
        >
          <p>Run result</p>
        </Drawer>
      </Overlays>
    );

    const markup = renderToString(specimen);
    document.body.innerHTML = `<div id="root">${markup}</div>`;
    const rootElement = document.querySelector('#root')!;

    expect(markup).not.toContain('data-wcl-overlay');
    expect(markup).toContain('Open run details');
    expect(() => hydrateRoot(rootElement, specimen)).not.toThrow();
  });
});
