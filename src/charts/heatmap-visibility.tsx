import {Button as AriaButton} from 'react-aria-components/Button';
import {Dialog, DialogTrigger} from 'react-aria-components/Dialog';
import {Popover} from 'react-aria-components/Popover';
import {useRef, type Ref} from 'react';
import {ChartVisibilityButton} from './chart-visibility-button.js';
import type {HeatmapDomainItem, HeatmapVisibilityLabels} from './chart-types.js';

export type HeatmapAxis = 'row' | 'column';

export function HeatmapVisibilityMenu({
  rows,
  columns,
  labels,
  onToggle,
  manage,
  buttonRef,
  open,
  onOpenChange,
}: {
  readonly rows: readonly HeatmapDomainItem[];
  readonly columns: readonly HeatmapDomainItem[];
  readonly labels: HeatmapVisibilityLabels;
  readonly onToggle: (axis: HeatmapAxis, id: string, restore: boolean) => void;
  readonly manage?: {
    readonly label: string;
    readonly rowHeading: string;
    readonly columnHeading: string;
    readonly hiddenRows: readonly string[];
    readonly hiddenColumns: readonly string[];
  };
  readonly buttonRef: Ref<HTMLButtonElement>;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}) {
  const count = manage
    ? manage.hiddenRows.length + manage.hiddenColumns.length
    : rows.length + columns.length;
  const title = manage?.label ?? labels.restore(count);
  const isHidden = (axis: HeatmapAxis, id: string) =>
    !manage || (axis === 'row' ? manage.hiddenRows : manage.hiddenColumns).includes(id);
  const list = useRef<HTMLDivElement>(null);
  const restore = (axis: HeatmapAxis, id: string) => {
    // Move focus before removing its button; the overlay retains focus until the last restore.
    if (!manage && count === 1) onOpenChange(false);
    else if (!manage) {
      const buttons = [
        ...(list.current?.querySelectorAll<HTMLButtonElement>('[data-wcl-chart-visibility]') ?? []),
      ];
      const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
      (buttons[index + 1] ?? buttons[index - 1])?.focus();
    }
    onToggle(axis, id, isHidden(axis, id));
  };
  return (
    <span
      title={title}
      data-wcl-heatmap-visibility-control=""
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <DialogTrigger isOpen={open && (!!manage || count > 0)} onOpenChange={onOpenChange}>
        <AriaButton
          aria-label={title}
          data-wcl-chart-visibility=""
          data-wcl-heatmap-restore-trigger=""
          data-hidden={count ? '' : undefined}
          ref={buttonRef}
        >
          <svg aria-hidden="true" data-wcl-chart-eye="" viewBox="0 0 24 24">
            {count ? (
              <g>
                <path d="M3 10 Q12 20 21 10" />
                <path d="m5 12-2 3m6-1-1 4m7-4 1 4m3-6 2 3" />
              </g>
            ) : (
              <g>
                <path d="M2 12 Q12 1 22 12 Q12 23 2 12Z" />
                <circle cx="12" cy="12" r="3" />
              </g>
            )}
          </svg>
          {count > 0 ? <span aria-hidden="true">{count}</span> : null}
        </AriaButton>
        <Popover placement="bottom start" offset={6} data-wcl-heatmap-restore-popover="">
          <Dialog aria-label={title} data-wcl-heatmap-restore-dialog="" ref={list}>
            {(['row', 'column'] as const).map((axis) => {
              const items = axis === 'row' ? rows : columns;
              const heading =
                axis === 'row'
                  ? (manage?.rowHeading ?? labels.hiddenRows)
                  : (manage?.columnHeading ?? labels.hiddenColumns);
              return items.length ? (
                <section key={axis} aria-label={heading}>
                  <p>{heading}</p>
                  {items.map((item) => (
                    <div key={item.id} data-wcl-heatmap-restore-item="">
                      <span>{item.label}</span>
                      <ChartVisibilityButton
                        hidden={isHidden(axis, item.id)}
                        label={
                          axis === 'row'
                            ? (isHidden(axis, item.id) ? labels.showRow : labels.hideRow)(
                                item.label,
                              )
                            : (isHidden(axis, item.id) ? labels.showColumn : labels.hideColumn)(
                                item.label,
                              )
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
