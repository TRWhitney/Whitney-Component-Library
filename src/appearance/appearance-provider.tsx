'use client';

import type {CSSProperties, ReactNode} from 'react';

import {deriveAccentRoles, type AccentColor} from './accent.js';

export type Appearance = 'light' | 'dark';

export interface AppearanceProviderProps {
  readonly accent: AccentColor;
  readonly appearance: Appearance;
  readonly children: ReactNode;
}
type ProviderStyles = CSSProperties & Record<`--wcl-${string}`, string>;

export function AppearanceProvider({accent, appearance, children}: AppearanceProviderProps) {
  const roles = deriveAccentRoles(accent, appearance);
  const styles: ProviderStyles = {
    '--wcl-accent': roles.accent,
    '--wcl-accent-contrast': roles.contrast,
    '--wcl-accent-focus': roles.focus,
    '--wcl-accent-muted': roles.muted,
    '--wcl-accent-soft': roles.soft,
    '--wcl-accent-text': roles.text,
  };

  return (
    <div data-wcl-appearance={appearance} data-wcl-provider="" style={styles}>
      {children}
    </div>
  );
}
