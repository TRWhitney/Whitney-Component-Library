import {useEffect, useRef, useState, type CSSProperties} from 'react';
import {createRoot} from 'react-dom/client';

import {
  AppearanceProvider,
  LineChart,
  SegmentedControl,
  ToggleButton,
  type Appearance,
} from '../../../../src/index.js';
import '../../../../src/styles.css';
import './styles.css';

const completeData = [
  {capacity: 58, demand: 42, month: 'Jan'},
  {capacity: 64, demand: 51, month: 'Feb'},
  {capacity: 68, demand: 61, month: 'Mar'},
  {capacity: 72, demand: 57, month: 'Apr'},
  {capacity: 76, demand: 66, month: 'May'},
  {capacity: 79, demand: 70, month: 'Jun'},
  {capacity: 83, demand: 74, month: 'Jul'},
  {capacity: 86, demand: 72, month: 'Aug'},
  {capacity: 88, demand: 77, month: 'Sep'},
  {capacity: 91, demand: 82, month: 'Oct'},
  {capacity: 94, demand: 85, month: 'Nov'},
  {capacity: 98, demand: 89, month: 'Dec'},
  {capacity: 101, demand: 93, month: 'Jan 27'},
  {capacity: 104, demand: 96, month: 'Feb 27'},
  {capacity: 108, demand: 99, month: 'Mar 27'},
  {capacity: 112, demand: 103, month: 'Apr 27'},
] as const;

const appearanceOptions = [
  {label: 'Dark', value: 'dark'},
  {label: 'Light', value: 'light'},
] as const;
const densityOptions = [
  {label: '4 categories', value: '4'},
  {label: '8 categories', value: '8'},
  {label: '16 categories', value: '16'},
] as const;
const sizingOptions = [
  {label: 'Content-aware', value: 'adaptive'},
  {label: 'Current hybrid', value: 'current'},
] as const;

type Density = (typeof densityOptions)[number]['value'];
type SizingMode = (typeof sizingOptions)[number]['value'];

interface PresentationMetrics {
  readonly canvasWidth: number;
  readonly fontSize: number;
  readonly hitWidth: number;
  readonly lineWidth: number;
  readonly pointRadius: number;
  readonly scrolls: boolean;
  readonly staggerLabels: boolean;
  readonly svgFontSize: number;
  readonly svgPointRadius: number;
}

type PrototypeStyles = CSSProperties & {
  '--prototype-chart-font-size': string;
  '--prototype-chart-line-width': string;
  '--prototype-chart-point-radius': string;
};

const chartStateCopy = {
  emptyState: {description: 'Choose a period with recorded energy.', title: 'No energy data'},
  invalidData: {
    description: 'Correct records with missing or non-finite energy values.',
    title: 'Some energy data is invalid',
  },
} as const;

function clamp(minimum: number, value: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function estimatedLabelWidth(label: string, fontSize: number): number {
  return label.length * fontSize * 0.62;
}

function adaptiveMetrics(availableWidth: number, labels: readonly string[]): PresentationMetrics {
  const fontSize = clamp(14, (availableWidth / 640) * 16, 18);
  const lineWidth = clamp(2, (availableWidth / 640) * 2.5, 3.25);
  const pointRadius = clamp(3.25, (availableWidth / 640) * 4, 5);
  const labelWidths = labels.map((label) => estimatedLabelWidth(label, fontSize));
  const maximumLabelWidth = Math.max(...labelWidths, 0);
  const edgePadding = Math.max(
    (labelWidths[0] ?? 0) / 2,
    (labelWidths[labelWidths.length - 1] ?? 0) / 2,
  );
  const intervals = Math.max(0, labels.length - 1);
  const fixedPlotSpace = 104 + edgePadding * 2;
  const singleRowWidth = fixedPlotSpace + intervals * (maximumLabelWidth + 12);
  const staggerLabels = singleRowWidth > availableWidth;
  const minimumCanvasWidth =
    fixedPlotSpace +
    intervals * (staggerLabels ? maximumLabelWidth / 2 + 12 : maximumLabelWidth + 12);
  const canvasWidth = Math.max(availableWidth, minimumCanvasWidth);
  const viewScale = canvasWidth / 640;
  return {
    canvasWidth,
    fontSize,
    hitWidth: lineWidth * 3,
    lineWidth,
    pointRadius,
    scrolls: canvasWidth > availableWidth,
    staggerLabels,
    svgFontSize: fontSize / viewScale,
    svgPointRadius: pointRadius / viewScale,
  };
}

function currentMetrics(availableWidth: number): PresentationMetrics {
  const canvasWidth = Math.max(480, availableWidth);
  return {
    canvasWidth,
    fontSize: 0,
    hitWidth: 2.5,
    lineWidth: 2.5,
    pointRadius: 0,
    scrolls: canvasWidth > availableWidth,
    staggerLabels: false,
    svgFontSize: 0,
    svgPointRadius: 0,
  };
}

function ResponsiveChartSizingPrototype() {
  const chartShellRef = useRef<HTMLDivElement>(null);
  const [appearance, setAppearance] = useState<Appearance>('dark');
  const [availableWidth, setAvailableWidth] = useState(560);
  const [density, setDensity] = useState<Density>('4');
  const [identifyRegions, setIdentifyRegions] = useState(false);
  const [sizingMode, setSizingMode] = useState<SizingMode>('adaptive');
  const data = completeData.slice(0, Number(density));
  const labels = data.map((row) => row.month);
  const metrics =
    sizingMode === 'adaptive'
      ? adaptiveMetrics(availableWidth, labels)
      : currentMetrics(availableWidth);
  const styles: PrototypeStyles = {
    '--prototype-chart-font-size': `${metrics.svgFontSize}px`,
    '--prototype-chart-line-width': `${metrics.lineWidth}px`,
    '--prototype-chart-point-radius': `${metrics.svgPointRadius}px`,
  };

  useEffect(() => {
    if (sizingMode !== 'adaptive') return;
    const paths = chartShellRef.current?.querySelectorAll<SVGPathElement>('[data-wcl-chart-line]');
    if (paths === undefined) return;
    const hitTargets = [...paths].map((path) => {
      const hitTarget = path.cloneNode(false) as SVGPathElement;
      hitTarget.removeAttribute('data-wcl-chart-line');
      hitTarget.setAttribute('data-prototype-line-hit-target', '');
      hitTarget.setAttribute('stroke-width', String(metrics.hitWidth));
      path.parentNode?.insertBefore(hitTarget, path);
      return hitTarget;
    });
    return () => hitTargets.forEach((target) => target.remove());
  }, [data.length, metrics.hitWidth, sizingMode]);

  return (
    <AppearanceProvider accent="#2878ff" appearance={appearance}>
      <main className="prototype-page" data-identify={identifyRegions ? '' : undefined}>
        <header className="prototype-header">
          <div>
            <p className="prototype-kicker">Decision prototype</p>
            <h1>Responsive chart sizing</h1>
            <p>
              The production LineChart owns reading, tooltips, annotations, colors, and legend
              behavior. This prototype changes only sizing, categorical label layout, overflow, and
              line hit tolerance.
            </p>
          </div>
          <ToggleButton isSelected={identifyRegions} onChange={setIdentifyRegions}>
            Identify regions
          </ToggleButton>
        </header>

        <section
          aria-label="Prototype controls"
          className="prototype-controls"
          data-region="controls"
        >
          <label>
            <span>Available width</span>
            <output>{availableWidth}px</output>
            <input
              max="1080"
              min="320"
              onChange={(event) => setAvailableWidth(Number(event.currentTarget.value))}
              step="20"
              type="range"
              value={availableWidth}
            />
          </label>
          <SegmentedControl
            label="Sizing model"
            onChange={(value) => setSizingMode(value as SizingMode)}
            options={sizingOptions}
            value={sizingMode}
          />
          <SegmentedControl
            label="Category density"
            onChange={(value) => setDensity(value as Density)}
            options={densityOptions}
            value={density}
          />
          <SegmentedControl
            label="Appearance"
            onChange={(value) => setAppearance(value as Appearance)}
            options={appearanceOptions}
            value={appearance}
          />
        </section>

        <section
          className="prototype-available-region"
          data-region="available-region"
          style={{inlineSize: `${availableWidth}px`}}
        >
          <div
            className="prototype-chart-shell"
            data-prototype-sizing={sizingMode}
            data-prototype-stagger={metrics.staggerLabels ? '' : undefined}
            data-region="chart"
            ref={chartShellRef}
            style={styles}
          >
            <LineChart
              {...chartStateCopy}
              annotations={[{axis: 'y', kind: 'line', label: 'Target', value: 60}]}
              aspectRatio={1.75}
              data={data}
              dataTableLabel="Monthly energy data"
              description="Monthly demand remains within available thermal capacity."
              legend={{label: 'Energy series'}}
              minimumSize={{height: metrics.canvasWidth / 1.75, width: metrics.canvasWidth}}
              overflow="scroll"
              series={[
                {accessor: 'demand', id: 'demand', label: 'Demand', showPoints: true},
                {accessor: 'capacity', color: 'series-2', id: 'capacity', label: 'Capacity'},
              ]}
              title="Thermal demand"
              xAxis={{
                accessor: 'month',
                label: 'Month',
                scale: {type: 'categorical'},
                tickCount: data.length,
              }}
              yAxis={{label: 'Energy', scale: {type: 'linear'}, showGrid: true, unit: 'MWh'}}
            />
          </div>
        </section>

        <dl className="prototype-measures" data-region="sizing-readout">
          <div>
            <dt>Text</dt>
            <dd>{sizingMode === 'adaptive' ? `${metrics.fontSize.toFixed(1)}px` : 'current'}</dd>
          </div>
          <div>
            <dt>Line</dt>
            <dd>{metrics.lineWidth.toFixed(2)}px</dd>
          </div>
          <div>
            <dt>Hover target</dt>
            <dd>{sizingMode === 'adaptive' ? `${metrics.hitWidth.toFixed(2)}px` : 'line only'}</dd>
          </div>
          <div>
            <dt>Category labels</dt>
            <dd>all, {metrics.staggerLabels ? '2 rows' : '1 row'}</dd>
          </div>
          <div>
            <dt>Overflow</dt>
            <dd>{metrics.scrolls ? 'local scroll' : 'none'}</dd>
          </div>
        </dl>
      </main>
    </AppearanceProvider>
  );
}

createRoot(document.querySelector('#root')!).render(<ResponsiveChartSizingPrototype />);
