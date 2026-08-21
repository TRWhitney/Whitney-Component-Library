# RangeSlider

RangeSlider adjusts an ordered numeric interval within a finite range.

## Use for

- a lower and upper numeric bound define one interval and relative position within the complete domain helps the user adjust it

## Do not use for

- only one value is chosen, either bound requires exact typed entry, endpoints are named categories, or an interval is displayed without user adjustment

## Prefer instead

- Use Slider for one approximate value, two NumberField controls for exact bounds, named choice controls for categorical endpoints, and Meter for display-only intervals.

## Composition and parts

- Render RangeSlider inside AppearanceProvider; provide one finite domain and exactly two localized thumbLabels, and let the component own both thumbs and their ordering.
- RangeSlider includes a header, formatted range output, endpoint scale, track, interval fill, two offset thumbs, two hidden native range inputs, and one fixed support area.

## Preferred higher-level compositions

- Place RangeSlider with related filters or numeric constraints in FieldGroup or FormSection.

## Content

- Name the interval with label and identify each bound with parallel thumbLabels such as Minimum and Maximum; describe the consequence of the retained interval rather than repeating its mechanics.

## States

- Both bounds remain separately operable in controlled, uncontrolled, separated, adjacent, equal, horizontal, vertical, focused, dragging, read-only, disabled, and invalid states.

## Control, events, validation, and forms

- A controlled or uncontrolled two-value tuple remains in ascending order; each thumb is clamped by its adjacent value so the bounds may meet but never cross, and paired caliper offsets keep close thumbs distinguishable.
- onChange reports an ordered two-number tuple for each accepted adjustment; onChangeEnd reports the final tuple after keyboard, pointer, or touch adjustment ends.
- The component rejects malformed tuples, descending values, non-finite or unreachable domains, and off-step or out-of-bounds values; use isInvalid with errorMessage for external interval rules.
- names supplies two optional field names for the two hidden native range inputs and form associates both externally; reset restores the complete default tuple.

## Accessibility

- RangeSlider exposes one labeled group with two native range inputs, distinct thumb names, formatted value text, dynamically constrained bounds, and shared description or error relationships.

## Keyboard, labeling, localization, and direction

- Each thumb is reached separately by Tab; Arrow, PageUp, PageDown, Home, and End adjust only the focused bound within the domain and adjacent-thumb limit.
- label names the complete interval and thumbLabels gives each thumb a distinct accessible name; description and error copy are generated once and referenced by both range inputs.
- locale and formatOptions format the current value, thumb value text, and endpoints consistently; supply localized visible labels, descriptions, errors, and range thumb labels.
- Horizontal minimum and maximum positions follow inherited writing direction and ArrowLeft or ArrowRight follow locale direction; vertical values always increase from bottom to top.

## Appearance and responsive behavior

- Range controls use a compact label and value header, formatted endpoints, a narrow track, and circular thumbs instead of a field box.
- Horizontal controls fill their parent and keep endpoints and thumbs operable on narrow screens. Vertical controls use a preset width and a twelve-rem minimum track height.

## Accent, forced colors, and reduced motion

- Labels, values, endpoints, and the empty track stay neutral. The measured fill, thumbs, and focus use accent colors. Interactive thumb hover adds dilation without changing color. Invalid state uses danger colors.
- Forced-color mode maps the track, measured fill, thumbs, focus, and invalid state to system colors without moving them.
- Direct thumb position never animates; reduced motion also removes the remaining thumb hover and focus transitions without removing value or focus structure.

## Examples

### Choose a review window

Adjust both bounds without allowing their semantic order to reverse.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, RangeSlider} from '@trwhitney/component-library';

export function ReviewWindow() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <RangeSlider defaultValue={[20, 80]} label="Review window" locale="en-US" minValue={0} maxValue={100} step={5} thumbLabels={['Window start', 'Window end']} />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not invent an interval for one value

One threshold has no second bound and needs only one operable thumb.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, RangeSlider} from '@trwhitney/component-library';

export function SingleThresholdCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <RangeSlider label="Confidence" locale="en-US" minValue={0} maxValue={1} step={0.05} thumbLabels={['Lower', 'Upper']} />
    </AppearanceProvider>
  );
}
```
