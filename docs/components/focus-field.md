# FocusField

FocusField owns atmosphere behind one chosen Surface while the application owns layout and meaningful active state.

## Use for

- a meaningful active composite region needs accent atmosphere around one chosen opaque panel

## Do not use for

- every card needs decoration, keyboard focus needs indication, or semantic success, warning, failure, or selection needs a signal

## Prefer instead

- Use Surface alone for idle depth. Use StatusIndicator, ProcessTracker, or progress components for semantic state. Use normal control focus styles for keyboard focus.

## Composition and parts

- Render inside AppearanceProvider and place exactly one Surface with focusFieldAnchor inside each FocusField. Consumer layout wrappers may sit between them.
- The application chooses the panel that deserves emphasis and supplies isActive from meaningful activity state. Do not always choose a status panel or apply atmosphere to every card.
- The field wrapper fills available width and accepts normal-flow children. The application owns columns, gaps, height, scrolling, and responsive stacking. Give major regions enough surrounding space for glow and depth to read; keep controls compact.
- Only Surfaces in the nearest FocusField participate in geometry. Other unnested Surfaces act as occupied space. Arbitrary content and portaled panels are not measured as obstacles. Nested fields own their own anchors.
- Keep the field outside opaque panels. Ancestor overflow may clip atmosphere; reserve surrounding room. Do not style private data attributes or copy the effect into consumer CSS.
- One noninteractive background field and unmodified consumer children. The anchor is selected through Surface focusFieldAnchor, not a selector or an extra focus target.

## Preferred higher-level compositions

- Wrap an application-owned arrangement of a base working Surface and raised supporting Surface. Mark the working Surface as the anchor and activate the field only when that region merits emphasis.

## Content

- Place a coherent composite region inside the field and keep real controls and readable status in the foreground.

## States

- Idle retains Surface depth without glow. Mounting active shows steady atmosphere. Each subsequent false-to-true transition blooms once. Deactivation immediately removes glow and cancels the bloom. Resizing does not replay motion.

## Control, events, validation, and forms

- Required isActive controls emphasis. Surface focusFieldAnchor selects its anchor. Color, blur, radii, offset, timing, and panel selection heuristics are not customization props.
- FocusField emits no callbacks. The application owns activity state and task completion.
- Missing, multiple, or zero-size anchors suppress atmosphere without breaking content. Restore exactly one visible anchor to restore the field. An anchor outside a FocusField has no atmospheric effect.
- TypeScript rejects style, className, custom offsets, colors, and timing props.
- The primitive does not submit values or participate in reset, validation, required, disabled, or read-only form state.

## Accessibility

- Atmosphere is decorative and never intercepts pointer events, changes reading order, adds announcements, or replaces visible status text.

## Keyboard, labeling, localization, and direction

- FocusField adds no focus target or keyboard behavior. Descendant controls keep their normal keyboard interaction and focus indication.
- FocusField creates no named region. Use Section or application-owned semantic HTML for visible names. Focus refers to visual emphasis, not keyboard focus.
- The primitive renders consumer content without translating, reordering, or constructing localized sentences.
- Placement follows actual panel geometry and available space, including RTL layouts; it does not assume a leading left edge.

## Appearance and responsive behavior

- A soft field surrounds the chosen Surface in every direction. Opaque panel faces, positions, and downward shadows remain identical between idle and active states.
- Panel and frame dimensions determine spread. The center shifts slightly toward the largest measured open area, accounting for other Surfaces. Offset changes the center only; the radial falloff still extends in all directions. Resize and content reflow recalculate geometry.

## Accent, forced colors, and reduced motion

- Atmosphere uses the inherited application accent. It does not replace semantic status colors or tint the opaque Surface.
- Forced colors removes atmosphere. Surface borders and visible text preserve the content hierarchy.
- Reduced motion suppresses the one-shot bloom while retaining steady active atmosphere. Idle never animates.

## Examples

### Emphasize document review

The application chooses Included documents as its anchor and supplies review activity. The supporting panel remains opaque and raised.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, FocusField, ResponsiveGrid, Section, Surface} from '@trwhitney/component-library';

export function ReviewRegions({isReviewing}: {isReviewing: boolean}) {
  return (
    <AppearanceProvider appearance="light" accent="#2474ff">
      <FocusField isActive={isReviewing}>
        <ResponsiveGrid gap="relaxed" minimumItemWidth="wide">
          <Surface focusFieldAnchor padding="spacious">
            <Section title="Included documents"><p>Review the saved field notes.</p></Section>
          </Surface>
          <Surface variant="raised" padding="spacious">
            <Section title="Publication"><p>Export after review.</p></Section>
          </Surface>
        </ResponsiveGrid>
      </FocusField>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not give one field competing anchors

Choose one panel for emphasis. Multiple marked Surfaces suppress atmosphere because the field has no unambiguous owner.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, FocusField, Surface} from '@trwhitney/component-library';

export function CompetingAnchors() {
  return (
    <AppearanceProvider appearance="light" accent="#2474ff">
      <FocusField isActive>
        <Surface focusFieldAnchor>Documents</Surface>
        <Surface focusFieldAnchor>Publication</Surface>
      </FocusField>
    </AppearanceProvider>
  );
}
```
