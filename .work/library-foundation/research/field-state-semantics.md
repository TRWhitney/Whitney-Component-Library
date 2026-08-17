# Field State Semantics

## Purpose

Constrain the custom `Field` extension seam so `isReadOnly` and `isRequired` are accepted only when
the rendered native element or ARIA role can represent the requested state. This evidence is also
relevant to later choice-control tickets.

## Accepted matrix

For the custom roles accepted by `Field`, `aria-readonly` is supported by checkbox, combobox,
listbox, searchbox, slider, spinbutton, switch, and textbox. `aria-required` is supported by the
same roles except slider. Button and radio support neither property directly; required radio state
belongs to its radiogroup.

For native controls, both `readonly` and `required` apply to text, search, telephone, URL, email,
password, date, month, week, time, datetime-local, and number inputs, and to textarea. `required`
also applies to checkbox, radio, and file inputs and to select. Neither state applies to button;
`readonly` does not apply to select. Hidden, range, color, submit, image, reset, and button input
types support neither state.

ARIA state support communicates semantics but does not implement custom-widget behavior. A
consumer-provided role must still honor its supplied state operationally.

## Primary sources

- [WAI-ARIA 1.2 state and property definitions](https://www.w3.org/TR/2023/REC-wai-aria-1.2-20230606/#state_prop_def)
- [WAI-ARIA 1.2 aria-readonly](https://www.w3.org/TR/2023/REC-wai-aria-1.2-20230606/#aria-readonly)
- [WAI-ARIA 1.2 aria-required](https://www.w3.org/TR/2023/REC-wai-aria-1.2-20230606/#aria-required)
- [HTML input attribute applicability table](https://html.spec.whatwg.org/dev/input.html#the-input-element)
- [HTML button element](https://html.spec.whatwg.org/multipage/form-elements.html#the-button-element)
- [HTML select required attribute](https://html.spec.whatwg.org/multipage/form-elements.html#attr-select-required)
- [HTML textarea element](https://html.spec.whatwg.org/multipage/form-elements.html#the-textarea-element)
