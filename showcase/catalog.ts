export interface ShowcaseGroup {
  readonly components: readonly string[];
  readonly label: string;
}

export const showcaseGroups = [
  {label: 'Foundation', components: ['AppearanceProvider']},
  {
    label: 'Layout',
    components: [
      'Stack',
      'InlineGroup',
      'ResponsiveGrid',
      'Divider',
      'Surface',
      'Section',
      'ScrollRegion',
    ],
  },
  {
    label: 'Actions',
    components: ['Button', 'IconButton', 'Link', 'ToggleButton', 'ButtonGroup', 'Toolbar'],
  },
  {
    label: 'Fields',
    components: [
      'Field',
      'TextField',
      'TextArea',
      'NumberField',
      'SearchField',
      'FieldGroup',
      'FormSection',
    ],
  },
  {
    label: 'Choices',
    components: ['Checkbox', 'CheckboxGroup', 'RadioGroup', 'Switch', 'SegmentedControl'],
  },
  {label: 'Selection', components: ['Select', 'ComboBox']},
  {label: 'Ranges', components: ['Slider', 'RangeSlider']},
] as const satisfies readonly ShowcaseGroup[];

export const showcasedComponentNames = showcaseGroups.flatMap((group) => group.components);

export function componentAnchor(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}
