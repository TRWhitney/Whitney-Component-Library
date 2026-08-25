import {cleanup, render, screen, within} from '@testing-library/react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {afterEach, describe, expect, it} from 'vitest';

import {AreaChart, BarChart, CartesianChart, ColumnChart, LineChart} from '../src/index.js';

afterEach(cleanup);

const data = [
  {capacity: 58, demand: 42, month: 'Jan', recordedAt: new Date('2026-01-01T00:00:00.000Z')},
  {capacity: 64, demand: 51, month: 'Feb', recordedAt: new Date('2026-02-01T00:00:00.000Z')},
  {capacity: 68, demand: 61, month: 'Mar', recordedAt: new Date('2026-03-01T00:00:00.000Z')},
] as const;

const emptyState = {
  description: 'Choose a reporting interval with recorded demand.',
  title: 'No demand data',
} as const;

const invalidData = {
  description: 'Remove or replace records with missing chart values.',
  title: 'Some demand data is invalid',
} as const;

describe('Cartesian charts', () => {
  it('renders static line meaning as a labeled figure and generated data table', () => {
    const {container} = render(
      <LineChart
        annotations={[
          {axis: 'y', kind: 'line', label: 'Capacity target', tone: 'accent', value: 60},
          {
            axis: 'y',
            from: 62,
            kind: 'band',
            label: 'Review range',
            to: 70,
            tone: 'warning',
          },
          {kind: 'point', label: 'March peak', tone: 'neutral', x: 'Mar', y: 61},
        ]}
        data={data}
        dataTableLabel="Thermal demand data"
        description="Monthly demand stays below available thermal capacity."
        emptyState={emptyState}
        invalidData={invalidData}
        legend={{label: 'Energy series'}}
        series={[
          {accessor: 'demand', id: 'demand', label: 'Demand', showPoints: true},
          {accessor: 'capacity', color: 'series-2', id: 'capacity', label: 'Capacity'},
        ]}
        title="Thermal demand"
        xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
        yAxis={{
          formatTick: (value) => `${value.toFixed(1)} energy`,
          label: 'Energy',
          scale: {type: 'linear'},
          unit: 'MWh',
        }}
      />,
    );

    const figure = screen.getByRole('figure', {name: 'Thermal demand'});
    expect(figure.getAttribute('aria-describedby')).toBeTruthy();
    expect(within(figure).getByText(/stays below available/i)).toBeTruthy();
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelectorAll('[data-wcl-chart-line]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-wcl-chart-point]')).toHaveLength(3);
    expect(
      container.querySelector('[data-wcl-chart-axis][data-axis="x"]')?.getAttribute('data-scale'),
    ).toBe('categorical');
    expect(
      container.querySelector('[data-wcl-chart-axis][data-axis="y"]')?.getAttribute('data-scale'),
    ).toBe('linear');
    expect(
      [...container.querySelectorAll('[data-axis="y"] [data-wcl-chart-tick-label]')].every(
        (label) => label.textContent?.endsWith(' energy'),
      ),
    ).toBe(true);
    expect(screen.getByRole('list', {name: 'Energy series'})).toBeTruthy();
    expect(container.querySelectorAll('[data-wcl-chart-annotation]')).toHaveLength(3);
    expect(container.querySelector('[data-wcl-chart-annotation-summary]')?.textContent).toContain(
      'March peak',
    );

    const table = screen.getByRole('table', {name: 'Thermal demand data'});
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent),
    ).toEqual(['Month', 'Demand (MWh)', 'Capacity (MWh)']);
    expect(
      within(table)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    ).toContain('61.0 energy');
    const marks = container.querySelector('[data-wcl-chart-marks]');
    const foregroundAnnotations = container.querySelector(
      '[data-wcl-chart-annotations][data-layer="foreground"]',
    );
    expect(marks?.compareDocumentPosition(foregroundAnnotations as Node)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it('supports time, logarithmic, and normalized scales without renderer-shaped props', () => {
    const {container, rerender} = render(
      <LineChart
        annotations={[
          {
            kind: 'point',
            label: 'February capacity',
            tone: 'neutral',
            x: data[1].recordedAt,
            y: data[1].capacity,
          },
        ]}
        data={data}
        dataTableLabel="Recorded capacity data"
        description="Capacity by recorded month."
        emptyState={emptyState}
        invalidData={invalidData}
        series={[{accessor: 'capacity', id: 'capacity', label: 'Capacity'}]}
        title="Recorded capacity"
        xAxis={{
          accessor: 'recordedAt',
          label: 'Recorded',
          scale: {type: 'time'},
          unit: 'UTC date',
        }}
        yAxis={{label: 'Capacity', scale: {base: 10, type: 'logarithmic'}, unit: 'MWh'}}
      />,
    );

    expect(container.querySelector('[data-axis="x"]')?.getAttribute('data-scale')).toBe('time');
    expect(container.querySelector('[data-axis="y"]')?.getAttribute('data-scale')).toBe(
      'logarithmic',
    );
    expect(container.querySelector('[data-wcl-chart-line]')?.getAttribute('d')).not.toMatch(
      /Infinity|NaN/,
    );
    expect(
      within(screen.getByRole('table', {name: 'Recorded capacity data'}))
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent),
    ).toEqual(['Recorded (UTC date)', 'Capacity (MWh)']);
    expect(container.querySelector('[data-wcl-chart-annotation-summary]')?.textContent).toContain(
      'Recorded (UTC date): 2026-02-01',
    );

    rerender(
      <AreaChart
        data={data}
        dataTableLabel="Demand share data"
        description="Each month is normalized to total available energy."
        emptyState={emptyState}
        invalidData={invalidData}
        legend={{label: 'Energy series'}}
        annotations={[
          {axis: 'y', kind: 'line', label: 'Half capacity', tone: 'neutral', value: 0.5},
        ]}
        series={[
          {accessor: 'demand', id: 'demand', label: 'Demand'},
          {accessor: 'capacity', id: 'capacity', label: 'Capacity'},
        ]}
        stacking="normalized"
        title="Demand share"
        xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
        yAxis={{label: 'Share', scale: {type: 'normalized'}, unit: '%'}}
      />,
    );
    expect(container.querySelector('[data-wcl-area-chart]')?.getAttribute('data-stacking')).toBe(
      'normalized',
    );
    expect(container.querySelector('[data-axis="y"]')?.getAttribute('data-scale')).toBe(
      'normalized',
    );
    expect(
      within(screen.getByRole('table', {name: 'Demand share data'}))
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    ).toContain('42%');
    expect(container.querySelector('[data-wcl-chart-annotation-summary]')?.textContent).toContain(
      'Share (%): 50%',
    );
    expect(
      container.querySelector('[data-wcl-chart-annotation-summary]')?.textContent,
    ).not.toContain('% %');

    rerender(
      <AreaChart
        data={[{available: 0.3, month: 'Jan', used: 0.2}]}
        dataTableLabel="Fractional share data"
        description="One fractional row is normalized to its own total."
        emptyState={emptyState}
        invalidData={invalidData}
        legend={{label: 'Fractional energy series'}}
        series={[
          {accessor: 'used', id: 'used', label: 'Used'},
          {accessor: 'available', id: 'available', label: 'Available'},
        ]}
        stacking="normalized"
        title="Fractional share"
        xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
        yAxis={{label: 'Share', scale: {type: 'normalized'}, unit: '%'}}
      />,
    );
    expect(
      within(screen.getByRole('table', {name: 'Fractional share data'}))
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    ).toEqual(['40%', '60%']);
  });

  it('distinguishes horizontal bars, columns, grouped, stacked, and normalized layouts', () => {
    const shared = {
      data,
      dataTableLabel: 'Energy by month data',
      description: 'Demand and capacity by month.',
      emptyState,
      invalidData,
      legend: {label: 'Energy series'},
      series: [
        {accessor: 'demand', id: 'demand', label: 'Demand'},
        {accessor: 'capacity', id: 'capacity', label: 'Capacity'},
      ],
      title: 'Energy by month',
    } as const;
    const {container} = render(
      <>
        <ColumnChart
          {...shared}
          layout="grouped"
          xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
          yAxis={{label: 'Energy', scale: {type: 'linear'}, unit: 'MWh'}}
        />
        <ColumnChart
          {...shared}
          layout="stacked"
          title="Stacked energy"
          xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
          yAxis={{label: 'Energy', scale: {type: 'linear'}, unit: 'MWh'}}
        />
        <BarChart
          {...shared}
          layout="normalized"
          title="Normalized horizontal energy"
          xAxis={{label: 'Share', scale: {type: 'normalized'}, unit: '%'}}
          yAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
        />
      </>,
    );

    expect(container.querySelector('[data-wcl-column-chart][data-layout="grouped"]')).toBeTruthy();
    expect(container.querySelector('[data-wcl-column-chart][data-layout="stacked"]')).toBeTruthy();
    expect(container.querySelector('[data-wcl-bar-chart][data-layout="normalized"]')).toBeTruthy();
    expect(container.querySelectorAll('[data-wcl-chart-bar]')).toHaveLength(18);
  });

  it('renders compatible mixed Cartesian series in one shared frame', () => {
    const {container} = render(
      <CartesianChart
        data={data}
        dataTableLabel="Demand and reserve data"
        description="Capacity columns sit behind the demand line and reserve area."
        emptyState={emptyState}
        invalidData={invalidData}
        legend={{label: 'Energy series'}}
        series={[
          {accessor: 'capacity', id: 'capacity', kind: 'column', label: 'Capacity'},
          {accessor: 'demand', id: 'reserve', kind: 'area', label: 'Reserve'},
          {
            accessor: 'demand',
            color: 'accent',
            id: 'demand',
            kind: 'line',
            label: 'Demand',
            showPoints: true,
          },
        ]}
        title="Demand and reserve"
        xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
        yAxis={{label: 'Energy', scale: {type: 'linear'}, unit: 'MWh'}}
      />,
    );

    expect(container.querySelector('[data-wcl-cartesian-chart]')).toBeTruthy();
    expect(container.querySelector('[data-wcl-chart-bar]')).toBeTruthy();
    expect(container.querySelector('[data-wcl-chart-area]')).toBeTruthy();
    expect(container.querySelector('[data-wcl-chart-line]')).toBeTruthy();
  });

  it('renders stroked series above filled marks regardless of series order', () => {
    const {container} = render(
      <CartesianChart
        data={data}
        dataTableLabel="Demand and capacity data"
        description="Demand remains visible over filled capacity and reserve marks."
        emptyState={emptyState}
        invalidData={invalidData}
        legend={{label: 'Energy series'}}
        series={[
          {accessor: 'demand', id: 'demand', kind: 'line', label: 'Demand'},
          {accessor: 'capacity', id: 'capacity', kind: 'column', label: 'Capacity'},
          {accessor: 'demand', id: 'reserve', kind: 'area', label: 'Reserve'},
        ]}
        title="Demand over capacity"
        xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
        yAxis={{label: 'Energy', scale: {type: 'linear'}}}
      />,
    );
    const line = container.querySelector('[data-wcl-chart-line]');
    const bar = container.querySelector('[data-wcl-chart-bar]');
    const area = container.querySelector('[data-wcl-chart-area]');

    expect(bar?.compareDocumentPosition(line as Node)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(area?.compareDocumentPosition(line as Node)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('bounds categorical tick labels without removing data categories', () => {
    const regions = [
      'North',
      'South',
      'East',
      'West',
      'Central',
      'Northeast',
      'Southeast',
      'Northwest',
      'Southwest',
      'Remote',
    ];
    const denseData = Array.from({length: 10}, (_, index) => ({
      category: `Long planning interval ${regions[index]}`,
      value: index + 1,
    }));
    const {container} = render(
      <>
        <LineChart
          data={denseData}
          dataTableLabel="Planning interval data"
          description="All intervals remain in the data table while the plot labels a useful subset."
          emptyState={emptyState}
          invalidData={invalidData}
          series={[{accessor: 'value', id: 'value', label: 'Value'}]}
          title="Planning intervals"
          xAxis={{
            accessor: 'category',
            label: 'Interval',
            scale: {type: 'categorical'},
            tickCount: 4,
          }}
          yAxis={{label: 'Value', scale: {type: 'linear'}}}
        />
        <BarChart
          data={denseData}
          dataTableLabel="Horizontal planning interval data"
          description="Long interval names remain bounded beside horizontal bars."
          emptyState={emptyState}
          invalidData={invalidData}
          series={[{accessor: 'value', id: 'value', label: 'Value'}]}
          title="Horizontal planning intervals"
          xAxis={{label: 'Value', scale: {type: 'linear'}}}
          yAxis={{
            accessor: 'category',
            label: 'Interval',
            scale: {type: 'categorical'},
            tickCount: 4,
          }}
        />
      </>,
    );

    const horizontalLabels = [
      ...(container
        .querySelector('[data-wcl-line-chart]')
        ?.querySelectorAll('[data-axis="x"] [data-wcl-chart-tick-label]') ?? []),
    ];
    const verticalLabels = [
      ...(container
        .querySelector('[data-wcl-bar-chart]')
        ?.querySelectorAll('[data-axis="y"] [data-wcl-chart-tick-label]') ?? []),
    ];
    expect(horizontalLabels).toHaveLength(4);
    expect(verticalLabels).toHaveLength(4);
    expect(horizontalLabels.every((label) => (label.textContent?.length ?? 0) <= 17)).toBe(true);
    expect(verticalLabels.every((label) => (label.textContent?.length ?? 0) <= 11)).toBe(true);
    expect(new Set(verticalLabels.map((label) => label.textContent)).size).toBe(4);
    expect(verticalLabels.map((label) => label.textContent)).toEqual([
      expect.stringMatching(/North$/),
      expect.stringMatching(/West$/),
      expect.stringMatching(/east$/),
      expect.stringMatching(/mote$/),
    ]);
    expect(horizontalLabels.every((label) => label.getAttribute('text-anchor') === 'middle')).toBe(
      true,
    );
    expect(
      [...(container.querySelector('[data-wcl-line-chart]')?.querySelectorAll('title') ?? [])].map(
        (title) => title.textContent,
      ),
    ).toEqual([
      'Long planning interval North',
      'Long planning interval West',
      'Long planning interval Southeast',
      'Long planning interval Remote',
    ]);
    expect(
      within(screen.getByRole('table', {name: 'Planning interval data'})).getAllByRole('row'),
    ).toHaveLength(11);
  });

  it('keeps long single-word category endings distinguishable', () => {
    const {container} = render(
      <BarChart
        data={[
          {category: 'NorthwesternRegionA', value: 4},
          {category: 'NorthwesternRegionB', value: 6},
        ]}
        dataTableLabel="Regional values"
        description="Regions with a shared long prefix remain distinguishable."
        emptyState={emptyState}
        invalidData={invalidData}
        series={[{accessor: 'value', id: 'value', label: 'Value'}]}
        title="Regional values"
        xAxis={{label: 'Value', scale: {type: 'linear'}}}
        yAxis={{
          accessor: 'category',
          label: 'Region',
          scale: {type: 'categorical'},
          tickCount: 2,
        }}
      />,
    );
    const labels = [
      ...container.querySelectorAll('[data-axis="y"] [data-wcl-chart-tick-label]'),
    ].map((label) => label.textContent);

    expect(new Set(labels).size).toBe(2);
    expect(labels).toEqual([expect.stringMatching(/A$/), expect.stringMatching(/B$/)]);
  });

  it('keeps automatic colors distinct from explicit ordinary palette choices', () => {
    const {container, rerender} = render(
      <CartesianChart
        data={data}
        dataTableLabel="Demand and capacity data"
        description="Capacity columns sit behind the demand line."
        emptyState={emptyState}
        invalidData={invalidData}
        legend={{label: 'Energy series'}}
        series={[
          {
            accessor: 'capacity',
            color: 'series-2',
            id: 'capacity',
            kind: 'column',
            label: 'Capacity',
          },
          {accessor: 'demand', id: 'demand', kind: 'line', label: 'Demand'},
        ]}
        title="Demand within capacity"
        xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
        yAxis={{label: 'Energy', scale: {type: 'linear'}}}
      />,
    );

    const legendColors = () =>
      [...container.querySelectorAll('[data-wcl-chart-legend] > li')].map((item) =>
        item.getAttribute('data-color'),
      );
    expect(legendColors()).toEqual(['series-2', 'accent']);

    rerender(
      <CartesianChart
        data={data}
        dataTableLabel="Demand and capacity data"
        description="Later explicit choices reserve their color from automatic series."
        emptyState={emptyState}
        invalidData={invalidData}
        legend={{label: 'Energy series'}}
        series={[
          {accessor: 'capacity', id: 'capacity', kind: 'column', label: 'Capacity'},
          {
            accessor: 'demand',
            color: 'accent',
            id: 'demand',
            kind: 'line',
            label: 'Demand',
          },
          {accessor: 'capacity', id: 'reserve', kind: 'area', label: 'Reserve'},
        ]}
        title="Reserved explicit color"
        xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
        yAxis={{label: 'Energy', scale: {type: 'linear'}}}
      />,
    );

    expect(legendColors()).toEqual(['series-2', 'accent', 'series-3']);

    rerender(
      <CartesianChart
        data={data}
        dataTableLabel="Demand and capacity data"
        description="Explicit duplicate colors remain author-controlled."
        emptyState={emptyState}
        invalidData={invalidData}
        legend={{label: 'Energy series'}}
        series={[
          {
            accessor: 'capacity',
            color: 'series-2',
            id: 'capacity',
            kind: 'column',
            label: 'Capacity',
          },
          {
            accessor: 'demand',
            color: 'series-2',
            id: 'demand',
            kind: 'line',
            label: 'Demand',
          },
        ]}
        title="Explicit shared color"
        xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
        yAxis={{label: 'Energy', scale: {type: 'linear'}}}
      />,
    );

    expect(legendColors()).toEqual(['series-2', 'series-2']);
  });

  it('uses shared feedback semantics for loading, empty, partial, invalid, and error data', () => {
    const shared = {
      dataTableLabel: 'Demand state data',
      description: 'Monthly demand.',
      emptyState,
      invalidData,
      series: [{accessor: 'demand', id: 'demand', label: 'Demand', showPoints: true}],
      title: 'Demand state',
      xAxis: {accessor: 'month', label: 'Month', scale: {type: 'categorical'}},
      yAxis: {label: 'Energy', scale: {type: 'linear'}, unit: 'MWh'},
    } as const;
    const {container, rerender} = render(
      <LineChart {...shared} data={data} status={{kind: 'loading', label: 'Loading demand'}} />,
    );
    expect(screen.getByRole('status').textContent).toBe('Loading demand');
    expect(container.querySelector('[data-wcl-chart-svg]')).toBeNull();

    rerender(<LineChart {...shared} data={[] as readonly (typeof data)[number][]} />);
    expect(container.querySelector('[data-wcl-empty-state][data-kind="no-data"]')).toBeTruthy();

    rerender(
      <LineChart
        {...shared}
        data={data}
        status={{
          description: 'March is provisional.',
          kind: 'partial',
          title: 'Partial demand data',
        }}
      />,
    );
    expect(screen.getByRole('note').textContent).toContain('March is provisional.');
    expect(container.querySelector('[data-wcl-chart-svg]')).toBeTruthy();

    rerender(
      <LineChart
        {...shared}
        data={data}
        xAxis={{
          accessor: 'month',
          label: 'Month',
          scale: {domain: ['Jan', 'Feb'], type: 'categorical'},
        }}
      />,
    );
    expect(screen.getByRole('note').textContent).toContain(invalidData.title);
    expect(container.querySelectorAll('[data-wcl-chart-point]')).toHaveLength(2);

    rerender(
      <LineChart
        {...shared}
        data={[...data, {capacity: 70, demand: Number.NaN, month: 'Apr', recordedAt: new Date(0)}]}
      />,
    );
    expect(screen.getByRole('note').textContent).toContain(invalidData.title);
    expect(container.querySelectorAll('[data-wcl-chart-point]')).toHaveLength(3);

    rerender(
      <LineChart
        {...shared}
        data={data}
        status={{
          description: 'The demand request failed.',
          kind: 'error',
          title: 'Demand unavailable',
        }}
      />,
    );
    expect(screen.getByRole('note').textContent).toContain('The demand request failed.');
    expect(container.querySelector('[data-wcl-chart-svg]')).toBeNull();
  });

  it('keeps responsive policy explicit and server markup deterministic through hydration', () => {
    const specimen = (
      <LineChart
        aspectRatio={1.6}
        data={data}
        dataTableLabel="Hydrated demand data"
        description="Monthly demand."
        emptyState={emptyState}
        invalidData={invalidData}
        minimumSize={{height: 220, width: 360}}
        overflow="scroll"
        series={[{accessor: 'demand', id: 'demand', label: 'Demand'}]}
        title="Hydrated demand"
        xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
        yAxis={{label: 'Energy', scale: {type: 'linear'}, unit: 'MWh'}}
      />
    );
    const markup = renderToString(specimen);
    document.body.innerHTML = `<div id="root">${markup}</div>`;
    const rootElement = document.querySelector('#root')!;
    const frame = rootElement.querySelector('[data-wcl-chart-frame]');

    expect(frame?.getAttribute('data-overflow')).toBe('scroll');
    expect(frame?.getAttribute('style')).toContain('--wcl-chart-aspect-ratio:1.6');
    expect(frame?.getAttribute('style')).toContain('--wcl-chart-minimum-width:360px');
    expect(frame?.getAttribute('style')).toContain('--wcl-chart-minimum-height:220px');
    expect(() => hydrateRoot(rootElement, specimen)).not.toThrow();
  });

  it('preserves a readable default plot width with local scrolling in compact regions', () => {
    const {container} = render(
      <LineChart
        data={data}
        dataTableLabel="Default demand plot data"
        description="Monthly demand."
        emptyState={emptyState}
        invalidData={invalidData}
        series={[{accessor: 'demand', id: 'demand', label: 'Demand'}]}
        title="Default demand plot"
        xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
        yAxis={{label: 'Energy', scale: {type: 'linear'}}}
      />,
    );
    const frame = container.querySelector('[data-wcl-chart-frame]');

    expect(frame?.getAttribute('data-overflow')).toBe('scroll');
    expect((frame as HTMLElement | null)?.style.getPropertyValue('--wcl-chart-minimum-width')).toBe(
      '480px',
    );
  });

  it('rejects ambiguous series identity and incoherent normalized layout configuration', () => {
    const shared = {
      data,
      dataTableLabel: 'Demand validation data',
      description: 'Monthly demand.',
      emptyState,
      invalidData,
      title: 'Demand validation',
      xAxis: {accessor: 'month', label: 'Month', scale: {type: 'categorical'}},
    } as const;

    expect(() =>
      render(
        <LineChart
          {...shared}
          series={[
            {accessor: 'demand', id: 'energy', label: 'Demand'},
            {accessor: 'capacity', id: 'energy', label: 'Capacity'},
          ]}
          yAxis={{label: 'Energy', scale: {type: 'linear'}}}
        />,
      ),
    ).toThrow(/series id.*duplicated/i);

    expect(() =>
      render(
        <LineChart
          {...shared}
          series={[
            {accessor: 'demand', id: 'demand', label: 'Demand'},
            {accessor: 'capacity', id: 'capacity', label: 'Capacity'},
          ]}
          yAxis={{label: 'Energy', scale: {type: 'linear'}}}
        />,
      ),
    ).toThrow(/visible legend/i);

    expect(() =>
      render(
        <AreaChart
          {...shared}
          series={[{accessor: 'demand', id: 'demand', label: 'Demand'}]}
          // @ts-expect-error Area geometry requires a representable zero baseline.
          yAxis={{label: 'Energy', scale: {type: 'logarithmic'}}}
        />,
      ),
    ).toThrow(/representable zero/i);

    expect(() =>
      render(
        <ColumnChart
          {...shared}
          series={[{accessor: 'demand', id: 'demand', label: 'Demand'}]}
          yAxis={{label: 'Energy', scale: {domain: [10, 20], type: 'linear'}}}
        />,
      ),
    ).toThrow(/include.*zero baseline/i);

    const tooManySeries = Array.from({length: 7}, (_, index) => ({
      accessor: 'demand' as const,
      id: `demand-${index}`,
      label: `Demand ${index}`,
    }));
    expect(() =>
      render(
        <LineChart
          {...shared}
          legend={{label: 'Demand series'}}
          // Runtime validation protects untyped JavaScript consumers too.
          series={tooManySeries as never}
          yAxis={{label: 'Energy', scale: {type: 'linear'}}}
        />,
      ),
    ).toThrow(/at most 6 series/i);

    expect(() =>
      render(
        // @ts-expect-error Normalized layouts require normalized value scales.
        <ColumnChart
          {...shared}
          layout="normalized"
          series={[{accessor: 'demand', id: 'demand', label: 'Demand'}]}
          yAxis={{label: 'Share', scale: {type: 'linear'}}}
        />,
      ),
    ).toThrow(/normalized.*scale/i);

    expect(() =>
      render(
        <LineChart
          {...shared}
          series={[{accessor: 'demand', id: 'demand', label: 'Demand'}]}
          xAxis={{
            accessor: 'month',
            label: 'Month',
            scale: {domain: ['Jan', 'Jan'], type: 'categorical'},
          }}
          yAxis={{label: 'Energy', scale: {type: 'linear'}}}
        />,
      ),
    ).toThrow(/duplicate values/i);

    expect(() =>
      render(
        <LineChart
          data={data}
          dataTableLabel="Invalid date domain data"
          description="Invalid dates are rejected before projection."
          emptyState={emptyState}
          invalidData={invalidData}
          series={[{accessor: 'demand', id: 'demand', label: 'Demand'}]}
          title="Invalid date domain"
          xAxis={{
            accessor: 'recordedAt',
            label: 'Recorded',
            scale: {domain: [new Date('invalid'), data[1].recordedAt], type: 'categorical'},
          }}
          yAxis={{label: 'Energy', scale: {type: 'linear'}}}
        />,
      ),
    ).toThrow(/categorical domain.*valid values/i);
  });

  it('keeps dense horizontal bars within each categorical band', () => {
    const denseData = Array.from({length: 10}, (_, index) => ({
      category: `Category ${index + 1}`,
      value: index + 1,
    }));
    const {container} = render(
      <BarChart
        data={denseData}
        dataTableLabel="Dense category values"
        description="Ten categories remain separated."
        emptyState={emptyState}
        invalidData={invalidData}
        series={[{accessor: 'value', id: 'value', label: 'Value'}]}
        title="Dense horizontal values"
        xAxis={{label: 'Value', scale: {type: 'linear'}}}
        yAxis={{accessor: 'category', label: 'Category', scale: {type: 'categorical'}}}
      />,
    );

    const bars = [...container.querySelectorAll('[data-wcl-chart-bar]')]
      .map((bar) => ({
        height: Number(bar.getAttribute('height')),
        y: Number(bar.getAttribute('y')),
      }))
      .sort((left, right) => left.y - right.y);
    expect(bars).toHaveLength(denseData.length);
    expect(bars.every(({height}) => height > 0 && height < 29)).toBe(true);
    expect(new Set(bars.map(({y}) => y)).size).toBe(denseData.length);
    expect(
      bars.slice(0, -1).every((bar, index) => bar.y + bar.height <= (bars[index + 1]?.y ?? 0)),
    ).toBe(true);
    expect(bars[0]?.y).toBeGreaterThanOrEqual(18);
    expect((bars.at(-1)?.y ?? 0) + (bars.at(-1)?.height ?? 0)).toBeLessThanOrEqual(306);
  });
});
