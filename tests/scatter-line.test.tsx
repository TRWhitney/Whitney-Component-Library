import {act, cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {ScatterChart} from '../src/index.js';

afterEach(cleanup);
const observations = [{id: 'observation', label: 'Observed', x: 25, y: 40}];
const samples = [
  {key: 'first', name: 'Target one', temperature: 10, energy: 20},
  {key: 'second', name: 'Target two', temperature: 90, energy: 80},
];
const common = {
  data: observations,
  idAccessor: 'id',
  labelAccessor: 'label',
  series: [{id: 'observed', label: 'Observations'}],
  legend: {label: 'Series'},
  title: 'Energy',
  description: 'Observed and supplied energy',
  dataTableLabel: 'Values',
  emptyState: {title: 'Empty', description: 'No data'},
  invalidData: {title: 'Invalid', description: 'Check data'},
  xAxis: {accessor: 'x', label: 'Temperature', scale: {type: 'linear', domain: [0, 100]}},
  yAxis: {accessor: 'y', label: 'Energy', scale: {type: 'linear', domain: [0, 100]}},
} as const;
it('reads separate supplied samples and routes their activation to the line callback', () => {
  const onActivate = vi.fn(),
    onObservation = vi.fn();
  const line = {
    id: 'target',
    label: 'Target',
    data: samples,
    idAccessor: 'key',
    labelAccessor: 'name',
    xAccessor: 'temperature',
    yAccessor: 'energy',
    onActivate,
  } as const;
  const {container} = render(
    <ScatterChart {...common} line={line} interaction={{onActivate: onObservation}} />,
  );
  expect(screen.getByRole('button', {name: 'Target'})).toBeTruthy();
  expect(within(screen.getByRole('table', {name: 'Values'})).getByText('Target two')).toBeTruthy();
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  Object.defineProperty(svg, 'getBoundingClientRect', {value: () => new DOMRect(0, 0, 640, 360)});
  const mark = container.querySelector('[data-point-id="second"] circle')!;
  const at = {
    clientX: Number(mark.getAttribute('cx')),
    clientY: Number(mark.getAttribute('cy')),
    pointerId: 1,
    pointerType: 'mouse',
    isPrimary: true,
    button: 0,
  };
  fireEvent.pointerDown(svg, at);
  fireEvent.pointerUp(svg, at);
  expect(onActivate).toHaveBeenCalledWith({
    item: {rowId: 'second', seriesId: 'target'},
    datum: samples[1],
    label: 'Target two',
    x: 90,
    y: 80,
    input: 'pointer',
  });
  expect(onObservation).not.toHaveBeenCalled();
});

it('activates a supplied sample when clicking the connecting segment', () => {
  const onActivate = vi.fn();
  const {container} = render(
    <ScatterChart
      {...common}
      line={{
        id: 'target',
        label: 'Target',
        data: samples,
        idAccessor: 'key',
        labelAccessor: 'name',
        xAccessor: 'temperature',
        yAccessor: 'energy',
        onActivate,
      }}
    />,
  );
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  Object.defineProperty(svg, 'getBoundingClientRect', {value: () => new DOMRect(0, 0, 640, 360)});
  const a = container.querySelector('[data-point-id="first"] circle')!;
  const b = container.querySelector('[data-point-id="second"] circle')!;
  const at = {
    clientX: Number(a.getAttribute('cx')) * 0.25 + Number(b.getAttribute('cx')) * 0.75,
    clientY: Number(a.getAttribute('cy')) * 0.25 + Number(b.getAttribute('cy')) * 0.75,
    pointerId: 1,
    pointerType: 'mouse',
    isPrimary: true,
    button: 0,
  };
  fireEvent.pointerDown(svg, at);
  fireEvent.pointerUp(svg, at);
  expect(onActivate).toHaveBeenCalledWith(
    expect.objectContaining({datum: samples[1], item: {rowId: 'second', seriesId: 'target'}}),
  );
});

const selectionLabels = {
  instructions: 'Select samples',
  clear: 'Clear selection',
  empty: 'None',
  summary: (n: number) => `${n} selected`,
  item: (i: {rowId: string; seriesId?: string}) => `${i.rowId} ${i.seriesId}`,
  hidden: (s: string) => `${s} hidden`,
};
const visibilityLabels = {
  hidden: 'Hidden',
  hideSeries: (s: string) => `Hide ${s}`,
  showSeries: (s: string) => `Show ${s}`,
  showAll: 'Show all',
  allHidden: {title: 'All hidden', description: 'Restore a series'},
};
const navigationLabels = {
  overview: 'Overview',
  closeOverview: 'Close overview',
  done: 'Done',
  reset: 'Reset view',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  panLeft: 'Left',
  panRight: 'Right',
  panUp: 'Up',
  panDown: 'Down',
  window: 'Visible area',
  instructions: 'Drag the area or a corner',
  corner: (c: string) => `Resize ${c}`,
  range: (r: {x: readonly [number, number]; y: readonly [number, number]}) => JSON.stringify(r),
};
const suppliedLine = {
  id: 'target',
  label: 'Target',
  data: samples,
  idAccessor: 'key',
  labelAccessor: 'name',
  xAccessor: 'temperature',
  yAccessor: 'energy',
} as const;
function pointer(container: HTMLElement, id: string, seriesId = 'target') {
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  Object.defineProperty(svg, 'getBoundingClientRect', {
    configurable: true,
    value: () => new DOMRect(0, 0, 640, 360),
  });
  const mark = container.querySelector(
    `[data-point-id="${id}"][data-series-id="${seriesId}"] circle`,
  )!;
  return {
    svg,
    at: {
      clientX: Number(mark.getAttribute('cx')),
      clientY: Number(mark.getAttribute('cy')),
      pointerId: 1,
      pointerType: 'mouse',
      isPrimary: true,
      button: 0,
    },
  };
}
it('keeps equal IDs from different datasets distinct through selection and data updates', () => {
  const onActivate = vi.fn(),
    onObservation = vi.fn(),
    onSelectionChange = vi.fn();
  const line = {...suppliedLine, data: [{...samples[1]!, key: 'observation'}], onActivate};
  const interaction = {
    onActivate: onObservation,
    selection: {labels: selectionLabels, onSelectionChange},
  };
  const {container, rerender} = render(
    <ScatterChart {...common} line={line} interaction={interaction} />,
  );
  const {svg, at} = pointer(container, 'observation');
  fireEvent.pointerDown(svg, at);
  fireEvent.pointerUp(svg, at);
  expect(onSelectionChange).toHaveBeenLastCalledWith([{rowId: 'observation', seriesId: 'target'}]);
  expect(container.querySelectorAll('[data-wcl-point-cue="selection"]')).toHaveLength(1);
  const next = {...line.data[0]!, energy: 65};
  rerender(<ScatterChart {...common} line={{...line, data: [next]}} interaction={interaction} />);
  const moved = pointer(container, 'observation');
  fireEvent.pointerDown(moved.svg, {...moved.at, ctrlKey: true});
  fireEvent.pointerUp(moved.svg, {...moved.at, ctrlKey: true});
  expect(onActivate).toHaveBeenLastCalledWith(
    expect.objectContaining({datum: next, y: 65, item: {rowId: 'observation', seriesId: 'target'}}),
  );
  expect(onObservation).not.toHaveBeenCalled();
  expect(container.querySelectorAll('[data-wcl-point-cue="selection"]')).toHaveLength(1);
});
it('leaves gaps in the supplied order and rejects duplicate sample IDs', () => {
  const data = [
    samples[1]!,
    samples[0]!,
    {key: 'missing', name: 'Missing', temperature: 50, energy: NaN},
    {...samples[0]!, key: 'last'},
  ];
  const {container} = render(<ScatterChart {...common} line={{...suppliedLine, data}} />);
  const path = container.querySelector('[data-wcl-chart-line]')!.getAttribute('d')!;
  expect(path.match(/M/g)).toHaveLength(2);
  const first = pointer(container, 'second').at;
  expect(
    path.startsWith(
      `M${Math.round(first.clientX * 1000) / 1000},${Math.round(first.clientY * 1000) / 1000}`,
    ),
  ).toBe(true);
  expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(5);
  expect(() =>
    render(<ScatterChart {...common} line={{...suppliedLine, data: [samples[0]!, samples[0]!]}} />),
  ).toThrow(/duplicated/);
});
it('keeps cross-edge segments in the plot, and hides the line in both plot and overview while preserving its table and selection', () => {
  const {container} = render(
    <ScatterChart
      {...common}
      line={suppliedLine}
      visibilityLabels={visibilityLabels}
      exploration={{labels: navigationLabels, defaultWindow: {x: [30, 70], y: [30, 70]}}}
      interaction={{
        selection: {
          labels: selectionLabels,
          defaultSelectedItems: [{rowId: 'first', seriesId: 'target'}],
        },
      }}
    />,
  );
  expect(container.querySelector('[data-wcl-chart-line]')!.getAttribute('d')).toContain('L');
  expect(
    screen.getByRole('button', {name: 'Up'}).closest('[data-wcl-chart-exploration-vertical-pan]'),
  ).not.toBeNull();
  fireEvent.click(screen.getByRole('button', {name: 'Overview'}));
  const dialog = screen.getByRole('dialog');
  expect(dialog.querySelector('[data-wcl-chart-line]')).not.toBeNull();
  fireEvent.click(within(dialog).getByRole('button', {name: 'Done'}));
  fireEvent.click(screen.getByRole('button', {name: 'Hide Target'}));
  expect(container.querySelector('[data-wcl-chart-line]')).toBeNull();
  expect(
    within(screen.getByRole('table')).getByRole('row', {name: /Target one Target Hidden/}),
  ).toBeTruthy();
  expect(container.querySelector('[data-wcl-chart-selection]')!.textContent).toContain(
    'first target hidden',
  );
  fireEvent.click(screen.getByRole('button', {name: 'Overview'}));
  expect(screen.getByRole('dialog').querySelector('[data-wcl-chart-line]')).toBeNull();
});
it('prioritizes the focused line only where its segment overlaps an observation', () => {
  const data = [
    {id: 'on', label: 'On the target', x: 50, y: 50},
    {id: 'off', label: 'Away from target', x: 30, y: 80},
  ];
  const onObservation = vi.fn(),
    onActivate = vi.fn();
  const {container} = render(
    <ScatterChart
      {...common}
      data={data}
      line={{...suppliedLine, onActivate}}
      interaction={{onActivate: onObservation}}
    />,
  );
  fireEvent.click(screen.getByRole('button', {name: 'Target'}));
  const on = pointer(container, 'on', 'observed');
  fireEvent.pointerDown(on.svg, on.at);
  fireEvent.pointerUp(on.svg, on.at);
  expect(onActivate).toHaveBeenCalledTimes(1);
  const off = pointer(container, 'off', 'observed');
  fireEvent.pointerDown(off.svg, off.at);
  fireEvent.pointerUp(off.svg, off.at);
  expect(onObservation).toHaveBeenCalledWith(expect.objectContaining({datum: data[1]}));
  expect(onActivate).toHaveBeenCalledTimes(1);
});
it('previews replacing selection using only sample centers inside the drag rectangle', () => {
  const onSelectionChange = vi.fn();
  const {container} = render(
    <ScatterChart
      {...common}
      line={suppliedLine}
      interaction={{
        selection: {
          labels: selectionLabels,
          onSelectionChange,
          defaultSelectedItems: [{rowId: 'first', seriesId: 'target'}],
        },
      }}
    />,
  );
  const {svg, at} = pointer(container, 'second');
  fireEvent.pointerDown(svg, {...at, clientX: at.clientX - 12, clientY: at.clientY - 12});
  fireEvent.pointerMove(svg, {...at, clientX: at.clientX + 12, clientY: at.clientY + 12});
  expect(container.querySelector('[data-wcl-chart-selection-box]')).not.toBeNull();
  expect(container.querySelectorAll('[data-wcl-point-cue="selection"]')).toHaveLength(1);
  fireEvent.pointerUp(svg, {...at, clientX: at.clientX + 12, clientY: at.clientY + 12});
  expect(onSelectionChange).toHaveBeenLastCalledWith([{rowId: 'second', seriesId: 'target'}]);
});

it('keeps coincident supplied samples individually reachable by keyboard', () => {
  const onActivate = vi.fn();
  const same = [
    {...samples[0]!, key: 'same-a'},
    {...samples[0]!, key: 'same-b'},
  ];
  const {container} = render(
    <ScatterChart
      {...common}
      line={{...suppliedLine, data: same, onActivate}}
      interaction={{selection: {labels: selectionLabels}}}
    />,
  );
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'End'});
  fireEvent.keyDown(canvas, {key: 'Enter', ctrlKey: true});
  expect(onActivate).toHaveBeenLastCalledWith(
    expect.objectContaining({datum: same[1], item: {rowId: 'same-b', seriesId: 'target'}}),
  );
  fireEvent.keyDown(canvas, {key: 'ArrowLeft'});
  fireEvent.keyDown(canvas, {key: 'Enter', ctrlKey: true});
  expect(onActivate).toHaveBeenLastCalledWith(
    expect.objectContaining({datum: same[0], item: {rowId: 'same-a', seriesId: 'target'}}),
  );
});

it('only pulses items that have their own activation callback', () => {
  const onActivate = vi.fn();
  const {container, rerender} = render(
    <ScatterChart {...common} line={{...suppliedLine, onActivate}} />,
  );
  const observation = pointer(container, 'observation', 'observed');
  fireEvent.pointerDown(observation.svg, observation.at);
  fireEvent.pointerUp(observation.svg, observation.at);
  expect(container.querySelectorAll('[data-wcl-chart-activation-outline]')).toHaveLength(0);
  expect(onActivate).not.toHaveBeenCalled();
  rerender(<ScatterChart {...common} line={suppliedLine} interaction={{onActivate}} />);
  const sample = pointer(container, 'second');
  fireEvent.pointerDown(sample.svg, sample.at);
  fireEvent.pointerUp(sample.svg, sample.at);
  expect(container.querySelectorAll('[data-wcl-chart-activation-outline]')).toHaveLength(0);
  expect(onActivate).not.toHaveBeenCalled();
});

it('reserves the explicitly colored supplied line before assigning observation colors', () => {
  const {container} = render(
    <ScatterChart {...common} line={{...suppliedLine, color: 'accent'}} />,
  );
  expect(container.querySelector('[data-point-id="observation"]')!.getAttribute('data-color')).toBe(
    'series-2',
  );
  expect(container.querySelector('[data-point-id="first"]')!.getAttribute('data-color')).toBe(
    'accent',
  );
});
it('stagger-fits compact numeric labels beside the vertical pan controls', () => {
  const {container} = render(
    <ScatterChart
      {...common}
      line={suppliedLine}
      minimumSize={{width: 308, height: 180}}
      exploration={{labels: navigationLabels}}
    />,
  );
  const ticks = [...container.querySelectorAll('[data-axis="x"] [data-wcl-chart-tick] text')];
  expect(new Set(ticks.map((tick) => tick.getAttribute('y'))).size).toBe(2);
});
it('keeps crossing segments visible without activating samples outside the viewport', () => {
  const onActivate = vi.fn();
  const {container} = render(
    <ScatterChart
      {...common}
      data={observations.slice(0, 0)}
      line={{...suppliedLine, onActivate}}
      exploration={{labels: navigationLabels, defaultWindow: {x: [30, 70], y: [30, 70]}}}
    />,
  );
  const {svg} = pointer(container, 'first');
  const hit = container.querySelector('[data-wcl-chart-hit-region]')!;
  const at = {
    clientX: Number(hit.getAttribute('x')) + Number(hit.getAttribute('width')) / 2,
    clientY: Number(hit.getAttribute('y')) + Number(hit.getAttribute('height')) / 2,
    pointerId: 1,
    pointerType: 'mouse',
    isPrimary: true,
    button: 0,
  };
  fireEvent.pointerDown(svg, at);
  fireEvent.pointerUp(svg, at);
  expect(onActivate).not.toHaveBeenCalled();
});
it.each(['observation', 'target'] as const)(
  'preserves selection-only touch holding on %s when only the other dataset activates',
  (target) => {
    vi.useFakeTimers();
    try {
      const onActivate = vi.fn(),
        onSelectionChange = vi.fn();
      const {container} = render(
        <ScatterChart
          {...common}
          line={{...suppliedLine, ...(target === 'observation' ? {onActivate} : {})}}
          interaction={{
            ...(target === 'target' ? {onActivate} : {}),
            selection: {labels: selectionLabels, onSelectionChange},
          }}
        />,
      );
      const id = target === 'observation' ? 'observation' : 'first',
        series = target === 'observation' ? 'observed' : 'target';
      const {svg, at} = pointer(container, id, series);
      fireEvent.pointerDown(svg, {...at, pointerType: 'touch'});
      act(() => {
        vi.advanceTimersByTime(550);
      });
      fireEvent.pointerUp(svg, {...at, pointerType: 'touch'});
      expect(onActivate).not.toHaveBeenCalled();
      expect(onSelectionChange).toHaveBeenLastCalledWith([{rowId: id, seriesId: series}]);
    } finally {
      vi.useRealTimers();
    }
  },
);
it('cancels a pending hold when the line source is replaced with equal coordinates', () => {
  vi.useFakeTimers();
  try {
    const onActivate = vi.fn();
    const props = {...common, interaction: {selection: {labels: selectionLabels}}};
    const {container, rerender} = render(
      <ScatterChart {...props} line={{...suppliedLine, onActivate}} />,
    );
    const {svg, at} = pointer(container, 'first');
    fireEvent.pointerDown(svg, {...at, pointerType: 'touch'});
    rerender(
      <ScatterChart
        {...props}
        line={{...suppliedLine, data: samples.map((sample) => ({...sample})), onActivate}}
      />,
    );
    act(() => {
      vi.advanceTimersByTime(550);
    });
    fireEvent.pointerUp(svg, {...at, pointerType: 'touch'});
    expect(onActivate).not.toHaveBeenCalled();
    expect(container.querySelectorAll('[data-wcl-point-cue="selection"]')).toHaveLength(0);
  } finally {
    vi.useRealTimers();
  }
});
it('cancels a drag preview when the line source is replaced with equal coordinates', () => {
  const onSelectionChange = vi.fn();
  const props = {...common, interaction: {selection: {labels: selectionLabels, onSelectionChange}}};
  const {container, rerender} = render(<ScatterChart {...props} line={suppliedLine} />);
  const {svg, at} = pointer(container, 'first');
  fireEvent.pointerDown(svg, {...at, clientX: at.clientX - 6, clientY: at.clientY - 6});
  fireEvent.pointerMove(svg, {...at, clientX: at.clientX + 6, clientY: at.clientY + 6});
  expect(container.querySelector('[data-wcl-chart-selection-box]')).not.toBeNull();
  rerender(
    <ScatterChart
      {...props}
      line={{...suppliedLine, data: samples.map((sample) => ({...sample}))}}
    />,
  );
  expect(container.querySelector('[data-wcl-chart-selection-box]')).toBeNull();
  fireEvent.pointerUp(svg, at);
  expect(onSelectionChange).not.toHaveBeenCalled();
});
it('keeps composite selection overlays stable when equal row IDs are reordered', () => {
  const shared = observations[0]!,
    other = {...shared, id: 'other', label: 'Other', x: 50};
  const selected = [
    {rowId: shared.id, seriesId: 'observed'},
    {rowId: shared.id, seriesId: 'target'},
  ];
  const line = {...suppliedLine, data: [{...samples[0]!, key: shared.id}]};
  const interaction = {selection: {labels: selectionLabels, defaultSelectedItems: selected}};
  const error = vi.spyOn(console, 'error').mockImplementation(() => {});
  try {
    const {container, rerender} = render(
      <ScatterChart {...common} data={[shared, other]} line={line} interaction={interaction} />,
    );
    rerender(
      <ScatterChart {...common} data={[other, shared]} line={line} interaction={interaction} />,
    );
    expect(container.querySelectorAll('[data-wcl-point-cue="selection"]')).toHaveLength(2);
    expect(error).not.toHaveBeenCalled();
  } finally {
    error.mockRestore();
  }
});
it('does not activate an offscreen line center through the clipped edge of its marker', () => {
  const onActivate = vi.fn();
  const {container} = render(
    <ScatterChart
      {...common}
      data={observations.slice(0, 0)}
      line={{...suppliedLine, data: [{...samples[0]!, temperature: 29.9, energy: 50}], onActivate}}
      exploration={{labels: navigationLabels, defaultWindow: {x: [30, 70], y: [30, 70]}}}
    />,
  );
  const {svg, at} = pointer(container, 'first');
  const hit = container.querySelector('[data-wcl-chart-hit-region]')!;
  const edge = {...at, clientX: Number(hit.getAttribute('x')) + 0.2};
  fireEvent.pointerDown(svg, edge);
  fireEvent.pointerUp(svg, edge);
  expect(onActivate).not.toHaveBeenCalled();
});
it('cancels two-finger navigation when the line source is replaced', () => {
  const onWindowChange = vi.fn();
  const props = {
    ...common,
    exploration: {
      labels: navigationLabels,
      defaultWindow: {x: [20, 80] as const, y: [20, 80] as const},
      onWindowChange,
    },
  };
  const {container, rerender} = render(<ScatterChart {...props} line={suppliedLine} />);
  const {svg} = pointer(container, 'first');
  const hit = container.querySelector('[data-wcl-chart-hit-region]')!;
  const x = Number(hit.getAttribute('x')) + Number(hit.getAttribute('width')) / 2;
  const y = Number(hit.getAttribute('y')) + Number(hit.getAttribute('height')) / 2;
  const touch = {pointerType: 'touch', button: 0, clientY: y};
  fireEvent.pointerDown(svg, {...touch, pointerId: 1, clientX: x - 25, isPrimary: true});
  fireEvent.pointerDown(svg, {...touch, pointerId: 2, clientX: x + 25, isPrimary: false});
  fireEvent.pointerMove(svg, {...touch, pointerId: 1, clientX: x - 35});
  expect(onWindowChange).toHaveBeenCalled();
  rerender(
    <ScatterChart
      {...props}
      line={{...suppliedLine, data: samples.map((sample) => ({...sample}))}}
    />,
  );
  onWindowChange.mockClear();
  fireEvent.pointerMove(svg, {...touch, pointerId: 2, clientX: x + 45});
  expect(onWindowChange).not.toHaveBeenCalled();
});
