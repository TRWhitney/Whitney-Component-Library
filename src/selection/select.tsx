'use client';

import {Button} from 'react-aria-components/Button';
import {Label} from 'react-aria-components/Label';
import {Popover} from 'react-aria-components/Popover';
import {Select as AriaSelect, SelectValue} from 'react-aria-components/Select';
import {useRef, type ReactElement} from 'react';

import {useFieldGroupDisabled} from '../fields/field-group-context.js';
import {
  CollectionList,
  SelectionChevron,
  collectionEmptyContent,
  renderSelectionSupport,
} from './selection-parts.js';
import type {CollectionOption, SelectProps} from './selection-types.js';

export function Select<Value extends string>({
  defaultValue,
  description,
  emptyMessage,
  errorMessage,
  form,
  isDisabled = false,
  isInvalid,
  isLoading = false,
  isRequired = false,
  label,
  reserveSupportSpace = false,
  loadingMessage,
  name,
  onChange,
  options,
  placeholder,
  validate,
  validationBehavior = 'native',
  value,
}: SelectProps<Value>): ReactElement {
  const inheritedDisabled = useFieldGroupDisabled();
  const disabled = inheritedDisabled || isDisabled;
  const disabledKeys = options.filter((option) => option.isDisabled).map((option) => option.value);
  const emptyContent = collectionEmptyContent(emptyMessage, isLoading, loadingMessage);
  const openingPointer = useRef<{id: number; x: number; y: number} | null>(null);

  return (
    <AriaSelect<CollectionOption<Value>>
      aria-busy={isLoading || undefined}
      allowsEmptyCollection
      data-reserve-support={reserveSupportSpace || undefined}
      data-wcl-field=""
      data-wcl-selection-field=""
      disabledKeys={disabledKeys}
      isDisabled={disabled}
      isRequired={isRequired}
      validationBehavior={validationBehavior}
      {...(form === undefined ? {} : {form})}
      {...(name === undefined ? {} : {name})}
      {...(validate === undefined
        ? {}
        : {validate: (nextValue: string | number) => validate(nextValue as Value)})}
      {...(isInvalid === undefined ? {} : {isInvalid})}
      {...(isLoading ? {'data-wcl-loading': '', 'data-wcl-pending': ''} : {})}
      {...(defaultValue === undefined ? {} : {defaultValue})}
      {...(onChange === undefined
        ? {}
        : {onChange: (nextValue: string | number | null) => onChange(nextValue as Value | null)})}
      {...(value === undefined ? {} : {value})}
    >
      <Label data-wcl-field-label="">
        {label}
        {isRequired ? (
          <span aria-hidden="true" data-wcl-field-required="">
            *
          </span>
        ) : null}
      </Label>
      <Button
        onPointerDownCapture={(event) => {
          openingPointer.current =
            event.pointerType === 'mouse'
              ? {id: event.pointerId, x: event.clientX, y: event.clientY}
              : null;
        }}
        aria-busy={isLoading || undefined}
        data-wcl-field-control=""
        data-wcl-select-trigger=""
      >
        <SelectValue<CollectionOption<Value>> data-wcl-select-value="">
          {({isPlaceholder, selectedText}) =>
            isPlaceholder ? (placeholder ?? 'Select an option') : selectedText
          }
        </SelectValue>
        <SelectionChevron />
      </Button>
      {renderSelectionSupport({description, errorMessage, isLoading, loadingMessage})}
      <Popover
        data-wcl-selection-popover=""
        offset={6}
        placement="bottom start"
        onPointerDownCapture={() => {
          openingPointer.current = null;
        }}
        onPointerUpCapture={(event) => {
          const origin = openingPointer.current;
          openingPointer.current = null;
          // Positioning can move an option beneath the opening click. Keep deliberate
          // trigger-to-option drags, but do not select on a stationary opening release.
          if (
            origin &&
            origin.id === event.pointerId &&
            Math.hypot(event.clientX - origin.x, event.clientY - origin.y) <= 4
          ) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
      >
        <CollectionList emptyContent={emptyContent} options={options} />
      </Popover>
    </AriaSelect>
  );
}
