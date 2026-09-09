# 12 Standardize chart activation pulses

**What to build:** Preserve the established production pulse styles with shared timing and consistent screen-space sizes, and apply the production outline pulse to the heatmap study.

**Blocked by:** none

**Status:** complete

- [x] Point pulses use one screen-space base radius, including compact radar.
- [x] Bar and statistical outline pulses share stroke, outset, opacity and outward travel independent of mark size.
- [x] Slice fades and radar dimension draws preserve their established geometry with shared timing. Reduced motion remains static and repeated activations restart.
- [x] Heatmap study uses the production outline animation and only the chosen Cell frames selection. Missing cells remain targets. No prototype tests or agent reviews.
- [x] Public examples and contracts explain the shared convention. Production regression coverage, native inspection and repository checks pass.

## Accepted sources

- [Shared activation motion](../spec.md#shared-activation-motion)
- Whitney requested standardization and chose Cell frames, retaining the general production style.

## Completion evidence

The public radar regression first failed because its activation radius was four view-box units.
Two public bar regressions first failed because no shared screen-space travel existed. A public scatter regression exposed the shape-dependent initial outset on diamond markers.
All four now pass. `npm run build`, `npm run check` with 675 tests across 41 files, `npm run showcase:build`
and `npm run verify:package` pass, including TypeScript 5/6/7 and packed React 18/19 rendering,
hydration and browser builds.

Native production operation measures three-pixel outward travel on both axes for columns,
scatter, bubbles, histogram bins and box summaries. Radar's base pulse radius is ten screen
pixels in both normal and compact layouts. All use 620ms timing. Reduced motion keeps the initial outline spacing without animation, with opacity 0.8, and the cue disappears after its lifetime. Dark and compact light
states were visually inspected, including slice-outline feedback. Screenshot files were removed.

The heatmap prototype imports the same measured outline component and lifetime. Direct operation
confirms the same edge travel and timing; normal dark and compact light states were inspected.
Cell frames and missing-cell targets are retained. Its production-inherited solid hover outline
is unchanged pending the user's decision. No tests or agent reviews cover the prototype.

Public contracts, generated component guides and the showcase describe the shared motion.
Independent production intent review passes with no findings. Engineering review identified a
shape-dependent outset for statistical symbols. The shared outline now measures the rendered
symbol bounds for both its initial five-pixel outset and subsequent three-pixel travel. Native
operation confirms those distances for circles, diamonds and triangles in scatter and bubble
charts, plus static compact light-mode feedback. Independent engineering correction review passes with no findings.
