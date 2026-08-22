# 01 Stable calendar surfaces and long-distance navigation

**What to build:** DatePicker and DateRangePicker calendars with stable six-week day grids and fixed-size hierarchical month/year/decade navigation; DateRangePicker additionally presents two consecutive panes with shared one-month paging and no popup scrollbars.

**Blocked by:** none

**Status:** complete

- [x] DatePicker reserves six week rows for every month without changing its public behavior.
- [x] DateRangePicker shows adjacent consecutive months, shares previous/next controls, and advances one month per action.
- [x] Both pickers promote through the accepted 12-item four-column hierarchy and drill back to the chosen day view without resizing.
- [x] Range hierarchy choices preserve whether the chosen month belongs in the left or right pane.
- [x] Bounds, unavailable dates, locale/calendar arithmetic, disabled state, focus, and accessible labels remain correct.
- [x] The popup introduces no horizontal or vertical scrollbar at the reviewed narrow viewport.
- [x] The human-facing showcase and generated component guidance describe and demonstrate the behavior.
- [x] Focused automated, type, formatting, style, build-generation, and visual checks pass.

## Accepted sources

- [Specification](../spec.md)
- [Two-month layout](../decisions/04-two-month-layout.md)
- [Stable calendar height](../decisions/06-stable-calendar-height.md)
- [Hierarchical navigation](../decisions/07-hierarchical-navigation.md)
- [Keyboard and assistive interaction](../decisions/08-keyboard-accessibility.md)
- [Single-date scope](../decisions/09-single-date-scope.md)
- [React Aria capability research](../research/react-aria-capabilities.md)
- [Accepted prototype](../prototypes/date-range-navigation.md)

## Completion evidence

- `npm run check` passed formatting, ESLint, stylelint, project type checking, all 278 tests in 17 files, generated-artifact checking, and the TypeScript declaration matrix.
- `npm run showcase:build` passed. Generated DatePicker and DateRangePicker guidance is current.
- Headless Chromium direct inspection covered dark and light appearances at 1400 px and 760 px widths. The range day and hierarchy surfaces both measured 672 by 300 CSS pixels with matching client and scroll dimensions, stayed within the narrow viewport, and produced no console errors.
- Direct inspection confirmed two own-month range panes, visible adjacent-month dates in DatePicker, hidden duplicate adjacent-month dates in DateRangePicker, fixed six-row day grids, 12 month and year choices, stable hierarchy height, compact responsive controls, and retained right-pane hierarchy alignment.
