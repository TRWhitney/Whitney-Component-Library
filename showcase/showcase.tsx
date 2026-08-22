import {
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';

import {
  AlertBanner,
  AlertDialog,
  AppearanceProvider,
  Badge,
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  ComboBox,
  DateField,
  DatePicker,
  DateRangePicker,
  Dialog,
  Divider,
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
  Meter,
  NotificationProvider,
  NumberField,
  ProgressBar,
  RangeSlider,
  ResponsiveGrid,
  RadioGroup,
  ScrollRegion,
  SearchField,
  Section,
  Select,
  Slider,
  Skeleton,
  Spinner,
  Stack,
  StatusIndicator,
  SegmentedControl,
  Surface,
  Switch,
  TextArea,
  TextField,
  TimeField,
  ToggleButton,
  Toolbar,
  type AccentColor,
  type Appearance,
  type FieldControlProps,
  type FileAcquisitionResult,
} from '../src/index.js';
import {componentAnchor, showcaseGroups, showcasedComponentNames} from './catalog.js';

const defaultAccent: AccentColor = '#2878ff';
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
        description="Include one optional value or acknowledge one condition. Use CheckboxGroup for related multi-select options and Switch for an immediately applied setting. Indeterminate reports mixed child state rather than a third value."
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
        description="Enter a date through segments or choose it from a fixed six-week calendar. Use DateField when the calendar adds no value. Select the month or year heading for long-distance navigation."
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
        description="Use a large acquisition target when drag, focused paste, and browsing should all work. Use FileTrigger for a compact button-only flow. The file icon moves only while the target is enabled."
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
        description="Queue brief confirmations for background events without moving focus. Messages pause on hover or focus and remain dismissible; use durable alerts or a dialog when recovery matters."
        name="NotificationProvider"
      >
        <NotificationProvider
          dismissLabel="Dismiss notification"
          label="Showcase notifications"
          maxVisible={2}
        >
          {({notify}) => (
            <Button
              onPress={() =>
                notify({
                  description: 'The export is available in run history.',
                  title: 'Export ready',
                  tone: 'success',
                })
              }
            >
              Show export notification
            </Button>
          )}
        </NotificationProvider>
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
        description="Open supplemental work from a logical viewport edge. Start and end follow writing direction, and the panel becomes full-screen at compact widths."
        name="Drawer"
      >
        <ResponsiveGrid equalItems gap="regular" minimumItemWidth="compact">
          <Example label="Start-edge Drawer">
            <Drawer
              actions={({close}) => <Button onPress={close}>Apply filters</Button>}
              closeLabel="Close run filters"
              description="Limit the visible run history without leaving the current page."
              placement="start"
              title="Run filters"
              trigger={<Button variant="secondary">Filter runs</Button>}
            >
              <p>Choose the statuses and profiles included in the run list.</p>
            </Drawer>
          </Example>
          <Example label="End-edge Drawer">
            <Drawer
              actions={({close}) => <Button onPress={close}>Done</Button>}
              closeLabel="Close result inspector"
              description="Review solver output without leaving the run list."
              placement="end"
              title="Result inspector"
              trigger={<Button>Inspect result</Button>}
            >
              <Stack gap="regular">
                <StatusIndicator label="Stable" tone="success" />
                <p>RUN 0284 converged after 18 of 25 available boundary passes.</p>
              </Stack>
            </Drawer>
          </Example>
        </ResponsiveGrid>
      </Specimen>
    </>
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

            <section aria-labelledby="actions-heading" className="showcase-family">
              <header className="showcase-family-header">
                <span>Actions</span>
                <h2 id="actions-heading">Run commands, navigate, and retain state</h2>
              </header>
              <ActionSpecimens />
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
