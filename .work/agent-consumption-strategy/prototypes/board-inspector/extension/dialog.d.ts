import type {ReactElement, RefObject} from 'react';
import type {DialogProps as TriggeredDialogProps} from './overlay-types.js';
export type ControlledDialogProps = Omit<
  TriggeredDialogProps,
  'trigger' | 'defaultOpen' | 'isOpen' | 'onOpenChange'
> & {
  readonly trigger?: never;
  readonly defaultOpen?: never;
  readonly isOpen: boolean;
  readonly onOpenChange: (isOpen: boolean) => void;
  readonly returnFocusRef: RefObject<HTMLElement | null>;
};
export type DialogProps = TriggeredDialogProps | ControlledDialogProps;
export declare function Dialog(props: DialogProps): ReactElement;
