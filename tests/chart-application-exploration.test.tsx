import {cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {BubbleChart, ScatterChart, Toolbar} from '../src/index.js';
afterEach(cleanup);
export const scatterProps = {
  title: 'Energy',
  description: 'Buildings',
  dataTableLabel: 'Buildings data',
  emptyState: {title: 'Empty', description: 'No data'},
  invalidData: {title: 'Invalid', description: 'Invalid data'},
  data: [
    {id: 'a', x: 0, y: 0},
    {id: 'b', x: 10, y: 10},
  ],
  idAccessor: 'id',
  labelAccessor: 'id',
  xAxis: {accessor: 'x', label: 'Area', scale: {type: 'linear', domain: [0, 10]}},
  yAxis: {accessor: 'y', label: 'Energy', scale: {type: 'linear', domain: [0, 10]}},
  series: [{id: 'value', label: 'Value'}],
} as const;
export const labels = {
  overview: 'Overview',
  closeOverview: 'Close',
  done: 'Done',
  reset: 'Fit',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  panLeft: 'Left',
  panRight: 'Right',
  panUp: 'Up',
  panDown: 'Down',
  window: 'Window',
  instructions: 'Adjust the window',
  corner: (c: string) => c,
  range: () => 'Window extent',
};
it('composes one command set in a public toolbar and keeps canvas and button shortcuts', () => {
  const change = vi.fn();
  render(
    <ScatterChart
      {...scatterProps}
      exploration={{
        labels,
        defaultWindow: {x: [2, 8], y: [2, 8]},
        onWindowChange: change,
        renderControls: (controls) => (
          <Toolbar label="Explore">
            {controls.overview}
            {controls.zoomOut}
            {controls.zoomIn}
            {controls.reset}
            {controls.pan}
          </Toolbar>
        ),
      }}
    />,
  );
  const toolbar = screen.getByRole('toolbar', {name: 'Explore'});
  expect(screen.getAllByRole('button', {name: 'Zoom in'})).toHaveLength(1);
  const zoom = within(toolbar).getByRole('button', {name: 'Zoom in'});
  fireEvent.keyDown(zoom, {key: 'ArrowRight'});
  expect(change).toHaveBeenCalledOnce();
  const canvas = screen.getByRole('group', {name: 'Energy'});
  fireEvent.keyDown(canvas, {key: '+'});
  expect(change).toHaveBeenCalledTimes(2);
});
it('shows complete data-edge point marks in an explorable chart', () => {
  const {container} = render(<ScatterChart {...scatterProps} exploration={{labels}} />);
  const marker = container.querySelector('[data-point-id="a"] circle')!;
  const clipped = marker.closest('[clip-path]')!;
  const clipId = clipped.getAttribute('clip-path')!.slice(5, -1);
  const clip = container.querySelector(`[id="${clipId}"] rect`)!;
  expect(Number(clip.getAttribute('x'))).toBeLessThan(
    Number(marker.getAttribute('cx')) - Number(marker.getAttribute('r')),
  );
  expect(Number(clip.getAttribute('y')) + Number(clip.getAttribute('height'))).toBeGreaterThan(
    Number(marker.getAttribute('cy')) + Number(marker.getAttribute('r')),
  );
});

it.each(['scatter', 'bubble'] as const)(
  'keeps selected %s edge marks inside the overview and aligns the full window',
  (kind) => {
    const data = scatterProps.data.map((row) => ({...row, size: row.id === 'a' ? 100 : 25}));
    const selection = {
      labels: {
        instructions: 'Select a building',
        clear: 'Clear selection',
        empty: 'None',
        summary: (count: number) => `${count} selected`,
        item: (item: {rowId: string}) => item.rowId,
        hidden: (label: string) => label,
      },
      defaultSelectedItems: [
        {rowId: 'a', seriesId: 'value'},
        {rowId: 'b', seriesId: 'value'},
      ],
    };
    render(
      kind === 'scatter' ? (
        <ScatterChart
          {...scatterProps}
          data={data}
          interaction={{selection}}
          exploration={{labels}}
        />
      ) : (
        <BubbleChart
          {...scatterProps}
          data={data}
          magnitude={{accessor: 'size', label: 'Size'}}
          interaction={{selection}}
          exploration={{labels}}
        />
      ),
    );
    fireEvent.click(screen.getByRole('button', {name: 'Overview'}));
    const dialog = screen.getByRole('dialog');
    const svg = dialog.querySelector('[data-wcl-statistical-point-overview]')!;
    const [x, y, width, height] = svg.getAttribute('viewBox')!.split(/\s+/).map(Number) as [
      number,
      number,
      number,
      number,
    ];
    const cues = svg.querySelectorAll('[data-wcl-point-cue="selection"]');
    expect(cues).toHaveLength(2);
    for (const cue of cues) {
      const cx = Number(cue.getAttribute('cx')),
        cy = Number(cue.getAttribute('cy')),
        radius = Number(cue.getAttribute('r'));
      expect(cx - radius).toBeGreaterThan(x);
      expect(cx + radius).toBeLessThan(x + width);
      expect(cy - radius).toBeGreaterThan(y);
      expect(cy + radius).toBeLessThan(y + height);
    }
    const window = dialog.querySelector<HTMLElement>('[data-wcl-chart-rectangular-window]')!;
    expect(parseFloat(window.style.left) / 100).toBeCloseTo(-x / width);
    expect(parseFloat(window.style.top) / 100).toBeCloseTo(-y / height);
    expect(parseFloat(window.style.width) / 100).toBeCloseTo((width + 2 * x) / width);
    expect(parseFloat(window.style.height) / 100).toBeCloseTo((height + 2 * y) / height);
  },
);

it('keeps clipping at cropped point-window edges', () => {
  const {container} = render(
    <ScatterChart
      {...scatterProps}
      exploration={{labels, defaultWindow: {x: [0, 5], y: [0, 5]}}}
    />,
  );
  const svg = container.querySelector('[data-wcl-chart-svg]')!;
  const marker = svg.querySelector('[data-point-id="a"] circle')!;
  const clipId = marker.closest('[clip-path]')!.getAttribute('clip-path')!.slice(5, -1);
  const clip = container.querySelector(`[id="${clipId}"] rect`)!;
  const plot = svg.querySelector('[data-wcl-chart-hit-region]')!;
  expect(Number(clip.getAttribute('x')) + Number(clip.getAttribute('width'))).toBeCloseTo(
    Number(plot.getAttribute('x')) + Number(plot.getAttribute('width')),
  );
  expect(Number(clip.getAttribute('y'))).toBeCloseTo(Number(plot.getAttribute('y')));
});

it('keeps a constant-domain overview finite with room for its boundary marker', () => {
  render(
    <ScatterChart
      {...scatterProps}
      data={[{id: 'only', x: 5, y: 5}]}
      xAxis={{accessor: 'x', label: 'X', scale: {type: 'linear'}}}
      yAxis={{accessor: 'y', label: 'Y', scale: {type: 'linear'}}}
      exploration={{labels}}
    />,
  );
  fireEvent.click(screen.getByRole('button', {name: 'Overview'}));
  const svg = screen.getByRole('dialog').querySelector('[data-wcl-statistical-point-overview]')!;
  expect(svg.outerHTML).not.toMatch(/NaN|Infinity/);
  const [x, y, width, height] = svg.getAttribute('viewBox')!.split(/\s+/).map(Number) as [
    number,
    number,
    number,
    number,
  ];
  const marker = svg.querySelector('circle')!;
  expect(Number(marker.getAttribute('cx')) - Number(marker.getAttribute('r'))).toBeGreaterThan(x);
  expect(Number(marker.getAttribute('cy')) + Number(marker.getAttribute('r'))).toBeLessThan(
    y + height,
  );
  expect(width).toBeGreaterThan(0);
});

it('drags the overview window using the padded data rectangle', () => {
  const change =
    vi.fn<(window: {x: readonly [number, number]; y: readonly [number, number]}) => void>();
  render(
    <ScatterChart
      {...scatterProps}
      exploration={{labels, defaultWindow: {x: [2, 8], y: [2, 8]}, onWindowChange: change}}
    />,
  );
  fireEvent.click(screen.getByRole('button', {name: 'Overview'}));
  const dialog = screen.getByRole('dialog');
  const navigator = dialog.querySelector<HTMLElement>('[data-wcl-chart-rectangular-navigator]')!;
  Object.defineProperty(navigator, 'getBoundingClientRect', {
    value: () => new DOMRect(0, 0, 800, 400),
  });
  const svg = dialog.querySelector('[data-wcl-statistical-point-overview]')!;
  const [x, , width] = svg.getAttribute('viewBox')!.split(/\s+/).map(Number) as [
    number,
    number,
    number,
    number,
  ];
  const dx = ((800 * (width + 2 * x)) / width) * 0.1;
  const window = dialog.querySelector('[data-wcl-chart-rectangular-window]')!;
  const event = {
    pointerId: 1,
    pointerType: 'mouse',
    button: 0,
    isPrimary: true,
    clientX: 400,
    clientY: 200,
  };
  fireEvent.pointerDown(window, event);
  fireEvent.pointerMove(navigator, {...event, clientX: 400 + dx});
  fireEvent.pointerUp(navigator, {...event, clientX: 400 + dx});
  expect(change).toHaveBeenCalled();
  expect(change.mock.lastCall![0].x[0]).toBeCloseTo(3);
  expect(change.mock.lastCall![0].x[1]).toBeCloseTo(9);
});

it('reserves room for every selected overview marker shape', () => {
  const data = Array.from({length: 6}, (_, index) => ({
    id: `p${index}`,
    series: `s${index}`,
    x: index % 2 ? 10 : 0,
    y: index % 3 ? 10 : 0,
    size: 100,
  }));
  render(
    <BubbleChart
      {...scatterProps}
      data={data}
      series={[
        {id: 's0', label: 'Circle'},
        {id: 's1', label: 'Diamond'},
        {id: 's2', label: 'Triangle'},
        {id: 's3', label: 'Square'},
        {id: 's4', label: 'Cross'},
        {id: 's5', label: 'Hexagon'},
      ]}
      seriesAccessor="series"
      legend={{label: 'Shapes'}}
      magnitude={{accessor: 'size', label: 'Size'}}
      exploration={{labels}}
      interaction={{
        selection: {
          defaultSelectedItems: data.map((row) => ({rowId: row.id, seriesId: row.series})),
          labels: {
            instructions: 'Select points',
            clear: 'Clear',
            empty: 'None',
            summary: (n) => `${n} selected`,
            item: (item) => item.rowId,
            hidden: (label) => label,
          },
        },
      }}
    />,
  );
  fireEvent.click(screen.getByRole('button', {name: 'Overview'}));
  const svg = screen.getByRole('dialog').querySelector('[data-wcl-statistical-point-overview]')!;
  const [left, top, width, height] = svg.getAttribute('viewBox')!.split(/\s+/).map(Number) as [
    number,
    number,
    number,
    number,
  ];
  const cues = svg.querySelectorAll('[data-wcl-point-cue="selection"]');
  expect(cues).toHaveLength(6);
  for (const cue of cues) {
    const coordinates: Array<[number, number]> = [];
    if (cue.tagName === 'circle') {
      const x = Number(cue.getAttribute('cx')),
        y = Number(cue.getAttribute('cy')),
        r = Number(cue.getAttribute('r'));
      coordinates.push([x - r, y - r], [x + r, y + r]);
    } else if (cue.tagName === 'rect') {
      const x = Number(cue.getAttribute('x')),
        y = Number(cue.getAttribute('y')),
        w = Number(cue.getAttribute('width')),
        h = Number(cue.getAttribute('height'));
      const radius = cue.hasAttribute('transform') ? w / Math.SQRT2 : w / 2;
      coordinates.push(
        [x + w / 2 - radius, y + h / 2 - radius],
        [x + w / 2 + radius, y + h / 2 + radius],
      );
    } else {
      const tokens = cue.getAttribute('d')!.match(/[A-Z]|-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi)!;
      let x = 0,
        y = 0;
      for (let index = 0; index < tokens.length;) {
        const command = tokens[index++];
        if (command === 'M' || command === 'L') {
          x = Number(tokens[index++]);
          y = Number(tokens[index++]);
        } else if (command === 'H') x = Number(tokens[index++]);
        else if (command === 'V') y = Number(tokens[index++]);
        else if (command === 'Z') continue;
        coordinates.push([x, y]);
      }
    }
    for (const [x, y] of coordinates) {
      expect(x).toBeGreaterThan(left);
      expect(x).toBeLessThan(left + width);
      expect(y).toBeGreaterThan(top);
      expect(y).toBeLessThan(top + height);
    }
  }
});

it.each([
  ['scatter', 1],
  ['scatter', 2.4],
  ['scatter', 3],
  ['bubble', 1],
  ['bubble', 2.4],
  ['bubble', 3],
] as const)(
  'keeps complete %s marks inside the axes at full extent with aspect ratio %s',
  (kind, aspectRatio) => {
    const data = scatterProps.data.map((row) => ({...row, size: row.id === 'a' ? 100 : 25}));
    const {container} = render(
      kind === 'scatter' ? (
        <ScatterChart
          {...scatterProps}
          data={data}
          aspectRatio={aspectRatio}
          exploration={{labels}}
        />
      ) : (
        <BubbleChart
          {...scatterProps}
          data={data}
          aspectRatio={aspectRatio}
          magnitude={{accessor: 'size', label: 'Size'}}
          exploration={{labels}}
        />
      ),
    );
    const hit = container.querySelector('[data-wcl-chart-hit-region]')!;
    const left = Number(hit.getAttribute('x'));
    const top = Number(hit.getAttribute('y'));
    const right = left + Number(hit.getAttribute('width'));
    const bottom = top + Number(hit.getAttribute('height'));
    const marks = container.querySelectorAll('[data-point-id] circle');
    if (kind === 'bubble') {
      expect(Number(marks[0]!.getAttribute('r')) / Number(marks[1]!.getAttribute('r'))).toBeCloseTo(
        2,
      );
    }
    for (const mark of marks) {
      const x = Number(mark.getAttribute('cx'));
      const y = Number(mark.getAttribute('cy'));
      const radius = Number(mark.getAttribute('r'));
      expect(x - radius).toBeGreaterThan(left);
      expect(x + radius).toBeLessThan(right);
      expect(y - radius).toBeGreaterThan(top);
      expect(y + radius).toBeLessThan(bottom);
    }
  },
);

it('keeps boundary marks aligned with their numeric axis ticks after insetting', () => {
  const {container} = render(
    <ScatterChart {...scatterProps} aspectRatio={3} exploration={{labels}} />,
  );
  for (const [id, value] of [
    ['a', '0'],
    ['b', '10'],
  ] as const) {
    const mark = container.querySelector(`[data-point-id="${id}"] circle`)!;
    for (const axis of ['x', 'y'] as const) {
      const tick = Array.from(
        container.querySelectorAll(`[data-axis="${axis}"] [data-wcl-chart-tick]`),
      ).find((element) => element.querySelector('text')?.textContent === value)!;
      expect(Number(mark.getAttribute(axis === 'x' ? 'cx' : 'cy'))).toBeCloseTo(
        Number(
          tick
            .querySelector('[data-wcl-chart-tick-mark]')!
            .getAttribute(axis === 'x' ? 'x1' : 'y1'),
        ),
      );
    }
  }
});

it('keeps touch coordinates stable when zooming away from a full-domain edge', () => {
  const change =
    vi.fn<(window: {x: readonly [number, number]; y: readonly [number, number]}) => void>();
  const {container} = render(
    <ScatterChart {...scatterProps} exploration={{labels, onWindowChange: change}} />,
  );
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  Object.defineProperty(svg, 'getBoundingClientRect', {value: () => new DOMRect(0, 0, 640, 360)});
  const touch = {pointerType: 'touch', button: 0, clientY: 150};
  fireEvent.pointerDown(svg, {...touch, clientX: 250, pointerId: 1, isPrimary: true});
  fireEvent.pointerDown(svg, {...touch, clientX: 350, pointerId: 2, isPrimary: false});
  const moved = {...touch, clientX: 400, pointerId: 2};
  fireEvent.pointerMove(svg, moved);
  const window = change.mock.lastCall![0];
  expect(window.x[0]).toBeGreaterThan(0);
  expect(window.x[1]).toBeLessThan(10);
  fireEvent.pointerMove(svg, moved);
  expect(change.mock.lastCall![0]).toEqual(window);
});
