import {useState, type ReactNode} from 'react';

import {
  AlertBanner,
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
  Divider,
  DropZone,
  Field,
  FieldGroup,
  FileTrigger,
  FormSection,
  IconButton,
  InlineAlert,
  InlineGroup,
  Link,
  Meter,
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

function LayoutSpecimens() {
  return (
    <>
      <Specimen description="Stack related items vertically with consistent gaps." name="Stack">
        <Stack gap="tight">
          <div className="showcase-measure">Prepare geometry</div>
          <div className="showcase-measure">Resolve boundaries</div>
          <div className="showcase-measure">Run profile</div>
        </Stack>
      </Specimen>

      <Specimen
        description="Align related items in a row, with optional wrapping and equal sizing."
        name="InlineGroup"
      >
        <InlineGroup equalItems gap="tight" wrap>
          <Button variant="secondary">Conservative</Button>
          <Button variant="secondary">Balanced</Button>
          <Button variant="secondary">Fast</Button>
        </InlineGroup>
      </Specimen>

      <Specimen
        description="Fit repeated items into columns, then collapse them as space runs out."
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
        description="Draw a divider when spacing alone does not separate neighboring regions."
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
        description="Group related content with preset padding, border, and elevation."
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
        description="Give a content region a visible heading, description, and optional action."
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
        description="Label a scrollable region and keep it keyboard accessible. Its scrollbar appears during activity or focus and fades when idle."
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
        description="Run a command with a chosen emphasis while retaining native form behavior."
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
        description="Use an icon-only command with a required accessible label and matching tooltip."
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
        description="Navigate to a destination without disguising navigation as a command."
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
        description="Control a persistent binary choice with a visible selection rail."
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
        description="Group a few related commands without changing their tab order."
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
        description="Group frequent commands under horizontal or vertical arrow-key navigation."
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
        description="Connect a label and support text to one custom control, including readable native option entries."
        name="Field"
      >
        <Field description="Select the compute queue for this run." label="Compute queue">
          {(controlProps) => (
            <select {...controlProps} defaultValue="standard">
              <option value="standard">Standard</option>
              <option value="priority">Priority</option>
            </select>
          )}
        </Field>
      </Specimen>

      <Specimen
        description="Collect one line of text with a fixed label and support area."
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
        description="Collect multiline plain text in a three-, five-, or eight-row native text area."
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
        description="Format, parse, limit, and step a number. Focused wheel stepping is optional, and partial input stays internal."
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
        description="Enter, submit, and clear an editable query with native search semantics and one conditional named clear command."
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
        description="Name related fields, arrange them in equal responsive columns, align controls when labels wrap, and disable them as a group."
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
        description="Organize a form section under a visible heading with consistent vertical spacing."
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
        description="Select one optional value, including an indeterminate state, with native form behavior."
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
        description="Choose zero or more related values under one accessible group question."
        name="CheckboxGroup"
      >
        <CheckboxGroup
          defaultValue={['thermal']}
          description="Select every layer to retain in the exported result."
          label="Result layers"
          name="layers"
          options={[
            {label: 'Thermal', value: 'thermal'},
            {label: 'Pressure', value: 'pressure'},
            {isDisabled: true, label: 'Velocity unavailable', value: 'velocity'},
          ]}
        />
      </Specimen>

      <Specimen
        description="Choose one visible mutually exclusive answer with native radio and arrow-key behavior."
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
        description="Turn one immediately applied setting on or off without changing its label."
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
        description="Switch among a few compact modes with equal segments and a moving selection rail."
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
        description="Choose one value from a collapsible list with typeahead, native form behavior, and viewport-aware placement."
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
        description="Filter local, dynamic, or asynchronous options and choose one value. Input text and selection stay separate."
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
        description="Adjust an approximate value on a formatted scale with keyboard, pointer, or touch input."
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
        description="Adjust an interval with named, non-crossing bounds and offset thumbs that stay distinct when close."
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
        description="Enter an ISO civil date through locale- and calendar-aware segments."
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
        description="Enter a zone-free wall-clock time with a chosen hour cycle and visible precision."
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
        description="Choose an ISO civil date through synchronized segments and a calendar."
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
        description="Choose an inclusive ISO date interval with a separate form value for each endpoint."
        name="DateRangePicker"
      >
        <ResponsiveGrid equalItems gap="regular" minimumItemWidth="compact">
          <Example label="DateRangePicker interval">
            <DateRangePicker
              calendar="gregory"
              calendarButtonLabel="Choose review window"
              defaultValue={{
                start: {day: 20, month: 8, year: 2026},
                end: {day: 24, month: 8, year: 2026},
              }}
              description="Both endpoint dates are included."
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
        description="Open a native picker with file constraints and report which files it accepted or rejected. The application manages the files afterward."
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
        description="Accept files by drag, focused paste, or a named native picker. Upload and storage remain application concerns."
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
        </ResponsiveGrid>
      </Specimen>
    </>
  );
}

function FeedbackSpecimens() {
  return (
    <>
      <Specimen
        description="Show a concise neutral, success, in-progress, or danger state. Announcements are opt-in."
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
        description="Add short metadata or an identifier to an object without creating a live status region."
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
        description="Explain feedback for a nearby region without shifting its layout. Announcements are optional."
        name="InlineAlert"
      >
        <InlineAlert title="Boundary review" tone="warning">
          Check the north wall coefficient before running the profile.
        </InlineAlert>
      </Specimen>

      <Specimen
        description="Explain a condition that affects the whole page or workspace."
        name="AlertBanner"
      >
        <AlertBanner title="Solver disconnected" tone="danger">
          Reconnect the solver before starting or resuming runs.
        </AlertBanner>
      </Specimen>

      <Specimen
        description="Report progress toward completion, whether the amount is known or indeterminate."
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
        description="Show a measured value with units and named warning or danger thresholds."
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
        description="Show a labeled busy indicator while work is active, with an option to reserve its space while idle."
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
            <p>Browse working examples of every public component.</p>
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
                <h2 id="foundation-heading">Shared appearance and accent</h2>
              </header>
              <Specimen
                description="Set the appearance and accent for every library component below the provider."
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
                <h2 id="layout-heading">Relationships before decoration</h2>
              </header>
              <LayoutSpecimens />
            </section>

            <section aria-labelledby="actions-heading" className="showcase-family">
              <header className="showcase-family-header">
                <span>Actions</span>
                <h2 id="actions-heading">Commands keep their meaning</h2>
              </header>
              <ActionSpecimens />
            </section>

            <section aria-labelledby="fields-heading" className="showcase-family">
              <header className="showcase-family-header">
                <span>Fields</span>
                <h2 id="fields-heading">Values keep their own semantics</h2>
              </header>
              <FieldSpecimens />
            </section>

            <section aria-labelledby="choices-heading" className="showcase-family">
              <header className="showcase-family-header">
                <span>Choices</span>
                <h2 id="choices-heading">Selection keeps its model visible</h2>
              </header>
              <ChoiceSpecimens />
            </section>

            <section aria-labelledby="selection-heading" className="showcase-family">
              <header className="showcase-family-header">
                <span>Selection</span>
                <h2 id="selection-heading">Choose or search a collection</h2>
              </header>
              <SelectionSpecimens />
            </section>

            <section aria-labelledby="ranges-heading" className="showcase-family">
              <header className="showcase-family-header">
                <span>Ranges</span>
                <h2 id="ranges-heading">Values stay measurable</h2>
              </header>
              <RangeSpecimens />
            </section>

            <section aria-labelledby="date-time-heading" className="showcase-family">
              <header className="showcase-family-header">
                <span>Date and time</span>
                <h2 id="date-time-heading">Civil values keep their context</h2>
              </header>
              <DateTimeSpecimens />
            </section>

            <section aria-labelledby="files-heading" className="showcase-family">
              <header className="showcase-family-header">
                <span>Files</span>
                <h2 id="files-heading">Acquisition stops at the application boundary</h2>
              </header>
              <FileSpecimens />
            </section>

            <section aria-labelledby="feedback-heading" className="showcase-family">
              <header className="showcase-family-header">
                <span>Feedback</span>
                <h2 id="feedback-heading">Meaning stays distinct from momentum</h2>
              </header>
              <FeedbackSpecimens />
            </section>
          </main>
        </div>
      </div>
    </AppearanceProvider>
  );
}
