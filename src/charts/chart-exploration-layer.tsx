import {useLayoutEffect, useState, type CSSProperties, type ReactNode} from 'react';

/** Place HTML controls against the rendered plot, including SVG letterboxing. */
export function ChartExplorationLayer({
  svg,
  panel = false,
  plot,
  children,
}: {
  readonly panel?: boolean;
  readonly svg: SVGSVGElement | null;
  readonly plot: {
    readonly left: number;
    readonly right: number;
    readonly top: number;
    readonly bottom: number;
  };
  readonly children: ReactNode;
}) {
  const [style, setStyle] = useState<CSSProperties>({});
  const {left, right, top, bottom} = plot;
  useLayoutEffect(() => {
    if (!svg) return;
    const measure = () => {
      const box = svg.getBoundingClientRect();
      const parent = svg.parentElement?.getBoundingClientRect() ?? box;
      const values = svg.getAttribute('viewBox')?.split(/\s+/).map(Number) ?? [0, 0, 640, 360];
      const width = values[2] ?? 640,
        height = values[3] ?? 360;
      if (!box.width || !box.height) return;
      const scale = Math.min(box.width / width, box.height / height);
      const x = box.left - parent.left + (box.width - width * scale) / 2;
      const y = box.top - parent.top + (box.height - height * scale) / 2;
      const next = {
        '--wcl-exploration-left': `${x + left * scale}px`,
        '--wcl-exploration-right': `${parent.width - x - right * scale}px`,
        '--wcl-exploration-top': `${y + top * scale}px`,
        '--wcl-exploration-bottom': `${y + bottom * scale + 28}px`,
        '--wcl-exploration-button-size': `${Math.max(28, Math.min(36, box.width / 18))}px`,
      } as CSSProperties;
      setStyle((current) => (JSON.stringify(current) === JSON.stringify(next) ? current : next));
    };
    measure();
    const Constructor = svg.ownerDocument.defaultView?.ResizeObserver;
    const observer = Constructor ? new Constructor(measure) : undefined;
    observer?.observe(svg);
    return () => observer?.disconnect();
  }, [svg, left, right, top, bottom]);
  return (
    <div data-wcl-chart-exploration-layer="" data-panel={panel ? '' : undefined} style={style}>
      {children}
    </div>
  );
}
