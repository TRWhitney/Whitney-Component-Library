import {cleanup, render, screen, within} from '@testing-library/react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {afterEach, describe, expect, it} from 'vitest';

import {ProcessTracker, type ProcessStage} from '../src/index.js';

afterEach(cleanup);

const statusLabels = {
  active: 'Active',
  complete: 'Complete',
  failed: 'Failed',
  pending: 'Pending',
  warning: 'Needs review',
} as const;

const stages = [
  {
    description: '12 surfaces, no open edges',
    id: 'geometry',
    label: 'Geometry validated',
    status: 'complete',
  },
  {
    description: '4 of 6 conditions resolved',
    id: 'boundary',
    label: 'Boundary pass',
    status: 'active',
  },
  {
    description: 'Ready after validation',
    id: 'solve',
    label: 'Solve pending',
    status: 'pending',
  },
] as const satisfies readonly ProcessStage[];

describe('ProcessTracker', () => {
  it('presents a named ordered status relationship without interactive steps', () => {
    const {container} = render(
      <ProcessTracker
        ariaLabel="Thermal solve stages"
        stages={stages}
        statusLabels={statusLabels}
      />,
    );

    const list = screen.getByRole('list', {name: 'Thermal solve stages'});
    const items = within(list).getAllByRole('listitem');

    expect(items).toHaveLength(3);
    expect(
      items.map((item) => item.querySelector('[data-wcl-process-stage-label]')?.textContent),
    ).toEqual(['Geometry validated', 'Boundary pass', 'Solve pending']);
    expect(items[0]?.textContent).toContain('Complete');
    expect(items[1]?.getAttribute('aria-current')).toBe('step');
    expect(items[1]?.textContent).toContain('Active');
    expect(items[2]?.textContent).toContain('Pending');
    expect(items[1]?.querySelector('[data-wcl-process-stage-core]')).toBeTruthy();
    expect(items[2]?.querySelector('[data-wcl-process-stage-core]')).toBeNull();
    expect(container.querySelector('button, a, [tabindex]')).toBeNull();
  });

  it('keeps warning and failure distinct from the application accent and from each other', () => {
    const semanticStages = [
      {id: 'input', label: 'Input review', status: 'warning'},
      {id: 'solve', label: 'Solve stopped', status: 'failed'},
    ] as const;
    const {container} = render(
      <ProcessTracker
        ariaLabel="Interrupted solve"
        stages={semanticStages}
        statusLabels={statusLabels}
      />,
    );

    expect(
      container.querySelector('[data-status="warning"] [data-wcl-process-stage-marker]'),
    ).toBeTruthy();
    expect(
      container.querySelector('[data-status="failed"] [data-wcl-process-stage-marker]'),
    ).toBeTruthy();
    expect(container.querySelector('[data-status="warning"]')?.textContent).toContain(
      'Needs review',
    );
    expect(container.querySelector('[data-status="failed"]')?.textContent).toContain('Failed');
  });

  it('uses opt-in atomic announcements without replacing list semantics', () => {
    const {rerender} = render(
      <ProcessTracker
        announcement="polite"
        ariaLabel="Thermal solve stages"
        stages={stages}
        statusLabels={statusLabels}
      />,
    );

    expect(screen.getByRole('status').getAttribute('aria-atomic')).toBe('true');
    expect(screen.getByRole('list', {name: 'Thermal solve stages'})).toBeTruthy();

    rerender(
      <ProcessTracker
        announcement="assertive"
        ariaLabel="Thermal solve stages"
        stages={stages}
        statusLabels={statusLabels}
      />,
    );
    expect(screen.getByRole('alert').getAttribute('aria-atomic')).toBe('true');
  });

  it('rejects malformed stage collections with actionable errors', () => {
    const renderStages = (candidate: readonly ProcessStage[]) =>
      render(
        <ProcessTracker
          ariaLabel="Invalid process"
          stages={candidate as [ProcessStage, ...ProcessStage[]]}
          statusLabels={statusLabels}
        />,
      );

    expect(() => renderStages([])).toThrow(/at least one stage/i);
    expect(() =>
      render(<ProcessTracker ariaLabel=" " stages={stages} statusLabels={statusLabels} />),
    ).toThrow(/ariaLabel.*non-empty/i);
    expect(() =>
      renderStages([
        {id: 'same', label: 'First', status: 'active'},
        {id: 'same', label: 'Second', status: 'pending'},
      ]),
    ).toThrow(/unique stage ids/i);
    expect(() => renderStages([{id: ' ', label: 'First', status: 'pending'}])).toThrow(
      /non-empty ids/i,
    );
    expect(() =>
      renderStages([
        {id: 'one', label: 'First', status: 'active'},
        {id: 'two', label: 'Second', status: 'active'},
      ]),
    ).toThrow(/one active stage/i);
    expect(() => renderStages([{id: 'blank', label: ' ', status: 'pending'}])).toThrow(
      /non-empty labels/i,
    );
    expect(() =>
      renderStages([
        {id: 'unknown', label: 'Unknown', status: 'running' as ProcessStage['status']},
      ]),
    ).toThrow(/unsupported stage status/i);
    expect(() =>
      render(
        <ProcessTracker
          ariaLabel="Missing labels"
          stages={stages}
          statusLabels={
            {
              active: 'Active',
              complete: 'Complete',
              failed: 'Failed',
              pending: 'Pending',
            } as typeof statusLabels
          }
        />,
      ),
    ).toThrow(/all five status labels/i);
    expect(() =>
      render(
        <ProcessTracker
          ariaLabel="Blank status label"
          stages={stages}
          statusLabels={{...statusLabels, warning: ' '}}
        />,
      ),
    ).toThrow(/status labels.*non-empty/i);
  });

  it('server-renders and hydrates without changing the staged relationship', () => {
    const specimen = (
      <ProcessTracker
        ariaLabel="Thermal solve stages"
        stages={stages}
        statusLabels={statusLabels}
      />
    );
    const markup = renderToString(specimen);
    document.body.innerHTML = `<div id="root">${markup}</div>`;
    const rootElement = document.querySelector('#root')!;

    expect(rootElement.querySelectorAll('[data-wcl-process-stage]')).toHaveLength(3);
    expect(() => hydrateRoot(rootElement, specimen)).not.toThrow();
  });
});
