import {useEffect, useRef, useState} from 'react';
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

type CueMode = 'current' | 'line' | 'range';

const demand = [
  {month: 'Sep 2025', value: 46},
  {month: 'Oct 2025', value: 51},
  {month: 'Nov 2025', value: 48},
  {month: 'Dec 2025', value: 43},
  {month: 'Jan 2026', value: 49},
  {month: 'Feb 2026', value: 57},
  {month: 'Mar 2026', value: 54},
  {month: 'Apr 2026', value: 62},
  {month: 'May 2026', value: 66},
  {month: 'Jun 2026', value: 63},
  {month: 'Jul 2026', value: 78},
  {month: 'Aug 2026', value: 72},
] as const;

const appearances = [
  {label: 'Light', value: 'light'},
  {label: 'Dark', value: 'dark'},
] as const;
const cueModes = [
  {label: 'Line only', value: 'line'},
  {label: 'Current endpoint', value: 'current'},
  {label: 'Current and observed range', value: 'range'},
] as const;
const chartStateCopy = {
  emptyState: {description: 'Choose a period with recorded demand.', title: 'No demand data'},
  invalidData: {
    description: 'Correct records with missing or non-finite demand values.',
    title: 'Some demand data is invalid',
  },
} as const;
const currentIndex = demand.length - 1;
const lowIndex = demand.reduce(
  (selected, record, index) => (record.value < demand[selected]!.value ? index : selected),
  0,
);
const highIndex = demand.reduce(
  (selected, record, index) => (record.value > demand[selected]!.value ? index : selected),
  0,
);

export function SparklineCuePrototype() {
  const stageRef = useRef<HTMLElement>(null);
  const [appearance, setAppearance] = useState<Appearance>('light');
  const [availableWidth, setAvailableWidth] = useState(440);
  const [cueMode, setCueMode] = useState<CueMode>('current');
  const [identifyRegions, setIdentifyRegions] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (stage === null) return;
    const caption = stage.querySelector<HTMLElement>('[data-wcl-chart-caption]');
    const plot = stage.querySelector<HTMLElement>('[data-wcl-chart-canvas]');
    const points = stage.querySelectorAll<SVGCircleElement>('[data-wcl-chart-point]');
    caption?.setAttribute('data-region', 'sparkline-caption');
    plot?.setAttribute('data-region', 'sparkline-plot');
    points.forEach((point) => {
      const index = Number(point.getAttribute('data-row-index'));
      if (index === currentIndex) point.setAttribute('data-prototype-cue', 'current');
      if (index === lowIndex) point.setAttribute('data-prototype-cue', 'low');
      if (index === highIndex) point.setAttribute('data-prototype-cue', 'high');
    });
    return () => {
      caption?.removeAttribute('data-region');
      plot?.removeAttribute('data-region');
      points.forEach((point) => point.removeAttribute('data-prototype-cue'));
    };
  }, []);

  return (
    <AppearanceProvider accent="#2878ff" appearance={appearance}>
      <main className="prototype-page" data-identify={identifyRegions ? '' : undefined}>
        <header className="prototype-header">
          <div>
            <p className="prototype-kicker">Decision prototype</p>
            <h1>Sparkline point cues</h1>
            <p>
              Production LineChart supplies the standard caption, plot, and reading behavior. This
              comparison changes only which existing point marks remain visible at rest.
            </p>
          </div>
          <ToggleButton isSelected={identifyRegions} onChange={setIdentifyRegions}>
            Identify regions
          </ToggleButton>
        </header>

        <section
          aria-label="Prototype controls"
          className="prototype-controls"
          data-region="prototype-controls"
        >
          <SegmentedControl
            label="Static point cues"
            onChange={(value) => setCueMode(value as CueMode)}
            options={cueModes}
            value={cueMode}
          />
          <SegmentedControl
            label="Appearance"
            onChange={(value) => setAppearance(value as Appearance)}
            options={appearances}
            value={appearance}
          />
          <label className="width-control">
            <span>Available width</span>
            <output>{availableWidth}px</output>
            <input
              aria-label="Available width"
              max="680"
              min="180"
              onChange={(event) => setAvailableWidth(Number(event.currentTarget.value))}
              step="20"
              type="range"
              value={availableWidth}
            />
          </label>
        </section>

        <section
          aria-label="Point-cue comparison"
          className="prototype-stage"
          data-region="comparison-stage"
          ref={stageRef}
        >
          <div
            className="sparkline-register"
            data-cue-mode={cueMode}
            style={{inlineSize: `${availableWidth}px`}}
          >
            <div className="sparkline-chart" data-region="sparkline-component">
              <LineChart
                {...chartStateCopy}
                aspectRatio={4}
                data={demand}
                dataTableLabel="North loop monthly thermal demand"
                description="Monthly demand began at 46 kilowatts, reached a low of 43 and a high of 78, and ended at 72 kilowatts."
                minimumSize={{height: 40, width: 160}}
                overflow="clip"
                series={[
                  {
                    accessor: 'value',
                    id: 'demand',
                    label: 'Thermal demand',
                    showPoints: true,
                  },
                ]}
                title="North loop thermal demand"
                xAxis={{
                  accessor: 'month',
                  label: 'Month',
                  scale: {type: 'categorical'},
                }}
                yAxis={{
                  label: 'Thermal demand',
                  scale: {domain: [40, 80], type: 'linear'},
                  unit: 'kW',
                }}
              />
            </div>
          </div>
        </section>

        <section className="prototype-notes" data-region="review-question">
          <strong>Review only the static point cues.</strong>
          <p>
            The production reading node still appears when you focus or point at the plot. Plot
            padding and size come from the LineChart adapter and are not under review here.
          </p>
        </section>
      </main>
    </AppearanceProvider>
  );
}

const root = document.querySelector('#root');
if (root !== null) createRoot(root).render(<SparklineCuePrototype />);
