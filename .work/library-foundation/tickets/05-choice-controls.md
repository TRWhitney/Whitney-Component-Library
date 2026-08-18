# 05 Choice Controls

**What to build:** Checkbox, checkbox group, radio group, switch, and segmented control exports with
typed single, multiple, binary, and bounded-exclusive choice semantics.

**Blocked by:** [Field and Text Entry Family](04-field-and-text-entry-family.md)

**Status:** complete

- [x] Each control advertises when its choice model is appropriate and names preferred alternatives.
- [x] Native form participation, labels, descriptions, validation, reset, and submitted values are
      deterministic.
- [x] Group keyboard behavior follows the relevant selection pattern without conflating focus and
      selection.
- [x] Segmented selection keeps its label neutral and uses a gliding accent bottom rail with no
      persistent selected fill or elevation.
- [x] Hover on an adjacent segment cannot cover the selected segment's rail.
- [x] Equivalent adjacent choices maintain consistent size and alignment.
- [x] Indeterminate checkbox, read-only where meaningful, disabled, invalid, and required states
      are covered.
- [x] Pointer, touch, keyboard, browser accessibility-tree, theme, reduced-motion, SSR, hydration,
      and type checks pass.

## Accepted sources

- [Specification](../spec.md)
- [Visual Direction and Permitted Variation](../decisions/05-visual-direction.md)
- [Interactive visual reference](../prototypes/visual-directions.html)

## Completion evidence

- `Checkbox`, `CheckboxGroup`, `RadioGroup`, `Switch`, and `SegmentedControl` expose narrow binary,
  option-derived multiple/exclusive, and bounded-exclusive APIs from the package root. Controlled
  exclusive choices admit an unselected `null` value, while reusable segment options reject
  silently ignored descriptions. React Aria remains private.
- `npm run check` passes formatting, zero-warning ESLint and Stylelint, strict source types, all 181
  tests, generated contracts and guidance, and public declarations under TypeScript 5.9, 6, and 7.
- `npm run showcase:build`, `npm run verify:package`, `npm audit --audit-level=high`,
  `git diff --check`, and the Ticket 05 no-`Any` scan pass. Packed React 18.3.1 and React 19.2.8
  consumers pass SSR, hydration, public types, explicit styles, encapsulated subpaths, and Vite
  browser builds while exercising every choice export, bounded type inference, controlled empty
  state, and external native form association.
- Focused coverage exercises visible labels, reserved support tracks, controlled callbacks and
  accepted state, indeterminate, read-only, disabled, invalid, and required behavior, internal and
  external native serialization, reset, RadioGroup and CheckboxGroup native required-validation
  blocking, radio arrow navigation, switch semantics, segmented rail state, and deterministic SSR
  hydration.
- Direct Chromium, Firefox, and WebKit operation confirms radio focus and selection move together
  through Arrow Down, touch toggles the switch, and touch selection moves the segmented value and
  rail. Chromium accessibility-tree inspection exposes the segmented control as one named
  radiogroup with three named radios and the selected state.
- Inspected dark/wide, light/compact/RTL, and forced-color/reduced-motion renderings retain
  alignment, wrapping, logical switch movement, subtle-surface accent roles, equal segment widths,
  neutral settled selected labels, a stable 36-pixel support track around a wrapping two-line
  error, and one unobscured three-pixel group-owned rail above adjacent hover. Disposable
  screenshots and showcase build output were removed from the repository; manual screen-reader
  operation remains deferred to Ticket 30.
