import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
  type RefCallback,
  type RefObject,
} from 'react';

export type ActionPartKind = 'button' | 'icon-button' | 'support' | 'toggle-button';

const actionParts = new WeakMap<Element, ActionPartKind>();
type ActionPartRegistration = (
  element: HTMLElement,
  kind: ActionPartKind,
  isRegistered: boolean,
) => void;
const ActionPartRegistrationContext = createContext<ActionPartRegistration | null>(null);

export function ActionPartRegistrationProvider({
  children,
  onRegistration,
}: {
  readonly children: ReactNode;
  readonly onRegistration: ActionPartRegistration;
}): ReactElement {
  return createElement(ActionPartRegistrationContext.Provider, {value: onRegistration}, children);
}

export function useActionPartRef<ElementType extends HTMLElement>(
  kind: ActionPartKind,
): RefCallback<ElementType> {
  const currentRef = useRef<ElementType | null>(null);
  const registerWithOwner = useContext(ActionPartRegistrationContext);

  return useCallback(
    (element) => {
      const current = currentRef.current;
      if (current && actionParts.get(current) === kind) {
        actionParts.delete(current);
        registerWithOwner?.(current, kind, false);
      }
      if (element) {
        actionParts.set(element, kind);
        registerWithOwner?.(element, kind, true);
      }
      currentRef.current = element;
    },
    [kind, registerWithOwner],
  );
}

export function assertRenderedActionChildren(
  root: HTMLElement,
  allowedKinds: readonly ActionPartKind[],
  owner: string,
  allowedNames: string,
): void {
  for (const child of root.childNodes) {
    if (child.nodeType === Node.COMMENT_NODE) continue;
    if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim() === '') continue;

    if (child.nodeType === Node.ELEMENT_NODE) {
      const kind = actionParts.get(child as Element);
      if (kind === 'support' || (kind !== undefined && allowedKinds.includes(kind))) continue;
    }

    throw new TypeError(
      `${owner} rendered an unsupported direct child. Render only ${allowedNames}; consumer components must not add a DOM wrapper.`,
    );
  }
}

interface ActionCompositeValidation<ElementType extends HTMLElement> {
  readonly rootRef: RefObject<ElementType | null>;
  readonly setRootRef: RefCallback<ElementType>;
}

export function useRenderedActionValidation<ElementType extends HTMLElement>(
  allowedKinds: readonly ActionPartKind[],
  owner: string,
  allowedNames: string,
): ActionCompositeValidation<ElementType> {
  const rootRef = useRef<ElementType>(null);
  const [validationError, setValidationError] = useState<TypeError | null>(null);
  const setRootRef = useCallback((root: ElementType | null) => {
    rootRef.current = root;
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let active = true;
    const validate = () => {
      if (!active) return;
      try {
        assertRenderedActionChildren(root, allowedKinds, owner, allowedNames);
      } catch (error) {
        setValidationError((current) => current ?? (error as TypeError));
      }
    };

    validate();
    const MutationObserverConstructor = root.ownerDocument.defaultView?.MutationObserver;
    if (!MutationObserverConstructor) return;

    const observer = new MutationObserverConstructor(validate);
    observer.observe(root, {childList: true});

    return () => {
      active = false;
      observer.disconnect();
    };
  }, [allowedKinds, allowedNames, owner]);

  if (validationError) throw validationError;

  return {rootRef, setRootRef};
}

export function registeredActionControls(
  root: HTMLElement,
  allowedKinds: readonly ActionPartKind[],
): HTMLButtonElement[] {
  return [...root.children].flatMap((element) => {
    const kind = actionParts.get(element);
    return element.tagName === 'BUTTON' && kind !== undefined && allowedKinds.includes(kind)
      ? [element as HTMLButtonElement]
      : [];
  });
}
