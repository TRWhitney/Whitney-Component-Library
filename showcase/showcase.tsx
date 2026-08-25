import {
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
  DropZone,
  Drawer,
  EmptyState,
  Field,
  FieldGroup,
  FileTrigger,
  FormSection,
  IconButton,
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
  ProcessTracker,
  ProgressBar,
  Popover,
  RangeSlider,
  ResponsiveGrid,
  RadioGroup,
  ScrollRegion,
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
  type CollectionQueryFor,
  type DrawerPlacement,
  type FieldControlProps,
  type FileAcquisitionResult,
  type TableSortDescriptor,
} from '../src/index.js';
import {componentAnchor, showcaseGroups, showcasedComponentNames} from './catalog.js';

const defaultAccent: AccentColor = '#2878ff';
const chartData = [
  {capacity: 58, demand: 42, month: 'Jan'},
  {capacity: 64, demand: 51, month: 'Feb'},
  {capacity: 68, demand: 61, month: 'Mar'},
  {capacity: 72, demand: 57, month: 'Apr'},
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

function ChartSpecimens() {
  const verticalAxes = {
    xAxis: {accessor: 'month', label: 'Month', scale: {type: 'categorical'}},
    yAxis: {label: 'Energy', scale: {type: 'linear'}, showGrid: true, unit: 'MWh'},
  } as const;
  const common = {
    ...chartStateCopy,
    data: chartData,
    dataTableLabel: 'Monthly energy data',
    description: 'Monthly demand remains within available thermal capacity.',
  } as const;

  return (
    <>
      <Specimen
        description="Show change over an ordered, numeric, logarithmic, or time domain. The generated table carries the complete static meaning without requiring pointer interaction."
        name="LineChart"
      >
        <Example label="Two-series LineChart">
          <LineChart
            {...common}
            {...verticalAxes}
            annotations={[{axis: 'y', kind: 'line', label: 'Target', value: 60}]}
            legend={{label: 'Energy series'}}
            series={[
              {accessor: 'demand', id: 'demand', label: 'Demand', showPoints: true},
              {accessor: 'capacity', color: 'series-2', id: 'capacity', label: 'Capacity'},
            ]}
            title="Thermal demand"
          />
        </Example>
      </Specimen>

      <Specimen
        description="Show magnitude or contribution across an ordered domain. Choose overlap, stacked, or normalized deliberately; the chart does not infer that relationship."
        name="AreaChart"
      >
        <Example label="Stacked AreaChart">
          <AreaChart
            {...common}
            {...verticalAxes}
            legend={{label: 'Energy series'}}
            series={[
              {accessor: 'demand', id: 'demand', label: 'Demand'},
              {accessor: 'capacity', color: 'series-2', id: 'capacity', label: 'Capacity'},
            ]}
            stacking="stacked"
            title="Energy magnitude"
          />
        </Example>
      </Specimen>

      <Specimen
        description="Compare discrete categories with grouped, stacked, or normalized vertical columns. Use BarChart when category labels need horizontal room."
        name="ColumnChart"
      >
        <Example label="Grouped ColumnChart">
          <ColumnChart
            {...common}
            {...verticalAxes}
            layout="grouped"
            legend={{label: 'Energy series'}}
            series={[
              {accessor: 'demand', id: 'demand', label: 'Demand'},
              {accessor: 'capacity', color: 'series-2', id: 'capacity', label: 'Capacity'},
            ]}
            title="Monthly comparison"
          />
        </Example>
      </Specimen>

      <Specimen
        description="Compare discrete categories on a horizontal plot. The orientation is part of the named component rather than a renderer option."
        name="BarChart"
      >
        <Example label="Horizontal BarChart">
          <BarChart
            {...common}
            layout="grouped"
            series={[{accessor: 'demand', id: 'demand', label: 'Demand'}]}
            title="Demand by month"
            xAxis={{label: 'Energy', scale: {type: 'linear'}, showGrid: true, unit: 'MWh'}}
            yAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
          />
        </Example>
      </Specimen>

      <Specimen
        description="Combine compatible line, area, and column series only when they share one domain, numeric scale, and comparison question. Prefer a named single-mark chart otherwise."
        name="CartesianChart"
      >
        <Example label="Mixed CartesianChart">
          <CartesianChart
            {...common}
            {...verticalAxes}
            legend={{label: 'Energy series'}}
            series={[
              {
                accessor: 'capacity',
                id: 'capacity',
                kind: 'column',
                label: 'Capacity',
              },
              {
                accessor: 'demand',
                id: 'demand',
                kind: 'line',
                label: 'Demand',
                showPoints: true,
              },
            ]}
            title="Demand within capacity"
          />
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
      <ResponsiveGrid equalItems gap="regular" minimumItemWidth="compact">
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
      </ResponsiveGrid>
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

export function Showcase() {
  const [appearance, setAppearance] = useState<Appearance>('dark');
  const [accent, setAccent] = useState<AccentColor>(defaultAccent);

  return (
    <AppearanceProvider accent={accent} appearance={appearance}>
      <div className="showcase-shell">
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

        <div className="showcase-frame">
          <aside className="showcase-index">
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
              <LayoutSpecimens />
            </section>

            <section aria-labelledby="application-heading" className="showcase-family">
              <header className="showcase-family-header">
                <span>Application structure</span>
                <h2 id="application-heading">
                  Assign regions and preserve workspace relationships
                </h2>
              </header>
              <ApplicationStructureSpecimens />
            </section>

            <section aria-labelledby="actions-heading" className="showcase-family">
              <header className="showcase-family-header">
                <span>Actions</span>
                <h2 id="actions-heading">Run commands, navigate, and retain state</h2>
              </header>
              <ActionSpecimens />
            </section>

            <section aria-labelledby="navigation-heading" className="showcase-family">
              <header className="showcase-family-header">
                <span>Navigation and disclosure</span>
                <h2 id="navigation-heading">Move through locations and reveal related content</h2>
              </header>
              <NavigationSpecimens />
            </section>

            <section aria-labelledby="fields-heading" className="showcase-family">
              <header className="showcase-family-header">
                <span>Fields</span>
                <h2 id="fields-heading">Enter values and organize forms</h2>
              </header>
              <FieldSpecimens />
            </section>

            <section aria-labelledby="choices-heading" className="showcase-family">
              <header className="showcase-family-header">
                <span>Choices</span>
                <h2 id="choices-heading">Present choices that remain visible</h2>
              </header>
              <ChoiceSpecimens />
            </section>

            <section aria-labelledby="selection-heading" className="showcase-family">
              <header className="showcase-family-header">
                <span>Selection</span>
                <h2 id="selection-heading">Choose from collapsible collections</h2>
              </header>
              <SelectionSpecimens />
            </section>

            <section aria-labelledby="collections-heading" className="showcase-family">
              <header className="showcase-family-header">
                <span>Data and collections</span>
                <h2 id="collections-heading">Query, compare, and navigate keyed data</h2>
              </header>
              <CollectionSpecimens />
            </section>

            <section aria-labelledby="charts-heading" className="showcase-family">
              <header className="showcase-family-header">
                <span>Charts</span>
                <h2 id="charts-heading">Plot data without prescribing the surrounding workspace</h2>
              </header>
              <ChartSpecimens />
            </section>

            <section aria-labelledby="ranges-heading" className="showcase-family">
              <header className="showcase-family-header">
                <span>Ranges</span>
                <h2 id="ranges-heading">Adjust approximate numeric values</h2>
              </header>
              <RangeSpecimens />
            </section>

            <section aria-labelledby="date-time-heading" className="showcase-family">
              <header className="showcase-family-header">
                <span>Date and time</span>
                <h2 id="date-time-heading">Enter dates, times, and intervals</h2>
              </header>
              <DateTimeSpecimens />
            </section>

            <section aria-labelledby="files-heading" className="showcase-family">
              <header className="showcase-family-header">
                <span>Files</span>
                <h2 id="files-heading">Acquire files through picker, drop, or paste</h2>
              </header>
              <FileSpecimens />
            </section>

            <section aria-labelledby="feedback-heading" className="showcase-family">
              <header className="showcase-family-header">
                <span>Feedback</span>
                <h2 id="feedback-heading">Report status, progress, and problems</h2>
              </header>
              <FeedbackSpecimens />
            </section>

            <section aria-labelledby="overlays-heading" className="showcase-family">
              <header className="showcase-family-header">
                <span>Overlays</span>
                <h2 id="overlays-heading">Focus temporary tasks and consequential decisions</h2>
              </header>
              <OverlaySpecimens />
            </section>
          </main>
        </div>
      </div>
    </AppearanceProvider>
  );
}
