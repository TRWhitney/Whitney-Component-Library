# Accessible React Behavior Foundations

## Question

For a web-first React and TypeScript component library that owns static CSS and exposes a narrow
theme contract, which maintained foundation can supply accessible interaction behavior without
forcing its styling or public API on the library?

## Scope

Compared React Aria Components, Radix Primitives, Base UI, and direct ownership using current
official documentation and release records. Independent assistive-technology testing and bundle
benchmarks were outside scope.

## Conclusion

All three libraries are unstyled, actively maintained, and can be wrapped behind this library's
own public API. React Aria has the broadest documented behavioral scope, including complex
collections, selection, internationalized fields, date and time controls, and accessible drag and
drop. Radix offers mature compound primitives for a narrower catalog. Base UI offers a modern,
composable catalog broader than Radix in forms and popups, but lacks React Aria's general
collection, table, tree, calendar, and date or time coverage.

Direct ownership avoids an upstream API constraint but makes this project responsible for the
full keyboard, focus, pointer, selection, and assistive-technology behavior of every non-native
widget. The W3C explicitly notes that ARIA semantics do not supply keyboard behavior.

## Evidence

- [React Aria catalog and component-library guidance](https://react-aria.adobe.com/getting-started)
  document unstyled parts, state attributes, reusable wrappers, collections, complex fields,
  internationalization, interaction hooks, and AI-oriented documentation.
- [React Aria customization](https://react-aria.adobe.com/customization) documents its DOM
  constraints, contexts, slots, wrapper composition, and lower-level escape hatches.
- [React Aria v1.19.0](https://react-aria.adobe.com/releases/v1-19-0) shipped June 18, 2026.
- [React Aria v1.17.0](https://react-aria.adobe.com/releases/v1-17-0) documents consolidated
  packages and component subpath exports.
- [Radix's catalog](https://www.radix-ui.com/primitives/docs/overview/getting-started),
  [accessibility guidance](https://www.radix-ui.com/primitives/docs/overview/accessibility), and
  [composition guidance](https://www.radix-ui.com/primitives/docs/guides/composition) document its
  narrower unstyled primitive model and `asChild` contract.
- [Radix releases](https://www.radix-ui.com/primitives/docs/overview/releases) show active fixes
  through July 20, 2026.
- [Base UI's catalog](https://base-ui.com/llms.txt),
  [accessibility guidance](https://base-ui.com/react/overview/accessibility), and
  [composition guidance](https://base-ui.com/react/handbook/composition) document its unstyled,
  compound-part model.
- [Base UI releases](https://base-ui.com/react/overview/releases) show v1.0.0 on December 11, 2025
  and v1.7.0 on August 4, 2026.
- [W3C keyboard-interface guidance](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)
  explains the behavior authors must implement for ARIA widgets and composite focus management.

## Conflicts and Limitations

- Accessibility and assistive-technology coverage statements are vendor claims; no comparable
  independent cross-library test was identified in scope.
- The projects publish different packaging claims, but no comparable official bundle benchmark.
- Catalog presence does not prove equal maturity for each individual component.
- Base UI's SSR guidance is distributed across component notes and releases rather than one broad
  contract comparable to React Aria and Radix.

## Implications

- A foundation should remain private implementation detail. Public props should express this
  library's intended uses rather than extend or re-export upstream prop types.
- A narrow wrapper is necessary regardless of foundation; otherwise compound-part APIs recreate
  the variance this library exists to reduce.
- Choosing React Aria favors behavioral breadth and shared models for future higher-level
  constructs. Choosing Radix or Base UI favors a more DOM-adjacent internal assembly model while
  leaving more behavior for this library to synthesize.

## Remaining Judgment

Whether broad, unified behavior justifies React Aria's more developed internal collection and
composition model, or whether a narrower primitive foundation and more library-owned behavior is
preferred.
