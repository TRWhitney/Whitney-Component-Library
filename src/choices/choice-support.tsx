import {useId, type ReactElement, type ReactNode} from 'react';

interface ChoiceIds {
  readonly describedBy: string | undefined;
  readonly descriptionId: string;
  readonly errorId: string;
  readonly labelId: string;
}

export function useChoiceIds(hasDescription: boolean, hasError: boolean): ChoiceIds {
  const id = useId();
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  return {
    describedBy:
      [hasDescription ? descriptionId : '', hasError ? errorId : ''].filter(Boolean).join(' ') ||
      undefined,
    descriptionId,
    errorId,
    labelId: `${id}-label`,
  };
}

interface ChoiceSupportProps {
  readonly description?: string | undefined;
  readonly descriptionId: string;
  readonly errorId: string;
  readonly errorMessage?: string | undefined;
  readonly isInvalid: boolean;
}

export function ChoiceSupport({
  description,
  descriptionId,
  errorId,
  errorMessage,
  isInvalid,
}: ChoiceSupportProps): ReactElement {
  const hasError = isInvalid && Boolean(errorMessage);

  return (
    <div data-has-error={hasError || undefined} data-wcl-choice-support="">
      {description ? (
        <span data-wcl-choice-description="" id={descriptionId}>
          {description}
        </span>
      ) : null}
      {errorMessage ? (
        <span data-wcl-choice-error="" id={errorId}>
          {errorMessage}
        </span>
      ) : null}
    </div>
  );
}

interface ChoiceLabelProps {
  readonly children: ReactNode;
  readonly id: string;
  readonly isRequired: boolean;
}

export function ChoiceLabel({children, id, isRequired}: ChoiceLabelProps): ReactElement {
  return (
    <span data-wcl-choice-label="" id={id}>
      {children}
      {isRequired ? (
        <span aria-hidden="true" data-wcl-choice-required="">
          *
        </span>
      ) : null}
    </span>
  );
}

export function ChoiceIndicator({kind}: {readonly kind: 'checkbox' | 'radio'}): ReactElement {
  return <span aria-hidden="true" data-wcl-choice-indicator="" data-kind={kind} />;
}
