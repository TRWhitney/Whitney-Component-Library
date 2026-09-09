import type {Ref} from 'react';

export function ChartVisibilityButton({
  hidden,
  label,
  onToggle,
  onClear,
  buttonRef,
}: {
  readonly hidden: boolean;
  readonly label: string;
  readonly onToggle: () => void;
  readonly onClear: () => void;
  readonly buttonRef?: Ref<HTMLButtonElement> | undefined;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      data-wcl-chart-visibility=""
      data-hidden={hidden ? '' : undefined}
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          onClear();
        }
      }}
      ref={buttonRef}
      type="button"
    >
      <svg aria-hidden="true" data-wcl-chart-eye="" focusable="false" viewBox="0 0 24 24">
        {hidden ? (
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
    </button>
  );
}
