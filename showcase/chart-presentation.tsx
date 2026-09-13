import {useState, type ReactNode} from 'react';
import {Switch} from '../src/index.js';

export function ChartSizeControl({
  compact,
  onChange,
}: {
  readonly compact: boolean;
  readonly onChange: (compact: boolean) => void;
}) {
  return (
    <div className="showcase-chart-size-control">
      <Switch
        label="Compact chart"
        isSelected={compact}
        onChange={onChange}
        reserveSupportSpace={false}
      />
    </div>
  );
}

export function ChartFrame({
  compact,
  children,
}: {
  readonly compact: boolean;
  readonly children: ReactNode;
}) {
  return (
    <div className="showcase-chart-plot">
      <div className="showcase-chart-frame" data-chart-size={compact ? 'compact' : 'regular'}>
        {children}
      </div>
    </div>
  );
}

export function ChartPresentation({children}: {readonly children: ReactNode}) {
  const [compact, setCompact] = useState(false);
  return (
    <div className="showcase-chart-presentation">
      <ChartSizeControl compact={compact} onChange={setCompact} />
      <ChartFrame compact={compact}>{children}</ChartFrame>
    </div>
  );
}
