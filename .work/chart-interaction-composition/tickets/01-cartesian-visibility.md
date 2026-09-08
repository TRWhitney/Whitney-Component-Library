# 01 Cartesian series visibility

**What to build:** Separate eye controls, automatic visible-data scale fitting, and all-hidden
recovery in the five delivered Cartesian chart components.

**Blocked by:** none

**Status:** complete

- [x] Optional localized visibility copy enables understated eye controls without changing
      click-to-pin emphasis. Hidden entries remain in stable visual and keyboard order.
- [x] Hidden series are absent from plotted marks and readings; their stable colors and patterns
      survive restoration. Hiding clears their pin. Series replacement reconciles internal state.
- [x] Automatic scales fit visible data with interruptible animation. Explicit domains, zero
      baselines, positive logarithmic bounds, and normalized interpretation remain valid.
- [x] All-hidden charts retain legend, caption, full data, and localized Show all recovery with
      stable keyboard focus. Visibility never changes input validity.
- [x] Structured alternatives retain all valid series and identify hidden columns. Exact readings,
      touch persistence, overflow, and existing feedback behavior remain correct.
- [x] Production styling preserves the accepted eye, emphasis, motion, and layout in light, dark,
      compact, forced-color, and reduced-motion states.
- [x] Public types, canonical contracts, generated guidance, and all five component examples cover
      the additions. Relevant tests, repository checks, and package/browser verification pass.

## Accepted sources

- [Specification](../spec.md)
- [Accepted legend contract](../prototypes/legend-visibility.md#accepted-contract)
- [Parent ticket](../../library-foundation/tickets/22-chart-interaction-and-composition.md)

## Completion evidence

- Public-seam tests in `tests/chart-visibility.test.tsx` cover focus, pin clearing, stable series
  identity and patterns, full tables, all-hidden recovery, visible domains, normalized shares,
  explicit domains, logarithmic readings, invalid data, horizontal stacks, and mixed geometry.
- The first five visibility tests failed before implementation. Both animation tests failed before
  animation was added. The clipping regression failed before plot clipping was added. All thirteen
  tests now pass. Controlled frame tests cover interruption, finite geometry, reduced-motion
  changes, and cancellation on unmount.
- `npm run check` passed formatting, both linters, types, 571 tests in 33 files, generated-file
  verification, TypeScript 5/6/7 consumers, and private chart isolation. The complete command was rerun after the review corrections.
- `npm run showcase:build` and `npm run verify:package` passed. Packed React 18.3.1 and 19.2.8
  consumers passed SSR, hydration, types, and browser builds. Vite reports the existing large
  showcase bundle advisory.
- Direct Chromium inspection compared production with the accepted prototype at desktop and
  480px widths in light and dark appearances. Eye shape, spacing, name emphasis, all-hidden
  recovery, complete table semantics, and page overflow were inspected. No horizontal page
  overflow occurred at 480px.
- Chromium with native forced-colors and reduced-motion emulation retained legible controls and
  recovery. Show all restored two series and focused the first eye. Keyboard End read exact April
  values. A retained touch reading stayed on March when Demand was hidden and reported only
  Capacity, 68 MWh. Restoring Demand restored all eight columns, with no browser errors.
- Canonical component contracts, their five generated guides, public exports, and all five
  Cartesian showcase examples describe the optional visibility labels and delivered behavior.

## Review

Independent intent and engineering reviews admitted two blocking findings. Production initially
placed the eye before the name, contrary to the accepted prototype. Plot clipping also covered
annotation text and removed labels at domain boundaries. Both are corrected. The eye follows the
name in DOM and visual order; annotation layers retain their existing unclipped label placement.
Two new regression tests failed before correction and now pass. The complete repository, showcase,
and packed-consumer checks passed again. Direct Chromium inspection confirmed the corrected compact
legend and readable upper-bound reference and point labels. Independent intent and engineering correction reviews both pass with no findings.

The parent ticket remains open.
