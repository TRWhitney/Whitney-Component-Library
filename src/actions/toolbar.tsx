'use client';

import {Toolbar as AriaToolbar} from 'react-aria-components/Toolbar';
import type {KeyboardEvent, ReactElement, ReactNode} from 'react';

import {
  registeredActionControls,
  useRenderedActionValidation,
  type ActionPartKind,
} from './action-children.js';
import type {ActionOrientation} from './action-types.js';

export interface ToolbarProps {
  readonly children: ReactNode;
  readonly label: string;
  readonly orientation?: ActionOrientation;
}

const TOOLBAR_ACTION_KINDS = [
  'button',
  'icon-button',
  'toggle-button',
] as const satisfies readonly ActionPartKind[];

function inheritedDirection(element: HTMLElement): 'ltr' | 'rtl' {
  const computedDirection = element.ownerDocument.defaultView?.getComputedStyle(element).direction;
  if (computedDirection === 'ltr' || computedDirection === 'rtl') return computedDirection;

  return element.closest<HTMLElement>('[dir]')?.dir.toLowerCase() === 'rtl' ? 'rtl' : 'ltr';
}

function moveHorizontalFocus(event: KeyboardEvent<HTMLDivElement>, toolbar: HTMLDivElement | null) {
  if ((event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') || !toolbar) return;
  const ElementConstructor = toolbar.ownerDocument.defaultView?.Element;
  const target = event.target;
  if (!ElementConstructor || !(target instanceof ElementConstructor) || !toolbar.contains(target)) {
    return;
  }

  const controls = registeredActionControls(toolbar, TOOLBAR_ACTION_KINDS).filter(
    (control) => !control.disabled,
  );
  const activeControl = controls.find((control) => control.contains(target));
  if (!activeControl) return;

  const activeIndex = controls.indexOf(activeControl);
  if (activeIndex < 0) return;

  const movesForward = (event.key === 'ArrowRight') === (inheritedDirection(toolbar) === 'ltr');
  const nextControl = controls[activeIndex + (movesForward ? 1 : -1)];

  event.preventDefault();
  event.stopPropagation();
  nextControl?.focus();
}

export function Toolbar({children, label, orientation = 'horizontal'}: ToolbarProps): ReactElement {
  const {rootRef: toolbarRef, setRootRef} = useRenderedActionValidation<HTMLDivElement>(
    TOOLBAR_ACTION_KINDS,
    'Toolbar',
    'Button, IconButton, or ToggleButton',
  );

  return (
    <div
      data-wcl-toolbar-direction-boundary=""
      onKeyDownCapture={
        orientation === 'horizontal'
          ? (event) => moveHorizontalFocus(event, toolbarRef.current)
          : undefined
      }
    >
      <AriaToolbar
        aria-label={label}
        data-wcl-toolbar=""
        data-orientation={orientation}
        orientation={orientation}
        ref={setRootRef}
      >
        {children}
      </AriaToolbar>
    </div>
  );
}
