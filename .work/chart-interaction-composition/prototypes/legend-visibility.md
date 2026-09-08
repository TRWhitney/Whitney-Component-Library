# Legend visibility and scale fitting

## Question

Can a separate opening/closing eye make hiding and restoring series obvious and restrained while
the existing series-name button retains emphasis and the chart visibly fits the remaining data?

## Design plan

- Colors use `--wcl-canvas`, `--wcl-surface`, `--wcl-text`, `--wcl-text-muted`,
  `--wcl-accent-focus`, and the production chart series colors.
- Captions retain the production body type. Legend labels and controls retain the production
  utility type at 14px; the prototype heading uses body type at 24px.
- Keep the caption, inline legend, and plot in their existing order. Each eye sits directly after
  its series name with no permanent border or filled square. The eye's focus outline appears only
  during keyboard focus, and its hover treatment is quiet.
- The distinctive element is an open eye for visible data and a closed lid with lashes for hidden
  data. Its button is named with the next action, such as Hide Revenue or Show Revenue.
- Scale bounds interpolate over 240ms while tooltip values remain the actual data. Repeated input
  retargets from the current scale. Reduced motion settles immediately.

This extends the existing legend rather than replacing its shape, labels, swatches, emphasis,
caption, or chart-reading model. The page-level controls are prototype aids.

## Candidate behavior

- Series-name clicks retain production pin/unpin emphasis. Hiding a pinned series clears its pin.
- Separate eye buttons hide and restore series. Legend order, colors, and line patterns stay stable.
- A hidden name cannot pin invisible marks; its eye remains available to restore the series.
- Hiding every series leaves the caption and legend present with a named message and Show all
  action in the plot area. This is a candidate for review, not an accepted product decision.
- A complete data table stays available irrespective of visibility.
- Light/dark, compact/roomy, immediate/reduced motion, and element-identification controls support
  review without changing the proposed product controls.

## Run

From the repository root, run `npm ci`, then:

```sh
npx vite .work/chart-interaction-composition/prototypes/legend-visibility --host 0.0.0.0 --port 5173
```

Open `http://localhost:5173`. The fixed demonstration data represents monthly revenue, operating
costs, and support costs in thousands of dollars. No network data or account is required.

## Inspection flows

1. Click Revenue to pin it; click again to clear. Hover and focus the other names.
2. Hide Revenue with its eye. Follow the remaining lines and axis as the scale fits them.
3. Restore Revenue, then toggle visibility during another transition.
4. Hide each series, inspect the all-hidden message, and restore one series or use Show all.
5. Use Tab, Enter, Space, and Escape. Focus stays on the same visibility control as it changes.
6. Read categories with the pointer and keyboard. Readings retain exact values during scale changes.
7. Repeat in light and dark themes, compact width, and reduced motion. Turn on Identify elements
   to reveal stable region names on hover and focus without changing layout.

## Implementation boundary

This is a non-production adapter around the current LineChart. It supplies filtered series and
animated explicit bounds, inserts experimental eye controls into the existing legend with React
portals, and preserves hidden legend entries. These DOM adaptation techniques are disposable and
are not a proposed public API. The production chart owns its reading and emphasis behavior.
The adapter hides the production table for filtered series and supplies one complete table in the
prototype's data disclosure. Production table markup otherwise introduces page overflow in this
compact host; this adaptation does not change the library's table implementation.

## Result

Direct Chromium operation supports the candidate. Production name clicks pin emphasis and mute
the two peer series; hiding the pinned series clears the pin. Hiding Revenue changes the scale
from 0 to 1200 down to 0 to 350, and sampled frames show the remaining operating-cost point moving through
intermediate positions before settling. Enter restores Revenue while focus stays on its eye.
Legend DOM order and visual order remain Revenue, Operating costs, Support costs after changes.

The all-hidden message, restoring one series, and Show all work without current runtime errors.
Keyboard End reads June's exact 1200, 295, and 70 values; Escape clears that reading. A touch
pointer event reads January's exact 820, 220, and 44 values. Light and dark images were inspected,
including a compact specimen at a 480px viewport. The compact page has no horizontal overflow
after the table adaptation. Reduced-motion, data-disclosure, and element-identification controls
were operated directly. A prototype animation correction clamps frame progress at both endpoints
because the first animation-frame timestamp can precede effect setup.

Prettier, ESLint, Stylelint, the isolated TypeScript check, and the Vite build pass. The production
baseline passes 114 tests across six chart suites. These checks validate the example and establish
the existing baseline; they do not constitute production implementation evidence for Ticket 22.

## Accepted contract

Whitney accepted the working example and this contract with "Yes, looks good." Preserve the inline open/closed eye with no permanent button
frame, separate name-based emphasis, stable legend order and focus, visible-data scale fitting,
brief interruptible animation, reduced-motion settling, persistent hidden entries, and an all-hidden
message with Show all recovery. Preserve equivalent keyboard operation, theme coherence, and the
complete-data alternative.

Demonstration data, prototype controls, DOM adapters, and the exact 240ms duration are flexible.
This example does not settle selection gestures, domain exploration controls, or their public API.
