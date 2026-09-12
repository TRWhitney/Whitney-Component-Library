import {act, cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {AppearanceProvider, Button, ContextMenu, Table, Tree} from '../src/index.js';

if (!globalThis.CSS)
  Object.defineProperty(globalThis, 'CSS', {
    value: {escape: (value: string) => value},
    configurable: true,
  });
afterEach(cleanup);
const empty = {kind: 'no-results' as const, title: 'No records', description: 'Change the query.'};
const items = [
  {
    id: 'campus',
    label: 'Campus',
    children: [
      {id: 'a', label: 'A'},
      {id: 'b', label: 'B'},
    ],
  },
];
const tree = (data = items) => (
  <Tree
    ariaLabel="Buildings"
    items={data}
    expandLabel="Expand"
    collapseLabel="Collapse"
    defaultExpandedIds={['campus']}
    selectionMode="single"
    emptyState={empty}
  />
);
it('does not press nested collection rows and buttons when a context menu is open', async () => {
  const {container} = render(
    <AppearanceProvider appearance="dark" accent="#538dff">
      <ContextMenu
        targetLabel="Building actions"
        isOpen
        onOpenChange={() => {}}
        items={[{type: 'action', id: 'inspect', label: 'Inspect', onAction: () => {}}]}
      >
        <div>
          {tree()}
          <Button>Pin</Button>
        </div>
      </ContextMenu>
    </AppearanceProvider>,
  );
  await waitFor(() => expect(screen.getByRole('menu')).toBeTruthy());
  expect(container.querySelector('[role="row"][data-pressed]')).toBeNull();
  expect(container.querySelector('button[aria-label="Expand"][data-pressed]')).toBeNull();
});

it('opens from a focused descendant with Shift+F10 without changing nested control identities', async () => {
  const inspect = vi.fn();
  const pin = vi.fn();
  const result = render(
    <AppearanceProvider appearance="dark" accent="#538dff">
      <ContextMenu
        targetLabel="Building actions"
        items={[{type: 'action', id: 'inspect', label: 'Inspect', onAction: inspect}]}
      >
        <div>
          {tree()}
          <Button onPress={pin}>Pin</Button>
          <Button>Compare</Button>
        </div>
      </ContextMenu>
    </AppearanceProvider>,
  );
  const target = screen.getByRole('group', {name: 'Building actions'});
  const button = screen.getByRole('button', {name: 'Pin'});
  const ids = [...result.container.querySelectorAll('[id]')].map((element) => element.id);
  expect(new Set(ids).size).toBe(ids.length);
  act(() => button.focus());
  fireEvent.keyDown(button, {key: 'F10', shiftKey: true});
  const menu = await screen.findByRole('menu', {name: 'Building actions'});
  expect(result.container.querySelector('[data-pressed]')).toBeNull();
  fireEvent.click(within(menu).getByRole('menuitem', {name: 'Inspect'}));
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  await waitFor(() => expect(document.activeElement).toBe(target));
  expect(inspect).toHaveBeenCalledOnce();
  expect([...result.container.querySelectorAll('[id]')].map((element) => element.id)).toEqual(ids);
  fireEvent.click(button);
  expect(pin).toHaveBeenCalledOnce();
  fireEvent.contextMenu(screen.getByRole('row', {name: 'B'}), {clientX: 30, clientY: 50});
  const reopened = await screen.findByRole('menu');
  expect(result.container.querySelector('[data-pressed]')).toBeNull();
  fireEvent.keyDown(reopened, {key: 'Escape'});
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
});

it('opens touch context actions from a nested row without pressing unrelated rows', async () => {
  const platform = vi.spyOn(navigator, 'platform', 'get').mockReturnValue('iPhone');
  class TouchPointerEvent extends MouseEvent {
    readonly pointerType: string;
    readonly pointerId: number;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerType = init.pointerType ?? 'touch';
      this.pointerId = init.pointerId ?? 1;
    }
  }
  vi.stubGlobal('PointerEvent', TouchPointerEvent);
  try {
    const {container} = render(
      <AppearanceProvider appearance="dark" accent="#538dff">
        <ContextMenu
          targetLabel="Building actions"
          items={[{type: 'action', id: 'inspect', label: 'Inspect', onAction: () => {}}]}
        >
          {tree()}
        </ContextMenu>
      </AppearanceProvider>,
    );
    const row = screen.getByRole('row', {name: 'A'});
    fireEvent.pointerDown(row, {
      pointerType: 'touch',
      pointerId: 1,
      button: 0,
      clientX: 10,
      clientY: 10,
    });
    await screen.findByRole('menu', {name: 'Building actions'});
    expect(container.querySelector('[data-pressed]')).toBeNull();
    fireEvent.pointerUp(document, {pointerType: 'touch', pointerId: 1, button: 0});
  } finally {
    cleanup();
    platform.mockRestore();
    vi.unstubAllGlobals();
  }
});

it('isolates a table and its nested action buttons when opening and dismissing context actions', async () => {
  const inspect = vi.fn();
  const {container} = render(
    <AppearanceProvider appearance="dark" accent="#538dff">
      <ContextMenu
        targetLabel="Table actions"
        items={[{id: 'refresh', type: 'action', label: 'Refresh records', onAction: () => {}}]}
      >
        <Table
          ariaLabel="Readings"
          columns={[
            {id: 'name', label: 'Building', isRowHeader: true},
            {id: 'actions', kind: 'actions', label: 'Actions'},
          ]}
          rows={[
            {
              id: 'a',
              textValue: 'A',
              cells: {name: 'A', actions: <Button onPress={inspect}>Inspect A</Button>},
            },
            {id: 'b', textValue: 'B', cells: {name: 'B', actions: <Button>Inspect B</Button>}},
          ]}
          selectionMode="single"
          defaultSelectedId="a"
          onSortChange={() => {}}
          emptyState={empty}
        />
      </ContextMenu>
    </AppearanceProvider>,
  );
  fireEvent.contextMenu(screen.getByRole('button', {name: 'Inspect B'}), {
    clientX: 20,
    clientY: 30,
  });
  const menu = await screen.findByRole('menu');
  expect(container.querySelector('[data-pressed]')).toBeNull();
  expect(container.querySelector('[role="row"][data-key="a"]')?.getAttribute('aria-selected')).toBe(
    'true',
  );
  expect(container.querySelector('[role="row"][data-key="b"]')?.getAttribute('aria-selected')).toBe(
    'false',
  );
  fireEvent.keyDown(menu, {key: 'Escape'});
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  fireEvent.click(screen.getByRole('button', {name: 'Inspect A'}));
  expect(inspect).toHaveBeenCalledOnce();
});
