import {cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {
  AppearanceProvider,
  Button,
  CardCollection,
  DescriptionList,
  List,
  ListBox,
} from '../src/index.js';

if (globalThis.CSS === undefined) {
  Object.defineProperty(globalThis, 'CSS', {
    configurable: true,
    value: {escape: (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, '\\$&')},
  });
}

afterEach(cleanup);

const emptyState = {
  description: 'Create a run to populate this collection.',
  kind: 'no-data' as const,
  title: 'No runs yet',
};

describe('basic data and collection family', () => {
  it('keeps lists and description lists semantically distinct', () => {
    const {container} = render(
      <AppearanceProvider accent="#2878ff" appearance="light">
        <List
          ariaLabel="Run sequence"
          emptyState={emptyState}
          items={[
            {id: 'prepare', primary: 'Prepare mesh', secondary: 'Complete'},
            {id: 'solve', primary: 'Solve model', secondary: 'Running'},
          ]}
          marker="number"
        />
        <DescriptionList
          ariaLabel="Run details"
          emptyState={emptyState}
          items={[
            {description: 'RUN 0284', id: 'id', term: 'Run'},
            {description: 'Balanced', id: 'profile', term: 'Profile'},
          ]}
        />
      </AppearanceProvider>,
    );

    const list = screen.getByRole('list', {name: 'Run sequence'});
    expect(list.tagName).toBe('OL');
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    const descriptions = container.querySelector('dl[aria-label="Run details"]');
    expect(descriptions?.querySelectorAll('dt')).toHaveLength(2);
    expect(descriptions?.querySelectorAll('dd')).toHaveLength(2);
  });

  it('updates keyed list boxes while preserving focused items and separate selection', () => {
    const onSelectionChange = vi.fn();
    const initialItems = [
      {id: 'alpha', label: 'Alpha run'},
      {id: 'beta', label: 'Beta run'},
      {id: 'gamma', isDisabled: true, label: 'Gamma run'},
    ] as const;
    const {rerender} = render(
      <ListBox
        ariaLabel="Runs"
        defaultSelectedId="alpha"
        emptyState={emptyState}
        items={initialItems}
        onSelectionChange={onSelectionChange}
        selectionMode="single"
      />,
    );

    const listbox = screen.getByRole('listbox', {name: 'Runs'});
    const alpha = within(listbox).getByRole('option', {name: 'Alpha run'});
    const beta = within(listbox).getByRole('option', {name: 'Beta run'});
    expect(alpha.getAttribute('aria-selected')).toBe('true');
    expect(
      within(listbox).getByRole('option', {name: 'Gamma run'}).getAttribute('aria-disabled'),
    ).toBe('true');

    alpha.focus();
    fireEvent.keyDown(alpha, {key: 'ArrowDown'});
    expect(document.activeElement).toBe(beta);
    fireEvent.keyDown(beta, {key: 'ArrowUp'});
    expect(document.activeElement).toBe(alpha);
    fireEvent.keyDown(alpha, {key: 'b'});
    expect(document.activeElement).toBe(beta);
    expect(beta.getAttribute('aria-selected')).toBe('false');
    fireEvent.keyDown(beta, {key: 'Enter'});
    expect(onSelectionChange).toHaveBeenLastCalledWith('beta');

    rerender(
      <ListBox
        ariaLabel="Runs"
        defaultSelectedId="beta"
        emptyState={emptyState}
        items={[initialItems[1], initialItems[0], initialItems[2]]}
        onSelectionChange={onSelectionChange}
        selectionMode="single"
      />,
    );
    expect(document.activeElement).toBe(screen.getByRole('option', {name: 'Beta run'}));

    rerender(
      <ListBox
        ariaLabel="Runs"
        defaultSelectedId="alpha"
        emptyState={emptyState}
        items={[
          {id: 'delta', label: 'Delta run'},
          initialItems[1],
          initialItems[0],
          initialItems[2],
        ]}
        onSelectionChange={onSelectionChange}
        selectionMode="single"
      />,
    );
    expect(document.activeElement).toBe(screen.getByRole('option', {name: 'Beta run'}));

    rerender(
      <ListBox
        ariaLabel="Runs"
        defaultSelectedId="beta"
        emptyState={emptyState}
        items={[initialItems[1], initialItems[2]]}
        onSelectionChange={onSelectionChange}
        selectionMode="single"
      />,
    );
    expect(document.activeElement).toBe(screen.getByRole('option', {name: 'Beta run'}));
  });

  it('supports explicit multiple and none selection modes', () => {
    const onSelectionChange = vi.fn();
    const items = [
      {id: 'alpha', label: 'Alpha run'},
      {id: 'beta', label: 'Beta run'},
    ] as const;
    const {rerender} = render(
      <ListBox
        ariaLabel="Compared runs"
        defaultSelectedIds={['alpha']}
        emptyState={emptyState}
        items={items}
        onSelectionChange={onSelectionChange}
        selectionMode="multiple"
      />,
    );

    fireEvent.click(screen.getByRole('option', {name: 'Beta run'}));
    expect(onSelectionChange).toHaveBeenLastCalledWith(['alpha', 'beta']);

    rerender(
      <ListBox
        ariaLabel="Browse runs"
        emptyState={emptyState}
        items={items}
        selectionMode="none"
      />,
    );
    expect(screen.getByRole('option', {name: 'Alpha run'}).hasAttribute('aria-selected')).toBe(
      false,
    );
  });

  it('keeps collection content mounted while reporting loading, partial, and error states', () => {
    const items = [{id: 'alpha', primary: 'Alpha run'}] as const;
    const {rerender} = render(
      <List
        ariaLabel="Runs"
        emptyState={emptyState}
        items={items}
        status="loading"
        statusMessage="Loading newer runs"
      />,
    );

    expect(screen.getByText('Alpha run')).toBeTruthy();
    expect(screen.getByRole('status').textContent).toContain('Loading newer runs');

    rerender(
      <List
        ariaLabel="Runs"
        emptyState={emptyState}
        items={items}
        status="partial"
        statusMessage="Showing cached runs"
      />,
    );
    expect(screen.getByText('Alpha run')).toBeTruthy();
    expect(screen.getByRole('status').textContent).toContain('Showing cached runs');

    rerender(
      <List
        ariaLabel="Runs"
        emptyState={emptyState}
        items={items}
        status="error"
        statusMessage="Newer runs could not be loaded"
      />,
    );
    expect(screen.getByText('Alpha run')).toBeTruthy();
    expect(screen.getByRole('alert').textContent).toContain('Newer runs could not be loaded');
  });

  it('uses empty-state meaning without replacing the labeled collection context', () => {
    const {container} = render(
      <List
        ariaLabel="Search results"
        emptyState={{
          description: 'Try a broader term.',
          kind: 'no-results',
          title: 'No matching runs',
        }}
        items={[]}
        marker="none"
      />,
    );

    expect(container.querySelector('[data-wcl-list] > ul')?.getAttribute('aria-label')).toBe(
      'Search results',
    );
    expect(screen.getByText('No matching runs')).toBeTruthy();
  });

  it('keeps cards static unless an explicit selection mode or nested action is supplied', () => {
    const onInspect = vi.fn();
    const {rerender} = render(
      <CardCollection
        ariaLabel="Recent runs"
        emptyState={emptyState}
        headingLevel={3}
        items={[
          {
            actions: <Button onPress={onInspect}>Inspect run</Button>,
            description: 'Completed two minutes ago',
            id: 'alpha',
            title: 'Alpha run',
          },
        ]}
        selectionMode="none"
      />,
    );

    const card = screen.getByRole('article', {name: 'Alpha run'});
    expect(card.getAttribute('tabindex')).toBeNull();
    expect(within(card).getByRole('button', {name: 'Inspect run'})).toBeTruthy();
    fireEvent.click(within(card).getByRole('button', {name: 'Inspect run'}));
    expect(onInspect).toHaveBeenCalledOnce();

    rerender(
      <CardCollection
        ariaLabel="Recent runs"
        defaultSelectedId="alpha"
        emptyState={emptyState}
        headingLevel={3}
        items={[{description: 'Complete', id: 'alpha', title: 'Alpha run'}]}
        selectionMode="single"
      />,
    );
    expect(screen.getByRole('grid', {name: 'Recent runs'})).toBeTruthy();
    expect(screen.getByRole('row', {name: /Alpha run/}).getAttribute('aria-selected')).toBe('true');
  });

  it('moves selectable-card focus through the visible grid', () => {
    render(
      <CardCollection
        ariaLabel="Run cards"
        emptyState={emptyState}
        headingLevel={3}
        items={[
          {id: 'alpha', title: 'Alpha run'},
          {id: 'beta', title: 'Beta run'},
          {id: 'gamma', title: 'Gamma run'},
          {id: 'delta', title: 'Delta run'},
        ]}
        selectionMode="single"
      />,
    );

    const alpha = screen.getByRole('row', {name: /Alpha run/});
    const beta = screen.getByRole('row', {name: /Beta run/});
    alpha.focus();
    fireEvent.keyDown(alpha, {key: 'ArrowRight'});

    expect(document.activeElement).toBe(beta);
  });

  it('rejects empty and duplicated item ids at the public component boundary', () => {
    expect(() =>
      render(
        <List
          ariaLabel="Runs"
          emptyState={emptyState}
          items={[{id: '', primary: 'Unnamed run'}]}
        />,
      ),
    ).toThrow(/ids must not be empty/i);
    expect(() =>
      render(
        <DescriptionList
          ariaLabel="Details"
          emptyState={emptyState}
          items={[
            {description: 'RUN 0284', id: 'run', term: 'Run'},
            {description: 'Balanced', id: 'run', term: 'Profile'},
          ]}
        />,
      ),
    ).toThrow(/id "run" is duplicated/i);
  });

  it('renders deterministic server output and hydrates all collection concepts', async () => {
    const tree = (
      <AppearanceProvider accent="#2878ff" appearance="dark">
        <List
          ariaLabel="Steps"
          emptyState={emptyState}
          items={[{id: 'prepare', primary: 'Prepare'}]}
        />
        <DescriptionList
          ariaLabel="Details"
          emptyState={emptyState}
          items={[{description: 'RUN 0284', id: 'run', term: 'Run'}]}
        />
        <ListBox
          ariaLabel="Runs"
          emptyState={emptyState}
          items={[{id: 'alpha', label: 'Alpha run'}]}
          selectionMode="none"
        />
        <CardCollection
          ariaLabel="Cards"
          emptyState={emptyState}
          headingLevel={3}
          items={[{id: 'alpha', title: 'Alpha run'}]}
          selectionMode="none"
        />
      </AppearanceProvider>
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(tree);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    hydrateRoot(container, tree);
    await Promise.resolve();

    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
