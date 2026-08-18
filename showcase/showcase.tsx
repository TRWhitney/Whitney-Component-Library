import {useState, type ReactNode} from 'react';

import {
  AppearanceProvider,
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  ComboBox,
  Divider,
  Field,
  FieldGroup,
  FormSection,
  IconButton,
  InlineGroup,
  Link,
  NumberField,
  ResponsiveGrid,
  RadioGroup,
  ScrollRegion,
  SearchField,
  Section,
  Select,
  Stack,
  SegmentedControl,
  Surface,
  Switch,
  TextArea,
  TextField,
  ToggleButton,
  Toolbar,
  type AccentColor,
  type Appearance,
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
      <Specimen
        description="Own vertical rhythm without requiring consumers to coordinate child margins."
        name="Stack"
      >
        <Stack gap="tight">
          <div className="showcase-measure">Prepare geometry</div>
          <div className="showcase-measure">Resolve boundaries</div>
          <div className="showcase-measure">Run profile</div>
        </Stack>
      </Specimen>

      <Specimen
        description="Align related peers in one row, with deliberate wrapping and equal sizing when needed."
        name="InlineGroup"
      >
        <InlineGroup equalItems gap="tight" wrap>
          <Button variant="secondary">Conservative</Button>
          <Button variant="secondary">Balanced</Button>
          <Button variant="secondary">Fast</Button>
        </InlineGroup>
      </Specimen>

      <Specimen
        description="Reflow repeated peers from columns to a single track at the component’s owned threshold."
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
        description="Separate neighboring regions when spacing alone does not communicate the boundary."
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
        description="Provide neutral containment with bounded padding, border, and elevation choices."
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
        description="Give a content region a visible semantic heading, description, and optional action."
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
        description="Keep bounded overflow labeled and keyboard reachable; reveal its native thumb during activity, fade it after idle, and retain it during focus."
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
        description="Issue a command with explicit emphasis, state, and native form behavior."
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
        description="Present a compact icon-only command with one required accessible label and matching tooltip."
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
        description="Control a persistent binary choice whose selected state remains visible through the rail."
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
        description="Keep a small set of ordinary commands adjacent while preserving every tab stop."
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
        description="Coordinate related commands with orientation-aware arrow-key navigation."
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
        description="Apply shared label and support relationships to one direct custom control through a guarded accessibility seam, including readable native option entries."
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
        description="Collect one line of text with persistent labeling and support that does not move the control."
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
        description="Collect multiline plain text with a bounded three-, five-, or eight-row initial height and native editing behavior."
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
        description="Format, parse, bound, and step a numeric value—including opt-in focused wheel stepping—without exposing intermediate parser state."
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
        description="Name and arrange one related native fieldset with equal responsive columns, aligned controls when a peer label wraps, and group-owned disabled propagation."
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
        description="Organize a larger form workflow with owned vertical rhythm under a visible semantic heading without adding a divider."
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
        description="Select one independent optional or indeterminate value with a stable native form meaning."
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
        description="Switch among compact bounded modes with equal peers and one gliding rail below neutral selected text."
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
        description="Choose one stable value from a bounded collapsible collection with typeahead, native form behavior, and viewport-aware overlay placement."
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
        description="Filter and choose one stable value from local, dynamic, or asynchronously supplied options while input and selection ownership remain explicit."
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
            <p>Browse the current public surface through working, intent-specific examples.</p>
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
                <h2 id="foundation-heading">One bounded visual environment</h2>
              </header>
              <Specimen
                description="Establish the appearance and propagated application accent for every library descendant."
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
                <h2 id="selection-heading">Collections stay bounded and searchable</h2>
              </header>
              <SelectionSpecimens />
            </section>
          </main>
        </div>
      </div>
    </AppearanceProvider>
  );
}
