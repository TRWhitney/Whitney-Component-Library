# 02 Prevent pointer focus from starting a January reading

**Status:** complete

## Accepted outcome

Clicking a chart must not start or restore a keyboard reading at January. Pointer input clears
any previous keyboard reading; keyboard entry and arrow navigation still work, and touch readings
retain their intended persistence. This corrects the production chart reused by the approved
[activation and selection prototype](../prototypes/activation-selection.md).

Source: [existing reading specification](../../chart-interactivity/spec.md).

## Completion evidence

- Two public tests in `tests/chart-pointer-focus.test.tsx` failed before the fix and now pass.
  They cover mouse-induced focus, switching from keyboard to mouse, and later keyboard reentry.
  Existing keyboard tests explicitly send Tab before synthetic focus.
- Native Chromium operation confirmed that clicking March and moving outside leaves no tooltip
  or January keyboard ring. Switching from a keyboard reading to pointer input clears the old
  reading. Touch readings retain their intended persistence.
- Canonical Cartesian keyboard contracts, five generated guides, and the rendered showcase
  explain the distinction between pointer and keyboard readings.
- Integrated production validation passes: `npm run check` (591 tests in 35 files, formatting,
  linters, types, generated guides, TypeScript 5/6/7 examples, chart isolation),
  `npm run showcase:build`, and `npm run verify:package` (packed React 18/19 consumers).
- Independent production intent and engineering reviews pass with no remaining findings.

This fix is delivered separately from the LineChart activation and selection capability.
