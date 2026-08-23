import {AlertDialog, Button, Dialog, Drawer, type OverlayControls} from '../src/index.js';

const actions = ({close}: OverlayControls) => <Button onPress={close}>Done</Button>;

export const overlayDialogs = (
  <>
    <Dialog
      actions={actions}
      closeLabel="Close dialog"
      description="Edit the run name."
      title="Rename run"
      trigger={<Button>Rename</Button>}
    >
      <p>Dialog content</p>
    </Dialog>
    <AlertDialog
      actionKind="destructive"
      cancelLabel="Keep run"
      confirmLabel="Delete run"
      description="This removes the run."
      onConfirm={() => undefined}
      title="Delete this run?"
      trigger={<Button>Delete</Button>}
    />
    <Drawer
      actions={actions}
      closeLabel="Close drawer"
      description="Inspect run history."
      placement="end"
      title="Run history"
      trigger={<Button>History</Button>}
    >
      <p>Drawer content</p>
    </Drawer>
  </>
);

export const controlledDialog = (
  <Dialog
    closeLabel="Close dialog"
    description="Edit the run name."
    isOpen
    onOpenChange={() => undefined}
    title="Rename run"
    trigger={<Button>Rename</Button>}
  >
    <p>Dialog content</p>
  </Dialog>
);

export const inertControlledDialog = (
  // @ts-expect-error Controlled overlay ownership requires onOpenChange.
  <Dialog
    closeLabel="Close dialog"
    description="Edit the run name."
    isOpen
    title="Rename run"
    trigger={<Button>Rename</Button>}
  >
    <p>Dialog content</p>
  </Dialog>
);

// @ts-expect-error Controlled and uncontrolled overlay ownership cannot be combined.
export const ambiguousDialogOwnership = Dialog({
  closeLabel: 'Close dialog',
  defaultOpen: true,
  description: 'Edit the run name.',
  isOpen: true,
  onOpenChange: () => undefined,
  title: 'Rename run',
  trigger: <Button>Rename</Button>,
  children: <p>Dialog content</p>,
});

export const implicitAlertConsequence = (
  // @ts-expect-error AlertDialog requires an explicit confirm or destructive action kind.
  <AlertDialog
    cancelLabel="Cancel"
    confirmLabel="Continue"
    description="This changes the current run."
    onConfirm={() => undefined}
    title="Continue?"
    trigger={<Button>Continue</Button>}
  />
);

export const invalidAlertConsequence = (
  <AlertDialog
    // @ts-expect-error AlertDialog action kind is a bounded semantic choice.
    actionKind="danger"
    cancelLabel="Cancel"
    confirmLabel="Continue"
    description="This changes the current run."
    onConfirm={() => undefined}
    title="Continue?"
    trigger={<Button>Continue</Button>}
  />
);

export const physicalDrawerPlacement = (
  <Drawer
    closeLabel="Close drawer"
    description="Inspect run history."
    // @ts-expect-error Drawer placement uses logical edges.
    placement="left"
    title="Run history"
    trigger={<Button>History</Button>}
  >
    <p>Drawer content</p>
  </Drawer>
);

export const expandedDrawerPlacements = (
  <>
    <Drawer
      closeLabel="Close top drawer"
      description="Inspect activity from above."
      dragHandleLabel="Extend activity drawer"
      placement="top"
      title="Activity"
      trigger={<Button>Open activity</Button>}
    >
      <p>Activity content</p>
    </Drawer>
    <Drawer
      closeLabel="Close bottom drawer"
      description="Inspect output from below."
      dockedPreview={<span>RUN 0284</span>}
      placement="bottom"
      title="Output"
      trigger={<Button>Open output</Button>}
    >
      <p>Output content</p>
    </Drawer>
  </>
);

export const styledDialog = (
  <Dialog
    // @ts-expect-error Dialog does not accept consumer class injection.
    className="dialog"
    closeLabel="Close dialog"
    description="Edit the run name."
    title="Rename run"
    trigger={<Button>Rename</Button>}
  >
    <p>Dialog content</p>
  </Dialog>
);
