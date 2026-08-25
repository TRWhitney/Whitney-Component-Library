# Component Library Foundation

## Destination

Establish and implement the first coherent release of a reusable component, style, and behavior
library whose APIs and guidance constrain agent-authored applications toward consistent,
appropriate results while preserving deliberate extension through reusable composites and a
propagated application accent.

## Current state

Tickets 01 through 18, including the intervening Ticket 03A accent correction, are complete.
The future-ticket audit is complete. Ticket 18 delivers ProcessTracker and a non-exported
operational integration fixture that proves one coherent stateful flow. The data-analysis,
Markdown-authoring, and application-workbench
tickets retain only non-exported integration proof. The speculative forward-expansion probe ticket
is removed, and the release gates no longer require public application constructs. Manual
screen-reader operation remains consolidated in the pre-`1.0` release gate.

The library remains pre-adoption. Four completed `0.x` integration fixtures, a broad conventional
catalog, the accepted Markdown editing surface, the accessible chart family including radar
charts, and the final compatibility and quality gates are required before `1.0`.

## Accepted foundation

- React and TypeScript are the public consumption model. React Aria is a private behavior
  foundation; the library owns its public APIs, compositions, styles, guidance, and tests.
- The package is modern ESM with explicit CSS and agent-metadata subpaths. React and React DOM are
  external peers. The tooling floor is Node `>=22.12.0` and public declarations support TypeScript
  5.9 and newer through the current matrix.
- Canonical component contracts generate human guidance, a structured manifest, and a compact
  agent index. Narrow typed APIs advertise appropriate use, alternatives, composition, state,
  accessibility, and extension boundaries.
- Focus + Rail + Momentum + Route is the accepted visual language under continuity without
  conflation: connected treatments may reinforce one relationship without duplicating another
  state or adding purposeless ornament.
- The application accent is exact in identity-bearing uses. Rich same-hue tint and saturated
  same-hue structure support hover, focus, rails, and boundaries where the exact accent is not
  sufficiently visible. Ordinary content remains neutral and success, warning, and danger remain
  semantically independent.
- Consumer fixtures prove integration without limiting catalog breadth or prescribing application
  arrangements. Stable scope includes
  conventional controls, application structure, feedback, overlays, collections, an Obsidian-like
  Markdown-valued editing surface, and standard accessible charts.

## Completed work

### Ticket 01 — package, provider, and contracts

The packable library exposes only `.`, `./styles.css`, `./manifest.json`, and `./agent-index.md`.
AppearanceProvider owns typed light/dark appearance and accent propagation. One authored contract
source drives generated guidance and metadata, with stale or incomplete coverage rejected by
repository checks.

Owned distribution JavaScript is checked strictly for Node imports, unbound Node globals, and CSS
imports. Built consumer bundles are checked for Node module imports and Vite browser-external
shims. The verifier does not attempt to interpret capability fallbacks inside bundled third-party
code; successful clean Vite builds provide the consumer-bundle boundary.

### Ticket 02 — layout and surfaces

Stack, InlineGroup, ResponsiveGrid, Divider, Surface, Section, and ScrollRegion provide bounded
spacing, equal-item layout, semantic containment, and labeled keyboard-reachable overflow without
arbitrary class, style, token, or breakpoint injection. Adjacent items can be sized consistently.

ScrollRegion preserves native overflow behavior. Pointer and scroll activity reveal its thumb,
the thumb fades after 900ms idle, focus within keeps it visible, reduced motion removes the
transition, and forced colors restores continuous system rendering. The transient scrollbar color
is contained at the direct-child boundary so it does not leak into nested consumer scrollers.

### Ticket 03 — actions and composition

Button, IconButton, Link, ToggleButton, ButtonGroup, and Toolbar preserve command, navigation,
persistent selection, ordinary grouping, and orientation-aware toolbar semantics. Pending commands
retain focus and label geometry; icon-only commands require an accessible label; selected controls
use the accepted full-width rail without a persistent selected fill.

Behavior-owning composites validate the direct DOM relationship needed for layout and keyboard
behavior while allowing wrapper-free consumer React components. Toolbar and ButtonGroup use a
root-child observer only for that accepted dynamic composition boundary; arbitrary subtree
conformance is not their responsibility.

### Ticket 03A — accent fidelity

Accent derivation now follows the accepted exact-identity, rich-tint, neutral-content,
saturated-structure model. Roles are derived for the actual canvas, base, raised, or subtle
surface, including Toolbar and ScrollRegion. Exact deep purple, black, white, and representative
middle colors retain their identity while focus, hover, selection, and readable foregrounds remain
distinct.

### Showcase and repository quality

The runnable showcase inventories every canonical public component, identifies each specimen,
supports light/dark and wide/compact evaluation, and applies a live arbitrary six-digit accent.
`AGENTS.md` requires the showcase to change whenever a public component changes. Prettier, ESLint,
and Stylelint run before type, test, generated-artifact, and compatibility checks.

### Ticket 04 — fields and text entry

Field, FieldGroup, FormSection, TextField, TextArea, NumberField, and SearchField own distinct,
narrow entry contracts. Reserved support tracks and shared control dimensions prevent validation
feedback from moving adjacent controls. NumberField owns standard decimal formatting, bounds,
stepping, commit, intermediate input, and external-form reset without exposing React Aria.

Field is a bounded extension seam for one direct custom form control. It validates the generated
relationships and states it owns at React commit time, rejects direct hidden/inert controls and
native role overrides, keeps native select entries readable in either appearance, and leaves
role-specific widget behavior to the consumer. The earlier per-Field subtree observer and broad
native host-role compatibility matrix were removed as quality-degrading overengineering.

### Ticket 05 — choice controls

Checkbox, CheckboxGroup, RadioGroup, Switch, and SegmentedControl now own independent binary, related
multiple, visible exclusive, immediate setting, and compact bounded-exclusive choice semantics.
Controlled and uncontrolled state, labels and support relationships, native form serialization
and reset, validation, read-only, disabled, indeterminate, and required behavior remain distinct
through narrow public types and canonical guidance.

SegmentedControl uses native radio behavior under one equal-width track. Its selected label stays
neutral while one group-owned accent bottom rail glides in logical direction above transient
adjacent hover surfaces. Reduced motion settles the rail immediately, and forced colors retain the
group, focus, and selected relationships.

### Ticket 06 — select and combobox

Select and ComboBox now share a private stable-key collection composition while preserving narrow
public contracts for bounded selection and editable autocomplete. Select owns a non-editable
single-value trigger with typeahead. ComboBox owns locale-aware contains or starts-with filtering,
plus a manual mode for consumer-driven dynamic and asynchronous option lists.

Selection and input ownership are independently controlled or uncontrolled without contradictory
prop combinations. Localized loading and empty states, validation, required, disabled, ComboBox
read-only behavior, native form serialization and reset, keyboard/pointer/touch interaction,
viewport-aware overlays, RTL direction, SSR, hydration, and public declaration encapsulation are
covered through runtime, package, browser, and type checks.

### Ticket 07 — slider and range controls

Slider and RangeSlider own explicit finite stepped domains, localized number formatting,
horizontal or vertical orientation, controlled or uncontrolled state, native form association and
reset, and separately named non-crossing range thumbs. Read-only controls retain focus without
changing, disabled controls are inert, and shared descriptions and validation remain available to
each native range input.

One calibrated rail treatment presents formatted endpoints and compact current output. Range
thumbs use stable caliper offsets so close and equal values remain separately operable. Accent,
invalid, forced-color, reduced-motion, compact, RTL, SSR, hydration, and public-package behavior
are covered without exposing React Aria or consumer style injection.

### Ticket 08 — date and time controls

DateField, TimeField, DatePicker, and DateRangePicker expose library-owned ISO civil dates,
zone-free wall-clock times, and inclusive continuous date ranges without leaking private date
types. Locale, bounded display calendar, hour cycle, granularity, bounds, unavailable dates,
controlled and uncontrolled ownership, validation, native form serialization and reset, and
optional picker open state remain explicit. Required plain ISO placeholder values deterministically
anchor empty picker calendars without selecting or submitting those dates.

Localized segmented entry and calendar selection share one value model. Picker overlays own focus,
dismissal, navigation, viewport containment, and endpoint meaning. One raised almanac sheet and a
subdued Route band with accent endpoint bookends cover light, dark, compact, RTL, forced-color,
reduced-motion, SSR, hydration, and packed React 18 and 19 behavior.

### Ticket 09 — file trigger and drop zone

FileTrigger and DropZone expose one immutable accepted/rejected result model across native picker,
drag/drop, and focused paste acquisition without owning upload, persistence, or selected-file
state. MIME types, wildcards, filename extensions, multiplicity, and per-file byte limits produce
explicit rejection reasons while browser File references remain consumer-owned.

Named picker actions, accessible drop affordances, localized live announcements, external
invalidity, pending state, disabled behavior, non-serializing form reset, compact reflow, accent,
semantic success and danger, forced colors, reduced motion, SSR, hydration, and React 18/19 package
consumption are covered. The same callback boundary composes with later Markdown asset insertion
without specializing the file controls to Markdown.

### Ticket 10 — status, progress, and alerts

StatusIndicator, Badge, InlineAlert, AlertBanner, ProgressBar, Meter, and Spinner preserve concise
state, static metadata, local explanation, broad explanation, operation completion, bounded
measurement, and generic activity as separate public concepts. Semantic status, alert, and meter
tones cannot accept application accent; accent remains available for identity metadata and
progress structure without replacing green success, yellow warning or in-progress, or red danger.

Static and announced feedback use the same visible copy without hidden duplicate labels.
Determinate progress publishes finite bounds, current value, units, and completion meaning;
indeterminate progress publishes no fabricated value. Both progress modes require an explicit
activity state so paused work remains still. Meters connect ordered unit-bearing threshold
descriptions, while Spinner reserves one stable visual slot and updates a mounted, non-busy live
region only while active. Broad alerts retain the same rounded containment grammar as local alerts.
Light, dark, compact, forced-color, reduced-motion, SSR, hydration, public package, and generated
contract behavior are covered.

### Ticket 11 — loading, empty, and notification feedback

Skeleton, EmptyState, and NotificationProvider keep loading geometry, absent-content explanation,
and transient announcements as separate public concepts. Skeleton uses bounded heading, text,
control, and media geometry while staying hidden from assistive technology. EmptyState distinguishes
no data, no results, and unavailable content with at most one direct recovery action.

Notifications own semantic tone and urgency, four logical viewport placements, bounded timeout or
persistence, hover/focus pause, Escape and button dismissal, newest-first queuing, and one-to-three
visible items. Arrival does not move focus, and contracts direct durable recovery or inspection to
persistent content. Compact reflow, light and dark appearance, forced colors, reduced motion, SSR,
hydration, React 18/19 package consumption, public types, and live-region structure are covered.

### Ticket 12 — dialog and drawer overlays

Dialog, AlertDialog, and Drawer preserve ordinary bounded work, consequential confirmation, and
supplemental edge-attached work as separate public concepts. Controlled and uncontrolled state,
required visible titles and descriptions, explicit close or confirmation labels, action
composition, and logical drawer placement remain library-owned without exposing React Aria parts.

Focus enters, remains contained, restores through nested and sequential overlay stacks, and returns
on Escape, backdrop, close-control, action, and programmatic paths according to each contract.
AlertDialog keeps cancellation first, blocks backdrop dismissal, and separates confirm from
destructive semantics. Drawer retains modal behavior while moving its threshold rail with logical
start/end placement and becoming full-screen at compact widths. Triggers render exactly one library
Button or IconButton, locally scoped RTL survives portal rendering, and long AlertDialog copy
scrolls without clipping its fixed decisions. Light, dark, RTL, compact, touch, forced-color,
reduced-motion, SSR, hydration, public-package, and typed behavior are covered.

### Ticket 14 — navigation and disclosure

Tabs, Breadcrumbs, Pagination, Disclosure, Accordion, and CollapsibleNavigationPane preserve panel
selection, hierarchical location, numbered result movement, optional expansion, coordinated
expansion, and persistent application destinations as separate public concepts. Controlled and
uncontrolled state stays explicit, while native links preserve consumer routing.

Breadcrumbs keeps root and current locations visible and moves collapsed ancestors into an anchored
ellipsis overlay without displacing page content. Pagination uses the same full-width selection rail
as ToggleButton. Disclosure and Accordion keep collapsed rows compact without losing find-in-page
behavior. CollapsibleNavigationPane owns grouped destination links, current location, and its
collapse control without owning the application router or requiring a particular page position.

### Ticket 17 — application structure

Applications own their overall layout. PageHeader keeps breadcrumbs, an optional page identifier,
optional consumer-named status content, title, description, and page actions distinct while Route
uses only the flexible space between identifier and status. It prescribes neither a particular
status label nor a pill.

SplitView owns two named peer panes, bounded controlled or uncontrolled percentage sizing, logical
keyboard and pointer resizing, collapse of either pane, focus recovery, and container-owned compact
stacking. Distinct pane controls identify the target without relying on a directional chevron.

### Ticket 18 — process tracker and operational proof

ProcessTracker reports one ordered staged-process relationship without owning workflow, navigation,
actions, or surrounding layout. It keeps complete, active, pending, warning, and failed markers
distinct by shape and localized status text. The active marker combines a fixed filled center with
the accepted outward pulse, while a restrained accent rail preserves the relationship between
evenly spaced stages.

The packed operational fixture composes existing public fields, choices, validation, Dialog,
actions, PageHeader, ProcessTracker, status, and progress. The fixture owns its arrangement and
cross-component state, so no application workflow component enters the public catalog.

### Ticket 19 — Cartesian chart foundation

LineChart, AreaChart, ColumnChart, BarChart, and CartesianChart provide the shared Cartesian
foundation without defining a dashboard or analysis workflow. Typed accessors, bounded scale and
annotation vocabularies, deterministic React-owned SVG, explicit responsive policy, shared feedback
states, and generated native data tables keep the family reusable and accessible. D3 micro-packages
remain private geometry dependencies, and an executable tree-shaking proof keeps their code out of
ordinary component bundles.

## Frontier

See the [decision map](map.md). [Ticket 20](tickets/20-statistical-chart-family.md) is next.

## Accepted sources

- Whitney's stated project intent and four design goals in the conversation.
- [Architecture decision: Target React and TypeScript](../../docs/adr/0001-target-react-and-typescript.md)
- [Architecture decision: Own Styles and Bound Theming](../../docs/adr/0002-own-styles-and-bound-theming.md)
- [Architecture decision: Build on React Aria Privately](../../docs/adr/0003-build-on-react-aria-privately.md)
- [Architecture decision: Publish Canonical Component Contracts](../../docs/adr/0004-publish-canonical-component-contracts.md)
- [Architecture decision: Build a Breadth-Aware Vertical Slice](../../docs/adr/0005-build-a-breadth-aware-vertical-slice.md)
- [Architecture decision: Ship a Modern ESM Package](../../docs/adr/0006-ship-a-modern-esm-package.md)
- [Architecture decision: Own a Markdown Editing Surface](../../docs/adr/0007-own-a-markdown-editing-surface.md)
- [Architecture decision: Own an Accessible Chart Family](../../docs/adr/0008-own-an-accessible-chart-family.md)
- [Architecture decision: Stabilize After Broad Prerelease Validation](../../docs/adr/0009-stabilize-after-broad-prerelease-validation.md)
- [Architecture decision: Preserve Consumer Composition Boundaries](../../docs/adr/0010-preserve-consumer-composition-boundaries.md)
- [Architecture decision: Own Reusable Concepts, Not Applications](../../docs/adr/0012-own-reusable-concepts-not-applications.md)
- [Reusable Composite Boundary](decisions/16-reusable-composite-boundary.md)
- [Component Library Context](../../CONTEXT.md)
- [Research: Accessible React Behavior Foundations](research/behavior-foundations.md)

## Out of scope

- Designing one application as the library's primary outcome.
- General consumer customization of the internal visual-token system in the first release.
- Re-exporting React Aria or adopting its complete prop types as the public API.
- Repository-owned evaluation of agent output or a prescribed consumer evaluation workflow.

## Current verification

- Ticket 18 passes `npm run check` with 25 test files and 417 tests, generated guidance, and public
  declarations under TypeScript 5.9, 6, and 7. `npm run showcase:build`,
  `npm run verify:package`, and `git diff --check` pass. Packed React 18.3.1 and 19.2.8 consumers
  execute invalid configuration, corrected validation, Dialog review, execution, and coherent
  monitoring transitions using public exports only, then pass SSR, hydration, types, semantic
  assertions, and browser builds.
- Direct Chromium inspection covers ProcessTracker in light, dark, compact, reduced-motion,
  forced-color, and long-label RTL conditions. Two pulse frames retain the filled active center as
  the outer ring expands and fades. The interrupted example has equal 52-pixel marker spacing, the
  rail uses the prototype's 33% accent blend, compact and RTL layouts have no overflow, and the two
  named ordered lists add no focus targets. Inspected screenshots were discarded.
- Chromium, Firefox, and WebKit accessibility snapshots expose ProcessTracker as one named list
  with three noninteractive stages. A live Chromium transition under accent `#d14f00` moves the
  active marker while preserving the 122.55-pixel tracker height and following content position.
  Before and after screenshots confirm the filled exact-accent center, rail, and
  stable geometry; screenshots and the temporary harness were discarded.
- Independent correction review passes both intent and engineering axes with no objective defect,
  unresolved judgment, or missing evidence inside the correction boundary.
- Ticket 17 correction passes `npm run check` with 24 test files and 411 tests, generated guidance,
  and public declarations under TypeScript 5.9, 6, and 7. `npm run showcase:build`,
  `npm run verify:package`, and `git diff --check` pass. Packed React 18.3.1 and 19.2.8 consumers pass
  SSR, hydration, types, and browser builds.
- Chromium, Firefox, and WebKit direct showcase operation confirms the revised PageHeader Route,
  arbitrary status content, RTL direction, collapse of either SplitView pane, and the settled quiet
  secondary hover highlight with a white icon and no hover outline. Chromium light, dark, compact,
  forced-color, reduced-motion, narrow reflow, and CollapsibleNavigationPane checks pass.
- Renewed Chromium, Firefox, and WebKit correction checks confirm offset-preserving pointer resize,
  separator focus recovery after controlled collapse and compact reflow, pressed-button parity, and
  overflow-free PageHeader and stacked SplitView reflow at 200 percent device scale. A second renewed
  focus check confirms that focus which has already left the separator stays outside SplitView
  through a later controlled collapse in all three engines.
- Independent intent and engineering correction reviews pass with no blocking findings. The final
  bounded review confirms the stale separator-focus correction resolves the admitted focus-stealing
  defect without affecting active focus recovery.

- Ticket 16 `npm run check` passes formatting, zero-warning ESLint and Stylelint, strict source
  types, 23 test files with 393 tests, generated guidance, package build, and public declarations
  under TypeScript 5.9, 6, and 7. `npm run showcase:build`, `npm run verify:package`, and
  `git diff --check` pass. Packed React 18.3.1 and 19.2.8 consumers pass SSR, hydration,
  declarations, advanced-collection semantic assertions, and browser builds.
- Ticket 16 direct browser evidence covers sorting, selection versus embedded actions, recursive
  expansion, query filtering and clearing, compact responsive overflow, 200 percent zoom, RTL,
  forced colors, and reduced motion. Chromium directly confirms a painted table-row hover boundary,
  logical RTL edges, forced-color edges, and application-owned sorting by Run, Status, and Profile.
  Chromium, Firefox, and WebKit expose the expected search, grid, and treegrid structures without
  document overflow or page errors. Inspected Table, Tree, CollectionFilterBar, ListBox,
  selectable-card, Disclosure, and Accordion states confirm the accepted compact spacing and
  accent-outline hover language; temporary screenshots were discarded.
- Independent intent and engineering correction reviews pass with no blocking findings, unresolved
  judgments, nonblocking follow-ups, or missing evidence. They confirm the cell-painted table-row
  boundary and the three sortable data columns satisfy the corrected Ticket 16 behavior without
  changing row layout, selection, RTL edges, forced-color visibility, or action-column semantics.

- Ticket 15 `npm run check` passes formatting, zero-warning ESLint and Stylelint, strict source
  types, 22 test files with 375 tests, generated guidance, package build, and public declarations
  under TypeScript 5.9, 6, and 7. `npm run verify:package` passes SSR, hydration, declarations,
  semantic assertions, and browser builds for packed React 18.3.1 and 19.2.8 consumers.
  `npm run showcase:build`, `npm audit --audit-level=high`, and `git diff --check` pass.
- Ticket 15 focused public behavior and type coverage passes for native lists, description pairs,
  keyed list-box insertion, removal, reordering, focus and selection, invalid stable ids, shared
  collection feedback, static-card action boundaries, selectable-card discriminants, and spatial
  grid keyboard navigation. Direct Chromium operation covers wide and compact card layout,
  left-to-right and initial right-to-left spatial keys, French-context typeahead, touch selection,
  light appearance, arbitrary accent propagation, forced colors, reduced motion, and zero document
  overflow. Firefox and WebKit cover card-grid layout and spatial navigation, typeahead, keyboard
  selection, and zero document overflow. The wide, compact, and forced-color card specimens passed
  rendered inspection; temporary screenshots were discarded.
- The bounded correction reviewers accepted the spatial-grid correction and found one remaining
  structural-typing path for predeclared static-card arrays. A focused public type regression first
  failed because the invalid array compiled, then passed after static items declared
  `isDisabled?: never`. The final `npm run check` passes all 375 tests, formatting, lint, generated
  guidance, strict types, and TypeScript 5.9, 6, and 7 declarations. Packed React 18.3.1 and 19.2.8
  consumers again pass SSR, hydration, declarations, semantic assertions, and browser builds.
- Independent intent and engineering correction reviews pass with no blocking findings, judgment
  calls, or missing evidence. They confirm the spatial-grid correction and the static-card
  structural type exclusion close both admitted delivery blockers.

- Ticket 14 `npm run check` passes formatting, zero-warning ESLint and Stylelint, strict source
  types, 364 focused and regression tests, generated guidance, and public declarations under
  TypeScript 5.9, 6, and 7. `npm run showcase:build`, `npm run verify:package`,
  `npm audit --audit-level=high`, and `git diff --check` pass. Packed React 18.3.1 and React 19.2.8
  consumers pass SSR, hydration, types, and browser builds. Focused hydration coverage renders all
  six Ticket 14 components together.
- Ticket 14 direct Chromium evidence covers Tabs manual activation and panel relationships,
  collapsed Breadcrumb destination reachability through an anchored ellipsis overlay with no layout
  shift, and the same filled, underline-free hover treatment for route links and the overflow
  control. The showcase removes descendants after following an ancestor and exposes the next route
  from each ancestor page so the hierarchy can be traversed in both directions. It also covers
  Pagination's full-width selection rail, Disclosure and Accordion expansion and disabled states,
  and the collapsible navigation pane's current destination and collapse behavior. A touch-enabled
  compact viewport directly exercises all six components. The browser accessibility tree exposes
  the expected named tablist, navigation landmarks, links, and collapse control. Wide and compact
  RTL layouts have no component or document overflow; reduced motion, forced colors, light, and dark
  appearances render correctly. Collapsed Disclosure rows retain the intended 44-pixel minimum
  independent of consumer box sizing while preserving find-in-page behavior. Inspected screenshots
  were discarded after validation.
- Ticket 13 direct Chromium interaction covers Popover focus entry and restoration, Menu typeahead
  and action dismissal, ContextMenu keyboard activation, rejection of ambiguous triggers,
  warning-free positioning at distinct pointer invocation points, focus restoration after
  right-click and trusted touch long-press, and accessibility structures.
  Chromium, Firefox, and WebKit rendered inspection covers
  viewport-constrained Popover, Menu, and ContextMenu attachment. The compact `14 × 7` pointer
  joins the non-tooltip accent rail at its centerline, stays outside rounded corners, and masks the
  underlying border across whole and fractional device-pixel positions; Tooltip retains its neutral
  edge. Chromium additionally covers nested Menu placement, light and dark appearance, locally
  scoped RTL behavior, reduced motion, and forced colors. Whitney accepted the corrected pointer
  after direct visual review. A later navigation-family review removed the leading rail from Menu
  and ContextMenu entries; direct Chromium inspection confirms whole-row highlights, normal content
  inset, and no rail element or browser errors.
- Ticket 13 `npm run check` passes formatting, zero-warning ESLint and Stylelint, strict source
  types, 345 focused and regression tests, generated guidance, and public declarations under
  TypeScript 5.9, 6, and 7. `npm run showcase:build`, `npm run verify:package`,
  `npm audit --audit-level=high`, `git diff --check`, and the explicit source/test/tooling no-`Any`
  scan pass; packed React 18.3.1 and React 19.2.8 consumers pass SSR, hydration, types, and browser
  builds.

- `npm run check` passes formatting, zero-warning ESLint and Stylelint, strict source types, 345
  focused and regression tests, generated guidance, exact contract coverage, and public examples
  under TypeScript 5.9, 6, and 7.
- `npm run verify:package` passes in packed React 18.3.1 and React 19.2.8 consumers, including SSR,
  hydration, bounded public choice and selection types, external native form association, explicit
  styles,
  encapsulated subpaths, and Vite browser builds.
- `npm run showcase:build`, `npm audit --audit-level=high`, `git diff --check`, and the source/test/
  tooling no-`Any` scan pass.
- Chromium, Firefox, and WebKit evidence covers the completed layout, ScrollRegion, action, accent,
  field, and choice supported paths in light/dark, wide/compact, RTL where applicable, reduced-motion
  and forced-color modes, keyboard, pointer, wheel, touch, form reset, and accessibility-tree states.
- Chromium, Firefox, and WebKit evidence covers Select and ComboBox keyboard selection, editable
  filtering, touch selection, compact reflow, Arabic RTL, viewport containment, and
  accessibility-tree states. Chromium additionally covers light/wide, forced-color, and
  reduced-motion rendering. Inspected fixtures and screenshots were discarded after validation.
- Chromium, Firefox, and WebKit evidence covers Slider and RangeSlider keyboard and pointer
  adjustment, non-crossing equal bounds, read-only behavior, localized RTL direction, and
  accessibility-tree states. Chromium additionally covers touch, compact forced-color, and
  reduced-motion rendering. Inspected screenshots were discarded after validation.
- Chromium, Firefox, and WebKit evidence covers non-Gregorian date segment editing, touch calendar
  selection, unavailable dates, continuous range semantics, keyboard opening, dismissal and focus
  restoration, compact containment, and RTL flow. Chromium additionally covers forced-color and
  reduced-motion rendering. Chromium direct inspection also confirms an empty picker is anchored by
  its explicit placeholder date without selecting it. Wide and compact inspected screenshots were
  discarded after validation.
- Chromium direct evidence covers keyboard, pointer, and touch file picker activation, native file
  drag enter/drop, plain-text drag rejection, normalized drag constraints, drop source after an
  unrelated picker paste, stable drop-affordance naming and descriptions, accepted and rejected
  results, compact and wide layout, dark and light appearance, forced colors, reduced motion, live
  announcements, and accessibility-tree state.
  Firefox and WebKit cover keyboard picker activation, rejection, focused file paste, compact light
  layout, live announcements, and accessibility-tree state. All inspected browser flows completed
  without overflow, console errors, or page errors; screenshots were discarded after validation.
- Chromium direct evidence covers StatusIndicator, Badge, InlineAlert, AlertBanner, ProgressBar,
  Meter, and Spinner in light and dark appearance, wide and compact layout, forced colors, reduced
  motion, arbitrary accent change, semantic contrast, stable geometry, progress and meter value
  relationships, threshold descriptions, active/inactive busy exposure, and the accessibility
  tree. The inspected page had no overflow, console errors, or page errors; screenshots were
  discarded after validation.
- Chromium, Firefox, and WebKit direct evidence covers visible Skeleton geometry, all three
  EmptyState meanings, focus-preserving NotificationProvider arrival, keyboard and button dismissal
  semantics, logical RTL placement under a mismatched browser locale, live-region structure, and
  compact containment without overflow or console/page errors. Chromium additionally confirms
  focus-paused timing and covers light and dark appearance, reduced motion, and forced colors.
  Focused public-seam tests cover programmatic dismissal and post-removal callbacks. Inspected
  screenshots were discarded after validation.
- Chromium, Firefox, and WebKit direct evidence covers Dialog, AlertDialog, and Drawer focus entry,
  containment, nested and sequential restoration, explicit dismissal paths, alert backdrop
  protection, scroll locking, locally scoped logical RTL placement through the portal, compact
  full-screen geometry, dark and light appearance, keyboard interaction, inert background content,
  and labeled/described dialog structure without overflow or console/page errors. Focused tests
  cover runtime rejection of initially or dynamically invalid and ambiguous triggers, wrapper-free
  consumer components, and direct Toolbar and ButtonGroup composition. Chromium additionally covers
  bounded scrolling for long localized AlertDialog copy without clipping its decisions, touch
  activation, reduced motion, and forced colors. Inspected screenshots were discarded after
  validation.
- Ticket 19 focused and full-suite checks cover every Cartesian scale and named mark family,
  generated tables and annotation summaries, shared feedback states, explicit sizing, runtime
  validation, deterministic server output, and hydration. The production showcase build succeeds.
  Packed React 18.3.1 and 19.2.8 consumers render, hydrate, type-check, and browser-build a LineChart;
  the ordinary-component isolation build emits no chart or D3 modules. Independent engineering and
  intent re-reviews report no unresolved objective defects.
- Direct chart inspection across Chromium, Firefox, and WebKit, including forced-color rendering and
  manual screen-reader operation, remains deferred to Ticket 30 before stable-candidate acceptance.

## Continuation

- Branch: `master`
- Ticket 19 is delivered in the latest commit, `[Feature] Add Cartesian chart foundation`.
- The working tree is clean after delivery.
- Resume with `python3 /home/trwhitney/.codex/skills/work-system/scripts/navigate.py resume novel-work implementation`.
- Next action: begin [Ticket 20](tickets/20-statistical-chart-family.md).
