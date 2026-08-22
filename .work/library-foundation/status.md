# Component Library Foundation

## Destination

Establish and implement the first coherent release of a reusable component, style, and behavior
library whose APIs and guidance constrain agent-authored applications toward consistent,
appropriate results while preserving deliberate extension through higher-level constructs and a
propagated application accent.

## Current state

Tickets 01 through 11, including the intervening Ticket 03A accent correction, are complete.
Ticket 12 is ready. The maintained human showcase covers every contracted public component. Manual
screen-reader operation is intentionally consolidated in the Ticket 30 pre-`1.0` release gate
rather than repeated for every component ticket.

The library remains pre-adoption. Four completed `0.x` integration slices, a broad conventional
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
- Vertical slices prove integration without limiting catalog breadth. Stable scope includes
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

## Frontier

See the [decision map](map.md). The next implementation unit is [Ticket 12 — Dialog and Drawer
Overlays](tickets/12-dialog-and-drawer-overlays.md).

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
- [Component Library Context](../../CONTEXT.md)
- [Research: Accessible React Behavior Foundations](research/behavior-foundations.md)

## Out of scope

- Designing one application as the library's primary outcome.
- General consumer customization of the internal visual-token system in the first release.
- Re-exporting React Aria or adopting its complete prop types as the public API.
- Repository-owned evaluation of agent output or a prescribed consumer evaluation workflow.

## Current verification

- `npm run check` passes formatting, zero-warning ESLint and Stylelint, strict source types, 302
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
- Manual screen-reader operation remains deferred to Ticket 30 before stable-candidate acceptance.

## Continuation

Resume Ticket 12 from novel-work implementation with
`python3 /home/trwhitney/.codex/skills/work-system/scripts/navigate.py resume novel-work implementation`
and begin the dialog and drawer overlay slice. Current branch: `master`. Ticket 11 is delivered by
the commit containing this record; no Ticket 12 implementation has started.
