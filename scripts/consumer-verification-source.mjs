export function createConsumerVerificationSource(packageName) {
  return `
import React from 'react';
import {JSDOM} from 'jsdom';
import {renderToString} from 'react-dom/server';
import {
  AlertBanner,
  AlertDialog,
  AppearanceProvider,
  Badge,
  BoxPlot,
  Button,
  ButtonGroup,
  BubbleChart,
  CardCollection,
  CartesianChart,
  Checkbox,
  CheckboxGroup,
  ComboBox,
  CollectionFilterBar,
  DateField,
  DatePicker,
  DateRangePicker,
  DescriptionList,
  Dialog,
  Divider,
  Drawer,
  EmptyState,
  Field,
  FieldGroup,
  FormSection,
  IconButton,
  Histogram,
  InlineAlert,
  InlineGroup,
  Link,
  LineChart,
  List,
  ListBox,
  MarkdownEditor,
  Meter,
  NotificationProvider,
  NumberField,
  PageHeader,
  ProcessTracker,
  ProgressBar,
  RadioGroup,
  RangeSlider,
  ResponsiveGrid,
  ScrollRegion,
  SearchField,
  ScatterChart,
  Section,
  Select,
  SegmentedControl,
  Slider,
  Skeleton,
  Spinner,
  SplitView,
  Stack,
  StatusIndicator,
  Surface,
  Switch,
  Table,
  TextArea,
  TextField,
  TimeField,
  ToggleButton,
  Toolbar,
  Tree,
} from '${packageName}';

const manifest = (await import('${packageName}/manifest.json', {with: {type: 'json'}})).default;
if (!manifest.exports.some((component) => component.name === 'AppearanceProvider')) {
  throw new Error('Generated manifest is not available from its public subpath.');
}
for (const subpath of ['styles.css', 'agent-index.md']) {
  if (!import.meta.resolve('${packageName}/' + subpath)) {
    throw new Error('Unable to resolve public subpath ' + subpath + '.');
  }
}
try {
  await import('${packageName}/appearance/accent.js');
  throw new Error('An internal module was importable through the package boundary.');
} catch (error) {
  if (error?.code !== 'ERR_PACKAGE_PATH_NOT_EXPORTED') throw error;
}

const consoleMessages = [];
const recoverableErrors = [];
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
console.error = (...messages) => consoleMessages.push(messages);
console.warn = (...messages) => consoleMessages.push(messages);

const packedProcessStatusLabels = {
  active: 'Active',
  complete: 'Complete',
  failed: 'Failed',
  pending: 'Pending',
  warning: 'Needs review',
};

function PackedOperationalProof() {
  const configurationForm = React.useRef(null);
  const [operationName, setOperationName] = React.useState('');
  const [operationState, setOperationState] = React.useState('configure');
  const isInvalid = operationState === 'invalid';
  const isValidated = operationState === 'validated';
  const isReviewed = operationState === 'reviewed';
  const isMonitoring = operationState === 'monitoring';
  const stages = isMonitoring
    ? [
        {id: 'configure', label: 'Configuration valid', status: 'complete'},
        {id: 'review', label: 'Review accepted', status: 'complete'},
        {id: 'execute', label: 'Solve running', status: 'active'},
      ]
    : isReviewed || isValidated
      ? [
          {id: 'configure', label: 'Configuration valid', status: 'complete'},
          {
            id: 'review',
            label: isReviewed ? 'Review accepted' : 'Review configuration',
            status: isReviewed ? 'complete' : 'active',
          },
          {id: 'execute', label: 'Solve pending', status: 'pending'},
        ]
      : [
          {
            id: 'configure',
            label: isInvalid ? 'Configuration needs input' : 'Configure operation',
            status: isInvalid ? 'warning' : 'active',
          },
          {id: 'review', label: 'Review pending', status: 'pending'},
          {id: 'execute', label: 'Solve pending', status: 'pending'},
        ];
  const status = isMonitoring
    ? {label: 'Running', tone: 'warning'}
    : isReviewed
      ? {label: 'Reviewed', tone: 'success'}
      : isValidated
        ? {label: 'Ready for review', tone: 'neutral'}
      : isInvalid
        ? {label: 'Needs input', tone: 'danger'}
        : {label: 'Configuration', tone: 'neutral'};

  const validateConfiguration = () => {
    const nameControl = configurationForm.current?.elements.namedItem('operation-name');
    const nextOperationName = nameControl?.value.trim() ?? '';
    if (!nextOperationName) {
      setOperationState('invalid');
      return;
    }
    setOperationName(nextOperationName);
    setOperationState('validated');
  };

  return React.createElement(
    'section',
    {'data-packed-operation-state': operationState},
    React.createElement(
      Stack,
      {gap: 'regular'},
      React.createElement(PageHeader, {
        actions: React.createElement(
          Button,
          {
            isDisabled: !isReviewed,
            onPress: () => setOperationState('monitoring'),
            variant: 'primary',
          },
          'Run operation',
        ),
        description: 'Consumer-owned configuration, review, execution, and monitoring proof.',
        identity: 'RUN 0284',
        status: status.label,
        statusTone: status.tone,
        title: operationName || 'Untitled thermal solve',
      }),
      React.createElement(
        'form',
        {id: 'packed-operation-form', ref: configurationForm},
        React.createElement(
          FormSection,
          {title: 'Operation configuration'},
          React.createElement(
            FieldGroup,
            {legend: 'Required inputs'},
            React.createElement(TextField, {
              defaultValue: '',
              errorMessage: 'Enter an operation name before review.',
              isInvalid,
              isRequired: true,
              label: 'Operation name',
              name: 'operation-name',
            }),
            React.createElement(RadioGroup, {
              defaultValue: 'balanced',
              label: 'Solve mode',
              name: 'operation-mode',
              options: [
                {label: 'Conservative', value: 'conservative'},
                {label: 'Balanced', value: 'balanced'},
              ],
            }),
          ),
        ),
      ),
      React.createElement(
        ButtonGroup,
        {label: 'Operation review actions'},
        React.createElement(
          Button,
          {onPress: validateConfiguration, variant: 'secondary'},
          'Validate configuration',
        ),
        React.createElement(
          Dialog,
          {
            actions: ({close}) => React.createElement(
              Button,
              {
                onPress: () => {
                  setOperationState('reviewed');
                  close();
                },
                variant: 'primary',
              },
              'Accept review',
            ),
            closeLabel: 'Close operation review',
            description: 'Confirm the configured operation before execution.',
            title: 'Review operation',
            trigger: React.createElement(
              Button,
              {isDisabled: !isValidated},
              'Review configuration',
            ),
          },
          React.createElement(
            DescriptionList,
            {
              ariaLabel: 'Operation review details',
              emptyState: {description: 'Configure the operation first.', kind: 'no-data', title: 'No configuration'},
              items: [{description: operationName, id: 'name', term: 'Operation'}],
            },
          ),
        ),
      ),
      isInvalid
        ? React.createElement(
            InlineAlert,
            {title: 'Configuration incomplete', tone: 'danger'},
            'Add the required operation name before review.',
          )
        : null,
      React.createElement(ProcessTracker, {
        announcement: 'polite',
        ariaLabel: 'Operation stages',
        stages,
        statusLabels: packedProcessStatusLabels,
      }),
      React.createElement(StatusIndicator, {
        announcement: 'polite',
        label: status.label,
        tone: status.tone,
      }),
      React.createElement(ProgressBar, {
        completionLabel: 'Complete when all 25 boundary passes are solved.',
        isActive: isMonitoring,
        label: isMonitoring ? 'Solving boundary passes' : 'Solve progress',
        maxValue: 25,
        minValue: 0,
        value: isMonitoring ? 18 : 0,
        valueLabel: isMonitoring ? '18 of 25 passes' : 'Not started',
      }),
    ),
  );
}

const view = React.createElement(
  AppearanceProvider,
  {appearance: 'dark', accent: '#2474ff'},
  React.createElement(
    Surface,
    {variant: 'raised'},
    React.createElement(
      Section,
      {title: 'Thermal envelope'},
      React.createElement(
        Stack,
        {gap: 'regular'},
        React.createElement(
          ResponsiveGrid,
          {minimumItemWidth: 'compact', equalItems: true},
          React.createElement(
            Stack,
            {gap: 'tight'},
            React.createElement('strong', null, 'Solver'),
            React.createElement('span', null, 'Adaptive mesh'),
          ),
          React.createElement(
            Stack,
            {gap: 'tight'},
            React.createElement(
              InlineGroup,
              {equalItems: true},
              React.createElement('span', null, 'Ready'),
              React.createElement('span', null, 'Review'),
            ),
            React.createElement(Divider),
            React.createElement(
              ScrollRegion,
              {label: 'Run history', size: 'compact'},
              React.createElement('span', null, 'Iteration 0284'),
            ),
          ),
        ),
        React.createElement(Link, {href: '/runs/0284'}, 'Open run'),
        React.createElement('form', {id: 'packed-choice-form'}),
        React.createElement(
          FormSection,
          {title: 'Solver setup'},
          React.createElement(
            FieldGroup,
            {legend: 'Boundary inputs'},
            React.createElement(TextField, {
              label: 'Run name',
              description: 'Visible in reports.',
              defaultValue: 'North chamber',
            }),
            React.createElement(NumberField, {
              label: 'Tolerance',
              locale: 'en-US',
              defaultValue: 0.0025,
              step: 0.0005,
            }),
            React.createElement(SearchField, {
              label: 'Search runs',
              clearLabel: 'Clear query',
              defaultValue: 'thermal',
            }),
            React.createElement(MarkdownEditor, {
              defaultValue: '# Packed Markdown',
              label: 'Packed Markdown source',
              name: 'markdown',
              mode: 'source',
            }),
            React.createElement(MarkdownEditor, {
              defaultValue: '# Live Markdown',
              label: 'Packed Markdown Live Preview',
              renderToolbar: (controls) => React.createElement(Toolbar, {label: 'Markdown formatting'},
                React.createElement(Button, {isDisabled: !controls.canExecute('bold'), onPress: () => controls.execute('bold')}, 'Bold')),
            }),
            React.createElement(MarkdownEditor, {
              defaultValue: '# Packed reading\\n\\nA note[^one].\\n\\n[^one]: Packed evidence.\\n\\n[[Packed note]]',
              label: 'Packed Markdown preview',
              mode: 'preview',
              wikiLinks: {resolve: (target) => ({href: '/notes/' + encodeURIComponent(target)}), onNavigate: () => {}},
            }),
            React.createElement(TextArea, {
              label: 'Notes',
              defaultValue: 'Review boundary conditions.',
              rows: 3,
            }),
            React.createElement(
              Field,
              {label: 'Queue', description: 'Choose compute priority.'},
              (controlProps) => React.createElement(
                'select',
                controlProps,
                React.createElement('option', {value: 'standard'}, 'Standard'),
              ),
            ),
          ),
        ),
        React.createElement(
          ButtonGroup,
          {label: 'Profile actions', equalItems: true},
          React.createElement(Button, {variant: 'secondary'}, 'Review conditions'),
          React.createElement(Button, {variant: 'primary', type: 'submit'}, 'Run profile'),
        ),
        React.createElement(Checkbox, {
          defaultSelected: true,
          form: 'packed-choice-form',
          label: 'Include mesh',
          name: 'features',
          value: 'mesh',
        }),
        React.createElement(CheckboxGroup, {
          defaultValue: ['thermal'],
          form: 'packed-choice-form',
          label: 'Result layers',
          name: 'layers',
          options: [
            {label: 'Thermal', value: 'thermal'},
            {label: 'Pressure', value: 'pressure'},
          ],
        }),
        React.createElement(RadioGroup, {
          defaultValue: 'balanced',
          form: 'packed-choice-form',
          label: 'Run mode',
          name: 'mode',
          options: [
            {label: 'Conservative', value: 'conservative'},
            {label: 'Balanced', value: 'balanced'},
          ],
        }),
        React.createElement(Switch, {
          defaultSelected: true,
          form: 'packed-choice-form',
          label: 'Pin result',
          name: 'pin',
          value: 'yes',
        }),
        React.createElement(SegmentedControl, {
          defaultValue: 'balanced',
          form: 'packed-choice-form',
          label: 'Display density',
          name: 'density',
          options: [
            {label: 'Compact', value: 'compact'},
            {label: 'Balanced', value: 'balanced'},
          ],
        }),
        React.createElement(Select, {
          defaultValue: 'balanced',
          emptyMessage: 'No modes',
          form: 'packed-choice-form',
          label: 'Bounded mode',
          name: 'select-mode',
          options: [
            {label: 'Conservative', value: 'conservative'},
            {label: 'Balanced', value: 'balanced'},
          ],
        }),
        React.createElement(ComboBox, {
          defaultValue: 'balanced',
          emptyMessage: 'No matching modes',
          form: 'packed-choice-form',
          label: 'Filter mode',
          name: 'combo-mode',
          options: [
            {label: 'Conservative', value: 'conservative'},
            {label: 'Balanced', value: 'balanced'},
          ],
        }),
        React.createElement(List, {
          ariaLabel: 'Run sequence',
          emptyState: {description: 'Create a run first.', kind: 'no-data', title: 'No runs'},
          items: [{id: 'prepare', primary: 'Prepare mesh', secondary: 'Complete'}],
          marker: 'number',
        }),
        React.createElement(DescriptionList, {
          ariaLabel: 'Run details',
          emptyState: {description: 'Select a run first.', kind: 'no-data', title: 'No details'},
          items: [{description: 'RUN 0284', id: 'run', term: 'Run'}],
        }),
        React.createElement(ListBox, {
          ariaLabel: 'Compared runs',
          defaultSelectedId: 'run-284',
          emptyState: {description: 'Try another query.', kind: 'no-results', title: 'No matches'},
          items: [
            {id: 'run-284', label: 'RUN 0284'},
            {id: 'run-283', label: 'RUN 0283'},
          ],
          selectionMode: 'single',
        }),
        React.createElement(CardCollection, {
          ariaLabel: 'Recent runs',
          emptyState: {description: 'Create a run first.', kind: 'no-data', title: 'No runs'},
          headingLevel: 3,
          items: [{description: 'Complete', id: 'run-284', title: 'RUN 0284'}],
          selectionMode: 'none',
        }),
        React.createElement(CollectionFilterBar, {
          appliedFiltersLabel: 'Applied run filters',
          ariaLabel: 'Filter packed runs',
          clearAllLabel: 'Clear all filters',
          defaultQuery: {
            filters: [{filterId: 'status', value: 'complete'}],
            text: 'thermal',
          },
          filters: [
            {
              emptyMessage: 'No statuses',
              id: 'status',
              label: 'Status',
              options: [
                {label: 'Complete', value: 'complete'},
                {label: 'Review', value: 'review'},
              ],
              placeholder: 'Any status',
            },
          ],
          getFilterSummary: (filterLabel, optionLabel) => filterLabel + ': ' + optionLabel,
          getRemoveLabel: (summary) => 'Remove ' + summary,
          getSearchSummary: (text) => 'Search: ' + text,
          searchClearLabel: 'Clear run search',
          searchLabel: 'Search packed runs',
        }),
        React.createElement(Table, {
          ariaLabel: 'Packed run comparison',
          columns: [
            {allowsSorting: true, id: 'run', isRowHeader: true, label: 'Run'},
            {id: 'status', label: 'Status'},
            {id: 'actions', kind: 'actions', label: 'Actions'},
          ],
          emptyState: {description: 'Create a run first.', kind: 'no-data', title: 'No runs'},
          onSortChange: () => undefined,
          rows: [
            {
              cells: {
                actions: React.createElement('button', {type: 'button'}, 'Open packed run'),
                run: 'RUN 0284',
                status: 'Complete',
              },
              id: 'run-284',
              textValue: 'RUN 0284 Complete',
            },
          ],
          selectionMode: 'none',
        }),
        React.createElement(Tree, {
          ariaLabel: 'Packed study tree',
          collapseLabel: 'Collapse study',
          defaultExpandedIds: ['thermal'],
          emptyState: {description: 'Create a study first.', kind: 'no-data', title: 'No studies'},
          expandLabel: 'Expand study',
          items: [
            {
              children: [{id: 'thermal-run', label: 'RUN 0284'}],
              id: 'thermal',
              label: 'Thermal study',
            },
          ],
          selectionMode: 'none',
        }),
        React.createElement(LineChart, {
          data: [
            {demand: 42, month: 'Jan'},
            {demand: 51, month: 'Feb'},
          ],
          dataTableLabel: 'Packed thermal demand data',
          description: 'Packed monthly thermal demand.',
          emptyState: {description: 'Choose a recorded period.', title: 'No demand data'},
          invalidData: {description: 'Correct invalid demand records.', title: 'Invalid demand data'},
          series: [{accessor: 'demand', id: 'demand', label: 'Demand', showPoints: true}],
          title: 'Packed thermal demand',
          xAxis: {accessor: 'month', label: 'Month', scale: {type: 'categorical'}},
          yAxis: {label: 'Energy', scale: {type: 'linear'}, unit: 'MWh'},
        }),
        React.createElement(CartesianChart, {
          data: [{month: 'Jan', measured: 7, low: 3, high: 10}, {month: 'Feb', measured: 12, low: 5, high: 11}],
          title: 'Packed temperature range', description: 'Measured temperatures and supplied limits.',
          dataTableLabel: 'Packed range readings',
          emptyState: {title: 'No readings', description: 'Add readings.'},
          invalidData: {title: 'Invalid readings', description: 'Check bounds.'},
          legend: {label: 'Temperature series'},
          series: [{id: 'measured', label: 'Measured', kind: 'line', accessor: 'measured'}, {id: 'expected', label: 'Expected', kind: 'range', lowerAccessor: 'low', upperAccessor: 'high'}],
          xAxis: {label: 'Month', accessor: 'month', scale: {type: 'categorical'}},
          yAxis: {label: 'Temperature', scale: {type: 'linear'}},
        }),
        React.createElement(ScatterChart, {
          data: [
            {id: 'north', label: 'North loop', x: 18, y: 28},
            {id: 'south', label: 'South loop', x: 56, y: 68},
          ],
          dataTableLabel: 'Packed scatter data',
          description: 'Packed temperature and demand observations.',
          emptyState: {description: 'Add observations.', title: 'No observations'},
          idAccessor: 'id',
          invalidData: {description: 'Correct observations.', title: 'Invalid observations'},
          labelAccessor: 'label',
          series: [{id: 'observations', label: 'Observations'}],
          title: 'Packed temperature and demand',
          legend: {label: 'Demand series'},
          line: {id: 'target', label: 'Target', data: [{key: 'a', name: 'Cool', x: 12, y: 20}, {key: 'b', name: 'Warm', x: 60, y: 75}], idAccessor: 'key', labelAccessor: 'name', xAccessor: 'x', yAccessor: 'y'},
          xAxis: {accessor: 'x', label: 'Temperature', scale: {type: 'linear'}, unit: '°F'},
          yAxis: {accessor: 'y', label: 'Demand', scale: {type: 'linear'}, unit: 'MWh'},
        }),
        React.createElement(BubbleChart, {
          data: [
            {id: 'north', label: 'North loop', stored: 25, x: 18, y: 28},
            {id: 'south', label: 'South loop', stored: 100, x: 56, y: 68},
          ],
          dataTableLabel: 'Packed bubble data',
          description: 'Packed stored-energy observations.',
          emptyState: {description: 'Add observations.', title: 'No observations'},
          idAccessor: 'id',
          invalidData: {description: 'Correct observations.', title: 'Invalid observations'},
          labelAccessor: 'label',
          magnitude: {accessor: 'stored', label: 'Stored energy', unit: 'MWh'},
          series: [{id: 'observations', label: 'Observations'}],
          title: 'Packed stored energy',
          xAxis: {accessor: 'x', label: 'Temperature', scale: {type: 'linear'}, unit: '°F'},
          yAxis: {accessor: 'y', label: 'Demand', scale: {type: 'linear'}, unit: 'MWh'},
        }),
        React.createElement(Histogram, {
          data: [{latency: 8}, {latency: 21}, {latency: 44}],
          dataTableLabel: 'Packed histogram data',
          description: 'Packed restart-latency distribution.',
          distribution: {accessor: 'latency', kind: 'raw', thresholds: [0, 20, 40, 60]},
          emptyState: {description: 'Add observations.', title: 'No observations'},
          invalidData: {description: 'Correct observations.', title: 'Invalid observations'},
          title: 'Packed restart latency',
          xAxis: {label: 'Restart latency', scale: {domain: [0, 60], type: 'linear'}, unit: 'ms'},
          yAxis: {label: 'Restarts', scale: {type: 'linear'}},
        }),
        React.createElement(BoxPlot, {
          data: [
            {group: 'north', value: 2},
            {group: 'north', value: 4},
            {group: 'north', value: 5},
          ],
          dataTableLabel: 'Packed box plot data',
          description: 'Packed recovery distribution.',
          distribution: {kind: 'raw', valueAccessor: 'value'},
          emptyState: {description: 'Add observations.', title: 'No observations'},
          groupAccessor: 'group',
          groups: [{id: 'north', label: 'North loop'}],
          invalidData: {description: 'Correct observations.', title: 'Invalid observations'},
          title: 'Packed recovery distribution',
          xAxis: {label: 'Loop'},
          yAxis: {label: 'Recovery', scale: {type: 'linear'}, unit: 'minutes'},
        }),
        React.createElement(PackedOperationalProof),
        React.createElement(SplitView, {
          ariaLabel: 'Packed run workspace',
          collapsePrimaryLabel: 'Hide packed configuration',
          collapseSecondaryLabel: 'Hide packed inspector',
          primary: 'Packed configuration',
          primaryLabel: 'Packed configuration pane',
          resizeLabel: 'Resize packed inspector',
          restorePrimaryLabel: 'Show packed configuration',
          restoreSecondaryLabel: 'Show packed inspector',
          secondary: 'Packed inspector',
          secondaryLabel: 'Packed inspector pane',
        }),
        React.createElement(DateField, {
          calendar: 'gregory',
          defaultValue: {year: 2026, month: 8, day: 20},
          form: 'packed-choice-form',
          label: 'Run date',
          locale: 'en-US',
          name: 'run-date',
        }),
        React.createElement(TimeField, {
          defaultValue: {hour: 14, minute: 30, second: 0},
          form: 'packed-choice-form',
          granularity: 'minute',
          hourCycle: 24,
          label: 'Run time',
          locale: 'en-US',
          name: 'run-time',
        }),
        React.createElement(DatePicker, {
          calendar: 'japanese',
          calendarButtonLabel: 'Choose review date',
          defaultValue: {year: 2026, month: 8, day: 21},
          form: 'packed-choice-form',
          label: 'Review date',
          locale: 'ja-JP',
          name: 'review-date',
          placeholderValue: {year: 2026, month: 8, day: 20},
        }),
        React.createElement(DateRangePicker, {
          calendar: 'gregory',
          calendarButtonLabel: 'Choose review window',
          defaultValue: {
            start: {year: 2026, month: 8, day: 20},
            end: {year: 2026, month: 8, day: 24},
          },
          form: 'packed-choice-form',
          label: 'Review dates',
          locale: 'en-US',
          names: ['review-start', 'review-end'],
          placeholderValue: {year: 2026, month: 8, day: 20},
        }),
        React.createElement(Slider, {
          defaultValue: 0.4,
          form: 'packed-choice-form',
          formatOptions: {style: 'percent'},
          label: 'Confidence',
          locale: 'en-US',
          maxValue: 1,
          minValue: 0,
          name: 'confidence',
          step: 0.05,
        }),
        React.createElement(RangeSlider, {
          defaultValue: [20, 80],
          form: 'packed-choice-form',
          label: 'Review window',
          locale: 'en-US',
          maxValue: 100,
          minValue: 0,
          names: ['window-start', 'window-end'],
          step: 5,
          thumbLabels: ['Window start', 'Window end'],
        }),
        React.createElement(Badge, {tone: 'accent'}, 'RUN 0284'),
        React.createElement(
          InlineAlert,
          {title: 'Boundary review', tone: 'warning'},
          'Check the north wall coefficient.',
        ),
        React.createElement(
          AlertBanner,
          {title: 'Solver connected', tone: 'success'},
          'Runs can start.',
        ),
        React.createElement(ProgressBar, {
          completionLabel: 'Complete after convergence.',
          isActive: true,
          isIndeterminate: true,
          label: 'Preparing solver',
          statusLabel: 'Estimating remaining work',
        }),
        React.createElement(ProgressBar, {
          completionLabel: 'Complete when all 25 boundary passes are solved.',
          isActive: false,
          label: 'Boundary solve paused',
          maxValue: 25,
          minValue: 0,
          value: 18,
          valueLabel: '18 of 25 passes',
        }),
        React.createElement(Meter, {
          label: 'Thermal load',
          maxValue: 100,
          minValue: 0,
          thresholds: [
            {label: 'Review begins', tone: 'warning', value: 70, valueLabel: '70 kilowatts'},
            {label: 'Unsafe begins', tone: 'danger', value: 90, valueLabel: '90 kilowatts'},
          ],
          tone: 'warning',
          value: 76,
          valueLabel: '76 kilowatts',
        }),
        React.createElement(Spinner, {isActive: true, label: 'Preparing solver'}),
        React.createElement(Skeleton, {lines: 2, shape: 'text', width: 'three-quarters'}),
        React.createElement(EmptyState, {
          description: 'Add a boundary condition before running.',
          kind: 'no-data',
          title: 'No boundary conditions',
        }),
        React.createElement(
          NotificationProvider,
          {dismissLabel: 'Dismiss notification', label: 'Packed notifications'},
          ({notify}) => React.createElement(
            'button',
            {
              id: 'packed-notification-trigger',
              onClick: () => notify({
                actionLabel: 'Open history',
                onAction: () => undefined,
                title: 'Export ready',
                tone: 'success',
              }),
              type: 'button',
            },
            'Show notification',
          ),
        ),
        React.createElement(
          Dialog,
          {
            actions: ({close}) => React.createElement(Button, {onPress: close}, 'Done'),
            closeLabel: 'Close packed dialog',
            description: 'Review the packed component output.',
            title: 'Packed dialog',
            trigger: React.createElement(
              Button,
              null,
              'Open packed dialog',
            ),
          },
          React.createElement('p', null, 'Packed dialog body'),
        ),
        React.createElement(AlertDialog, {
          actionKind: 'destructive',
          cancelLabel: 'Keep packed run',
          confirmLabel: 'Delete packed run',
          description: 'This permanently removes the packed run.',
          onConfirm: () => {},
          title: 'Delete packed run?',
          trigger: React.createElement(
            Button,
            {variant: 'danger'},
            'Delete packed run',
          ),
        }),
        React.createElement(
          Drawer,
          {
            closeLabel: 'Close packed drawer',
            description: 'Inspect packed solver output.',
            placement: 'end',
            title: 'Packed drawer',
            trigger: React.createElement(
              Button,
              null,
              'Open packed drawer',
            ),
          },
          React.createElement('p', null, 'Packed drawer body'),
        ),
        React.createElement(
          Toolbar,
          {label: 'Inspector commands'},
          React.createElement(
            IconButton,
            {label: 'More actions', variant: 'quiet'},
            React.createElement('span', {'aria-hidden': true}, '•••'),
          ),
          React.createElement(
            ToggleButton,
            {defaultSelected: true, variant: 'quiet'},
            'Pin inspector',
          ),
        ),
      ),
    ),
  ),
);
const serverMarkup = renderToString(view);
const dom = new JSDOM('<div id="root">' + serverMarkup + '</div>', {pretendToBeVisual: true});
// JSDOM has no text layout; browser checks own real caret and document geometry.
dom.window.Range.prototype.getClientRects = () => Object.assign([], {item: () => null});
dom.window.Range.prototype.getBoundingClientRect = () => new dom.window.DOMRect();
globalThis.window = dom.window;
globalThis.Window = dom.window.Window;
globalThis.document = dom.window.document;
globalThis.CustomEvent = dom.window.CustomEvent;
globalThis.CSS = {escape: (value) => value.replace(/[^a-zA-Z0-9_-]/g, '\\$&')};
globalThis.Element = dom.window.Element;
globalThis.Event = dom.window.Event;
globalThis.FocusEvent = dom.window.FocusEvent;
globalThis.HTMLButtonElement = dom.window.HTMLButtonElement;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.HTMLInputElement = dom.window.HTMLInputElement;
globalThis.HTMLSelectElement = dom.window.HTMLSelectElement;
globalThis.HTMLTemplateElement = dom.window.HTMLTemplateElement;
globalThis.HTMLTextAreaElement = dom.window.HTMLTextAreaElement;
globalThis.InputEvent = dom.window.InputEvent;
globalThis.KeyboardEvent = dom.window.KeyboardEvent;
globalThis.MouseEvent = dom.window.MouseEvent;
globalThis.MutationObserver = dom.window.MutationObserver;
globalThis.Node = dom.window.Node;
globalThis.NodeFilter = dom.window.NodeFilter;
globalThis.SVGElement = dom.window.SVGElement;
globalThis.requestAnimationFrame = (callback) => setTimeout(() => callback(performance.now()), 0);
globalThis.cancelAnimationFrame = (handle) => clearTimeout(handle);
Object.defineProperty(globalThis, 'navigator', {value: dom.window.navigator, configurable: true});

// React Aria installs these browser-only template hooks when its client bundle is evaluated.
// This single-process SSR fixture imports the package before JSDOM exists, so reproduce that
// client initialization before hydration rather than testing a module lifecycle browsers cannot have.
Object.defineProperties(globalThis.HTMLTemplateElement.prototype, {
  firstChild: {
    configurable: true,
    enumerable: true,
    get() { return this.content.firstChild; },
  },
  appendChild: {
    configurable: true,
    enumerable: true,
    value(node) { return this.content.appendChild(node); },
  },
  removeChild: {
    configurable: true,
    enumerable: true,
    value(node) { return this.content.removeChild(node); },
  },
  insertBefore: {
    configurable: true,
    enumerable: true,
    value(node, child) { return this.content.insertBefore(node, child); },
  },
});

const {hydrateRoot} = await import('react-dom/client');
hydrateRoot(document.getElementById('root'), view, {
  onRecoverableError(error) { recoverableErrors.push(error); },
});
await new Promise((resolve) => setTimeout(resolve, 25));
const packedSource = document.querySelector('[data-wcl-markdown-source] [role="textbox"]');
if (!packedSource || packedSource.textContent !== '# Packed Markdown') {
  throw new Error('Packed Markdown source did not hydrate into the labeled editor.');
}
if (!document.querySelector('[data-mode="live-preview"] [role="heading"]')) {
  throw new Error('Packed Markdown Live Preview did not hydrate its rendered heading.');
}
if (!document.querySelector('[data-wcl-markdown-preview] [data-footnotes]')) {
  throw new Error('Packed Markdown preview did not render footnotes.');
}
const findPackedButton = (label) =>
  [...document.querySelectorAll('[data-wcl-button]')].find(
    (button) => button.textContent === label,
  );
const packedOperation = document.querySelector('[data-packed-operation-state]');
const packedRunOperation = findPackedButton('Run operation');
if (
  packedOperation?.getAttribute('data-packed-operation-state') !== 'configure' ||
  !packedRunOperation?.hasAttribute('disabled')
) {
  throw new Error('Packed operational proof did not begin with execution blocked.');
}
findPackedButton('Validate configuration')?.click();
await new Promise((resolve) => setTimeout(resolve, 25));
if (
  packedOperation.getAttribute('data-packed-operation-state') !== 'invalid' ||
  !packedOperation.querySelector('[data-wcl-inline-alert][data-tone="danger"]') ||
  !packedRunOperation.hasAttribute('disabled') ||
  document.querySelector('[data-kind="dialog"] [role="dialog"]')
) {
  throw new Error('Packed operational proof accepted an invalid configuration.');
}
const packedOperationName = packedOperation.querySelector('input[name="operation-name"]');
const setPackedInputValue = Object.getOwnPropertyDescriptor(
  dom.window.HTMLInputElement.prototype,
  'value',
)?.set;
setPackedInputValue?.call(packedOperationName, 'North chamber');
packedOperationName?.dispatchEvent(new dom.window.Event('input', {bubbles: true}));
await new Promise((resolve) => setTimeout(resolve, 25));
if (
  packedOperationName?.value !== 'North chamber' ||
  packedOperation.getAttribute('data-packed-operation-state') !== 'invalid'
) {
  throw new Error('Packed operational proof did not accept corrected field input.');
}
findPackedButton('Validate configuration')?.click();
await new Promise((resolve) => setTimeout(resolve, 25));
if (
  packedOperation.getAttribute('data-packed-operation-state') !== 'validated' ||
  !packedOperation.querySelector('[data-wcl-page-header]')?.textContent?.includes('North chamber')
) {
  throw new Error('Packed operational proof did not validate corrected configuration.');
}
findPackedButton('Review configuration')?.click();
await new Promise((resolve) => setTimeout(resolve, 25));
const packedOperationDialog = document.querySelector(
  '[data-kind="dialog"] [role="dialog"]',
);
if (!packedOperationDialog?.textContent?.includes('Review operation')) {
  throw new Error('Packed operational proof did not open its review dialog.');
}
if (!packedOperationDialog.textContent.includes('North chamber')) {
  throw new Error('Packed operational proof did not carry configuration into review.');
}
findPackedButton('Accept review')?.click();
await new Promise((resolve) => setTimeout(resolve, 25));
if (
  packedOperation.getAttribute('data-packed-operation-state') !== 'reviewed' ||
  packedRunOperation.hasAttribute('disabled')
) {
  throw new Error('Packed operational proof did not preserve accepted review state.');
}
packedRunOperation.click();
await new Promise((resolve) => setTimeout(resolve, 25));
if (
  packedOperation.getAttribute('data-packed-operation-state') !== 'monitoring' ||
  !packedOperation.querySelector('[data-wcl-page-header-status]')?.textContent?.includes('Running') ||
  !packedOperation.querySelector('[data-wcl-status-indicator]')?.textContent?.includes('Running') ||
  packedOperation.querySelector('[data-wcl-progress-bar]')?.getAttribute('aria-valuenow') !== '18' ||
  !packedOperation
    .querySelector('[data-wcl-process-stage][aria-current="step"]')
    ?.textContent?.includes('Solve running')
) {
  throw new Error('Packed operational proof did not enter monitoring coherently.');
}
document
  .getElementById('packed-notification-trigger')
  ?.dispatchEvent(new dom.window.MouseEvent('click', {bubbles: true}));
await new Promise((resolve) => setTimeout(resolve, 25));
let packedOverlaySemantics = true;
const packedDialogTrigger = findPackedButton('Open packed dialog');
packedDialogTrigger?.click();
await new Promise((resolve) => setTimeout(resolve, 25));
const packedDialog = document.querySelector('[data-wcl-overlay][data-kind="dialog"] [role="dialog"]');
if (
  packedDialog?.getAttribute('role') !== 'dialog' ||
  !packedDialog.getAttribute('aria-labelledby') ||
  !packedDialog.getAttribute('aria-describedby')
) {
  packedOverlaySemantics = false;
}
document.querySelector('[aria-label="Close packed dialog"]')?.click();
await new Promise((resolve) => setTimeout(resolve, 25));
const packedAlertDialogTrigger = findPackedButton('Delete packed run');
packedAlertDialogTrigger?.click();
await new Promise((resolve) => setTimeout(resolve, 25));
const packedAlertDialog = document.querySelector(
  '[data-wcl-overlay][data-kind="alert-dialog"] [role="alertdialog"]',
);
if (
  packedAlertDialog?.getAttribute('role') !== 'alertdialog' ||
  packedAlertDialog.closest('[data-wcl-overlay]')?.getAttribute('data-action-kind') !== 'destructive'
) {
  packedOverlaySemantics = false;
}
document.querySelector('[data-kind="alert-dialog"] [data-variant="secondary"]')?.click();
await new Promise((resolve) => setTimeout(resolve, 25));
const packedDrawerTrigger = findPackedButton('Open packed drawer');
packedDrawerTrigger?.click();
await new Promise((resolve) => setTimeout(resolve, 25));
const packedDrawer = document.querySelector('[data-wcl-overlay][data-kind="drawer"] [role="dialog"]');
if (
  packedDrawer?.getAttribute('role') !== 'dialog' ||
  packedDrawer.closest('[data-wcl-overlay]')?.getAttribute('data-placement') !== 'end'
) {
  packedOverlaySemantics = false;
}
document.querySelector('[aria-label="Close packed drawer"]')?.click();
await new Promise((resolve) => setTimeout(resolve, 25));
console.error = originalConsoleError;
console.warn = originalConsoleWarn;

if (consoleMessages.length > 0 || recoverableErrors.length > 0) {
  const details = [
    ...consoleMessages.map((messages) =>
      messages.map((message) => message?.stack ?? String(message)).join(' '),
    ),
    ...recoverableErrors.map((error) => error?.stack ?? String(error)),
  ].join('\\n');
  throw new Error('SSR or hydration emitted warnings or recoverable errors.\\n' + details);
}
if (!packedOverlaySemantics) {
  throw new Error('Packed overlays did not preserve modal semantics.');
}
if (!document.querySelector('[data-wcl-responsive-grid]')?.textContent?.includes('Adaptive mesh')) {
  throw new Error('Packed layout primitives did not hydrate their server-rendered content.');
}
if (document.querySelector('[aria-label="Run history"]')?.getAttribute('tabindex') !== '0') {
  throw new Error('Packed scroll region is not a labeled keyboard focus target.');
}
if (!document.querySelector('[data-wcl-toolbar]')) {
  throw new Error('Packed toolbar did not render its public marker.');
}
if (
  !document.querySelector('[data-wcl-line-chart] [data-wcl-chart-line]') ||
  document.querySelector('[aria-label="Packed thermal demand data"]')?.textContent?.includes('51') !== true
) {
  throw new Error('Packed Cartesian chart did not preserve its plotted and tabular meaning.');
}
if (
  !document.querySelector('[data-wcl-scatter-chart] [data-wcl-chart-line]') ||
  !document.querySelector('[data-wcl-cartesian-chart] [data-wcl-chart-area]') ||
  !document.querySelector('[data-wcl-scatter-chart] [data-wcl-statistical-point]') ||
  !document.querySelector('[data-wcl-bubble-chart] [data-wcl-statistical-point]') ||
  !document.querySelector('[data-wcl-histogram] [data-wcl-histogram-bin]') ||
  !document.querySelector('[data-wcl-box-plot] [data-wcl-box-quartile]') ||
  document.querySelector('[aria-label="Packed scatter data"]')?.textContent?.includes('South loop') !== true ||
  document.querySelector('[aria-label="Packed bubble data"]')?.textContent?.includes('100') !== true ||
  document.querySelector('[aria-label="Packed histogram data"]')?.textContent?.includes('count') !== true ||
  document.querySelector('[aria-label="Packed box plot data"]')?.textContent?.includes('North loop') !== true
) {
  throw new Error('Packed statistical charts did not preserve their plotted and tabular meaning.');
}
if (
  document.querySelector('[data-wcl-process-stage][aria-current="step"]')?.textContent?.includes(
    'Solve running',
  ) !== true
) {
  throw new Error('Packed ProcessTracker did not preserve the active staged relationship.');
}
if (document.querySelector('[data-wcl-toggle-button]')?.getAttribute('aria-pressed') !== 'true') {
  throw new Error('Packed toggle button did not preserve selected semantics.');
}
if (document.querySelector('[data-wcl-button][type="submit"]')?.textContent !== 'Run profile') {
  throw new Error('Packed button did not preserve explicit native form behavior.');
}
if (!document.querySelector('[data-wcl-number-field]')) {
  throw new Error('Packed number field did not render its private localized behavior composition.');
}
if (!document.querySelector('[data-wcl-checkbox] input:checked')) {
  throw new Error('Packed checkbox did not preserve native selected state.');
}
if (document.querySelectorAll('[data-wcl-checkbox-group] input[type="checkbox"]').length !== 2) {
  throw new Error('Packed checkbox group did not render its native option inputs.');
}
if (!document.querySelector('[data-wcl-radio-group] input[value="balanced"]:checked')) {
  throw new Error('Packed radio group did not preserve exclusive selection.');
}
if (document.querySelector('[data-wcl-switch] input')?.getAttribute('role') !== 'switch') {
  throw new Error('Packed switch did not preserve switch semantics.');
}
if (!document.querySelector('[data-wcl-segmented-control] input[value="balanced"]:checked')) {
  throw new Error('Packed segmented control did not preserve exclusive selection.');
}
if (!document.querySelector('[data-wcl-selection-field]')) {
  throw new Error('Packed selection family did not render its private collection composition.');
}
if (
  document.querySelector('[data-wcl-list] > ol')?.getAttribute('aria-label') !== 'Run sequence' ||
  document.querySelectorAll('[data-wcl-description-list] dl[aria-label="Run details"] dt').length !== 1 ||
  document.querySelector('[data-wcl-list-box] [role="option"]')?.getAttribute('aria-selected') !== 'true' ||
  document.querySelector('[data-wcl-card-list] article')?.getAttribute('aria-label') !== 'RUN 0284'
) {
  throw new Error('Packed basic collections did not preserve their distinct semantics.');
}
if (
  document.querySelector('[data-wcl-collection-filter-bar]')?.getAttribute('role') !== 'search' ||
  document.querySelectorAll('[data-wcl-applied-filter]').length !== 2 ||
  document.querySelector('[data-wcl-table-grid]')?.getAttribute('role') !== 'grid' ||
  document.querySelectorAll('[data-wcl-table-row]').length !== 1 ||
  document.querySelector('[data-wcl-tree-grid]')?.getAttribute('role') !== 'treegrid' ||
  document.querySelectorAll('[data-wcl-tree-item]').length !== 2
) {
  throw new Error('Packed advanced collections did not preserve query, table, and tree semantics.');
}
if (
  !document.querySelector('[data-wcl-page-header-route]') ||
  !document.querySelector('[data-wcl-page-header-route-endpoint]') ||
  document.querySelectorAll('[data-wcl-split-view-pane-control]').length !== 2 ||
  document.querySelector('[data-wcl-split-view-separator]')?.getAttribute('aria-valuenow') !== '60'
) {
  throw new Error('Packed application structure did not preserve Route and split semantics.');
}
if (document.querySelector('[data-wcl-combo-box] input')?.getAttribute('role') !== 'combobox') {
  throw new Error('Packed combo box did not preserve editable autocomplete semantics.');
}
if (document.querySelectorAll('[data-wcl-range-field] input[type="range"]').length !== 3) {
  throw new Error('Packed range family did not preserve one single and two paired range inputs.');
}
if (document.querySelectorAll('[data-wcl-date-segment]').length < 12) {
  throw new Error('Packed date and time family did not render localized segmented controls.');
}
const packedProgress = document.querySelector('[data-wcl-progress-bar]:not([data-indeterminate])');
const packedPausedProgress = document.querySelector(
  '[data-wcl-progress-bar]:not([data-indeterminate]):not([data-active])',
);
const packedMeter = document.querySelector('[data-wcl-meter]');
const packedSpinner = document.querySelector('[data-wcl-spinner][data-active]');
if (
  document.querySelector('[data-wcl-status-indicator]')?.getAttribute('role') !== 'status' ||
  !document.querySelector('[data-wcl-badge]') ||
  document.querySelector('[data-wcl-inline-alert]')?.getAttribute('role') !== 'note' ||
  !document.querySelector('[data-wcl-alert-banner]') ||
  packedProgress?.getAttribute('aria-valuenow') !== '18' ||
  !packedPausedProgress ||
  packedMeter?.getAttribute('aria-valuetext') !== '76 kilowatts' ||
  document.querySelectorAll('[data-wcl-meter-threshold]').length !== 2 ||
  packedSpinner?.querySelector('[role="status"]')?.textContent !== 'Preparing solver' ||
  packedSpinner.querySelector('[role="status"]').hasAttribute('aria-busy') ||
  document.querySelector('[data-wcl-skeleton]')?.getAttribute('aria-hidden') !== 'true' ||
  document.querySelector('[data-wcl-empty-state]')?.getAttribute('data-kind') !== 'no-data' ||
  document.querySelector('[data-wcl-notification] [role="status"]')?.textContent !== 'Export readyOpen history' ||
  document.querySelector('[data-wcl-notification]')?.getAttribute('data-tone') !== 'success' ||
  document.querySelector('[data-wcl-notification-action]')?.textContent !== 'Open history' ||
  !document.querySelector('[data-wcl-notification-timer]')
) {
  throw new Error('Packed feedback family did not preserve semantic relationships.');
}
const packedChoiceForm = document.getElementById('packed-choice-form');
const packedChoiceEntries = [...new dom.window.FormData(packedChoiceForm).entries()];
if (JSON.stringify(packedChoiceEntries) !== JSON.stringify([
  ['features', 'mesh'],
  ['layers', 'thermal'],
  ['mode', 'balanced'],
  ['pin', 'yes'],
  ['density', 'balanced'],
  ['select-mode', 'balanced'],
  ['combo-mode', 'balanced'],
  ['run-date', '2026-08-20'],
  ['run-time', '14:30:00'],
  ['review-date', '2026-08-21'],
  ['review-start', '2026-08-20'],
  ['review-end', '2026-08-24'],
  ['confidence', '0.4'],
  ['window-start', '20'],
  ['window-end', '80'],
])) {
  throw new Error('Packed choices did not preserve external native form association.');
}
const packedDateInput = document.querySelector('input[name="run-date"]');
const packedTimeInput = document.querySelector('input[name="run-time"]');
const packedDateDay = packedDateInput
  ?.closest('[data-wcl-date-field]')
  ?.querySelector('[data-wcl-date-segment][data-type="day"]');
const packedTimeMinute = packedTimeInput
  ?.closest('[data-wcl-time-field]')
  ?.querySelector('[data-wcl-date-segment][data-type="minute"]');
for (const segment of [packedDateDay, packedTimeMinute]) {
  segment?.dispatchEvent(
    new dom.window.KeyboardEvent('keydown', {bubbles: true, key: 'ArrowUp'}),
  );
}
await new Promise((resolve) => setTimeout(resolve, 25));
const changedDateTimeEntries = [...new dom.window.FormData(packedChoiceForm).entries()].filter(
  ([name]) => name === 'run-date' || name === 'run-time',
);
if (JSON.stringify(changedDateTimeEntries) !== JSON.stringify([
  ['run-date', '2026-08-21'],
  ['run-time', '14:31:00'],
])) {
  throw new Error('Packed date and time fields did not accept segmented changes.');
}
const packedRangeInputs = [...document.querySelectorAll(
  '[data-wcl-range-field] input[type="range"]',
)];
for (const [input, value] of [
  [packedRangeInputs[0], '0.7'],
  [packedRangeInputs[1], '35'],
]) {
  input.value = value;
  input.dispatchEvent(new dom.window.Event('input', {bubbles: true}));
  input.dispatchEvent(new dom.window.Event('change', {bubbles: true}));
}
await new Promise((resolve) => setTimeout(resolve, 25));
const changedRangeEntries = [...new dom.window.FormData(packedChoiceForm).entries()].slice(-3);
if (JSON.stringify(changedRangeEntries) !== JSON.stringify([
  ['confidence', '0.7'],
  ['window-start', '35'],
  ['window-end', '80'],
])) {
  throw new Error('Packed ranges did not accept stepped changes.');
}
packedChoiceForm.reset();
await new Promise((resolve) => setTimeout(resolve, 25));
const resetDateTimeEntries = [...new dom.window.FormData(packedChoiceForm).entries()].filter(
  ([name]) => name === 'run-date' || name === 'run-time',
);
if (JSON.stringify(resetDateTimeEntries) !== JSON.stringify([
  ['run-date', '2026-08-20'],
  ['run-time', '14:30:00'],
])) {
  throw new Error('Packed date and time fields did not restore defaults on form reset.');
}
const resetRangeEntries = [...new dom.window.FormData(packedChoiceForm).entries()].slice(-3);
if (JSON.stringify(resetRangeEntries) !== JSON.stringify([
  ['confidence', '0.4'],
  ['window-start', '20'],
  ['window-end', '80'],
])) {
  throw new Error('Packed ranges did not restore defaults on form reset.');
}
const runNameInput = document.querySelector('input[value="North chamber"]');
if (!runNameInput?.getAttribute('aria-describedby')) {
  throw new Error('Packed text field did not preserve its generated description relationship.');
}
`;
}
