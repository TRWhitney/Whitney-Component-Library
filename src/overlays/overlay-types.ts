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

export type AnchoredOverlayPlacement = 'top' | 'bottom' | 'start' | 'end';
export type AnchoredOverlayAlignment = 'start' | 'center' | 'end';

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

interface PopoverBaseProps extends TaskOverlayProps {
  readonly alignment?: AnchoredOverlayAlignment;
  readonly placement?: AnchoredOverlayPlacement;
}

export type PopoverProps = PopoverBaseProps & OverlayOpenStateProps;

export interface TooltipProps {
  readonly alignment?: AnchoredOverlayAlignment;
  readonly children: ReactElement;
  readonly content: string;
  readonly placement?: AnchoredOverlayPlacement;
}

export type MenuItemTone = 'neutral' | 'danger';

export interface MenuActionItem {
  readonly description?: string;
  readonly id: string;
  readonly isDisabled?: boolean;
  readonly label: string;
  readonly onAction: () => void;
  readonly shortcut?: string;
  readonly tone?: MenuItemTone;
  readonly type: 'action';
}

export interface MenuSeparatorItem {
  readonly id: string;
  readonly type: 'separator';
}

export interface MenuSubmenuItem {
  readonly id: string;
  readonly isDisabled?: boolean;
  readonly items: readonly MenuItem[];
  readonly label: string;
  readonly type: 'submenu';
}

export interface MenuGroupItem {
  readonly id: string;
  readonly items: readonly (MenuActionItem | MenuSeparatorItem | MenuSubmenuItem)[];
  readonly label: string;
  readonly type: 'group';
}

export type MenuItem = MenuActionItem | MenuSeparatorItem | MenuSubmenuItem | MenuGroupItem;
export type MenuItems = readonly MenuItem[];

interface MenuBaseProps {
  readonly alignment?: AnchoredOverlayAlignment;
  readonly items: MenuItems;
  readonly placement?: AnchoredOverlayPlacement;
  readonly trigger: ReactElement;
}

export type MenuProps = MenuBaseProps & OverlayOpenStateProps;

interface ContextMenuBaseProps {
  readonly children: ReactNode;
  readonly items: MenuItems;
  readonly targetLabel: string;
}

export type ContextMenuProps = ContextMenuBaseProps & OverlayOpenStateProps;

export type AlertDialogActionKind = 'confirm' | 'destructive';

interface AlertDialogBaseProps extends OverlayBaseProps {
  readonly actionKind: AlertDialogActionKind;
  readonly cancelLabel: string;
  readonly confirmLabel: string;
  readonly onConfirm: () => void;
}

export type AlertDialogProps = AlertDialogBaseProps & OverlayOpenStateProps;

export type DrawerPlacement = 'start' | 'end' | 'top' | 'bottom';

interface DrawerBaseProps extends TaskOverlayProps {
  readonly dockedPreview?: ReactNode;
  readonly dragHandleLabel?: string;
  readonly placement?: DrawerPlacement;
}

export type DrawerProps = DrawerBaseProps & OverlayOpenStateProps;
