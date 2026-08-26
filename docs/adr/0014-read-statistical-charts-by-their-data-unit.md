# Read statistical charts by their data unit

Statistical charts keep one named keyboard boundary and the chart-owned tooltip, touch retention,
legend, and clearing behavior established for Cartesian charts. Pointer and touch input read only a
directly targeted mark; blank plot space never infers a nearby value. Keyboard input traverses
scatter and bubble points spatially, histogram bins in domain order, and box-plot group summaries in
domain order. Direct box-plot outlier reading remains separate from its group summary. Direct mark
reading mutes every other mark, while legend interaction emphasizes a whole group and gives a pinned
group pointer priority where marks overlap. Selection and coordinated state remain separate later
work.
