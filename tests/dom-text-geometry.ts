// JSDOM has no text layout. Supply its missing Range geometry API for editor lifecycle tests;
// real layout, caret movement, and clipping are verified in browsers.
if (!Range.prototype.getClientRects) {
  Range.prototype.getClientRects = () => Object.assign([], {item: () => null});
}
if (!Range.prototype.getBoundingClientRect) {
  Range.prototype.getBoundingClientRect = () => new DOMRect();
}
