'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  useMemo,
  type ReactElement,
  type SyntheticEvent,
} from 'react';

import {useFieldGroupDisabled} from '../fields/field-group-context.js';
import {Button} from '../actions/button.js';
import {InlineGroup} from '../layout/inline-group.js';
import {assertFileAcceptanceProps} from '../files/file-validation.js';
import {defaultAssetLabels, type AssetState} from './asset-session.js';
import {createSourceSession, type SourceSession} from './source-session.js';
import {MarkdownPreview} from './markdown-preview.js';
import type {MarkdownEditorProps, MarkdownEditorControls} from './markdown-types.js';

import {englishLabels} from './markdown-labels.js';

const unavailableControls: MarkdownEditorControls = {
  execute: () => false,
  canExecute: () => false,
  isActive: () => false,
  canOpenLink: false,
  openLink: () => false,
};

export function MarkdownEditor({
  renderToolbar,
  wikiLinks,
  assets,
  defaultValue = '',
  value,
  onChange,
  label,
  description,
  errorMessage,
  isDisabled = false,
  isInvalid = false,
  isReadOnly = false,
  isRequired = false,
  isPending = false,
  pendingMessage,
  isLocked = false,
  lockMessage,
  reserveSupportSpace = false,
  form,
  name,
  mode = 'live-preview',
  size = 'regular',
  labels = englishLabels,
  validate,
  validationBehavior = 'native',
}: MarkdownEditorProps): ReactElement {
  if (assets) assertFileAcceptanceProps(assets);
  const inheritedDisabled = useFieldGroupDisabled();
  const disabled = isDisabled || inheritedDisabled;
  const readonly = isReadOnly || isPending || isLocked;
  const [localValue, setLocalValue] = useState(value ?? defaultValue);
  const currentValue = value ?? localValue;
  const [initialValue] = useState(currentValue);
  const [mounted, setMounted] = useState(false);
  const [commandControls, setCommandControls] = useState(unavailableControls);
  const [assetState, setAssetState] = useState<AssetState>({kind: 'idle'});
  const assetLabels = assets?.labels ?? defaultAssetLabels;
  const acquiring = assetState.kind === 'pending';
  const [attempted, setAttempted] = useState(false);
  const [reconcileVersion, setReconcileVersion] = useState(0);
  const [position, setPosition] = useState({line: 1, column: 1});
  const textarea = useRef<HTMLTextAreaElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const session = useRef<SourceSession | null>(null);
  const previousMode = useRef(mode);
  const ownsFocus = useRef(false);
  const latest = useRef({onChange, currentValue, disabled, readonly, mode});
  const baseId = useId();
  const sourceId = `${baseId}-source`;
  const labelId = `${baseId}-label`;
  const contextId = `${baseId}-context`;
  const errorId = `${baseId}-error`;
  const descriptionId = `${baseId}-description`;
  const lockId = `${baseId}-lock`;
  const pendingId = `${baseId}-pending`;
  const assetId = `${baseId}-assets`;
  const result = validate?.(currentValue);
  const customError =
    typeof result === 'string' ? result : Array.isArray(result) ? result.join(' ') : '';
  const validationError =
    customError || (isRequired && currentValue.length === 0 ? labels.required : '');
  const invalid =
    isInvalid ||
    (!readonly && !disabled && (validationBehavior === 'aria' || attempted) && !!validationError);
  const visibleError = invalid ? errorMessage || validationError : '';
  const describedBy = [
    contextId,
    description ? descriptionId : '',
    visibleError ? errorId : '',
    isLocked ? lockId : '',
    isPending ? pendingId : '',
    assetState.kind !== 'idle' ? assetId : '',
  ]
    .filter(Boolean)
    .join(' ');
  const attributes = useMemo(
    () => ({
      id: sourceId,
      'aria-labelledby': labelId,
      'aria-describedby': describedBy,
      'aria-required': String(isRequired),
      'aria-invalid': String(invalid),
      'aria-readonly': String(readonly || disabled),
      'aria-disabled': String(disabled),
      'aria-busy': String(isPending || acquiring),
      tabindex: disabled ? '-1' : '0',
    }),
    [sourceId, labelId, describedBy, isRequired, invalid, readonly, disabled, isPending, acquiring],
  );

  useEffect(() => {
    latest.current = {onChange, currentValue, disabled, readonly, mode};
  });
  useEffect(() => {
    const parent = host.current;
    if (!parent || mode === 'preview' || session.current) return;
    const active = document.activeElement === textarea.current;
    const editor = createSourceSession(
      parent,
      latest.current.currentValue,
      {
        attributes: {},
        ...(renderToolbar ? {onControls: setCommandControls} : {}),
        labels,
        ...(wikiLinks ? {wikiLinks} : {}),
        ...(assets ? {assets} : {}),
        onAssetState: setAssetState,
        livePreview: mode === 'live-preview',
        isDisabled: latest.current.disabled,
        isReadOnly: latest.current.readonly,
      },
      (next) => {
        setLocalValue(next);
        setReconcileVersion((version) => version + 1);
        latest.current.onChange?.(next);
      },
      (line, column) => setPosition({line, column}),
    );
    session.current = editor;
    setMounted(true);
    if (active && latest.current.mode !== 'preview') editor.focus();
  }, [mode, labels, renderToolbar, wikiLinks, assets]);
  useEffect(
    () => () => {
      session.current?.destroy();
      session.current = null;
    },
    [],
  );
  useEffect(() => {
    session.current?.configure({
      attributes,
      ...(renderToolbar ? {onControls: setCommandControls} : {}),
      labels,
      ...(wikiLinks ? {wikiLinks} : {}),
      ...(assets ? {assets} : {}),
      onAssetState: setAssetState,
      livePreview: mode === 'live-preview',
      isDisabled: disabled,
      isReadOnly: readonly || mode === 'preview',
    });
  }, [attributes, renderToolbar, labels, mode, disabled, readonly, wikiLinks, assets]);
  useEffect(() => {
    session.current?.replace(currentValue);
  }, [currentValue, reconcileVersion]);
  useEffect(() => {
    if (previousMode.current === mode) return;
    if (ownsFocus.current && !disabled) {
      if (mode === 'preview') preview.current?.focus();
      else session.current?.focus();
    }
    previousMode.current = mode;
    session.current?.refresh();
  }, [mode, disabled]);
  useEffect(() => {
    const control = textarea.current;
    if (!control) return;
    control.setCustomValidity(
      validationBehavior === 'native' && !readonly && !disabled
        ? isInvalid
          ? errorMessage || labels.required
          : customError
        : '',
    );
  }, [
    validationBehavior,
    readonly,
    disabled,
    isInvalid,
    errorMessage,
    labels.required,
    customError,
  ]);
  useEffect(() => {
    const owner = textarea.current?.form;
    if (!owner) return;
    let disposed = false;
    const reset = (event: Event) => {
      // Wait for later reset handlers to cancel the native operation.
      queueMicrotask(() => {
        if (event.defaultPrevented || disposed) return;
        setAttempted(false);
        setLocalValue(initialValue);
        setReconcileVersion((version) => version + 1);
        latest.current.onChange?.(initialValue);
        session.current?.replace(initialValue, true);
      });
    };
    owner.addEventListener('reset', reset);
    return () => {
      disposed = true;
      owner.removeEventListener('reset', reset);
    };
  }, [form, initialValue]);

  const editable = mounted && mode !== 'preview' && !readonly && !disabled;
  const controls: MarkdownEditorControls = {
    execute: (command) => editable && commandControls.execute(command),
    canExecute: (command) => editable && commandControls.canExecute(command),
    isActive: (command) => mounted && commandControls.isActive(command),
    canOpenLink: mounted && mode !== 'preview' && !disabled && commandControls.canOpenLink,
    openLink: () => mounted && mode !== 'preview' && !disabled && commandControls.openLink(),
  };

  const preventDisabled = (event: SyntheticEvent) => {
    if (!disabled) return;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      data-wcl-field=""
      data-wcl-markdown-editor=""
      data-size={size}
      data-mode={mode}
      data-toolbar={!!renderToolbar || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readonly || undefined}
      data-invalid={invalid || undefined}
      data-required={isRequired || undefined}
      data-reserve-support={reserveSupportSpace || undefined}
      data-locked={isLocked || undefined}
      {...(isPending ? {'data-wcl-pending': ''} : {})}
      aria-busy={isPending || acquiring || undefined}
    >
      <label
        data-wcl-field-label=""
        id={labelId}
        htmlFor={mode !== 'preview' ? sourceId : undefined}
        onClick={() => {
          if (mode !== 'preview' && !disabled) session.current?.focus();
        }}
      >
        {label}
        {isRequired ? (
          <span aria-hidden="true" data-wcl-field-required="">
            *
          </span>
        ) : null}
      </label>
      {renderToolbar ? <div data-wcl-markdown-toolbar="">{renderToolbar(controls)}</div> : null}
      <div
        data-wcl-field-control=""
        onFocusCapture={() => {
          ownsFocus.current = true;
        }}
        onBlurCapture={(event) => {
          if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget))
            ownsFocus.current = false;
        }}
        onClickCapture={preventDisabled}
        onPointerDownCapture={preventDisabled}
        onKeyDownCapture={(event) => {
          if (event.key !== 'Tab') preventDisabled(event);
        }}
      >
        <textarea
          ref={textarea}
          id={mounted || mode === 'preview' ? undefined : sourceId}
          data-wcl-markdown-bridge=""
          data-enhanced={mounted || mode === 'preview' || undefined}
          aria-hidden={mounted || mode === 'preview' || undefined}
          aria-labelledby={labelId}
          aria-describedby={describedBy}
          aria-multiline="true"
          aria-invalid={invalid || undefined}
          aria-required={isRequired || undefined}
          tabIndex={mounted || mode === 'preview' || disabled ? -1 : undefined}
          name={name}
          form={form}
          value={currentValue}
          disabled={disabled}
          readOnly={readonly}
          required={validationBehavior === 'native' && isRequired}
          onChange={(event) => {
            setLocalValue(event.target.value);
            onChange?.(event.target.value);
          }}
          onInvalid={(event) => {
            event.preventDefault();
            setAttempted(true);
            if (mode !== 'preview') session.current?.focus();
            else preview.current?.focus();
          }}
        />
        <div ref={host} data-wcl-markdown-source="" hidden={mode === 'preview'} />
        {mode === 'preview' ? (
          <div
            ref={preview}
            data-wcl-markdown-preview=""
            role="region"
            aria-labelledby={labelId}
            aria-describedby={describedBy}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : 0}
          >
            <MarkdownPreview
              value={currentValue}
              prefix={`wcl-${baseId}-`}
              labels={labels}
              isDisabled={disabled}
              {...(wikiLinks ? {wikiLinks} : {})}
            />
          </div>
        ) : null}
      </div>
      <div data-wcl-markdown-context="" id={contextId}>
        <span>
          {mode === 'live-preview'
            ? labels.livePreview
            : mode === 'source'
              ? labels.source
              : labels.preview}
        </span>
        {mode !== 'preview' ? <span>{labels.position(position.line, position.column)}</span> : null}
      </div>
      <div data-wcl-field-support="">
        {assetState.kind !== 'idle' ? (
          <div data-wcl-markdown-assets="">
            <div id={assetId} role={acquiring ? 'status' : 'alert'} aria-atomic="true">
              {assetState.kind === 'pending' ? (
                <span data-wcl-field-pending="">{assetLabels.pending(assetState.count)}</span>
              ) : null}
              {assetState.kind === 'error' ? (
                <span data-wcl-field-error="">{assetState.message}</span>
              ) : null}
              {assetState.rejections.length ? (
                <span data-wcl-field-error="">{assetLabels.rejected(assetState.rejections)}</span>
              ) : null}
            </div>
            {!acquiring ? (
              <InlineGroup gap="tight" wrap>
                {assetState.kind === 'error' ? (
                  <Button
                    size="compact"
                    isDisabled={disabled || readonly || mode === 'preview'}
                    onPress={() => session.current?.retryAssets()}
                  >
                    {assetLabels.retry}
                  </Button>
                ) : null}
                <Button size="compact" onPress={() => session.current?.dismissAssets()}>
                  {assetLabels.dismiss}
                </Button>
              </InlineGroup>
            ) : null}
          </div>
        ) : null}
        {description ? (
          <span data-wcl-field-description="" id={descriptionId}>
            {description}
          </span>
        ) : null}
        {visibleError ? (
          <span data-wcl-field-error="" id={errorId}>
            {visibleError}
          </span>
        ) : null}
        {isLocked ? (
          <span data-wcl-markdown-lock="" id={lockId}>
            {lockMessage}
          </span>
        ) : null}
        {isPending ? (
          <span
            data-wcl-field-pending=""
            id={pendingId}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {pendingMessage}
          </span>
        ) : null}
      </div>
    </div>
  );
}
