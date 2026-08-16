import {createElement, useId, type ReactElement, type ReactNode} from 'react';

import type {LayoutChildrenProps} from './layout-types.js';

export type SectionHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface SectionProps extends LayoutChildrenProps {
  readonly actions?: ReactNode;
  readonly description?: string;
  readonly headingLevel?: SectionHeadingLevel;
  readonly title: string;
}

export function Section({
  actions,
  children,
  description,
  headingLevel = 2,
  title,
}: SectionProps): ReactElement {
  const headingId = `wcl-section-${useId().replaceAll(':', '')}`;

  return (
    <section aria-labelledby={headingId} data-wcl-section="">
      <div data-wcl-section-header="">
        <div data-wcl-section-heading="">
          {createElement(headingLevelTag(headingLevel), {id: headingId}, title)}
          {description ? <p data-wcl-section-description="">{description}</p> : null}
        </div>
        {actions ? <div data-wcl-section-actions="">{actions}</div> : null}
      </div>
      <div data-wcl-section-content="">{children}</div>
    </section>
  );
}

function headingLevelTag(level: SectionHeadingLevel): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' {
  return `h${level}`;
}
