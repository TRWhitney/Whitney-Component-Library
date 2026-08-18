'use client';

import {Button} from 'react-aria-components/Button';
import {ComboBox as AriaComboBox, useFilter} from 'react-aria-components/ComboBox';
import {Group} from 'react-aria-components/Group';
import {Input} from 'react-aria-components/Input';
import {Label} from 'react-aria-components/Label';
import {Popover} from 'react-aria-components/Popover';
import type {ReactElement} from 'react';

import {useFieldGroupDisabled} from '../fields/field-group-context.js';
import {
  CollectionList,
  SelectionChevron,
  collectionEmptyContent,
  renderSelectionSupport,
} from './selection-parts.js';
import type {CollectionOption, ComboBoxProps} from './selection-types.js';

export function ComboBox<Value extends string>({
  defaultInputValue,
  defaultValue,
  description,
  emptyMessage,
  errorMessage,
  filterBehavior = 'contains',
  form,
  inputValue,
  isDisabled = false,
  isInvalid,
  isLoading = false,
  isReadOnly = false,
  isRequired = false,
  label,
  loadingMessage,
  name,
  onChange,
  onInputChange,
  options,
  placeholder,
  validate,
  validationBehavior = 'native',
  value,
}: ComboBoxProps<Value>): ReactElement {
  const inheritedDisabled = useFieldGroupDisabled();
  const disabled = inheritedDisabled || isDisabled;
  const disabledKeys = options.filter((option) => option.isDisabled).map((option) => option.value);
  const {contains, startsWith} = useFilter({sensitivity: 'base'});
  const emptyContent = collectionEmptyContent(emptyMessage, isLoading, loadingMessage);
  const usesManualCollection = filterBehavior === 'manual';
  const defaultFilter = filterBehavior === 'startsWith' ? startsWith : contains;

  return (
    <AriaComboBox<CollectionOption<Value>>
      aria-busy={isLoading || undefined}
      allowsEmptyCollection
      data-wcl-combo-box=""
      data-wcl-field=""
      data-wcl-selection-field=""
      defaultFilter={defaultFilter}
      disabledKeys={disabledKeys}
      isDisabled={disabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      validationBehavior={validationBehavior}
      {...(form === undefined ? {} : {form})}
      {...(name === undefined ? {} : {name})}
      {...(usesManualCollection ? {items: options} : {defaultItems: options})}
      {...(validate === undefined
        ? {}
        : {
            validate: (state: {readonly value: string | number | null}) =>
              validate(state.value as Value | null),
          })}
      {...(isInvalid === undefined ? {} : {isInvalid})}
      {...(isLoading ? {'data-wcl-loading': '', 'data-wcl-pending': ''} : {})}
      {...(defaultInputValue === undefined ? {} : {defaultInputValue})}
      {...(inputValue === undefined ? {} : {inputValue})}
      {...(onInputChange === undefined ? {} : {onInputChange})}
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
      <Group data-wcl-combo-control="" data-wcl-field-control="">
        <Input
          aria-busy={isLoading || undefined}
          data-wcl-field-input=""
          {...(placeholder === undefined ? {} : {placeholder})}
        />
        <Button data-wcl-combo-trigger="">
          <SelectionChevron />
        </Button>
      </Group>
      {renderSelectionSupport({description, errorMessage, isLoading, loadingMessage})}
      <Popover data-wcl-selection-popover="" offset={6} placement="bottom start">
        <CollectionList emptyContent={emptyContent} options={options} />
      </Popover>
    </AriaComboBox>
  );
}
