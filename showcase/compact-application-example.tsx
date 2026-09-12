import {useState} from 'react';
import {
  AppearanceProvider,
  Button,
  ComboBox,
  FieldGroup,
  Popover,
  SearchField,
  Select,
  Stack,
  Switch,
  TextField,
  InlineGroup,
  Tree,
} from '../src/index.js';

const campuses = [
  {value: 'central', label: 'Central'},
  {value: 'north', label: 'North'},
  {value: 'south', label: 'South'},
];
const uses = [
  {value: 'office', label: 'Office'},
  {value: 'laboratory', label: 'Laboratory', description: 'Includes teaching and research labs.'},
  {value: 'library', label: 'Library'},
];

export function CompactApplicationExample() {
  const [compact, setCompact] = useState(true);
  const [reserve, setReserve] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [query, setQuery] = useState('');
  const buildings = [
    {id: 'elm', label: 'Elm Hall', description: 'Office · 188 kWh/m²'},
    {id: 'chemistry', label: 'Chemistry Lab', description: 'Laboratory · 279 kWh/m²'},
  ].filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <Stack gap="regular">
      <Switch label="Compact application density" isSelected={compact} onChange={setCompact} />
      <Switch label="Reserve field support space" isSelected={reserve} onChange={setReserve} />
      <Switch label="Show a validation error" isSelected={invalid} onChange={setInvalid} />
      <p>
        Density applies to the fields, portaled menu options, and tree below. Empty support rows
        disappear by default. Reserve space to keep a form steady as validation messages change.
        Touch input retains larger targets in both densities. The filter form keeps a relaxed gap
        between controls without reserving empty support rows.
      </p>
      <AppearanceProvider
        appearance="dark"
        accent="#538dff"
        density={compact ? 'compact' : 'comfortable'}
      >
        <Stack gap="regular">
          <Popover
            title="Building filters"
            description="Compare field and menu spacing."
            closeLabel="Close filters"
            trigger={<Button>Building filters</Button>}
          >
            <Stack gap="relaxed">
              <Select
                label="Campus"
                options={campuses}
                emptyMessage="No campuses"
                reserveSupportSpace={reserve}
              />
              <ComboBox
                label="Building use"
                options={uses}
                emptyMessage="No matching uses"
                reserveSupportSpace={reserve}
              />
            </Stack>
          </Popover>
          <FieldGroup legend="Investigation details">
            <TextField
              label="Owner"
              description="Use a team name."
              reserveSupportSpace={reserve}
              isInvalid={invalid}
              errorMessage="Choose a team before saving."
            />
            <TextField label="Reference" reserveSupportSpace={reserve} />
          </FieldGroup>
          <SearchField
            label="Find a building"
            clearLabel="Clear building search"
            value={query}
            onChange={setQuery}
            reserveSupportSpace={reserve}
          />
          <InlineGroup gap="regular">
            <Button>Enabled action</Button>
            <Button isDisabled>Disabled action</Button>
            <Button isPending pendingLabel="Saving the example">
              Pending action
            </Button>
          </InlineGroup>
          <TextField label="Disabled field cursor" isDisabled defaultValue="Unavailable" />
          <Tree
            ariaLabel="Buildings"
            expandLabel="Expand campus"
            collapseLabel="Collapse campus"
            selectionMode="single"
            defaultExpandedIds={['central']}
            items={
              buildings.length
                ? [{id: 'central', label: 'Central campus', children: buildings}]
                : []
            }
            emptyState={{
              kind: 'no-results',
              title: 'No matching buildings',
              description: 'Try another building name.',
            }}
          />
        </Stack>
      </AppearanceProvider>
    </Stack>
  );
}
