import {act, cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {afterEach, describe, expect, it} from 'vitest';

import {BoxPlot, BubbleChart, Histogram, ScatterChart} from '../src/index.js';

afterEach(cleanup);

const stateCopy = {
  dataTableLabel: 'Statistical chart data',
  description: 'Recorded turbine behavior.',
  emptyState: {description: 'Choose a populated interval.', title: 'No observations'},
  invalidData: {description: 'Correct invalid observations.', title: 'Invalid observations'},
} as const;

const pointData = [
  {id: 'north-1', label: 'North Monday', loop: 'north', stored: 25, x: 18, y: 28},
  {id: 'south-1', label: 'South Monday', loop: 'south', stored: 100, x: 56, y: 68},
  {id: 'north-2', label: 'North Tuesday', loop: 'north', stored: 64, x: 56, y: 68},
] as const;

const pointSeries = [
  {id: 'north', label: 'North loop'},
  {color: 'series-2', id: 'south', label: 'South loop'},
] as const;

const pointAxes = {
  xAxis: {
    accessor: 'x',
    label: 'Temperature',
    scale: {domain: [10, 90], type: 'linear'},
    unit: '°F',
  },
  yAxis: {
    accessor: 'y',
    label: 'Thermal demand',
    scale: {domain: [20, 100], type: 'linear'},
    unit: 'MWh',
  },
} as const;

describe('statistical charts', () => {
  it('reads only a directly targeted point and gives a pinned series overlap priority', () => {
    const {container} = render(
      <ScatterChart
        {...stateCopy}
        {...pointAxes}
        data={pointData}
        idAccessor="id"
        labelAccessor="label"
        legend={{label: 'Turbine loops'}}
        series={pointSeries}
        seriesAccessor="loop"
        title="Temperature and demand"
      />,
    );
    const svg = container.querySelector('[data-wcl-chart-svg]')!;
    const firstPoint = container.querySelector('[data-point-id="north-1"]')!;

    expect(screen.queryByRole('tooltip')).toBeNull();
    fireEvent.pointerMove(firstPoint, {clientX: 140, clientY: 220, pointerType: 'mouse'});

    expect(within(screen.getByRole('tooltip')).getByText('North Monday')).toBeTruthy();
    expect(container.querySelectorAll('[data-wcl-statistical-mark][data-muted]')).toHaveLength(2);

    fireEvent.pointerMove(svg, {clientX: 300, clientY: 100, pointerType: 'mouse'});
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(container.querySelector('[data-wcl-statistical-mark][data-muted]')).toBeNull();

    fireEvent.click(screen.getByRole('button', {name: 'South loop'}));
    expect(screen.getByRole('button', {name: 'South loop'}).getAttribute('aria-pressed')).toBe(
      'true',
    );
    expect(container.querySelectorAll('[data-wcl-statistical-mark][data-muted]')).toHaveLength(2);
    expect(
      container
        .querySelector('[data-wcl-chart-marks]')
        ?.lastElementChild?.getAttribute('data-series-id'),
    ).toBe('south');

    fireEvent.click(screen.getByRole('button', {name: 'South loop'}));
    fireEvent.click(screen.getByRole('button', {name: 'North loop'}));
    fireEvent.pointerMove(firstPoint, {clientX: 140, clientY: 220, pointerType: 'mouse'});
    expect(container.querySelectorAll('[data-wcl-statistical-mark][data-muted]')).toHaveLength(2);
  });

  it('maps bubble magnitude to area and reports the source value', () => {
    const {container} = render(
      <BubbleChart
        {...stateCopy}
        {...pointAxes}
        data={pointData}
        idAccessor="id"
        labelAccessor="label"
        legend={{label: 'Turbine loops'}}
        magnitude={{accessor: 'stored', label: 'Stored energy', unit: 'MWh'}}
        series={pointSeries}
        seriesAccessor="loop"
        title="Stored energy"
      />,
    );
    const smallest = container.querySelector('[data-point-id="north-1"]')!;
    const largest = container.querySelector('[data-point-id="south-1"]')!;
    const smallCircle = smallest.querySelector('circle')!;
    const largeDiamond = largest.querySelector('rect')!;
    expect(largeDiamond.hasAttribute('rx')).toBe(false);
    const smallArea = Math.PI * Number(smallCircle.getAttribute('r')) ** 2;
    const largeArea =
      Number(largeDiamond.getAttribute('width')) * Number(largeDiamond.getAttribute('height'));

    expect(largeArea / smallArea).toBeCloseTo(4, 5);
    fireEvent.pointerMove(largest, {clientX: 380, clientY: 150, pointerType: 'mouse'});
    expect(within(screen.getByRole('tooltip')).getByText('100 MWh')).toBeTruthy();
  });

  it('normalizes bubble area across every group shape', () => {
    const series = [
      {id: 'group-0', label: 'Group 0'},
      {id: 'group-1', label: 'Group 1'},
      {id: 'group-2', label: 'Group 2'},
      {id: 'group-3', label: 'Group 3'},
      {id: 'group-4', label: 'Group 4'},
      {id: 'group-5', label: 'Group 5'},
    ] as const;
    const data = series.map((item, index) => ({
      group: item.id,
      id: `point-${index}`,
      label: `Point ${index}`,
      magnitude: 10,
      x: index + 1,
      y: index + 1,
    }));
    const {container} = render(
      <BubbleChart
        {...stateCopy}
        data={data}
        idAccessor="id"
        labelAccessor="label"
        legend={{label: 'Groups'}}
        magnitude={{accessor: 'magnitude', label: 'Magnitude'}}
        series={series}
        seriesAccessor="group"
        title="Equal magnitudes"
        xAxis={{accessor: 'x', label: 'X', scale: {type: 'linear'}}}
        yAxis={{accessor: 'y', label: 'Y', scale: {type: 'linear'}}}
      />,
    );
    const areaCoefficients = [Math.PI, 1.7 ** 2, 2, 1.7 ** 2, 2.31, 2.61];
    const areas = [...container.querySelectorAll('[data-mark-radius]')].map((mark) => {
      const shape = Number(mark.getAttribute('data-series-index'));
      const radius = Number(mark.getAttribute('data-mark-radius'));
      return radius ** 2 * areaCoefficients[shape]!;
    });

    for (const area of areas.slice(1)) expect(area / areas[0]!).toBeCloseTo(1, 5);
  });

  it('distinguishes raw observations from explicit pre-binned data', () => {
    const raw = [{latency: 8}, {latency: 21}, {latency: 44}, {latency: 47}] as const;
    const {container, rerender} = render(
      <Histogram
        {...stateCopy}
        data={raw}
        distribution={{accessor: 'latency', kind: 'raw', thresholds: [0, 20, 40, 60]}}
        title="Restart latency"
        xAxis={{label: 'Restart latency', scale: {domain: [0, 60], type: 'linear'}, unit: 'ms'}}
        yAxis={{label: 'Restarts', scale: {type: 'linear'}}}
      />,
    );

    expect(container.querySelectorAll('[data-wcl-histogram-bin]')).toHaveLength(3);
    fireEvent.pointerMove(container.querySelectorAll('[data-wcl-histogram-bin]')[2]!, {
      clientX: 400,
      clientY: 200,
      pointerType: 'mouse',
    });
    expect(within(screen.getByRole('tooltip')).getByText('[40 ms, 60 ms]')).toBeTruthy();
    expect(within(screen.getByRole('tooltip')).getByText('2')).toBeTruthy();

    expect(() =>
      rerender(
        <Histogram
          {...stateCopy}
          data={[
            {count: 2, from: 0, to: 20},
            {count: 3, from: 20, to: 60},
          ]}
          distribution={{
            kind: 'binned',
            lowerAccessor: 'from',
            ordinate: 'count',
            ordinateAccessor: 'count',
            upperAccessor: 'to',
          }}
          title="Restart latency"
          xAxis={{label: 'Restart latency', scale: {domain: [0, 60], type: 'linear'}, unit: 'ms'}}
          yAxis={{label: 'Restarts', scale: {type: 'linear'}}}
        />,
      ),
    ).toThrow(/equal widths/i);
  });

  it('rejects statistical contracts that would make the rendered scale ambiguous', () => {
    expect(() =>
      render(
        <Histogram
          {...stateCopy}
          data={[{latency: 8}, {latency: 9}]}
          distribution={{accessor: 'latency', kind: 'raw', thresholds: [0, 20]}}
          title="Restart latency"
          xAxis={{label: 'Restart latency', scale: {domain: [0, 20], type: 'linear'}}}
          yAxis={{label: 'Restarts', scale: {domain: [0, 1], type: 'linear'}}}
        />,
      ),
    ).toThrow(/ordinates.*Y-axis domain/i);

    expect(() =>
      render(
        <ScatterChart
          {...stateCopy}
          {...pointAxes}
          data={[pointData[0], {...pointData[0]}]}
          idAccessor="id"
          labelAccessor="label"
          series={[pointSeries[0]]}
          title="Temperature and demand"
        />,
      ),
    ).toThrow(/point id.*duplicated/i);

    expect(() =>
      render(
        <ScatterChart
          {...stateCopy}
          {...pointAxes}
          data={pointData}
          idAccessor="id"
          labelAccessor="label"
          series={pointSeries}
          title="Temperature and demand"
        />,
      ),
    ).toThrow(/visible legend/i);

    expect(() =>
      render(
        <ScatterChart
          {...stateCopy}
          data={pointData}
          idAccessor="id"
          labelAccessor="label"
          legend={{label: 'Turbine loops'}}
          series={pointSeries}
          seriesAccessor="loop"
          title="Temperature and demand"
          xAxis={{...pointAxes.xAxis, label: ' '}}
          yAxis={pointAxes.yAxis}
        />,
      ),
    ).toThrow(/X-axis label.*blank/i);
  });

  it('keeps box summaries and outliers separate and stops whiskers at the box', () => {
    const observations = [
      {loop: 'north', recovery: 43},
      {loop: 'north', recovery: 48},
      {loop: 'north', recovery: 52},
      {loop: 'north', recovery: 54},
      {loop: 'north', recovery: 57},
      {loop: 'north', recovery: 104},
    ] as const;
    const {container} = render(
      <BoxPlot
        {...stateCopy}
        data={observations}
        distribution={{kind: 'raw', valueAccessor: 'recovery', whisker: 'tukey'}}
        groupAccessor="loop"
        groups={[{id: 'north', label: 'North loop'}]}
        title="Recovery time"
        xAxis={{label: 'Turbine loop'}}
        yAxis={{label: 'Recovery time', scale: {domain: [0, 120], type: 'linear'}, unit: 'minutes'}}
      />,
    );

    expect(container.querySelectorAll('[data-wcl-box-whisker]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-wcl-box-outlier]')).toHaveLength(1);

    const summary = container.querySelector('[data-wcl-box-summary]')!;
    const outlier = container.querySelector('[data-wcl-box-outlier]')!;
    const quartile = summary.querySelector('[data-wcl-box-quartile]')!;
    const summaryParts = [...summary.children];
    for (const whisker of summary.querySelectorAll(
      '[data-wcl-box-whisker], [data-wcl-box-whisker-cap]',
    )) {
      expect(summaryParts.indexOf(quartile)).toBeLessThan(summaryParts.indexOf(whisker));
    }

    fireEvent.pointerMove(summary, {clientX: 300, clientY: 180, pointerType: 'mouse'});
    const summaryTooltip = within(screen.getByRole('tooltip'));
    expect(summaryTooltip.getByText('North loop distribution')).toBeTruthy();
    expect(summaryTooltip.getByText('Lower whisker')).toBeTruthy();
    expect(summaryTooltip.queryByText('Whisker method')).toBeNull();
    expect(summaryTooltip.queryByText('Outliers')).toBeNull();
    expect(summaryTooltip.queryByText('104 minutes')).toBeNull();
    expect(outlier.hasAttribute('data-active')).toBe(false);

    fireEvent.pointerMove(outlier, {clientX: 300, clientY: 80, pointerType: 'mouse'});
    const outlierTooltip = within(screen.getByRole('tooltip'));
    expect(outlierTooltip.getByText('North loop outlier')).toBeTruthy();
    expect(outlierTooltip.getByText('104 minutes')).toBeTruthy();
    expect(
      [...screen.getByRole('tooltip').querySelectorAll('dt')].map((term) => term.textContent),
    ).toEqual(['Group', 'Outlier']);
    expect(summary.hasAttribute('data-active')).toBe(false);
  });

  it('keeps one keyboard boundary and shows the active spatial point without muting peers', () => {
    const {container} = render(
      <ScatterChart
        {...stateCopy}
        {...pointAxes}
        data={pointData}
        idAccessor="id"
        labelAccessor="label"
        legend={{label: 'Turbine loops'}}
        series={pointSeries}
        seriesAccessor="loop"
        title="Temperature and demand"
      />,
    );
    const chart = screen.getByRole('group', {name: 'Temperature and demand'});
    const southLegend = screen.getByRole('button', {name: 'South loop'});

    fireEvent.click(southLegend);

    fireEvent.focus(chart);
    expect(screen.getByRole('tooltip')).toBeTruthy();
    expect(container.querySelectorAll('[data-wcl-statistical-mark][data-active]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-wcl-statistical-mark][data-muted]')).toHaveLength(2);
    expect(southLegend.closest('li')?.hasAttribute('data-emphasized')).toBe(true);

    fireEvent.keyDown(chart, {key: 'End'});
    expect(within(screen.getByRole('tooltip')).getByText('South Monday')).toBeTruthy();
    fireEvent.keyDown(chart, {key: 'Escape'});
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('renders explicit box summaries without deriving or joining consumer data', () => {
    const summaries = [
      {group: 'north', lower: 28, median: 54, outliers: [116], q1: 43, q3: 71, upper: 91},
      {group: 'south', lower: 19, median: 47, outliers: [108], q1: 34, q3: 63, upper: 85},
    ] as const;
    const {container} = render(
      <BoxPlot
        {...stateCopy}
        data={summaries}
        distribution={{
          kind: 'summary',
          lowerWhiskerAccessor: 'lower',
          medianAccessor: 'median',
          outliersAccessor: 'outliers',
          q1Accessor: 'q1',
          q3Accessor: 'q3',
          upperWhiskerAccessor: 'upper',
          whisker: 'tukey',
        }}
        groupAccessor="group"
        groups={pointSeries}
        legend={{label: 'Turbine loops'}}
        title="Recovery distribution"
        xAxis={{label: 'Turbine loop'}}
        yAxis={{label: 'Recovery time', scale: {domain: [0, 120], type: 'linear'}, unit: 'minutes'}}
      />,
    );

    expect(container.querySelectorAll('[data-wcl-box-summary]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-wcl-box-outlier]')).toHaveLength(2);
    expect(
      container.querySelectorAll('[data-wcl-statistical-legend-mark][data-shape="box"]'),
    ).toHaveLength(2);
    expect(
      within(screen.getByRole('table', {name: stateCopy.dataTableLabel})).getByText('116'),
    ).toBeTruthy();
    expect(screen.getByRole('columnheader', {name: 'Whisker method'})).toBeTruthy();
    expect(within(screen.getByRole('table')).getAllByText('Tukey 1.5 IQR')).toHaveLength(2);
  });

  it('requires one valid summary per group and classifies outliers beyond the whiskers', () => {
    interface SummaryFixture {
      readonly group: string;
      readonly lower: number;
      readonly median: number;
      readonly outliers: readonly number[];
      readonly q1: number;
      readonly q3: number;
      readonly upper: number;
    }
    const baseSummary: SummaryFixture = {
      group: 'north',
      lower: 28,
      median: 54,
      outliers: [116],
      q1: 43,
      q3: 71,
      upper: 91,
    };
    const renderSummary = (data: readonly SummaryFixture[], whisker: 'min-max' | 'tukey') =>
      render(
        <BoxPlot
          {...stateCopy}
          data={data}
          distribution={{
            kind: 'summary',
            lowerWhiskerAccessor: 'lower',
            medianAccessor: 'median',
            outliersAccessor: 'outliers',
            q1Accessor: 'q1',
            q3Accessor: 'q3',
            upperWhiskerAccessor: 'upper',
            whisker,
          }}
          groupAccessor="group"
          groups={pointSeries}
          legend={{label: 'Turbine loops'}}
          title="Recovery distribution"
          xAxis={{label: 'Turbine loop'}}
          yAxis={{label: 'Recovery time', scale: {domain: [0, 120], type: 'linear'}}}
        />,
      );

    expect(() => renderSummary([baseSummary], 'tukey')).toThrow(/summary.*South loop/i);
    expect(() =>
      renderSummary(
        [
          {...baseSummary, outliers: [104]},
          {...baseSummary, group: 'south', outliers: []},
        ],
        'tukey',
      ),
    ).toThrow(/Tukey.*outliers.*fence/i);
    expect(() =>
      renderSummary(
        [
          {...baseSummary, upper: 114},
          {...baseSummary, group: 'south', outliers: []},
        ],
        'tukey',
      ),
    ).toThrow(/Tukey.*whiskers.*fence/i);
    expect(() =>
      renderSummary(
        [baseSummary, {...baseSummary, group: 'south', median: Number.NaN, outliers: []}],
        'tukey',
      ),
    ).toThrow(/summary.*South loop/i);
    expect(() =>
      renderSummary(
        [
          {...baseSummary, outliers: [80]},
          {...baseSummary, group: 'south', outliers: []},
        ],
        'tukey',
      ),
    ).toThrow(/Tukey.*outliers.*fence/i);
    expect(() =>
      renderSummary([baseSummary, {...baseSummary, group: 'south', outliers: []}], 'min-max'),
    ).toThrow(/min-max.*outliers/i);
  });

  it('does not repeat an axis label as a table unit when no unit was supplied', () => {
    render(
      <BoxPlot
        {...stateCopy}
        data={[
          {group: 'north', value: 2},
          {group: 'north', value: 4},
        ]}
        distribution={{kind: 'raw', valueAccessor: 'value'}}
        groupAccessor="group"
        groups={[pointSeries[0]]}
        title="Distribution summary"
        xAxis={{label: 'Loop'}}
        yAxis={{label: 'Recovery', scale: {type: 'linear'}}}
      />,
    );

    expect(screen.getByRole('columnheader', {name: 'Lower whisker'})).toBeTruthy();
    expect(screen.queryByRole('columnheader', {name: 'Lower whisker (Recovery)'})).toBeNull();
  });

  it('retains a direct touch reading until an outside press dismisses it', () => {
    const {container} = render(
      <ScatterChart
        {...stateCopy}
        {...pointAxes}
        data={pointData}
        idAccessor="id"
        labelAccessor="label"
        legend={{label: 'Turbine loops'}}
        series={pointSeries}
        seriesAccessor="loop"
        title="Temperature and demand"
      />,
    );

    fireEvent.pointerDown(container.querySelector('[data-point-id="north-1"]')!, {
      pointerType: 'touch',
    });
    expect(within(screen.getByRole('tooltip')).getByText('North Monday')).toBeTruthy();
    expect(container.querySelectorAll('[data-wcl-statistical-mark][data-muted]')).toHaveLength(2);

    fireEvent.pointerDown(document.body, {pointerType: 'touch'});
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('clears stale readings while retaining focus and a valid legend pin', () => {
    const {container, rerender} = render(
      <ScatterChart
        {...stateCopy}
        {...pointAxes}
        data={pointData}
        idAccessor="id"
        labelAccessor="label"
        legend={{label: 'Turbine loops'}}
        series={pointSeries}
        seriesAccessor="loop"
        title="Temperature and demand"
      />,
    );

    fireEvent.pointerMove(container.querySelector('[data-point-id="south-1"]')!, {
      clientX: 380,
      clientY: 150,
      pointerType: 'mouse',
    });
    rerender(
      <ScatterChart
        {...stateCopy}
        {...pointAxes}
        data={[pointData[0], pointData[2]]}
        idAccessor="id"
        labelAccessor="label"
        legend={{label: 'Turbine loops'}}
        series={pointSeries}
        seriesAccessor="loop"
        title="Temperature and demand"
      />,
    );
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(container.querySelector('[data-wcl-statistical-mark][data-muted]')).toBeNull();

    rerender(
      <ScatterChart
        {...stateCopy}
        {...pointAxes}
        data={pointData}
        idAccessor="id"
        labelAccessor="label"
        legend={{label: 'Turbine loops'}}
        series={pointSeries}
        seriesAccessor="loop"
        title="Temperature and demand"
      />,
    );
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(container.querySelector('[data-wcl-statistical-mark][data-muted]')).toBeNull();

    fireEvent.click(screen.getByRole('button', {name: 'South loop'}));
    const chart = screen.getByRole('group', {name: 'Temperature and demand'});
    act(() => chart.focus());
    expect(document.activeElement).toBe(chart);
    fireEvent.pointerMove(container.querySelector('[data-point-id="south-1"]')!, {
      clientX: 380,
      clientY: 150,
      pointerType: 'mouse',
    });
    rerender(
      <ScatterChart
        {...stateCopy}
        {...pointAxes}
        data={pointData}
        idAccessor="id"
        labelAccessor="label"
        legend={{label: 'Turbine loops'}}
        series={pointSeries}
        seriesAccessor="loop"
        title="Temperature and demand"
        xAxis={{...pointAxes.xAxis, scale: {domain: [0, 200], type: 'linear'}}}
      />,
    );
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(document.activeElement).toBe(chart);
    expect(screen.getByRole('button', {name: 'South loop'}).getAttribute('aria-pressed')).toBe(
      'true',
    );
    fireEvent.pointerMove(container.querySelector('[data-point-id="south-1"]')!, {
      clientX: 380,
      clientY: 150,
      pointerType: 'mouse',
    });
    rerender(
      <ScatterChart
        {...stateCopy}
        {...pointAxes}
        aspectRatio={1.25}
        data={pointData}
        idAccessor="id"
        labelAccessor="label"
        legend={{label: 'Turbine loops'}}
        series={pointSeries}
        seriesAccessor="loop"
        title="Temperature and demand"
        xAxis={{...pointAxes.xAxis, scale: {domain: [0, 200], type: 'linear'}}}
      />,
    );
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(document.activeElement).toBe(chart);
    expect(screen.getByRole('button', {name: 'South loop'}).getAttribute('aria-pressed')).toBe(
      'true',
    );

    rerender(
      <ScatterChart
        {...stateCopy}
        {...pointAxes}
        data={[pointData[0]]}
        idAccessor="id"
        labelAccessor="label"
        series={[pointSeries[0]]}
        title="Temperature and demand"
      />,
    );

    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(container.querySelector('[data-wcl-statistical-mark][data-muted]')).toBeNull();

    rerender(
      <ScatterChart
        {...stateCopy}
        {...pointAxes}
        data={pointData}
        idAccessor="id"
        labelAccessor="label"
        legend={{label: 'Turbine loops'}}
        series={pointSeries}
        seriesAccessor="loop"
        title="Temperature and demand"
      />,
    );
    expect(screen.getByRole('button', {name: 'South loop'}).getAttribute('aria-pressed')).toBe(
      'false',
    );

    const northLegend = screen.getByRole('button', {name: 'North loop'});
    fireEvent.mouseEnter(northLegend);
    expect(northLegend.closest('li')?.hasAttribute('data-emphasized')).toBe(true);
    rerender(
      <ScatterChart
        {...stateCopy}
        {...pointAxes}
        data={[pointData[1]]}
        idAccessor="id"
        labelAccessor="label"
        legend={{label: 'Turbine loops'}}
        series={[pointSeries[1]]}
        seriesAccessor="loop"
        title="Temperature and demand"
      />,
    );
    rerender(
      <ScatterChart
        {...stateCopy}
        {...pointAxes}
        data={pointData}
        idAccessor="id"
        labelAccessor="label"
        legend={{label: 'Turbine loops'}}
        series={pointSeries}
        seriesAccessor="loop"
        title="Temperature and demand"
      />,
    );
    expect(
      screen
        .getByRole('button', {name: 'North loop'})
        .closest('li')
        ?.hasAttribute('data-emphasized'),
    ).toBe(false);
  });

  it('omits invalid observations, reports partial validity, and distinguishes unavailable data', () => {
    const {container, rerender} = render(
      <ScatterChart
        {...stateCopy}
        {...pointAxes}
        data={[...pointData, {...pointData[0], id: 'invalid', x: Number.NaN}]}
        idAccessor="id"
        labelAccessor="label"
        legend={{label: 'Turbine loops'}}
        series={pointSeries}
        seriesAccessor="loop"
        title="Temperature and demand"
      />,
    );

    expect(screen.getByText(stateCopy.invalidData.title)).toBeTruthy();
    expect(container.querySelectorAll('[data-wcl-statistical-point]')).toHaveLength(3);
    expect(
      screen.getByRole('table', {name: stateCopy.dataTableLabel}).querySelectorAll('tbody tr'),
    ).toHaveLength(3);

    rerender(
      <ScatterChart
        {...stateCopy}
        {...pointAxes}
        data={[{...pointData[0], x: Number.NaN}]}
        idAccessor="id"
        labelAccessor="label"
        series={[pointSeries[0]]}
        title="Temperature and demand"
      />,
    );
    expect(screen.getByText(stateCopy.invalidData.description)).toBeTruthy();
    expect(screen.queryByRole('table')).toBeNull();
  });

  it('renders deterministic server output and hydrates the statistical family', async () => {
    const charts = [
      <ScatterChart
        {...stateCopy}
        {...pointAxes}
        data={pointData}
        idAccessor="id"
        key="scatter"
        labelAccessor="label"
        legend={{label: 'Turbine loops'}}
        series={pointSeries}
        seriesAccessor="loop"
        title="Temperature and demand"
      />,
      <BubbleChart
        {...stateCopy}
        {...pointAxes}
        data={pointData}
        idAccessor="id"
        key="bubble"
        labelAccessor="label"
        legend={{label: 'Turbine loops'}}
        magnitude={{accessor: 'stored', label: 'Stored energy'}}
        series={pointSeries}
        seriesAccessor="loop"
        title="Stored energy"
      />,
      <Histogram
        {...stateCopy}
        data={[{value: 1}, {value: 2}]}
        distribution={{accessor: 'value', kind: 'raw', thresholds: 2}}
        key="histogram"
        title="Distribution"
        xAxis={{label: 'Value', scale: {type: 'linear'}}}
        yAxis={{label: 'Count', scale: {type: 'linear'}}}
      />,
      <BoxPlot
        {...stateCopy}
        data={[
          {group: 'north', value: 2},
          {group: 'north', value: 4},
        ]}
        distribution={{kind: 'raw', valueAccessor: 'value'}}
        groupAccessor="group"
        groups={[pointSeries[0]]}
        key="box"
        title="Distribution summary"
        xAxis={{label: 'Loop'}}
        yAxis={{label: 'Value', scale: {type: 'linear'}}}
      />,
    ];
    const markup = renderToString(<>{charts}</>);
    expect(markup).toContain('data-wcl-scatter-chart');
    expect(markup).toContain('data-wcl-bubble-chart');
    expect(markup).toContain('data-wcl-histogram');
    expect(markup).toContain('data-wcl-box-plot');

    const host = document.createElement('div');
    host.innerHTML = markup;
    await act(async () => {
      hydrateRoot(host, <>{charts}</>);
      await Promise.resolve();
    });
    expect(host.querySelectorAll('[data-wcl-chart]')).toHaveLength(4);
  });
});

it('staggers crowded box group labels as well as reserving space for them', () => {
  const groups = [
    {id: '0', label: 'Turbine loop 1'},
    {id: '1', label: 'Turbine loop 2'},
    {id: '2', label: 'Turbine loop 3'},
    {id: '3', label: 'Turbine loop 4'},
    {id: '4', label: 'Turbine loop 5'},
    {id: '5', label: 'Turbine loop 6'},
  ] as const;
  const samples = groups.flatMap((group) =>
    [10, 20, 30, 40, 50].map((value) => ({group: group.id, value})),
  );
  const {container} = render(
    <BoxPlot
      {...stateCopy}
      data={samples}
      title="Recovery"
      distribution={{kind: 'raw', valueAccessor: 'value', whisker: 'tukey'}}
      groupAccessor="group"
      groups={groups}
      legend={{label: 'Loops'}}
      xAxis={{label: 'Loop'}}
      yAxis={{label: 'Time', scale: {type: 'linear'}}}
    />,
  );
  const labels = [...container.querySelectorAll('[data-axis="x"] [data-wcl-chart-tick-label]')];
  expect(labels).toHaveLength(6);
  expect(new Set(labels.map((label) => label.getAttribute('data-label-row')))).toEqual(
    new Set(['1', '2']),
  );
});

it('fits large numeric ticks without shortening their values', () => {
  const {container} = render(
    <ScatterChart
      {...stateCopy}
      data={Array.from({length: 12}, (_, i) => ({id: String(i), x: 100000 + i * 1000, y: i}))}
      title="Coordinates"
      idAccessor="id"
      labelAccessor="id"
      series={[{id: 'values', label: 'Values'}]}
      xAxis={{
        accessor: 'x',
        label: 'Position',
        scale: {type: 'linear', domain: [100000, 111000]},
        tickCount: 12,
      }}
      yAxis={{accessor: 'y', label: 'Value', scale: {type: 'linear'}}}
    />,
  );
  const labels = [...container.querySelectorAll('[data-axis="x"] [data-wcl-chart-tick-label]')];
  expect(labels.map((label) => label.textContent)).toEqual(
    Array.from({length: 12}, (_, i) => String(100000 + i * 1000)),
  );
  expect(new Set(labels.map((label) => label.getAttribute('data-label-row')))).toEqual(
    new Set(['1', '2']),
  );
});
