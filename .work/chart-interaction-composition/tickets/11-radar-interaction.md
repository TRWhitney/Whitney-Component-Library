# 11 Select and activate radar values

**What to build:** Deliver the accepted radar point/dimension selection and independent activation through the public component and live showcase.

**Blocked by:** none

**Status:** complete

- [x] Point rings join colored borders; dimension labels use underlines. Neutral reading fills match the guide and the exact target, independent of profile emphasis. Overlap-only legend priority remains usable.
- [x] Point activation pulses its marker. Dimension activation reaches the furthest actual value, holds briefly and fades. Reduced motion gives static feedback. No whole-chart focus outline appears.
- [x] Click/tap selection, independent modified activation, touch hold, visible rectangle selection, modifiers and cancellation match the accepted contract.
- [x] Keyboard traverses dimensions and profiles, including zero values. Zeros are keyboard/dimension targets; no center clicks or visual shoulders create zero-value pointer targets. Rectangle selection uses positive value centers only.
- [x] Stable IDs support controlled/internal selection, reorder and retirement. Data/geometry/presentation/mode changes cancel pending gestures and feedback; callback replacement alone does not.
- [x] Callbacks deliver original records and exact values for one point or all profiles on one dimension. Existing noninteractive readings, tables, proportions and sparse shoulders remain intact.
- [x] Public types, canonical contracts, generated guides and live showcase explain ownership, gestures and zero behavior. Public regressions, native operation and repository/package checks pass with independent production reviews.

## Accepted sources

- [Radar interaction](../spec.md#radar-interaction)
- [Accepted study](../prototypes/radar-selection.md)
- [Existing radar dimension meaning](../../radial-heatmap-compact-charts/decisions/02-radar-dimensions-and-normalization.md)

## Public boundary

`RadarSelectionItem` identifies `dimensionId` and optional `seriesId`.
`RadarActivation<Datum>` has `item`, `dimension: {id, label}`, `input`, and `values` with
`{seriesId, label, value, datum}`. `RadarInteraction<Datum>` has `target`, optional
`ChartSelection<RadarSelectionItem>`, and optional `onActivate`. RadarChart has optional `interaction`.
The shape mirrors existing ChartSelection and activation conventions without exposing renderer objects.

## Testing decisions

Use public component gestures, callback records and selected IDs as the stable seam. Cover ordinary
and modified activation, rectangle inclusion and cancellation, controlled ownership, reorder/retirement,
zero targets, touch hold, mode/geometry changes and callback replacement. Retain existing radar tests.
Native operation must exercise both target modes, theme/compact layouts, overlap pinning, point rings
and full-length dimension pulses, with no gap or accidental first-dimension jump after pointer focus.

## Completion evidence

The first five public interaction regressions failed for absent selection and activation before production changes. Further regressions confirmed and corrected blank-pointer previews, formatter-change hold cancellation, and all-zero dimension feedback. The 41 focused radar tests pass. The full repository check passes with 671 tests across 41 files, lint, formatting, declarations for TypeScript 5/6/7, generated guidance and chart isolation. Build and showcase build pass.

Native production operation covers point and dimension clicks, independent modified activation with original records, a visible drag rectangle and Escape cancellation, light compact rendering, zero-value keyboard selection, and reduced motion. The outer ring meets normal and emphasized borders within computed-style rounding. Dimension activation reaches the furthest value exactly and holds at full length. Direct collaborative-browser operation confirms two filled centers with one emphasized profile in dimension mode and the selected label underline. Screenshot states were inspected and removed.

An all-zero dimension has no radial extent. Activation briefly thickens its label underline to provide feedback without inventing a value. Reading fill and marker border transitions use the same timing. Public types, generated guides and both regular/sparse showcase examples describe the implemented ownership and gestures.

Packed React 18/19 server rendering, hydration, declarations and browser builds pass. Intent review passes with no findings. Engineering review found that pointer exit discarded the keyboard target. A regression reproduced Enter acting on the first dimension after clicking another profile/dimension and leaving the plot. The keyboard cursor now retains stable profile/dimension IDs independently of hover visibility. The regression passes, and native operation confirms Scout Range remains the activation target after pointer exit. The restored reading was visually inspected. Renewed full validation passes with 671 tests, the repository checks, showcase build and packed React 18/19 verification. The independent engineering correction review passes with no findings.
