// Non-production interaction adapter around the production chart.
import {useLayoutEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {useFocusVisible} from 'react-aria';
import {
  AppearanceProvider,
  LineChart,
  SegmentedControl,
  ToggleButton,
  type Appearance,
} from '../../../../src/index.js';
import '../../../../src/styles.css';
import './styles.css';

const rows = [
  {month: 'Jan', revenue: 820, costs: 440},
  {month: 'Feb', revenue: 890, costs: 510},
  {month: 'Mar', revenue: 960, costs: 490},
  {month: 'Apr', revenue: 900, costs: 620},
  {month: 'May', revenue: 1100, costs: 580},
  {month: 'Jun', revenue: 1200, costs: 700},
];
const series = [
  {id: 'revenue', label: 'Revenue', accessor: 'revenue', showPoints: true},
  {id: 'costs', label: 'Operating costs', accessor: 'costs', showPoints: true},
] as const;
type Target = {index: number; seriesId?: string};
const targetKey = (item: Target) => `${rows[item.index]!.month}:${item.seriesId ?? '*'}`;
const targetName = (item: Target) =>
  `${rows[item.index]!.month}${item.seriesId ? ` · ${series.find((s) => s.id === item.seriesId)?.label}` : ''}`;
const valueText = (item: Target) =>
  series
    .filter((s) => !item.seriesId || s.id === item.seriesId)
    .map((s) => `${s.label}: $${rows[item.index]![s.accessor]}`)
    .join(' · ');
const ns = 'http://www.w3.org/2000/svg';

function Prototype() {
  const {isFocusVisible} = useFocusVisible();
  const [appearance, setAppearance] = useState<Appearance>('dark');
  const [action, setAction] = useState<'inspect' | 'select'>('select');
  const [openDetails, setOpenDetails] = useState(true);
  const [unit, setUnit] = useState<'month' | 'point'>('month');
  const [monthStyle, setMonthStyle] = useState<'underline' | 'bracket' | 'band' | 'checked'>(
    'underline',
  );
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{
    id: number;
    x: number;
    y: number;
    before: Target[];
    add: boolean;
    remove: boolean;
    moved: boolean;
  } | null>(null);
  const hold = useRef<{timer: ReturnType<typeof setTimeout> | null; fired: boolean}>({
    timer: null,
    fired: false,
  });
  const cancelHold = () => {
    if (hold.current.timer !== null) clearTimeout(hold.current.timer);
    hold.current.timer = null;
  };
  useLayoutEffect(
    () => () => {
      cancelHold();
      hold.current.fired = false;
    },
    [action, unit],
  );
  const [compact, setCompact] = useState(false);
  const [identify, setIdentify] = useState(false);
  const [identified, setIdentified] = useState('');
  const [selected, setSelected] = useState<Target[]>([]);
  const [opened, setOpened] = useState<Target | null>(null);
  const [keyboardTarget, setKeyboardTarget] = useState<Target | null>(null);
  const pointerTarget = useRef<Target | null>(null);
  const [hidden, setHidden] = useState<string[]>([]);
  const host = useRef<HTMLDivElement>(null);

  const activate = (target: Target, activationOnly = false) => {
    if (action !== 'select' || activationOnly) {
      pulse(target);
      if (openDetails) setOpened(target);
    } else
      setSelected((current) =>
        current.some((item) => targetKey(item) === targetKey(target))
          ? current.filter((item) => targetKey(item) !== targetKey(target))
          : [...current, target],
      );
  };
  const points = () => [
    ...(host.current?.querySelectorAll<SVGCircleElement>('[data-wcl-chart-point]') ?? []),
  ];
  // One target rule for both the reading preview and activation.
  const targetAt = (x: number, y: number): Target | null => {
    const hit = host.current?.querySelector('[data-wcl-chart-hit-region]')?.getBoundingClientRect();
    const available = points();
    if (!hit || !available.length || x < hit.left || x > hit.right || y < hit.top || y > hit.bottom)
      return null;
    const center = (p: SVGCircleElement) => {
      const r = p.getBoundingClientRect();
      return {x: r.x + r.width / 2, y: r.y + r.height / 2};
    };
    const column = available.reduce((a, b) =>
      Math.abs(center(a).x - x) <= Math.abs(center(b).x - x) ? a : b,
    );
    const index = Number(column.dataset.rowIndex);
    if (unit === 'month') return {index};
    const point = available
      .filter((p) => Number(p.dataset.rowIndex) === index)
      .reduce((a, b) => (Math.abs(center(a).y - y) <= Math.abs(center(b).y - y) ? a : b));
    return {index, seriesId: point.dataset.series!};
  };
  // Disposable adapter: give the production reading handler the same target during bubbling.
  const alignReading = (element: Element, target: Target) => {
    const names = ['data-row-index', 'data-series'];
    const previous = names.map((name) => element.getAttribute(name));
    element.setAttribute(names[0]!, String(target.index));
    element.setAttribute(names[1]!, target.seriesId ?? '');
    queueMicrotask(() =>
      names.forEach((name, index) => {
        const value = previous[index];
        if (value == null) element.removeAttribute(name);
        else element.setAttribute(name, value);
      }),
    );
  };
  const pulse = (target: Target) => {
    const svg = host.current?.querySelector<SVGSVGElement>('[data-wcl-chart-svg]');
    if (!svg) return;
    svg.querySelector('[data-activation-pulse]')?.remove();
    const group = document.createElementNS(ns, 'g');
    group.setAttribute('data-activation-pulse', '');
    const scale = 640 / svg.getBoundingClientRect().width;
    const activatedPoints = points().filter(
      (p) =>
        Number(p.dataset.rowIndex) === target.index &&
        (!target.seriesId || p.dataset.series === target.seriesId),
    );
    for (const point of activatedPoints) {
      const dot = document.createElementNS(ns, 'circle');
      dot.setAttribute('cx', point.getAttribute('cx')!);
      dot.setAttribute('cy', point.getAttribute('cy')!);
      dot.setAttribute('r', String(10 * scale));
      group.append(dot);
    }
    if (!target.seriesId && activatedPoints.length) {
      const hit = svg.querySelector('[data-wcl-chart-hit-region]')!;
      const guide = document.createElementNS(ns, 'line');
      guide.setAttribute('x1', activatedPoints[0]!.getAttribute('cx')!);
      guide.setAttribute('x2', activatedPoints[0]!.getAttribute('cx')!);
      guide.setAttribute('y1', hit.getAttribute('y')!);
      guide.setAttribute(
        'y2',
        String(Number(hit.getAttribute('y')) + Number(hit.getAttribute('height'))),
      );
      group.prepend(guide);
    }
    svg.append(group);
    setTimeout(() => group.remove(), 650);
  };
  const visibleSeries = () =>
    series.filter((s) => points().some((point) => point.dataset.series === s.id));

  // A disposable SVG overlay follows actual production geometry, including its scale frames.
  useLayoutEffect(() => {
    const container = host.current;
    if (!container) return;
    let frame = 0;
    let overlay: SVGGElement | null = null;
    let last = '';
    const draw = () => {
      const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]');
      const hit = svg?.querySelector<SVGRectElement>('[data-wcl-chart-hit-region]');
      const circles = [
        ...(svg?.querySelectorAll<SVGCircleElement>('[data-wcl-chart-point]') ?? []),
      ];
      const hiddenIds = series
        .filter((s) =>
          container.querySelector(`[data-wcl-chart-visibility][aria-label="Show ${s.label}"]`),
        )
        .map((s) => s.id);
      setHidden((current) => (current.join(',') === hiddenIds.join(',') ? current : hiddenIds));
      if (svg && hit) {
        const readingTarget = dragging ? null : (pointerTarget.current ?? keyboardTarget);
        const signature = JSON.stringify([
          readingTarget,
          selected,
          keyboardTarget,
          monthStyle,
          circles.map((p) => [
            p.dataset.series,
            p.dataset.rowIndex,
            p.getAttribute('cx'),
            p.getAttribute('cy'),
            getComputedStyle(p).r,
            getComputedStyle(p).strokeWidth,
          ]),
          hit.getAttribute('y'),
          hit.getAttribute('height'),
          svg.getBoundingClientRect().width,
        ]);
        if (signature !== last || overlay?.parentNode !== svg) {
          if (overlay?.parentNode !== svg) {
            overlay?.remove();
            overlay = document.createElementNS(ns, 'g');
            overlay.setAttribute('data-example-selection', '');
            overlay.setAttribute('pointer-events', 'none');
            svg.append(overlay);
          } else overlay.replaceChildren();
          const markerScale = 640 / svg.getBoundingClientRect().width;
          last = signature;
          const shape = (tag: string, attrs: Record<string, string | number>) => {
            const node = document.createElementNS(ns, tag);
            for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
            overlay!.append(node);
            return node;
          };
          const markerEdges = (point: SVGCircleElement) => {
            const style = getComputedStyle(point);
            const matrix = point.getScreenCTM()!;
            const screenUnit = 1 / Math.hypot(matrix.a, matrix.b);
            const radius = parseFloat(style.r);
            const halfStroke = (parseFloat(style.strokeWidth) * screenUnit) / 2;
            return {
              inner: Math.max(0, radius - halfStroke + 0.35 * screenUnit),
              selection: radius + halfStroke + screenUnit,
            };
          };
          for (const item of selected) {
            const point = circles.find(
              (p) =>
                Number(p.dataset.rowIndex) === item.index &&
                (!item.seriesId || p.dataset.series === item.seriesId),
            );
            if (!point) continue;
            const x = Number(point.getAttribute('cx'));
            const y = Number(point.getAttribute('cy'));
            if (item.seriesId) {
              shape('circle', {
                cx: x,
                cy: y,
                r: markerEdges(point).selection,
                class: 'selected-ring',
              });
            } else {
              const other = circles.find((p) => p.dataset.rowIndex !== point.dataset.rowIndex);
              const width = other
                ? Math.min(44 * markerScale, Math.abs(Number(other.getAttribute('cx')) - x) * 0.5)
                : 30;
              const top = Number(hit.getAttribute('y'));
              const height = Number(hit.getAttribute('height'));
              if (monthStyle === 'band' || monthStyle === 'checked') {
                shape('rect', {
                  x: x - width / 2,
                  y: top,
                  width,
                  height,
                  class: 'selected-month-band',
                });
              }
              if (monthStyle === 'bracket') {
                const bottom = top + height;
                const left = x - width / 2;
                const right = x + width / 2;
                const cap = 5 * markerScale;
                shape('path', {
                  d: `M${left + cap} ${top} H${left} V${bottom} H${left + cap} M${right - cap} ${top} H${right} V${bottom} H${right - cap}`,
                  class: 'selected-month-bracket',
                });
              }
              if (monthStyle === 'underline' || monthStyle === 'band') {
                const tick = [
                  ...svg.querySelectorAll<SVGTextElement>('[data-wcl-chart-tick-label]'),
                ].find((label) => label.textContent === rows[item.index]!.month);
                const bounds = tick?.getBBox();
                const underlineY = bounds
                  ? bounds.y + bounds.height + 3 * markerScale
                  : top + height + 24 * markerScale;
                shape('line', {
                  x1: x - 12 * markerScale,
                  x2: x + 12 * markerScale,
                  y1: underlineY,
                  y2: underlineY,
                  class: 'selected-month-underline',
                });
              }
              if (monthStyle === 'checked') {
                shape('circle', {
                  cx: x,
                  cy: top + 10 * markerScale,
                  r: 6.5 * markerScale,
                  class: 'selected-month-check',
                });
                shape('path', {
                  d: `M${x - 3 * markerScale} ${top + 10 * markerScale} l${2 * markerScale} ${2 * markerScale} ${4 * markerScale} ${-4 * markerScale}`,
                  class: 'selected-checkmark',
                });
              }
            }
          }
          if (readingTarget) {
            const readingPoints = circles.filter(
              (p) =>
                Number(p.dataset.rowIndex) === readingTarget.index &&
                (!readingTarget.seriesId || p.dataset.series === readingTarget.seriesId),
            );
            if (readingPoints.length) {
              const x = readingPoints[0]!.getAttribute('cx')!;
              shape('line', {
                x1: x,
                x2: x,
                y1: hit.getAttribute('y')!,
                y2: Number(hit.getAttribute('y')) + Number(hit.getAttribute('height')),
                class: 'reading-guide',
              });
            }
            for (const point of readingPoints)
              shape('circle', {
                cx: point.getAttribute('cx')!,
                cy: point.getAttribute('cy')!,
                r: markerEdges(point).inner,
                class: 'reading-center',
                'data-reading-target': targetKey({
                  index: readingTarget.index,
                  seriesId: point.dataset.series,
                }),
              });
          }
        }
      } else {
        overlay?.remove();
        overlay = null;
        last = '';
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      overlay?.remove();
    };
  }, [selected, keyboardTarget, monthStyle, dragging, unit]);

  const identifyTarget = (target: EventTarget) => {
    if (!(target instanceof Element)) return;
    const name = target.closest<HTMLElement>('[data-element]')?.dataset.element;
    setIdentified(
      target.closest('[data-wcl-chart-visibility]')
        ? 'Series eye'
        : target.closest('[data-wcl-chart-legend-button]')
          ? 'Series highlight'
          : target.closest('[data-wcl-chart-canvas]')
            ? 'Chart plot'
            : (name ?? ''),
    );
  };
  return (
    <AppearanceProvider accent="#3878c7" appearance={appearance}>
      <main
        className="study"
        data-identify={identify ? '' : undefined}
        onPointerOver={(e) => identifyTarget(e.target)}
        onFocus={(e) => identifyTarget(e.target)}
      >
        <header className="study-header">
          <p className="kicker">Interaction study</p>
          <h1>Clicking a month or point</h1>
          <p>Click a month or point. Selection and opening details can work independently.</p>
        </header>
        <div
          className="study-settings"
          aria-label="Example settings"
          data-element="Example settings"
        >
          <SegmentedControl
            label="Selection"
            value={action}
            options={[
              {value: 'inspect', label: 'Off'},
              {value: 'select', label: 'On'},
            ]}
            onChange={(value) => {
              setAction(value);
              setSelected([]);
            }}
          />
          <ToggleButton
            variant="quiet"
            isSelected={openDetails}
            onChange={(value) => {
              setOpenDetails(value);
              setOpened(null);
            }}
          >
            Open details on activation
          </ToggleButton>
          <SegmentedControl
            label="Item"
            value={unit}
            options={[
              {value: 'month', label: 'Month'},
              {value: 'point', label: 'Point'},
            ]}
            onChange={(value) => {
              setUnit(value);
              pointerTarget.current = null;
              setSelected([]);
              setOpened(null);
              setKeyboardTarget(null);
            }}
          />
          {action === 'select' && unit === 'month' ? (
            <SegmentedControl
              label="Month selection style"
              value={monthStyle}
              options={[
                {value: 'underline', label: 'Underline'},
                {value: 'bracket', label: 'Brackets'},
                {value: 'band', label: 'Soft band'},
                {value: 'checked', label: 'Checked band'},
              ]}
              onChange={setMonthStyle}
            />
          ) : null}
        </div>
        <div className="study-settings appearance-settings">
          <SegmentedControl
            label="Appearance"
            value={appearance}
            options={[
              {value: 'light', label: 'Light'},
              {value: 'dark', label: 'Dark'},
            ]}
            onChange={setAppearance}
          />
          <ToggleButton variant="quiet" isSelected={compact} onChange={setCompact}>
            Compact width
          </ToggleButton>
          <ToggleButton variant="quiet" isSelected={identify} onChange={setIdentify}>
            Identify elements
          </ToggleButton>
        </div>
        <section
          className="specimen"
          data-compact={compact ? '' : undefined}
          aria-label="Activation and selection example"
        >
          <p className="instruction" data-element="Interaction instructions">
            {action === 'inspect'
              ? `Click a ${unit} for brief feedback${openDetails ? ' and details below' : ''}.`
              : `Click to add or remove a ${unit}. Ctrl/Command-click or touch and hold activates without changing selection. ${unit === 'month' ? 'Drag across months to select a range.' : 'Drag a box around points to select them.'} A new drag replaces the selection. Shift adds; Alt removes. Escape cancels a drag.`}{' '}
            {unit === 'month'
              ? 'A month activates once with its series values.'
              : 'The filled point is the click target.'}{' '}
            Series names still highlight; eyes still hide and show.
          </p>
          <div
            ref={host}
            className="interaction-example"
            data-element="Financial chart"
            data-dragging={dragging ? '' : undefined}
            data-item={unit}
            data-keyboard-point={keyboardTarget?.seriesId ? '' : undefined}
            data-selecting={action === 'select' ? '' : undefined}
            onPointerDownCapture={(event) => {
              if (event.button !== 0 || !(event.target as Element).closest('[data-wcl-chart-svg]'))
                return;
              const target = targetAt(event.clientX, event.clientY);
              if (!target) return;
              pointerTarget.current = target;
              alignReading(event.target as Element, target);
              setKeyboardTarget(null);
              drag.current = {
                id: event.pointerId,
                x: event.clientX,
                y: event.clientY,
                before: selected,
                add: event.shiftKey || event.ctrlKey || event.metaKey,
                remove: event.altKey,
                moved: false,
              };
              cancelHold();
              hold.current.fired = false;
              if (event.pointerType === 'touch' && action === 'select') {
                hold.current.timer = setTimeout(() => {
                  hold.current.timer = null;
                  hold.current.fired = true;
                  activate(target, true);
                }, 500);
              }
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onContextMenu={(event) => {
              if (hold.current.timer !== null || hold.current.fired) event.preventDefault();
            }}
            onPointerLeave={(event) => {
              if (event.pointerType !== 'touch') pointerTarget.current = null;
            }}
            onPointerMoveCapture={(event) => {
              const target = targetAt(event.clientX, event.clientY);
              pointerTarget.current = target;
              if (target) alignReading(event.target as Element, target);
              const start = drag.current;
              if (hold.current.fired) {
                event.preventDefault();
                event.stopPropagation();
                return;
              }
              if (!start || action !== 'select') return;
              if (!start.moved && Math.hypot(event.clientX - start.x, event.clientY - start.y) < 5)
                return;
              cancelHold();
              start.moved = true;
              setDragging(true);
              event.preventDefault();
              event.stopPropagation();
              const available = points();
              const center = (p: SVGCircleElement) => {
                const r = p.getBoundingClientRect();
                return {x: r.x + r.width / 2, y: r.y + r.height / 2};
              };
              let chosen: Target[] = [];
              if (unit === 'month' && available.length) {
                const nearest = (x: number) =>
                  Number(
                    available.reduce((a, b) =>
                      Math.abs(center(a).x - x) < Math.abs(center(b).x - x) ? a : b,
                    ).dataset.rowIndex,
                  );
                const first = nearest(start.x),
                  last = nearest(event.clientX);
                chosen = rows.flatMap((_, index) =>
                  index >= Math.min(first, last) && index <= Math.max(first, last) ? [{index}] : [],
                );
              } else {
                chosen = available
                  .filter((p) => {
                    const c = center(p);
                    return (
                      c.x >= Math.min(start.x, event.clientX) - 4 &&
                      c.x <= Math.max(start.x, event.clientX) + 4 &&
                      c.y >= Math.min(start.y, event.clientY) - 4 &&
                      c.y <= Math.max(start.y, event.clientY) + 4
                    );
                  })
                  .map((p) => ({index: Number(p.dataset.rowIndex), seriesId: p.dataset.series!}));
              }
              setSelected(
                start.remove
                  ? start.before.filter((p) => !chosen.some((c) => targetKey(c) === targetKey(p)))
                  : start.add
                    ? [
                        ...start.before,
                        ...chosen.filter(
                          (p) => !start.before.some((c) => targetKey(c) === targetKey(p)),
                        ),
                      ]
                    : chosen,
              );
              const svg = host.current?.querySelector<SVGSVGElement>('[data-wcl-chart-svg]');
              if (svg) {
                let box = svg.querySelector<SVGRectElement>('[data-drag-box]');
                if (!box) {
                  box = document.createElementNS(ns, 'rect');
                  box.setAttribute('data-drag-box', '');
                  svg.append(box);
                }
                const toLocal = (x: number, y: number) =>
                  new DOMPoint(x, y).matrixTransform(svg.getScreenCTM()!.inverse());
                const from = toLocal(start.x, start.y),
                  to = toLocal(event.clientX, event.clientY);
                const hit = svg.querySelector('[data-wcl-chart-hit-region]')!;
                box.setAttribute('x', String(Math.min(from.x, to.x)));
                box.setAttribute('width', String(Math.abs(from.x - to.x)));
                box.setAttribute(
                  'y',
                  unit === 'month' ? hit.getAttribute('y')! : String(Math.min(from.y, to.y)),
                );
                box.setAttribute(
                  'height',
                  unit === 'month' ? hit.getAttribute('height')! : String(Math.abs(from.y - to.y)),
                );
              }
            }}
            onPointerUp={(event) => {
              cancelHold();
              const start = drag.current;
              if (!start) return;
              if (!start.moved && !hold.current.fired) {
                const target = targetAt(event.clientX, event.clientY);
                if (target) activate(target, event.ctrlKey || event.metaKey);
              }
              hold.current.fired = false;
              drag.current = null;
              setDragging(false);
              event.currentTarget.releasePointerCapture(event.pointerId);
              host.current?.querySelector('[data-drag-box]')?.remove();
              if (start.moved) pointerTarget.current = null;
              if (start.moved)
                host.current
                  ?.querySelector('[data-wcl-chart-svg]')
                  ?.dispatchEvent(
                    new PointerEvent('pointerout', {bubbles: true, relatedTarget: document.body}),
                  );
            }}
            onPointerCancel={() => {
              cancelHold();
              hold.current.fired = false;
              if (drag.current) setSelected(drag.current.before);
              drag.current = null;
              setDragging(false);
              host.current?.querySelector('[data-drag-box]')?.remove();
            }}
            onFocus={(event) => {
              if (isFocusVisible && (event.target as Element).matches('[data-wcl-chart-canvas]'))
                setKeyboardTarget({
                  index: 0,
                  ...(unit === 'point' ? {seriesId: visibleSeries()[0]?.id ?? series[0].id} : {}),
                });
            }}
            onBlur={(event) => {
              if ((event.target as Element).matches('[data-wcl-chart-canvas]'))
                setKeyboardTarget(null);
            }}
            onKeyDownCapture={(event) => {
              if (event.key === 'Escape' && drag.current) {
                cancelHold();
                hold.current.fired = false;
                setSelected(drag.current.before);
                event.currentTarget.releasePointerCapture(drag.current.id);
                drag.current = null;
                setDragging(false);
                host.current?.querySelector('[data-drag-box]')?.remove();
                event.preventDefault();
                event.stopPropagation();
                return;
              }
              if (!(event.target as Element).matches('[data-wcl-chart-canvas]')) return;
              const available = visibleSeries();
              if (!available.length) return;
              const needle = host.current?.querySelector('[data-wcl-chart-reading-needle]');
              const readingX = needle?.getAttribute('x1');
              const activeColor = host.current
                ?.querySelector('[data-wcl-chart-reading-node][data-active]')
                ?.getAttribute('data-color');
              const readingPoint =
                readingX === undefined
                  ? undefined
                  : points().find(
                      (point) =>
                        Math.abs(Number(point.getAttribute('cx')) - Number(readingX)) < 0.01 &&
                        (!activeColor ||
                          point.closest('[data-wcl-chart-series]')?.getAttribute('data-color') ===
                            activeColor),
                    );
              const current = keyboardTarget ??
                pointerTarget.current ?? {
                  index: readingPoint ? Number(readingPoint.dataset.rowIndex) : 0,
                  seriesId: readingPoint?.dataset.series ?? available[0]?.id,
                };
              let index = current.index;
              let id = current.seriesId ?? available[0]!.id;
              if (event.key === 'ArrowRight') index = Math.min(rows.length - 1, index + 1);
              else if (event.key === 'ArrowLeft') index = Math.max(0, index - 1);
              else if (event.key === 'Home') index = 0;
              else if (event.key === 'End') index = rows.length - 1;
              else if (unit === 'point' && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
                event.preventDefault();
                event.stopPropagation();
                const at = Math.max(
                  0,
                  available.findIndex((s) => s.id === id),
                );
                id =
                  available[
                    (at + (event.key === 'ArrowUp' ? -1 : 1) + available.length) % available.length
                  ]!.id;
              } else if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.stopPropagation();
                activate(
                  {index, ...(unit === 'point' ? {seriesId: id} : {})},
                  event.ctrlKey || event.metaKey,
                );
                return;
              } else return;
              pointerTarget.current = null;
              setKeyboardTarget({index, ...(unit === 'point' ? {seriesId: id} : {})});
            }}
          >
            <LineChart
              aspectRatio={2.2}
              data={rows}
              series={series}
              title="Revenue and operating costs"
              description="Monthly values, in dollars."
              dataTableLabel="Complete monthly values"
              xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
              yAxis={{label: 'Amount', unit: 'USD', scale: {type: 'linear'}}}
              legend={{label: 'Financial series'}}
              visibilityLabels={{
                hideSeries: (label) => `Hide ${label}`,
                showSeries: (label) => `Show ${label}`,
                hidden: 'Hidden',
                showAll: 'Show all series',
                allHidden: {
                  title: 'All series hidden',
                  description: 'Use an eye to restore a series.',
                },
              }}
              emptyState={{title: 'No values', description: 'Choose a period with values.'}}
              invalidData={{title: 'Invalid values', description: 'Correct the source values.'}}
            />
          </div>
          <p className="keyboard-help" data-element="Keyboard instructions">
            {keyboardTarget ? `${targetName(keyboardTarget)}. ` : ''}Arrow keys explore.{' '}
            {unit === 'point' ? 'Up and Down change series. ' : ''}Enter or Space{' '}
            {action === 'inspect'
              ? 'activates the item.'
              : 'toggles selection. Hold Ctrl/Command to activate instead.'}
          </p>
          {openDetails ? (
            <div
              className="application-detail"
              data-element="Application details"
              aria-live="polite"
            >
              {opened ? (
                <>
                  <strong>{targetName(opened)}</strong>
                  <p>{valueText(opened)}</p>
                </>
              ) : (
                <p>
                  {action === 'select' ? 'Ctrl/Command-click or touch and hold' : 'Click or tap'} a{' '}
                  {unit} to open its values.
                </p>
              )}
            </div>
          ) : null}
          {action === 'select' ? (
            <div className="selection-summary" data-element="Selection summary" aria-live="polite">
              <span>{selected.length ? `${selected.length} selected` : 'Nothing selected'}</span>
              {selected.length ? (
                <button type="button" className="clear-selection" onClick={() => setSelected([])}>
                  Clear selection
                </button>
              ) : null}
              {selected.length ? (
                <ul>
                  {selected.map((item) => (
                    <li key={targetKey(item)}>
                      {targetName(item)}
                      {item.seriesId && hidden.includes(item.seriesId) ? ' (hidden)' : ''}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </section>
        {identify ? (
          <output className="element-name">
            {identified || 'Point to or focus an element to see its name.'}
          </output>
        ) : null}
      </main>
    </AppearanceProvider>
  );
}
createRoot(document.getElementById('root')!).render(<Prototype />);
