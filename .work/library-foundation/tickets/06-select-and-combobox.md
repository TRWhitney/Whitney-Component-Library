# 06 Select and Combobox

**What to build:** Select and combobox exports over a shared private collection model, including
static, dynamic, filterable, and asynchronous option behavior without exposing that private model.

**Blocked by:** [Field and Text Entry Family](04-field-and-text-entry-family.md),
[Choice Controls](05-choice-controls.md), [Action Family](03-action-family.md)

**Status:** ready

- [ ] Contracts distinguish bounded selection from editable autocomplete and direct agents to the
      simpler control whenever appropriate.
- [ ] Labeling, descriptions, validation, required, disabled, read-only, loading, empty, and error
      behavior is defined.
- [ ] Keyboard focus, typeahead, filtering, selection, dismissal, and focus restoration pass.
- [ ] Static, dynamic, and asynchronous collections preserve stable keys and selected values.
- [ ] Controlled and uncontrolled input and selection state cannot produce contradictory public
      combinations.
- [ ] Overlay placement and compact reflow remain reachable without viewport overflow.
- [ ] Form values and reset behavior are deterministic.
- [ ] Pointer, touch, keyboard, browser accessibility-tree, locale, directionality, SSR, hydration,
      and type checks pass.

## Accepted sources

- [Specification](../spec.md)
- [Behavior and Accessibility Foundation](../decisions/03-behavior-foundation.md)
- [Foundation Expansion Constraints](../decisions/07-foundation-expansion-constraints.md)

## Completion evidence

Pending implementation.
