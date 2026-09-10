import {Button as AriaButton} from 'react-aria-components/Button';
import {Dialog, DialogTrigger} from 'react-aria-components/Dialog';
import {Popover} from 'react-aria-components/Popover';
import {useRef, type Ref} from 'react';
import {ChartVisibilityButton} from './chart-visibility-button.js';
import type {HeatmapDomainItem, HeatmapVisibilityLabels} from './chart-types.js';

export type HeatmapAxis = 'row' | 'column';

export function HeatmapRestore({
  rows,
  columns,
  labels,
  onRestore,
  buttonRef,
  open,
  onOpenChange,
}: {
  readonly rows: readonly HeatmapDomainItem[];
  readonly columns: readonly HeatmapDomainItem[];
  readonly labels: HeatmapVisibilityLabels;
  readonly onRestore: (axis: HeatmapAxis, id: string) => void;
  readonly buttonRef: Ref<HTMLButtonElement>;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}) {
  const count = rows.length + columns.length;
  const list = useRef<HTMLDivElement>(null);
  const restore = (axis: HeatmapAxis, id: string) => {
    // Move focus before removing its button; the overlay retains focus until the last restore.
    if (count === 1) onOpenChange(false);
    else {
      const buttons = [
        ...(list.current?.querySelectorAll<HTMLButtonElement>('[data-wcl-chart-visibility]') ?? []),
      ];
      const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
      (buttons[index + 1] ?? buttons[index - 1])?.focus();
    }
    onRestore(axis, id);
  };
  return (
    <span
      data-wcl-heatmap-visibility-control=""
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <DialogTrigger isOpen={open && count > 0} onOpenChange={onOpenChange}>
        <AriaButton
          aria-label={labels.restore(count)}
          data-wcl-chart-visibility=""
          data-wcl-heatmap-restore-trigger=""
          data-hidden=""
          ref={buttonRef}
        >
          <svg aria-hidden="true" data-wcl-chart-eye="" viewBox="0 0 24 24">
            <path d="M3 10 Q12 20 21 10" />
            <path d="m5 12-2 3m6-1-1 4m7-4 1 4m3-6 2 3" />
          </svg>
          <span aria-hidden="true">{count}</span>
        </AriaButton>
        <Popover placement="bottom start" offset={6} data-wcl-heatmap-restore-popover="">
          <Dialog aria-label={labels.restore(count)} data-wcl-heatmap-restore-dialog="" ref={list}>
            {(['row', 'column'] as const).map((axis) => {
              const items = axis === 'row' ? rows : columns;
              return items.length ? (
                <section
                  key={axis}
                  aria-label={axis === 'row' ? labels.hiddenRows : labels.hiddenColumns}
                >
                  <p>{axis === 'row' ? labels.hiddenRows : labels.hiddenColumns}</p>
                  {items.map((item) => (
                    <div key={item.id} data-wcl-heatmap-restore-item="">
                      <span>{item.label}</span>
                      <ChartVisibilityButton
                        hidden
                        label={
                          axis === 'row'
                            ? labels.showRow(item.label)
                            : labels.showColumn(item.label)
                        }
                        onClear={() => onOpenChange(false)}
                        onToggle={() => restore(axis, item.id)}
                      />
                    </div>
                  ))}
                </section>
              ) : null;
            })}
            <AriaButton data-wcl-chart-show-all="" onPress={() => onOpenChange(false)}>
              {labels.close}
            </AriaButton>
          </Dialog>
        </Popover>
      </DialogTrigger>
    </span>
  );
}
