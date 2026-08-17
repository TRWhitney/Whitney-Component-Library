# Number Field Behavior

## Scope

This note records the upstream behavior that constrains the library-owned `NumberField` wrapper.
It is not a public API specification; the canonical consumer contract remains the generated
component guidance.

## Established behavior

- React Aria Components 1.20 owns localized partial text internally. Its public `onChange` emits a
  committed numeric value; it does not expose a semantic controlled-text callback. The wrapper
  therefore forwards numeric ownership and does not introduce parallel formatted-text state.
- Locale comes from `I18nProvider`, so the public wrapper requires an explicit locale and supplies a
  private provider. This keeps server rendering and hydration deterministic without exposing React
  Aria.
- Formatting, bounds, stepping, commit behavior, wheel behavior, validation, and controlled or
  uncontrolled ownership remain upstream behavior-bearing props. Labels, descriptions, errors,
  placeholders, and the visible input are library-owned composition.
- A named React Aria NumberField serializes through one hidden input containing the raw numeric
  value rather than the localized display string.
- React Aria applies `form` to that hidden input but discovers reset ownership through the visible
  input. For a NumberField outside its associated form, the wrapper must apply the same `form`
  identifier to both the root and the visible input. The visible input has no `name`, so this
  preserves external reset without duplicate form data.

## Sources

- [React Aria Components NumberField](https://react-aria.adobe.com/NumberField)
- [React Aria NumberField behavior](https://react-aria.adobe.com/NumberField/useNumberField)
- [React Aria forms guidance](https://react-aria.adobe.com/forms)
- [React Aria Components NumberField source](https://github.com/adobe/react-spectrum/blob/5ecb3333001313e83898cd07644227897e3bae1f/packages/react-aria-components/src/NumberField.tsx)
- [React Aria form reset source](https://github.com/adobe/react-spectrum/blob/5ecb3333001313e83898cd07644227897e3bae1f/packages/react-aria/src/utils/useFormReset.ts)
