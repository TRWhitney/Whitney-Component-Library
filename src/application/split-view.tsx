'use client';

import {Button as AriaButton} from 'react-aria-components/Button';
import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactElement,
} from 'react';

import type {SplitViewCollapsedPane, SplitViewProps} from './application-types.js';

const DEFAULT_PRIMARY_SIZE = 60;
const DEFAULT_MIN_PRIMARY_SIZE = 25;
const DEFAULT_MAX_PRIMARY_SIZE = 75;
const KEYBOARD_STEP = 5;
const useIsomorphicLayoutEffect = typeof document === 'undefined' ? useEffect : useLayoutEffect;

function validateBounds(minimum: number, maximum: number, size: number): void {
  if (![minimum, maximum, size].every(Number.isFinite)) {
    throw new Error('SplitView sizes must be finite percentages.');
  }
  if (minimum < 10 || maximum > 90) {
    throw new Error('SplitView minimum and maximum sizes must remain between 10 and 90 percent.');
  }
  if (minimum >= maximum) {
    throw new Error('SplitView minimum size must be less than its maximum size.');
  }
  if (size < minimum || size > maximum) {
    throw new Error('SplitView primary size must remain within its minimum and maximum sizes.');
  }
}

function clampSize(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, Math.round(value)));
}

function elementDirection(element: HTMLElement): 'ltr' | 'rtl' {
  const explicitDirection = element.closest<HTMLElement>('[dir]')?.dir;
  if (explicitDirection === 'rtl') return 'rtl';
  if (explicitDirection === 'ltr') return 'ltr';
  return element.ownerDocument.defaultView?.getComputedStyle(element).direction === 'rtl'
    ? 'rtl'
    : 'ltr';
}

type Pane = Exclude<SplitViewCollapsedPane, null>;

interface PointerDrag {
  readonly pointerId: number;
  readonly startClientX: number;
  readonly startSize: number;
}

function PaneToggleIcon({
  action,
  pane,
}: {
  readonly action: 'collapse' | 'restore';
  readonly pane: Pane;
}): ReactElement {
  const targetMark = pane === 'primary' ? 'M3.5 8h2.5' : 'M10 8h2.5';
  const restoreMark = pane === 'primary' ? 'M4.75 6.75v2.5' : 'M11.25 6.75v2.5';
  const targetX = pane === 'primary' ? 2 : 8.5;
  return (
    <svg
      aria-hidden="true"
      data-action={action}
      data-pane={pane}
      data-wcl-split-view-pane-icon=""
      viewBox="0 0 16 16"
    >
      <rect data-wcl-split-view-pane-target="" height="10" rx="1" width="5.5" x={targetX} y="3" />
      <rect height="11" rx="1.5" width="13" x="1.5" y="2.5" />
      <path d="M8 2.5v11" />
      <path d={targetMark} />
      {action === 'restore' ? <path d={restoreMark} /> : null}
    </svg>
  );
}

interface PaneControlProps {
  readonly action: 'collapse' | 'restore';
  readonly controls: string;
  readonly label: string;
  readonly onPress: () => void;
  readonly pane: Pane;
}

const PaneControl = forwardRef<HTMLButtonElement, PaneControlProps>(function PaneControl(
  {action, controls, label, onPress, pane},
  ref,
): ReactElement {
  return (
    <AriaButton
      aria-controls={controls}
      aria-expanded={action === 'collapse'}
      aria-label={label}
      data-action={action}
      data-pane={pane}
      data-wcl-split-view-pane-control=""
      onPress={onPress}
      ref={ref}
    >
      <PaneToggleIcon action={action} pane={pane} />
    </AriaButton>
  );
});

type SplitStyle = CSSProperties & {'--wcl-split-primary-size': string};

export function SplitView(props: SplitViewProps): ReactElement {
  const {
    ariaLabel,
    collapsePrimaryLabel,
    collapseSecondaryLabel,
    collapsedPane: controlledCollapsedPane,
    defaultCollapsedPane,
    defaultPrimarySize = DEFAULT_PRIMARY_SIZE,
    maxPrimarySize = DEFAULT_MAX_PRIMARY_SIZE,
    minPrimarySize = DEFAULT_MIN_PRIMARY_SIZE,
    onCollapsedPaneChange,
    onPrimarySizeChange,
    primary,
    primaryLabel,
    primarySize,
    resizeLabel,
    restorePrimaryLabel,
    restoreSecondaryLabel,
    secondary,
    secondaryLabel,
  } = props;
  const initialSize = primarySize ?? defaultPrimarySize;
  validateBounds(minPrimarySize, maxPrimarySize, initialSize);

  const [uncontrolledSize, setUncontrolledSize] = useState(initialSize);
  const [uncontrolledCollapsedPane, setUncontrolledCollapsedPane] =
    useState<SplitViewCollapsedPane>(defaultCollapsedPane ?? null);
  const [isStacked, setStacked] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const separatorRef = useRef<HTMLDivElement>(null);
  const primaryControlRef = useRef<HTMLButtonElement>(null);
  const secondaryControlRef = useRef<HTMLButtonElement>(null);
  const focusedPaneRef = useRef<Pane | null>(null);
  const pointerDragRef = useRef<PointerDrag | null>(null);
  const separatorFocusedRef = useRef(false);
  const primaryId = `wcl-split-primary-${useId().replaceAll(':', '')}`;
  const secondaryId = `wcl-split-secondary-${useId().replaceAll(':', '')}`;
  const size = primarySize ?? uncontrolledSize;
  const collapsedPane =
    controlledCollapsedPane === undefined ? uncontrolledCollapsedPane : controlledCollapsedPane;
  const collapsed = collapsedPane !== null;
  validateBounds(minPrimarySize, maxPrimarySize, size);

  const updateSize = (nextSize: number) => {
    const boundedSize = clampSize(nextSize, minPrimarySize, maxPrimarySize);
    if (boundedSize === size) return;
    if (primarySize === undefined) setUncontrolledSize(boundedSize);
    onPrimarySizeChange?.(boundedSize);
  };

  const updateCollapsedPane = (nextPane: SplitViewCollapsedPane) => {
    if (controlledCollapsedPane === undefined) setUncontrolledCollapsedPane(nextPane);
    onCollapsedPaneChange?.(nextPane);
  };

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const separator = separatorRef.current;
    const ResizeObserverConstructor = root?.ownerDocument.defaultView?.ResizeObserver;
    const view = root?.ownerDocument.defaultView;
    if (!root || !separator || !ResizeObserverConstructor || !view) return;

    const measure = () => setStacked(view.getComputedStyle(separator).display === 'none');
    measure();
    const observer = new ResizeObserverConstructor(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useIsomorphicLayoutEffect(() => {
    const separatorWasFocused =
      separatorFocusedRef.current ||
      separatorRef.current === separatorRef.current?.ownerDocument.activeElement;
    if (collapsedPane === 'primary' && focusedPaneRef.current === 'primary') {
      primaryControlRef.current?.focus();
    }
    if (collapsedPane === 'secondary' && focusedPaneRef.current === 'secondary') {
      secondaryControlRef.current?.focus();
    }
    if ((collapsed || isStacked) && separatorWasFocused) {
      const control =
        collapsedPane === 'secondary' ? secondaryControlRef.current : primaryControlRef.current;
      control?.focus();
      separatorFocusedRef.current = false;
    }
    if (collapsedPane !== null) focusedPaneRef.current = null;
  }, [collapsed, collapsedPane, isStacked]);

  const onSeparatorKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (collapsed || isStacked) return;
    const direction = elementDirection(event.currentTarget);
    const increaseKey = direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const decreaseKey = direction === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    let nextSize: number | undefined;
    if (event.key === increaseKey) nextSize = size + KEYBOARD_STEP;
    if (event.key === decreaseKey) nextSize = size - KEYBOARD_STEP;
    if (event.key === 'Home') nextSize = minPrimarySize;
    if (event.key === 'End') nextSize = maxPrimarySize;
    if (nextSize === undefined) return;
    event.preventDefault();
    updateSize(nextSize);
  };

  const onSeparatorPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (collapsed || isStacked) return;
    if (!event.currentTarget.hasPointerCapture?.(event.pointerId)) return;
    const root = rootRef.current;
    if (!root) return;
    const bounds = root.getBoundingClientRect();
    if (bounds.width <= 0) return;
    const drag = pointerDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const direction = elementDirection(root);
    const directionMultiplier = direction === 'rtl' ? -1 : 1;
    const pointerDelta = (event.clientX - drag.startClientX) * directionMultiplier;
    updateSize(drag.startSize + (pointerDelta / bounds.width) * 100);
  };

  const style: SplitStyle = {'--wcl-split-primary-size': `${size}%`};

  return (
    <div
      aria-label={ariaLabel}
      data-collapsed={collapsed || undefined}
      data-collapsed-pane={collapsedPane ?? undefined}
      data-stacked={isStacked || undefined}
      data-wcl-split-view=""
      ref={rootRef}
      role="group"
      style={style}
    >
      <div data-wcl-split-view-layout="">
        <section
          aria-label={primaryLabel}
          data-wcl-split-view-primary=""
          hidden={collapsedPane === 'primary'}
          id={primaryId}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) focusedPaneRef.current = null;
          }}
          onFocusCapture={() => {
            focusedPaneRef.current = 'primary';
          }}
        >
          {primary}
        </section>
        <div data-wcl-split-view-rail="">
          <div
            aria-disabled={collapsed || isStacked || undefined}
            aria-label={resizeLabel}
            aria-orientation={isStacked ? 'horizontal' : 'vertical'}
            aria-valuemax={maxPrimarySize}
            aria-valuemin={minPrimarySize}
            aria-valuenow={size}
            data-wcl-split-view-separator=""
            onBlur={(event) => {
              const view = event.currentTarget.ownerDocument.defaultView;
              separatorFocusedRef.current =
                event.currentTarget.getAttribute('aria-disabled') === 'true' ||
                view?.getComputedStyle(event.currentTarget).display === 'none';
            }}
            onFocus={() => {
              separatorFocusedRef.current = true;
            }}
            onKeyDown={onSeparatorKeyDown}
            onPointerDown={(event) => {
              if (!collapsed && !isStacked) {
                pointerDragRef.current = {
                  pointerId: event.pointerId,
                  startClientX: event.clientX,
                  startSize: size,
                };
                event.currentTarget.setPointerCapture?.(event.pointerId);
              }
            }}
            onPointerMove={onSeparatorPointerMove}
            onPointerUp={(event) => {
              if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
                event.currentTarget.releasePointerCapture?.(event.pointerId);
              }
              if (pointerDragRef.current?.pointerId === event.pointerId) {
                pointerDragRef.current = null;
              }
            }}
            onPointerCancel={(event) => {
              if (pointerDragRef.current?.pointerId === event.pointerId) {
                pointerDragRef.current = null;
              }
            }}
            ref={separatorRef}
            role="separator"
            tabIndex={collapsed || isStacked ? -1 : 0}
          />
          <div data-wcl-split-view-pane-controls="">
            {collapsedPane === null || collapsedPane === 'primary' ? (
              <PaneControl
                action={collapsedPane === 'primary' ? 'restore' : 'collapse'}
                controls={primaryId}
                label={collapsedPane === 'primary' ? restorePrimaryLabel : collapsePrimaryLabel}
                onPress={() => updateCollapsedPane(collapsedPane === 'primary' ? null : 'primary')}
                pane="primary"
                ref={primaryControlRef}
              />
            ) : null}
            {collapsedPane === null || collapsedPane === 'secondary' ? (
              <PaneControl
                action={collapsedPane === 'secondary' ? 'restore' : 'collapse'}
                controls={secondaryId}
                label={
                  collapsedPane === 'secondary' ? restoreSecondaryLabel : collapseSecondaryLabel
                }
                onPress={() =>
                  updateCollapsedPane(collapsedPane === 'secondary' ? null : 'secondary')
                }
                pane="secondary"
                ref={secondaryControlRef}
              />
            ) : null}
          </div>
        </div>
        <section
          aria-label={secondaryLabel}
          data-wcl-split-view-secondary=""
          hidden={collapsedPane === 'secondary'}
          id={secondaryId}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              focusedPaneRef.current = null;
            }
          }}
          onFocusCapture={() => {
            focusedPaneRef.current = 'secondary';
          }}
        >
          {secondary}
        </section>
      </div>
    </div>
  );
}
