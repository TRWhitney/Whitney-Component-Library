import {createElement, isValidElement, useId, type ReactElement} from 'react';

import type {PageHeaderHeadingLevel, PageHeaderProps} from './application-types.js';

function headingTag(level: PageHeaderHeadingLevel): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' {
  return `h${level}`;
}

function isRenderableEndpoint(value: unknown): value is string | number | ReactElement {
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return Number.isFinite(value);
  return isValidElement(value);
}

export function PageHeader({
  actions,
  breadcrumbs,
  description,
  headingLevel = 1,
  identity,
  status,
  statusTone,
  title,
}: PageHeaderProps): ReactElement {
  const titleId = `wcl-page-header-${useId().replaceAll(':', '')}`;
  const hasIdentity = isRenderableEndpoint(identity);
  const hasStatus = isRenderableEndpoint(status);
  const hasRoute = hasIdentity && hasStatus;

  return (
    <header aria-labelledby={titleId} data-wcl-page-header="" role="region">
      {breadcrumbs === undefined ? null : (
        <div data-wcl-page-header-breadcrumbs="">{breadcrumbs}</div>
      )}
      {!hasIdentity && !hasStatus ? null : (
        <div
          data-has-route={hasRoute || undefined}
          data-tone={hasStatus ? statusTone : undefined}
          data-wcl-page-header-context=""
        >
          {hasIdentity ? <div data-wcl-page-header-identity="">{identity}</div> : null}
          {hasRoute ? (
            <span aria-hidden="true" data-wcl-page-header-route="">
              <span data-wcl-page-header-route-origin="" />
              <span data-wcl-page-header-route-track="" />
              <span data-wcl-page-header-route-endpoint="" />
            </span>
          ) : null}
          {hasStatus ? <div data-wcl-page-header-status="">{status}</div> : null}
        </div>
      )}
      <div data-wcl-page-header-heading-row="">
        <div data-wcl-page-header-heading="">
          {createElement(headingTag(headingLevel), {id: titleId}, title)}
          {description ? <p data-wcl-page-header-description="">{description}</p> : null}
        </div>
        {actions === undefined ? null : <div data-wcl-page-header-actions="">{actions}</div>}
      </div>
    </header>
  );
}
