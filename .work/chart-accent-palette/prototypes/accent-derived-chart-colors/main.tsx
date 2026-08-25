import {useState, type CSSProperties} from 'react';
import {createRoot} from 'react-dom/client';

import {
  AppearanceProvider,
  CartesianChart,
  SegmentedControl,
  ToggleButton,
  type AccentColor,
  type Appearance,
} from '../../../../src/index.js';
import '../../../../src/styles.css';
import './styles.css';

const data = [
  {capacity: 72, demand: 48, export: 18, losses: 9, month: 'Jan', reserve: 62, storage: 31},
  {capacity: 76, demand: 54, export: 22, losses: 11, month: 'Feb', reserve: 66, storage: 28},
  {capacity: 81, demand: 61, export: 19, losses: 13, month: 'Mar', reserve: 69, storage: 36},
  {capacity: 79, demand: 57, export: 25, losses: 10, month: 'Apr', reserve: 71, storage: 42},
] as const;
const paletteOptions = [
  {label: 'Current', value: 'current'},
  {label: 'Hue orbit', value: 'orbit'},
  {label: 'Role-aware orbit', value: 'role-aware'},
] as const;
const appearanceOptions = [
  {label: 'Light', value: 'light'},
  {label: 'Dark', value: 'dark'},
] as const;
const chartStateCopy = {
  emptyState: {
    description: 'Choose a reporting interval with recorded energy.',
    title: 'No energy data',
  },
  invalidData: {
    description: 'Correct records with missing or non-finite energy values.',
    title: 'Some energy data is invalid',
  },
} as const;
const colorTokens = ['accent', 'series-2', 'series-3', 'series-4', 'series-5', 'series-6'];
const accentPresets = [
  {color: '#000000', label: 'black'},
  {color: '#111111', label: 'near black'},
  {color: '#2878ff', label: 'blue'},
  {color: '#e11919', label: 'red'},
  {color: '#eeeeee', label: 'near white'},
  {color: '#ffffff', label: 'white'},
] as const satisfies readonly {readonly color: AccentColor; readonly label: string}[];
const orbitOffsets = [137.5, 275, 52.5, 190, 327.5] as const;
const neutralFallbackAccent: AccentColor = '#2878ff';
const currentPalettes = {
  dark: ['#d19be6', '#55cfbf', '#ffad66', '#91adf0', '#ee8daf'],
  light: ['#8d4fa8', '#007f78', '#b45d12', '#4867a9', '#a33f65'],
} as const;

type PaletteMode = (typeof paletteOptions)[number]['value'];
type PaletteStyles = CSSProperties & Record<`--wcl-chart-series-${2 | 3 | 4 | 5 | 6}`, string>;

function usesNeutralFallback(accent: AccentColor): boolean {
  const red = Number.parseInt(accent.slice(1, 3), 16);
  const green = Number.parseInt(accent.slice(3, 5), 16);
  const blue = Number.parseInt(accent.slice(5, 7), 16);
  return Math.max(red, green, blue) - Math.min(red, green, blue) < 24;
}

function paletteStyles(
  accent: AccentColor,
  appearance: Appearance,
  palette: PaletteMode,
): PaletteStyles {
  if (palette === 'current') {
    return Object.fromEntries(
      currentPalettes[appearance].map((color, index) => [`--wcl-chart-series-${index + 2}`, color]),
    ) as PaletteStyles;
  }
  const seed = usesNeutralFallback(accent) ? neutralFallbackAccent : 'var(--wcl-accent-rail)';
  return Object.fromEntries(
    orbitOffsets.map((offset, index) => [
      `--wcl-chart-series-${index + 2}`,
      `oklch(from ${seed} l max(c, 0.12) calc(h + ${offset}))`,
    ]),
  ) as PaletteStyles;
}

function Prototype() {
  const [accent, setAccent] = useState<AccentColor>('#2878ff');
  const [appearance, setAppearance] = useState<Appearance>('dark');
  const [identifyRegions, setIdentifyRegions] = useState(false);
  const [palette, setPalette] = useState<PaletteMode>('role-aware');
  const hasNeutralFallback = palette !== 'current' && usesNeutralFallback(accent);

  return (
    <AppearanceProvider accent={accent} appearance={appearance}>
      <main
        className="prototype"
        data-identify={identifyRegions}
        data-palette={palette}
        style={paletteStyles(accent, appearance, palette)}
      >
        <header className="prototype-header">
          <div>
            <span className="prototype-kicker">Non-production prototype</span>
            <h1>Accent-derived chart colors</h1>
            <p>
              Compare fixed chart colors with a hue orbit and a role-aware version that quiets
              filled marks beneath stronger lines. The chart, marks, legend, appearance rules, and
              accessibility output come from the real component library.
            </p>
          </div>
          <ToggleButton isSelected={identifyRegions} onChange={setIdentifyRegions} size="compact">
            Identify regions
          </ToggleButton>
        </header>

        <section
          aria-label="Prototype controls"
          className="prototype-controls"
          data-region="controls"
        >
          <span aria-hidden="true" className="prototype-region-label">
            Prototype controls
          </span>
          <SegmentedControl
            label="Palette derivation"
            onChange={setPalette}
            options={paletteOptions}
            value={palette}
          />
          <SegmentedControl
            label="Appearance"
            onChange={setAppearance}
            options={appearanceOptions}
            value={appearance}
          />
          <label className="prototype-accent-control">
            <span>Accent</span>
            <span>
              <input
                aria-label="Accent color"
                onChange={(event) => setAccent(event.currentTarget.value as AccentColor)}
                type="color"
                value={accent}
              />
              <code>{accent}</code>
            </span>
            <span aria-label="Stress-test accent presets" className="prototype-accent-presets">
              {accentPresets.map((preset) => (
                <button
                  aria-label={`Use ${preset.label} accent`}
                  key={preset.color}
                  onClick={() => setAccent(preset.color)}
                  style={{'--prototype-preset-color': preset.color} as CSSProperties}
                  type="button"
                />
              ))}
            </span>
            {hasNeutralFallback ? (
              <small role="status">
                Neutral fallback: later series use the default blue hue because this accent has no
                stable hue to rotate.
              </small>
            ) : null}
          </label>
        </section>

        <section
          aria-labelledby="palette-title"
          className="prototype-palette-region"
          data-region="palette"
        >
          <span aria-hidden="true" className="prototype-region-label">
            Derived palette
          </span>
          <h2 id="palette-title">Resulting palette</h2>
          <ol className="prototype-palette">
            {colorTokens.map((color, index) => (
              <li data-color={color} key={color}>
                <span aria-hidden="true" className="prototype-swatch" />
                <span>{index === 0 ? 'Accent' : `Series ${index + 1}`}</span>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-label="Mixed chart comparison"
          className="prototype-chart"
          data-region="chart"
        >
          <span aria-hidden="true" className="prototype-region-label">
            Mixed chart
          </span>
          <CartesianChart
            {...chartStateCopy}
            annotations={[{axis: 'y', kind: 'line', label: 'Operating target', value: 64}]}
            data={data}
            dataTableLabel="Accent-derived palette comparison data"
            description="Six compatible energy series expose palette separation across mixed marks."
            legend={{label: 'Energy series'}}
            minimumSize={{height: 360, width: 640}}
            overflow="scroll"
            series={[
              {accessor: 'demand', id: 'demand', kind: 'line', label: 'Demand', showPoints: true},
              {accessor: 'reserve', id: 'reserve', kind: 'area', label: 'Reserve'},
              {accessor: 'capacity', id: 'capacity', kind: 'column', label: 'Capacity'},
              {
                accessor: 'storage',
                id: 'storage',
                kind: 'line',
                label: 'Storage',
                showPoints: true,
              },
              {accessor: 'export', id: 'export', kind: 'line', label: 'Export'},
              {accessor: 'losses', id: 'losses', kind: 'line', label: 'Losses', showPoints: true},
            ]}
            title="Regional energy balance"
            xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
            yAxis={{label: 'Energy', scale: {type: 'linear'}, showGrid: true, unit: 'MWh'}}
          />
        </section>
      </main>
    </AppearanceProvider>
  );
}

const rootElement = document.querySelector('#root');

if (rootElement === null) throw new Error('Prototype root element is missing.');

createRoot(rootElement).render(<Prototype />);
