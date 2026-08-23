'use client';

import {OverlayArrow} from 'react-aria-components/Popover';
import {I18nProvider, useLocale} from 'react-aria/I18nProvider';
import type {ReactElement, ReactNode} from 'react';

import type {AnchoredOverlayAlignment, AnchoredOverlayPlacement} from './overlay-types.js';

export const anchoredOverlayPositionProps = {
  arrowBoundaryOffset: 12,
  containerPadding: 8,
} as const;

function localeWithDirection(locale: string, direction: 'ltr' | 'rtl' | undefined): string {
  if (direction === undefined) return locale;
  return new Intl.Locale(locale, {script: direction === 'rtl' ? 'Arab' : 'Latn'}).toString();
}

export function AnchoredOverlayDirectionProvider({
  children,
  direction,
}: {
  readonly children: ReactNode;
  readonly direction: 'ltr' | 'rtl' | undefined;
}): ReactElement {
  const {locale} = useLocale();

  return <I18nProvider locale={localeWithDirection(locale, direction)}>{children}</I18nProvider>;
}

export function anchoredPlacement(
  placement: AnchoredOverlayPlacement,
  alignment: AnchoredOverlayAlignment,
):
  | AnchoredOverlayPlacement
  | `top ${'start' | 'end'}`
  | `bottom ${'start' | 'end'}`
  | `start ${'top' | 'bottom'}`
  | `end ${'top' | 'bottom'}` {
  if (alignment === 'center') return placement;
  if (placement === 'top' || placement === 'bottom') return `${placement} ${alignment}`;
  return `${placement} ${alignment === 'start' ? 'top' : 'bottom'}`;
}

export function AnchorArrow(): ReactElement {
  return (
    <OverlayArrow data-wcl-anchor-arrow="">
      <svg aria-hidden="true" viewBox="0 0 14 7">
        <path data-wcl-anchor-arrow-fill="" d="M0 7 7 0l7 7Z" />
        <path data-wcl-anchor-arrow-rail-mask="" d="M1 3.5h12v5H1Z" />
        <path
          data-variant="accent-rail"
          data-wcl-anchor-arrow-edge=""
          d="M0 5.5h1.5L7 0l5.5 5.5H14"
        />
        <path data-variant="accent" data-wcl-anchor-arrow-edge="" d="m0.5 6.5 6.5-6.5 6.5 6.5" />
        <path data-variant="neutral" data-wcl-anchor-arrow-edge="" d="m0.5 6.5 6.5-6.5 6.5 6.5" />
      </svg>
    </OverlayArrow>
  );
}
