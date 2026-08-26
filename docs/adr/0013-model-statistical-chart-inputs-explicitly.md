# Model statistical chart inputs explicitly

Statistical charts use record-oriented point data and discriminated raw or summarized distribution
inputs because coordinates, bins, quartiles, whiskers, and outliers carry different meanings.
Bubble magnitude maps to area; raw histograms use D3's lower-inclusive intervals; raw box plots use
R-7 quartiles with Tukey 1.5-IQR whiskers by default; and summarized inputs state their bounds and
ordinate meaning directly.
