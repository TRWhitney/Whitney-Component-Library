'use client';

import {UNSAFE_PortalProvider} from 'react-aria/PortalProvider';
import {useRef, type CSSProperties, type ReactNode} from 'react';

import {deriveAccentRoles, type AccentColor} from './accent.js';

export type Appearance = 'light' | 'dark';

export interface AppearanceProviderProps {
  readonly accent: AccentColor;
  readonly appearance: Appearance;
  readonly children: ReactNode;
}
type ProviderStyles = CSSProperties & Record<`--wcl-${string}`, string>;

export function AppearanceProvider({accent, appearance, children}: AppearanceProviderProps) {
  const providerRef = useRef<HTMLDivElement>(null);
  const roles = deriveAccentRoles(accent, appearance);
  const styles: ProviderStyles = {
    '--wcl-accent': roles.accent,
    '--wcl-accent-contrast': roles.contrast,
    '--wcl-accent-fill': roles.fill,
    '--wcl-accent-focus': roles.focus,
    '--wcl-accent-muted': roles.muted,
    '--wcl-accent-rail': roles.rail,
    '--wcl-accent-soft': roles.soft,
    '--wcl-accent-text': roles.text,
  };

  return (
    <UNSAFE_PortalProvider getContainer={() => providerRef.current}>
      <div data-wcl-appearance={appearance} data-wcl-provider="" ref={providerRef} style={styles}>
        {children}
      </div>
    </UNSAFE_PortalProvider>
  );
}
