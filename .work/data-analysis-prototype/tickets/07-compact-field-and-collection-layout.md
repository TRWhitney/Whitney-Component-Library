# 07 Support compact fields and collection rows

**What to build:** Provide a public compact layout for application fields and tree rows, including a way to omit unused field support space.

**Blocked by:** none.

**Status:** complete

## Evidence and client boundary

Energy desk's filter popover contains two Select fields without descriptions, errors, or pending messages. Each field still reserves a third grid row of at least 2.25rem plus the field gap. SearchField reserves the same support region, leaving a blank band before the tree. Reducing the surrounding Stack to its public tight gap only removes the app's additional separation.

Tree rows have a 2.75rem minimum content height plus vertical padding and fixed hierarchy space. There is no public row density setting. Compact IconButtons reduce action size but do not reduce the row's own spacing. Narrow browser panes also spend substantial width on both indentation and a blank leaf chevron slot.

CollectionFilterBar internally suppresses unused field support tracks, demonstrating an existing library composition for that case. Standalone fields cannot request the same behavior through their public props. Replacing the popover with another search-and-filter bar would duplicate search and change the requested interaction.

The app reduces its own pane padding, control gaps, and short-window spacing. It does not set internal field variables or target library selectors. Remaining field and row density belongs to the library.

The reported spacing is primarily inside the filter popover and the open Select menus, not between application panes. Select option rows have a 2.75rem minimum height plus vertical padding of 0.75 times the spacing token on each side. A menu containing simple one-line labels retains this size regardless of available window height. Reducing the outer app spacing does not address it.

## Acceptance

- [x] Select and ComboBox menus provide compact one-line option rows through a public density option. Keep description rows and touch targets usable, and avoid excess fixed padding when height is limited.
- [x] Consumers can choose compact field spacing through a documented public API.
- [x] Fields without supporting text can omit the unused support track. Description, validation, pending state, and accessible associations still work when present.
- [x] Preserve an explicit stable-height option where preventing form movement is useful.
- [x] Consumers can choose compact Tree rows while retaining readable labels, hierarchy, focus, selection, and usable nested action targets.
- [x] Narrow tree layouts budget indentation and leaf spacing so useful text does not wrap needlessly beside compact actions.
- [x] Verify a filter popover and a building browser in both short and tall windows, with keyboard and touch operation.
- [x] Update field and Tree contracts and rendered showcase examples.

## Accepted sources

- [Approved library fix specification](../spec.md).

- Whitney's screenshots of the filter popover and campus browser.
- [Field styles](../../../src/styles.css).
- [Tree contract](../../../docs/components/tree.md).
- [CollectionFilterBar contract](../../../docs/components/collection-filter-bar.md).
- [Prototype source](../../../prototypes/data-analysis/main.tsx).

## Implementation

`AppearanceProvider density="compact"` applies inherited density to fields, portaled Select/ComboBox options, and Tree rows. Comfortable remains the default. Compact options use a 32px border-box minimum with 3px vertical padding. Compact controls are 36px high; coarse-pointer controls and menu rows retain a 44px minimum. Tree rows also use border-box sizing and a smaller leaf chevron slot.

`reserveSupportSpace` is available on Field, TextField, TextArea, NumberField, SearchField, Select, and ComboBox. The default omits an empty support track. Real description, validation, and pending messages retain their accessible associations; explicit reservation leaves a two-line track and FieldGroup keeps shared row alignment.

The rendered `CompactApplicationExample` compares both densities, optional support reservation, validation, filter popovers, dropdown descriptions, and a searchable tree. The example is registered and final browser checks pass.

Focused verification: both supplied density tests failed before implementation. All 134 tests pass across `application-density`, `field-family`, `selection-family`, `styles`, and `appearance-provider`.

## Rework

The filter form uses the public relaxed Stack gap, providing 16px between controls without restoring empty support tracks. The compact application example demonstrates the same separation.

Popover now constrains its dialog and scrollable body to the positioned container's actual available height. It no longer relies on an absent CSS height variable. Short windows reduce header and body padding, while the body scrolls to keep Clear filters reachable. Chromium and Firefox checks cover 800px-wide windows at 220px, 300px, and 500px high.

## Final verification

Completed in the packed Energy desk application and rendered component showcase. See the [shared verification record](../verification.md) for browser checks, repository checks, package compatibility, and the acceptance mapping.
