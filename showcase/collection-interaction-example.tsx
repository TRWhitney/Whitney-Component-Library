import {useState} from 'react';

import {Button, SearchField, Stack, Table, Tree} from '../src/index.js';

const buildings = [
  {id: 'elm', label: 'Elm Hall'},
  {id: 'chemistry', label: 'Chemistry Lab'},
  {id: 'library', label: 'Central Library'},
] as const;
type BuildingId = (typeof buildings)[number]['id'];
type TreeId = BuildingId | 'central';

const emptyState = {
  kind: 'no-results' as const,
  title: 'No matching buildings',
  description: 'Change or clear the search to show buildings.',
};

export function SearchableTreeExample() {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<readonly TreeId[]>(['central']);
  const [selected, setSelected] = useState<TreeId | null>('elm');
  const [message, setMessage] = useState('Choose a building to inspect.');
  const matches = buildings.filter((building) =>
    building.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <Stack gap="tight">
      <p>
        Search announces matching buildings and keeps focus through empty results. Right-click a
        campus for expansion commands or a building for inspection. Shift+F10 opens the same row
        commands. Visible actions stay independent.
      </p>
      <SearchField
        clearLabel="Clear building search"
        label="Find a building"
        onChange={setQuery}
        value={query}
      />
      <p role="status" aria-label="Building search results" aria-atomic="true">
        {matches.length === 0
          ? 'No matching buildings.'
          : `${matches.length} ${matches.length === 1 ? 'building' : 'buildings'} found.`}
      </p>
      <Tree
        ariaLabel="Campus buildings"
        contextMenu={{
          getLabel: (id) =>
            `${id === 'central' ? 'Central campus' : buildings.find((building) => building.id === id)?.label} actions`,
          getItems: (id) =>
            id === 'central'
              ? [
                  {
                    id: 'expand',
                    type: 'action',
                    label: 'Expand campus',
                    onAction: () => setExpanded(['central']),
                  },
                  {
                    id: 'collapse',
                    type: 'action',
                    label: 'Collapse campus',
                    onAction: () => setExpanded([]),
                  },
                ]
              : [
                  {
                    id: 'inspect',
                    type: 'action',
                    label: 'Inspect building',
                    onAction: () =>
                      setMessage(
                        `Inspecting ${buildings.find((building) => building.id === id)?.label}.`,
                      ),
                  },
                ],
        }}
        collapseLabel="Collapse campus"
        emptyState={emptyState}
        expandedIds={query.trim() ? ['central'] : expanded}
        expandLabel="Expand campus"
        items={
          matches.length
            ? [
                {
                  id: 'central',
                  label: 'Central campus',
                  children: matches.map((building) => ({
                    ...building,
                    actions: (
                      <Button onPress={() => setMessage(`Inspecting ${building.label}.`)}>
                        Inspect {building.label}
                      </Button>
                    ),
                  })),
                },
              ]
            : []
        }
        onExpandedChange={setExpanded}
        onSelectionChange={setSelected}
        selectedId={selected}
        selectionMode="single"
      />
      <p role="status">{message}</p>
    </Stack>
  );
}

export function CollectionContextMenuExample() {
  const [message, setMessage] = useState('No export requested.');
  return (
    <Stack gap="tight">
      <p>
        Right-click any part of a reading row to inspect that building. The menu also opens from a
        focused cell or button with Shift+F10. Opening it preserves row selection.
      </p>
      <Table
        ariaLabel="Building readings"
        contextMenu={{
          getLabel: (id) => `${buildings.find((building) => building.id === id)?.label} actions`,
          getItems: (id) => [
            {
              id: 'inspect',
              type: 'action',
              label: 'Inspect building',
              onAction: () =>
                setMessage(
                  `Inspecting ${buildings.find((building) => building.id === id)?.label}.`,
                ),
            },
          ],
        }}
        columns={[
          {id: 'building', isRowHeader: true, label: 'Building'},
          {id: 'actions', kind: 'actions', label: 'Actions'},
        ]}
        defaultSelectedId="elm"
        emptyState={emptyState}
        onSortChange={() => {}}
        rows={buildings.map((building) => ({
          id: building.id,
          textValue: building.label,
          cells: {
            building: building.label,
            actions: (
              <Button onPress={() => setMessage(`Inspecting ${building.label}.`)}>
                Inspect {building.label}
              </Button>
            ),
          },
        }))}
        selectionMode="single"
      />
      <Button onPress={() => setMessage('Readings exported.')}>Export readings</Button>
      <p role="status">{message}</p>
    </Stack>
  );
}
