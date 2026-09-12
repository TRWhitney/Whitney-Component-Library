import {useRef, useState, type ReactNode} from 'react';
import {Button} from '../actions/button.js';
import type {ChartSelection} from './chart-types.js';

/** A single selection view shared by chart renderers. */
export function ChartSelectionPresentation<Item>({
  selection,
  selected,
  instructionsId,
  itemKey,
  itemLabel,
  onClear,
}: {
  readonly selection: ChartSelection<Item>;
  readonly selected: readonly Item[];
  readonly instructionsId: string;
  readonly itemKey: (item: Item) => string;
  readonly itemLabel?: (item: Item) => ReactNode;
  readonly onClear: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const presentation = selection.presentation ?? 'panel';
  const {labels} = selection;
  const summary = selected.length ? labels.summary(selected.length) : labels.empty;
  const list = selected.length ? (
    <ul>
      {selected.map((item) => (
        <li key={itemKey(item)}>{itemLabel?.(item) ?? labels.item(item)}</li>
      ))}
    </ul>
  ) : null;
  const clear = (
    <Button
      variant="quiet"
      size="compact"
      isDisabled={!selected.length}
      onPress={() => {
        const canvas = root.current
          ?.closest('figure')
          ?.querySelector<HTMLElement>('[data-wcl-chart-canvas]');
        onClear();
        setExpanded(false);
        canvas?.focus();
      }}
    >
      {labels.clear}
    </Button>
  );
  return (
    <div
      ref={root}
      data-wcl-chart-selection=""
      data-presentation={presentation}
      role={presentation === 'panel' ? 'status' : undefined}
      aria-atomic={presentation === 'panel' ? true : undefined}
    >
      <span id={instructionsId} hidden>
        {labels.instructions}
      </span>
      <div data-wcl-chart-selection-controls="">
        <details
          open={expanded}
          onToggle={(event) => setExpanded(event.currentTarget.open)}
          onKeyDown={(event) => {
            if (event.key !== 'Escape' || !expanded) return;
            event.preventDefault();
            setExpanded(false);
            event.currentTarget.querySelector('summary')?.focus();
          }}
        >
          <summary
            onClick={(event) => {
              event.preventDefault();
              setExpanded(!expanded);
            }}
          >
            <span role={presentation === 'controls' ? 'status' : undefined} aria-atomic="true">
              {summary}
            </span>
          </summary>
          {expanded ? (
            <div data-wcl-chart-selection-details="">
              <p>{labels.instructions}</p>
              {presentation === 'controls' ? list : null}
            </div>
          ) : null}
        </details>
        {clear}
      </div>
      {presentation === 'panel' ? list : null}
    </div>
  );
}
