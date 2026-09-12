'use client';

import {UNSAFE_PortalProvider} from 'react-aria/PortalProvider';
import {useRef, type CSSProperties, type ReactNode} from 'react';

import {
  deriveAccentRoles,
  type AccentColor,
  type AccentSurface,
  type SurfaceAccentRoles,
} from './accent.js';

export type Appearance = 'light' | 'dark';

export interface AppearanceProviderProps {
  readonly accent: AccentColor;
  readonly appearance: Appearance;
  readonly children: ReactNode;
  readonly density?: 'comfortable' | 'compact';
}
type ProviderStyles = CSSProperties & Record<`--wcl-${string}`, string>;

export function AppearanceProvider({
  accent,
  appearance,
  children,
  density = 'comfortable',
}: AppearanceProviderProps) {
  const providerRef = useRef<HTMLDivElement>(null);
  const roles = deriveAccentRoles(accent, appearance);
  const styles: ProviderStyles = {
    '--wcl-accent': roles.accent,
    '--wcl-accent-contrast': roles.contrast,
    '--wcl-accent-fill': roles.fill,
    '--wcl-accent-hover-edge': roles.hoverEdge,
    ...surfaceRoleStyles('base', roles.on.base),
    ...surfaceRoleStyles('canvas', roles.on.canvas),
    ...surfaceRoleStyles('raised', roles.on.raised),
    ...surfaceRoleStyles('subtle', roles.on.subtle),
  };

  return (
    <UNSAFE_PortalProvider getContainer={() => providerRef.current}>
      <div
        data-wcl-appearance={appearance}
        data-wcl-density={density}
        data-wcl-provider=""
        ref={providerRef}
        style={styles}
      >
        {children}
      </div>
    </UNSAFE_PortalProvider>
  );
}

function surfaceRoleStyles(surface: AccentSurface, roles: SurfaceAccentRoles): ProviderStyles {
  return {
    [`--wcl-accent-fill-boundary-on-${surface}`]: roles.fillBoundary,
    [`--wcl-accent-focus-on-${surface}`]: roles.focus,
    [`--wcl-accent-hover-contrast-on-${surface}`]: roles.hoverContrast,
    [`--wcl-accent-muted-on-${surface}`]: roles.muted,
    [`--wcl-accent-rail-on-${surface}`]: roles.rail,
    [`--wcl-accent-soft-on-${surface}`]: roles.soft,
    ...Object.fromEntries(
      roles.chartSeries.map((color, index) => [
        `--wcl-chart-series-${index + 2}-on-${surface}`,
        color,
      ]),
    ),
  };
}
