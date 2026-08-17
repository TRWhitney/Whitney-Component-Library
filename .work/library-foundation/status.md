# Component Library Foundation

## Destination

Establish and implement the first coherent release of a reusable component, style, and behavior
library whose APIs and guidance constrain agent-authored applications toward consistent,
appropriate results while preserving deliberate extension through higher-level constructs and a
propagated application accent.

## Current state

Novel-work delivery: Tickets 01 through 04, the requested showcase, and the ScrollRegion refinement
are complete. Ticket 04's finite closeout retained material supported-path corrections and removed
the quality-degrading per-Field subtree observer and broad native-role compatibility matrix.
Manual screen-reader operation remains deferred to the Ticket 30 pre-`1.0` release gate. Ticket 05
is ready, and no work on it has started.

## Progress

The project goals, React + TypeScript consumption model, bounded style and theme contract, private
React Aria behavior foundation, canonical agent-facing contract, Focus + Rail + Momentum + Route
visual direction, and breadth-aware vertical-slice release strategy are accepted. The first slice
supports configure, validate, review, execute, and monitor workflows while broader component
families constrain the foundation before its public APIs freeze. The capability territory,
representative hard cases, initial pre-release export capabilities, and modern ESM distribution
and compatibility contract are now settled. Stable release requires a wider conventional catalog,
several completed slices, an Obsidian-like Markdown editor, and a chart family including radar
charts. The Markdown editor is settled as a library-owned editing surface over a canonical
Markdown string rather than a vault or notes ecosystem. The chart family is settled across common
Cartesian, radial, statistical, heatmap, and compact charts with accessible alternatives.
Operational workflow, data analysis, Markdown authoring, and application workbench are the four
required prerelease integration slices.
Wayfinding is complete with fourteen resolved decisions, zero visible decisions, and no remaining
in-scope fog. The library remains pre-adoption through the four `0.x` slices and stabilizes only
after the broad catalog and accepted quality gates receive explicit review.

An accepted [canonical specification](spec.md) and 33 dependency-ordered [implementation
tickets](tickets/) cover the package and contract spine, conventional catalog, operational
workflow, chart system, data analysis, Markdown editor and authoring, workbench, forward-expansion
probes, and stable-candidate evidence. [Ticket 01](tickets/01-package-provider-and-contract-spine.md)
now enforces one-to-one contract coverage, compiles its canonical examples across the TypeScript
matrix, scans browser output against the full Node built-in set and Node globals, verifies accent
text/focus contrast in both appearances, and imports the public stylesheet in clean Vite browser
builds. Final gate corrections scan all declaration files, recognize static Node imports and
Node-specific globals in owned output, reject retained/externalized Node modules in Vite bundles,
and align the tooling contract with Node `>=22.12.0`. [Ticket
02](tickets/02-layout-and-surface-primitives.md) now provides Stack, InlineGroup, ResponsiveGrid,
Divider, Surface, Section, and ScrollRegion through narrow typed APIs and canonical contracts.
The primitives own bounded spacing, responsive equal-item layout, rounded neutral containment,
semantic sections and dividers, and labeled keyboard-reachable overflow without exposing arbitrary
class, style, token, or breakpoint injection.
Delivery review corrections place forced-color overrides in the effective component layer, make
section actions respond to container space, reject ineffective equal-item alignment combinations,
support the complete HTML heading hierarchy, and put every canonical layout example inside its
required AppearanceProvider. Final intent-review corrections make each primitive's appearance
guidance describe only the roles it actually paints and make the canonical Surface example use
library-owned Stack rhythm. Final release-review corrections make generated snippets import every
related component they use, describe ScrollRegion's subtle surface accurately, and make Stack own
direct-child block rhythm instead of inheriting browser margins. Surface guidance now distinguishes
unnamed visual containment from the nested Section that supplies a visible semantic name.
Ticket 02's final independent delivery review axes passed with no findings.

[Ticket 03](tickets/03-action-family.md) now provides Button, IconButton, Link, ToggleButton,
ButtonGroup, and Toolbar through narrow semantic APIs. Commands remain native buttons with explicit
form behavior; navigation remains a native destination; pressed state represents persistent binary
selection; ordinary groups preserve each tab stop; and toolbars own orientation-aware arrow
navigation. Icon-only commands require one accessible label and reuse it in a provider-scoped
tooltip. Stable pending labels retain focus and announce localized progress while a warning rail
communicates motion without replacing the application accent. The visual treatment preserves
rail-only selection, consistent adjacent dimensions, wrapping without compact clipping,
non-moving hover and press feedback, and forced-color and reduced-motion meaning. Canonical action
contracts direct agents among every alternative without exposing the private React Aria foundation.
Ticket 03 delivery review found that inherited RTL navigation, pending and disabled state
ownership, pending announcement structure, arbitrary-accent state visibility, forced-color
selection, and variant-use guidance were not yet fully enforced. Focused regressions are green
after correcting those boundaries. Complete repository, package, and direct-browser validation
passed before repeat independent review found that JSX erases the concrete child identities claimed
by the composite TypeScript types. The accepted correction preserves ordinary JSX and consumer
components that render valid direct action DOM children, while behavior-owning composites validate
the resulting DOM relationship at runtime. Review also found untested white-accent primary emphasis
and saturated-accent hover contrast defects; those corrections now have current evidence. A later
engineering review found that Toolbar navigation used the global DOM realm. A focused iframe
regression now passes with event targets resolved from the Toolbar's owning window, and its affected
completion gates passed on repetition.

[Ticket 03A](tickets/03a-accent-fidelity-and-support-roles.md) corrects an over-constrained accent
strategy exposed by direct showcase evaluation. Exact primary fills preserve the consumer's chosen
color, including deep purple in dark appearance, while readable foregrounds, derived support hues,
and conditional boundaries retain the accessibility and state distinctions required by the
library. The provider exposes the conditional edge as a private CSS role consumed by filled actions
and the showcase swatch; no public prop or package export changes. Canonical contracts and generated
provider and Button guidance describe literal and derived roles separately. This refines the
existing bounded-theme decision without exposing arbitrary tokens or making accent a semantic
status color. Prior completion evidence that required every primary fill itself to contrast against
every owned surface is superseded for this correction.

The repository now includes a runnable human-facing showcase for every contracted public component.
It uses the library's accepted visual language, provides working light and dark examples at wide
and compact widths, and derives its catalog from an explicit specimen inventory. A focused test
compares rendered specimens with the canonical component contracts so catalog drift fails the
repository checks. The local `AGENTS.md` requires the showcase to change with public components.
Showcase specimen stages no longer carry an unexplained calibration tick. Selected ToggleButtons
now use a dedicated full-width bottom rail that meets the control's rounded perimeter without
curving upward; hover and pressed feedback remain separate from the selection rail. A native color
selector now propagates an arbitrary six-digit accent through the live showcase and displays its
exact value. Action examples identify each rendered variant, state, or composite child makeup
directly above the relevant control.

Repository-wide quality gates now run before the existing type, test, generated-artifact, and
compatibility checks. Prettier owns formatting for authored files, ESLint applies type-informed
TypeScript and React Hooks rules alongside JavaScript checks, and Stylelint applies the standard
CSS rule set. Generated component documentation, npm's lockfile, build output, coverage output,
and installed dependencies remain owned by their respective generators rather than Prettier.

[Ticket 04](tickets/04-field-and-text-entry-family.md) currently provides Field, FieldGroup, FormSection,
TextField, TextArea, NumberField, and SearchField through distinct narrow APIs and canonical
contracts. Shared visible labels and reserved support tracks keep descriptions, validation,
pending feedback, and adjacent control geometry stable. NumberField owns explicit locale,
formatting, bounds, stepping, committed numeric values, private intermediate text, and external
form reset without exposing React Aria. Native text, multiline, search, fieldset, and section
semantics remain distinct. All seven components are represented in the maintained showcase. Ticket
04 remains active until its review corrections pass focused, repository, package, direct-browser,
and repeat independent review gates. Ticket 05 remains blocked behind it.

## Frontier

See the [decision map](map.md).

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

- Designing a single application as the library's primary outcome.

## Verification

- `npm run check`: repository formatting, zero-warning code and style linting, strict source types,
  111 focused and regression tests, generated documentation, exact contract coverage, and public
  examples under TypeScript 5.9.3, 6.0.3, and 7.0.2.
- `npm run verify:package`: the actual artifact installed, server-rendered, and hydrated without
  warnings in clean React 18.3.1 and 19.2.8 consumers; both consumers also completed Vite browser
  builds that imported the public stylesheet and emitted its theme rules.
- `npm audit --audit-level=high`: zero known vulnerabilities in the installed dependency graph.
- Browser output passed the full Node built-in/global exclusion scan; public subpaths,
  encapsulation, and private React Aria declarations passed.
- Accent fill, contrast, accent text, focus, and rail roles passed their thresholds across seven
  representative accents, every owned surface, and the accent-soft hover surface in both
  appearances. Forced-color and reduced-motion rules are covered. Packed declarations compile
  against React 18 and React 19 types. `git diff --check` passed and no `Any` usage was found in
  source, tests, or tooling.
- Chromium, Firefox, and WebKit keyboard inspection reached the final inline content of horizontal
  and two-axis ScrollRegions; the two-axis case also reached its final block content and retained a
  visible focus ring without clipping or overflow leakage.
- Chromium, Firefox, and WebKit inspection of the canonical Surface example in both appearances
  confirmed zero semantic-child block margins and an exact 8px regular Stack gap at compact width.
- Chromium, Firefox, and WebKit RTL inspection confirmed logical peer/grid ordering, logical
  Section heading/action placement, and horizontal keyboard scrolling to final inline content.
  The declaration matrix also accepts a runtime boolean for InlineGroup equal sizing while
  rejecting ineffective alignment combinations.
- Direct Chromium, Firefox, and WebKit action-family inspection passed in light wide, dark compact,
  reduced-motion, and forced-color presentations. It exercised pending transitions, stable labels,
  warning-matching accents, surface-matching selection accents, provider-scoped tooltip focus,
  vertical navigation, and inherited DOM RTL navigation under an English browser locale. Structure
  and screenshots confirmed readable forced-color labels, visible pending and selected rails,
  stable adjacent dimensions, wrapping without clipping, and no overflow. Temporary validation
  artifacts were removed.
- Fresh Chromium, Firefox, and WebKit inspection confirms that white-on-light and black-on-dark
  accents retain distinct primary emphasis, saturated-red selected hover remains readable with its
  rail visible, and consumer components can contribute wrapper-free action bundles without changing
  direct DOM geometry, arrow navigation, equal sizing, compact wrapping, or overflow behavior.
- Fresh Chromium, Firefox, and WebKit operation confirms privately registered consumer actions
  retain direct geometry and arrow navigation, a consumer bundle that later introduces a wrapper
  reaches the application error boundary, and forged public styling markers are rejected. The
  resulting valid and rejected screens were inspected for wrapping, clipping, overflow, and style
  leakage, then the temporary fixture was moved to Trash.
- Installed-package verification passes with `MutationObserver` resolved from the composite's
  owning DOM window in both React 18.3.1 and React 19.2.8 consumers.
- Direct Chromium, Firefox, and WebKit operation of a Toolbar rendered into an RTL iframe confirms
  that `ArrowLeft` moves focus from Undo to Redo in the owning document. Structural inspection
  confirms two direct button children, equal heights, inherited RTL direction, and no overflow;
  screenshots show a visible focus indicator without clipping in every engine. Temporary validation
  artifacts were moved to Trash.
- Final independent intent and engineering review axes passed with no findings.
- `npm run check` passes formatting, zero-warning code and style linting, strict types, generated
  artifacts, the TypeScript 5.9/6/7 matrix, and 113 tests including separate rendered-specimen and
  navigation-catalog coverage for all 14 contracted public components. `npm run showcase:build`
  produces a clean Vite artifact.
- Package verification still passes in clean React 18.3.1 and React 19.2.8 consumers, the dependency
  audit reports zero vulnerabilities, `git diff --check` passes, and the showcase introduces no
  `Any` usage.
- Direct Chromium, Firefox, and WebKit inspection covers dark wide and light compact layouts,
  appearance switching, catalog navigation, hover feedback, and the icon-button tooltip. Every
  engine renders all 14 specimens, reaches the Toolbar from the compact catalog, contains document
  overflow at 390px, and presents the inspected states without clipping or style leakage. Temporary
  screenshots, scripts, and build artifacts were moved to Trash.
- Final independent intent and engineering review axes passed with no findings after navigation
  catalog coverage was enforced separately from rendered-specimen coverage.
- `npm run check` passes formatting, zero-warning ESLint and Stylelint, strict types, generated
  artifacts, the TypeScript 5.9/6/7 matrix, and 114 tests after the showcase detail correction.
  `npm run showcase:build` and `npm run verify:package` pass, including clean React 18.3.1 and
  React 19.2.8 consumers. `npm audit --audit-level=high` reports zero vulnerabilities and
  `git diff --check` passes.
- Fresh Chromium, Firefox, and WebKit operation hovered the selected standalone ToggleButton and
  inspected its rendered rail. In every engine the rail remains a flat 3px bottom element spanning
  both inline edges and meeting the rounded perimeter without curving upward; hover feedback does
  not replace it. Dark action screenshots and light foundation screenshots show no clipping,
  overlap, style leakage, or unexplained specimen-stage ticks. Structural inspection confirms all
  14 specimen stages have no background image. Temporary inspection artifacts were moved to Trash.
- Fresh independent intent and engineering review axes examined the complete correction from HEAD
  `4b1eea4` through the working tree and reported no findings. Existing generated ToggleButton
  guidance already defines a rail-only selected state whose hover preserves the rail, so no
  consumer-facing documentation change is required; the showcase and this work record contain the
  complete documentation impact.
- `npm run check` passes formatting, zero-warning ESLint and Stylelint, strict types, generated
  artifacts, the TypeScript 5.9/6/7 matrix, and 118 tests after adding the showcase evaluation aids
  and review regressions.
  `npm run showcase:build`, `npm audit --audit-level=high`, and `git diff --check` pass. Packed-package
  verification was not repeated because no public package source or artifact changed.
- Fresh Chromium, Firefox, and WebKit operation focused the Accent input, changed it from `#2878ff`
  to `#d934c3`, and confirmed the exact input value, provider custom property, and rendered primary
  Button fill updated in every engine. Structural inspection found all 17 action example captions.
  Dark wide control screenshots and light compact action screenshots show a visible input focus
  ring, legible exact hex value, direct variant/component labels, orderly wrapping, and no clipping
  or style leakage. Every 390px presentation retained zero document overflow. Temporary scripts,
  screenshots, and build artifacts were moved to Trash.
- Delivery review found that toggling the controlled `Pin result` example off left its caption as
  `Selected ToggleButton`, and that combining WebKit and Mozilla color-swatch pseudo-elements could
  invalidate their shared rule. The caption now derives from the live selected state, the vendor
  selectors are separate, and focused interaction and static-selector regressions pass. Earlier
  browser, repository, and review evidence is invalidated where these corrections could affect it.
- Repeated Chromium, Firefox, and WebKit operation changes the accent to `#d934c3`, then toggles
  `Pin result` off. Every engine reports the exact input and provider accent, the same derived
  primary fill, `aria-pressed="false"`, an `Unselected ToggleButton` caption, 17 total captions, and
  zero compact document overflow. Inspected dark wide control and light compact action screenshots
  show consistent rounded native swatches, visible focus, accurate live state labeling, orderly
  wrapping, and no clipping or style leakage. Temporary validation artifacts were moved to Trash.
- Fresh repeat independent intent and engineering reviews examined the corrected complete change
  from HEAD `26d9ff2` through the working tree and reported no findings. The showcase is the owning
  human documentation surface, and no public component API or generated consumer guidance changed;
  this status record completes the durable documentation impact.
- Ticket 03A established focused red evidence at the provider, stylesheet, showcase, and canonical
  contract seams: the prior implementation recolored exact fills, exposed no conditional boundary,
  and described no literal-versus-derived distinction. The focused green run passes 64 tests plus
  strict type checking and zero-warning linting. Chromium implementation inspection confirms
  `#2b0a64` remains the primary fill in dark appearance and `#ffffff` remains the primary fill in
  light appearance, each with a readable foreground and a conditional contrasting edge. The same
  screenshots show related derived links and rails without clipping or layout regressions. Generated
  component guidance is current.
- `npm run check` passes formatting, zero-warning ESLint and Stylelint, strict types, generated
  artifacts, the TypeScript 5.9/6/7 matrix, and 122 tests for the complete Ticket 03A change.
  `npm run showcase:build`, `npm run verify:package`, `npm audit --audit-level=high`, and
  `git diff --check` pass. Packed React 18.3.1 and React 19.2.8 consumers pass SSR, hydration,
  public-type, and browser-build verification, and the audit reports zero vulnerabilities.
- Direct Chromium, Firefox, and WebKit operation changed the accent to deep purple `#2b0a64` in
  dark appearance and white `#ffffff` in light appearance. Every engine reports the exact provider
  and primary-fill roles and renders the literal primary fill with independently readable content
  and a conditional contrasting boundary; default blue retains a transparent boundary. Derived
  links, selected rails, and keyboard focus remain visible, danger styling does not change with the
  accent, and 390px presentations have zero document overflow. Inspected wide and compact
  screenshots show clean rounded treatments, orderly wrapping, and no clipping or style leakage.
  Temporary validation scripts, screenshots, and build artifacts were moved to Trash.
- Independent intent review reported no findings. Independent engineering review found that the
  muted role could collapse into an owned surface for extreme accents, erasing a Link's resting
  underline and weakening muted boundaries. A focused provider-matrix regression failed for all 16
  appearance/accent combinations before the muted role began deriving to 3:1 against its owned
  surfaces and soft state; the affected 32 tests, strict types, and linters now pass. Prior complete
  validation and both review conclusions are invalidated where this correction could affect them.
- Renewed `npm run check` passes formatting, zero-warning ESLint and Stylelint, strict types,
  generated artifacts, the TypeScript 5.9/6/7 matrix, and 122 tests. Renewed showcase build,
  packed-package verification for React 18.3.1 and 19.2.8, dependency audit, and diff checks pass.
  Direct Chromium, Firefox, and WebKit repetition confirms literal deep-purple and white fills,
  conditional boundaries, readable foregrounds, related derived links and rails, visible keyboard
  focus, accent-independent danger treatment, and zero 390px overflow. The specific resting
  destination-link underline now visibly and structurally uses the corrected muted role in every
  inspected engine and extreme appearance. All renewed screenshots were inspected and temporary
  artifacts moved to Trash.
- Repeat engineering review reported no findings. Repeat intent review found that IconButton, Link,
  and ToggleButton guidance still said their support treatments “use the application accent,” which
  could direct agents toward literal rather than derived hues. A focused canonical-contract test
  failed before all three descriptions explicitly named role-specific derived hues, then 48 affected
  tests, generated guidance, strict types, and linters passed. Browser evidence remains current
  because this correction changes only canonical and generated guidance; repository, generation,
  and package evidence was invalidated until repeated below.
- After the action-guidance correction, `npm run check` again passes formatting, zero-warning
  linters, strict types, 122 tests, generated-artifact checks, and the TypeScript 5.9/6/7 matrix.
  The showcase build, packed React 18.3.1 and 19.2.8 consumer verification, dependency audit, and
  diff check also pass. Generated IconButton, Link, and ToggleButton guides contain the corrected
  role-specific derived-hue language. Existing three-engine rendering evidence remains current
  because no rendered behavior or CSS changed in this correction.
- Final fresh independent intent and engineering review axes examined the complete corrected Ticket
  03A change from HEAD `874d534` through the working tree and reported no findings. Documentation
  impact is resolved in the existing ADR, style/theme decision, canonical specification and
  contracts, generated component guides, ticket, and this status record.
- Whitney's post-delivery evaluation of `#2d0548` invalidates the visual conclusions above. Current
  derivation mixes support roles toward neutral theme text to satisfy contrast against every owned
  surface, yielding rail `#847096`, muted `#787685`, text `#9f90ae`, and a near-white fill boundary
  `#f2f6f8`. The numeric checks proved visibility but not preservation of hue, accent-bearing hover
  feedback, or a boundary treatment consistent with the accepted visual language. Repository and
  package checks remain historical evidence only; visual completion must be redesigned and
  revalidated.
- The non-production accent-family prototype's first hue-preserving revision was rejected because
  constant chroma at higher lightness produced pastel lavender structure and text. The revised
  comparison keeps text neutral, uses exact accent for identity and a rich hover tint, and assigns
  only visibility-bearing structure a high-chroma same-hue signal. Direct Chromium inspection
  covers deep purple in both appearances, selected hover, forced hover, focus, primary hover, link,
  swatch, white-on-light, black-on-dark, and a 390px compact presentation with zero overflow. For
  `#2d0548` dark, the candidate now uses hover tint `#2b0b43` and saturated boundary, rail, focus,
  and edge `#aa2aff`. Whitney accepted this second revision as the binding production direction:
  exact identity, rich same-hue tint, neutral content, and saturated same-hue structure.
- Focused provider, stylesheet, contract, and showcase regressions failed against the prior
  neutral-directed implementation, then 65 tests passed after the provider adopted role-local OKLCH
  derivation and actions adopted neutral resting text, rich hover tint, and saturated structural
  roles. Strict types, zero-warning linters, formatting, generation, and diff checks pass.
- Direct Chromium inspection of the production showcase matches the accepted deep-purple reference:
  `#2d0548` exact fill, `#2b0b43` hover tint, `#aa2afe` structural signal, and neutral resting text.
  Selected hover retains its full-width rail, the primary hover and keyboard focus use saturated
  purple edges, light appearance keeps the exact dark-purple rail, and the 390px layout has zero
  document overflow. Initial three-engine structural inspection reported the same derived roles and
  zero compact overflow; the validation evidence below supersedes this pre-correction inspection.
- Renewed validation passes the complete 123-test repository check, generated-artifact and
  TypeScript 5.9/6/7 matrices, packed React 18.3.1 and React 19.2.8 SSR/hydration/type/browser
  consumers, showcase production build, zero-vulnerability dependency audit, and diff check. Direct
  Chromium, Firefox, and WebKit operation and screenshot inspection cover deep-purple selected
  hover, primary hover, keyboard focus, link hover, light compact reflow, and exact role values;
  Chromium also covers white-on-light and black-on-dark. All rendered states match the accepted
  contract, semantic danger and pending treatments remain independent, and compact overflow is zero.
- Documentation impact is resolved in the canonical style and theme ADR, foundation specification,
  style/theme decision, provider and action contracts, generated component guidance, accepted
  prototype record, Ticket 03A, and this status index. All relative Markdown links resolve. Ticket
  03A had reached delivery and Ticket 04 was ready for a future request.
- Independent intent review then found three objective defects: primary fills with a transparent
  resting boundary can lack any hover delta; one base-surface derivation cannot honor the accepted
  actual-surface rule across canvas, base, raised, and subtle placements; and the visual-direction
  decision still called the selected label accent-colored. Ticket 03A returned to implementation,
  and all affected validation and review evidence was invalidated.
- The correction now derives support independently for canvas, base, raised, and subtle surfaces;
  each library Surface activates its matching role set, and showcase-owned base and subtle regions
  do the same. Primary fills use a separately derived hover edge even when their resting boundary is
  transparent, and the selected-label guidance is neutral. The focused regressions pass, including
  contrast checks against the serialized six-digit colors consumers actually receive; the complete
  127-test repository check, strict types, linters, formatting, generated artifacts, and TypeScript
  5.9/6/7 declaration matrix are green. Direct validation and fresh review remain outstanding.
- Current package and direct validation now pass. React 18.3.1 and 19.2.8 packed consumers pass SSR,
  hydration, types, and browser builds; the production showcase build and dependency audit pass.
  Chromium, Firefox, and WebKit render the corrected deep-purple hover, selection, focus, link, and
  compact states consistently, surface variants activate their own derived roles, and every compact
  document has zero horizontal overflow. Chromium also confirms white-on-light and black-on-dark.
  All screenshots were inspected and discarded with the temporary harness.
- Fresh independent delivery review invalidated the affected evidence. Intent and engineering both
  found that Toolbar's owned subtle background does not activate the subtle-surface roles for its
  direct action children. Engineering also found that selected ToggleButton press feedback uses the
  accent-soft background without its readable foreground, which can erase the label for light
  accents. These are objective implementation defects; Ticket 03A must return to implementation,
  then repeat affected validation and both review axes.
- Focused regressions failed for both accepted findings, then passed after Toolbar selected every
  subtle-surface role and selected press feedback adopted the accent-soft readable foreground. The
  affected 53 tests and complete 127-test repository check pass with strict types, zero-warning
  linters, formatting, generated artifacts, the TypeScript 5.9/6/7 declaration matrix, and a clean
  diff. Renewed direct and package validation remain outstanding.
- Renewed direct Chromium, Firefox, and WebKit operation confirms all Toolbar active roles equal its
  derived subtle-surface roles for `#5f6b72`; keyboard focus is visible on a direct Toolbar child;
  and a selected ToggleButton held pressed under white-on-dark renders its light soft background
  with black readable content. All screenshots were inspected and discarded with the harness.
  The production showcase build, packed React 18/19 consumers, and zero-vulnerability audit pass.
- Repeat intent review reports no findings. Repeat engineering review invalidated the affected
  evidence again: ScrollRegion also owns a subtle background and accepts composed descendants but
  does not activate subtle-surface roles. A complete stylesheet inventory confirms it is the only
  remaining library-owned compositional surface missing explicit role selection. Ticket 03A must
  return to implementation for a focused regression and correction, then repeat affected validation
  and both review axes.
- A focused ScrollRegion scoping regression failed against the reviewed code, then passed after the
  region activated all six subtle-surface roles. The complete stylesheet inventory now accounts for
  every production owner of an application surface. The affected 35 tests and complete 127-test
  repository check pass with strict types, zero-warning linters, formatting, generated artifacts,
  TypeScript 5.9/6/7 declarations, and a clean diff. Direct and package validation must be renewed.
- Renewed direct Chromium, Firefox, and WebKit operation confirms ScrollRegion's active boundary,
  focus, and rail match its subtle-surface roles for `#5f6b72`; keyboard focus is visibly saturated
  without clipping or style leakage. All screenshots were inspected and discarded. The production
  showcase build, packed React 18/19 consumers, and zero-vulnerability audit pass after correction.
- Final fresh independent intent and engineering review axes examined the complete corrected change
  from HEAD `d8725d6` through the working tree and report no findings. Documentation impact is
  resolved in the style/theme ADR and decision, foundation specification, visual-direction decision,
  provider and action contracts, generated component guidance, future segmented-control constraint,
  accepted prototype record, Ticket 03A, and this status index. All relative Markdown links resolve.
- `npm run check` passes formatting, zero-warning ESLint and Stylelint, strict types, 130 tests,
  generated-artifact checks, and the TypeScript 5.9/6/7 declaration matrix after the ScrollRegion
  idle treatment. `npm run showcase:build`, `npm run verify:package`, `npm audit --audit-level=low`,
  and `git diff --check` pass; packed React 18.3.1 and React 19.2.8 consumers pass SSR, hydration,
  public types, and browser builds.
- Direct Chromium, Firefox, and WebKit operation exercised an overflowing ScrollRegion with pointer,
  wheel, idle, focus, Home, and Page Down input. Every engine retained native `overflow-y: auto`,
  moved its native scroll position, changed the thumb from opaque through an interpolated
  near-transparent color to transparent after the 900ms idle interval, and kept it opaque while
  focus remained within. Reduced-motion contexts report no transition; Chromium forced colors
  returns scrollbar rendering to the system. Dark wide, light wide, and light compact screenshots
  were inspected for hierarchy, clipping, overflow, and style leakage, then discarded with the
  temporary harness.
- Initial independent intent and engineering review both found that the human showcase's
  ScrollRegion description had not been updated with the component behavior. The specimen now
  explains activity reveal, idle fade, and focus persistence. Renewed `npm run check` passes all
  130 tests and quality gates; a fresh Chromium wide and 390px compact inspection confirms the
  explanation is present, wraps cleanly, retains zero document overflow, and accompanies the live
  active thumb state without clipping or style leakage. Temporary artifacts were discarded.
- Repeat intent and engineering review found the status handoff stale after the delivery transition.
  Engineering also found that inherited `scrollbar-color` could carry the ScrollRegion's transient
  thumb treatment into a consumer's nested scroller. The latter is an objective implementation
  defect; affected evidence and both repeat review conclusions are invalidated pending correction.
- A focused stylesheet regression failed before a zero-specificity direct-child boundary reset the
  inherited scrollbar color, then passed with the complete 130-test repository gate. Fresh Chromium,
  Firefox, and WebKit inspection makes the parent thumb active while an unstyled nested consumer
  scroller remains `auto` and an explicitly red/blue consumer scrollbar remains unchanged. Inspected
  screenshots show the nested composition without clipping or style leakage. Renewed showcase,
  packed React 18/19 consumer, audit, and diff checks pass; temporary artifacts were discarded.
- Final fresh independent intent and engineering reviews examined the complete corrected boundary
  from HEAD `2f6622b` through the working tree and report no findings. Canonical contract guidance,
  generated human guidance, the live showcase explanation, Ticket 02 evidence, and this status index
  resolve the documentation impact.
- ScrollRegion scrollbar activity is implemented without replacing native scrolling or overflow
  detection. Pointer entry, pointer movement, and actual scroll activity reveal the native thumb and
  reset a 900ms idle signal; focus within the region preserves keyboard discoverability. The thumb
  then fades through the library motion role, reduced motion removes that transition, and forced
  colors keeps the system scrollbar continuously visible. Focused component, stylesheet, and
  contract regressions failed first and now pass. The complete 130-test repository check, strict
  types, linters, generated guidance, TypeScript 5.9/6/7 declaration matrix, showcase build, package
  verification, dependency audit, and direct three-engine rendering checks pass.
- Ticket 04's initial repository, package, and direct-browser evidence passed before independent
  review found behavior outside that evidence. The affected completion evidence and both review
  axes are invalidated pending the focused corrections and renewed validation.
- Ticket 04's corrected `npm run check` passes 148 tests, strict types, zero-warning linters,
  formatting, generated guidance, and the TypeScript 5.9/6/7 matrix. The showcase build, packed
  React 18.3.1 and React 19.2.8 consumers, high-severity dependency audit, diff hygiene, and
  no-`Any` scan pass.
- Direct Chromium, Firefox, and WebKit correction checks pass for wheel stepping, bounded TextArea
  rows, custom and grouped disabled state, read-only ARIA state, disabled search clearing, compact
  reflow, and overflow. Chromium's accessibility tree includes the described disabled group and the
  NumberField and invalid TextField with complete state and relationships. This satisfies Ticket
  04's accepted automated accessibility boundary; manual screen-reader exercises are consolidated
  in Ticket 30 before stable-candidate acceptance.
- Ticket 04's final `npm run check` passes all 154 tests, zero-warning linters, strict types,
  generated guidance, and the TypeScript 5.9/6/7 declaration matrix. Showcase and packed React
  18.3.1/19.2.8 consumer builds, SSR, hydration, package styles, high-severity audit, diff hygiene,
  and the no-`Any` scan pass.
- Fresh Chromium, Firefox, and WebKit operation covers dark/light, wide/compact, RTL, keyboard,
  pointer, wheel, touch, external form reset, disabled traversal, invalid custom-control rejection,
  and browser accessibility-tree relationships. Forced-color invalid fields use readable system
  text with a dashed control boundary and underlined message; screenshots in all three engines were
  inspected and discarded.
- Post-review validation confirms the guarded custom `Field` seam rejects missing generated props,
  non-control roles, and hidden inputs in Chromium, Firefox, and WebKit. A complete role-based
  control remains named, described, invalid, required, and disabled; end-phase pointer, mouse,
  touch, Enter, and Space activation stays suppressed, Escape bubbles, and Tab advances. The
  refreshed 154-test repository gate, generated guidance, package consumers, and audit pass.
- Ticket 04's reopened corrections have current completion evidence. `npm run check` passes
  formatting, zero-warning ESLint and Stylelint, strict source types, all 156 tests, generated
  guidance, and the TypeScript 5.9/6/7 declaration matrix. `npm run showcase:build`, packed React
  18.3.1 and React 19.2.8 SSR/hydration/type/style/browser verification, the high-severity
  dependency audit, diff hygiene, and the no-`Any` scan pass.
- Direct Chromium, Firefox, and WebKit operation of the maintained showcase confirms its actual
  wrapping FieldGroup specimen has equal two-line label tracks, identical 44px peer controls, and
  no overflow in dark wide presentation. Light compact presentation collapses to one column with
  an 8px inter-field gap and no overflow. Every screenshot was inspected for alignment, hierarchy,
  wrapping, clipping, awkward gaps, and style leakage, then removed.
- Direct three-engine operation of a disposable validation fixture removed disabled, invalid,
  read-only, and required attributes from a custom textbox without an error or stale relationship.
  Read-only button and select controls and a required slider each reached the expected application
  error boundary. Browser accessibility snapshots exposed the surviving named textbox and three
  actionable alerts; inspected screenshots and the disposable fixture were removed.
- Final independent delivery review then found five objective defects and failed both axes. Four
  focused public-seam checks and one surface-role style check failed against the reviewed
  implementation, then all 44 focused field/style checks and the affected 162-test repository gate
  passed after correction. The prior package and browser evidence is invalidated where the guard or
  inner-action accent roles changed.
- The first combined browser fixture revealed that a retained-props regression cached every
  generated relationship and was invalid before the intended state transition. That test boundary
  is replaced with a control that spreads every current relationship while retaining only disabled
  state. It remains valid initially and reaches the error boundary only after Field's disabled
  expectation changes; the focused regression passes.
- Renewed final validation passes `npm run check` with formatting, zero-warning ESLint and
  Stylelint, strict source types, 162 tests, generated guidance, and TypeScript 5.9/6/7. The
  showcase build, packed React 18.3.1 and React 19.2.8 SSR/hydration/type/style/browser consumers,
  high-severity audit, diff hygiene, and no-`Any` scan pass.
- Final finite closeout passes `npm run check` with 164 tests, zero-warning linters, strict types,
  generated guidance, and TypeScript 5.9/6/7 declarations. The showcase build, packed React
  18.3.1/19.2.8 SSR/hydration/type/style/browser consumers, audit, diff hygiene, and no-`Any` scan
  also pass.
- Direct Chromium, Firefox, and WebKit operation confirms a valid custom textbox, uniform rejection
  of a native role override and direct hidden/inert controls, rejection when a child retains stale
  disabled props, exact `1e-21` decimal presentation, aligned responsive peers, and compact reflow
  without overflow. Every screenshot was inspected and all disposable artifacts were removed.
- Targeted closeout review found no remaining supported-path defect. It removed the per-Field
  subtree observer and broad native host-role compatibility table as quality-degrading
  overengineering while preserving commit-time validation of documented structure, relationships,
  states, and semantics. Out-of-band subtree mutations and arbitrary native-role conformance
  analysis remain outside the supported contract.
- In the same three engines, standalone NumberField increment hover and SearchField clear focus use
  the exact provider roles derived for the subtle control surface under a saturated purple accent.
  Inspected screenshots show rich hover fill, visible focus structure, stable geometry, no clipping,
  and no style leakage; all disposable fixtures and screenshots were removed.

## Continuation

Ticket 04 is complete. Resume Ticket 05 from novel-work planning in a new request; do not begin it
as part of the Ticket 04 closeout.

Current branch: `master`.

Prototype browser inspection passed for appearance, viewport, accent, error, disabled, dialog,
review, progress, segmented adjacency, the normalized field-to-Profile gap, the gliding rail,
one-shot surge, continuous running pulse, reduced motion, offset wrapper glow, opaque nested panel,
divider-free compact reflow, overflow containment, and semantic status contrast. Route is checked
as a real responsive track with distinct shadow-free endpoints in wide and compact layouts; its
semantic endpoint changes with status without becoming a duplicate status indicator. Exact command
is recorded in the prototype test source.

Current planning contains 33 tickets: five complete, Ticket 05 ready, and 27 blocked tickets. All
local Markdown links resolve.
