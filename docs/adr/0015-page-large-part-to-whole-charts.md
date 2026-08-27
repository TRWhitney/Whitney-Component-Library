# Page large part-to-whole charts

PieChart and DonutChart accept any number of categories but page their ranked positive categories
in groups of eight. The first page reserves its eighth visible place for an aggregate navigation
slice when more categories remain. Later pages show up to eight ordinary categories and another
aggregate when necessary. Users can move forward and back through every page.

The aggregate angle is proportional to the hidden categories' combined value by default. A public
option restores the earlier deliberately smallest aggregate when navigation should stay visually
secondary. The accepted prototype replaced the original fixed six-category, smallest-slice rule
after direct comparison showed that eight categories and proportional aggregation retained better
part-to-whole meaning without losing usable paging.
