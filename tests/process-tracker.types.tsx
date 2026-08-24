import {
  ProcessTracker,
  type ProcessStage,
  type ProcessStageStatus,
  type ProcessStatusLabels,
} from '../src/index.js';

const status: ProcessStageStatus = 'active';
const stages = [
  {id: 'prepare', label: 'Prepare inputs', status: 'complete'},
  {description: '4 of 6 conditions resolved', id: 'solve', label: 'Solve', status},
] as const satisfies readonly ProcessStage[];
const statusLabels: ProcessStatusLabels = {
  active: 'Active',
  complete: 'Complete',
  failed: 'Failed',
  pending: 'Pending',
  warning: 'Needs review',
};

export const processTracker = (
  <ProcessTracker ariaLabel="Run stages" stages={stages} statusLabels={statusLabels} />
);

export const emptyProcess = (
  // @ts-expect-error ProcessTracker requires at least one stage.
  <ProcessTracker ariaLabel="Empty process" stages={[]} statusLabels={statusLabels} />
);

export const invalidStatus = (
  <ProcessTracker
    ariaLabel="Invalid process"
    stages={[
      {
        id: 'prepare',
        label: 'Prepare',
        // @ts-expect-error Process stages use the bounded status vocabulary.
        status: 'running',
      },
    ]}
    statusLabels={statusLabels}
  />
);

export const styledProcess = (
  <ProcessTracker
    ariaLabel="Styled process"
    // @ts-expect-error ProcessTracker does not accept consumer class injection.
    className="tracker"
    stages={stages}
    statusLabels={statusLabels}
  />
);
