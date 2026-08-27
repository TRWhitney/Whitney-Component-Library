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

type CaptionMode = 'compact' | 'embedded' | 'standard';

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
  {month: 'Jul 2026', value: 71},
  {month: 'Aug 2026', value: 78},
] as const;

const appearances = [
  {label: 'Light', value: 'light'},
  {label: 'Dark', value: 'dark'},
] as const;
const captionModes = [
  {label: 'Embedded', value: 'embedded'},
  {label: 'Compact caption', value: 'compact'},
  {label: 'Standard caption', value: 'standard'},
] as const;
const chartStateCopy = {
  emptyState: {description: 'Choose a period with recorded demand.', title: 'No demand data'},
  invalidData: {
    description: 'Correct records with missing or non-finite demand values.',
    title: 'Some demand data is invalid',
  },
} as const;
const currentValue = demand[demand.length - 1]!.value;
const summary =
  'Monthly demand began at 46 kilowatts, reached a low of 43 and a high of 78, and ended at 78 kilowatts.';

function modeTitle(mode: CaptionMode): string {
  return mode === 'compact'
    ? `North loop thermal demand · ${currentValue} kW`
    : 'North loop thermal demand';
}

export function SparklineCaptionPrototype() {
  const stageRef = useRef<HTMLElement>(null);
  const [appearance, setAppearance] = useState<Appearance>('light');
  const [availableWidth, setAvailableWidth] = useState(440);
  const [captionMode, setCaptionMode] = useState<CaptionMode>('embedded');
  const [identifyRegions, setIdentifyRegions] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (stage === null) return;
    const caption = stage.querySelector<HTMLElement>('[data-wcl-chart-caption]');
    const plot = stage.querySelector<HTMLElement>('[data-wcl-chart-canvas]');
    caption?.setAttribute('data-region', 'sparkline-caption');
    plot?.setAttribute('data-region', 'sparkline-plot');
    return () => {
      caption?.removeAttribute('data-region');
      plot?.removeAttribute('data-region');
    };
  }, [captionMode]);

  return (
    <AppearanceProvider accent="#2878ff" appearance={appearance}>
      <main className="prototype-page" data-identify={identifyRegions ? '' : undefined}>
        <header className="prototype-header">
          <div>
            <p className="prototype-kicker">Decision prototype</p>
            <h1>Sparkline caption ownership</h1>
            <p>
              Production LineChart supplies the plot and all reading behavior. This comparison
              changes only how much caption text the compact chart renders.
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
            label="Caption treatment"
            onChange={(value) => setCaptionMode(value as CaptionMode)}
            options={captionModes}
            value={captionMode}
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
          aria-label="Caption comparison"
          className="prototype-stage"
          data-region="comparison-stage"
          ref={stageRef}
        >
          <div
            className="metric-register"
            data-caption-mode={captionMode}
            style={{inlineSize: `${availableWidth}px`}}
          >
            {captionMode === 'embedded' ? (
              <div className="metric-context" data-region="consumer-metric-context">
                <div>
                  <strong>North loop thermal demand</strong>
                  <span>Past 12 months</span>
                </div>
                <output>{currentValue} kW</output>
              </div>
            ) : null}
            <div className="sparkline-chart" data-region="sparkline-component">
              <LineChart
                {...chartStateCopy}
                aspectRatio={4}
                data={demand}
                dataTableLabel="North loop monthly thermal demand"
                description={summary}
                minimumSize={{height: 40, width: 160}}
                overflow="clip"
                series={[{accessor: 'value', id: 'demand', label: 'Thermal demand'}]}
                title={modeTitle(captionMode)}
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
          <strong>Review only the caption relationship.</strong>
          <p>
            Plot padding comes from LineChart's hidden axes and is not under review. Endpoint cues,
            missing-value gaps, and final minimum size will be handled separately.
          </p>
        </section>
      </main>
    </AppearanceProvider>
  );
}

const root = document.querySelector('#root');
if (root !== null) createRoot(root).render(<SparklineCaptionPrototype />);
