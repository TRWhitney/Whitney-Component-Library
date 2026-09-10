import {
  memo,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';

import {
  AlertBanner,
  AlertDialog,
  Accordion,
  AreaChart,
  AppearanceProvider,
  Badge,
  BarChart,
  BoxPlot,
  BubbleChart,
  Button,
  ButtonGroup,
  Breadcrumbs,
  CardCollection,
  CartesianChart,
  Checkbox,
  CheckboxGroup,
  ComboBox,
  CollectionFilterBar,
  ColumnChart,
  ContextMenu,
  DateField,
  DatePicker,
  DateRangePicker,
  Dialog,
  DescriptionList,
  Divider,
  Disclosure,
  DonutChart,
  DropZone,
  Drawer,
  EmptyState,
  Field,
  FieldGroup,
  FileTrigger,
  FormSection,
  IconButton,
  Histogram,
  Heatmap,
  type HeatmapActivation,
  type HeatmapInteraction,
  type HeatmapSelectionItem,
  InlineAlert,
  InlineGroup,
  Link,
  LineChart,
  List,
  ListBox,
  Meter,
  Menu,
  NotificationProvider,
  NumberField,
  Pagination,
  PageHeader,
  PieChart,
  ProcessTracker,
  ProgressBar,
  Popover,
  RadarChart,
  RangeSlider,
  ResponsiveGrid,
  RadioGroup,
  ScrollRegion,
  ScatterChart,
  Sparkline,
  SearchField,
  Section,
  Select,
  CollapsibleNavigationPane,
  Slider,
  Skeleton,
  Spinner,
  SplitView,
  Stack,
  StatusIndicator,
  SegmentedControl,
  Surface,
  Switch,
  Tabs,
  Table,
  TextArea,
  TextField,
  TimeField,
  ToggleButton,
  Toolbar,
  Tooltip,
  Tree,
  type AccentColor,
  type Appearance,
  type BreadcrumbItems,
  type BoxPlotActivation,
  type BoxPlotInteraction,
  type BoxPlotSelectionItem,
  type ChartActivation,
  type ChartInteraction,
  type ChartSelectionItem,
  type ChartVisibilityLabels,
  type CollectionQueryFor,
  type DrawerPlacement,
  type FieldControlProps,
  type FileAcquisitionResult,
  type HistogramActivation,
  type HistogramInteraction,
  type HistogramSelectionItem,
  type PartToWholeActivation,
  type PartToWholeInteraction,
  type PartToWholeSelectionItem,
  type PointChartActivation,
  type PointChartInteraction,
  type RadarChartDimensions,
  type RadarActivation,
  type RadarInteraction,
  type RadarSelectionItem,
  type SparklineActivation,
  type SparklineInteraction,
  type SparklineSelectionItem,
  type TableSortDescriptor,
} from '../src/index.js';
import {useScrollbarActivity} from '../src/scrollbar-activity.js';
import {componentAnchor, showcaseGroups, showcasedComponentNames} from './catalog.js';

const defaultAccent: AccentColor = '#2878ff';
const chartData = [
  {capacity: 58, demand: 42, month: 'Jan'},
  {capacity: 64, demand: 51, month: 'Feb'},
  {capacity: 68, demand: 61, month: 'Mar'},
  {capacity: 72, demand: 57, month: 'Apr'},
] as const;
const chartRowId = (datum: (typeof chartData)[number]) => datum.month;
const energyCategoryData = [
  {id: 'residential', label: 'Residential', value: 43},
  {id: 'food', label: 'Food processing', value: 31},
  {id: 'offices', label: 'Offices', value: 26},
  {id: 'retail', label: 'Retail', value: 18},
  {id: 'schools', label: 'Schools', value: 14},
  {id: 'manufacturing', label: 'Manufacturing', value: 12},
  {id: 'hospitality', label: 'Hospitality', value: 9},
  {id: 'data-centers', label: 'Data centers', value: 8},
  {id: 'transit', label: 'Transit', value: 7},
  {id: 'libraries', label: 'Libraries', value: 6},
  {id: 'workshops', label: 'Workshops', value: 5},
  {id: 'agriculture', label: 'Agriculture', value: 4},
  {id: 'civic', label: 'Civic buildings', value: 3},
  {id: 'markets', label: 'Public markets', value: 2},
  {id: 'storage', label: 'Storage', value: 0},
] as const;
interface VehicleProfile {
  readonly comfort?: number;
  readonly efficiency?: number;
  readonly id: string;
  readonly label: string;
  readonly range?: number;
  readonly reliability?: number;
  readonly speed?: number;
}
const vehicleProfileDimensions: RadarChartDimensions<VehicleProfile> = [
  {accessor: 'speed', id: 'speed', label: 'Speed'},
  {accessor: 'range', id: 'range', label: 'Range'},
  {accessor: 'efficiency', id: 'efficiency', label: 'Efficiency'},
  {accessor: 'comfort', id: 'comfort', label: 'Comfort'},
  {accessor: 'reliability', id: 'reliability', label: 'Reliability'},
];
const vehicleProfileData: readonly [VehicleProfile, VehicleProfile] = [
  {
    comfort: 6,
    efficiency: 8,
    id: 'courier',
    label: 'Courier',
    range: 7,
    reliability: 9,
    speed: 5,
  },
  {
    comfort: 8,
    efficiency: 6,
    id: 'scout',
    label: 'Scout',
    range: 9,
    reliability: 7,
    speed: 8,
  },
] as const;
const sparseVehicleProfileData: readonly [VehicleProfile, VehicleProfile] = [
  {id: 'relay', label: 'Relay', range: 8},
  {comfort: 5, id: 'utility', label: 'Utility', reliability: 7, speed: 6},
] as const;
const heatmapRows = [
  {id: 'north', label: 'North room'},
  {id: 'south', label: 'South room'},
  {id: 'east', label: 'East room'},
  {id: 'west', label: 'West room'},
] as const;
const heatmapColumns = [
  {id: 'morning', label: 'Morning'},
  {id: 'midday', label: 'Midday'},
  {id: 'evening', label: 'Evening'},
  {id: 'night', label: 'Night'},
] as const;
const roomTemperatureData = [
  {period: 'morning', room: 'north', value: 0},
  {period: 'midday', room: 'north', value: 18},
  {period: 'evening', room: 'north', value: 15},
  {period: 'morning', room: 'south', value: 9},
  {period: 'midday', room: 'south', value: 24},
  {period: 'night', room: 'south', value: 11},
  {period: 'morning', room: 'east', value: 6},
  {period: 'evening', room: 'east', value: 20},
  {period: 'night', room: 'east', value: 8},
  {period: 'midday', room: 'west', value: 16},
  {period: 'evening', room: 'west', value: 13},
] as const;
const roomDeviationData = [
  {period: 'morning', room: 'north', value: -4},
  {period: 'midday', room: 'north', value: 2},
  {period: 'evening', room: 'north', value: 0},
  {period: 'morning', room: 'south', value: -2},
  {period: 'midday', room: 'south', value: 5},
  {period: 'night', room: 'south', value: -1},
  {period: 'morning', room: 'east', value: -5},
  {period: 'evening', room: 'east', value: 4},
  {period: 'night', room: 'east', value: 1},
  {period: 'midday', room: 'west', value: 3},
  {period: 'evening', room: 'west', value: -3},
] as const;
const compactDemandData = [
  {id: 'demand-mon', day: 'Mon', demand: 42},
  {id: 'demand-tue', day: 'Tue', demand: null},
  {id: 'demand-wed', day: 'Wed', demand: 38},
  {id: 'demand-thu', day: 'Thu', demand: 52},
  {id: 'demand-fri', day: 'Fri', demand: 38},
  {id: 'demand-sat', day: 'Sat', demand: 65},
  {id: 'demand-sun', day: 'Sun', demand: 65},
] as const;
const statisticalPointData = [
  {demand: 28, id: 'north-1', label: 'North Monday', loop: 'north', stored: 42, temperature: 18},
  {demand: 46, id: 'south-1', label: 'South Monday', loop: 'south', stored: 74, temperature: 31},
  {demand: 38, id: 'west-1', label: 'West Monday', loop: 'west', stored: 31, temperature: 43},
  {demand: 68, id: 'north-2', label: 'North Tuesday', loop: 'north', stored: 88, temperature: 56},
  {demand: 59, id: 'south-2', label: 'South Tuesday', loop: 'south', stored: 52, temperature: 70},
  {demand: 82, id: 'west-2', label: 'West Tuesday', loop: 'west', stored: 64, temperature: 82},
  {demand: 68, id: 'south-3', label: 'South Wednesday', loop: 'south', stored: 26, temperature: 56},
] as const;
const statisticalSeries = [
  {id: 'north', label: 'North loop'},
  {color: 'series-2', id: 'south', label: 'South loop'},
  {color: 'series-3', id: 'west', label: 'West loop'},
] as const;
const restartLatencies = [
  8, 21, 44, 47, 63, 71, 86, 91, 95, 103, 108, 111, 116, 124, 131, 139, 151, 168, 177, 209,
].map((latency) => ({latency}));
const recoveryTimes = [
  {id: 'north-recovery-1', loop: 'north', recovery: 43},
  {id: 'north-recovery-2', loop: 'north', recovery: 48},
  {id: 'north-recovery-3', loop: 'north', recovery: 52},
  {id: 'north-recovery-4', loop: 'north', recovery: 54},
  {id: 'north-recovery-5', loop: 'north', recovery: 56},
  {id: 'north-recovery-6', loop: 'north', recovery: 57},
  {id: 'north-recovery-7', loop: 'north', recovery: 63},
  {id: 'north-recovery-8', loop: 'north', recovery: 70},
  {id: 'north-recovery-9', loop: 'north', recovery: 104},
  {id: 'south-recovery-1', loop: 'south', recovery: 34},
  {id: 'south-recovery-2', loop: 'south', recovery: 39},
  {id: 'south-recovery-3', loop: 'south', recovery: 43},
  {id: 'south-recovery-4', loop: 'south', recovery: 47},
  {id: 'south-recovery-5', loop: 'south', recovery: 51},
  {id: 'south-recovery-6', loop: 'south', recovery: 54},
  {id: 'south-recovery-7', loop: 'south', recovery: 56},
  {id: 'south-recovery-8', loop: 'south', recovery: 58},
  {id: 'south-recovery-9', loop: 'south', recovery: 60},
  {id: 'south-recovery-10', loop: 'south', recovery: 63},
  {id: 'south-recovery-11', loop: 'south', recovery: 75},
  {id: 'south-recovery-12', loop: 'south', recovery: 96},
  {id: 'south-recovery-13', loop: 'south', recovery: 108},
  {id: 'west-recovery-1', loop: 'west', recovery: 55},
  {id: 'west-recovery-2', loop: 'west', recovery: 59},
  {id: 'west-recovery-3', loop: 'west', recovery: 63},
  {id: 'west-recovery-4', loop: 'west', recovery: 66},
  {id: 'west-recovery-5', loop: 'west', recovery: 71},
  {id: 'west-recovery-6', loop: 'west', recovery: 75},
  {id: 'west-recovery-7', loop: 'west', recovery: 79},
];
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
const runCollectionFilters = [
  {
    emptyMessage: 'No statuses',
    id: 'status',
    label: 'Status',
    options: [
      {label: 'Converged', value: 'converged'},
      {label: 'Solving', value: 'solving'},
    ],
    placeholder: 'Any status',
  },
  {
    emptyMessage: 'No profiles',
    id: 'profile',
    label: 'Profile',
    options: [
      {label: 'Balanced', value: 'balanced'},
      {label: 'Fast', value: 'fast'},
    ],
    placeholder: 'Any profile',
  },
] as const;
const workspaceBreadcrumb = {href: '#workspace', id: 'workspace', label: 'Workspace'} as const;
const studiesBreadcrumb = {
  href: '#thermal-studies',
  id: 'studies',
  label: 'Thermal studies',
} as const;
const historyBreadcrumb = {href: '#run-history', id: 'runs', label: 'Run history'} as const;
const runBreadcrumb = {href: '#breadcrumb-current', id: 'run', label: 'RUN 0284'} as const;
type BreadcrumbShowcaseLocation = 'workspace' | 'studies' | 'runs' | 'run';
const breadcrumbShowcasePaths = {
  workspace: [workspaceBreadcrumb],
  studies: [workspaceBreadcrumb, studiesBreadcrumb],
  runs: [workspaceBreadcrumb, studiesBreadcrumb, historyBreadcrumb],
  run: [workspaceBreadcrumb, studiesBreadcrumb, historyBreadcrumb, runBreadcrumb],
} as const satisfies Record<BreadcrumbShowcaseLocation, BreadcrumbItems>;
const breadcrumbLocationByHref = {
  '#breadcrumb-current': 'run',
  '#run-history': 'runs',
  '#thermal-studies': 'studies',
  '#workspace': 'workspace',
} as const satisfies Record<string, BreadcrumbShowcaseLocation>;
const breadcrumbShowcasePages = {
  workspace: {
    description: 'Browse the thermal studies available in this workspace.',
    next: studiesBreadcrumb,
    title: 'Workspace',
  },
  studies: {
    description: 'Review the run history for this thermal study.',
    next: historyBreadcrumb,
    title: 'Thermal studies',
  },
  runs: {
    description: 'Open the latest completed run in this history.',
    next: runBreadcrumb,
    title: 'Run history',
  },
  run: {
    description: 'RUN 0284 converged after 18 boundary passes.',
    title: 'RUN 0284',
  },
} as const satisfies Record<
  BreadcrumbShowcaseLocation,
  {
    readonly description: string;
    readonly next?: (typeof breadcrumbShowcasePaths.run)[number];
    readonly title: string;
  }
>;
const runModeOptions = [
  {label: 'Conservative', value: 'conservative'},
  {description: 'Balances precision and solve time.', label: 'Balanced', value: 'balanced'},
  {label: 'Fast', value: 'fast'},
] as const;
const densityOptions = [
  {label: 'Conservative', value: 'conservative'},
  {label: 'Balanced', value: 'balanced'},
  {label: 'Fast', value: 'fast'},
] as const;
const drawerPlacementOptions = [
  {label: 'Start', value: 'start'},
  {label: 'End', value: 'end'},
  {label: 'Top', value: 'top'},
  {label: 'Bottom', value: 'bottom'},
] as const;
const drawerDockOptions = [
  {label: 'None', value: 'none'},
  {label: 'Grip only', value: 'grip'},
  {label: 'Preview strip', value: 'preview'},
] as const;

interface SpecimenProps {
  readonly children: ReactNode;
  readonly description: string;
  readonly name: string;
}

function Specimen({children, description, name}: SpecimenProps) {
  return (
    <article
      className="showcase-specimen"
      data-showcase-component={name}
      id={componentAnchor(name)}
    >
      <header className="showcase-specimen-header">
        <code>{name}</code>
        <p>{description}</p>
      </header>
      <div className="showcase-specimen-stage">{children}</div>
    </article>
  );
}

interface ExampleProps {
  readonly children: ReactNode;
  readonly label: string;
}

function Example({children, label}: ExampleProps) {
  return (
    <figure className="showcase-example">
      <figcaption data-showcase-example-label="">{label}</figcaption>
      {children}
    </figure>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="showcase-icon" viewBox="0 0 20 20">
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

function AddIcon() {
  return (
    <svg aria-hidden="true" className="showcase-icon" viewBox="0 0 20 20">
      <path d="M10 4v12M4 10h12" />
    </svg>
  );
}

function normalizeAngle(value: number): number {
  return ((value % 360) + 360) % 360;
}

function PhaseAngleDial(controlProps: FieldControlProps) {
  const [angle, setAngle] = useState(135);
  const isInteractive = !controlProps.disabled && !controlProps.readOnly;

  const setAngleFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const orbit = event.currentTarget.querySelector('[data-showcase-phase-orbit]');
    if (!orbit) return;

    const bounds = orbit.getBoundingClientRect();
    const radians = Math.atan2(
      event.clientY - (bounds.top + bounds.height / 2),
      event.clientX - (bounds.left + bounds.width / 2),
    );
    setAngle(normalizeAngle(Math.round((radians * 180) / Math.PI + 90)));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isInteractive) return;

    const increments: Partial<Record<string, number>> = {
      ArrowDown: -5,
      ArrowLeft: -5,
      ArrowRight: 5,
      ArrowUp: 5,
      PageDown: -30,
      PageUp: 30,
    };
    const increment = increments[event.key];

    if (increment !== undefined) {
      event.preventDefault();
      setAngle((current) => normalizeAngle(current + increment));
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      setAngle(event.key === 'Home' ? 0 : 359);
    }
  };

  const style = {'--showcase-phase-angle': `${angle}deg`} as CSSProperties;

  return (
    <div
      {...controlProps}
      aria-valuemax={359}
      aria-valuemin={0}
      aria-valuenow={angle}
      aria-valuetext={`${angle} degrees clockwise`}
      className="showcase-phase-control"
      data-showcase-phase-dial=""
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => {
        if (!isInteractive) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        setAngleFromPointer(event);
      }}
      onPointerMove={(event) => {
        if (isInteractive && event.currentTarget.hasPointerCapture(event.pointerId)) {
          setAngleFromPointer(event);
        }
      }}
      role="slider"
      tabIndex={controlProps.tabIndex ?? 0}
    >
      <span
        aria-hidden="true"
        className="showcase-phase-orbit"
        data-showcase-phase-orbit=""
        style={style}
      >
        <span className="showcase-phase-arm" />
      </span>
      <span aria-hidden="true" className="showcase-phase-copy">
        <strong>Rotor B offset</strong>
        <span>{angle}° clockwise</span>
      </span>
    </div>
  );
}

function LayoutSpecimens() {
  return (
    <>
      <Specimen
        description="Arrange one sequence vertically with a consistent gap. Use ResponsiveGrid when peers should share rows at wider widths."
        name="Stack"
      >
        <Stack gap="tight">
          <div className="showcase-measure">Prepare geometry</div>
          <div className="showcase-measure">Resolve boundaries</div>
          <div className="showcase-measure">Run profile</div>
        </Stack>
      </Specimen>

      <Specimen
        description="Keep related items on one row when space allows, then wrap them as a sequence rather than a column grid. equalItems gives every peer the same width."
        name="InlineGroup"
      >
        <InlineGroup equalItems gap="tight" wrap>
          <Button variant="secondary">Conservative</Button>
          <Button variant="secondary">Balanced</Button>
          <Button variant="secondary">Fast</Button>
        </InlineGroup>
      </Specimen>

      <Specimen
        description="Lay out repeated peers in responsive columns that collapse as space narrows. Use it for card or field grids rather than one horizontal sequence."
        name="ResponsiveGrid"
      >
        <ResponsiveGrid equalItems gap="regular" minimumItemWidth="compact">
          <Surface padding="compact" variant="subtle">
            <strong>Geometry</strong>
            <span className="showcase-muted">12 surfaces</span>
          </Surface>
          <Surface padding="compact" variant="subtle">
            <strong>Boundary</strong>
            <span className="showcase-muted">6 resolved</span>
          </Surface>
          <Surface padding="compact" variant="subtle">
            <strong>Solve</strong>
            <span className="showcase-muted">Ready</span>
          </Surface>
        </ResponsiveGrid>
      </Specimen>

      <Specimen
        description="Mark a boundary when spacing alone does not explain the separation. Divider works horizontally in a stack or vertically in an inline group."
        name="Divider"
      >
        <Stack gap="regular">
          <span>Input conditions</span>
          <Divider />
          <InlineGroup align="stretch">
            <span>Solver</span>
            <Divider orientation="vertical" />
            <span>Tolerance</span>
          </InlineGroup>
        </Stack>
      </Specimen>

      <Specimen
        description="Give related content a shared background, padding, boundary, and elevation. Surface changes presentation but adds no heading or section semantics."
        name="Surface"
      >
        <ResponsiveGrid equalItems gap="regular" minimumItemWidth="compact">
          <Surface padding="compact" variant="base">
            Base
          </Surface>
          <Surface padding="compact" variant="subtle">
            Subtle
          </Surface>
          <Surface padding="compact" variant="raised">
            Raised
          </Surface>
        </ResponsiveGrid>
      </Specimen>

      <Specimen
        description="Give a content region a visible heading, optional description, and optional action. Add Surface separately when the region also needs a container treatment."
        name="Section"
      >
        <Surface padding="regular" variant="subtle">
          <Section
            actions={<Button size="compact">Review</Button>}
            description="Six boundary conditions are ready for inspection."
            headingLevel={3}
            title="Boundary conditions"
          >
            <p className="showcase-muted">No unresolved geometry edges.</p>
          </Section>
        </Surface>
      </Specimen>

      <Specimen
        description="Bound overflowing content without losing its accessible name or keyboard access. The scrollbar appears during activity or focus and fades when idle."
        name="ScrollRegion"
      >
        <ScrollRegion label="Solver event log" size="compact">
          <ol className="showcase-log">
            {Array.from({length: 10}, (_, index) => (
              <li key={index}>Pass {String(index + 1).padStart(2, '0')} · residual converged</li>
            ))}
          </ol>
        </ScrollRegion>
      </Specimen>
    </>
  );
}

function ApplicationStructureSpecimens() {
  return (
    <>
      <Specimen
        description="Keep page ancestry, an optional page identifier, optional status content, title, description, and page-level actions distinct. Route occupies only the flexible space between identifier and status when both are present."
        name="PageHeader"
      >
        <PageHeader
          actions={
            <ButtonGroup label="Run actions">
              <Button size="compact" variant="secondary">
                Review
              </Button>
              <Button size="compact">Run profile</Button>
            </ButtonGroup>
          }
          breadcrumbs={
            <Breadcrumbs
              ariaLabel="Run location"
              items={[
                {href: '#page-header-workspace', id: 'workspace', label: 'Workspace'},
                {href: '#page-header-runs', id: 'runs', label: 'Runs'},
                {href: '#page-header-current', id: 'current', label: 'RUN 0284'},
              ]}
            />
          }
          description="Evaluate the 18-minute ramp profile."
          headingLevel={3}
          identity="SIM / THERMAL / 0284"
          status={
            <span data-showcase-page-status="">
              <span>Run state</span>
              <strong>Converged</strong>
            </span>
          }
          statusTone="success"
          title="North chamber"
        />
      </Specimen>

      <Specimen
        description="Resize two named workspace panes within application-owned bounds. Either pane can collapse through its own pane-target control, and compact containers stack both panes without changing their reading order."
        name="SplitView"
      >
        <SplitView
          ariaLabel="Run workspace"
          collapsePrimaryLabel="Hide run configuration"
          collapseSecondaryLabel="Hide run inspector"
          defaultPrimarySize={58}
          primary={
            <Section headingLevel={3} title="Run configuration">
              <Stack gap="regular">
                <Select
                  defaultValue="adaptive"
                  emptyMessage="No solvers"
                  label="Solver"
                  options={[
                    {label: 'Adaptive mesh', value: 'adaptive'},
                    {label: 'Finite volume', value: 'volume'},
                  ]}
                />
                <NumberField
                  defaultValue={18}
                  label="Boundary passes"
                  locale="en-US"
                  minValue={1}
                />
              </Stack>
            </Section>
          }
          primaryLabel="Run configuration"
          resizeLabel="Resize run inspector"
          restorePrimaryLabel="Show run configuration"
          restoreSecondaryLabel="Show run inspector"
          secondary={
            <Section headingLevel={3} title="Run inspector">
              <Stack gap="regular">
                <StatusIndicator label="Converged" tone="success" />
                <p>RUN 0284 converged after 18 boundary passes.</p>
              </Stack>
            </Section>
          }
          secondaryLabel="Run inspector"
        />
      </Specimen>
    </>
  );
}

function ActionSpecimens() {
  const [isPinned, setPinned] = useState(true);

  return (
    <>
      <Specimen
        description="Run a one-time action with emphasis matched to its consequence. Use Link for navigation and ToggleButton for an action that retains an on or off state."
        name="Button"
      >
        <InlineGroup gap="regular" wrap>
          <Example label="Primary Button">
            <Button variant="primary">Run profile</Button>
          </Example>
          <Example label="Secondary Button">
            <Button variant="secondary">Review</Button>
          </Example>
          <Example label="Quiet Button">
            <Button variant="quiet">Save draft</Button>
          </Example>
          <Example label="Danger Button">
            <Button variant="danger">Discard</Button>
          </Example>
          <Example label="Pending Button">
            <Button isPending pendingLabel="Running thermal profile">
              Run profile
            </Button>
          </Example>
          <Example label="Disabled Button">
            <Button isDisabled>Unavailable</Button>
          </Example>
        </InlineGroup>
      </Specimen>

      <Specimen
        description="Fit a familiar action into icon-sized space. The required label supplies its accessible name and tooltip; use Button when visible wording would help."
        name="IconButton"
      >
        <InlineGroup gap="regular">
          <Example label="Secondary IconButton">
            <IconButton label="Add condition">
              <AddIcon />
            </IconButton>
          </Example>
          <Example label="Quiet IconButton">
            <IconButton label="Advance to result" variant="quiet">
              <ArrowIcon />
            </IconButton>
          </Example>
          <Example label="Disabled IconButton">
            <IconButton isDisabled label="Add condition unavailable">
              <AddIcon />
            </IconButton>
          </Example>
        </InlineGroup>
      </Specimen>

      <Specimen
        description="Navigate to another destination. Use Button for an action that changes the current page without taking the user somewhere else."
        name="Link"
      >
        <InlineGroup gap="regular" wrap>
          <Example label="Current-page Link">
            <Link current="page" href="#link">
              Component showcase
            </Link>
          </Example>
          <Example label="Destination Link">
            <Link href="#toolbar">Toolbar specimen</Link>
          </Example>
          <Example label="Disabled Link">
            <Link href="#link" isDisabled>
              Archived guide
            </Link>
          </Example>
        </InlineGroup>
      </Specimen>

      <Specimen
        description="Keep an action visibly on or off, such as pinning a result. Use Switch for an immediately applied setting and Button for a one-time command."
        name="ToggleButton"
      >
        <InlineGroup gap="regular" wrap>
          <Example label={`${isPinned ? 'Selected' : 'Unselected'} ToggleButton`}>
            <ToggleButton isSelected={isPinned} onChange={setPinned}>
              Pin result
            </ToggleButton>
          </Example>
          <Example label="Quiet ToggleButton">
            <ToggleButton defaultSelected={false} variant="quiet">
              Show mesh
            </ToggleButton>
          </Example>
          <Example label="Disabled ToggleButton">
            <ToggleButton isDisabled>Lock scale</ToggleButton>
          </Example>
        </InlineGroup>
      </Specimen>

      <Specimen
        description="Present a few related commands as one visual set while keeping every control in normal Tab order. Use Toolbar when arrow-key navigation is expected."
        name="ButtonGroup"
      >
        <Example label="2 secondary Buttons + IconButton">
          <ButtonGroup equalItems label="Result commands">
            <Button>Duplicate</Button>
            <Button>Export</Button>
            <IconButton label="Add result">
              <AddIcon />
            </IconButton>
          </ButtonGroup>
        </Example>
      </Specimen>

      <Specimen
        description="Collect frequent controls into one named keyboard region with arrow-key navigation. Use ButtonGroup when every control should remain a separate Tab stop."
        name="Toolbar"
      >
        <Example label="2 quiet Buttons + ToggleButton + IconButton">
          <Toolbar label="Profile tools">
            <Button variant="quiet">Undo</Button>
            <Button variant="quiet">Redo</Button>
            <ToggleButton defaultSelected>Snap</ToggleButton>
            <IconButton label="Add step" variant="quiet">
              <AddIcon />
            </IconButton>
          </Toolbar>
        </Example>
      </Specimen>
    </>
  );
}

function NavigationSpecimens() {
  return (
    <>
      <Specimen
        description="Select one peer content panel without changing location. Tabs owns arrow movement, activation policy, and panel relationships; use route links for destinations."
        name="Tabs"
      >
        <Tabs
          activationMode="manual"
          ariaLabel="Run details"
          defaultSelectedId="summary"
          items={[
            {
              id: 'summary',
              label: 'Summary',
              panel: <p>RUN 0284 converged after 18 boundary passes.</p>,
            },
            {
              id: 'inputs',
              label: 'Inputs',
              panel: <p>The balanced profile uses 25 available boundary passes.</p>,
            },
            {
              id: 'history',
              label: 'History',
              panel: <p>Three prior result revisions remain available.</p>,
            },
          ]}
        />
      </Specimen>

      <Specimen
        description="Expose the current page within a hierarchy. A long path keeps its root and current location visible while an ellipsis opens collapsed ancestors without moving page content."
        name="Breadcrumbs"
      >
        <BreadcrumbShowcase />
      </Specimen>

      <Specimen
        description="Move through a finite numbered result collection. The current page, first and last pages, neighboring pages, and both direction controls remain explicit."
        name="Pagination"
      >
        <Pagination
          ariaLabel="Run result pages"
          currentPage={8}
          getPageHref={(page) => `#run-page-${page}`}
          getPageLabel={(_page, formattedPage) => `Page ${formattedPage}`}
          locale="en-US"
          nextLabel="Next result page"
          pageCount={20}
          previousLabel="Previous result page"
        />
      </Specimen>

      <Specimen
        description="Toggle one optional supporting section under a real heading. Required instructions and primary actions should stay visible."
        name="Disclosure"
      >
        <Disclosure defaultExpanded headingLevel={3} title="Advanced solver settings">
          <p>Iteration tolerance is 0.0001 with a 400-step limit.</p>
        </Disclosure>
      </Specimen>

      <Specimen
        description="Coordinate related optional sections with single or multiple expansion. Each item keeps its own heading, trigger, disabled state, and labeled panel."
        name="Accordion"
      >
        <Accordion
          ariaLabel="Run configuration"
          defaultExpandedIds={['geometry']}
          expansionMode="single"
          items={[
            {
              content: <p>Mesh scale and north-wall boundary conditions.</p>,
              id: 'geometry',
              title: 'Geometry',
            },
            {
              content: <p>Balanced precision with 25 boundary passes.</p>,
              id: 'solver',
              title: 'Solver',
            },
            {
              content: <p>Archived output settings are unavailable.</p>,
              id: 'output',
              isDisabled: true,
              title: 'Output',
            },
          ]}
        />
      </Specimen>

      <Specimen
        description="Navigate grouped application destinations without coupling the library to a router. The current link, hierarchy, URL, and compact collapse state remain explicit."
        name="CollapsibleNavigationPane"
      >
        <CollapsibleNavigationPane
          ariaLabel="Workspace navigation"
          collapseLabel="Collapse workspace navigation"
          currentId="active-runs"
          expandLabel="Expand workspace navigation"
          groups={[
            {
              id: 'workspace',
              items: [
                {href: '#overview', id: 'overview', label: 'Overview'},
                {
                  children: [
                    {href: '#active-runs', id: 'active-runs', label: 'Active runs'},
                    {href: '#run-history', id: 'run-history', label: 'Run history'},
                  ],
                  href: '#runs',
                  id: 'runs',
                  label: 'Runs',
                },
              ],
              label: 'Workspace',
            },
          ]}
        />
      </Specimen>
    </>
  );
}

function CollectionSpecimens() {
  const [query, setQuery] = useState<CollectionQueryFor<typeof runCollectionFilters>>({
    filters: [{filterId: 'status', value: 'converged'}],
    text: '',
  });
  const [sortDescriptor, setSortDescriptor] = useState<
    TableSortDescriptor<'actions' | 'profile' | 'run' | 'status'>
  >({column: 'run', direction: 'ascending'});
  const emptyState = {
    description: 'Create a run to populate this collection.',
    kind: 'no-data' as const,
    title: 'No runs yet',
  };
  const runRecords = [
    {id: 'run-284', profile: 'Balanced', run: 'RUN 0284', status: 'Converged'},
    {id: 'run-283', profile: 'Fast', run: 'RUN 0283', status: 'Converged'},
    {id: 'run-282', profile: 'Balanced', run: 'RUN 0282', status: 'Solving'},
    {id: 'run-281', profile: 'Fast', run: 'RUN 0281', status: 'Converged'},
    {id: 'run-280', profile: 'Balanced', run: 'RUN 0280', status: 'Converged'},
    {id: 'run-279', profile: 'Fast', run: 'RUN 0279', status: 'Solving'},
    {id: 'run-278', profile: 'Balanced', run: 'RUN 0278', status: 'Converged'},
    {id: 'run-277', profile: 'Fast', run: 'RUN 0277', status: 'Converged'},
  ] as const;
  const selectedFilters = new Map(query.filters.map((filter) => [filter.filterId, filter.value]));
  const visibleRuns = [
    ...runRecords.filter((run) => {
      const textMatches = run.run.toLocaleLowerCase().includes(query.text.toLocaleLowerCase());
      const status = selectedFilters.get('status');
      const profile = selectedFilters.get('profile');
      return (
        textMatches &&
        (status === undefined || run.status.toLocaleLowerCase() === status) &&
        (profile === undefined || run.profile.toLocaleLowerCase() === profile)
      );
    }),
  ].sort((first, second) => {
    if (sortDescriptor.column === 'actions') return 0;
    const direction = sortDescriptor.direction === 'ascending' ? 1 : -1;
    return first[sortDescriptor.column].localeCompare(second[sortDescriptor.column]) * direction;
  });

  return (
    <>
      <Specimen
        description="Present a readable sequence without adding widget behavior. Numbered markers communicate order, while stable item ids preserve updates."
        name="List"
      >
        <List
          ariaLabel="Run sequence"
          emptyState={emptyState}
          items={[
            {id: 'prepare', primary: 'Prepare mesh', secondary: 'Complete'},
            {id: 'solve', primary: 'Solve model', secondary: 'Running'},
            {id: 'publish', primary: 'Publish result', secondary: 'Waiting'},
          ]}
          marker="number"
        />
      </Specimen>

      <Specimen
        description="Pair terms with values for compact structured facts. This is a description list, not a two-column data table."
        name="DescriptionList"
      >
        <DescriptionList
          ariaLabel="Run details"
          emptyState={emptyState}
          items={[
            {description: 'RUN 0284', id: 'run', term: 'Run'},
            {description: 'Balanced', id: 'profile', term: 'Profile'},
            {description: '18 of 25', id: 'passes', term: 'Boundary passes'},
          ]}
        />
      </Specimen>

      <Specimen
        description="Choose one or more items with separate focus and selection. Arrow keys and typeahead move focus; activation changes selection."
        name="ListBox"
      >
        <ListBox
          ariaLabel="Compared runs"
          defaultSelectedIds={['run-284']}
          emptyState={emptyState}
          items={[
            {description: 'RUN 0284 · Converged', id: 'run-284', label: 'Alpha run'},
            {description: 'RUN 0283 · Converged', id: 'run-283', label: 'Beta run'},
            {
              description: 'RUN 0282 · Archived',
              id: 'run-282',
              isDisabled: true,
              label: 'Gamma run',
            },
          ]}
          selectionMode="multiple"
        />
      </Specimen>

      <Specimen
        description="Group summary cards without making each card a hidden button. Selection is explicit, and commands remain visible nested actions."
        name="CardCollection"
      >
        <Stack gap="regular">
          <Example label="Static cards with a nested action">
            <CardCollection
              ariaLabel="Recent runs"
              emptyState={emptyState}
              headingLevel={3}
              items={[
                {
                  actions: <Button size="compact">Inspect run</Button>,
                  description: 'Completed two minutes ago',
                  id: 'alpha',
                  title: 'Alpha run',
                },
                {
                  content: '12 output files',
                  description: 'Completed yesterday',
                  id: 'beta',
                  title: 'Beta run',
                },
              ]}
              selectionMode="none"
            />
          </Example>
          <Example label="Selectable card grid">
            <CardCollection
              ariaLabel="Selectable run cards"
              defaultSelectedId="north"
              emptyState={emptyState}
              headingLevel={3}
              items={[
                {description: 'RUN 0284', id: 'north', title: 'North chamber'},
                {description: 'RUN 0283', id: 'south', title: 'South chamber'},
                {description: 'RUN 0282', id: 'east', title: 'East chamber'},
                {description: 'RUN 0281', id: 'west', title: 'West chamber'},
              ]}
              selectionMode="single"
            />
          </Example>
        </Stack>
      </Specimen>

      <Specimen
        description="Report a complete text and categorical query while the parent keeps filtering and data fetching. Applied criteria remain visible and removable."
        name="CollectionFilterBar"
      >
        <CollectionFilterBar
          appliedFiltersLabel="Applied query"
          ariaLabel="Filter run results"
          clearAllLabel="Clear query"
          filters={runCollectionFilters}
          getFilterSummary={(filter, option) => `${filter}: ${option}`}
          getRemoveLabel={(summary) => `Remove ${summary}`}
          getSearchSummary={(text) => `Search: ${text}`}
          onQueryChange={setQuery}
          query={query}
          searchClearLabel="Clear run search"
          searchLabel="Search runs"
          searchPlaceholder="RUN number"
        />
      </Specimen>

      <Specimen
        description="Compare typed columns and sort application-owned rows. Selection stays separate from visible controls in the actions column."
        name="Table"
      >
        <Table
          ariaLabel="Filtered run results"
          columns={[
            {allowsSorting: true, id: 'run', isRowHeader: true, label: 'Run'},
            {allowsSorting: true, id: 'status', label: 'Status'},
            {allowsSorting: true, id: 'profile', label: 'Profile'},
            {id: 'actions', kind: 'actions', label: 'Actions'},
          ]}
          defaultSelectedIds={['run-284']}
          emptyState={{
            description: 'Clear or change the current query.',
            kind: 'no-results',
            title: 'No matching runs',
          }}
          onSortChange={setSortDescriptor}
          rows={visibleRuns.map((run) => ({
            cells: {
              actions: <Button size="compact">Inspect {run.run}</Button>,
              profile: run.profile,
              run: run.run,
              status: run.status,
            },
            id: run.id,
            textValue: run.run,
          }))}
          selectionMode="multiple"
          sortDescriptor={sortDescriptor}
        />
      </Specimen>

      <Specimen
        description="Navigate a stable keyed hierarchy with expansion and selection as separate states. Commands remain explicit nested controls."
        name="Tree"
      >
        <Tree
          ariaLabel="Study run hierarchy"
          collapseLabel="Collapse"
          defaultExpandedIds={['thermal-study']}
          defaultSelectedId="run-284"
          emptyState={emptyState}
          expandLabel="Expand"
          items={[
            {
              children: [
                {
                  actions: <Button size="compact">Inspect run</Button>,
                  description: 'Converged',
                  id: 'run-284',
                  label: 'RUN 0284',
                },
                {description: 'Solving', id: 'run-282', label: 'RUN 0282'},
              ],
              id: 'thermal-study',
              label: 'Thermal study',
            },
            {
              children: [{id: 'run-191', label: 'RUN 0191'}],
              id: 'airflow-study',
              label: 'Airflow study',
            },
          ]}
          selectionMode="single"
        />
      </Specimen>
    </>
  );
}

function BreadcrumbShowcase() {
  const [currentLocation, setCurrentLocation] = useState<BreadcrumbShowcaseLocation>('run');
  const page = breadcrumbShowcasePages[currentLocation];

  function navigateToAncestor(event: MouseEvent<HTMLDivElement>) {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (href && href in breadcrumbLocationByHref) {
      setCurrentLocation(breadcrumbLocationByHref[href as keyof typeof breadcrumbLocationByHref]);
    }
  }

  return (
    <div data-showcase-breadcrumb-route="" onClickCapture={navigateToAncestor}>
      <Breadcrumbs
        ariaLabel="Run location"
        items={breadcrumbShowcasePaths[currentLocation]}
        maxVisible={3}
      />
      <div data-showcase-breadcrumb-page="">
        <strong>{page.title}</strong>
        <p>{page.description}</p>
        {'next' in page ? <Link href={page.next.href}>{page.next.label}</Link> : null}
      </div>
    </div>
  );
}

function FieldSpecimens() {
  return (
    <>
      <Specimen
        description="Use Field when an application-owned control has no library equivalent. It supplies the shared label, support text, and state wiring around this circular phase dial, while the dial owns its value and interaction."
        name="Field"
      >
        <Field
          description="Drag around the orbit or use arrow keys. Page Up and Page Down move by 30°."
          label="Rotor phase relationship"
        >
          {(controlProps) => <PhaseAngleDial {...controlProps} />}
        </Field>
      </Specimen>

      <Specimen
        description="Collect one line of general text. Use SearchField for query submission, TextArea for meaningful line breaks, and NumberField for parsed numeric values."
        name="TextField"
      >
        <ResponsiveGrid equalItems gap="regular" minimumItemWidth="compact">
          <TextField
            description="Visible in exported reports."
            label="Run name"
            placeholder="North chamber"
          />
          <TextField
            errorMessage="Use at least three characters."
            isInvalid
            label="Run code"
            value="N"
            onChange={() => undefined}
          />
        </ResponsiveGrid>
      </Specimen>

      <Specimen
        description="Collect multiline plain text with a deliberate initial height. Use TextField when line breaks carry no meaning."
        name="TextArea"
      >
        <TextArea
          defaultValue="Inspect the north boundary after convergence."
          description="Plain text review context for this run."
          label="Review notes"
          rows={3}
        />
      </Specimen>

      <Specimen
        description="Collect a numeric value with locale formatting, bounds, and step controls. Use TextField when the entered characters must remain text instead of being parsed as a number."
        name="NumberField"
      >
        <NumberField
          defaultValue={0.0025}
          description="Accepted range: 0–0.01 K."
          formatOptions={{maximumFractionDigits: 4}}
          label="Tolerance"
          locale="en-US"
          maxValue={0.01}
          minValue={0}
          step={0.0005}
        />
      </Specimen>

      <Specimen
        description="Collect a query that can be submitted or cleared. Unlike TextField, it has search semantics and shows a clear action only while it contains text."
        name="SearchField"
      >
        <SearchField
          clearLabel="Clear run query"
          defaultValue="thermal"
          description="Search run name, owner, or identifier."
          label="Search runs"
        />
      </Specimen>

      <Specimen
        description="Give one related set of fields a legend, align their labels and controls, and optionally disable them together. Use FormSection for a larger workflow that may contain several groups."
        name="FieldGroup"
      >
        <FieldGroup
          columns="responsive"
          description="These values define the solver boundary."
          legend="Boundary inputs"
        >
          <TextField
            defaultValue="Adaptive mesh"
            label="Solver configuration strategy for localized runs"
          />
          <NumberField defaultValue={0.0025} label="Tolerance" locale="en-US" step={0.0005} />
        </FieldGroup>
      </Specimen>

      <Specimen
        description="Divide a larger form workflow under a visible heading and description. It provides structure and spacing, not shared field state; use FieldGroup for one related set of inputs."
        name="FormSection"
      >
        <FormSection
          description="Configure values before reviewing conditions."
          headingLevel={3}
          title="Solver setup"
        >
          <FieldGroup columns="one" legend="Profile identity">
            <TextField defaultValue="North chamber" label="Run name" />
          </FieldGroup>
        </FormSection>
      </Specimen>
    </>
  );
}

function ChoiceSpecimens() {
  return (
    <>
      <Specimen
        description="Include one optional value or acknowledge one condition. Use CheckboxGroup for related multi-select options and Switch for an immediately applied setting. Indeterminate reports mixed child state rather than a third value, while invalid hover stays in the danger family."
        name="Checkbox"
      >
        <InlineGroup align="start" gap="regular" wrap>
          <Example label="Selected Checkbox">
            <Checkbox defaultSelected label="Include mesh" name="features" value="mesh" />
          </Example>
          <Example label="Indeterminate Checkbox">
            <Checkbox isIndeterminate label="All result layers" />
          </Example>
          <Example label="Invalid required Checkbox">
            <Checkbox
              errorMessage="Review unresolved conditions before continuing."
              isInvalid
              isRequired
              label="Review unresolved conditions"
            />
          </Example>
        </InlineGroup>
      </Specimen>

      <Specimen
        description="Choose any number of related values under one accessible question. If one option has supporting text, every checkbox stays aligned with its first line."
        name="CheckboxGroup"
      >
        <CheckboxGroup
          defaultValue={['thermal']}
          description="Select every layer to retain in the exported result."
          label="Result layers"
          name="layers"
          options={[
            {label: 'Thermal', value: 'thermal'},
            {
              description: 'Used for load and stress review.',
              label: 'Pressure',
              value: 'pressure',
            },
            {isDisabled: true, label: 'Velocity unavailable', value: 'velocity'},
          ]}
        />
      </Specimen>

      <Specimen
        description="Choose exactly one answer while keeping every option visible. Use Select to collapse a longer list and SegmentedControl for a few compact modes."
        name="RadioGroup"
      >
        <RadioGroup
          defaultValue="balanced"
          description="The selected mode applies to the next run."
          label="Run mode"
          name="mode"
          options={runModeOptions}
        />
      </Specimen>

      <Specimen
        description="Turn one immediately applied setting on or off. Use Checkbox for optional inclusion or acknowledgement and ToggleButton for a retained command state."
        name="Switch"
      >
        <InlineGroup align="start" gap="regular" wrap>
          <Example label="On Switch">
            <Switch defaultSelected label="Keep results synchronized" />
          </Example>
          <Example label="Read-only Switch">
            <Switch defaultSelected isReadOnly label="Pin approved result" />
          </Example>
          <Example label="Disabled Switch">
            <Switch isDisabled label="Stream intermediate frames" />
          </Example>
        </InlineGroup>
      </Specimen>

      <Specimen
        description="Choose one of a few compact peer modes that should stay visible. Use RadioGroup for longer labels or supporting text and Select when the choices should collapse."
        name="SegmentedControl"
      >
        <SegmentedControl
          defaultValue="balanced"
          label="Display density"
          name="density"
          options={densityOptions}
        />
      </Specimen>
    </>
  );
}

function SelectionSpecimens() {
  return (
    <>
      <Specimen
        description="Choose one value from a finite list that stays collapsed until opened. Select owns the styled trigger and list, option states, typeahead, form behavior, and viewport-aware placement."
        name="Select"
      >
        <Select
          defaultValue="balanced"
          description="Every mode is known before the run starts."
          emptyMessage="No run modes"
          label="Run mode"
          name="mode"
          options={runModeOptions}
        />
      </Specimen>

      <Specimen
        description="Choose one value from a list the user can filter by typing. Use Select when text entry would not help; ComboBox keeps the typed query separate from the selected value."
        name="ComboBox"
      >
        <ResponsiveGrid equalItems gap="regular" minimumItemWidth="compact">
          <Example label="Local filtered ComboBox">
            <ComboBox
              description="Type to filter the local mode catalog."
              emptyMessage="No matching modes"
              label="Find run mode"
              options={runModeOptions}
              placeholder="Type a mode"
            />
          </Example>
          <Example label="Loading manual ComboBox">
            <ComboBox
              emptyMessage="No remote modes"
              filterBehavior="manual"
              inputValue="thermal"
              isLoading
              label="Remote mode"
              loadingMessage="Loading remote modes"
              onInputChange={() => undefined}
              options={[]}
            />
          </Example>
        </ResponsiveGrid>
      </Specimen>
    </>
  );
}

function RangeSpecimens() {
  return (
    <>
      <Specimen
        description="Adjust an approximate value on a formatted scale with keyboard, pointer, or touch input. Use NumberField when users must enter or read an exact value. Only interactive thumbs dilate on hover."
        name="Slider"
      >
        <ResponsiveGrid equalItems gap="regular" minimumItemWidth="compact">
          <Example label="Horizontal percentage Slider">
            <Slider
              defaultValue={0.4}
              description="Sets the solver confidence threshold."
              formatOptions={{style: 'percent'}}
              label="Confidence"
              locale="en-US"
              maxValue={1}
              minValue={0}
              step={0.05}
            />
          </Example>
          <Example label="Vertical read-only Slider">
            <Slider
              defaultValue={7}
              isReadOnly
              label="Approved passes"
              locale="en-US"
              maxValue={10}
              minValue={0}
              orientation="vertical"
              step={1}
            />
          </Example>
        </ResponsiveGrid>
      </Specimen>

      <Specimen
        description="Adjust numeric lower and upper bounds on one shared scale. The named bounds cannot cross, and their offset thumbs stay distinct when close."
        name="RangeSlider"
      >
        <ResponsiveGrid equalItems gap="regular" minimumItemWidth="compact">
          <Example label="Close RangeSlider bounds">
            <RangeSlider
              defaultValue={[45, 55]}
              description="Keep the detailed review centered on the transition."
              label="Review window"
              locale="en-US"
              maxValue={100}
              minValue={0}
              step={5}
              thumbLabels={['Window start', 'Window end']}
            />
          </Example>
          <Example label="Invalid RangeSlider">
            <RangeSlider
              defaultValue={[20, 80]}
              errorMessage="Keep the interval within the approved band."
              isInvalid
              label="Retained interval"
              locale="en-US"
              maxValue={100}
              minValue={0}
              step={5}
              thumbLabels={['Lower bound', 'Upper bound']}
            />
          </Example>
        </ResponsiveGrid>
      </Specimen>
    </>
  );
}

function DateTimeSpecimens() {
  return (
    <>
      <Specimen
        description="Enter a date directly through editable locale-aware segments without opening a calendar. Use DatePicker when visual day selection helps."
        name="DateField"
      >
        <ResponsiveGrid equalItems gap="regular" minimumItemWidth="compact">
          <Example label="Gregorian DateField">
            <DateField
              calendar="gregory"
              defaultValue={{day: 20, month: 8, year: 2026}}
              description="Stored and submitted as an ISO calendar date."
              label="Run date"
              locale="en-US"
            />
          </Example>
          <Example label="Japanese-calendar DateField">
            <DateField
              calendar="japanese"
              defaultValue={{day: 20, month: 8, year: 2026}}
              label="Review date"
              locale="ja-JP"
            />
          </Example>
        </ResponsiveGrid>
      </Specimen>

      <Specimen
        description="Enter a wall-clock time without attaching a time zone or date. The chosen hour cycle and granularity control which editable segments appear."
        name="TimeField"
      >
        <ResponsiveGrid equalItems gap="regular" minimumItemWidth="compact">
          <Example label="24-hour TimeField">
            <TimeField
              defaultValue={{hour: 14, minute: 30, second: 0}}
              granularity="minute"
              hourCycle={24}
              label="Daily review"
              locale="en-US"
            />
          </Example>
          <Example label="Read-only 12-hour TimeField">
            <TimeField
              defaultValue={{hour: 9, minute: 15, second: 0}}
              granularity="minute"
              hourCycle={12}
              isReadOnly
              label="Approved start"
              locale="en-US"
            />
          </Example>
        </ResponsiveGrid>
      </Specimen>

      <Specimen
        description="Enter a date through segments or choose it from a fixed six-week calendar. Invalid segment focus uses danger emphasis without changing valid calendar-day hover. Use DateField when the calendar adds no value. Select the month or year heading for long-distance navigation."
        name="DatePicker"
      >
        <ResponsiveGrid equalItems gap="regular" minimumItemWidth="compact">
          <Example label="Bounded DatePicker">
            <DatePicker
              calendar="gregory"
              calendarButtonLabel="Choose review date"
              defaultValue={{day: 20, month: 8, year: 2026}}
              isDateUnavailable={(date) => date.day === 21 || date.day === 22}
              label="Review date"
              locale="en-US"
              maxValue={{day: 31, month: 8, year: 2026}}
              minValue={{day: 18, month: 8, year: 2026}}
              placeholderValue={{day: 20, month: 8, year: 2026}}
            />
          </Example>
          <Example label="Invalid DatePicker">
            <DatePicker
              calendar="gregory"
              calendarButtonLabel="Choose deployment date"
              errorMessage="Choose an approved deployment day."
              isInvalid
              label="Deployment date"
              locale="en-US"
              placeholderValue={{day: 20, month: 8, year: 2026}}
            />
          </Example>
        </ResponsiveGrid>
      </Specimen>

      <Specimen
        description="Choose an inclusive date interval from two adjacent months. A start click keeps the old end visible, an end click completes and closes, and dragging either endpoint keeps the calendar open."
        name="DateRangePicker"
      >
        <ResponsiveGrid equalItems gap="regular" minimumItemWidth="compact">
          <Example label="DateRangePicker interval">
            <DateRangePicker
              calendar="gregory"
              calendarButtonLabel="Choose review window"
              defaultValue={{
                start: {day: 20, month: 8, year: 2026},
                end: {day: 27, month: 8, year: 2026},
              }}
              description="Both dates are included. Drag either endpoint or click start, then end."
              label="Review window"
              locale="en-US"
              placeholderValue={{day: 20, month: 8, year: 2026}}
            />
          </Example>
          <Example label="Disabled DateRangePicker">
            <DateRangePicker
              calendar="gregory"
              calendarButtonLabel="Choose archived window"
              isDisabled
              label="Archived window"
              locale="en-US"
              placeholderValue={{day: 20, month: 8, year: 2026}}
            />
          </Example>
        </ResponsiveGrid>
      </Specimen>
    </>
  );
}

function announceFiles({files, rejectedFiles}: FileAcquisitionResult): string {
  if (rejectedFiles.length > 0) {
    return `${rejectedFiles.length} file${rejectedFiles.length === 1 ? '' : 's'} rejected.`;
  }
  return `${files.length} file${files.length === 1 ? '' : 's'} accepted.`;
}

function FileSpecimens() {
  const [latestFiles, setLatestFiles] = useState<readonly string[]>([]);

  const rememberFiles = ({files}: FileAcquisitionResult) => {
    setLatestFiles(files.map((file) => file.name));
  };

  return (
    <>
      <Specimen
        description="Open the native file picker from a compact labeled button. Use DropZone when drag and paste should work too. FileTrigger applies constraints and reports accepted or rejected files, then the application manages them."
        name="FileTrigger"
      >
        <ResponsiveGrid equalItems gap="regular" minimumItemWidth="compact">
          <Example label="Multiple-image FileTrigger">
            <FileTrigger
              acceptedFileTypes={['image/png', '.jpg']}
              allowsMultiple
              description="PNG or JPG, up to 2 MB each."
              getAnnouncement={announceFiles}
              label="Choose reference images"
              maxFileSize={2_000_000}
              onFiles={rememberFiles}
            />
          </Example>
          <Example label="Pending FileTrigger">
            <FileTrigger
              getAnnouncement={announceFiles}
              isPending
              label="Choose replacement dataset"
              onFiles={rememberFiles}
              pendingMessage="Checking the current dataset"
            />
          </Example>
        </ResponsiveGrid>
      </Specimen>

      <Specimen
        description="Use a large acquisition target when drag, focused paste, and browsing should all work. Use FileTrigger for a compact button-only flow. The file icon moves only while the target is enabled, and invalid hover stays in the danger family."
        name="DropZone"
      >
        <ResponsiveGrid equalItems gap="regular" minimumItemWidth="compact">
          <Example label="Image-and-PDF DropZone">
            <DropZone
              acceptedFileTypes={['image/*', 'application/pdf']}
              actionLabel="Browse evidence"
              allowsMultiple
              description="Drop, paste, or browse for images and PDFs up to 10 MB each."
              getAnnouncement={announceFiles}
              label="Evidence"
              maxFileSize={10_000_000}
              onFiles={rememberFiles}
            >
              {latestFiles.length > 0 ? `Latest: ${latestFiles.join(', ')}` : 'No files acquired.'}
            </DropZone>
          </Example>
          <Example label="Invalid DropZone">
            <DropZone
              actionLabel="Browse solver inputs"
              description="One JSON input file is required."
              errorMessage="Choose a valid solver input."
              getAnnouncement={announceFiles}
              isInvalid
              label="Solver input"
              onFiles={rememberFiles}
            />
          </Example>
          <Example label="Disabled DropZone">
            <DropZone
              actionLabel="Browse archived evidence"
              description="File acquisition is unavailable."
              getAnnouncement={announceFiles}
              isDisabled
              label="Archived evidence"
              onFiles={rememberFiles}
            />
          </Example>
        </ResponsiveGrid>
      </Specimen>
    </>
  );
}

function FeedbackSpecimens() {
  const [isNotificationStackCapped, setNotificationStackCapped] = useState(false);

  return (
    <>
      <Specimen
        description="Label the current state of an object or process with a tone. Use Badge for static metadata and InlineAlert when the user needs an explanation or action. Announcements are opt-in."
        name="StatusIndicator"
      >
        <InlineGroup gap="regular" wrap>
          <Example label="Success StatusIndicator">
            <StatusIndicator label="Stable" tone="success" />
          </Example>
          <Example label="Warning StatusIndicator">
            <StatusIndicator label="Solving" tone="warning" />
          </Example>
          <Example label="Danger StatusIndicator">
            <StatusIndicator label="Failed" tone="danger" />
          </Example>
          <Example label="Neutral StatusIndicator">
            <StatusIndicator label="Not started" tone="neutral" />
          </Example>
        </InlineGroup>
      </Specimen>

      <Specimen
        description="Report the ordered status of a staged process without turning its stages into navigation or prescribing the surrounding workflow. Use ProgressBar when one stage also has measurable progress."
        name="ProcessTracker"
      >
        <ResponsiveGrid equalItems gap="regular" minimumItemWidth="compact">
          <Example label="Active ProcessTracker">
            <ProcessTracker
              ariaLabel="Thermal solve stages"
              stages={[
                {
                  description: '12 surfaces, no open edges',
                  id: 'geometry',
                  label: 'Geometry validated',
                  status: 'complete',
                },
                {
                  description: '4 of 6 conditions resolved',
                  id: 'boundary',
                  label: 'Boundary pass',
                  status: 'active',
                },
                {id: 'solve', label: 'Solve pending', status: 'pending'},
              ]}
              statusLabels={{
                active: 'Active',
                complete: 'Complete',
                failed: 'Failed',
                pending: 'Pending',
                warning: 'Needs review',
              }}
            />
          </Example>
          <Example label="Interrupted ProcessTracker">
            <ProcessTracker
              ariaLabel="Import stages"
              stages={[
                {id: 'read', label: 'Source read', status: 'complete'},
                {
                  description: 'Two records need review',
                  id: 'validate',
                  label: 'Validation',
                  status: 'warning',
                },
                {id: 'write', label: 'Write stopped', status: 'failed'},
              ]}
              statusLabels={{
                active: 'Active',
                complete: 'Complete',
                failed: 'Failed',
                pending: 'Pending',
                warning: 'Needs review',
              }}
            />
          </Example>
        </ResponsiveGrid>
      </Specimen>

      <Specimen
        description="Attach short metadata or an identifier to an object without creating a live status region. Use StatusIndicator when the text represents current state."
        name="Badge"
      >
        <InlineGroup gap="regular" wrap>
          <Example label="Accent identity Badge">
            <Badge tone="accent">RUN 0284</Badge>
          </Example>
          <Example label="Neutral metadata Badge">
            <Badge>THERMAL</Badge>
          </Example>
          <Example label="Success metadata Badge">
            <Badge tone="success">25 PASSES</Badge>
          </Example>
        </InlineGroup>
      </Specimen>

      <Specimen
        description="Explain feedback tied to a nearby region without shifting its layout. Use AlertBanner for a condition that affects the whole page or workspace. Announcements are optional."
        name="InlineAlert"
      >
        <InlineAlert title="Boundary review" tone="warning">
          Check the north wall coefficient before running the profile.
        </InlineAlert>
      </Specimen>

      <Specimen
        description="Explain a condition that affects the whole page or workspace. Use InlineAlert when the message belongs to one nearby region."
        name="AlertBanner"
      >
        <AlertBanner title="Solver disconnected" tone="danger">
          Reconnect the solver before starting or resuming runs.
        </AlertBanner>
      </Specimen>

      <Specimen
        description="Report how far a task has progressed. Provide a value when completion is measurable; use the indeterminate state while the total is unknown and Spinner when only a compact busy signal fits."
        name="ProgressBar"
      >
        <ResponsiveGrid equalItems gap="regular" minimumItemWidth="compact">
          <Example label="Determinate ProgressBar">
            <ProgressBar
              completionLabel="Complete when all 25 boundary passes are solved."
              isActive
              label="Solving boundary passes"
              maxValue={25}
              minValue={0}
              value={18}
              valueLabel="18 of 25 passes"
            />
          </Example>
          <Example label="Indeterminate ProgressBar">
            <ProgressBar
              completionLabel="Complete when the solver returns a converged result."
              isActive
              isIndeterminate
              label="Preparing solver"
              statusLabel="Estimating remaining work"
            />
          </Example>
          <Example label="Paused ProgressBar">
            <ProgressBar
              completionLabel="Complete when all 25 boundary passes are solved."
              isActive={false}
              label="Boundary solve paused"
              maxValue={25}
              minValue={0}
              value={18}
              valueLabel="18 of 25 passes"
            />
          </Example>
        </ResponsiveGrid>
      </Specimen>

      <Specimen
        description="Show a current measurement against a known range and named warning or danger thresholds. Meter describes a level, not task completion."
        name="Meter"
      >
        <Meter
          label="Thermal load"
          maxValue={100}
          minValue={0}
          thresholds={[
            {label: 'Review begins', tone: 'warning', value: 70, valueLabel: '70 kilowatts'},
            {label: 'Unsafe begins', tone: 'danger', value: 90, valueLabel: '90 kilowatts'},
          ]}
          tone="warning"
          value={76}
          valueLabel="76 kilowatts"
        />
      </Specimen>

      <Specimen
        description="Show a compact busy signal when detailed progress is unavailable or unnecessary. Six capsules animate while active, and the inactive state can reserve the same layout space."
        name="Spinner"
      >
        <InlineGroup gap="regular" wrap>
          <Example label="Active Spinner">
            <Spinner isActive label="Preparing solver" />
          </Example>
          <Example label="Inactive reserved Spinner">
            <Spinner isActive={false} label="Preparing solver" />
          </Example>
        </InlineGroup>
      </Specimen>

      <Specimen
        description="Reserve the approximate geometry of known content while it loads. The placeholder stays hidden from assistive technology, so name and mark the surrounding region as busy."
        name="Skeleton"
      >
        <ResponsiveGrid equalItems gap="regular" minimumItemWidth="compact">
          <Example label="Result-summary Skeleton">
            <div
              aria-busy="true"
              aria-label="Loading result summary"
              className="showcase-skeleton-region"
            >
              <Stack gap="regular">
                <Skeleton shape="heading" width="half" />
                <Skeleton lines={3} shape="text" />
              </Stack>
            </div>
          </Example>
          <Example label="Media Skeleton">
            <div className="showcase-skeleton-region">
              <Skeleton shape="media" />
            </div>
          </Example>
        </ResponsiveGrid>
      </Specimen>

      <Specimen
        description="Explain why a loaded content region has no data, no matching results, or unavailable content. Accent rails mark ordinary empty states; warning color ties an unavailable state to its recovery action."
        name="EmptyState"
      >
        <ResponsiveGrid equalItems gap="regular" minimumItemWidth="compact">
          <Example label="No-data EmptyState">
            <EmptyState
              actionLabel="Add boundary"
              description="Add a boundary condition before running the profile."
              kind="no-data"
              onAction={() => undefined}
              title="No boundary conditions"
            />
          </Example>
          <Example label="No-results EmptyState">
            <EmptyState
              description="Change or clear the current filters."
              kind="no-results"
              title="No matching runs"
            />
          </Example>
          <Example label="Unavailable EmptyState">
            <EmptyState
              actionLabel="Try again"
              description="The solver could not load this result."
              kind="unavailable"
              onAction={() => undefined}
              title="Result unavailable"
            />
          </Example>
        </ResponsiveGrid>
      </Specimen>

      <Specimen
        description="Compare general, success, warning, and error notifications directly. Toggle the three-message scroll viewport before adding messages to compare capped and uncapped stacking. Hover or focus the region to pause its lifetime rails."
        name="NotificationProvider"
      >
        <NotificationProvider
          key={isNotificationStackCapped ? 'capped' : 'uncapped'}
          dismissLabel="Dismiss notification"
          label="Showcase notifications"
          {...(isNotificationStackCapped ? {maxVisible: 3 as const} : {})}
        >
          {({notify}) => (
            <Stack gap="tight">
              <InlineGroup gap="tight">
                <ToggleButton
                  isSelected={isNotificationStackCapped}
                  onChange={setNotificationStackCapped}
                >
                  Cap stack at three
                </ToggleButton>
              </InlineGroup>
              <InlineGroup gap="tight" wrap>
                <Button
                  onPress={() =>
                    notify({
                      description: 'The latest solver inputs are in run history.',
                      title: 'Draft saved',
                      tone: 'general',
                    })
                  }
                >
                  Show general notification
                </Button>
                <Button
                  onPress={() =>
                    notify({
                      description: 'The export is available in run history.',
                      title: 'Export ready',
                      tone: 'success',
                    })
                  }
                >
                  Show success notification
                </Button>
                <Button
                  onPress={() =>
                    notify({
                      description: 'Archive older runs before the next batch.',
                      title: 'Storage nearly full',
                      tone: 'warning',
                    })
                  }
                >
                  Show warning notification
                </Button>
                <Button
                  onPress={() =>
                    notify({
                      actionLabel: 'Retry export',
                      description: 'The result remains available in run history.',
                      onAction: () => undefined,
                      title: 'Export failed',
                      tone: 'error',
                      urgency: 'assertive',
                    })
                  }
                >
                  Show error notification
                </Button>
              </InlineGroup>
            </Stack>
          )}
        </NotificationProvider>
      </Specimen>
    </>
  );
}

const barEnergyData = [
  {month: 'Jan', heating: 42, cooling: 16},
  {month: 'Feb', heating: 38, cooling: 22},
  {month: 'Mar', heating: 29, cooling: 34},
  {month: 'Apr', heating: 18, cooling: 40},
] as const;
const barEnergyRowId = (datum: (typeof barEnergyData)[number]) => datum.month;

function BarInteractionExample({
  orientation,
  visibilityLabels,
}: {
  readonly orientation: 'horizontal' | 'vertical';
  readonly visibilityLabels: ChartVisibilityLabels;
}) {
  const horizontal = orientation === 'horizontal';
  const name = horizontal ? 'BarChart' : 'ColumnChart';
  const [layout, setLayout] = useState<'grouped' | 'stacked' | 'normalized'>(
    horizontal ? 'stacked' : 'grouped',
  );
  const [target, setTarget] = useState<'category' | 'point'>(horizontal ? 'category' : 'point');
  const [selectionEnabled, setSelectionEnabled] = useState(true);
  const [detailsEnabled, setDetailsEnabled] = useState(true);
  const [selectedItems, setSelectedItems] = useState<readonly ChartSelectionItem[]>([]);
  const [details, setDetails] = useState<ChartActivation<
    (typeof barEnergyData)[number],
    (typeof barEnergyData)[number]['month']
  > | null>(null);
  const instructions = selectionEnabled
    ? `Click or tap to select ${target === 'category' ? 'a month' : 'a bar'}. Drag ${target === 'category' ? (horizontal ? 'vertically' : 'horizontally') + ' to select a month range' : 'a rectangle to select every bar it touches'}. A drag replaces selection; Shift or Control/Command adds, and Alt removes. Escape cancels a drag. Enter or Space selects.${detailsEnabled ? ' Control/Command-click, Control/Command plus Enter or Space, or a touch press-and-hold opens details without changing selection.' : ''}`
    : detailsEnabled
      ? 'Click, tap, or press Enter or Space to open details.'
      : 'Move across the chart or use the arrow keys to read its values.';
  const interaction: ChartInteraction<
    (typeof barEnergyData)[number],
    (typeof barEnergyData)[number]['month']
  > = {
    getRowId: barEnergyRowId,
    target,
    ...(detailsEnabled ? {onActivate: setDetails} : {}),
    ...(selectionEnabled
      ? {
          selection: {
            selectedItems,
            onSelectionChange: setSelectedItems,
            labels: {
              instructions,
              clear: 'Clear selection',
              empty: 'Nothing selected',
              hidden: (label) => `${label} (hidden)`,
              item: ({rowId, seriesId}) =>
                seriesId ? `${rowId}, ${seriesId === 'heating' ? 'Heating' : 'Cooling'}` : rowId,
              summary: (count) =>
                `${count} ${target === 'category' ? (count === 1 ? 'month' : 'months') : count === 1 ? 'bar' : 'bars'} selected`,
            },
          },
        }
      : {}),
  };
  const common = {
    ...chartStateCopy,
    data: barEnergyData,
    dataTableLabel: 'Monthly heating and cooling data',
    description:
      layout === 'grouped'
        ? 'Compare heating and cooling energy in each month.'
        : layout === 'stacked'
          ? "Heating and cooling contribute to each month's total energy use."
          : "Compare heating and cooling shares of each month's visible energy use.",
    interaction,
    legend: {label: 'Energy uses'},
    series: [
      {accessor: 'heating', id: 'heating', label: 'Heating'},
      {accessor: 'cooling', color: 'series-2', id: 'cooling', label: 'Cooling'},
    ],
    title: horizontal ? 'Energy use by month' : 'Monthly energy comparison',
    visibilityLabels,
  } as const;
  const categoryAxis = {accessor: 'month', label: 'Month', scale: {type: 'categorical'}} as const;
  const valueAxis = {
    label: 'Energy',
    scale: {type: 'linear'},
    showGrid: true,
    unit: 'MWh',
  } as const;

  return (
    <Stack gap="regular">
      <SegmentedControl
        label={`${name} layout`}
        onChange={setLayout}
        options={[
          {label: 'Grouped', value: 'grouped'},
          {label: 'Stacked', value: 'stacked'},
          {label: 'Normalized', value: 'normalized'},
        ]}
        value={layout}
      />
      <SegmentedControl
        label={`${name} click target`}
        onChange={(nextTarget) => {
          setTarget(nextTarget);
          setSelectedItems([]);
          setDetails(null);
        }}
        options={[
          {label: 'Month', value: 'category'},
          {label: 'Bar', value: 'point'},
        ]}
        value={target}
      />
      <InlineGroup align="start" gap="regular" wrap>
        <Switch
          isSelected={selectionEnabled}
          label="Enable selection"
          onChange={setSelectionEnabled}
        />
        <Switch
          isSelected={detailsEnabled}
          label="Open details on activation"
          onChange={(enabled) => {
            setDetailsEnabled(enabled);
            if (!enabled) setDetails(null);
          }}
        />
      </InlineGroup>
      <p>{instructions}</p>
      {horizontal ? (
        layout === 'normalized' ? (
          <BarChart
            {...common}
            layout={layout}
            xAxis={{label: 'Share of visible energy', scale: {type: 'normalized'}, showGrid: true}}
            yAxis={categoryAxis}
          />
        ) : (
          <BarChart {...common} layout={layout} xAxis={valueAxis} yAxis={categoryAxis} />
        )
      ) : layout === 'normalized' ? (
        <ColumnChart
          {...common}
          layout={layout}
          xAxis={categoryAxis}
          yAxis={{label: 'Share of visible energy', scale: {type: 'normalized'}, showGrid: true}}
        />
      ) : (
        <ColumnChart {...common} layout={layout} xAxis={categoryAxis} yAxis={valueAxis} />
      )}
      <p className="showcase-muted">
        {horizontal ? 'Up and Down' : 'Left and Right'} move between months;{' '}
        {horizontal ? 'Left and Right' : 'Up and Down'} move between series in Bar mode. Home and
        End reach the first and last months. The inset dashed outline previews the target. Selected
        bars have outer frames; selected months have underlined labels. In Month mode, the outline
        follows the combined bars, including the outside of a stack. Reading outlines remain visible
        inside selected frames. Activation gives brief feedback and opens the details below. Hidden
        bars remain selected and return when shown. Normalized readings use visible shares; details
        retain the original MWh values. These controls and details belong to this example.
      </p>
      {details ? (
        <Stack gap="regular">
          <DescriptionList
            ariaLabel={`${details.category} energy details`}
            emptyState={{
              kind: 'no-data',
              title: 'No readings',
              description: 'Choose a month with recorded values.',
            }}
            items={[
              {description: details.category, id: 'month', term: 'Month'},
              ...details.values.map(({hidden, label, seriesId, value}) => ({
                description: `${value} MWh${hidden ? ' (hidden on chart)' : ''}`,
                id: seriesId,
                term: label,
              })),
            ]}
          />
          <Button onPress={() => setDetails(null)} variant="quiet">
            Close details
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
}

function AreaMixedInteractionExample({
  kind,
  visibilityLabels,
}: {
  readonly kind: 'area' | 'mixed';
  readonly visibilityLabels: ChartVisibilityLabels;
}) {
  const name = kind === 'area' ? 'AreaChart' : 'CartesianChart';
  const [stacking, setStacking] = useState<'overlap' | 'stacked' | 'normalized'>('overlap');
  const [mixedKind, setMixedKind] = useState<'line' | 'area'>('line');
  const [target, setTarget] = useState<'category' | 'point'>('point');
  const [selectionEnabled, setSelectionEnabled] = useState(true);
  const [detailsEnabled, setDetailsEnabled] = useState(true);
  const [selectedItems, setSelectedItems] = useState<readonly ChartSelectionItem[]>([]);
  const [details, setDetails] = useState<ChartActivation<
    (typeof barEnergyData)[number],
    (typeof barEnergyData)[number]['month']
  > | null>(null);
  const instructions = selectionEnabled
    ? `Click or tap to select ${target === 'category' ? 'a month' : 'a value'}. Drag ${target === 'category' ? 'horizontally to select a month range' : kind === 'area' ? 'a rectangle around value markers to select them' : 'a rectangle to select enclosed value markers and intersected bars'}. A drag replaces selection; Shift or Control/Command adds, and Alt removes. Escape cancels a drag. Enter or Space selects.${detailsEnabled ? ' Control/Command-click, Control/Command plus Enter or Space, or a touch press-and-hold opens details without changing selection.' : ''}`
    : detailsEnabled
      ? 'Click, tap, or press Enter or Space to open details.'
      : 'Move across the chart or use the arrow keys to read its values.';
  const interaction: ChartInteraction<
    (typeof barEnergyData)[number],
    (typeof barEnergyData)[number]['month']
  > = {
    getRowId: barEnergyRowId,
    target,
    ...(detailsEnabled ? {onActivate: setDetails} : {}),
    ...(selectionEnabled
      ? {
          selection: {
            selectedItems,
            onSelectionChange: setSelectedItems,
            labels: {
              instructions,
              clear: 'Clear selection',
              empty: 'Nothing selected',
              hidden: (label) => `${label} (hidden)`,
              item: ({rowId, seriesId}) =>
                seriesId ? `${rowId}, ${seriesId === 'heating' ? 'Heating' : 'Cooling'}` : rowId,
              summary: (count) =>
                `${count} ${target === 'category' ? (count === 1 ? 'month' : 'months') : count === 1 ? 'value' : 'values'} selected`,
            },
          },
        }
      : {}),
  };
  const common = {
    ...chartStateCopy,
    data: barEnergyData,
    dataTableLabel: 'Monthly heating and cooling data',
    description:
      kind === 'mixed' || stacking === 'overlap'
        ? 'Heating demand falls as cooling demand rises across these months.'
        : stacking === 'stacked'
          ? "Heating and cooling contribute to each month's total energy use."
          : "Compare heating and cooling shares of each month's visible energy use.",
    interaction,
    legend: {label: 'Energy uses'},
    title: kind === 'area' ? 'Heating and cooling magnitude' : 'Heating and cooling comparison',
    visibilityLabels,
    xAxis: {accessor: 'month', label: 'Month', scale: {type: 'categorical'}},
  } as const;
  const areaSeries = [
    {accessor: 'heating', id: 'heating', label: 'Heating'},
    {accessor: 'cooling', color: 'series-2', id: 'cooling', label: 'Cooling'},
  ] as const;
  const valueAxis = {
    label: 'Energy',
    scale: {type: 'linear'},
    showGrid: true,
    unit: 'MWh',
  } as const;

  return (
    <Stack gap="regular">
      {kind === 'area' ? (
        <SegmentedControl
          label="AreaChart stacking"
          onChange={setStacking}
          options={[
            {label: 'Overlapping', value: 'overlap'},
            {label: 'Stacked', value: 'stacked'},
            {label: 'Normalized', value: 'normalized'},
          ]}
          value={stacking}
        />
      ) : (
        <SegmentedControl
          label="CartesianChart marks"
          onChange={setMixedKind}
          options={[
            {label: 'Columns and line', value: 'line'},
            {label: 'Columns and area', value: 'area'},
          ]}
          value={mixedKind}
        />
      )}
      <SegmentedControl
        label={`${name} click target`}
        onChange={(nextTarget) => {
          setTarget(nextTarget);
          setSelectedItems([]);
          setDetails(null);
        }}
        options={[
          {label: 'Month', value: 'category'},
          {label: 'Value', value: 'point'},
        ]}
        value={target}
      />
      <InlineGroup align="start" gap="regular" wrap>
        <Switch
          isSelected={selectionEnabled}
          label="Enable selection"
          onChange={setSelectionEnabled}
        />
        <Switch
          isSelected={detailsEnabled}
          label="Open details on activation"
          onChange={(enabled) => {
            setDetailsEnabled(enabled);
            if (!enabled) setDetails(null);
          }}
        />
      </InlineGroup>
      <p>{instructions}</p>
      {kind === 'mixed' ? (
        <CartesianChart
          {...common}
          series={[
            {...areaSeries[0], kind: 'column'},
            {
              ...areaSeries[1],
              ...(mixedKind === 'line' ? {kind: 'line', showPoints: true} : {kind: 'area'}),
            },
          ]}
          yAxis={valueAxis}
        />
      ) : stacking === 'normalized' ? (
        <AreaChart
          {...common}
          series={areaSeries}
          stacking="normalized"
          yAxis={{label: 'Share of visible energy', scale: {type: 'normalized'}, showGrid: true}}
        />
      ) : (
        <AreaChart {...common} series={areaSeries} stacking={stacking} yAxis={valueAxis} />
      )}
      <p className="showcase-muted">
        Left and Right move between months; Up and Down move between visible series in Value mode.
        Home and End reach the first and last months.{' '}
        {kind === 'area'
          ? "Filled markers preview values at each area's upper boundary. Outer rings mark selected values, including in stacked and normalized areas. Drag selection follows these markers."
          : "Columns use inset reading outlines and selected outer frames. Lines and areas use filled reading markers and selected outer rings. Try January's cooling marker inside the heating column, then the column body."}{' '}
        Month mode previews every visible series, underlines selected months, and opens one set of
        details. Pin a legend name to prioritize that series where shapes overlap; a shape alone
        under the pointer remains the target. Hidden values remain selected and return when shown.
        Activation gives brief feedback and opens the details below.{' '}
        {kind === 'area'
          ? 'Normalized readings use visible shares; details retain raw MWh values. '
          : ''}
        These controls and details belong to this example.
      </p>
      {details ? (
        <Stack gap="regular">
          <DescriptionList
            ariaLabel={`${details.category} energy details`}
            emptyState={{
              kind: 'no-data',
              title: 'No readings',
              description: 'Choose a month with recorded values.',
            }}
            items={[
              {description: details.category, id: 'month', term: 'Month'},
              ...details.values.map(({hidden, label, seriesId, value}) => ({
                description: `${value} MWh${hidden ? ' (hidden on chart)' : ''}`,
                id: seriesId,
                term: label,
              })),
            ]}
          />
          <Button onPress={() => setDetails(null)} variant="quiet">
            Close details
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
}

function PointInteractionExample({
  kind,
  visibilityLabels,
}: {
  readonly kind: 'scatter' | 'bubble';
  readonly visibilityLabels: ChartVisibilityLabels;
}) {
  const [selectionEnabled, setSelectionEnabled] = useState(true);
  const [detailsEnabled, setDetailsEnabled] = useState(true);
  const [selectedItems, setSelectedItems] = useState<readonly ChartSelectionItem[]>([]);
  const [details, setDetails] = useState<PointChartActivation<
    (typeof statisticalPointData)[number]
  > | null>(null);
  const instructions = selectionEnabled
    ? `Click or tap a mark to select its observation. Enter or Space selects the current reading. Drag from empty plot space to select observations whose centers are inside the rectangle. A drag replaces selection; Shift or Control/Command adds, Alt removes, and Escape cancels.${detailsEnabled ? ' Control/Command-click, Control/Command plus Enter or Space, or a touch press-and-hold opens details without changing selection.' : ''}`
    : detailsEnabled
      ? 'Click, tap, or press Enter or Space to open observation details.'
      : 'Hover a mark or use the arrow keys to read its observation.';
  const interaction: PointChartInteraction<(typeof statisticalPointData)[number]> = {
    ...(detailsEnabled ? {onActivate: setDetails} : {}),
    ...(selectionEnabled
      ? {
          selection: {
            selectedItems,
            onSelectionChange: setSelectedItems,
            labels: {
              instructions,
              clear: 'Clear selection',
              empty: 'Nothing selected',
              hidden: (label) => `${label} (hidden)`,
              item: ({rowId}) =>
                statisticalPointData.find((datum) => datum.id === rowId)?.label ?? rowId,
              summary: (count) =>
                `${count} ${count === 1 ? 'observation' : 'observations'} selected`,
            },
          },
        }
      : {}),
  };
  const common = {
    data: statisticalPointData,
    dataTableLabel: 'Operating observations',
    emptyState: {
      description: 'Choose a reporting interval with recorded observations.',
      title: 'No observations',
    },
    invalidData: {
      description: 'Correct records with missing, non-finite, or out-of-domain values.',
      title: 'Some observations are invalid',
    },
    idAccessor: 'id',
    interaction,
    labelAccessor: 'label',
    legend: {label: 'Turbine loops'},
    series: statisticalSeries,
    seriesAccessor: 'loop',
    visibilityLabels,
    xAxis: {
      accessor: 'temperature',
      label: 'Temperature',
      scale: {type: 'linear'},
      unit: '°F',
    },
    yAxis: {
      accessor: 'demand',
      label: 'Thermal demand',
      scale: {type: 'linear'},
      showGrid: true,
      unit: 'MWh',
    },
  } as const;

  return (
    <Stack gap="regular">
      <Stack gap="regular">
        <Switch
          isSelected={selectionEnabled}
          label="Enable selection"
          onChange={setSelectionEnabled}
        />
        <Switch
          isSelected={detailsEnabled}
          label="Open details on activation"
          onChange={(enabled) => {
            setDetailsEnabled(enabled);
            if (!enabled) setDetails(null);
          }}
        />
      </Stack>
      <p>{instructions}</p>
      {kind === 'scatter' ? (
        <ScatterChart
          {...common}
          description="Compare temperature and thermal demand for recorded operating periods."
          title="Temperature and demand"
        />
      ) : (
        <BubbleChart
          {...common}
          description="Compare temperature, demand, and stored energy for recorded operating periods."
          magnitude={{accessor: 'stored', label: 'Stored energy', unit: 'MWh'}}
          title="Thermal demand and stored energy"
        />
      )}
      <p className="showcase-muted">
        Left and Right visit visible observations in data order, including North Tuesday and South
        Wednesday at the same coordinates. Up and Down move spatially. Home and End reach the first
        and last observations. A filled center marks the reading; selected outlines follow each
        symbol. Circular selection rings meet the colored border as it changes with emphasis.
        Activation gives brief feedback and opens the details below. Pinning a legend group gives it
        priority only where marks overlap. Bubble edges outside the rectangle do not count toward
        selection, and interaction preserves the magnitude shown by each bubble's area. The table
        retains every valid observation and labels hidden groups. Hide a selected group to see its
        selection remain labeled as hidden. Hidden observations cannot be read, selected by
        dragging, or activated. These controls and details belong to this example.
      </p>
      {details ? (
        <Stack gap="regular">
          <DescriptionList
            ariaLabel={`${details.label} observation details`}
            emptyState={{
              kind: 'no-data',
              title: 'No observation',
              description: 'Open a recorded observation.',
            }}
            items={[
              {description: details.label, id: 'label', term: 'Observation'},
              {description: details.item.rowId, id: 'row-id', term: 'Observation ID'},
              {description: details.item.seriesId, id: 'series-id', term: 'Series ID'},
              {description: `${details.x} °F`, id: 'temperature', term: 'Temperature'},
              {description: `${details.y} MWh`, id: 'demand', term: 'Thermal demand'},
              ...(details.magnitude === undefined
                ? []
                : [{description: `${details.magnitude} MWh`, id: 'stored', term: 'Stored energy'}]),
              {description: details.input, id: 'input', term: 'Input method'},
              {description: details.datum.loop, id: 'source-loop', term: 'Loop from source record'},
            ]}
          />
          <Button onPress={() => setDetails(null)} variant="quiet">
            Close details
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
}

const distributionChartStateCopy = {
  dataTableLabel: 'Statistical chart data',
  emptyState: {
    description: 'Choose a reporting interval with recorded observations.',
    title: 'No observations',
  },
  invalidData: {
    description: 'Correct records with missing, non-finite, or out-of-domain values.',
    title: 'Some observations are invalid',
  },
} as const;

function distributionInstructions(selection: boolean, details: boolean, targets: string) {
  return selection
    ? `Click or tap to toggle selection. Enter or Space selects the current reading. Drag to select ${targets}. A drag replaces selection; Shift or Control/Command adds, Alt removes, and Escape cancels.${details ? ' Control/Command-click, Control/Command plus Enter or Space, or touch press-and-hold opens details without changing selection.' : ''}`
    : details
      ? 'Click, tap, or press Enter or Space to open details.'
      : 'Hover a mark or use the arrow keys to read its values.';
}

function DistributionInteractionControls({
  selectionEnabled,
  setSelectionEnabled,
  detailsEnabled,
  setDetailsEnabled,
}: {
  readonly selectionEnabled: boolean;
  readonly setSelectionEnabled: (enabled: boolean) => void;
  readonly detailsEnabled: boolean;
  readonly setDetailsEnabled: (enabled: boolean) => void;
}) {
  return (
    <InlineGroup align="start" gap="regular" wrap>
      <Switch
        isSelected={selectionEnabled}
        label="Enable selection"
        onChange={setSelectionEnabled}
      />
      <Switch
        isSelected={detailsEnabled}
        label="Open details on activation"
        onChange={setDetailsEnabled}
      />
    </InlineGroup>
  );
}

function histogramItemLabel({lower, upper, upperInclusive}: HistogramSelectionItem) {
  return `${lower} to ${upper} ms, upper edge ${upperInclusive ? 'included' : 'excluded'}`;
}

function HistogramInteractionExample() {
  const [selectionEnabled, setSelectionEnabled] = useState(true);
  const [detailsEnabled, setDetailsEnabled] = useState(true);
  const [selectedItems, setSelectedItems] = useState<readonly HistogramSelectionItem[]>([]);
  const [details, setDetails] = useState<HistogramActivation<
    (typeof restartLatencies)[number]
  > | null>(null);
  const instructions = distributionInstructions(
    selectionEnabled,
    detailsEnabled,
    'bins that intersect the rectangle',
  );
  const interaction: HistogramInteraction<(typeof restartLatencies)[number]> = {
    ...(detailsEnabled ? {onActivate: setDetails} : {}),
    ...(selectionEnabled
      ? {
          selection: {
            selectedItems,
            onSelectionChange: setSelectedItems,
            labels: {
              instructions,
              clear: 'Clear selection',
              empty: 'Nothing selected',
              hidden: (label) => `${label} (hidden)`,
              item: histogramItemLabel,
              summary: (count) => `${count} ${count === 1 ? 'bin' : 'bins'} selected`,
            },
          },
        }
      : {}),
  };
  return (
    <Stack gap="regular">
      <DistributionInteractionControls
        selectionEnabled={selectionEnabled}
        setSelectionEnabled={setSelectionEnabled}
        detailsEnabled={detailsEnabled}
        setDetailsEnabled={(enabled) => {
          setDetailsEnabled(enabled);
          if (!enabled) setDetails(null);
        }}
      />
      <p>{instructions}</p>
      <Histogram
        {...distributionChartStateCopy}
        data={restartLatencies}
        description="See which restart-latency ranges occurred most often."
        distribution={{
          accessor: 'latency',
          kind: 'raw',
          thresholds: [0, 40, 80, 120, 160, 200, 240],
        }}
        interaction={interaction}
        title="Pump restart latency"
        xAxis={{label: 'Restart latency', scale: {domain: [0, 240], type: 'linear'}, unit: 'ms'}}
        yAxis={{label: 'Restarts', scale: {domain: [0, 8], type: 'linear'}, showGrid: true}}
      />
      <p className="showcase-muted">
        Arrow keys visit every bin in interval order. Home and End reach the first and last bins.
        Selection frames share their adjoining edges; the inset outline marks the current reading.
        Every bin includes its lower edge, and only the final bin includes its upper edge. Selection
        follows the full interval even when its count changes. New thresholds can retire a selected
        interval. Details contain the count and original records in this raw-data example.
        Pre-binned data returns the supplied bin record and its declared count, proportion, or
        density. These controls and details belong to this example.
      </p>
      {details ? (
        <Stack gap="regular">
          <DescriptionList
            ariaLabel="Restart interval details"
            emptyState={{kind: 'no-data', title: 'No bin', description: 'Open a restart interval.'}}
            items={[
              {id: 'interval', term: 'Interval', description: histogramItemLabel(details.item)},
              {
                id: 'value',
                term: `Value (${details.ordinate})`,
                description: String(details.value),
              },
              {id: 'source', term: 'Source mode', description: details.source.kind},
              {
                id: 'records',
                term: 'Original restart records',
                description:
                  details.source.kind === 'raw'
                    ? details.source.data.map((datum) => `${datum.latency} ms`).join(', ') ||
                      'No restarts in this interval'
                    : `${details.source.datum.latency} ms`,
              },
              {id: 'input', term: 'Input method', description: details.input},
            ]}
          />
          <Button onPress={() => setDetails(null)} variant="quiet">
            Close details
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
}

function boxPlotItemLabel(item: BoxPlotSelectionItem) {
  const group = statisticalSeries.find(({id}) => id === item.groupId)?.label ?? item.groupId;
  return item.kind === 'summary' ? `${group} summary` : `${group} outlier ${item.outlierId}`;
}

function BoxPlotInteractionExample({
  visibilityLabels,
}: {
  readonly visibilityLabels: ChartVisibilityLabels;
}) {
  const [selectionEnabled, setSelectionEnabled] = useState(true);
  const [detailsEnabled, setDetailsEnabled] = useState(true);
  const [selectedItems, setSelectedItems] = useState<readonly BoxPlotSelectionItem[]>([]);
  const [details, setDetails] = useState<BoxPlotActivation<(typeof recoveryTimes)[number]> | null>(
    null,
  );
  const instructions = distributionInstructions(
    selectionEnabled,
    detailsEnabled,
    'summaries whose boxes touch the rectangle and outliers whose centers are inside it',
  );
  const interaction: BoxPlotInteraction<(typeof recoveryTimes)[number]> = {
    getOutlierId: ({datum}) => datum.id,
    ...(detailsEnabled ? {onActivate: setDetails} : {}),
    ...(selectionEnabled
      ? {
          selection: {
            selectedItems,
            onSelectionChange: setSelectedItems,
            labels: {
              instructions,
              clear: 'Clear selection',
              empty: 'Nothing selected',
              hidden: (label) => `${label} (hidden)`,
              item: boxPlotItemLabel,
              summary: (count) => `${count} ${count === 1 ? 'target' : 'targets'} selected`,
            },
          },
        }
      : {}),
  };
  const sourceRecords = !details
    ? []
    : details.kind === 'summary'
      ? details.source.kind === 'raw'
        ? details.source.data
        : [details.source.datum]
      : [details.source.datum];
  return (
    <Stack gap="regular">
      <Switch
        isSelected={selectionEnabled}
        label="Enable selection"
        onChange={setSelectionEnabled}
      />
      <Switch
        isSelected={detailsEnabled}
        label="Open details on activation"
        onChange={(enabled) => {
          setDetailsEnabled(enabled);
          if (!enabled) setDetails(null);
        }}
      />
      <p>{instructions}</p>
      <BoxPlot
        {...distributionChartStateCopy}
        data={recoveryTimes}
        description="Compare the center, spread, and outliers of recovery time for three turbine loops."
        distribution={{kind: 'raw', valueAccessor: 'recovery', whisker: 'tukey'}}
        groupAccessor="loop"
        groups={statisticalSeries}
        interaction={interaction}
        legend={{label: 'Turbine loops'}}
        title="Recovery-time distribution"
        visibilityLabels={visibilityLabels}
        xAxis={{label: 'Turbine loop'}}
        yAxis={{
          label: 'Recovery time',
          scale: {type: 'linear'},
          showGrid: true,
          unit: 'minutes',
        }}
      />
      <p className="showcase-muted">
        Arrow keys visit each visible group summary followed by its individual outliers. Home and
        End reach the first and last targets. A summary reading uses an inset outline and whisker
        cues. The median remains a line. Outlier readings have filled centers; selection adds rings
        that meet the colored border. Summary selection frames the box and keeps outliers separate.
        A box with no spread remains reachable at its median line. Each recovery record has a stable
        ID, so equal outlier values can identify different observations. This example returns
        original records. Precomputed summaries return the supplied summary record, with the outlier
        position when applicable. An eye hides a summary and all its outliers together. Remaining
        groups keep their declared order, and the value axis fits their unchanged summaries. Hidden
        selections stay labeled in the selection summary; the full table retains and labels hidden
        groups. These controls and details belong to this example.
      </p>
      {details ? (
        <Stack gap="regular">
          <DescriptionList
            ariaLabel="Recovery distribution details"
            emptyState={{
              kind: 'no-data',
              title: 'No target',
              description: 'Open a summary or outlier.',
            }}
            items={[
              {id: 'target', term: 'Target', description: boxPlotItemLabel(details.item)},
              ...(details.kind === 'summary'
                ? [
                    {
                      id: 'lower-whisker',
                      term: 'Lower whisker',
                      description: `${details.summary.lowerWhisker} minutes`,
                    },
                    {
                      id: 'q1',
                      term: 'First quartile',
                      description: `${details.summary.q1} minutes`,
                    },
                    {
                      id: 'median',
                      term: 'Median',
                      description: `${details.summary.median} minutes`,
                    },
                    {
                      id: 'q3',
                      term: 'Third quartile',
                      description: `${details.summary.q3} minutes`,
                    },
                    {
                      id: 'upper-whisker',
                      term: 'Upper whisker',
                      description: `${details.summary.upperWhisker} minutes`,
                    },
                    {
                      id: 'whisker-method',
                      term: 'Whisker method',
                      description: details.summary.whisker,
                    },
                    {
                      id: 'outliers',
                      term: 'Outlier values',
                      description:
                        details.summary.outliers.map((value) => `${value} minutes`).join(', ') ||
                        'No outliers',
                    },
                  ]
                : [{id: 'value', term: 'Outlier value', description: `${details.value} minutes`}]),
              {id: 'source', term: 'Source mode', description: details.source.kind},
              {
                id: 'records',
                term: 'Original recovery records',
                description: sourceRecords
                  .map((datum) => `${datum.id}: ${datum.recovery} minutes`)
                  .join(', '),
              },
              {id: 'input', term: 'Input method', description: details.input},
            ]}
          />
          <Button onPress={() => setDetails(null)} variant="quiet">
            Close details
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
}

const radarCommon = {
  dataTableLabel: 'Vehicle profile scores',
  dimensions: vehicleProfileDimensions,
  emptyState: {
    description: 'Choose vehicles with recorded scores.',
    title: 'No vehicle scores',
  },
  idAccessor: 'id',
  invalidData: {
    description: 'Correct negative or non-finite scores.',
    title: 'Invalid vehicle scores',
  },
  labelAccessor: 'label',
  labels: {dimension: 'Quality'},
  legend: {label: 'Vehicles'},
  value: {label: 'Score', unit: 'points'},
} as const;

function RadarInteractionExample({
  sparse = false,
  visibilityLabels,
}: {
  readonly sparse?: boolean;
  readonly visibilityLabels: ChartVisibilityLabels;
}) {
  const data = sparse ? sparseVehicleProfileData : vehicleProfileData;
  const [target, setTarget] = useState<'point' | 'dimension'>('point');
  const [selectionEnabled, setSelectionEnabled] = useState(true);
  const [detailsEnabled, setDetailsEnabled] = useState(true);
  const [selectedItems, setSelectedItems] = useState<readonly RadarSelectionItem[]>([]);
  const [details, setDetails] = useState<RadarActivation<VehicleProfile> | null>(null);
  const instructions = selectionEnabled
    ? `Click or tap a visible value dot to select. Drag a rectangle to select value centers inside it. A drag replaces selection; Shift or Control/Command adds, Alt removes, and Escape cancels. Enter or Space selects.${detailsEnabled ? ' Control/Command-click, Control/Command plus Enter or Space, or touch press-and-hold opens details without changing selection.' : ''}`
    : detailsEnabled
      ? 'Click or tap a visible value dot, or press Enter or Space, to open details.'
      : 'Hover a profile or use the arrow keys to read its values.';
  const interaction: RadarInteraction<VehicleProfile> = {
    target,
    ...(detailsEnabled ? {onActivate: setDetails} : {}),
    ...(selectionEnabled
      ? {
          selection: {
            selectedItems,
            onSelectionChange: setSelectedItems,
            labels: {
              instructions,
              clear: 'Clear selection',
              empty: 'Nothing selected',
              hidden: (label) => `${label} (hidden)`,
              item: ({dimensionId, seriesId}) => {
                const dimension =
                  vehicleProfileDimensions.find((item) => item.id === dimensionId)?.label ??
                  dimensionId;
                const profile = data.find((item) => item.id === seriesId);
                return profile ? `${profile.label}, ${dimension}` : dimension;
              },
              summary: (count) =>
                `${count} ${target === 'dimension' ? (count === 1 ? 'dimension' : 'dimensions') : count === 1 ? 'value' : 'values'} selected`,
            },
          },
        }
      : {}),
  };
  return (
    <Stack gap="regular">
      <SegmentedControl
        label={sparse ? 'Sparse radar click target' : 'Radar click target'}
        onChange={(nextTarget) => {
          setTarget(nextTarget);
          setSelectedItems([]);
          setDetails(null);
        }}
        options={[
          {label: 'Point', value: 'point'},
          {label: 'Dimension', value: 'dimension'},
        ]}
        value={target}
      />
      <InlineGroup align="start" gap="regular" wrap>
        <Switch
          isSelected={selectionEnabled}
          label="Enable selection"
          onChange={setSelectionEnabled}
        />
        <Switch
          isSelected={detailsEnabled}
          label="Open details on activation"
          onChange={(enabled) => {
            setDetailsEnabled(enabled);
            if (!enabled) setDetails(null);
          }}
        />
      </InlineGroup>
      <p>{instructions}</p>
      <RadarChart
        {...radarCommon}
        visibilityLabels={visibilityLabels}
        data={data}
        description={
          sparse
            ? 'Missing qualities remain zero while isolated scores retain a readable fill.'
            : 'Courier and Scout scores across five shared vehicle qualities.'
        }
        interaction={interaction}
        title={sparse ? 'Sparse vehicle profiles' : 'Vehicle profiles'}
      />
      <p className="showcase-muted">
        Left and Right move between dimensions. Up and Down switch profiles. Home and End reach the
        first and last dimension. Zero and missing values share the center. Reach them with the
        keyboard or include them by selecting a whole dimension. Center clicks and the small visual
        shoulders do not select zero values. A dimension qualifies for rectangle selection when any
        positive value center is inside.
      </p>
      <p className="showcase-muted">
        Tap or click a profile name to pin its highlight; repeat to clear it. Use the eyes beside
        profile names to hide or restore them. The shared scale fits the visible profiles. Hidden
        selections stay listed, and Show all restores every profile. Dimension details include only
        visible profiles.
      </p>
      <p className="showcase-muted">
        A ring marks a selected point; a label underline marks a selected dimension. Filled centers
        preview the click target. Hovering still emphasizes the profile beneath the pointer in
        either mode. A focused or pinned legend profile takes priority only where profiles overlap.
        Opening point details pulses the point. Opening dimension details animates its radial guide
        to the furthest value, with static feedback for reduced motion. An all-zero dimension
        briefly underlines its label. This example owns selection and shows the original profile
        records supplied with each activation.
      </p>
      {details ? (
        <DescriptionList
          ariaLabel="Vehicle profile details"
          emptyState={{
            kind: 'no-data',
            title: 'No profile details',
            description: 'Open a value or dimension.',
          }}
          items={[
            {id: 'dimension', term: 'Quality', description: details.dimension.label},
            {id: 'input', term: 'Opened with', description: details.input},
            ...details.values.map((entry) => ({
              id: entry.seriesId,
              term: entry.label,
              description: `${entry.value} points; original record ${entry.datum.id}`,
            })),
          ]}
        />
      ) : (
        <p className="showcase-muted">No profile details opened.</p>
      )}
    </Stack>
  );
}

function PartToWholeInteractionExample({kind}: {readonly kind: 'pie' | 'donut'}) {
  const [selectionEnabled, setSelectionEnabled] = useState(true);
  const [detailsEnabled, setDetailsEnabled] = useState(true);
  const [selectedItems, setSelectedItems] = useState<readonly PartToWholeSelectionItem[]>([]);
  const [details, setDetails] = useState<PartToWholeActivation<
    (typeof energyCategoryData)[number]
  > | null>(null);
  const instructions = selectionEnabled
    ? `Click or tap to select a category. Sweep across slices to select those crossed; a dashed trail shows your path. A drag replaces selection; Shift or Control/Command adds and Alt removes. Escape restores the selection from before the drag. Enter or Space selects.${detailsEnabled ? ' Control/Command-click, Control/Command plus Enter or Space, or touch press-and-hold opens details without changing selection.' : ''}`
    : detailsEnabled
      ? 'Click, tap, or press Enter or Space to open category details.'
      : 'Hover a slice or use the arrow keys to read its values.';
  const interaction: PartToWholeInteraction<(typeof energyCategoryData)[number]> = {
    ...(detailsEnabled ? {onActivate: setDetails} : {}),
    ...(selectionEnabled
      ? {
          selection: {
            selectedItems,
            onSelectionChange: setSelectedItems,
            containsSelection: 'Contains selected categories',
            labels: {
              instructions,
              clear: 'Clear selection',
              empty: 'Nothing selected',
              hidden: (label) => `${label} (hidden or on another page)`,
              item: ({id}) => energyCategoryData.find((datum) => datum.id === id)?.label ?? id,
              summary: (count) => `${count} ${count === 1 ? 'category' : 'categories'} selected`,
            },
          },
        }
      : {}),
  };
  const partToWholeCommon = {
    visibilityLabels: {
      hidden: 'Hidden',
      hideSeries: (label: string) => `Hide ${label}`,
      showSeries: (label: string) => `Show ${label}`,
      showAll: 'Show all categories',
      allHidden: {
        title: 'All categories are hidden',
        description: 'Use an eye to restore a category, or show all categories.',
      },
    },
    data: energyCategoryData,
    dataTableLabel: 'Annual energy use by customer category',
    description: 'Annual metered use by customer category, ranked by megawatt-hours.',
    emptyState: {
      description: 'Choose a year with recorded use.',
      title: 'No energy use',
    },
    idAccessor: 'id',
    invalidData: {
      description: 'Correct negative or non-finite category values.',
      title: 'Invalid energy use',
    },
    labelAccessor: 'label',
    labels: {
      back: 'Back',
      category: 'Customer category',
      categoryRange: ({end, start, total}: {end: number; start: number; total: number}) =>
        `Categories ${start} to ${end} of ${total}`,
      moreCategories: (count: number) => `More categories (${count})`,
      shareOfTotal: 'Share of visible total',
      shareOnPage: 'Share on this page',
    },
    legend: {label: 'Categories on this page'},
    value: {accessor: 'value', label: 'Energy use', unit: 'MWh'},
  } as const;
  return (
    <Stack gap="regular">
      <InlineGroup align="start" gap="regular" wrap>
        <Switch
          isSelected={selectionEnabled}
          label="Enable selection"
          onChange={setSelectionEnabled}
        />
        <Switch
          isSelected={detailsEnabled}
          label="Open details on activation"
          onChange={(enabled) => {
            setDetailsEnabled(enabled);
            if (!enabled) setDetails(null);
          }}
        />
      </InlineGroup>
      <p>{instructions}</p>
      {kind === 'pie' ? (
        <PieChart {...partToWholeCommon} interaction={interaction} title="Community energy use" />
      ) : (
        <DonutChart
          {...partToWholeCommon}
          interaction={interaction}
          title="Community energy use by category"
          totalLabel="Visible MWh"
        />
      )}
      <p className="showcase-muted">
        Use an eye to hide or restore a category. Remaining slices animate to fill the circle;
        percentages and the donut total use visible values. Hiding pulls the next category out of
        the expansion to fill the space. Closed eyes in the legend let you restore hidden
        categories; restoring one sends the last category back to expansion if needed. Colors and
        selections follow each category. The expansion disappears when everything visible fits. It
        has no eye; click it to open the next page. The table retains all records and labels hidden
        rows.
      </p>
      <p className="showcase-muted">
        Left and Right read each visible slice, including the aggregate. Home and End reach the page
        endpoints. Enter or Space on +N opens the next page. Select a category there and return with
        Back to see +N*. The asterisk means that the remaining categories include something selected
        or hidden. Selecting or hiding a category outside the expansion leaves its count unmarked.
        Selection survives paging. Sweeping across the aggregate or donut hole selects nothing
        there.
      </p>
      <p className="showcase-muted">
        Outer arcs mark selected categories. The inset dashed outline and slice pop-out mark the
        current reading. Activation gives brief pulse feedback, or static feedback with reduced
        motion. Legend clicks pin emphasis; directly hovering a slice reads that slice. Zero values
        remain in the complete table without a slice. This example owns controlled selection and the
        details below. Details retain the original category record and report shares as percentages
        converted from callback fractions. Page shares exclude the aggregate.
      </p>
      {details ? (
        <Stack gap="regular">
          <DescriptionList
            ariaLabel="Energy category details"
            emptyState={{kind: 'no-data', title: 'No category', description: 'Open a category.'}}
            items={[
              {id: 'category', term: 'Category', description: details.label},
              {id: 'identity', term: 'Category ID', description: details.item.id},
              {id: 'value', term: 'Energy use', description: `${details.value} MWh`},
              {id: 'total', term: 'Total energy use', description: `${details.total} MWh`},
              {
                id: 'total-share',
                term: 'Share of total',
                description: `${(details.shareOfTotal * 100).toFixed(1)}%`,
              },
              {
                id: 'page-share',
                term: 'Share on activation page',
                description: `${(details.shareOnPage * 100).toFixed(1)}%`,
              },
              {
                id: 'record',
                term: 'Original category record',
                description: `${details.datum.id}: ${details.datum.label}, ${details.datum.value} MWh`,
              },
              {id: 'input', term: 'Input method', description: details.input},
            ]}
          />
          <Button onPress={() => setDetails(null)} variant="quiet">
            Close details
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
}

type DemandReading = (typeof compactDemandData)[number];

function SparklineInteractionExample() {
  const [selectionEnabled, setSelectionEnabled] = useState(true);
  const [detailsEnabled, setDetailsEnabled] = useState(true);
  const [selectedItems, setSelectedItems] = useState<readonly SparklineSelectionItem[]>([]);
  const [details, setDetails] = useState<SparklineActivation<DemandReading, string> | null>(null);
  const instructions = distributionInstructions(
    selectionEnabled,
    detailsEnabled,
    'recorded values between the starting and ending positions',
  );
  const interaction: SparklineInteraction<DemandReading, string> = {
    getRowId: (datum) => datum.id,
    ...(detailsEnabled ? {onActivate: setDetails} : {}),
    ...(selectionEnabled
      ? {
          selection: {
            selectedItems,
            onSelectionChange: setSelectedItems,
            labels: {
              instructions,
              clear: 'Clear selection',
              empty: 'Nothing selected',
              summary: (count) => `${count} ${count === 1 ? 'reading' : 'readings'} selected`,
              item: ({rowId}) =>
                compactDemandData.find((datum) => datum.id === rowId)?.day ?? rowId,
              hidden: (label) => label,
            },
          },
        }
      : {}),
  };
  return (
    <Stack gap="regular">
      <Switch
        isSelected={selectionEnabled}
        label="Enable selection"
        onChange={setSelectionEnabled}
      />
      <Switch
        isSelected={detailsEnabled}
        label="Open details on activation"
        onChange={(enabled) => {
          setDetailsEnabled(enabled);
          if (!enabled) setDetails(null);
        }}
      />
      <p>{instructions}</p>
      <Sparkline
        interaction={interaction}
        data={compactDemandData}
        dataTableLabel="Daily thermal demand history"
        description="Daily demand; Tuesday has no reading, current demand is 65 MWh, and the observed range is 38 to 65 MWh."
        emptyState={{description: 'Record daily demand to begin.', title: 'No demand history'}}
        invalidData={{
          description: 'Correct non-finite demand readings.',
          title: 'Invalid demand history',
        }}
        labels={{
          first: 'First',
          highest: 'Highest',
          last: 'Last',
          lowest: 'Lowest',
          missing: 'No reading',
        }}
        position={{accessor: 'day', label: 'Day', scale: {type: 'categorical'}}}
        title="Thermal demand this week"
        value={{accessor: 'demand', label: 'Demand', unit: 'MWh'}}
        valueRange={[0, 80]}
      />
      <p className="showcase-muted">
        Left and Right read each day; Home and End reach the first and last day. Tuesday remains
        readable as a gap, and cannot be selected or opened. Zero would be a recorded value.
        Selection rings surround the existing hollow current cue and half-filled low and high cues
        without replacing their meaning. Opening details gives a brief pulse, with static feedback
        for reduced motion. The tooltip, summary and table retain the exact readings.
      </p>
      <p className="showcase-muted">
        This example owns selection and the details below. Stable record IDs keep selections
        attached to the same readings after data updates. The activation includes the original
        record, day, value and input method. The fixed range keeps this chart comparable with other
        demand charts.
      </p>
      {details ? (
        <Stack gap="tight">
          <DescriptionList
            ariaLabel="Daily demand details"
            emptyState={{kind: 'no-data', title: 'No reading', description: 'Open a recorded day.'}}
            items={[
              {id: 'position', term: 'Day', description: details.position},
              {id: 'value', term: 'Demand', description: `${details.value} MWh`},
              {id: 'identity', term: 'Reading ID', description: details.item.rowId},
              {
                id: 'record',
                term: 'Original record',
                description: `${details.datum.id}: ${details.datum.day}, ${details.datum.demand} MWh`,
              },
              {id: 'input', term: 'Input method', description: details.input},
            ]}
          />
          <Button onPress={() => setDetails(null)} variant="quiet">
            Close details
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
}

type RoomReading = (typeof roomTemperatureData)[number] | (typeof roomDeviationData)[number];

function HeatmapInteractionExample({
  accent,
  deviation = false,
}: {
  readonly accent: AccentColor;
  readonly deviation?: boolean;
}) {
  const [selectionEnabled, setSelectionEnabled] = useState(true);
  const [detailsEnabled, setDetailsEnabled] = useState(true);
  const [selectedItems, setSelectedItems] = useState<readonly HeatmapSelectionItem[]>([]);
  const [details, setDetails] = useState<HeatmapActivation<RoomReading> | null>(null);
  const instructions = distributionInstructions(
    selectionEnabled,
    detailsEnabled,
    'cells touched by the rectangle',
  );
  const itemLabel = (item: HeatmapSelectionItem) =>
    `${heatmapRows.find((row) => row.id === item.rowId)?.label ?? item.rowId}, ${heatmapColumns.find((column) => column.id === item.columnId)?.label ?? item.columnId}`;
  const interaction: HeatmapInteraction<RoomReading> = {
    ...(detailsEnabled ? {onActivate: setDetails} : {}),
    ...(selectionEnabled
      ? {
          selection: {
            selectedItems,
            onSelectionChange: setSelectedItems,
            labels: {
              instructions,
              clear: 'Clear selection',
              empty: 'Nothing selected',
              summary: (count) => `${count} ${count === 1 ? 'cell' : 'cells'} selected`,
              item: itemLabel,
              hidden: (label) => label,
            },
          },
        }
      : {}),
  };
  const heatmapCommon = {
    columnAccessor: 'period',
    columns: heatmapColumns,
    dataTableLabel: 'Room readings by time of day',
    emptyState: {
      description: 'Declare rooms and times to begin.',
      title: 'No reading grid',
    },
    invalidData: {
      description: 'Correct non-finite room readings.',
      title: 'Invalid room readings',
    },
    labels: {
      colorKey: 'Reading scale',
      column: 'Time of day',
      missing: 'No reading',
      row: 'Room',
      scrollRegion: 'Room reading grid',
    },
    rowAccessor: 'room',
    rows: heatmapRows,
  } as const;
  return (
    <Stack gap="regular">
      <DistributionInteractionControls
        selectionEnabled={selectionEnabled}
        setSelectionEnabled={setSelectionEnabled}
        detailsEnabled={detailsEnabled}
        setDetailsEnabled={(enabled) => {
          setDetailsEnabled(enabled);
          if (!enabled) setDetails(null);
        }}
      />
      <p>
        {instructions} Dashed inner outlines show the current reading. Solid frames show selected
        cells, including missing readings.
      </p>
      <Heatmap
        {...heatmapCommon}
        data={deviation ? roomDeviationData : roomTemperatureData}
        description={
          deviation
            ? 'Degrees below or above the target; zero means the room met its target.'
            : 'Temperature by room and time; patterned cells have no recorded reading.'
        }
        scale={
          deviation
            ? {colors: [accent, '#d14f00'], domain: [-6, 6], midpoint: 0, type: 'two-sided'}
            : {color: accent, type: 'sequential'}
        }
        title={deviation ? 'Temperature deviation' : 'Room temperature'}
        value={{accessor: 'value', label: deviation ? 'Deviation' : 'Temperature', unit: '°C'}}
        interaction={interaction}
      />
      {details ? (
        <Stack gap="tight">
          <DescriptionList
            ariaLabel="Room reading details"
            emptyState={{kind: 'no-data', title: 'No cell', description: 'Open a room reading.'}}
            items={[
              {id: 'cell', term: 'Cell', description: itemLabel(details.item)},
              {
                id: 'value',
                term: 'Recorded value',
                description: details.value === undefined ? 'No reading' : `${details.value} °C`,
              },
              {
                id: 'record',
                term: 'Original record',
                description: details.datum
                  ? `${details.datum.room}, ${details.datum.period}: ${details.datum.value}`
                  : 'No source record',
              },
              {id: 'input', term: 'Input method', description: details.input},
            ]}
          />
          <Button variant="quiet" onPress={() => setDetails(null)}>
            Close details
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
}

function ChartSpecimens({accent}: {readonly accent: AccentColor}) {
  const [lineTarget, setLineTarget] = useState<'category' | 'point'>('category');
  const [lineSelectionEnabled, setLineSelectionEnabled] = useState(true);
  const [lineDetailsEnabled, setLineDetailsEnabled] = useState(true);
  const [lineSelection, setLineSelection] = useState<readonly ChartSelectionItem[]>([]);
  const [lineDetails, setLineDetails] = useState<ChartActivation<
    (typeof chartData)[number],
    (typeof chartData)[number]['month']
  > | null>(null);
  const lineInstructions = lineSelectionEnabled
    ? `Click or tap to select ${lineTarget === 'category' ? 'a month' : 'a point'}. Drag to select ${lineTarget === 'category' ? 'a month range' : 'points inside a rectangle'}. Hold Shift or Control/Command to add, or Alt to remove. Escape cancels a drag.${lineDetailsEnabled ? ' Control/Command-click or press and hold to open details without changing selection. With keyboard focus, Enter or Space selects; add Control/Command to open details.' : ' With keyboard focus, Enter or Space selects.'}`
    : lineDetailsEnabled
      ? 'Click, tap, or press Enter or Space to open details. Opening details does not select an item.'
      : 'Move across the chart or use the arrow keys to read its values.';
  const verticalAxes = {
    xAxis: {accessor: 'month', label: 'Month', scale: {type: 'categorical'}},
    yAxis: {label: 'Energy', scale: {type: 'linear'}, showGrid: true, unit: 'MWh'},
  } as const;
  const visibilityLabels: ChartVisibilityLabels = {
    allHidden: {
      description: 'Use an eye control to show one series, or restore all series below.',
      title: 'All series hidden',
    },
    hidden: 'Hidden',
    hideSeries: (label) => `Hide ${label}`,
    showAll: 'Show all series',
    showSeries: (label) => `Show ${label}`,
  };
  const statisticalVisibilityLabels: ChartVisibilityLabels = {
    ...visibilityLabels,
    allHidden: {
      title: 'All groups hidden',
      description: 'Use an eye control to show one group, or restore all groups below.',
    },
    showAll: 'Show all groups',
  };
  const statisticalVisibilityGuidance =
    'Use the eye after a group name to hide or show its marks. Names pin emphasis separately; tap or click the pinned name again to clear its highlight. Legend order, colors, and shapes stay the same; hiding clears a pin. Automatic numeric axes animate to fit visible values, while explicit axis limits stay fixed. Reduced motion makes scale changes immediate. Hide every group to try Show all groups, which restores focus to the first eye.';
  const visibilityGuidance =
    'Click a series name to pin its highlight, then click it again to clear the highlight; use its separate eye to hide or show it. The scale briefly animates to fit visible values. Hide every series to try Show all series. The data table retains all values and labels hidden series.';
  const common = {
    ...chartStateCopy,
    data: chartData,
    dataTableLabel: 'Monthly energy data',
    description: 'Monthly demand remains within available thermal capacity.',
    visibilityLabels,
  } as const;

  return (
    <>
      <p className="showcase-muted">
        Chart activation uses the same 620 ms timing throughout these examples. Point pulses retain
        their size on compact charts. Outlined pulses travel three screen pixels outward on each
        edge; pie slices keep their outline fade, and radar dimensions draw along the spoke. Reduced
        motion uses static feedback.
      </p>
      <Specimen
        description={`Show change over an ordered, numeric, logarithmic, or time domain. Move across the plot to read the nearest recorded category and target reference. Tab into the plot and use the arrow keys for keyboard readings; mouse readings clear when the pointer leaves the plot. ${visibilityGuidance} Explicit axis limits remain fixed; reduced motion makes scale changes immediate.`}
        name="LineChart"
      >
        <Example label="Two-series LineChart with selection and details">
          <Stack gap="regular">
            <SegmentedControl
              label="Click target"
              onChange={(target) => {
                setLineTarget(target);
                setLineSelection([]);
                setLineDetails(null);
              }}
              options={[
                {label: 'Month', value: 'category'},
                {label: 'Point', value: 'point'},
              ]}
              value={lineTarget}
            />
            <InlineGroup align="start" gap="regular" wrap>
              <Switch
                isSelected={lineSelectionEnabled}
                label="Enable selection"
                onChange={setLineSelectionEnabled}
              />
              <Switch
                isSelected={lineDetailsEnabled}
                label="Open details on activation"
                onChange={(enabled) => {
                  setLineDetailsEnabled(enabled);
                  if (!enabled) setLineDetails(null);
                }}
              />
            </InlineGroup>
            <p>{lineInstructions}</p>
            <LineChart
              {...common}
              {...verticalAxes}
              annotations={[{axis: 'y', kind: 'line', label: 'Target', value: 60}]}
              interaction={{
                getRowId: chartRowId,
                ...(lineDetailsEnabled ? {onActivate: setLineDetails} : {}),
                ...(lineSelectionEnabled
                  ? {
                      selection: {
                        labels: {
                          clear: 'Clear selection',
                          empty: 'Nothing selected',
                          hidden: (label) => `${label} (hidden)`,
                          instructions: lineInstructions,
                          item: ({rowId, seriesId}) =>
                            seriesId
                              ? `${rowId}, ${seriesId === 'demand' ? 'Demand' : 'Capacity'}`
                              : rowId,
                          summary: (count) =>
                            `${count} ${lineTarget === 'category' ? (count === 1 ? 'month' : 'months') : count === 1 ? 'point' : 'points'} selected`,
                        },
                        onSelectionChange: setLineSelection,
                        selectedItems: lineSelection,
                      },
                    }
                  : {}),
                target: lineTarget,
              }}
              legend={{label: 'Energy series'}}
              series={[
                {accessor: 'demand', id: 'demand', label: 'Demand', showPoints: true},
                {accessor: 'capacity', color: 'series-2', id: 'capacity', label: 'Capacity'},
              ]}
              title="Thermal demand"
            />
            <p className="showcase-muted">
              Hover highlights a line in either mode. Filled centers show what clicking will select:
              both series in Month mode, one in Point mode. Underlines mark selected months and
              outer rings mark selected points. A brief pulse acknowledges activation. A month opens
              one set of details containing both series; a point opens its own value. Selection
              remains when a series is hidden. These controls and details belong to this example.
            </p>
            {lineDetails ? (
              <Stack gap="regular">
                <DescriptionList
                  ariaLabel={`${lineDetails.category} energy details`}
                  emptyState={{
                    kind: 'no-data',
                    title: 'No readings',
                    description: 'Choose a period with recorded values.',
                  }}
                  items={[
                    {description: lineDetails.category, id: 'month', term: 'Month'},
                    ...lineDetails.values.map(({hidden, label, seriesId, value}) => ({
                      description: `${value} MWh${hidden ? ' (hidden on chart)' : ''}`,
                      id: seriesId,
                      term: label,
                    })),
                  ]}
                />
                <Button onPress={() => setLineDetails(null)} variant="quiet">
                  Close details
                </Button>
              </Stack>
            ) : null}
          </Stack>
        </Example>
      </Specimen>

      <Specimen
        description={`Show magnitude or contribution across an ordered domain. Hiding a series recomputes the stack. Normalized areas and readings use visible shares, while the complete table retains shares of all supplied data. ${visibilityGuidance}`}
        name="AreaChart"
      >
        <Example label="AreaChart with selection and details">
          <AreaMixedInteractionExample kind="area" visibilityLabels={visibilityLabels} />
        </Example>
      </Specimen>

      <Specimen
        description={`Compare discrete categories with grouped, stacked, or normalized vertical columns. Columns retain a zero baseline as visibility changes. A touch reading stays open until another category or an outside press replaces it. ${visibilityGuidance}`}
        name="ColumnChart"
      >
        <Example label="ColumnChart with selection and details">
          <BarInteractionExample orientation="vertical" visibilityLabels={visibilityLabels} />
        </Example>
      </Specimen>

      <Specimen
        description={`Compare discrete categories on a horizontal plot. Up and Down move through its vertical category axis when the plot has keyboard focus. Bars retain a zero baseline as visibility changes. ${visibilityGuidance}`}
        name="BarChart"
      >
        <Example label="BarChart with selection and details">
          <BarInteractionExample orientation="horizontal" visibilityLabels={visibilityLabels} />
        </Example>
      </Specimen>

      <Specimen
        description="Show how categories make up one whole. More than eight positive categories use a proportional aggregate that opens the next page. Hover slices for readings, or use the legend to emphasize and pin a category without opening a tooltip. Tap or click a pinned legend name again to clear its highlight."
        name="PieChart"
      >
        <Example label="Paged PieChart with category selection and details">
          <PartToWholeInteractionExample kind="pie" />
        </Example>
      </Specimen>

      <Specimen
        description="Use the same part-to-whole and paging behavior with a derived total in the center. Tap or click a pinned legend name again to clear its highlight. Zero values remain in the generated table but do not create slices."
        name="DonutChart"
      >
        <Example label="Paged DonutChart with category selection and details">
          <PartToWholeInteractionExample kind="donut" />
        </Example>
      </Specimen>

      <Specimen
        description="Compare a few subjects across ordered qualities that share one nonnegative scale. A dimension is one spoke; a series is one subject and one polygon. Hover near a profile point to isolate it and trace its axis. Its neutral reading fill meets the colored point border at every chart size. Missing dimensions read as zero, while small visual shoulders keep isolated values legible without changing their readings."
        name="RadarChart"
      >
        <Example label="Comparable vehicle profiles with selection and details">
          <RadarInteractionExample visibilityLabels={statisticalVisibilityLabels} />
        </Example>
        <Example label="Sparse profiles with keyboard access to zero values">
          <RadarInteractionExample sparse visibilityLabels={statisticalVisibilityLabels} />
        </Example>
      </Specimen>

      <Specimen
        description="Show one numeric measure across two ordered domains. Zero is colored as a real value; patterned cells have no data. Use a two-sided scale only when its midpoint has a clear meaning. Dense grids hide inline values before moving into a labeled local scroll region."
        name="Heatmap"
      >
        <Example label="Sequential Heatmap with zero and missing cells">
          <HeatmapInteractionExample accent={accent} />
        </Example>
        <Example label="Two-sided Heatmap around target">
          <HeatmapInteractionExample accent={accent} deviation />
        </Example>
      </Specimen>

      <Specimen
        description="Show one compact ordered trend with a standard caption, honest gaps, exact current and observed-range cues, and a complete reading that names lows and highs. Use LineChart when visible axes or multiple series matter."
        name="Sparkline"
      >
        <Example label="Fixed-range Sparkline with selection, details, a gap and tied extremes">
          <SparklineInteractionExample />
        </Example>
      </Specimen>

      <Specimen
        description={`Combine compatible line, area, and column series only when they share one domain, numeric scale, and comparison question. Restored series keep their original colors and patterns. ${visibilityGuidance}`}
        name="CartesianChart"
      >
        <Example label="Mixed CartesianChart with selection and details">
          <AreaMixedInteractionExample kind="mixed" visibilityLabels={visibilityLabels} />
        </Example>
      </Specimen>

      <Specimen
        description={`Compare two quantitative measurements for distinct records. Hover a mark to read only that observation. Pin a legend group to give it priority where points overlap. ${statisticalVisibilityGuidance}`}
        name="ScatterChart"
      >
        <Example label="ScatterChart with group visibility, selection, and details">
          <PointInteractionExample kind="scatter" visibilityLabels={statisticalVisibilityLabels} />
        </Example>
      </Specimen>

      <Specimen
        description={`Add one positive measurement through proportional mark area. Bubble areas express magnitude within the visible dataset; tooltips and the full table retain exact source values. ${statisticalVisibilityGuidance}`}
        name="BubbleChart"
      >
        <Example label="BubbleChart with group visibility, selection, and details">
          <PointInteractionExample kind="bubble" visibilityLabels={statisticalVisibilityLabels} />
        </Example>
      </Specimen>

      <Specimen
        description="Show a numeric distribution from raw observations or explicit pre-binned intervals. Directly reading one bin dims the others; blank plot space has no inferred reading."
        name="Histogram"
      >
        <Example label="Histogram with bin selection and details">
          <HistogramInteractionExample />
        </Example>
      </Specimen>

      <Specimen
        description={`Compare group medians, quartiles, whiskers, and outliers. Select group summaries and individual outliers separately, and open the original observations through details. ${statisticalVisibilityGuidance}`}
        name="BoxPlot"
      >
        <Example label="BoxPlot with group visibility, summary and outlier selection, and details">
          <BoxPlotInteractionExample visibilityLabels={statisticalVisibilityLabels} />
        </Example>
      </Specimen>
    </>
  );
}

function OverlaySpecimens() {
  return (
    <>
      <Specimen
        description="Keep an ordinary bounded task in context. Backdrop, Escape, the close control, or an action can dismiss it; use AlertDialog for consequential confirmation."
        name="Dialog"
      >
        <Dialog
          actions={({close}) => (
            <>
              <Button onPress={close} variant="secondary">
                Cancel
              </Button>
              <Button onPress={close}>Save name</Button>
            </>
          )}
          closeLabel="Close run editor"
          description="Update the display name used throughout this workspace."
          title="Edit run name"
          trigger={<Button>Edit run name</Button>}
        >
          <Stack gap="regular">
            <TextField defaultValue="North wall study" label="Run name" />
            <Drawer
              actions={({close}) => <Button onPress={close}>Done</Button>}
              closeLabel="Close current run inspector"
              description="Inspect solver inputs without leaving the editing task."
              placement="end"
              title="Current run inspector"
              trigger={<Button variant="secondary">Inspect current run</Button>}
            >
              <p>RUN 0284 uses the balanced profile with 25 boundary passes.</p>
            </Drawer>
          </Stack>
        </Dialog>
      </Specimen>

      <Specimen
        description="Confirm consequential work with cancellation focused first. The backdrop cannot dismiss the decision, and destructive emphasis is semantic rather than accent-colored."
        name="AlertDialog"
      >
        <AlertDialog
          actionKind="destructive"
          cancelLabel="Keep archived run"
          confirmLabel="Delete archived run"
          description="This permanently removes RUN 0197 and its saved solver results."
          onConfirm={() => undefined}
          title="Delete this archived run?"
          trigger={<Button variant="danger">Delete archived run</Button>}
        />
      </Specimen>

      <Specimen
        description="Open supplemental work from any viewport edge. A grip can extend the panel directly, while an optional preview strip reserves space instead of covering the page."
        name="Drawer"
      >
        <DrawerShowcase />
      </Specimen>

      <Specimen
        description="Keep short interactive content beside the control that opened it. Focus enters the anchored surface and returns after outside press, Escape, or its close control."
        name="Popover"
      >
        <Popover
          actions={({close}) => <Button onPress={close}>Done</Button>}
          closeLabel="Close run summary"
          description="Review the active run without leaving the current task."
          title="Run summary"
          trigger={<Button>Inspect run summary</Button>}
        >
          <Stack gap="tight">
            <StatusIndicator label="Stable" tone="success" />
            <p>RUN 0284 converged after 18 boundary passes.</p>
          </Stack>
        </Popover>
      </Specimen>

      <Specimen
        description="Add a short description to an already named control. Hover or focus reveals it; required instructions and interactive content belong elsewhere."
        name="Tooltip"
      >
        <Tooltip content="Copies the immutable identifier used in run history.">
          <Button>Copy run ID</Button>
        </Tooltip>
      </Specimen>

      <Specimen
        description="Open a library-owned command list from an explicit action. Whole-row highlights identify hovered and focused commands without adding a separate entry rail."
        name="Menu"
      >
        <Menu
          items={[
            {
              description: 'Create a new run from the current inputs.',
              id: 'duplicate-run',
              label: 'Duplicate run',
              onAction: () => undefined,
              shortcut: 'Ctrl+D',
              type: 'action',
            },
            {id: 'run-actions-divider', type: 'separator'},
            {
              id: 'more-run-actions',
              items: [
                {
                  id: 'archive-run',
                  label: 'Archive run',
                  onAction: () => undefined,
                  type: 'action',
                },
                {
                  id: 'delete-run',
                  label: 'Delete run',
                  onAction: () => undefined,
                  tone: 'danger',
                  type: 'action',
                },
              ],
              label: 'More actions',
              type: 'submenu',
            },
          ]}
          trigger={<Button>Open run actions</Button>}
        />
      </Specimen>

      <Specimen
        description="Attach secondary commands to one named object. Right-click, touch long press, or focus and press Shift+F10 to open the same command model and whole-row highlights as Menu."
        name="ContextMenu"
      >
        <ContextMenu
          items={[
            {
              id: 'inspect-boundary',
              label: 'Inspect boundary',
              onAction: () => undefined,
              type: 'action',
            },
            {
              id: 'duplicate-boundary',
              label: 'Duplicate boundary',
              onAction: () => undefined,
              type: 'action',
            },
          ]}
          targetLabel="Boundary condition BC-12"
        >
          <div className="showcase-context-target">
            <strong>BC-12</strong>
            <span>Insulated north wall</span>
          </div>
        </ContextMenu>
      </Specimen>
    </>
  );
}

function DrawerShowcase() {
  const [placement, setPlacement] = useState<DrawerPlacement>('end');
  const [dock, setDock] = useState<'none' | 'grip' | 'preview'>('none');
  const [hasHandle, setHasHandle] = useState(true);

  return (
    <Stack gap="relaxed">
      <SegmentedControl
        label="Drawer placement"
        onChange={setPlacement}
        options={drawerPlacementOptions}
        value={placement}
      />
      <SegmentedControl
        label="Dock behavior"
        onChange={setDock}
        options={drawerDockOptions}
        value={dock}
      />
      <InlineGroup align="start" gap="regular" wrap>
        {dock === 'preview' ? (
          <Switch isSelected={hasHandle} label="Show drag handle" onChange={setHasHandle} />
        ) : null}
        <Drawer
          actions={({close}) => <Button onPress={close}>Done</Button>}
          closeLabel="Close result inspector"
          description="Review solver output without leaving the run list."
          placement={placement}
          title="Result inspector"
          trigger={<Button>Inspect active run</Button>}
          {...(dock === 'preview' ? {dockedPreview: <span>RUN 0284 · Stable</span>} : {})}
          {...(dock === 'grip' || (dock === 'preview' && hasHandle)
            ? {dragHandleLabel: 'Move result inspector'}
            : {})}
        >
          <Stack gap="regular">
            <StatusIndicator label="Stable" tone="success" />
            <p>RUN 0284 converged after 18 of 25 available boundary passes.</p>
          </Stack>
        </Drawer>
      </InlineGroup>
    </Stack>
  );
}

const StaticLayoutSpecimens = memo(LayoutSpecimens);
const StaticApplicationStructureSpecimens = memo(ApplicationStructureSpecimens);
const StaticActionSpecimens = memo(ActionSpecimens);
const StaticNavigationSpecimens = memo(NavigationSpecimens);
const StaticFieldSpecimens = memo(FieldSpecimens);
const StaticChoiceSpecimens = memo(ChoiceSpecimens);
const StaticSelectionSpecimens = memo(SelectionSpecimens);
const StaticCollectionSpecimens = memo(CollectionSpecimens);
const StaticChartSpecimens = memo(ChartSpecimens);
const StaticRangeSpecimens = memo(RangeSpecimens);
const StaticDateTimeSpecimens = memo(DateTimeSpecimens);
const StaticFileSpecimens = memo(FileSpecimens);
const StaticFeedbackSpecimens = memo(FeedbackSpecimens);
const StaticOverlaySpecimens = memo(OverlaySpecimens);

export function Showcase() {
  const [appearance, setAppearance] = useState<Appearance>('dark');
  const [accent, setAccent] = useState<AccentColor>(defaultAccent);
  const indexScrollbarProps = useScrollbarActivity<HTMLElement>();
  const mainScrollbarProps = useScrollbarActivity<HTMLElement>();

  return (
    <AppearanceProvider accent={accent} appearance={appearance}>
      <div className="showcase-shell">
        <div className="showcase-frame">
          <aside
            {...indexScrollbarProps}
            aria-label="Showcase controls and component index"
            className="showcase-index"
            tabIndex={0}
          >
            <div className="showcase-index-controls">
              <div className="showcase-index-control">
                <span className="showcase-index-label">Appearance</span>
                <ToggleButton
                  isSelected={appearance === 'dark'}
                  onChange={(selected) => setAppearance(selected ? 'dark' : 'light')}
                  size="compact"
                >
                  Dark
                </ToggleButton>
              </div>
              <div className="showcase-index-control">
                <label className="showcase-index-label" htmlFor="showcase-accent">
                  Accent
                </label>
                <div className="showcase-accent-control">
                  <input
                    aria-describedby="showcase-accent-value"
                    className="showcase-accent-input"
                    id="showcase-accent"
                    onChange={(event) => setAccent(event.currentTarget.value as AccentColor)}
                    type="color"
                    value={accent}
                  />
                  <code id="showcase-accent-value">{accent}</code>
                </div>
              </div>
            </div>
            <nav aria-label="Component catalog">
              {showcaseGroups.map((group) => (
                <div className="showcase-index-group" key={group.label}>
                  <span>{group.label}</span>
                  {group.components.map((component) => (
                    <a href={`#${componentAnchor(component)}`} key={component}>
                      {component}
                    </a>
                  ))}
                </div>
              ))}
            </nav>
          </aside>

          <div
            {...mainScrollbarProps}
            aria-label="Component examples"
            className="showcase-main-pane"
            role="region"
            tabIndex={0}
          >
            <header className="showcase-masthead">
              <div className="showcase-identity">
                <span className="showcase-kicker">Whitney component library</span>
                <h1>Component showcase</h1>
                <p>Compare intended uses, working interactions, and component states.</p>
              </div>
              <div aria-hidden="true" className="showcase-route">
                <span className="showcase-route-origin" />
                <span className="showcase-route-track" />
                <span className="showcase-route-endpoint" />
              </div>
              <div className="showcase-status">
                <span className="showcase-status-label">Catalog current</span>
                <strong>{showcasedComponentNames.length} components</strong>
              </div>
            </header>

            <main className="showcase-content">
              <section aria-labelledby="foundation-heading" className="showcase-family">
                <header className="showcase-family-header">
                  <span>Foundation</span>
                  <h2 id="foundation-heading">Theme every component together</h2>
                </header>
                <Specimen
                  description="Choose light or dark appearance and one accent at the application boundary. Every library component below the provider uses those values."
                  name="AppearanceProvider"
                >
                  <div className="showcase-provider-sample">
                    <span className="showcase-accent-swatch" />
                    <div>
                      <strong>{appearance === 'dark' ? 'Dark' : 'Light'} appearance</strong>
                      <p className="showcase-muted">
                        Accent {accent} shapes focus, rails, and emphasis.
                      </p>
                    </div>
                  </div>
                </Specimen>
              </section>

              <section aria-labelledby="layout-heading" className="showcase-family">
                <header className="showcase-family-header">
                  <span>Layout</span>
                  <h2 id="layout-heading">Arrange and contain related content</h2>
                </header>
                <StaticLayoutSpecimens />
              </section>

              <section aria-labelledby="application-heading" className="showcase-family">
                <header className="showcase-family-header">
                  <span>Application structure</span>
                  <h2 id="application-heading">
                    Assign regions and preserve workspace relationships
                  </h2>
                </header>
                <StaticApplicationStructureSpecimens />
              </section>

              <section aria-labelledby="actions-heading" className="showcase-family">
                <header className="showcase-family-header">
                  <span>Actions</span>
                  <h2 id="actions-heading">Run commands, navigate, and retain state</h2>
                </header>
                <StaticActionSpecimens />
              </section>

              <section aria-labelledby="navigation-heading" className="showcase-family">
                <header className="showcase-family-header">
                  <span>Navigation and disclosure</span>
                  <h2 id="navigation-heading">Move through locations and reveal related content</h2>
                </header>
                <StaticNavigationSpecimens />
              </section>

              <section aria-labelledby="fields-heading" className="showcase-family">
                <header className="showcase-family-header">
                  <span>Fields</span>
                  <h2 id="fields-heading">Enter values and organize forms</h2>
                </header>
                <StaticFieldSpecimens />
              </section>

              <section aria-labelledby="choices-heading" className="showcase-family">
                <header className="showcase-family-header">
                  <span>Choices</span>
                  <h2 id="choices-heading">Present choices that remain visible</h2>
                </header>
                <StaticChoiceSpecimens />
              </section>

              <section aria-labelledby="selection-heading" className="showcase-family">
                <header className="showcase-family-header">
                  <span>Selection</span>
                  <h2 id="selection-heading">Choose from collapsible collections</h2>
                </header>
                <StaticSelectionSpecimens />
              </section>

              <section aria-labelledby="collections-heading" className="showcase-family">
                <header className="showcase-family-header">
                  <span>Data and collections</span>
                  <h2 id="collections-heading">Query, compare, and navigate keyed data</h2>
                </header>
                <StaticCollectionSpecimens />
              </section>

              <section aria-labelledby="charts-heading" className="showcase-family">
                <header className="showcase-family-header">
                  <span>Charts</span>
                  <h2 id="charts-heading">
                    Plot data without prescribing the surrounding workspace
                  </h2>
                </header>
                <StaticChartSpecimens accent={accent} />
              </section>

              <section aria-labelledby="ranges-heading" className="showcase-family">
                <header className="showcase-family-header">
                  <span>Ranges</span>
                  <h2 id="ranges-heading">Adjust approximate numeric values</h2>
                </header>
                <StaticRangeSpecimens />
              </section>

              <section aria-labelledby="date-time-heading" className="showcase-family">
                <header className="showcase-family-header">
                  <span>Date and time</span>
                  <h2 id="date-time-heading">Enter dates, times, and intervals</h2>
                </header>
                <StaticDateTimeSpecimens />
              </section>

              <section aria-labelledby="files-heading" className="showcase-family">
                <header className="showcase-family-header">
                  <span>Files</span>
                  <h2 id="files-heading">Acquire files through picker, drop, or paste</h2>
                </header>
                <StaticFileSpecimens />
              </section>

              <section aria-labelledby="feedback-heading" className="showcase-family">
                <header className="showcase-family-header">
                  <span>Feedback</span>
                  <h2 id="feedback-heading">Report status, progress, and problems</h2>
                </header>
                <StaticFeedbackSpecimens />
              </section>

              <section aria-labelledby="overlays-heading" className="showcase-family">
                <header className="showcase-family-header">
                  <span>Overlays</span>
                  <h2 id="overlays-heading">Focus temporary tasks and consequential decisions</h2>
                </header>
                <StaticOverlaySpecimens />
              </section>
            </main>
          </div>
        </div>
      </div>
    </AppearanceProvider>
  );
}
