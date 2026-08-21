import {
  AlertBanner,
  Badge,
  InlineAlert,
  Meter,
  ProgressBar,
  Spinner,
  StatusIndicator,
  type AnnouncementMode,
  type BadgeTone,
  type MeterThreshold,
  type StatusTone,
} from '../src/index.js';

const announcement: AnnouncementMode = 'polite';
const statusTone: StatusTone = 'success';
const badgeTone: BadgeTone = 'accent';
const thresholds: readonly MeterThreshold[] = [
  {label: 'Review', tone: 'warning', value: 70, valueLabel: '70 kilowatts'},
];

export const feedback = (
  <>
    <StatusIndicator announcement={announcement} label="Stable" tone={statusTone} />
    <Badge tone={badgeTone}>Current run</Badge>
    <InlineAlert title="Review" tone="warning">
      Check the north boundary.
    </InlineAlert>
    <AlertBanner announcement="assertive" title="Run stopped" tone="danger">
      Reconnect the solver.
    </AlertBanner>
    <ProgressBar
      completionLabel="Complete after all passes."
      isActive
      label="Boundary solve"
      value={18}
      valueLabel="18 of 25 passes"
    />
    <ProgressBar
      completionLabel="Complete after convergence."
      isActive
      isIndeterminate
      label="Preparing solver"
      statusLabel="Estimating remaining work"
    />
    <Meter
      label="Thermal load"
      maxValue={100}
      minValue={0}
      thresholds={thresholds}
      tone="warning"
      value={76}
      valueLabel="76 kilowatts"
    />
    <Spinner isActive label="Solving profile" />
  </>
);

export const accentStatus = (
  // @ts-expect-error Application accent is not a semantic status tone.
  <StatusIndicator label="Solving" tone="accent" />
);

export const accentAlert = (
  // @ts-expect-error Application accent is not an alert severity.
  <InlineAlert title="Notice" tone="accent" />
);

export const indeterminateWithValue = (
  // @ts-expect-error Indeterminate progress cannot publish a fabricated numeric value.
  <ProgressBar
    completionLabel="Complete after convergence."
    isActive
    isIndeterminate
    label="Preparing solver"
    statusLabel="Estimating"
    value={40}
  />
);

export const determinateWithoutValueLabel = (
  // @ts-expect-error Determinate progress requires a localized value label with units.
  <ProgressBar completionLabel="Complete after all passes." isActive label="Solve" value={40} />
);

export const progressWithoutActivityState = (
  // @ts-expect-error Progress requires an explicit activity state so incomplete work can pause.
  <ProgressBar
    completionLabel="Complete after all passes."
    label="Solve"
    value={40}
    valueLabel="40 percent"
  />
);

export const silentSpinner = (
  // @ts-expect-error A generic busy state requires a localized accessible label.
  <Spinner isActive />
);

export const styledBadge = (
  // @ts-expect-error Badge does not accept consumer class injection.
  <Badge className="badge">Current</Badge>
);
