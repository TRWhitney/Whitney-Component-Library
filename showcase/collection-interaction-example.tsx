import {useState} from 'react';

import {Button, SearchField, Stack, Tree} from '../src/index.js';

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
        Search keeps focus through empty results. Expansion and selection stay controlled, and
        visible actions inspect each building.
      </p>
      <SearchField
        clearLabel="Clear building search"
        label="Find a building"
        onChange={setQuery}
        value={query}
      />
      <Tree
        ariaLabel="Campus buildings"
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
