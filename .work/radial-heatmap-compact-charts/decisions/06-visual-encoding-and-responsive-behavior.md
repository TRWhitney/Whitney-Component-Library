# 06 Visual encoding and responsive behavior

**Status:** resolved
**Blocked by:** none
**Type:** prototype

## Question

How should slices, rings, radar polygons and spokes, heatmap cells and missing values, and compact
trend marks use the role-aware palette, patterns, outlines, labels, focus, emphasis, and responsive
fallbacks while remaining legible in both appearances and forced colors?

## Prototype acceptance boundary

The prototype must use the repository's real chart frame, shared behavior, styles, and utilities
wherever they already cover the work. It should replace or isolate only the pieces needed to test
the unresolved visual and interaction decisions in this ticket.

Before review, the prototype record must name each decision under scrutiny and every intentional
departure from an accepted chart convention. Incidental differences caused by prototype code are
not review questions. Acceptance applies only to the named questions. It does not approve those
incidental differences or permit production to depart from earlier chart decisions.

Production must return to the accepted chart contracts and shared implementation for everything
outside the named prototype questions. Prototype-only fixtures, controls, shortcuts, and
implementation choices must remain isolated and must not become production behavior without a
separate, explicit decision.

## Named Sparkline questions

The faithful prototype will compare three caption treatments while keeping the same accepted data,
reading, state, theme, and table behavior:

1. An embedded sparkline beside consumer-owned visible metric text, with its required label and
   description available to assistive technology but no component-rendered caption.
2. A self-captioned sparkline with one compact visible label and current value while the longer
   description remains available to assistive technology.
3. The standard visible chart title and description, shown as the existing chart convention and a
   size reference rather than presumed correct Sparkline behavior.

The prototype will also compare restrained endpoint and range cues and establish the smallest size
that preserves the accepted reading behavior. Acceptance of one treatment will bind only these
named Sparkline questions.

Whitney accepted the standard visible chart title and description. Sparkline keeps the delivered
caption typography, spacing, naming, and state relationship in every appearance and size. The
embedded and compact-caption treatments are rejected. The caption prototype's fixture, controls,
hidden-axis padding, aspect ratio, minimum height, and CSS remain flexible and do not specify
production measurements or implementation.

Whitney accepted static Current and observed range cues. Sparkline fills the current record and
uses hollow series-color marks for every record tied at the observed low or high. A current record
that is also an extreme keeps the filled current treatment. The cues remain visible at rest and
supplement exact caption, tooltip, announcement, and table values without adding persistent value
labels. Exact marker measurements remain flexible, but their hierarchy must stay obvious.

The LineChart adapter cannot faithfully settle a Sparkline minimum because it retains hidden axis
margins and a Cartesian view box. Production will start from a provisional compact default using
the chart family's existing sizing scale and expose the accepted `minimumSize` override. Exact
default measurements are reversible implementation detail and remain subject to review on the real
Sparkline geometry; they cannot change the accepted caption, cues, or no-scroll behavior.

## Named pie and donut question

Whitney selected the remaining category count over the ellipsis and outside `More` treatments. The
revised prototype makes the count bold and places it from the pie slice's area rather than a fixed
radius, so its position responds to the slice angle. The count keeps its readable minimum size and
grows modestly with the available plot size.

Whitney accepted eight ranked categories per page and proportional aggregation as the default. A
public option retains the deliberately smallest aggregate. Six and ten categories per page are
rejected. The first page uses its eighth visible place for the aggregate. Later pages admit up to
eight ordinary categories and add another aggregate when more remain.

Pie and donut use the delivered legend's temporary and pinned emphasis behavior and add outward
movement to the emphasized slice. Slice hover also pops the slice out and opens the cursor-following
tooltip. Legend hover or focus pops the slice out and mutes the others without opening a tooltip.
Clicking pins that state, clicking another item replaces it, and Escape clears it.

Layout responds to the chart's available width and height, not the browser viewport. In short
areas, the caption, page indicator, Back button, legend controls, swatches, and type step down
modestly. The legend compacts before local scrolling. Narrow layouts stack only when enough height
exists. Legend overflow uses ScrollRegion's transient thumb without its container treatment. The
donut center total and unit maintain readable rendered sizes as the SVG scales.

Exact centroid math, density thresholds, popout distance, angles, fixture values, SVG technique,
dimensions, prototype controls, and proportional sizing formulas remain flexible.

## Answer

Apply the accepted prototype contracts to production while preserving the existing chart family's
visual language and behavior outside the named questions. Sparkline uses the standard caption and
static current plus observed-range cues. Pie and donut use the accepted aggregate label, paging,
sizing option, emphasis, tooltip, legend overflow, and bounded resize behavior. Prototype-only
fixtures, controls, geometry, and rendering techniques do not bind production.

## Evidence

- [Role-aware chart-color specification](../../chart-accent-palette/spec.md)
- [Statistical chart visual encoding](../../library-foundation/decisions/19-statistical-chart-visual-encoding.md)
- [Parent implementation ticket](../../library-foundation/tickets/21-radial-heatmap-and-compact-charts.md)
- [Sparkline caption prototype](../prototypes/sparkline-caption.md)
- [Sparkline cue prototype](../prototypes/sparkline-cues.md)
- [Pie and donut aggregate-slice prototype](../prototypes/pie-donut-paging.md)
