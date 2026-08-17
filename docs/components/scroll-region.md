# ScrollRegion

ScrollRegion keeps bounded overflow content labeled, focusable, and reachable.

## Use for

- bounded history, source, logs, or dense content must remain reachable within a surrounding layout

## Do not use for

- ordinary page content can grow naturally or nested scrolling would hide essential actions and context

## Prefer instead

- Use normal document flow when content does not require a bounded viewport.

## Composition and parts

- Render ScrollRegion inside AppearanceProvider so its owned containment and focus tokens are available.
- Provide a concise label, one semantic size, and the overflow orientation that matches the content.
- ScrollRegion exposes one labeled, focusable overflow content region.

## Preferred higher-level compositions

- Place ScrollRegion inside Surface or Section when a bounded history or source view belongs to that named region.

## Content

- Keep essential controls visible when practical and do not hide the only path to an action inside nested scrolling.

## States

- Pointer or scroll activity reveals the native scrollbar thumb and resets its idle interval; the thumb fades after idle while focus keeps it available to keyboard users.

## Control, events, validation, and forms

- Size and overflow orientation are controlled by bounded props; native scrolling owns position and input behavior.
- Native overflow determines whether a scrollbar appears; the library changes only its transient thumb visibility.
- ScrollRegion exposes no callback events and owns only transient scrollbar visibility state; native scrolling remains the source of position and input behavior.
- The TypeScript API rejects arbitrary classes, inline styles, token values, and unsupported semantic options.
- The primitive does not submit values or participate in reset, validation, required, disabled, or read-only form state.

## Accessibility

- ScrollRegion is a labeled region and keyboard focus target so overflow remains reachable without a pointer; its native scrollbar stays visible while focus remains within the region.

## Keyboard, labeling, localization, and direction

- Tab moves focus to the region; native arrow, Page Up, Page Down, Home, and End scrolling remain available where supported.
- A concise required label names the region for assistive technology.
- The primitive renders consumer content without translating, reordering, or constructing localized sentences.
- Logical block and inline properties follow the inherited writing direction without a direction override.

## Appearance and responsive behavior

- ScrollRegion uses the library-owned subtle surface, border, and focus roles in both appearances.
- The region fills available inline size and preserves its semantic maximum block size at compact and wide widths.

## Accent, forced colors, and reduced motion

- ScrollRegion uses the derived focus accent only for keyboard focus and does not tint its content surface.
- Forced-color mode uses Canvas and CanvasText for containment and a continuously visible native scrollbar, plus Highlight for visible focus.
- Reduced motion removes the scrollbar fade transition while preserving the same activity, focus, idle visibility, and native scrolling behavior.

## Examples

### Bound solver history

Name a compact log region and preserve keyboard scrolling.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, ScrollRegion} from '@trwhitney/component-library';

export function SolverHistory() {
  return (
    <AppearanceProvider appearance="light" accent="#2474ff">
      <ScrollRegion label="Solver history" size="compact">
        <pre>Iteration 0284: residual 0.0025 K</pre>
      </ScrollRegion>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not replace ordinary page flow

Let primary page content grow when it does not need a bounded context.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, ScrollRegion} from '@trwhitney/component-library';

export function WholePageScroller() {
  return (
    <AppearanceProvider appearance="light" accent="#2474ff">
      <ScrollRegion label="Application" size="tall">
        <main>Primary application content</main>
      </ScrollRegion>
    </AppearanceProvider>
  );
}
```
