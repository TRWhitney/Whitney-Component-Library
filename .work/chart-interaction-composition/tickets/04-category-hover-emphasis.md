# 04 Preserve line hover emphasis in category mode

**What to build:** Preserve line hover emphasis independently of the category/point click target.

**Blocked by:** none

**Status:** complete

- [x] Hovering the nearest visible line emphasizes it in both interaction modes, with the existing
      legend pin taking precedence. Moving away clears hover emphasis.
- [x] Category mode fills every visible point at the current month. Click selects that month and
      activation emits one category event with all associated values. Point mode remains unchanged.
- [x] Public documentation and the rendered example explain the distinction. A focused production
      regression and direct browser operation demonstrate it.

## Accepted sources

[Specification](../spec.md#accepted-activation-and-selection-convention) and Whitney's explicit
clarification: "the inner circle fill should remain the indicator of what I will be selecting and
be in both lines."

## Completion evidence

The category-mode regression failed before the fix while point mode passed. Both now pass,
including unchanged category selection/payload and all visible filled centers. A duplicate-coordinate
regression also preserves the category row used by the callback. All 50 affected tests pass.
The full 593-test suite passed before the additional duplicate-coordinate regression; that regression
and affected suites then passed against the final code. Targeted ESLint and formatting, repository
types, generated docs, and the public TypeScript 5/6/7 matrix pass. The showcase build passes.

Native Chromium operation confirmed Demand hover with two fills in Month mode, Capacity hover
with two fills, and one fill in Point mode. Click selected February as one month. Light/dark
screenshots were inspected. The existing legend pin still takes precedence. No public API,
styles, or prototype source changed for this correction. Independent production intent and engineering review passes with no findings.
