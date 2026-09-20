import {act, cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {useState} from 'react';
import {AppearanceProvider, Button, ContextMenu, SearchField, Table, Tree} from '../src/index.js';

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
it('keeps search focus when external filtering removes the previously focused row', async () => {
  const view = (filtered: boolean) => (
    <>
      <input aria-label="Search" />
      {tree(filtered ? [] : items)}
    </>
  );
  const result = render(view(false));
  act(() => screen.getByRole('row', {name: 'A'}).focus());
  const search = screen.getByRole('textbox', {name: 'Search'});
  act(() => search.focus());
  result.rerender(view(true));
  await new Promise((resolve) => setTimeout(resolve, 40));
  expect(document.activeElement).toBe(search);
});
it('renders the empty state without an empty tree grid', () => {
  render(tree([]));
  expect(screen.getByText('No records')).toBeTruthy();
  expect(screen.queryByRole('treegrid')).toBeNull();
});
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

it('does not reclaim focus on a scheduled frame after focus moves to another control', async () => {
  const result = render(
    <>
      <input aria-label="Search" />
      {tree()}
    </>,
  );
  act(() => screen.getByRole('row', {name: 'B'}).focus());
  result.rerender(
    <>
      <input aria-label="Search" />
      {tree([{...items[0]!, children: [{id: 'a', label: 'A'}]}])}
    </>,
  );
  const search = screen.getByRole('textbox', {name: 'Search'});
  act(() => search.focus());
  await act(() => new Promise((resolve) => requestAnimationFrame(resolve)));
  expect(document.activeElement).toBe(search);
});
it('recovers a removed final row to its named feedback region', async () => {
  const result = render(tree());
  act(() => screen.getByRole('row', {name: 'A'}).focus());
  result.rerender(tree([]));
  await waitFor(() =>
    expect(document.activeElement).toBe(screen.getByRole('group', {name: 'Buildings'})),
  );
  expect(screen.queryByRole('treegrid')).toBeNull();
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
    try {
      cleanup();
      // iOS restores text selection after the long-press delay and a frame.
      // Let that work finish before removing the mocked platform or DOM.
      await waitFor(() => expect(document.documentElement.style.webkitUserSelect).not.toBe('none'));
    } finally {
      platform.mockRestore();
      vi.unstubAllGlobals();
    }
  }
});

it('keeps controlled search, selection, and expansion through composition and no results', async () => {
  function SearchableTree() {
    const [query, setQuery] = useState('');
    return (
      <>
        <SearchField
          label="Search buildings"
          clearLabel="Clear search"
          value={query}
          onChange={setQuery}
        />
        <Tree
          ariaLabel="Buildings"
          items={items
            .map((item) => ({
              ...item,
              children: item.children.filter((child) => child.label.includes(query)),
            }))
            .filter((item) => item.children.length > 0)}
          expandLabel="Expand"
          collapseLabel="Collapse"
          expandedIds={['campus']}
          onExpandedChange={() => {}}
          selectedId="a"
          onSelectionChange={() => {}}
          selectionMode="single"
          emptyState={empty}
        />
      </>
    );
  }
  render(<SearchableTree />);
  act(() => screen.getByRole('row', {name: 'A'}).focus());
  const search = screen.getByRole<HTMLInputElement>('searchbox', {name: 'Search buildings'});
  act(() => search.focus());
  fireEvent.compositionStart(search);
  for (const value of ['A', 'Az', 'Azx', 'A']) {
    fireEvent.change(search, {target: {value}});
    search.setSelectionRange(value.length, value.length);
    await act(() => new Promise((resolve) => requestAnimationFrame(resolve)));
    expect(document.activeElement).toBe(search);
    expect(search.value).toBe(value);
    expect(search.selectionStart).toBe(value.length);
  }
  fireEvent.compositionEnd(search, {data: 'A'});
  expect(screen.getByRole('row', {name: 'A'}).getAttribute('aria-selected')).toBe('true');
  expect(screen.getByRole('row', {name: /Campus/}).getAttribute('aria-expanded')).toBe('true');
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
