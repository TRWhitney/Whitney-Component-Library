'use client';

import type {MouseEvent, ReactElement} from 'react';

import type {PaginationProps} from './navigation-types.js';

type PageSlot = number | 'ellipsis-before' | 'ellipsis-after';

function pageSlots(currentPage: number, pageCount: number): PageSlot[] {
  if (pageCount <= 7) return Array.from({length: pageCount}, (_, index) => index + 1);

  const pages = new Set([1, pageCount, currentPage - 1, currentPage, currentPage + 1]);
  const visible = [...pages].filter((page) => page >= 1 && page <= pageCount).sort((a, b) => a - b);
  const result: PageSlot[] = [];

  for (const page of visible) {
    const previous = result.at(-1);
    if (typeof previous === 'number' && page - previous > 1) {
      result.push(previous === 1 ? 'ellipsis-before' : 'ellipsis-after');
    }
    result.push(page);
  }

  return result;
}

interface PageControlProps {
  readonly ariaLabel: string;
  readonly current?: boolean;
  readonly disabled?: boolean;
  readonly getPageHref?: (page: number) => string;
  readonly onPageChange?: (page: number) => void;
  readonly page: number;
  readonly visibleLabel: string;
}

function PageControl({
  ariaLabel,
  current = false,
  disabled = false,
  getPageHref,
  onPageChange,
  page,
  visibleLabel,
}: PageControlProps): ReactElement {
  const notify = (event: MouseEvent) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onPageChange?.(page);
  };
  const sharedProps = {
    'aria-current': current ? ('page' as const) : undefined,
    'aria-label': ariaLabel,
    'data-current': current ? '' : undefined,
    'data-wcl-page-control': '',
  };

  if (getPageHref) {
    if (disabled) {
      return (
        <span {...sharedProps} aria-disabled="true">
          {visibleLabel}
        </span>
      );
    }
    return (
      <a {...sharedProps} href={getPageHref(page)} onClick={notify}>
        {visibleLabel}
      </a>
    );
  }

  return (
    <button {...sharedProps} disabled={disabled} onClick={notify} type="button">
      {visibleLabel}
    </button>
  );
}

export function Pagination({
  ariaLabel,
  currentPage,
  getPageHref,
  getPageLabel,
  locale,
  nextLabel,
  onPageChange,
  pageCount,
  previousLabel,
}: PaginationProps): ReactElement {
  if (!Number.isInteger(pageCount) || pageCount < 1) {
    throw new Error('Pagination pageCount must be a positive integer.');
  }
  if (!Number.isInteger(currentPage) || currentPage < 1 || currentPage > pageCount) {
    throw new Error('Pagination currentPage must be an integer within pageCount.');
  }
  const numberFormatter = new Intl.NumberFormat(locale);

  return (
    <nav aria-label={ariaLabel} data-wcl-pagination="">
      <ol data-wcl-pagination-list="">
        <li>
          <PageControl
            ariaLabel={previousLabel}
            disabled={currentPage === 1}
            page={Math.max(1, currentPage - 1)}
            visibleLabel="‹"
            {...(getPageHref === undefined ? {} : {getPageHref})}
            {...(onPageChange === undefined ? {} : {onPageChange})}
          />
        </li>
        {pageSlots(currentPage, pageCount).map((slot) => {
          if (typeof slot !== 'number') {
            return (
              <li aria-hidden="true" data-wcl-pagination-ellipsis="" key={slot}>
                …
              </li>
            );
          }

          const formattedPage = numberFormatter.format(slot);
          return (
            <li key={slot}>
              <PageControl
                ariaLabel={getPageLabel(slot, formattedPage)}
                current={slot === currentPage}
                page={slot}
                visibleLabel={formattedPage}
                {...(getPageHref === undefined ? {} : {getPageHref})}
                {...(onPageChange === undefined ? {} : {onPageChange})}
              />
            </li>
          );
        })}
        <li>
          <PageControl
            ariaLabel={nextLabel}
            disabled={currentPage === pageCount}
            page={Math.min(pageCount, currentPage + 1)}
            visibleLabel="›"
            {...(getPageHref === undefined ? {} : {getPageHref})}
            {...(onPageChange === undefined ? {} : {onPageChange})}
          />
        </li>
      </ol>
    </nav>
  );
}
