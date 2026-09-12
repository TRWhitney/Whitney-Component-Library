import {useState} from 'react';
import {ScatterChart, Select, Stack, Toolbar, type ChartRectangularWindow} from '../src/index.js';
const points = [
  {id: 'elm', x: 2, y: 3},
  {id: 'lab', x: 5, y: 8},
  {id: 'library', x: 8, y: 2},
];
const labels = {
  overview: 'Overview',
  closeOverview: 'Close overview',
  done: 'Done',
  reset: 'Fit',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  panLeft: 'Pan left',
  panRight: 'Pan right',
  panUp: 'Pan up',
  panDown: 'Pan down',
  window: 'Visible area',
  instructions:
    'Drag the window or corners. On the chart and command buttons, arrows pan and plus/minus zoom. Shift plus arrows reads values.',
  corner: (corner: string) => `Resize ${corner}`,
  range: (window: ChartRectangularWindow<number, number>) =>
    `${window.x.map((v) => v.toFixed(1)).join(' to ')} area · ${window.y.map((v) => v.toFixed(1)).join(' to ')} energy`,
};
export function ChartCommandCompositionExample() {
  const [presentation, setPresentation] = useState<'chart' | 'panel' | 'toolbar'>('chart');
  const [window, setWindow] = useState<ChartRectangularWindow<number, number>>({
    x: [0, 10],
    y: [0, 10],
  });
  return (
    <Stack gap="tight">
      <Select
        label="Exploration commands"
        emptyMessage="No presentations"
        value={presentation}
        onChange={(value) => setPresentation(value ?? 'chart')}
        options={[
          {value: 'chart', label: 'On chart'},
          {value: 'panel', label: 'Panel'},
          {value: 'toolbar', label: 'Application toolbar'},
        ]}
      />
      <ScatterChart
        title="Building review"
        description="Choose one command presentation. Focus the chart or a command, then use arrows to pan, plus/minus to zoom, or the wheel over the chart to zoom. Hold the middle mouse button over the plot and drag to pan."
        dataTableLabel="Building readings"
        data={points}
        idAccessor="id"
        labelAccessor="id"
        series={[{id: 'buildings', label: 'Buildings'}]}
        aspectRatio={2.8}
        minimumSize={{width: 260, height: 180}}
        xAxis={{accessor: 'x', label: 'Area', scale: {type: 'linear', domain: [0, 10]}}}
        yAxis={{accessor: 'y', label: 'Energy', scale: {type: 'linear', domain: [0, 10]}}}
        exploration={{
          window,
          onWindowChange: setWindow,
          labels,
          presentation: presentation === 'chart' ? 'chart' : 'panel',
          ...(presentation === 'toolbar'
            ? {
                renderControls: (controls) => (
                  <Toolbar label="Building exploration">
                    {controls.overview}
                    {controls.zoomOut}
                    {controls.zoomIn}
                    {controls.reset}
                    {controls.pan}
                  </Toolbar>
                ),
              }
            : {}),
        }}
        emptyState={{title: 'No buildings', description: 'No readings'}}
        invalidData={{title: 'Invalid buildings', description: 'Check readings'}}
      />
    </Stack>
  );
}
