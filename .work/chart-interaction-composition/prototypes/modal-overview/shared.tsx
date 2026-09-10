import type {ReactNode} from 'react';
import {Button, IconButton, Dialog, RadioGroup} from '../../../../src/index.js';
export const initialChart = new URLSearchParams(location.search).get('chart') || 'line';
export function StudyHeading() {
  return (
    <header>
      <p className="kicker">Interaction study</p>
      <h1>Chart overview</h1>
      <p>Open Overview on the chart to move or resize the visible range.</p>
    </header>
  );
}
export function ChartPicker({value}: {value: string}) {
  return (
    <div className="chart-choices" data-study-name="Chart type choices">
      <RadioGroup
        label="Chart type"
        name="chart-type"
        value={value}
        onChange={(chart) => {
          location.search = new URLSearchParams({chart}).toString();
        }}
        options={[
          {value: 'line', label: 'Line'},
          {value: 'area', label: 'Area'},
          {value: 'columns', label: 'Grouped columns'},
          {value: 'stacked', label: 'Stacked columns'},
          {value: 'mixed', label: 'Columns + line'},
          {value: 'scatter', label: 'Scatter'},
          {value: 'bubble', label: 'Bubble'},
          {value: 'histogram', label: 'Histogram'},
          {value: 'box', label: 'Box plot'},
          {value: 'bar', label: 'Horizontal bars'},
          {value: 'heatmap', label: 'Heatmap'},
        ]}
      />
    </div>
  );
}
export function ModalOverview({
  description,
  onReset,
  children,
}: {
  description: string;
  onReset: () => void;
  children: ReactNode;
}) {
  return (
    <span className="modal-overview-trigger" data-study-name="Overview button">
      <Dialog
        title="Overview"
        description={description}
        closeLabel="Close overview"
        trigger={
          <IconButton variant="quiet" size="compact" label="Overview">
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            >
              <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" />
              <rect x="5.5" y="4.5" width="5" height="7" rx="0.5" />
            </svg>
          </IconButton>
        }
        actions={({close}) => (
          <>
            <Button variant="quiet" onPress={onReset}>
              Reset view
            </Button>
            <Button onPress={close}>Done</Button>
          </>
        )}
      >
        <div className="modal-overview-content" data-study-name="Overview dialog">
          {children}
        </div>
      </Dialog>
    </span>
  );
}

export const visibilityLabels = {
  hideSeries: (label: string) => `Hide ${label}`,
  showSeries: (label: string) => `Show ${label}`,
  hidden: 'Hidden',
  showAll: 'Show all',
  allHidden: {title: 'All series hidden', description: 'Use a closed eye to restore a series.'},
};
