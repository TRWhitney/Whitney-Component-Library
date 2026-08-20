import type {KeyboardEvent, PointerEvent} from 'react';

const RANGE_ADJUSTMENT_KEYS = new Set([
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'End',
  'Home',
  'PageDown',
  'PageUp',
]);

export function preventReadOnlyKeyboardChange(event: KeyboardEvent<HTMLDivElement>): void {
  if (!RANGE_ADJUSTMENT_KEYS.has(event.key)) return;
  event.preventDefault();
  event.stopPropagation();
}

export function preventReadOnlyPointerChange(event: PointerEvent<HTMLDivElement>): void {
  const target = event.target as HTMLElement;
  const thumbInput = target.closest('[data-wcl-range-thumb]')?.querySelector('input');
  event.preventDefault();
  event.stopPropagation();
  thumbInput?.focus();
}
