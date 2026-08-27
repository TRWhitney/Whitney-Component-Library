# Preserve radar values while shaping sparse fills

RadarChart treats missing dimensions as zero and keeps zero points at the center, but it may add
small visual-only shoulders around an isolated positive spoke so the filled polygon remains
visible. Readings, points, tooltips, and structured output keep the exact values because the
shoulders change presentation rather than data.
