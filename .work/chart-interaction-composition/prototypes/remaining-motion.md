# Remaining chart motion

## Decision

Does the approved 240ms cubic ease-out motion also suit radar profiles, compact sparklines, histogram counts and box summaries with individually identified outliers? Compare Animated and Instant together in one study. Status: accepted with the Sparkline marker correction below.

## Design

Reuse the value-motion study layout and native chart renderers. Canvas, surface, text, muted text and border use their existing tokens; accent is #2878ff. Headings use the body face at 24px, while axes and readings use the native utility face. Chart type and motion choices each occupy their own row. The chart is the primary content; Update values and Reset sit directly above it. Existing rings, label underlines, cell/box frames, hover and eyes remain the visual identity. Do not introduce another selection indicator.

Motion coordinates the shape and its selected marks. Fixed identities, ordered dimensions, bin boundaries, groups and outlier IDs bound this comparison. Changes to gaps, dimension order, bin boundaries and group membership are not animated by this study. Source readings and callbacks stay current. Existing accepted behavior takes precedence over incidental adapter behavior. There is no entrance animation or automatic loop; reduced motion settles immediately.

## Run

Source: [remaining-motion](remaining-motion/main.tsx). Data is synthetic vehicle scores, daily energy demand, restart counts and supplied recovery-time summaries.

```sh
./node_modules/.bin/vite .work/chart-interaction-composition/prototypes/remaining-motion --config .work/chart-interaction-composition/prototypes/remaining-motion/vite.config.ts --host 127.0.0.1 --port 5193
```

Prototype-only Vite adapters target production a67c678. They do not alter the production build. No agents or production regression tests are used for this study.

## Operated flows

At 390px, operated Update values in every chart and observed intermediate geometry before settlement. Selected the first native keyboard target, updated and retained the selection; Control/Command plus Enter reported Courier 61 points, Day 1 demand 63 MWh, the first interval's five restarts and North's 62-minute median. Selection indicators followed the shapes. The page stayed 390px wide in all four cases. Operated Instant, Reset, light appearance at 1200px, reduced motion and Identify elements. Inspected the rendered compact dark and wide light states and removed temporary screenshots. Fixed one invalid synthetic outlier before presenting the study.

Whitney accepted the charts except for abrupt Sparkline minimum/maximum marker changes. No production changes, subagents or regression tests belong to this prototype.

## Accepted behavior and correction

Apply the previously accepted 240ms ease-out motion to radar values, Sparkline values, fixed histogram counts and box summaries/outliers. Preserve native selection, reading, visibility and reduced-motion behavior; callbacks and tables use supplied values. This study does not reopen the shared animation decision.

Sparkline minimum and maximum indicators must participate in the transition. Keep a retained cue attached to its moving reading; when the extreme changes identity, fade the former cue out and the new cue in over the same transition. Do not pop or move a marker through invented readings. Retarget interrupted changes from their current display. This is the correction to Whitney's report, not another approval gate.

The corrected 390px preview was operated directly. The old and new minimum cues had complementary intermediate opacity while their vertical positions followed the line, then settled to one minimum cue. Repeated updates retargeted cleanly. The existing maximum and current cue stayed visible. The screenshot was inspected and removed.

Whitney subsequently approved the corrected markers with "They look good" and explicitly authorized finishing production implementation.
