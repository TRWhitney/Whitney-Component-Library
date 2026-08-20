# 07 Slider and Range Controls

**What to build:** Single-value slider and range-slider exports with typed numeric domains,
formatting, keyboard behavior, and stable adjacent-thumb interaction.

**Blocked by:** [Field and Text Entry Family](04-field-and-text-entry-family.md)

**Status:** complete

- [x] Min, max, step, orientation, formatted value, and controlled or uncontrolled state are
      explicit and valid.
- [x] Range values cannot cross or become structurally invalid according to the chosen contract.
- [x] Keyboard, pointer, and touch changes produce the same bounded value semantics.
- [x] Labels, descriptions, current values, and validation are available to assistive technology.
- [x] Multiple thumbs remain distinguishable and operable at small separations.
- [x] Read-only, disabled, invalid, and directionality behavior passes.
- [x] Accent, semantic state, forced-color, reduced-motion, SSR, hydration, and public-type checks
      pass.

## Accepted sources

- [Specification](../spec.md)
- [Foundation Expansion Constraints](../decisions/07-foundation-expansion-constraints.md)
- [Style and Theme Contract](../decisions/02-style-and-theme-contract.md)

## Completion evidence

- `npm run check` passes formatting, zero-warning ESLint and Stylelint, source types, 206 tests,
  generated guidance, and the TypeScript 5.9, 6, and 7 public declaration matrix.
- `npm run verify:package` passes packed React 18.3.1 and React 19.2.8 consumers, including range
  SSR, hydration, types, form serialization, reset, explicit styles, and Vite browser builds.
- `npm run showcase:build`, `npm audit --audit-level=high`, the task-owned no-`Any` scan, and
  `git diff --check` pass.
- Chromium, Firefox, and WebKit direct operation covers bounded keyboard and pointer adjustment,
  non-crossing equal bounds, exact equal-value formatting, read-only focus and immutability, and
  distinct adjacent thumbs. Chromium touch reaches the same stepped values.
- Inspected wide, compact, light, dark, vertical, RTL, invalid, forced-color, and reduced-motion
  renderings retain calibrated rails, formatted endpoints, visible focus, stable support geometry,
  and unclipped thumb operation. Accessibility snapshots expose labeled groups, distinct thumb
  names, formatted values, descriptions, and invalid state. Temporary screenshots were discarded.
