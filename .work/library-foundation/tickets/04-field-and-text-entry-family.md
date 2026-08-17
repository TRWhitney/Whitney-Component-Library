# 04 Field and Text Entry Family

**What to build:** Field, field group, form section, text field, text area, number field, and search
field exports with stable validation layout and shared labeling conventions.

**Blocked by:** [Package, Provider, and Contract Spine](01-package-provider-and-contract-spine.md),
[Layout and Surface Primitives](02-layout-and-surface-primitives.md),
[Accent Fidelity and Support Roles](03a-accent-fidelity-and-support-roles.md)

**Status:** complete

- [x] Label, description, requirement, validation, and error relationships are accessible and
      deterministic.
- [x] Validation feedback never raises, resizes, or misaligns an adjacent equivalent control.
- [x] Text, multiline, numeric, and search semantics remain distinct in their public APIs and
      contracts.
- [x] Number entry owns formatting, stepping, locale, bounds, and invalid intermediate input.
- [x] Controlled, uncontrolled, read-only, disabled, required, invalid, pending, and form-reset
      behavior is covered.
- [x] Field groups and sections provide bounded composition without becoming generic styling
      containers.
- [x] Adjacent equivalent fields maintain consistent control dimensions in every state.
- [x] Keyboard, touch, browser accessibility-tree, directionality, theme, SSR, hydration, and type
      checks pass.

## Accepted sources

- [Specification](../spec.md)
- [Foundation Expansion Constraints](../decisions/07-foundation-expansion-constraints.md)
- [Visual Direction and Permitted Variation](../decisions/05-visual-direction.md)
- [Number Field Behavior](../research/number-field-behavior.md)
- [Field State Semantics](../research/field-state-semantics.md)

## Implementation direction

- `Field` is the bounded extension seam for a single custom form control. It owns visible label,
  requirement, description, error, and pending relationships, and supplies only the generated
  control accessibility props through a render callback.
- `TextField`, `TextArea`, `NumberField`, and `SearchField` own distinct value and interaction
  contracts rather than sharing one universal input prop surface. React Aria remains private.
- `FieldGroup` is a labeled native fieldset for related fields. `FormSection` is a named form
  region for workflow organization. Neither is a generic styling container.
- Every field reserves a support track below its control. Adjacent fields use shared control
  dimensions and group-level row alignment so validation changes do not move or resize peers.
- Number formatting and parsing use an explicit, server-stable locale with bounded stepping,
  commit, and range props; intermediate text remains owned by the internal number-field state.

## Supported and review boundary

- Review the seven documented exports, their canonical examples, the declared field states, and
  the direct custom-control relationship. Do not turn this ticket into exhaustive HTML or ARIA
  conformance checking for arbitrary host-element and role combinations.
- `Field` verifies one direct control, the generated relationships and states it owns, and the
  documented native or custom-control semantics. The consumer owns role-specific widget behavior.
  A direct control that declares itself removed from the accessibility tree through
  `input[type="hidden"]`, `hidden`, `aria-hidden="true"`, or `inert` is rejected; ancestor styling,
  and conditional visibility outside `Field` are outside this runtime guard's responsibility.
  Native controls with explicit role overrides are rejected uniformly rather than subjected to a
  general HTML/ARIA conformance matrix.
- NumberField review covers finite numbers in its documented standard decimal model, representative
  locale formatting, bounds, stepping, intermediate input, commit, and form behavior. It does not
  require an exhaustive IEEE-754, locale, or `Intl.NumberFormat` option cross-product. Specialized
  notation remains outside this ticket.
- Closeout consists of one focused field-family pass, one complete repository and package pass,
  representative direct checks in Chromium, Firefox, and WebKit, and targeted review of accepted
  corrections. Do not begin another fresh broad review unless a correction materially changes the
  public API, architecture, or this accepted boundary. A newly noticed concern outside this
  boundary is a later-ticket candidate rather than a Ticket 04 blocker unless it creates a credible
  security, data-loss, or accessibility failure on a supported path.

## Completion evidence

- `npm run check` passes formatting, zero-warning ESLint and Stylelint, strict source types, all 165
  tests, generated contracts and guidance, and public declarations under TypeScript 5.9, 6, and 7.
- `npm run showcase:build`, `npm run verify:package`, `npm audit --audit-level=high`,
  `git diff --check`, and the no-`Any` scan pass. Packed React 18.3.1 and React 19.2.8 consumers pass
  SSR, hydration, public types, stylesheet import, and browser builds.
- Focused coverage exercises controlled and uncontrolled values, validation, pending, required,
  read-only and disabled states, reset and external-form behavior, text-area sizing, NumberField
  formatting and stepping, SearchField submit and clear, custom Field relationships and rejection,
  group propagation and alignment, and responsive composition.
- Direct Chromium, Firefox, and WebKit operation confirms a valid custom textbox, uniform rejection
  of a native role override and direct hidden/inert controls, rejection when a child retains stale
  disabled props, exact `1e-21` decimal presentation, aligned responsive peers, and compact reflow
  without overflow. Every screenshot was inspected and all disposable artifacts were removed.
- Direct operation of the native select specimen in both appearances confirms that Standard and
  Priority use the active surface and text colors in Chromium, Firefox, and WebKit. Keyboard
  selection remains native, and inspected Chromium popups show both entries clearly.
- Automated browser accessibility-tree evidence continues to cover named and described regions,
  fieldsets, textboxes, searchbox, NumberField group and step commands, invalid state, and disabled
  custom controls. Manual screen-reader operation is consolidated in Ticket 30 before `1.0`.
- Targeted closeout review removed the only quality-degrading overengineering: a per-Field subtree
  `MutationObserver` and broad native host-role compatibility table. Commit-time validation of the
  documented React-rendered structure, relationships, states, and supported semantics remains; no
  further supported-path finding remains.
