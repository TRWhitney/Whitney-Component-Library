# 06 Select and Combobox

**What to build:** Select and combobox exports over a shared private collection model, including
static, dynamic, filterable, and asynchronous option behavior without exposing that private model.

**Blocked by:** [Field and Text Entry Family](04-field-and-text-entry-family.md),
[Choice Controls](05-choice-controls.md), [Action Family](03-action-family.md)

**Status:** complete

- [x] Contracts distinguish bounded selection from editable autocomplete and direct agents to the
      simpler control whenever appropriate.
- [x] Labeling, descriptions, validation, required, disabled, read-only, loading, empty, and error
      behavior is defined.
- [x] Keyboard focus, typeahead, filtering, selection, dismissal, and focus restoration pass.
- [x] Static, dynamic, and asynchronous collections preserve stable keys and selected values.
- [x] Controlled and uncontrolled input and selection state cannot produce contradictory public
      combinations.
- [x] Overlay placement and compact reflow remain reachable without viewport overflow.
- [x] Form values and reset behavior are deterministic.
- [x] Pointer, touch, keyboard, browser accessibility-tree, locale, directionality, SSR, hydration,
      and type checks pass.

## Accepted sources

- [Specification](../spec.md)
- [Behavior and Accessibility Foundation](../decisions/03-behavior-foundation.md)
- [Foundation Expansion Constraints](../decisions/07-foundation-expansion-constraints.md)

## Completion evidence

- `Select` and `ComboBox` expose narrow literal-key APIs over one private collection composition.
  Static client filtering uses locale-aware contains or starts-with matching; manual mode accepts
  dynamic and asynchronous option lists with explicit localized loading and empty copy.
- Focused runtime and public-type suites cover labels, validation, required, disabled, read-only,
  loading, empty, filtering, keyboard commit and dismissal, unambiguous loading/description
  relationships, stable dynamic and asynchronous values, boolean loading state, contradictory state
  ownership, native form serialization/reset, SSR, and hydration.
- `npm run check` passes formatting, lint, strict source types, 194 tests, generated contracts, and
  the TypeScript 5.9/6/7 declaration matrix. `npm run verify:package` passes packed SSR, hydration,
  types, external forms, and browser builds with React 18.3.1 and 19.2.8.
- Direct Chromium, Firefox, and WebKit operation and inspected screenshots cover compact collection
  overlays, keyboard filtering/selection, touch selection, Arabic RTL rail placement and logical
  padding, browser accessibility structure, and viewport containment without horizontal overflow.
  Chromium additionally covers light/wide, forced-color, and reduced-motion rendering. Temporary
  screenshots were removed after inspection.
- `npm run showcase:build`, `npm audit --audit-level=high`, `git diff --check`, and the source/test/
  tooling no-`Any` scan pass.
