# Checkbox

Checkbox selects one independent optional value with native form behavior.

## Use for

- one independent option, acknowledgement, or form value can be selected, cleared, or partially represented

## Do not use for

- the setting applies immediately, choices are mutually exclusive, or several related values need one group label

## Prefer instead

- Use Switch for an immediately applied setting, CheckboxGroup for related multiple selection, RadioGroup or SegmentedControl for exclusive selection, and ToggleButton for a persistent action state.

## Composition and parts

- Render Checkbox inside AppearanceProvider; use CheckboxGroup when several values share one question and group-level validation.
- Checkbox includes one indicator, visible label, and optional support area.

## Preferred higher-level compositions

- Place independent Checkbox peers in FieldGroup or FormSection.

## Content

- Use a concise affirmative label that makes both checked and unchecked meaning clear; reserve description for durable consequences or scope.

## States

- Checked, unchecked, indeterminate, required, invalid, read-only, and disabled states do not change the control size.

## Control, events, validation, and forms

- Checkbox supports controlled or uncontrolled boolean selection. isIndeterminate changes its visual and accessible state but not the submitted checked value.
- onChange reports the complete selected boolean after each accepted interaction.
- Use isRequired for required acknowledgement and isInvalid with errorMessage for external invalidity; validationBehavior chooses native or ARIA validation presentation.
- name, value, and form use native checkbox serialization; only a checked control submits its value, and native form reset restores defaultSelected.

## Accessibility

- Checkbox renders one native checkbox with a persistent visible label and generated description, invalid, required, disabled, and read-only relationships.

## Keyboard, labeling, localization, and direction

- Space toggles the focused checkbox; Tab moves through enabled checkboxes.
- label is always visible; description and error text are referenced without consumer-authored ids.
- Supply labels, descriptions, errors, and option text in the application locale and allow them to wrap without truncation.
- Indicators, option copy, switch movement, and segmented rail placement follow inherited writing direction without changing option order.

## Appearance and responsive behavior

- Checkbox uses a compact rounded square indicator beside neutral label text; selected and indeterminate marks do not change row geometry.
- Choice rows fill their parent and option text wraps. Segmented options stay equal when their labels wrap on narrow screens.

## Accent, forced colors, and reduced motion

- Labels stay neutral. Selection indicators, focus outlines, and the segmented rail use the exact accent or a more saturated version of the same hue. Invalid controls use a thin danger outline that thickens on enabled hover.
- Forced-color mode maps boundaries, selected indicators, focus outlines, switch state, and the segmented rail to system colors without hiding native inputs.
- Reduced motion removes indicator, switch-thumb, hover, and segmented-rail transitions while retaining the final state.

## Examples

### Choose an optional result feature

Submit one optional result feature.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Checkbox} from '@trwhitney/component-library';

export function IncludeMeshChoice() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Checkbox defaultSelected label="Include mesh" name="features" value="mesh" />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not use a checkbox for an immediate setting

An immediately applied on/off setting is better communicated as a switch.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Checkbox} from '@trwhitney/component-library';

export function ImmediateSettingCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Checkbox label="Enable automatic synchronization" />
    </AppearanceProvider>
  );
}
```
