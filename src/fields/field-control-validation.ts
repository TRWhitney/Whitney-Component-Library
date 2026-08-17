'use client';

import {useEffect, useRef, useState, type RefObject} from 'react';

import type {FieldControlProps} from './field-types.js';

interface FieldControlValidation {
  readonly controlShellRef: RefObject<HTMLDivElement | null>;
}

const CUSTOM_CONTROL_ROLES = new Set([
  'button',
  'checkbox',
  'combobox',
  'listbox',
  'radio',
  'searchbox',
  'slider',
  'spinbutton',
  'switch',
  'textbox',
]);

export function useFieldControlValidation(
  expectedControlProps: FieldControlProps,
): FieldControlValidation {
  const controlShellRef = useRef<HTMLDivElement>(null);
  const [validationError, setValidationError] = useState<TypeError | null>(null);

  useEffect(() => {
    const shell = controlShellRef.current;
    if (!shell || !expectedControlProps.id) return;

    try {
      assertRenderedFieldControl(shell, expectedControlProps);
    } catch (error) {
      setValidationError((current) => current ?? (error as TypeError));
    }
  }, [expectedControlProps]);

  if (validationError) throw validationError;

  return {controlShellRef};
}

function assertRenderedFieldControl(
  shell: HTMLDivElement,
  expectedControlProps: FieldControlProps,
): void {
  const meaningfulText = [...shell.childNodes].some(
    (node) => node.nodeType === node.TEXT_NODE && node.textContent?.trim(),
  );
  const control = shell.children.length === 1 ? shell.firstElementChild : null;
  const tagName = control?.tagName;
  const role = control?.getAttribute('role')?.trim();
  const isHiddenInput =
    tagName === 'INPUT' && control?.getAttribute('type')?.toLowerCase() === 'hidden';
  const isRemovedFromAccessibilityTree =
    isHiddenInput ||
    control?.hasAttribute('hidden') ||
    control?.getAttribute('aria-hidden') === 'true' ||
    control?.hasAttribute('inert');
  const isNativeControl =
    tagName === 'BUTTON' ||
    (tagName === 'INPUT' && !isHiddenInput) ||
    tagName === 'SELECT' ||
    tagName === 'TEXTAREA';
  const isAccessibleCustomControl =
    !isNativeControl && role !== undefined && CUSTOM_CONTROL_ROLES.has(role);
  const hasAccessibleControlSemantics =
    !isRemovedFromAccessibilityTree && (role ? isAccessibleCustomControl : isNativeControl);

  if (
    meaningfulText ||
    !control ||
    !hasAccessibleControlSemantics ||
    !hasExpectedControlProps(control, expectedControlProps)
  ) {
    throw new TypeError(
      'Field must render exactly one direct accessible control and spread every supplied control prop onto it.',
    );
  }

  assertControlSupportsFieldState(control, role, expectedControlProps);
}

const READ_ONLY_ROLES = new Set([
  'checkbox',
  'combobox',
  'listbox',
  'searchbox',
  'slider',
  'spinbutton',
  'switch',
  'textbox',
]);

const REQUIRED_ROLES = new Set([
  'checkbox',
  'combobox',
  'listbox',
  'searchbox',
  'spinbutton',
  'switch',
  'textbox',
]);

const READ_ONLY_INPUT_TYPES = new Set([
  'date',
  'datetime-local',
  'email',
  'month',
  'number',
  'password',
  'search',
  'tel',
  'text',
  'time',
  'url',
  'week',
]);

const REQUIRED_INPUT_TYPES = new Set([...READ_ONLY_INPUT_TYPES, 'checkbox', 'file', 'radio']);

function assertControlSupportsFieldState(
  control: Element,
  role: string | undefined,
  expected: FieldControlProps,
): void {
  const descriptor = role ?? control.tagName.toLowerCase();

  if (expected['aria-readonly'] && !supportsFieldState(control, role, 'read-only')) {
    throw new TypeError(`Field ${descriptor} control cannot represent read-only state.`);
  }

  if (expected['aria-required'] && !supportsFieldState(control, role, 'required')) {
    throw new TypeError(`Field ${descriptor} control cannot represent required state.`);
  }
}

function supportsFieldState(
  control: Element,
  role: string | undefined,
  state: 'read-only' | 'required',
): boolean {
  if (role) return (state === 'read-only' ? READ_ONLY_ROLES : REQUIRED_ROLES).has(role);

  const tagName = control.tagName;
  if (tagName === 'TEXTAREA') return true;
  if (tagName === 'SELECT') return state === 'required';
  if (tagName !== 'INPUT') return false;

  const inputType = control.getAttribute('type')?.toLowerCase() || 'text';
  return (state === 'read-only' ? READ_ONLY_INPUT_TYPES : REQUIRED_INPUT_TYPES).has(inputType);
}

function hasExpectedControlProps(control: Element, expected: FieldControlProps): boolean {
  const ownedAttributes: readonly (readonly [string, string | undefined])[] = [
    ['id', expected.id],
    ['aria-busy', serializeAttribute(expected['aria-busy'])],
    ['aria-describedby', expected['aria-describedby']],
    ['aria-disabled', serializeAttribute(expected['aria-disabled'])],
    ['aria-invalid', serializeAttribute(expected['aria-invalid'])],
    ['aria-labelledby', expected['aria-labelledby']],
    ['aria-readonly', serializeAttribute(expected['aria-readonly'])],
    ['aria-required', serializeAttribute(expected['aria-required'])],
    ['disabled', serializeBooleanAttribute(expected.disabled)],
    ['readonly', serializeBooleanAttribute(expected.readOnly)],
    ['required', serializeBooleanAttribute(expected.required)],
  ];

  const ownedAttributesMatch = ownedAttributes.every(([name, value]) =>
    value === undefined ? !control.hasAttribute(name) : control.getAttribute(name) === value,
  );
  const ownedTabIndexMatches =
    expected.tabIndex === undefined ||
    control.getAttribute('tabindex') === expected.tabIndex.toString();

  return ownedAttributesMatch && ownedTabIndexMatches;
}

function serializeAttribute(value: true | undefined): string | undefined {
  return value === undefined ? undefined : 'true';
}

function serializeBooleanAttribute(value: true | undefined): string | undefined {
  return value === undefined ? undefined : '';
}
