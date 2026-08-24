import type {ReactElement} from 'react';

import {announcementProps} from './feedback-support.js';
import type {
  ProcessStage,
  ProcessStageStatus,
  ProcessStatusLabels,
  ProcessTrackerProps,
} from './feedback-types.js';

const PROCESS_STAGE_STATUSES = [
  'complete',
  'active',
  'pending',
  'warning',
  'failed',
] as const satisfies readonly ProcessStageStatus[];

function assertNonEmpty(value: string, message: string): void {
  if (value.trim().length === 0) throw new TypeError(message);
}

function validateProcessTracker(
  ariaLabel: string,
  stages: readonly ProcessStage[],
  statusLabels: ProcessStatusLabels,
): void {
  assertNonEmpty(ariaLabel, 'ProcessTracker ariaLabel must be non-empty.');
  if (stages.length === 0) throw new TypeError('ProcessTracker requires at least one stage.');

  const ids = new Set<string>();
  let activeStages = 0;
  for (const stage of stages) {
    assertNonEmpty(stage.id, 'ProcessTracker stages require non-empty ids.');
    assertNonEmpty(stage.label, 'ProcessTracker stages require non-empty labels.');
    if (!(PROCESS_STAGE_STATUSES as readonly unknown[]).includes(stage.status)) {
      throw new TypeError('ProcessTracker received an unsupported stage status.');
    }
    if (ids.has(stage.id)) throw new TypeError('ProcessTracker requires unique stage ids.');
    ids.add(stage.id);
    if (stage.status === 'active') activeStages += 1;
  }
  if (activeStages > 1) throw new TypeError('ProcessTracker supports only one active stage.');

  for (const status of PROCESS_STAGE_STATUSES) {
    const label = statusLabels[status];
    if (typeof label !== 'string' || label.trim().length === 0) {
      throw new TypeError('ProcessTracker requires all five status labels to be non-empty.');
    }
  }
}

function StageMarker({status}: {readonly status: ProcessStageStatus}): ReactElement {
  if (status === 'complete') {
    return (
      <svg viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="7" />
        <path d="m6.5 10 2.2 2.2 4.8-4.8" />
      </svg>
    );
  }
  if (status === 'warning') {
    return (
      <svg viewBox="0 0 20 20">
        <path d="M10 2.5 18 17H2Z" />
        <path d="M10 7v4.5M10 14v.1" />
      </svg>
    );
  }
  if (status === 'failed') {
    return (
      <svg viewBox="0 0 20 20">
        <path d="M10 2 18 10 10 18 2 10Z" />
        <path d="m7 7 6 6M13 7l-6 6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="7" />
      {status === 'active' ? (
        <circle data-wcl-process-stage-core="" cx="10" cy="10" r="2.5" />
      ) : null}
    </svg>
  );
}

export function ProcessTracker({
  announcement = 'off',
  ariaLabel,
  stages,
  statusLabels,
}: ProcessTrackerProps): ReactElement {
  validateProcessTracker(ariaLabel, stages, statusLabels);

  return (
    <div {...announcementProps(announcement)} data-wcl-process-tracker="">
      <ol aria-label={ariaLabel} data-wcl-process-stage-list="">
        {stages.map((stage) => (
          <li
            aria-current={stage.status === 'active' ? 'step' : undefined}
            data-status={stage.status}
            data-wcl-process-stage=""
            key={stage.id}
          >
            <span aria-hidden="true" data-wcl-process-stage-marker="">
              <StageMarker status={stage.status} />
            </span>
            <span data-wcl-process-stage-copy="">
              <span data-wcl-process-stage-label="">{stage.label}</span>
              {stage.description ? (
                <span data-wcl-process-stage-description="">{stage.description}</span>
              ) : null}
              <span data-wcl-visually-hidden="">{statusLabels[stage.status]}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
