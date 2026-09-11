import {useState} from 'react';
import {Button, RadarChart, Stack, Switch} from '../src/index.js';

const dimensions = [
  {id: 'speed', label: 'Speed', accessor: 'speed'},
  {id: 'range', label: 'Range', accessor: 'range'},
  {id: 'payload', label: 'Payload', accessor: 'payload'},
  {id: 'comfort', label: 'Comfort', accessor: 'comfort'},
  {id: 'traction', label: 'Traction', accessor: 'traction'},
] as const;
type Profile = {id: string; label: string} & Record<(typeof dimensions)[number]['id'], number>;
const profiles: readonly (readonly [Profile, Profile])[] = [
  [
    {id: 'courier', label: 'Courier', speed: 78, range: 56, payload: 88, comfort: 42, traction: 64},
    {id: 'scout', label: 'Scout', speed: 52, range: 86, payload: 38, comfort: 76, traction: 91},
  ],
  [
    {id: 'courier', label: 'Courier', speed: 61, range: 94, payload: 67, comfort: 82, traction: 48},
    {id: 'scout', label: 'Scout', speed: 93, range: 62, payload: 59, comfort: 48, traction: 73},
  ],
];

export function RadarDataMotionExample() {
  const [revision, setRevision] = useState(0);
  const [compact, setCompact] = useState(false);
  const [details, setDetails] = useState('');
  return (
    <Stack gap="regular">
      <p>
        Select a vehicle score, then update the values. Each profile and its selected points move
        together. The eyes hide profiles and fit the shared scale. Details and the table show the
        latest supplied scores throughout each update.
      </p>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
        <Button variant="secondary" onPress={() => setRevision((value) => value + 1)}>
          Update values
        </Button>
        <Button variant="secondary" onPress={() => setRevision(0)}>
          Reset
        </Button>
      </div>
      <Switch label="Compact container" isSelected={compact} onChange={setCompact} />
      <div style={{maxWidth: compact ? '22rem' : undefined}}>
        <RadarChart<Profile>
          data={profiles[revision % profiles.length]!}
          title="Updated vehicle profiles"
          description="Synthetic scores across five shared qualities."
          dataTableLabel="Current vehicle scores"
          idAccessor="id"
          labelAccessor="label"
          dimensions={dimensions}
          labels={{dimension: 'Quality'}}
          legend={{label: 'Vehicles'}}
          value={{label: 'Score', unit: 'points'}}
          minimumSize={{width: 260, height: 260}}
          emptyState={{title: 'No vehicles', description: 'Add vehicle scores.'}}
          invalidData={{title: 'Invalid scores', description: 'Supply nonnegative vehicle scores.'}}
          visibilityLabels={{
            hideSeries: (label) => `Hide ${label}`,
            showSeries: (label) => `Show ${label}`,
            hidden: 'Hidden',
            showAll: 'Show all vehicles',
            allHidden: {
              title: 'All vehicles hidden',
              description: 'Show a vehicle to restore its profile.',
            },
          }}
          interaction={{
            target: 'point',
            onActivate: (event) =>
              setDetails(
                `${event.dimension.label}: ${event.values.map((value) => `${value.label} ${value.value} points`).join(', ')}`,
              ),
            selection: {
              labels: {
                instructions:
                  'Tap a score to select it. Drag to select several scores. Control/Command-click or hold to open details. Arrow keys move between scores; Enter selects and Control/Command-Enter opens details.',
                clear: 'Clear selection',
                empty: 'Nothing selected',
                summary: (count) => `${count} selected`,
                item: (item) =>
                  `${profiles[0]!.find((profile) => profile.id === item.seriesId)?.label ?? item.seriesId}, ${dimensions.find((dimension) => dimension.id === item.dimensionId)?.label ?? item.dimensionId}`,
                hidden: (label) => `${label} (hidden)`,
              },
            },
          }}
        />
      </div>
      {details ? <p role="status">{details}</p> : null}
    </Stack>
  );
}
