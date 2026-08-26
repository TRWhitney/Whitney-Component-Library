# Statistical chart input semantics

## Question

What input and reading semantics do established chart grammars and statistical references use for
scatter and bubble plots, raw and pre-binned histograms, and raw and summarized box plots?

## Scope

This research covers record identity, bubble magnitude, bin boundaries and ordinates, quartiles,
whiskers, outliers, and structured alternatives. It does not choose the library's public
TypeScript shape or visual styling.

## Conclusion

- Scatter and bubble plots represent each input record as one point with quantitative X and Y
  values. A stable record identity remains separate from coordinates. Bubble magnitude conventionally
  maps to symbol area, and a reading reports the source magnitude rather than the rendered radius.
- Raw and pre-binned histograms are different contracts. Raw mode derives intervals from
  observations. Pre-binned mode supplies start, end, and ordinate meaning. Counts only preserve
  honest rectangle area when every bin has the same width; unequal bins require density or another
  explicitly named ordinate.
- Histogram boundary conventions and automatic bin rules vary across established systems. The
  library must state both rather than imply a universal convention.
- Q1, median, and Q3 are stable box-plot terms. Quartile algorithms, whisker definitions, and
  outlier classification vary. Raw mode therefore needs a documented calculation rule, while
  summary mode should accept explicit lower and upper whiskers and outlier observations.
- Dense and coincident points make a complete structured alternative necessary even when direct
  point reading exists.

## Evidence

- [D3 binning](https://d3js.org/d3-array/bin) retains source observations and exposes inclusive
  lower and normally exclusive upper boundaries. It offers several automatic threshold rules.
- [D3 summaries](https://d3js.org/d3-array/summarize) calculate quartiles with the R-7 method.
- [Vega-Lite point marks](https://vega.github.io/vega-lite/docs/point.html) represent each input row
  as a point, create bubble plots through a size encoding, and define point size by area.
- [Vega-Lite box plots](https://vega.github.io/vega-lite/docs/boxplot.html) support Tukey 1.5 IQR and
  min-max whiskers, and distinguish box summaries from outlier readings.
- [Observable Plot bin transforms](https://observablehq.com/plot/transforms/bin) distinguish bin
  extents from reducers such as count, proportion, density-related summaries, and other values.
- [Observable Plot pointer interaction](https://observablehq.com/plot/interactions/pointer) reads
  existing points and documents the ambiguity of coincident points.
- [R histogram documentation](https://stat.ethz.ch/R-manual/R-devel/RHOME/library/graphics/html/hist.html)
  states that unequal-width frequency bars misrepresent area and documents a boundary convention
  opposite D3's default.
- [NIST box-plot guidance](https://www.itl.nist.gov/div898/handbook/eda/section3/boxplot.htm)
  documents min-max whiskers and a separate 1.5 IQR fence variation.
- [W3C complex-image guidance](https://www.w3.org/WAI/tutorials/images/complex/) treats charts as
  complex images and recommends a structured long representation for their essential information.

## Conflicts and limitations

No source establishes one required public API. There is no universal quartile algorithm, whisker
rule, automatic bin rule, or bin boundary convention. Those remain product decisions. The sources
also do not decide this library's point-navigation order or visual overlap treatment.

## Implications

The input modes should be explicit and typed. Point identity, histogram ordinate meaning, box-plot
calculation rules, and structured table fields must be part of the accepted contract before
implementation begins.
