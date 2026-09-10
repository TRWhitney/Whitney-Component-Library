import type {ReactElement} from 'react';

export function ChartExplorationGlyph({
  kind,
}: {
  readonly kind: 'overview' | 'minus' | 'plus' | 'reset' | 'back' | 'forward' | 'up' | 'down';
}): ReactElement {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      {kind === 'overview' ? (
        <>
          <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" />
          <rect x="5.5" y="4.5" width="5" height="7" rx="0.5" />
        </>
      ) : null}
      {kind === 'minus' || kind === 'plus' ? (
        <path d={kind === 'plus' ? 'M3 8h10M8 3v10' : 'M3 8h10'} />
      ) : null}
      {kind === 'reset' ? <path d="M3 6a5 5 0 1 1 .5 5M3 2v4h4" /> : null}
      {kind === 'up' || kind === 'down' ? (
        <path d={kind === 'up' ? 'm3 10 5-5 5 5' : 'm3 6 5 5 5-5'} />
      ) : null}
      {kind === 'back' || kind === 'forward' ? (
        <path d={kind === 'back' ? 'm10 3-5 5 5 5' : 'm6 3 5 5-5 5'} />
      ) : null}
    </svg>
  );
}
