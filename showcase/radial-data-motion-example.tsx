import {ChartPresentation} from './chart-presentation.js';
import {useState} from 'react';
import {Button, DonutChart, PieChart, Stack, type PartToWholeSelectionItem} from '../src/index.js';

const buildings = [
  {id: 'north', label: 'North', value: 50},
  {id: 'south', label: 'South', value: 30},
  {id: 'east', label: 'East', value: 18},
  {id: 'west', label: 'West', value: 10},
];
const additions = [
  {id: 'annex', label: 'Annex', value: 7},
  {id: 'studio', label: 'Studio', value: 5},
];

export function RadialDataMotionExample({kind}: {readonly kind: 'pie' | 'donut'}) {
  const [data, setData] = useState(buildings);
  const [details, setDetails] = useState('');
  const Chart = kind === 'pie' ? PieChart : DonutChart;
  const nextBuilding = additions.find((building) => !data.some((item) => item.id === building.id));
  return (
    <Stack gap="regular">
      <p>
        Select a building, then change its energy use or the buildings included. Slice sizes move
        with their values. A change in rank fades between arrangements, and each building keeps its
        color. Details and the data table always show the current readings.
      </p>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
        <Button
          variant="secondary"
          onPress={() => {
            const ranked = [...data].sort((a, b) => b.value - a.value);
            setData(
              data.map((item) => ({
                ...item,
                value:
                  item.value + (ranked.length - ranked.findIndex((row) => row.id === item.id)) ** 2,
              })),
            );
          }}
        >
          Update values
        </Button>
        <Button
          variant="secondary"
          isDisabled={!nextBuilding}
          onPress={() => {
            if (nextBuilding) setData([...data, nextBuilding]);
          }}
        >
          Add building
        </Button>
        <Button
          variant="secondary"
          isDisabled={data.length < 2}
          onPress={() => {
            const largest = [...data].sort((a, b) => b.value - a.value)[0]!;
            setData(data.filter((item) => item.id !== largest.id));
          }}
        >
          Remove largest
        </Button>
        <Button
          variant="secondary"
          isDisabled={data.length < 2}
          onPress={() => {
            const ranked = [...data].sort((a, b) => b.value - a.value);
            const first = ranked[0]!;
            const last = ranked.at(-1)!;
            setData(
              data.map((item) => ({
                ...item,
                value:
                  item.id === first.id
                    ? last.value
                    : item.id === last.id
                      ? first.value
                      : item.value,
              })),
            );
          }}
        >
          Swap ranks
        </Button>
        <Button variant="secondary" onPress={() => setData(buildings)}>
          Reset data
        </Button>
      </div>
      <ChartPresentation>
        <Chart
          data={data}
          idAccessor="id"
          labelAccessor="label"
          value={{accessor: 'value', label: 'Energy use', unit: 'MWh'}}
          title={`${kind === 'pie' ? 'Pie' : 'Donut'} energy updates`}
          description="Current energy use by building."
          dataTableLabel={`${kind === 'pie' ? 'Pie' : 'Donut'} current building readings`}
          totalLabel="Total MWh"
          legend={{label: 'Buildings'}}
          emptyState={{title: 'No buildings', description: 'Add building readings.'}}
          invalidData={{
            title: 'Invalid energy use',
            description: 'Supply nonnegative energy readings.',
          }}
          labels={{
            back: 'Previous buildings',
            category: 'Building',
            categoryRange: ({start, end, total}) => `${start} to ${end} of ${total} buildings`,
            moreCategories: (count) => `${count} more buildings`,
            shareOfTotal: 'Share of total',
            shareOnPage: 'Share on page',
          }}
          visibilityLabels={{
            hideSeries: (label) => `Hide ${label}`,
            showSeries: (label) => `Show ${label}`,
            hidden: 'Hidden',
            showAll: 'Show all buildings',
            allHidden: {
              title: 'All buildings hidden',
              description: 'Show a building to restore its slice.',
            },
          }}
          interaction={{
            onActivate: (event) => setDetails(`${event.label}: ${event.value} MWh`),
            selection: {
              containsSelection: 'Contains selected buildings',
              labels: {
                instructions:
                  'Tap to select. Drag across slices to select several buildings. Control/Command-click or press and hold to open details.',
                clear: 'Clear selection',
                empty: 'Nothing selected',
                summary: (count) => `${count} selected`,
                item: (item: PartToWholeSelectionItem) =>
                  [...buildings, ...additions].find((row) => row.id === item.id)?.label ?? item.id,
                hidden: (label) => `${label} (hidden)`,
              },
            },
          }}
        />
      </ChartPresentation>
      {details ? <p role="status">{details}</p> : null}
    </Stack>
  );
}
