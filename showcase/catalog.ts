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
    label: 'Application structure',
    components: ['PageHeader', 'SplitView'],
  },
  {
    label: 'Actions',
    components: ['Button', 'IconButton', 'Link', 'ToggleButton', 'ButtonGroup', 'Toolbar'],
  },
  {
    label: 'Navigation and disclosure',
    components: [
      'Tabs',
      'Breadcrumbs',
      'Pagination',
      'Disclosure',
      'Accordion',
      'CollapsibleNavigationPane',
    ],
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
  {
    label: 'Data and collections',
    components: [
      'List',
      'DescriptionList',
      'ListBox',
      'CardCollection',
      'CollectionFilterBar',
      'Table',
      'Tree',
    ],
  },
  {
    label: 'Charts',
    components: [
      'LineChart',
      'AreaChart',
      'ColumnChart',
      'BarChart',
      'PieChart',
      'DonutChart',
      'RadarChart',
      'Heatmap',
      'CartesianChart',
      'ScatterChart',
      'BubbleChart',
      'Histogram',
      'BoxPlot',
    ],
  },
  {
    label: 'Date and time',
    components: ['DateField', 'TimeField', 'DatePicker', 'DateRangePicker'],
  },
  {label: 'Ranges', components: ['Slider', 'RangeSlider']},
  {label: 'Files', components: ['FileTrigger', 'DropZone']},
  {
    label: 'Overlays',
    components: ['Dialog', 'AlertDialog', 'Drawer', 'Popover', 'Tooltip', 'Menu', 'ContextMenu'],
  },
  {
    label: 'Feedback',
    components: [
      'StatusIndicator',
      'Badge',
      'InlineAlert',
      'AlertBanner',
      'ProcessTracker',
      'ProgressBar',
      'Meter',
      'Spinner',
      'Skeleton',
      'EmptyState',
      'NotificationProvider',
    ],
  },
] as const satisfies readonly ShowcaseGroup[];

export const showcasedComponentNames = showcaseGroups.flatMap((group) => group.components);

export function componentAnchor(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}
