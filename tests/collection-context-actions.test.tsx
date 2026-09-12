import {act, cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {useState} from 'react';
import {AppearanceProvider, Button, Tree, Table} from '../src/index.js';
if (!globalThis.CSS)
  Object.defineProperty(globalThis, 'CSS', {
    value: {escape: (value: string) => value},
    configurable: true,
  });
afterEach(cleanup);
it.each(['tree', 'table'])(
  'opens row-owned context actions from %s row whitespace and keyboard',
  async (family) => {
    const action = vi.fn<(id: string) => void>();
    const contextMenu = {
      getLabel: (id: string) => `Actions for ${id}`,
      getItems: (id: string) => [
        {
          type: 'action' as const,
          id: 'inspect',
          label: `Inspect ${id}`,
          onAction: () => action(id),
        },
      ],
    };
    const emptyState = {kind: 'no-data' as const, title: 'Empty', description: 'No rows'};
    render(
      <AppearanceProvider appearance="dark" accent="#538dff">
        {family === 'tree' ? (
          <Tree
            ariaLabel="Records"
            items={[
              {id: 'a', label: 'Alpha'},
              {id: 'b', label: 'Beta'},
            ]}
            selectionMode="single"
            expandLabel="Expand"
            collapseLabel="Collapse"
            emptyState={emptyState}
            contextMenu={contextMenu}
          />
        ) : (
          <Table
            ariaLabel="Records"
            columns={[{id: 'name', label: 'Name', isRowHeader: true}]}
            rows={[
              {id: 'a', textValue: 'Alpha', cells: {name: 'Alpha'}},
              {id: 'b', textValue: 'Beta', cells: {name: 'Beta'}},
            ]}
            selectionMode="single"
            emptyState={emptyState}
            contextMenu={contextMenu}
          />
        )}
      </AppearanceProvider>,
    );
    const row = screen.getByRole('row', {name: 'Beta'});
    fireEvent.contextMenu(row);
    fireEvent.click(await screen.findByRole('menuitem', {name: 'Inspect b'}));
    expect(action).toHaveBeenLastCalledWith('b');
    const first = screen.getByRole('row', {name: 'Alpha'});
    first.focus();
    fireEvent.keyDown(first, {key: 'F10', shiftKey: true});
    expect(await screen.findByRole('menuitem', {name: 'Inspect a'})).toBeTruthy();
  },
);

it.each(['tree', 'table'])(
  'keeps %s row context separate from selection and visible actions',
  async (family) => {
    const action = vi.fn<(id: string) => void>();
    const selection = vi.fn();
    const contextMenu = {
      getLabel: (id: string) => `Actions for ${id}`,
      getItems: (id: string) => [
        {
          id: 'inspect',
          type: 'action' as const,
          label: `Inspect ${id}`,
          onAction: () => action(id),
        },
      ],
    };
    const emptyState = {kind: 'no-data' as const, title: 'Empty', description: 'No records'};
    const {container} = render(
      <AppearanceProvider appearance="dark" accent="#538dff">
        {family === 'tree' ? (
          <Tree
            ariaLabel="Records"
            items={[
              {
                id: 'a',
                label: 'Alpha',
                actions: <Button onPress={() => action('visible')}>Open Alpha</Button>,
              },
              {id: 'b', label: 'Beta', isDisabled: true},
            ]}
            contextMenu={contextMenu}
            selectionMode="single"
            selectedId="a"
            onSelectionChange={selection}
            expandLabel="Expand"
            collapseLabel="Collapse"
            emptyState={emptyState}
          />
        ) : (
          <Table
            ariaLabel="Records"
            columns={[
              {id: 'name', label: 'Name', isRowHeader: true},
              {id: 'actions', kind: 'actions', label: 'Actions'},
            ]}
            rows={[
              {
                id: 'a',
                textValue: 'Alpha',
                cells: {
                  name: 'Alpha',
                  actions: <Button onPress={() => action('visible')}>Open Alpha</Button>,
                },
              },
              {
                id: 'b',
                textValue: 'Beta',
                isSelectionDisabled: true,
                cells: {name: 'Beta', actions: null},
              },
            ]}
            contextMenu={contextMenu}
            selectionMode="single"
            selectedId="a"
            onSelectionChange={selection}
            emptyState={emptyState}
          />
        )}
      </AppearanceProvider>,
    );
    const button = screen.getByRole('button', {name: 'Open Alpha'});
    fireEvent.click(button);
    expect(action).toHaveBeenLastCalledWith('visible');
    act(() => button.focus());
    fireEvent.keyDown(button, {key: 'ContextMenu'});
    const menu = await screen.findByRole('menu', {name: 'Actions for a'});
    expect(container.querySelector('[data-pressed]')).toBeNull();
    expect(selection).not.toHaveBeenCalled();
    fireEvent.keyDown(menu, {key: 'Escape'});
    await waitFor(() => expect(document.activeElement).toBe(button));
    fireEvent.contextMenu(screen.getByRole('row', {name: 'Beta'}));
    if (family === 'tree') expect(screen.queryByRole('menu')).toBeNull();
    else {
      const betaMenu = await screen.findByRole('menu', {name: 'Actions for b'});
      fireEvent.keyDown(betaMenu, {key: 'Escape'});
      await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
      fireEvent.contextMenu(screen.getByRole('columnheader', {name: 'Name'}));
      expect(screen.queryByRole('menu')).toBeNull();
    }
    fireEvent.contextMenu(
      screen.getByRole(family === 'tree' ? 'treegrid' : 'grid', {name: 'Records'}),
    );
    expect(screen.queryByRole('menu')).toBeNull();
  },
);

it.each(['tree', 'table'])(
  'restores %s focus after a row context action removes its target',
  async (family) => {
    function Records() {
      const [ids, setIds] = useState(['a', 'b']);
      const contextMenu = {
        getLabel: (id: string) => `Actions for ${id}`,
        getItems: (id: string) => [
          {
            id: 'remove',
            type: 'action' as const,
            label: `Remove ${id}`,
            onAction: () => setIds((current) => current.filter((key) => key !== id)),
          },
        ],
      };
      const emptyState = {kind: 'no-data' as const, title: 'Empty', description: 'No records'};
      return (
        <>
          <input aria-label="Other control" />
          {family === 'tree' ? (
            <Tree
              ariaLabel="Records"
              items={ids.map((id) => ({id, label: id}))}
              selectionMode="single"
              expandLabel="Expand"
              collapseLabel="Collapse"
              emptyState={emptyState}
              contextMenu={contextMenu}
            />
          ) : (
            <Table
              ariaLabel="Records"
              columns={[{id: 'name', label: 'Name', isRowHeader: true}]}
              rows={ids.map((id) => ({id, textValue: id, cells: {name: id}}))}
              selectionMode="single"
              emptyState={emptyState}
              contextMenu={contextMenu}
            />
          )}
        </>
      );
    }
    render(
      <AppearanceProvider appearance="dark" accent="#538dff">
        <Records />
      </AppearanceProvider>,
    );
    fireEvent.contextMenu(screen.getByRole('row', {name: 'b'}));
    fireEvent.click(await screen.findByRole('menuitem', {name: 'Remove b'}));
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('row', {name: 'a'})));
    const input = screen.getByRole('textbox', {name: 'Other control'});
    act(() => input.focus());
    await act(() => new Promise((resolve) => requestAnimationFrame(resolve)));
    expect(document.activeElement).toBe(input);
  },
);

it.each(['tree', 'table'])(
  'opens %s row actions with the supported touch long press',
  async (family) => {
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
      const contextMenu = {
        getLabel: (id: string) => `Actions for ${id}`,
        getItems: (id: string) => [
          {id: 'inspect', type: 'action' as const, label: `Inspect ${id}`, onAction: () => {}},
        ],
      };
      const emptyState = {kind: 'no-data' as const, title: 'Empty', description: 'No records'};
      const {container} = render(
        <AppearanceProvider appearance="dark" accent="#538dff">
          {family === 'tree' ? (
            <Tree
              ariaLabel="Records"
              items={[
                {id: 'a', label: 'Alpha'},
                {id: 'b', label: 'Beta'},
              ]}
              contextMenu={contextMenu}
              selectionMode="single"
              expandLabel="Expand"
              collapseLabel="Collapse"
              emptyState={emptyState}
            />
          ) : (
            <Table
              ariaLabel="Records"
              columns={[{id: 'name', label: 'Name', isRowHeader: true}]}
              rows={[
                {id: 'a', textValue: 'Alpha', cells: {name: 'Alpha'}},
                {id: 'b', textValue: 'Beta', cells: {name: 'Beta'}},
              ]}
              contextMenu={contextMenu}
              selectionMode="single"
              emptyState={emptyState}
            />
          )}
        </AppearanceProvider>,
      );
      fireEvent.pointerDown(screen.getByRole('row', {name: 'Beta'}), {
        pointerType: 'touch',
        pointerId: 1,
        button: 0,
        clientX: 20,
        clientY: 30,
      });
      await screen.findByRole('menu', {name: 'Actions for b'});
      expect(container.querySelector('[data-pressed]')).toBeNull();
      fireEvent.pointerUp(document, {pointerType: 'touch', pointerId: 1, button: 0});
    } finally {
      cleanup();
      platform.mockRestore();
      vi.unstubAllGlobals();
    }
  },
);

it.each(['tree', 'table'])(
  'keeps %s menu identity through reorder and closes it when filtering removes the target',
  async (family) => {
    const contextMenu = {
      getLabel: (id: string) => `Actions for ${id}`,
      getItems: (id: string) => [
        {id: 'inspect', type: 'action' as const, label: `Inspect ${id}`, onAction: () => {}},
      ],
    };
    const emptyState = {kind: 'no-data' as const, title: 'Empty', description: 'No records'};
    const view = (ids: string[]) => (
      <AppearanceProvider appearance="dark" accent="#538dff">
        {family === 'tree' ? (
          <Tree
            ariaLabel="Records"
            items={ids.map((id) => ({id, label: id}))}
            contextMenu={contextMenu}
            selectionMode="single"
            expandLabel="Expand"
            collapseLabel="Collapse"
            emptyState={emptyState}
          />
        ) : (
          <Table
            ariaLabel="Records"
            columns={[{id: 'name', label: 'Name', isRowHeader: true}]}
            rows={ids.map((id) => ({id, textValue: id, cells: {name: id}}))}
            contextMenu={contextMenu}
            selectionMode="single"
            emptyState={emptyState}
          />
        )}
      </AppearanceProvider>
    );
    const {rerender} = render(view(['a', 'b']));
    fireEvent.contextMenu(screen.getByRole('row', {name: 'b'}));
    await screen.findByRole('menu', {name: 'Actions for b'});
    rerender(view(['b', 'a']));
    expect(screen.getByRole('menuitem', {name: 'Inspect b'})).toBeTruthy();
    rerender(view(['a']));
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('row', {name: 'a'})));
  },
);
