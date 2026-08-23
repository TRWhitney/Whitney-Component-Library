import {
  Button,
  ContextMenu,
  Menu,
  Popover,
  Tooltip,
  type MenuItems,
  type OverlayControls,
} from '../src/index.js';

const closeAction = ({close}: OverlayControls) => <Button onPress={close}>Done</Button>;
const items = [
  {id: 'duplicate', label: 'Duplicate run', onAction: () => undefined, type: 'action'},
  {id: 'separator', type: 'separator'},
  {
    id: 'more',
    items: [
      {
        id: 'delete',
        label: 'Delete run',
        onAction: () => undefined,
        tone: 'danger',
        type: 'action',
      },
    ],
    label: 'More actions',
    type: 'submenu',
  },
] as const satisfies MenuItems;

export const anchoredOverlays = (
  <>
    <Popover
      actions={closeAction}
      alignment="end"
      closeLabel="Close run summary"
      description="Review the active run."
      placement="bottom"
      title="Run summary"
      trigger={<Button>Inspect run</Button>}
    >
      <p>RUN 0284</p>
    </Popover>
    <Tooltip content="Copies the immutable identifier." placement="start">
      <Button>Copy run ID</Button>
    </Tooltip>
    <Menu items={items} trigger={<Button>Run actions</Button>} />
    <ContextMenu items={items} targetLabel="RUN 0284">
      <span>RUN 0284</span>
    </ContextMenu>
  </>
);

export const controlledPopover = (
  <Popover
    closeLabel="Close"
    description="Controlled content."
    isOpen={false}
    onOpenChange={() => undefined}
    title="Controlled"
    trigger={<Button>Open</Button>}
  >
    Content
  </Popover>
);

export const uncontrolledMenu = (
  <Menu
    defaultOpen
    items={items}
    onOpenChange={() => undefined}
    trigger={<Button>Actions</Button>}
  />
);

export const missingControlledCallback = (
  // @ts-expect-error Controlled overlays require onOpenChange.
  <Menu isOpen items={items} trigger={<Button>Actions</Button>} />
);

export const interactiveTooltipContent = (
  <Tooltip
    // @ts-expect-error Tooltip content is a non-interactive string.
    content={<Button>Nested action</Button>}
  >
    <Button>Details</Button>
  </Tooltip>
);

export const privateMenuComposition = (
  // @ts-expect-error Menu owns its item composition.
  <Menu items={items} trigger={<Button>Actions</Button>}>
    <div role="menuitem">Consumer item</div>
  </Menu>
);

export const invalidPopoverPlacement = (
  <Popover
    closeLabel="Close"
    description="Invalid physical placement."
    // @ts-expect-error Anchored placement uses logical library choices.
    placement="left"
    title="Placement"
    trigger={<Button>Open</Button>}
  >
    Content
  </Popover>
);

export const unlabeledContextTarget = (
  // @ts-expect-error ContextMenu requires an accessible target label.
  <ContextMenu items={items}>
    <span>RUN 0284</span>
  </ContextMenu>
);
