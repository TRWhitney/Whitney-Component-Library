# 22 Chart Interaction and Composition

**What to build:** Extend the delivered chart readings with series visibility, activation callbacks,
selection, coordinated views, domain exploration, purposeful animation, and specific additional
mixed-chart combinations.

**Blocked by:** none. [Statistical Chart Family](20-statistical-chart-family.md) and
[Radial, Heatmap, and Compact Charts](21-radial-heatmap-and-compact-charts.md) are complete.

**Status:** active; delivered foundation complete, remaining work in
[active implementation effort](../../chart-interaction-composition/status.md)

## Delivered foundation

- [x] Chart-owned pointer, keyboard, and touch readings expose formatted data and accessible
      announcements according to each chart's accepted reading unit.
- [x] Legends support transient emphasis and click-to-pin emphasis where applicable, with non-color
      identity cues and no series hiding.
- [x] Charts provide named keyboard reading boundaries, ordered traversal, responsive presentation,
      and complete generated data tables. Keyboard access does not require a tab stop per mark.
- [x] CartesianChart combines compatible line, area, and column series with bounded scales and
      reference lines, bands, and point annotations while keeping renderer objects private.
- [x] The existing column-and-line combination can display columns with a moving-average line when
      the application supplies the calculated values.

## Remaining acceptance checks

- [ ] Separate, obvious, visually restrained legend controls hide and restore individual series
      while clicking the series name retains the existing emphasis behavior. Hidden entries remain
      discoverable and restorable. An opening/closing eye is the leading visual candidate, subject
      to review in a working example; its meaning must also be accessible without the icon.
- [ ] Hiding or restoring series automatically fits the scale to visible data without requiring an
      application setting to enable that behavior. Required chart baselines remain valid.
- [ ] Applications can receive activation callbacks for actual chart items, including categories
      and points, with sufficient identity and associated data to act on them. Activation does not
      require adopting chart selection. Pointer, keyboard, and touch have equivalent activation
      paths.
- [ ] Apply the [accepted indicator convention](../../chart-interaction-composition/spec.md#accepted-activation-and-selection-convention)
      consistently: filled centers mark current readings on circular point markers, a brief pulse
      acknowledges activation without retained inspection state, outer rings mark selected points,
      and underlines mark selected months. With selection enabled, ordinary clicks select and
      Control/Command-clicks activate without changing selection. With selection disabled, ordinary
      clicks activate. Reading previews and clicks target the same item. Category activation emits
      one category event with associated values. Reduced motion retains a brief static acknowledgment.
- [ ] Charts support visible selection and application-controlled selection. Applications can
      deliberately coordinate charts, tables, detail views, or filters through explicit public
      state and callbacks without hidden global coupling or a prescribed application action.
- [ ] Meaningful chart domains support pan, zoom, and brush/range selection, with keyboard paths,
      discoverable controls, an easy reset, and range callbacks available to the application.
- [ ] Exploration and selection controls are intuitive, visually restrained, and consistent with
      the chart. Their gestures do not accidentally interfere with value reading, activation, or
      legend emphasis. Working examples demonstrate both appearance and operation before acceptance.
- [ ] Brief, purposeful animations explain data and scale changes, remain responsive to further
      input, never loop idly, and settle immediately under reduced motion.
- [ ] Scatter points can share a chart with a supplied trend, target, or other compatible line.
- [ ] A line can share a chart with a supplied lower/upper range band that changes along the domain,
      such as an uncertainty or forecast band. This extends the existing fixed reference bands.
- [ ] Applications supply calculated trend, average, forecast, and range values. Charts do not
      silently choose statistical calculations or expose private renderer objects.
- [ ] Accessible names, readings, focus, and structured data alternatives remain accurate as
      visibility, filters, selection, and the displayed domain change. Selection is distinguishable
      without color alone, and the complete-data alternative remains available.
- [ ] Representative datasets meet a recorded responsiveness budget covering reading, selection,
      visibility changes, exploration, and animation.
- [ ] Public contracts, generated guidance, showcase examples, and focused interaction, type,
      accessibility, reduced-motion, server-rendering, hydration, and package checks cover the
      delivered additions.

## Reconciled scope

Whitney accepted these remaining requirements in the reconciliation discussion on 2026-09-07.
They extend the earlier chart efforts, whose exclusions of visibility controls, consumer callbacks,
coordinated state, domain exploration, and geometry animation bounded those completed deliveries.
Those exclusions do not prohibit the additions accepted here.

Mixed-chart scope is the existing line/area/column composition, including supplied moving averages,
plus scatter with a line and a line with a changing range band. Scatter with adjacent distribution
charts is excluded from this composition work because it is an arrangement of separate charts.
General coordination between separate charts remains in scope; no dashboard or prescribed layout
is added.

Implementation planning still needs to settle exact controls and gestures, selection multiplicity,
visibility semantics for the other chart families, and the interaction between visibility fitting, zoom, and explicit
consumer domains. This reconciliation records requirements, not a finished interface design.

## Accepted sources

- [Specification](../spec.md)
- [Charting Scope](../decisions/13-charting-scope.md)
- [Quality and Release Boundary](../decisions/10-quality-and-release-boundary.md)
- [Accepted Cartesian reading and sizing](../../chart-interactivity/spec.md)
- [Completed chart-reading effort](../../chart-interactivity/status.md)
- [Completed radial, heatmap, and compact effort](../../radial-heatmap-compact-charts/status.md)

## Completion evidence

The delivered foundation is recorded in `d8cce02` for Cartesian interaction, `2d35b1f` for
statistical charts, `9780036` for pie and donut, `d9ddcd5` for radar, `6680a5c` for heatmap, and
`554be1e` for sparkline. Their effort records describe focused tests, browser operation, package
validation, and review corrections. The later chart effort records independent intent and
engineering reviews.

The reconciliation checked public chart types, implementations, tests, accepted specifications,
and ticket history. The old Ticket 22 checklist had not been reconciled with those deliveries.
A focused test rerun during this review could not start because `vitest` was not installed in the
checkout; the historical validation above is not a fresh test result.

The remaining checks span chart families and capabilities beyond the delivered portions below.
They remain unchecked until that broader scope is complete.

The first [Cartesian visibility implementation](../../chart-interaction-composition/tickets/01-cartesian-visibility.md) is complete with passing checks and independent intent and engineering reviews. It delivers eye controls, animated automatic scale fitting, and all-hidden recovery for five Cartesian charts. Visibility for other chart families, exploration, general data animation, and the two added compositions remain open.

Whitney approved the final [activation and selection prototype](../../chart-interaction-composition/prototypes/activation-selection.md#accepted-convention)
on 2026-09-08, including the reviewed gestures, targeting, indicator meanings, pulse feedback, and
light/dark marker spacing. The [LineChart production slice](../../chart-interaction-composition/tickets/03-line-chart-activation-selection.md)
is complete, including touch tap to select and press-and-hold to activate without changing selection.
It delivers independent callbacks, stable category/point identities, controlled or internal selection,
range/rectangle dragging, accepted indicators, and activation feedback. The
[pointer-focus fix](../../chart-interaction-composition/tickets/02-pointer-reading-focus.md)
also prevents mouse input from restoring a January keyboard reading.

Production contracts, generated guidance, and the rendered showcase are updated. All 591 tests,
repository checks, showcase build, and packed React 18/19 verification pass. Independent intent and
engineering reviews pass after two focused rendering/announcement corrections. Activation and
selection for other chart families remain open; the accepted LineChart behavior is the convention
for their planning.

Whitney chose Frame for individual bars after accepting continuous category contours and corrected
shared edges. The [bar/column production portion](../../chart-interaction-composition/tickets/05-bar-column-interaction.md)
is complete with 607 passing tests, repository/build/package checks, and independent intent and
engineering reviews. Other chart families and compositions stay open.

Whitney chose Value marker for areas after clarifying overlap-only legend priority. The
[area/mixed production portion](../../chart-interaction-composition/tickets/06-area-mixed-interaction.md)
is complete with 614 passing tests, repository/build/package checks, and passing independent
intent and engineering production reviews. Statistical/radial/compact interaction, exploration, data-change animation,
and the new scatter/range compositions remain open.

Whitney approved Centers inside for scatter/bubble rectangle selection. The
[observation interaction portion](../../chart-interaction-composition/tickets/07-scatter-bubble-interaction.md)
is complete with 622 passing tests, repository/build/package checks, and passing independent
intent and engineering production reviews after the recorded corrections. It also separates showcase segmented controls into their
own rows. Visibility for non-Cartesian families, other reading units, exploration, data-change
animation, and added compositions remain open.

Histogram and box-plot interaction is delivered in
[distribution ticket 08](../../chart-interaction-composition/tickets/08-distribution-interaction.md).
It preserves approved frames and Box touched selection, separate outlier targets, independent
activation and touch hold, and requires stable application IDs for interactive outliers. All 634 tests, repository/build/package checks and independent production reviews pass after the
recorded geometry-cancellation correction. This parent stays open for the remaining families,
exploration and compositions.

Pie and donut selection and activation is delivered in
[radial ticket 09](../../chart-interaction-composition/tickets/09-pie-donut-interaction.md).
It delivers the approved outer-edge selection and expansion asterisk, a visible sweep trail,
independent activation, touch hold, and selection across pages. All 645 tests and repository,
showcase, and package checks pass. Independent intent and engineering production reviews pass after the recorded corrections. Radar, heatmap,
compact interaction, remaining visibility, exploration, animations and compositions stay open.

[Ticket 10](../../chart-interaction-composition/tickets/10-marker-ring-spacing.md) corrects statistical
circle selection spacing and scale-aware radar reading fills. All 649 tests, repository/package
checks and independent intent/engineering review pass. Radar selection and activation remains next.

[Radar ticket 11](../../chart-interaction-composition/tickets/11-radar-interaction.md) implements
point and dimension selection, independent activation, visible rectangle selection and keyboard
access to zero values. Public contracts and regular/sparse examples are current. The 671 tests,
repository/build/package checks and native production inspection pass. Independent production
reviews pass after the recorded keyboard continuity correction. Heatmap and compact interaction, remaining visibility, exploration,
data-change animation and compositions stay open.

[Shared activation ticket 12](../../chart-interaction-composition/tickets/12-shared-activation-motion.md)
standardizes pulse timing and screen-space sizes across the implemented chart families. The
heatmap study uses the same animation and the accepted Cell frames. Dashed inner hover is approved. Public heatmap selection and activation is tracked in
[Ticket 13](../../chart-interaction-composition/tickets/13-heatmap-interaction.md).

[Heatmap ticket 13](../../chart-interaction-composition/tickets/13-heatmap-interaction.md) implements
cell selection, independent activation, Box touched dragging, stable row/column identity for missing
cells, dashed hover and solid selection frames. Its public examples, contracts and guide are current.
All 686 tests and repository/build/package checks pass. Independent intent and engineering reviews
pass after correcting keyboard tooltip continuity when the grid scrolls.
Compact chart interaction, remaining visibility, exploration, data-change animation and compositions
remain open.

[Sparkline ticket 14](../../chart-interaction-composition/tickets/14-sparkline-interaction.md) implements
the approved compact selection rings, horizontal range dragging, independent activation and touch
hold. Missing readings remain readable gaps; stable application IDs preserve record identity.
Public types, contracts, guide and rendered showcase are updated. All 697 tests and repository,
build and package checks pass. Independent intent and engineering production reviews pass with no findings. Remaining visibility,
exploration, data-change animation and the accepted added compositions keep this parent open.

[Statistical visibility ticket 15](../../chart-interaction-composition/tickets/15-statistical-visibility.md)
implements group eyes, automatic animated visible-data fitting, retained hidden selection and
all-hidden recovery for ScatterChart, BubbleChart and BoxPlot. Its public contracts, guides and
examples are current, and all 708 tests and repository/build/package checks pass. Independent
intent and engineering production reviews pass, including the restoration-animation correction. Radar visibility follows. Histogram and Sparkline visibility are
excluded; pie/donut percentages and heatmap row/column controls need their remaining decisions.
