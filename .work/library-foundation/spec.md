# Whitney Component Library Stable Foundation

## Problem Statement

Applications assembled by people and agents need a reusable React component, style, and behavior
system that reduces accidental variation, clearly advertises appropriate use, provides supported
higher-level compositions, and carries an application accent without turning every semantic state
into that accent. Existing primitive libraries solve accessible behavior but leave too much public
composition and styling discretion for this product's goals.

The library must eventually support a broad ordinary interface vocabulary plus specialized
Markdown editing and charting. Its first workflow slice is architectural evidence, not a stable or
adoptable release. The product becomes intended for use only after the broad catalog and four
materially different integration slices validate the same public system.

## Solution

### Product and release model

Build one React and TypeScript library in successive `0.x` milestones. The milestones culminate in
four integration slices: operational workflow, data analysis, Markdown authoring, and application
workbench. Components may be implemented before the slice that demonstrates them; slices validate
integration and do not limit catalog breadth.

Prereleases are explicitly non-adoptable and use a non-default package tag if externally
published. Stable `1.0` requires the complete catalog, all four slices, the accepted quality matrix,
and explicit review. Semantic compatibility begins at `1.0`.

### Public catalog

The stable catalog provides the following capabilities. Exact internal decomposition remains an
implementation concern; public contracts must preserve the distinctions below.

- **Foundation:** appearance and accent provider, typography and icon conventions, semantic
  tokens, focus treatment, and shared state conventions.
- **Actions:** button, icon button, link, toggle button, button group, and toolbar.
- **Form structure and entry:** field, field group, form section, text field, text area, number
  field, search field, checkbox and checkbox group, radio group, switch, select, combobox,
  segmented control, slider and range slider, date field, time field, date picker, date-range
  picker, file trigger, and drop zone.
- **Navigation and disclosure:** tabs, breadcrumbs, menu, pagination, disclosure, accordion, and
  side navigation.
- **Overlays:** dialog, alert dialog, popover, tooltip, drawer, and context menu.
- **Feedback and status:** status indicator, badge, inline alert, alert banner, progress bar, meter,
  spinner, skeleton, empty state, and toast or notification.
- **Data and collections:** list, description list, list box, card, table, tree, reusable search and
  filter controls, and consistent collection loading, empty, partial, and error treatments.
- **Layout and application structure:** stack, inline group, responsive grid, divider, surface or
  panel, section, split view, scroll region, application shell, and workspace or page header.
- **Specialized systems:** the accepted Markdown editing surface and standard chart family.
- **Higher-level constructs:** supported operational workflow, data-analysis workspace, Markdown
  authoring workspace, and application workbench compositions.

### Public API and component contracts

Every public export has a narrow library-owned TypeScript API. Upstream React Aria components,
complete upstream prop types, private editor types, and private chart-renderer types never become
part of the public surface. Components share conventions only when the semantics are genuinely the
same; there is no universal component-props interface.

Every public export also has one canonical structured component contract. A contract states:

- its purpose, appropriate uses, inappropriate uses, and preferred alternatives;
- import and composition rules, permitted parts or slots, and content requirements;
- supported states, controlled and uncontrolled behavior, events, validation, and form behavior;
- accessibility obligations, keyboard behavior, labeling, localization, and directionality;
- responsive, appearance, accent, forced-color, and reduced-motion behavior;
- focused examples and counterexamples;
- related primitives and preferred higher-level constructs.

Human documentation, `./manifest.json`, and `./agent-index.md` derive from these contracts.
Verification rejects incomplete contracts, invalid references, generation drift, uncompilable
examples, and public-type leakage. Agent-output evaluation is not part of the repository or a
prescribed consumer workflow.

### Style, theme, and visual behavior

The library ships static CSS and owns typography, spacing, shape, elevation, component structure,
interaction states, and semantic token relationships. The provider exposes only typed light or
dark appearance and application accent configuration in the stable contract; arbitrary consumer
token replacement is excluded.

The visual direction is Focus + Rail + Momentum + Route under **continuity without conflation**:
space, alignment, rails, fields, and motion reveal how distinct elements participate in one
process without erasing their separate roles.

Binding qualities include:

- approachable rounded containment with compact instrument-like density;
- consistent sizing and alignment for adjacent equivalent controls;
- accent for focus, selection, progress, active structure, and relationship rails;
- independent green success, yellow warning or in-progress, and red failure semantics;
- transient hover and press feedback without covering adjacent selection indicators;
- gliding rail-only segmented selection without persistent fill or elevation;
- localized wrapper-owned atmosphere behind an opaque emphasized composite panel;
- one-shot transition motion and continuous activity motion only while work remains active;
- complete, purposeful relationship structures without arbitrary stops or lines through content;
- coherent light, dark, compact, forced-color, and reduced-motion behavior;
- stable layout through validation and status changes.

Exact typefaces, accent hue, dimensions, spacing, shadow strength, glow parameters, and easing may
be refined while those relationships remain intact.

### Behavior and accessibility

React Aria Components and lower-level React Aria hooks provide the private interaction and
accessibility foundation. The library owns all public concepts, DOM and composition promises,
styles, state conventions, and behavior tests.

Applicable components support keyboard, pointer, touch, focus-visible, labeling, descriptions,
validation, required, disabled, read-only, pending, controlled, uncontrolled, form submission,
localization, right-to-left direction, server rendering, and hydration behavior. Overlay components
own focus containment or movement, restoration, dismissal, and responsive placement according to
their specific contracts. Collection components own selection and keyboard navigation semantics
rather than delegating them to consumers.

### Markdown editing surface

The editor's canonical value is Markdown text. It provides in-place Live Preview that reveals
relevant syntax around the cursor or selection, explicit source-editing mode, and read-only preview.
Built-in syntax includes headings, emphasis, links, images, lists, task lists, blockquotes, fenced
code, tables, horizontal rules, footnotes, and wiki links.

The editor owns undo and redo, formatting commands, Markdown typing shortcuts, selection
preservation, clipboard behavior, safe rendering, and shared field states. Raw HTML is disabled by
default. Consumers resolve and navigate wiki links through callbacks. Paste and drop asset handling
uses a consumer callback that returns a Markdown insertion; the library owns no upload or storage.

A bounded extension contract may add syntax, commands, decorations, and link resolution without
exposing the private editor framework. Vaults, persistence, backlink indexes, graph views,
comments, version history, collaborative transport, and an Obsidian-compatible plugin runtime are
outside the component.

### Chart family

Named chart components cover line, area, bar or column, scatter or bubble, histogram, box plot,
pie or donut, radar, heatmap, sparkline, and compatible mixed Cartesian charts. Appropriate bar and
area forms include horizontal, grouped, stacked, and normalized presentation.

The shared system owns typed record access, categorical, linear, logarithmic, time, and normalized
scales, axes, grids, legends, labels, units, titles, descriptions, reference lines and bands,
thresholds, annotations, responsive sizing, and consistent loading, empty, partial, and error
states. It supports pointer and keyboard tooltips, highlighting, legend toggling, point or category
selection, meaningful pan, zoom, or brush selection, and explicit shared state for coordinated
compatible charts.

Each chart supplies programmatic series, category, value, and unit meaning; keyboard access for
interactive marks; and a structured-summary or generated-table alternative. Patterns or marks
supplement color where needed. Purposeful data transitions honor reduced motion, and no chart has
idle decorative animation. An advanced composition API permits compatible mixed series, scales,
annotations, and coordinated views while keeping the renderer private.

Geographic maps, network graphs, Sankey diagrams, treemaps, candlesticks, 3D charts, and dashboard
layout are outside the initial chart family.

### Integration slices

1. **Operational workflow:** configure, validate, review, execute, and monitor with responsive
   configuration and status regions, stages, actions, Route, status, and progress.
2. **Data analysis workspace:** search, filter, sort, select, compare, chart, inspect detail, and
   handle loading, empty, partial, and error data states.
3. **Markdown authoring workspace:** compose and preview Markdown, navigate wiki links, insert
   dropped assets, invoke commands, and coordinate metadata.
4. **Application workbench:** navigate among tools, manage tabs and panels, invoke menus and
   commands, display notifications, and preserve responsive workspace structure.

Every slice consumes only the public package and may not substitute an external component for a
catalog role the library claims to support.

### Package and compatibility contract

Ship one tree-shakeable ESM-only npm package. Public subpaths are `.`, `./styles.css`,
`./manifest.json`, and `./agent-index.md`; every other package path is encapsulated. Applications
import CSS explicitly once. Specialized CSS may move to optional entries if including it globally
creates a material cost.

React and React DOM are peers at `^18.3.1 || ^19.0.0`. React Aria, the Markdown editor engine, and
the chart renderer remain private dependencies. Public declarations support TypeScript 5.9 and are
verified with TypeScript 5.9, 6, and 7. Repository tooling and Node-based SSR verification require
Node 22 or newer.

The browser target is fixed Baseline 2023. Browser code uses no Node APIs. Every component supports
server rendering and deterministic hydration, but interactive exports are Client Components rather
than directly executable React Server Components.

## User Stories

1. As an application developer, I want a broad coherent catalog so that ordinary application work
   does not immediately require components from a second design system.
2. As an agent authoring an application, I want narrow APIs and explicit appropriate-use guidance
   so that I choose supported components and compositions consistently.
3. As a tool developer, I want higher-level workflow and workspace constructs so that I do not
   recreate complex relationships from primitives for each application.
4. As an application designer, I want one accent and light or dark appearance to propagate through
   the library while semantic colors retain their independent meanings.
5. As a keyboard, touch, pointer, or assistive-technology user, I want complete and predictable
   interaction behavior across simple, compound, overlay, collection, editor, and chart controls.
6. As a Markdown author, I want an in-place preview editing surface over a plain Markdown value so
   that rich authoring does not require adopting a notes ecosystem.
7. As a data analyst, I want accessible standard charts and coordinated data views so that visual
   analysis remains usable across interaction modes and presentation needs.
8. As a maintainer, I want private foundations and deterministic generated guidance so that the
   catalog can expand without leaking dependency-specific APIs or allowing documentation drift.
9. As a consuming build, I want unused specialized systems excluded from browser bundles so that a
   button import does not carry editor or chart runtime cost.

## Implementation Decisions

- [Supported consumption model](decisions/01-consumption-model.md) and [ADR
  0001](../../docs/adr/0001-target-react-and-typescript.md)
- [Style and theme contract](decisions/02-style-and-theme-contract.md) and [ADR
  0002](../../docs/adr/0002-own-styles-and-bound-theming.md)
- [Behavior and accessibility foundation](decisions/03-behavior-foundation.md), [behavior
  research](research/behavior-foundations.md), and [ADR
  0003](../../docs/adr/0003-build-on-react-aria-privately.md)
- [Agent-facing contract](decisions/04-agent-contract.md) and [ADR
  0004](../../docs/adr/0004-publish-canonical-component-contracts.md)
- [Visual direction and permitted variation](decisions/05-visual-direction.md) and the accepted
  [interactive prototype](prototypes/visual-directions.html)
- [Initial public scope](decisions/06-initial-public-scope.md), [foundation expansion
  constraints](decisions/07-foundation-expansion-constraints.md), and [ADR
  0005](../../docs/adr/0005-build-a-breadth-aware-vertical-slice.md)
- [Initial prerelease export catalog](decisions/08-initial-export-catalog.md)
- [Distribution and compatibility contract](decisions/09-distribution-and-compatibility.md),
  [distribution research](research/distribution-compatibility.md), and [ADR
  0006](../../docs/adr/0006-ship-a-modern-esm-package.md)
- [Quality and release boundary](decisions/10-quality-and-release-boundary.md) and [ADR
  0009](../../docs/adr/0009-stabilize-after-broad-prerelease-validation.md)
- [Stable catalog model](decisions/11-stable-catalog-model.md)
- [Markdown editor scope](decisions/12-markdown-editor-scope.md) and [ADR
  0007](../../docs/adr/0007-own-a-markdown-editing-surface.md)
- [Charting scope](decisions/13-charting-scope.md) and [ADR
  0008](../../docs/adr/0008-own-an-accessible-chart-family.md)
- [Prerelease integration slice set](decisions/14-prerelease-slice-set.md)

## Testing Decisions

- Test behavior at the public component seam rather than through private foundation internals.
- Every ticket adds contract, type, behavior, accessibility, appearance, reduced-motion, and SSR
  checks proportional to its exports; final hardening does not substitute for component-level
  evidence.
- Run public examples and declaration fixtures under TypeScript 5.9, 6, and 7.
- Exercise React 18.3 and 19 server rendering and hydration without mismatch warnings.
- Exercise supported interactions in Chromium, Firefox, and WebKit against the Baseline 2023
  target, with focused screen-reader checks for complex widgets.
- Verify light, dark, accent changes, compact and wide reflow, forced colors, loading, empty,
  partial, error, disabled, read-only, pending, and reduced-motion states where applicable.
- Pack and install the actual npm artifact in clean client-rendered and SSR fixtures.
- Inspect production bundles to ensure ordinary imports exclude editor and chart JavaScript.
- Establish representative responsiveness budgets for large Markdown documents and chart data.
- Treat canonical-contract completeness, generated output drift, invalid references, public type
  leakage, and uncompilable examples as build failures.
- Do not add an agent-output evaluation suite.

## Out of Scope

- Framework-agnostic or non-web distribution in the stable foundation.
- General consumer replacement of the visual token system.
- Public React Aria, editor-engine, or chart-renderer APIs and prop types.
- CommonJS and require-only tooling.
- Direct React Server Component execution for interactive exports.
- Obsidian vaults, persistence, backlinks, graph views, comments, version history, collaborative
  transport, or plugin compatibility.
- Geographic maps, network graphs, Sankey diagrams, treemaps, candlesticks, 3D charts, dashboard
  layout, rich-text document formats, media players, or spatial canvas manipulation.
- Repository-owned or prescribed agent-output adherence evaluation.

## Further Notes

The package name, exact filenames inside the encapsulated distribution, precise visual constants,
and private editor and chart implementation choices remain reversible implementation details. The
package manifest and fixtures should obtain the package name from the repository rather than
duplicating a planning placeholder.
