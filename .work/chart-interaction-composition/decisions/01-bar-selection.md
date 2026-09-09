# 01 Bar selection indicators

**Status:** resolved
**Blocked by:** none
**Type:** prototype

## Question

How should reading, persistent selection, and activation appear on individual bars, including
stacked segments and horizontal bars, while preserving the approved gestures?

## Answer

Whitney chose Frame after accepting the shared-edge correction and continuous month contour.
The accepted contract is canonical in the linked prototype record; End cap is rejected for production.
Month hover uses one continuous inner contour around its combined bars, as explicitly requested
by Whitney. Shared selection edges meet without overlapping the inner reading cue.
Category selection keeps the accepted label underline. Point targeting chooses the nearest actual
bar rectangle within the nearest category; dragging selects rectangles it touches.

## Evidence

[Runnable prototype and design plan](../prototypes/bar-selection.md).
Existing bar marks expose row/series identity and plotted rectangles. Their fills already encode
series identity and magnitude, so a newly filled circle would introduce a different mark.
