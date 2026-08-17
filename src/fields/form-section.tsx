import {createElement, useId, type ReactElement} from 'react';

import type {FormSectionHeadingLevel, FormSectionProps} from './field-types.js';

export function FormSection({
  children,
  description,
  headingLevel = 2,
  title,
}: FormSectionProps): ReactElement {
  const headingId = `wcl-form-section-${useId().replaceAll(':', '')}`;

  return (
    <section aria-labelledby={headingId} data-wcl-form-section="">
      <header data-wcl-form-section-header="">
        {createElement(headingLevelTag(headingLevel), {id: headingId}, title)}
        {description ? <p data-wcl-form-section-description="">{description}</p> : null}
      </header>
      <div data-wcl-form-section-content="">{children}</div>
    </section>
  );
}

function headingLevelTag(level: FormSectionHeadingLevel): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' {
  return `h${level}`;
}
