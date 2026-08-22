import type {ReactElement, ReactNode} from 'react';

export type OverlayOpenStateProps =
  | {
      readonly defaultOpen?: boolean;
      readonly isOpen?: never;
      readonly onOpenChange?: (isOpen: boolean) => void;
    }
  | {
      readonly defaultOpen?: never;
      readonly isOpen: boolean;
      readonly onOpenChange: (isOpen: boolean) => void;
    };

export interface OverlayControls {
  readonly close: () => void;
}

interface OverlayBaseProps {
  readonly description: string;
  readonly title: string;
  readonly trigger: ReactElement;
}

interface TaskOverlayProps extends OverlayBaseProps {
  readonly actions?: (controls: OverlayControls) => ReactNode;
  readonly children: ReactNode;
  readonly closeLabel: string;
}

export type DialogProps = TaskOverlayProps & OverlayOpenStateProps;

export type AlertDialogActionKind = 'confirm' | 'destructive';

interface AlertDialogBaseProps extends OverlayBaseProps {
  readonly actionKind: AlertDialogActionKind;
  readonly cancelLabel: string;
  readonly confirmLabel: string;
  readonly onConfirm: () => void;
}

export type AlertDialogProps = AlertDialogBaseProps & OverlayOpenStateProps;

export type DrawerPlacement = 'start' | 'end';

interface DrawerBaseProps extends TaskOverlayProps {
  readonly placement?: DrawerPlacement;
}

export type DrawerProps = DrawerBaseProps & OverlayOpenStateProps;
