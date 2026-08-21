import type {ComponentContract} from './component-contract.js';

const common = {
  accentBehavior: [
    'Editable content and calendar text stay neutral. Focus, today, the selected range, and its endpoints use accent colors. Invalid state uses danger colors.',
  ],
  appearance: [
    'Segmented controls use the compact field layout and a fixed support area. Pickers add a raised calendar with weekday labels, a continuous range fill, and selected-day or endpoint rails that match selected actions.',
  ],
  directionality: [
    'Locale determines segment order, numerals, calendar grid direction, and logical previous or next navigation without changing value identity or DOM reading order.',
  ],
  forcedColorBehavior: [
    'Forced colors use system colors for fields, segment focus, calendar borders, unavailable dates, today, selected ranges, and endpoints.',
  ],
  localization: [
    'locale and calendar are required initial-render inputs; provide localized labels, support text, errors, and calendar trigger labels.',
  ],
  reducedMotionBehavior: [
    'Reduced motion removes the short popover transition; segment edits and month changes never use positional animation.',
  ],
  responsiveBehavior: [
    'Fields fill their parent. Segments remain operable on narrow screens, and the single-month calendar stays inside the viewport.',
  ],
  stylesheet: './styles.css',
} satisfies Pick<
  ComponentContract,
  | 'accentBehavior'
  | 'appearance'
  | 'directionality'
  | 'forcedColorBehavior'
  | 'localization'
  | 'reducedMotionBehavior'
  | 'responsiveBehavior'
  | 'stylesheet'
>;

function inProvider(name: string, body: string): string {
  return [
    `export function ${name}() {`,
    '  return (',
    '    <AppearanceProvider appearance="dark" accent="#2878ff">',
    ...body.split('\n').map((line) => `      ${line}`),
    '    </AppearanceProvider>',
    '  );',
    '}',
  ].join('\n');
}

export const dateFieldContract = {
  ...common,
  accessibility: [
    'DateField exposes one visible label and separately focusable localized spinbutton segments with shared description, error, required, invalid, read-only, and disabled relationships.',
  ],
  appropriateUses: ['a user knows a calendar date and direct segmented entry is fastest'],
  composition: ['Render DateField inside AppearanceProvider and let it own every date segment.'],
  contentRules: [
    'Use a concise persistent label and explain accepted bounds or unavailable dates in durable support copy.',
  ],
  controlBehavior: [
    'Controlled or uncontrolled ISO dates may be empty. Keyboard, pointer, and touch edits stay synchronized and keep the chosen display calendar.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'AvailabilityDateCounterexample',
        '<DateField calendar="gregory" label="Available appointment" locale="en-US" />',
      ),
      description: 'Nearby availability is spatial calendar information that direct entry hides.',
      title: 'Do not hide useful availability context',
    },
  ],
  events: ["onChange reports a complete value in the library's ISO calendar-date format or null."],
  examples: [
    {
      code: inProvider(
        'RunDateField',
        '<DateField calendar="gregory" defaultValue={{year: 2026, month: 8, day: 20}} label="Run date" locale="en-US" name="run-date" />',
      ),
      description: 'Collect a known civil date without adding calendar interaction.',
      title: 'Enter a known date',
    },
  ],
  exportName: 'DateField',
  formBehavior: [
    'name and form serialize a complete value as YYYY-MM-DD; native reset restores defaultValue and a named empty field contributes an empty string.',
  ],
  importPath: '.',
  inappropriateUses: ['calendar comparison, nearby availability, a date interval, or an instant'],
  keyboardBehavior: [
    'Tab enters and leaves the compound field, Arrow keys adjust the focused segment, typing replaces it, and locale controls segment order.',
  ],
  kind: 'component',
  labeling: [
    'label is always visible and generated relationships apply to every editable segment.',
  ],
  localization: [
    'locale and calendar are required initial-render inputs; provide localized labels, support text, and errors.',
  ],
  name: 'DateField',
  parts: ['DateField includes a label, segmented date input, hidden form input, and support area.'],
  preferredAlternatives: [
    'Use DatePicker when calendar context helps, DateRangePicker for an inclusive interval, and a future zoned date-time control for an instant.',
  ],
  preferredCompositions: ['Place related fields in FieldGroup and workflows in FormSection.'],
  purpose: 'DateField collects one known civil date through localized segmented entry.',
  relatedExports: [
    'AppearanceProvider',
    'DatePicker',
    'DateRangePicker',
    'FieldGroup',
    'FormSection',
  ],
  states: ['Empty, controlled, uncontrolled, invalid, required, read-only, and disabled states.'],
  summary: 'Enter one known ISO civil date through locale- and calendar-aware segments.',
  validation: [
    'minValue, maxValue, unavailable dates, required state, custom validate, and application errors share the fixed error area.',
  ],
} satisfies ComponentContract;

export const timeFieldContract = {
  ...common,
  accessibility: [
    'TimeField exposes one visible label and separate focus targets for the hour, minute, second, and day period required by its format.',
  ],
  appropriateUses: ['a user enters a wall-clock time that does not identify an instant'],
  composition: [
    'Render TimeField inside AppearanceProvider and keep time-zone meaning outside it.',
  ],
  contentRules: [
    'State the operational context when the wall-clock time could otherwise be ambiguous.',
  ],
  controlBehavior: [
    'Controlled or uncontrolled zone-free times may be empty. hourCycle and granularity define the format, and values cannot contain more precision than the visible segments.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'DeploymentInstantCounterexample',
        '<TimeField granularity="minute" hourCycle={24} label="Deploy at" locale="en-US" />',
      ),
      description:
        'A global deployment instant needs a date, time zone, and disambiguation contract.',
      title: 'Do not represent an instant as a wall-clock time',
    },
  ],
  events: ["onChange reports a complete value in the library's wall-clock format or null."],
  examples: [
    {
      code: inProvider(
        'DailyReviewTime',
        '<TimeField defaultValue={{hour: 14, minute: 30, second: 0}} granularity="minute" hourCycle={24} label="Daily review" locale="en-US" name="review-time" />',
      ),
      description: 'Collect a recurring local wall-clock time with visible minute precision.',
      title: 'Enter a daily time',
    },
  ],
  exportName: 'TimeField',
  formBehavior: [
    'name and form serialize a complete value as HH:mm:ss; native reset restores defaultValue and a named empty field contributes an empty string.',
  ],
  importPath: '.',
  inappropriateUses: [
    'a date, duration, countdown, combined date-time, or time-zone-aware instant',
  ],
  keyboardBehavior: [
    'Arrow keys adjust the focused segment, typing replaces it, and 12-hour formats expose a day-period segment.',
  ],
  kind: 'component',
  labeling: ['label is always visible and support relationships apply to every time segment.'],
  localization: [
    'locale, hourCycle, and granularity are required initial-render inputs; provide localized labels, support text, and errors.',
  ],
  name: 'TimeField',
  parts: ['TimeField includes a label, segmented time input, hidden form input, and support area.'],
  preferredAlternatives: [
    'Use DateField for a civil day, NumberField for a duration, and a future zoned date-time control for an instant.',
  ],
  preferredCompositions: ['Place related schedule fields in FieldGroup or FormSection.'],
  purpose: 'TimeField collects one zone-free wall-clock time through localized segmented entry.',
  relatedExports: ['AppearanceProvider', 'DateField', 'FieldGroup', 'FormSection'],
  states: ['Empty, controlled, uncontrolled, invalid, required, read-only, and disabled states.'],
  summary: 'Enter a zone-free wall-clock time with localized formatting.',
  validation: [
    'minValue, maxValue, required state, visible precision, custom validate, and external invalidity share the support track.',
  ],
} satisfies ComponentContract;

export const datePickerContract = {
  ...dateFieldContract,
  accessibility: [
    'DatePicker combines labeled segmented entry with a named calendar button. The calendar dialog handles navigation, selection, focus restoration, and dismissal.',
  ],
  appropriateUses: ['one civil date is easier to choose by comparing nearby days or availability'],
  composition: [
    'Render DatePicker inside AppearanceProvider and let it own trigger, dialog, and calendar.',
  ],
  controlBehavior: [
    'Segment edits and calendar selection update the same controlled or uncontrolled ISO value. placeholderValue anchors an empty calendar without selecting a date. The picker also supports controlled open state, limits, and unavailable dates.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'BirthDatePickerCounterexample',
        '<DatePicker calendar="gregory" calendarButtonLabel="Choose birth date" label="Birth date" locale="en-US" placeholderValue={{year: 2000, month: 1, day: 1}} />',
      ),
      description:
        'A distant known date is usually faster to type than to reach by month navigation.',
      title: 'Do not add a calendar to every date',
    },
  ],
  events: [
    'onChange reports an ISO date or null; onOpenChange reports trigger, selection, Escape, and outside-dismissal changes.',
  ],
  examples: [
    {
      code: inProvider(
        'ReviewDatePicker',
        '<DatePicker calendar="gregory" calendarButtonLabel="Choose review date" label="Review date" locale="en-US" minValue={{year: 2026, month: 8, day: 18}} maxValue={{year: 2026, month: 8, day: 31}} placeholderValue={{year: 2026, month: 8, day: 20}} />',
      ),
      description: 'Choose an available day while keeping direct entry.',
      title: 'Choose a review date',
    },
  ],
  exportName: 'DatePicker',
  formBehavior: [
    'name and form serialize YYYY-MM-DD, calendar selection commits the same value as direct entry, and reset restores defaultValue.',
  ],
  inappropriateUses: [
    'a known date needs only direct entry, an interval is required, or the value is an instant',
  ],
  keyboardBehavior: [
    'The trigger opens the dialog; calendar arrows move by day or week, Page keys move by month, Enter selects, Escape dismisses, and focus returns to the trigger.',
  ],
  localization: [
    'locale and calendar are required initial-render inputs; provide localized labels, support text, errors, and the calendar trigger label.',
  ],
  name: 'DatePicker',
  parts: [
    'DatePicker includes a label, date segments, trigger, hidden input, support area, popover dialog, heading, navigation, grid, and day cells.',
  ],
  preferredAlternatives: [
    'Use DateField for direct entry, DateRangePicker for an interval, and a future zoned date-time control for an instant.',
  ],
  purpose:
    'DatePicker collects one civil date through synchronized direct entry and calendar selection.',
  relatedExports: [
    'AppearanceProvider',
    'DateField',
    'DateRangePicker',
    'FieldGroup',
    'FormSection',
  ],
  states: [
    'Empty, open, closed, controlled, uncontrolled, unavailable, limited, invalid, required, read-only, and disabled states.',
  ],
  summary: 'Choose an ISO civil date with synchronized segments and a constrained calendar.',
} satisfies ComponentContract;

export const dateRangePickerContract = {
  ...common,
  accessibility: [
    'DateRangePicker exposes two ordered segmented inputs, one named calendar button, and a dialog grid that identifies both endpoints and the selected interval to assistive technology.',
  ],
  appropriateUses: ['two inclusive civil dates define one continuous interval'],
  composition: [
    'Render DateRangePicker inside AppearanceProvider and let it own both endpoints and the range calendar.',
  ],
  contentRules: [
    'Name the interval as a whole and explain whether both inclusive endpoint dates count.',
  ],
  controlBehavior: [
    'Controlled or uncontrolled ranges may be empty. Each value is one continuous interval. placeholderValue anchors the empty calendar without selecting a range. Start never follows end. A range may contain unavailable dates, but it is then invalid. Entry and calendar selection stay synchronized.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'IndependentDatesCounterexample',
        '<DateRangePicker calendar="gregory" calendarButtonLabel="Choose dates" label="Created and reviewed" locale="en-US" placeholderValue={{year: 2026, month: 8, day: 20}} />',
      ),
      description: 'Two unrelated dates do not form one continuous interval.',
      title: 'Do not join independent dates into a range',
    },
  ],
  events: [
    'onChange reports a complete inclusive ISO range or null. onOpenChange reports every open-state transition.',
  ],
  examples: [
    {
      code: inProvider(
        'ReviewWindowPicker',
        '<DateRangePicker calendar="gregory" calendarButtonLabel="Choose review window" defaultValue={{start: {year: 2026, month: 8, day: 20}, end: {year: 2026, month: 8, day: 24}}} label="Review window" locale="en-US" names={["review-start", "review-end"]} placeholderValue={{year: 2026, month: 8, day: 20}} />',
      ),
      description: 'Collect one inclusive interval and serialize its two endpoint identities.',
      title: 'Choose a review window',
    },
  ],
  exportName: 'DateRangePicker',
  formBehavior: [
    'names supplies ordered start and end field names; each endpoint serializes as YYYY-MM-DD and reset restores the complete default range.',
  ],
  importPath: '.',
  inappropriateUses: [
    'one date is selected, the dates are unrelated, or the interval contains time-zone-aware instants',
  ],
  keyboardBehavior: [
    'Each endpoint supports segmented entry. The calendar handles spatial navigation, range anchoring, selection completion, Escape dismissal, and focus restoration.',
  ],
  kind: 'component',
  labeling: [
    'label names the complete interval while generated context distinguishes start and end segments.',
  ],
  name: 'DateRangePicker',
  parts: [
    'DateRangePicker includes a label, start and end segments, separator, trigger, two hidden inputs, support area, popover dialog, and range calendar.',
  ],
  preferredAlternatives: [
    'Use DateField for one known date, DatePicker for one calendar-assisted date, or two independent fields when the dates do not define an interval.',
  ],
  preferredCompositions: ['Place the range with related constraints in FieldGroup or FormSection.'],
  purpose: 'DateRangePicker collects one inclusive continuous civil-date interval.',
  relatedExports: ['AppearanceProvider', 'DateField', 'DatePicker', 'FieldGroup', 'FormSection'],
  states: [
    'Empty, partial, complete, open, closed, controlled, uncontrolled, unavailable, limited, invalid, required, read-only, and disabled states.',
  ],
  summary:
    'Choose one inclusive ISO civil-date interval through synchronized endpoints and calendar.',
  validation: [
    'Ordering, limits, unavailable dates, required state, custom validate, and application errors apply to the complete interval and share one fixed error area.',
  ],
} satisfies ComponentContract;
