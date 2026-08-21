import type {ReactElement} from 'react';

import type {AnnouncementMode, StatusTone} from './feedback-types.js';

export function announcementProps(mode: AnnouncementMode): {
  readonly 'aria-atomic'?: true;
  readonly role?: 'alert' | 'status';
} {
  if (mode === 'assertive') return {'aria-atomic': true, role: 'alert'};
  if (mode === 'polite') return {'aria-atomic': true, role: 'status'};
  return {};
}

export function ToneGlyph({tone}: {readonly tone: StatusTone}): ReactElement {
  if (tone === 'success') {
    return (
      <svg aria-hidden="true" data-wcl-tone-glyph="" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="6" />
        <path d="m5 8 2 2 4-4" />
      </svg>
    );
  }
  if (tone === 'warning') {
    return (
      <svg aria-hidden="true" data-wcl-tone-glyph="" viewBox="0 0 16 16">
        <path d="M8 2 14 13H2Z" />
        <path d="M8 5.5v3.5M8 11.2v.1" />
      </svg>
    );
  }
  if (tone === 'danger') {
    return (
      <svg aria-hidden="true" data-wcl-tone-glyph="" viewBox="0 0 16 16">
        <path d="M8 1.8 14.2 8 8 14.2 1.8 8Z" />
        <path d="m6 6 4 4M10 6l-4 4" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" data-wcl-tone-glyph="" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="6" />
      <path d="M8 7v4M8 4.7v.1" />
    </svg>
  );
}

export function assertProgressDomain(
  component: string,
  minValue: number,
  maxValue: number,
  value: number,
): void {
  if (![minValue, maxValue, value].every(Number.isFinite)) {
    throw new TypeError(`${component} values must be finite numbers.`);
  }
  if (maxValue <= minValue) {
    throw new RangeError(`${component} maxValue must be greater than minValue.`);
  }
  if (value < minValue || value > maxValue) {
    throw new RangeError(`${component} value must be within minValue and maxValue.`);
  }
}
