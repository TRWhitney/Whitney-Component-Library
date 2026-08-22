import type {ReactElement} from 'react';

import type {SkeletonProps} from './feedback-types.js';

export function Skeleton({lines = 1, shape = 'text', width = 'full'}: SkeletonProps): ReactElement {
  const lineCount = shape === 'text' ? lines : 1;

  return (
    <div aria-hidden="true" data-shape={shape} data-wcl-skeleton="" data-width={width}>
      {Array.from({length: lineCount}, (_, index) => (
        <span
          data-wcl-skeleton-line=""
          key={index}
          {...(shape === 'text' && index === lineCount - 1 && lineCount > 1
            ? {'data-last-line': ''}
            : {})}
        />
      ))}
    </div>
  );
}
