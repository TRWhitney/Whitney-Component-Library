import {useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode} from 'react';

export const chartActivationLifetime = 650;
export const chartActivationPointRadius = 10;
export const chartActivationOutset = 5;
const outlineTravel = 3;
type ActivationStyles = CSSProperties & {
  '--wcl-chart-activation-start-x': number;
  '--wcl-chart-activation-start-y': number;
  '--wcl-chart-activation-scale-x': number;
  '--wcl-chart-activation-scale-y': number;
};

// Measure once before paint so each edge travels the same screen distance, regardless of
// the mark's dimensions or SVG scale. A new activation mounts a new outline.
export function ChartActivationOutline({
  children,
  outset = 0,
}: {
  readonly children: ReactNode;
  readonly outset?: number;
}) {
  const ref = useRef<SVGGElement>(null);
  const [style, setStyle] = useState<ActivationStyles>({
    '--wcl-chart-activation-start-x': 1,
    '--wcl-chart-activation-start-y': 1,
    '--wcl-chart-activation-scale-x': 1,
    '--wcl-chart-activation-scale-y': 1,
  });
  useLayoutEffect(() => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;
    setStyle({
      '--wcl-chart-activation-start-x': bounds.width > 0 ? 1 + (2 * outset) / bounds.width : 1,
      '--wcl-chart-activation-start-y': bounds.height > 0 ? 1 + (2 * outset) / bounds.height : 1,
      '--wcl-chart-activation-scale-x':
        bounds.width > 0 ? 1 + (2 * (outset + outlineTravel)) / bounds.width : 1,
      '--wcl-chart-activation-scale-y':
        bounds.height > 0 ? 1 + (2 * (outset + outlineTravel)) / bounds.height : 1,
    });
  }, [outset]);
  return (
    <g data-wcl-chart-activation-outline="" ref={ref} style={style}>
      {children}
    </g>
  );
}
