import {useState, type ReactNode} from 'react';

import {
  AppearanceProvider,
  Button,
  ButtonGroup,
  Divider,
  IconButton,
  InlineGroup,
  Link,
  ResponsiveGrid,
  ScrollRegion,
  Section,
  Stack,
  Surface,
  ToggleButton,
  Toolbar,
  type AccentColor,
  type Appearance,
} from '../src/index.js';
import {componentAnchor, showcaseGroups, showcasedComponentNames} from './catalog.js';

const defaultAccent: AccentColor = '#2878ff';

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
          </main>
        </div>
      </div>
    </AppearanceProvider>
  );
}
