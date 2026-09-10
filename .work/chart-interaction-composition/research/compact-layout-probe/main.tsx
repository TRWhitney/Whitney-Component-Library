// Audit fixtures only. Render unmodified production components with crowded labels.
import React from 'react';
import {createRoot} from 'react-dom/client';
import {AppearanceProvider, LineChart, BoxPlot} from '../../../../src/index.js';
import '../../../../src/styles.css';
document.body.style.background = '#172126';
const data = Array.from({length: 12}, (_, i) => ({
  id: String(i),
  date: new Date(Date.UTC(2026, i, 1)),
  month: new Date(Date.UTC(2026, i, 1)).toLocaleDateString('en-US', {
    month: 'short',
    timeZone: 'UTC',
  }),
  amount: 110 + i * 4 + (i % 3) * 12,
  coordinate: 100000 + i * 1000,
}));
const common = {
  description: 'Compact layout audit fixture',
  legend: {label: 'Audit series'},
  dataTableLabel: 'Audit data',
  emptyState: {title: 'Empty', description: 'No data'},
  invalidData: {title: 'Invalid', description: 'Invalid data'},
};
const series = [
  {id: 'amount', label: 'Revenue', accessor: 'amount', color: 'accent', showPoints: true},
] as const;
const yAxis = {label: 'Revenue', unit: '$k', scale: {type: 'linear'}} as const;
const groups = Array.from({length: 6}, (_, i) => ({
  id: String(i),
  label: `Turbine loop ${i + 1}`,
  color: 'accent' as const,
}));
const samples = groups.flatMap((g, i) =>
  [10, 20, 30, 40, 50].map((value) => ({group: g.id, value: value + i * 3})),
);
createRoot(document.getElementById('root')!).render(
  <AppearanceProvider appearance="dark" accent="#2878ff">
    <main style={{padding: 16, maxWidth: 1000, margin: 'auto'}}>
      {['categorical', 'time', 'numeric'].map((kind) => (
        <section key={kind} data-audit={kind} style={{marginBottom: 24}}>
          <LineChart
            {...common}
            data={data}
            series={series}
            yAxis={yAxis}
            title={`${kind} axis, 12 observations`}
            xAxis={
              kind === 'categorical'
                ? {accessor: 'month', label: 'Month', scale: {type: 'categorical'}}
                : kind === 'time'
                  ? {
                      accessor: 'date',
                      label: 'Month',
                      scale: {type: 'time', domain: [data[0].date, data[11].date]},
                      tickCount: 12,
                      formatTick: (date) =>
                        date.toLocaleDateString('en-US', {month: 'short', timeZone: 'UTC'}),
                    }
                  : {
                      accessor: 'coordinate',
                      label: 'Distance',
                      scale: {type: 'linear'},
                      tickCount: 12,
                    }
            }
          />
        </section>
      ))}
      <section data-audit="box">
        <BoxPlot
          {...common}
          data={samples}
          title="Six named turbine loops"
          distribution={{kind: 'raw', valueAccessor: 'value', whisker: 'tukey'}}
          groupAccessor="group"
          groups={groups}
          xAxis={{label: 'Turbine loop'}}
          yAxis={{label: 'Recovery time', unit: 'minutes', scale: {type: 'linear'}}}
        />
      </section>
    </main>
  </AppearanceProvider>,
);
