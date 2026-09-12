import {readFile} from 'node:fs/promises';

import {describe, expect, it} from 'vitest';

describe('static appearance styles', () => {
  it('keeps chart geometry direct, theme-aware, and independent from semantic status color', async () => {
    const styles = await readFile('src/styles.css', 'utf8');

    expect(styles).toMatch(/\[data-wcl-chart\]\s*\{[^}]*display:\s*grid/);
    expect(styles).toMatch(
      /:is\(\[data-wcl-chart-line\], \[data-wcl-chart-legend-line\]\)\s*\{[^}]*stroke:\s*var\(--wcl-chart-series-color\)/,
    );
    expect(styles).toMatch(
      /\[data-color='accent'\]\s*\{[^}]*--wcl-chart-series-color:\s*var\(--wcl-accent-rail\)/,
    );
    expect(styles).toMatch(
      /\[data-color='warning'\]\s*\{[^}]*--wcl-chart-series-color:\s*var\(--wcl-warning\)/,
    );
    expect(styles).toMatch(
      /:is\(\s*\[data-wcl-chart-table\],\s*\[data-wcl-chart-annotation-summary\],\s*\[data-wcl-chart-reading-announcement\]\s*\)\s*\{[^}]*clip-path:\s*inset\(50%\)/,
    );
    expect(styles).toMatch(
      /\[data-wcl-chart-tooltip-layer\]\s*\{[^}]*position:\s*fixed[^}]*pointer-events:\s*none/,
    );
    expect(styles).toMatch(
      /\[data-wcl-chart-tooltip\]\s*\{[^}]*left:\s*var\(--wcl-chart-tooltip-left\)/,
    );
    expect(styles).not.toMatch(/left:\s*clamp\([^;]*100vw - 100%/);
    expect(styles).toMatch(/\[data-wcl-chart-legend-button\]\s*\{[^}]*cursor:\s*pointer/);
    expect(styles).toMatch(
      /@media\s*\(forced-colors:\s*active\)[\s\S]*\[data-wcl-chart-axis-rail\]/,
    );
    expect(styles).toMatch(
      /\[data-series-index='1'\][\s\S]*?\[data-wcl-chart-line\][\s\S]*?stroke-dasharray:\s*6 3/,
    );
    expect(styles).toMatch(
      /\[data-series-index='5'\][\s\S]*?\[data-wcl-chart-line\][\s\S]*?stroke-dasharray:\s*10 3/,
    );
    expect(styles).toMatch(/\[data-wcl-chart-legend-swatch\]\s*\{[^}]*block-size:\s*0\.5rem/);
    expect(styles).toMatch(
      /:is\(\[data-wcl-chart-tick-label\], \[data-wcl-chart-axis-label\]\)\s*\{[^}]*font-size:\s*var\(--wcl-chart-axis-font-size\)/,
    );
    expect(styles).toMatch(
      /\[data-wcl-chart-annotation-label\]\s*\{[^}]*font-size:\s*calc\(var\(--wcl-chart-axis-font-size\) \* 0\.875\)/,
    );
    expect(styles).toMatch(/\[data-wcl-chart-legend\]\s*\{[^}]*font-size:\s*0\.875rem/);
    expect(styles).toMatch(
      /\[data-wcl-chart-bar\]\s*\{[^}]*fill:\s*color-mix\(in oklch, var\(--wcl-chart-series-color\) 30%, var\(--wcl-surface\)\)[^}]*stroke-width:\s*calc\(var\(--wcl-chart-line-width\) \* 0\.7\)/,
    );
    expect(styles).toMatch(
      /\[data-wcl-chart-area\]\s*\{[^}]*fill:\s*color-mix\(in oklch, var\(--wcl-chart-series-color\) 18%, transparent\)/,
    );
    expect(styles).toMatch(
      /:is\([\s\S]*?\[data-wcl-statistical-point\][\s\S]*?\)\s*\{[^}]*fill:\s*color-mix\(in oklch, var\(--wcl-chart-series-color\) 30%, transparent\)/,
    );
    expect(styles).toMatch(/\[data-wcl-statistical-mark\]\[data-muted\]\s*\{[^}]*opacity:\s*0\.24/);
    expect(styles).toMatch(
      /:is\(\[data-wcl-box-whisker\], \[data-wcl-box-whisker-cap\]\)\s*\{[^}]*stroke:\s*var\(--wcl-chart-series-color\)/,
    );
    expect(styles).toMatch(
      /\[data-wcl-chart-line\]\s*\{[^}]*stroke-width:\s*var\(--wcl-chart-line-width\)/,
    );
    expect(styles).toMatch(
      /@media\s*\(forced-colors:\s*active\)[\s\S]*?:is\(\[data-wcl-chart-line\], \[data-wcl-chart-legend-line\]\)\s*\{[^}]*fill:\s*none/,
    );
    expect(styles).not.toMatch(/\[data-wcl-chart\][^{]*\{[^}]*animation:/);
  });

  it('settles motion without removing state meaning when reduced motion is requested', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const reducedMotion = styles.match(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?--wcl-motion-duration:\s*0\.01ms/,
    );

    expect(reducedMotion).not.toBeNull();
  });

  it('keeps part-to-whole slices and the transient legend scrollbar legible across modes', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const radialLegend = styles.match(/\[data-wcl-radial-legend\]\s*\{([^}]*)\}/)?.[1];

    expect(styles).toMatch(
      /\[data-wcl-radial-segment\]\[data-aggregate\][\s\S]*?\[data-wcl-radial-slice\]\s*\{[^}]*stroke-dasharray:\s*3 2/,
    );
    expect(styles).toMatch(/\[data-wcl-radial-aggregate-label\]\s*\{[^}]*font-weight:\s*800/);
    expect(radialLegend).toContain('scrollbar-color: transparent transparent');
    expect(radialLegend).toContain('scrollbar-width: thin');
    expect(styles).toMatch(
      /@supports\s+not\s*\(scrollbar-color:\s*auto\)\s*\{[\s\S]*\[data-wcl-radial-legend\]::-webkit-scrollbar-thumb/,
    );
    expect(styles).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\[data-wcl-radial-segment\][\s\S]*transition:\s*none/,
    );
    expect(styles).toMatch(
      /@media\s*\(forced-colors:\s*active\)[\s\S]*\[data-wcl-radial-slice\][\s\S]*stroke:\s*CanvasText/,
    );
    expect(styles).toMatch(
      /@media\s*\(forced-colors:\s*active\)[\s\S]*\[data-wcl-radial-legend\][\s\S]*scrollbar-color:\s*CanvasText Canvas/,
    );
    expect(styles).toMatch(
      /\[data-wcl-part-to-whole-chart\]\s*\{[^}]*grid-template-rows:\s*auto auto minmax\(0, 1fr\)[^}]*overflow:\s*hidden/,
    );
    expect(styles).toMatch(
      /\[data-wcl-part-to-whole-canvas\]\s*\{[^}]*block-size:\s*100%[^}]*aspect-ratio:\s*auto/,
    );
  });

  it('paints heatmap data colors without adding a second transition', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const cellRules = [...styles.matchAll(/[^{}]*\[data-wcl-heatmap-cell\][^{}]*\{([^{}]*)\}/g)];
    expect(cellRules.length).toBeGreaterThan(0);
    for (const rule of cellRules) {
      const transition = rule[1]!.match(/transition:\s*([^;]*);/)?.[1] ?? '';
      expect(transition).not.toMatch(/background|\ball\b/);
    }
  });

  it('keeps a heatmap reading inside its cell bounds', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const activeCell = styles.match(
      /\[data-wcl-heatmap-cell\]\[data-active\]::after\s*\{([^}]*)\}/,
    )?.[1];

    expect(activeCell).toContain('inset');
    expect(activeCell).not.toContain('transform:');
  });

  it('maps caller-supplied Heatmap colors into cells and numeric keys', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const cell = styles.match(/\[data-wcl-heatmap-cell\]\s*\{([^}]*)\}/)?.[1];
    const lowCell = styles.match(
      /\[data-wcl-heatmap-cell\]\[data-range='low'\]\s*\{([^}]*)\}/,
    )?.[1];
    const highCell = styles.match(
      /\[data-wcl-heatmap-cell\]\[data-range='high'\]\s*\{([^}]*)\}/,
    )?.[1];
    const sequentialKey = styles.match(/\[data-wcl-heatmap-key-gradient\]\s*\{([^}]*)\}/)?.[1];
    const twoSidedKey = styles.match(
      /\[data-wcl-heatmap-key\]\[data-scale='two-sided'\] \[data-wcl-heatmap-key-gradient\]\s*\{([^}]*)\}/,
    )?.[1];

    expect(lowCell).toContain('--wcl-heatmap-cell-color: var(--wcl-heatmap-low-color)');
    expect(highCell).toContain('--wcl-heatmap-cell-color: var(--wcl-heatmap-high-color)');
    expect(cell).toContain('var(--wcl-heatmap-cell-color) 72%');
    expect(cell).toContain('var(--wcl-heatmap-cell-color) var(--wcl-heatmap-intensity)');
    expect(sequentialKey).toContain('var(--wcl-heatmap-high-color) 12%');
    expect(sequentialKey).toContain('var(--wcl-heatmap-high-color) 84%');
    expect(twoSidedKey).toContain('var(--wcl-heatmap-low-color) 84%');
    expect(twoSidedKey).toContain('var(--wcl-heatmap-high-color) 84%');
    expect(twoSidedKey).toContain('var(--wcl-surface) var(--wcl-heatmap-midpoint-position)');
  });

  it('keeps newer chart families in the established bounded chart area', async () => {
    const styles = await readFile('src/styles.css', 'utf8');

    for (const selector of [
      'data-wcl-part-to-whole-chart',
      'data-wcl-radar-chart',
      'data-wcl-heatmap',
      'data-wcl-sparkline',
    ]) {
      const rule = styles.match(new RegExp(`\\[${selector}\\]\\s*\\{([^}]*)\\}`))?.[1];
      expect(rule).toContain('inline-size: min(100%, max(32rem, var(--wcl-chart-minimum-width)))');
    }
  });

  it('uses half-filled Sparkline extremes and completes only existing cues on reading', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const ordinaryReading = styles.match(
      /\[data-wcl-chart-reading-node\]\[data-wcl-sparkline-reading-node='ordinary'\]\s*\{([^}]*)\}/,
    )?.[1];
    const completedReading = styles.match(
      /\[data-wcl-chart-reading-node\]\[data-wcl-sparkline-reading-node='complete'\]\s*\{([^}]*)\}/,
    )?.[1];

    expect(styles).toMatch(/\[data-wcl-sparkline-cue-fill\]\s*\{[^}]*fill:/);
    expect(ordinaryReading).toContain('fill: var(--wcl-text)');
    expect(ordinaryReading).toContain('stroke: none');
    expect(completedReading).toContain('fill: var(--wcl-text)');
    expect(completedReading).toContain('stroke: none');
    expect(styles).toMatch(/\[data-wcl-sparkline-tooltip-extreme\]\s*\{[^}]*font-weight:/);
  });

  it('keeps the large radial and heatmap examples compact in the showcase', async () => {
    const styles = await readFile('showcase/styles.css', 'utf8');

    expect(styles).toMatch(
      /:is\(\s*\[data-showcase-component='PieChart'\],[\s\S]*?\[data-showcase-component='Heatmap'\]\s*\)\s+\.showcase-example\s*\{[^}]*inline-size:\s*min\(100%, 26rem\)/,
    );
  });

  it('contains document overflow and gives both showcase panes a transient thin scrollbar', async () => {
    const styles = await readFile('showcase/styles.css', 'utf8');
    const body = styles.match(/body\s*\{([^}]*)\}/)?.[1];
    const provider = styles.match(/#root > \[data-wcl-provider\]\s*\{([^}]*)\}/)?.[1];
    const shell = styles.match(/\.showcase-shell\s*\{([^}]*)\}/)?.[1];
    const frame = styles.match(/\.showcase-frame\s*\{([^}]*)\}/)?.[1];
    const index = styles.match(/\.showcase-index\s*\{([^}]*)\}/)?.[1];
    const content = styles.match(/\.showcase-main-pane\s*\{([^}]*)\}/)?.[1];
    const contentBody = styles.match(/\.showcase-content\s*\{([^}]*)\}/)?.[1];

    expect(body).toContain('overflow: hidden');
    expect(provider).toContain('block-size: 100%');
    expect(provider).toContain('min-block-size: 0');
    expect(shell).toContain('overflow: hidden');
    expect(frame).toContain('block-size: 100%');
    expect(content).toContain('overflow: hidden auto');
    expect(content).toContain('contain: paint');
    expect(contentBody).toContain('contain: paint');
    expect(content).toContain('scrollbar-color: transparent transparent');
    expect(content).toContain('scrollbar-gutter: stable');
    expect(content).toContain('scrollbar-width: thin');
    expect(index).toContain('scrollbar-color: transparent transparent');
    expect(index).toContain('scrollbar-gutter: stable');
    expect(index).toContain('scrollbar-width: thin');
    expect(styles).toMatch(
      /:is\(\.showcase-index, \.showcase-main-pane\)\[data-scrollbar-active\][^{]*\{[^}]*scrollbar-color:\s*var\(--wcl-border-strong\) transparent/,
    );
    expect(styles).toMatch(
      /:is\(\.showcase-index, \.showcase-main-pane\):focus-visible\s*\{[^}]*outline-color:\s*var\(--wcl-accent-focus\)/,
    );
  });

  it('lets page scrolling pass through fitted Heatmaps', async () => {
    const styles = await readFile('src/styles.css', 'utf8');

    expect(styles).toMatch(/\[data-wcl-heatmap-frame\]\s*\{[^}]*overflow:\s*hidden/);
    expect(styles).toMatch(
      /\[data-wcl-heatmap-frame\]\[data-scrollable\]\s*\{[^}]*overflow:\s*auto/,
    );
    expect(styles).not.toMatch(
      /\[data-wcl-heatmap-frame\][^{]*\{[^}]*overscroll-behavior:\s*contain/,
    );
  });

  it('keeps radar geometry, series patterns, and readings legible across modes', async () => {
    const styles = await readFile('src/styles.css', 'utf8');

    expect(styles).toMatch(/\[data-wcl-radar-guide\]\s+polygon,[^{]*\{[^}]*stroke:/);
    expect(styles).toMatch(/\[data-wcl-radar-area\]\s*\{[^}]*fill:[^}]*stroke:/);
    expect(styles).toMatch(/\[data-wcl-radar-point\]\s*\{[^}]*stroke:/);
    expect(styles).toMatch(
      /\[data-wcl-radar-reading-line\]\s*\{[^}]*stroke:\s*var\(--wcl-text\)[^}]*stroke-dasharray:/,
    );
    expect(styles).toMatch(
      /\[data-wcl-radar-reading-point\]\s*\{[^}]*fill:\s*var\(--wcl-text\)[^}]*stroke:\s*none/,
    );
    expect(styles).toMatch(
      /\[data-wcl-radar-canvas\]\s*\{[^}]*aspect-ratio:\s*var\(--wcl-chart-aspect-ratio\)/,
    );
    expect(styles).toMatch(/\[data-wcl-radar-series\]\[data-muted\]\s*\{[^}]*opacity:/);
    expect(styles).toMatch(/\[data-wcl-radar-series\]\[data-pattern-index='1'\]/);
    for (const index of [1, 2, 3, 4, 5]) {
      expect(styles).toMatch(
        new RegExp(
          `\\[data-wcl-radar-legend-swatch\\] rect\\[data-pattern-index='${index}'\\]\\s*\\{[^}]*stroke-dasharray:`,
        ),
      );
    }
    expect(styles).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\[data-wcl-radar-series\][\s\S]*transition:\s*none/,
    );
    expect(styles).toMatch(
      /@media\s*\(forced-colors:\s*active\)[\s\S]*\[data-wcl-radar-area\][\s\S]*stroke:\s*CanvasText/,
    );
  });

  it('gives PageHeader its endpoint Route and SplitView a responsive two-way rail', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const route = styles.match(/\[data-wcl-page-header-route\]\s*\{([^}]*)\}/)?.[1];
    const separatorRail = styles.match(
      /\[data-wcl-split-view-separator\]::before\s*\{([^}]*)\}/,
    )?.[1];
    const splitCompact = styles.match(
      /@container\s+wcl-split-view\s*\(max-width:\s*40rem\)([\s\S]*?)\n\s*\[data-wcl-field\]/,
    )?.[1];

    expect(route).toContain('flex: 1');
    expect(route).toContain('min-inline-size: 1.125rem');
    expect(route).not.toContain('box-shadow');
    expect(styles).toMatch(
      /\[data-wcl-page-header-route-origin\][\s\S]*?border:\s*2px solid var\(--wcl-accent-rail\)/,
    );
    expect(styles).toMatch(
      /\[data-wcl-page-header-route-endpoint\]\s*\{[^}]*background:\s*var\(--wcl-page-header-route-status\)/,
    );
    expect(styles).toMatch(
      /\[data-wcl-page-header-route-track\]\s*\{[^}]*linear-gradient\([\s\S]*?var\(--wcl-accent-rail\)[\s\S]*?var\(--wcl-page-header-route-status\)/,
    );
    expect(separatorRail).toContain('inset-block: 0');
    expect(separatorRail).toContain('background: var(--wcl-border-strong)');
    expect(styles).toMatch(
      /\[data-wcl-split-view-separator\]:is\(:hover, :focus-visible\)::before\s*\{[^}]*background:\s*var\(--wcl-accent-focus\)/,
    );
    expect(splitCompact).toContain('grid-template-columns: minmax(0, 1fr)');
    expect(splitCompact).toContain('[data-wcl-split-view-separator]');
    expect(splitCompact).toContain('display: none');
    expect(splitCompact).not.toMatch(
      /\[data-wcl-split-view-secondary\]\s*\{[^}]*border-block-start/,
    );
    expect(styles).toMatch(
      /\[data-wcl-page-header-context\]\[data-tone='success'\]\s*\{[^}]*--wcl-page-header-route-status:\s*var\(--wcl-success\)/,
    );
    expect(styles).toMatch(
      /@media\s*\(forced-colors:\s*active\)[\s\S]*\[data-wcl-page-header-route-track\]\s*\{[^}]*background:\s*Highlight[^}]*forced-color-adjust:\s*none/,
    );
    expect(styles).toContain("[data-wcl-split-view][data-collapsed-pane='primary']");
    expect(styles).toContain("[data-wcl-split-view][data-collapsed-pane='secondary']");
    expect(styles).toContain('[data-wcl-split-view-pane-control]');
    expect(styles).toContain('[data-wcl-split-view-pane-icon]');
    expect(styles).toMatch(
      /\[data-wcl-split-view-pane-control\]\[data-hovered\]\s*\{[^}]*border-color:\s*var\(--wcl-accent-muted-on-raised\)[^}]*background:\s*var\(--wcl-accent-soft-on-raised\)[^}]*color:\s*var\(--wcl-accent-hover-contrast-on-raised\)[^}]*box-shadow:\s*inset 0 0 0 1px var\(--wcl-accent-muted-on-raised\)/,
    );
    expect(styles).not.toMatch(
      /\[data-wcl-split-view-pane-control\]\[data-hovered\]\s*\{[^}]*outline/,
    );
    expect(styles).toMatch(
      /@media\s*\(forced-colors:\s*active\)[\s\S]*\[data-wcl-split-view-separator\]::before\s*\{[^}]*background:\s*CanvasText/,
    );
  });

  it('keeps semantic feedback colors independent from application accent', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const statusRules = styles.match(
      /:is\(\[data-wcl-status-indicator\], \[data-wcl-badge\], \[data-wcl-alert\], \[data-wcl-meter\]\)\s*\{([^}]*)\}/,
    )?.[1];

    expect(styles).toContain("[data-tone='success']");
    expect(styles).toContain("[data-tone='warning']");
    expect(styles).toContain("[data-tone='danger']");
    expect(statusRules).toContain('--wcl-feedback-color: var(--wcl-text-muted)');
    expect(styles).toMatch(
      /:is\([\s\S]*?\[data-wcl-status-indicator\][\s\S]*?\)\[data-tone='success'\][\s\S]*?--wcl-feedback-color:\s*var\(--wcl-success\)/,
    );
    expect(styles).toMatch(
      /:is\([\s\S]*?\[data-wcl-status-indicator\][\s\S]*?\)\[data-tone='warning'\][\s\S]*?--wcl-feedback-color:\s*var\(--wcl-warning\)/,
    );
    expect(styles).toMatch(
      /:is\([\s\S]*?\[data-wcl-status-indicator\][\s\S]*?\)\[data-tone='danger'\][\s\S]*?--wcl-feedback-color:\s*var\(--wcl-danger\)/,
    );
  });

  it('animates feedback activity only in active states and settles it for reduced motion', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const progressActivity = styles.match(
      /\[data-wcl-progress-bar\]\[data-active\]\s+\[data-wcl-progress-fill\]::after\s*\{([^}]*)\}/,
    )?.[1];
    const spinnerActivity = styles.match(
      /\[data-wcl-spinner\]\[data-active\]\s+\[data-wcl-spinner-glyph\]\s*\{([^}]*)\}/,
    )?.[1];
    const spinnerSegmentActivity = styles.match(
      /\[data-wcl-spinner\]\[data-active\]\s+\[data-wcl-spinner-segment\]\s*\{([^}]*)\}/,
    )?.[1];
    const spinnerGlyph = styles.match(/\[data-wcl-spinner-glyph\]\s*\{([^}]*)\}/)?.[1];
    const spinnerSegments = styles.match(/\[data-wcl-spinner-segments\]\s*\{([^}]*)\}/)?.[1];
    const processActivity = styles.match(
      /\[data-wcl-process-stage\]\[data-status='active'\]\s+\[data-wcl-process-stage-marker\]::after\s*\{([^}]*)\}/,
    )?.[1];
    const processRail = styles.match(
      /\[data-wcl-process-stage\]:not\(:last-child\)::after\s*\{([^}]*)\}/,
    )?.[1];
    const processStage = styles.match(/\[data-wcl-process-stage\]\s*\{([^}]*)\}/)?.[1];
    const processCore = styles.match(/\[data-wcl-process-stage-core\]\s*\{([^}]*)\}/)?.[1];
    const reducedMotion = styles.match(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)([\s\S]*)/,
    )?.[1];

    expect(progressActivity).toContain('animation: wcl-progress-route');
    expect(spinnerActivity).toContain('animation: wcl-spinner-route 1.65s');
    expect(spinnerSegmentActivity).toContain('animation: wcl-spinner-segment 1.65s');
    expect(spinnerSegmentActivity).toContain('var(--wcl-spinner-segment-index) * 132ms');
    expect(spinnerGlyph).toContain('inline-size: 1.375rem');
    expect(spinnerSegments).toContain('stroke-width: 3.5');
    expect(processActivity).toContain('animation: wcl-process-stage-active 1.5s ease-out infinite');
    expect(processActivity).toContain('inset: -0.4375rem');
    expect(processStage).toContain('min-block-size: 3.25rem');
    expect(processRail).toContain('inset-block: 1.125rem 0');
    expect(processRail).toContain(
      'background: color-mix(in srgb, var(--wcl-accent-rail) 33%, transparent)',
    );
    expect(processCore).toContain('fill: currentcolor');
    expect(processCore).not.toContain('animation');
    expect(styles).toMatch(
      /@keyframes wcl-process-stage-active\s*\{[\s\S]*?from\s*\{[\s\S]*?opacity:\s*0\.65;[\s\S]*?transform:\s*scale\(0\.65\);[\s\S]*?to\s*\{[\s\S]*?opacity:\s*0;[\s\S]*?transform:\s*scale\(1\.25\);/,
    );
    expect(styles).toMatch(
      /\[data-wcl-spinner-segment\]:nth-child\(6\)\s*\{[^}]*--wcl-spinner-segment-index:\s*5/,
    );
    expect(reducedMotion).toMatch(
      /\[data-wcl-progress-fill\]::after[\s\S]*animation-iteration-count:\s*1/,
    );
    expect(reducedMotion).toMatch(
      /\[data-wcl-spinner-glyph\],[\s\S]*\[data-wcl-spinner-segment\][\s\S]*animation:\s*none !important/,
    );
    expect(reducedMotion).toMatch(/\[data-wcl-spinner-segment\]\s*\{[^}]*opacity:\s*1/);
    expect(reducedMotion).toMatch(
      /\[data-wcl-process-stage-marker\]::after\s*\{[^}]*animation:\s*none !important/,
    );
    expect(styles).toMatch(
      /@media\s*\(forced-colors:\s*active\)[\s\S]*\[data-wcl-process-stage\]:not\(:last-child\)::after\s*\{[^}]*background:\s*CanvasText/,
    );
    expect(styles).toMatch(
      /\[data-wcl-process-stage\]\[data-status='warning'\][\s\S]*?color:\s*var\(--wcl-warning\)/,
    );
    expect(styles).toMatch(
      /\[data-wcl-process-stage\]\[data-status='failed'\][\s\S]*?color:\s*var\(--wcl-danger\)/,
    );
  });

  it('contains long progress values inside narrow label rows', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const value = styles.match(
      /:is\(\[data-wcl-progress-value\], \[data-wcl-meter-value\]\)\s*\{([^}]*)\}/,
    )?.[1];

    expect(value).toContain('flex: 0 1 auto');
    expect(value).toContain('min-inline-size: 0');
    expect(value).toContain('overflow-wrap: anywhere');
  });

  it('keeps every alert tone on the same stable geometry', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const alerts = styles.match(/\[data-wcl-alert\]\s*\{([^}]*)\}/)?.[1];

    expect(alerts).toContain('grid-template-columns: 1.125rem minmax(0, 1fr)');
    expect(alerts).toContain('border: 1px solid var(--wcl-feedback-border)');
    expect(styles).not.toMatch(
      /\[data-wcl-alert\]\[data-tone='(?:warning|danger)'\][^{]*\{[^}]*(?:padding|margin|border-width)/,
    );
  });

  it('keeps broad alerts within the rounded containment grammar', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const banner = styles.match(/\[data-wcl-alert\]\[data-kind='banner'\]\s*\{([^}]*)\}/)?.[1];

    expect(banner).not.toMatch(/border-radius:\s*0/);
  });

  it('keeps loading structure legible while settling its motion when requested', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const skeleton = styles.match(/\[data-wcl-skeleton\]\s*\{([^}]*)\}/)?.[1];
    const skeletonLine = styles.match(/\[data-wcl-skeleton-line\]\s*\{([^}]*)\}/)?.[1];
    const reducedMotion = styles.match(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)([\s\S]*)/,
    )?.[1];

    expect(skeleton).toContain('min-inline-size: 8rem');
    expect(skeletonLine).toContain('animation: wcl-skeleton-route');
    expect(reducedMotion).toMatch(/\[data-wcl-skeleton-line\][\s\S]*animation:\s*none !important/);
  });

  it('coordinates EmptyState rails and recovery actions with their condition colors', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const emptyState = styles.match(/\[data-wcl-empty-state\]\s*\{([^}]*)\}/)?.[1];
    const unavailable = styles.match(
      /\[data-wcl-empty-state\]\[data-kind='unavailable'\]\s*\{([^}]*)\}/,
    )?.[1];
    const unavailableAction = styles.match(
      /\[data-wcl-empty-state\]\[data-kind='unavailable'\]\s+\[data-wcl-button\]\s*\{([^}]*)\}/,
    )?.[1];

    expect(emptyState).toContain('border-inline-start: 3px solid var(--wcl-accent-rail)');
    expect(unavailable).toContain('border-inline-start-color: var(--wcl-warning)');
    expect(unavailable).toContain('--wcl-accent-focus: var(--wcl-warning)');
    expect(unavailable).toContain('--wcl-accent-muted: var(--wcl-warning)');
    expect(unavailable).toContain('--wcl-accent-soft: var(--wcl-warning-surface)');
    expect(unavailableAction).toContain('border-color: var(--wcl-warning)');
    expect(unavailableAction).toContain('background: var(--wcl-warning-surface)');
    expect(unavailableAction).toContain('color: var(--wcl-warning)');
  });

  it('colors, stacks, and times notifications while preserving pause and focus treatment', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const region = styles.match(/\[data-wcl-notification-region\]\s*\{([^}]*)\}/)?.[1];
    const notification = styles.match(/\[data-wcl-notification\]\s*\{([^}]*)\}/)?.[1];
    const timer = styles.match(/\[data-wcl-notification-timer\]\s*\{([^}]*)\}/)?.[1];
    const reducedMotion = styles.match(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)([\s\S]*)/,
    )?.[1];

    expect(region).toContain('position: fixed');
    expect(region).toContain('direction: inherit');
    expect(region).toContain('max-inline-size: 22rem');
    expect(notification).toContain('pointer-events: auto');
    expect(styles).toMatch(
      /\[data-wcl-notification\]\[data-tone='general'\]\s*\{[^}]*--wcl-feedback-border:\s*var\(--wcl-accent-rail-on-raised\)/,
    );
    expect(styles).toMatch(
      /\[data-wcl-notification\]\[data-tone='general'\]\s*\{[^}]*--wcl-feedback-color:\s*var\(--wcl-accent-rail-on-raised\)/,
    );
    expect(styles).toMatch(
      /\[data-wcl-notification\]\[data-tone='general'\]\s*\{[^}]*--wcl-feedback-focus:\s*var\(--wcl-accent-focus-on-raised\)/,
    );
    expect(styles).toMatch(
      /\[data-wcl-notification\]\[data-tone='general'\]\s*\{[^}]*--wcl-feedback-title-color:\s*var\(--wcl-text\)/,
    );
    expect(styles).toMatch(
      /\[data-wcl-notification\]\[data-tone='general'\]\s*\{[^}]*--wcl-feedback-surface:\s*var\(--wcl-accent-soft-on-raised\)/,
    );
    expect(styles).toMatch(
      /\[data-wcl-notification\]\[data-tone='success'\][\s\S]*--wcl-feedback-border:\s*var\(--wcl-success\)/,
    );
    expect(styles).toMatch(
      /\[data-wcl-notification\]\[data-tone='warning'\][\s\S]*--wcl-feedback-border:\s*var\(--wcl-warning\)/,
    );
    expect(styles).toMatch(
      /\[data-wcl-notification\]\[data-tone='error'\][\s\S]*--wcl-feedback-border:\s*var\(--wcl-danger\)/,
    );
    expect(styles).toMatch(
      /\[data-wcl-notification-count\][^}]*z-index:\s*10[^}]*font-variant-numeric:\s*tabular-nums/,
    );
    expect(styles).toMatch(
      /\[data-wcl-notification-list\]\s*\{[^}]*overflow:\s*auto[^}]*scrollbar-color:\s*transparent transparent/,
    );
    expect(styles).toMatch(
      /\[data-wcl-notification-list\]\[data-scrollbar-active\][\s\S]*scrollbar-color:\s*var\(--wcl-border-strong\) transparent/,
    );
    expect(styles).toMatch(
      /\[data-wcl-notification-list\]:focus-visible\s*\{[^}]*outline-color:\s*var\(--wcl-accent-focus\)/,
    );
    expect(timer).toContain('animation: wcl-notification-timeout');
    expect(timer).toContain('var(--wcl-notification-timeout)');
    expect(styles).toMatch(
      /\[data-wcl-notification-region\]:is\(\[data-hovered\], :focus-within\)[\s\S]*animation-play-state:\s*paused/,
    );
    expect(reducedMotion).toMatch(
      /\[data-wcl-notification-timer\][\s\S]*animation:\s*none !important/,
    );
    expect(styles).toMatch(
      /\[data-wcl-notification\]:focus-visible[\s\S]*var\(--wcl-accent-focus\)/,
    );
    expect(styles).toMatch(
      /@media\s*\(forced-colors:\s*active\)[\s\S]*\[data-wcl-notification\][\s\S]*CanvasText/,
    );
    expect(styles).toMatch(
      /@media\s*\(forced-colors:\s*active\)[\s\S]*\[data-wcl-notification-list\][\s\S]*scrollbar-color:\s*CanvasText Canvas/,
    );
  });

  it('contains modal work surfaces and reflows drawers at compact widths', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const underlay = styles.match(/\[data-wcl-overlay\]\s*\{([^}]*)\}/)?.[1];
    const drawerUnderlay = styles.match(
      /\[data-wcl-overlay\]\[data-kind='drawer'\]\s*\{([^}]*)\}/,
    )?.[1];
    const modal = styles.match(/\[data-wcl-overlay-modal\]\s*\{([^}]*)\}/)?.[1];
    const header = styles.match(/\[data-wcl-overlay-header\]\s*\{([^}]*)\}/)?.[1];
    const compact = styles.match(/@media\s*\(width\s*<=\s*40rem\)([\s\S]*)/)?.[1];
    const reducedMotion = styles.match(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)([\s\S]*)/,
    )?.[1];

    expect(underlay).toContain('position: fixed');
    expect(underlay).toContain('var(--visual-viewport-height');
    expect(drawerUnderlay).toContain('overflow: hidden');
    expect(modal).toContain('max-block-size: calc(var(--visual-viewport-height');
    expect(header).toContain('max-block-size: calc(var(--visual-viewport-height');
    expect(header).toContain('overflow: auto');
    expect(underlay).toMatch(/--wcl-overlay-rail:\s*var\(--wcl-accent-rail\)/);
    expect(styles).toMatch(
      /\[data-wcl-overlay\]\[data-kind='dialog'\]\s+\[data-wcl-overlay-modal\][\s\S]*border-block-start:\s*3px solid var\(--wcl-overlay-rail\)/,
    );
    expect(styles).toMatch(
      /\[data-wcl-overlay\]\[data-action-kind='destructive'\][\s\S]*--wcl-overlay-rail:\s*var\(--wcl-danger\)/,
    );
    expect(styles).toMatch(
      /\[data-wcl-overlay\]\[data-kind='drawer'\]\[data-placement='start'\][\s\S]*justify-items:\s*start/,
    );
    expect(styles).toMatch(
      /\[data-wcl-overlay\]\[data-kind='drawer'\]\[data-placement='end'\][\s\S]*justify-items:\s*end/,
    );
    expect(styles).toMatch(
      /\[data-wcl-overlay\]\[data-kind='drawer'\]\[data-placement='top'\][\s\S]*align-items:\s*start/,
    );
    expect(styles).toMatch(
      /\[data-wcl-overlay\]\[data-kind='drawer'\]\[data-placement='bottom'\][\s\S]*align-items:\s*end/,
    );
    expect(styles).toMatch(
      /\[data-wcl-drawer-surface\]::after[\s\S]*mask-image:\s*linear-gradient/,
    );
    expect(styles).toMatch(
      /\[data-wcl-provider\]:has\([\s\S]*?\[data-physical-placement='left'\][\s\S]*?\[data-wcl-drawer-preview\][\s\S]*?--wcl-drawer-reserved-left/,
    );
    expect(styles).toMatch(
      /\[data-wcl-provider\]\s*\{[^}]*padding:\s*var\(--wcl-drawer-reserved-top[^;]*var\(--wcl-drawer-reserved-right[^;]*var\(--wcl-drawer-reserved-bottom[^;]*var\(--wcl-drawer-reserved-left/,
    );
    expect(styles).toMatch(
      /\[data-wcl-notification-region\]\s*\{[^}]*--wcl-notification-region-max-block-size:[^;]*--wcl-drawer-reserved-top[^;]*--wcl-drawer-reserved-bottom/,
    );
    expect(styles).toMatch(
      /\[data-wcl-notification-region\]\s*\{[^}]*inline-size:[^;]*--wcl-drawer-reserved-left[^;]*--wcl-drawer-reserved-right[^}]*max-block-size:\s*var\(--wcl-notification-region-max-block-size\)/,
    );
    expect(styles).toMatch(
      /\[data-wcl-notification-region\]:dir\(rtl\)\s*\{[^}]*--wcl-drawer-notification-inline-start:\s*var\(--wcl-drawer-reserved-right[^}]*--wcl-drawer-notification-inline-end:\s*var\(--wcl-drawer-reserved-left/,
    );
    expect(styles).toMatch(
      /\[data-wcl-drawer-panel\]\[data-physical-placement='left'\]\s+\[data-wcl-drawer-preview\],[\s\S]*?width:\s*var\(--wcl-drawer-preview-extent\);[\s\S]*?height:\s*100%/,
    );
    expect(styles).toMatch(
      /\[data-wcl-drawer-panel\]\[data-physical-placement='left'\]\s+\[data-wcl-drawer-preview\]\s*\{[^}]*right:\s*0/,
    );
    expect(styles).toMatch(
      /:is\(\[data-wcl-drawer-grip-outline\], \[data-wcl-drawer-grip-marks\]\)\s*\{[^}]*stroke:\s*var\(--wcl-overlay-rail\)/,
    );
    expect(styles).toMatch(
      /\[data-wcl-drawer-preview\]\s*\{[^}]*opacity:\s*var\(--wcl-drawer-preview-scale\)[^}]*transition:[^}]*width 220ms[^}]*height 220ms/,
    );
    expect(compact).toMatch(
      /\[data-wcl-overlay\]\[data-kind='drawer'\][\s\S]*inline-size:\s*100%[\s\S]*border-radius:\s*0/,
    );
    expect(compact).toMatch(
      /\[data-wcl-overlay\]\[data-kind='drawer'\]\s+\[data-wcl-overlay-modal\]\s*\{[^}]*block-size:\s*var\(--visual-viewport-height,\s*100dvh\)\s*!important/,
    );
    expect(reducedMotion).toMatch(
      /\[data-wcl-overlay\],[\s\S]*\[data-wcl-overlay-modal\][\s\S]*animation:\s*none !important/,
    );
    expect(styles).toMatch(
      /@media\s*\(forced-colors:\s*active\)[\s\S]*\[data-wcl-overlay-modal\][\s\S]*border-color:\s*CanvasText/,
    );
  });

  it('keeps anchored surfaces attached, bounded, legible, and visible in alternate modes', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const anchorArrow = await readFile('src/overlays/anchored-overlay.tsx', 'utf8');
    const anchoredConsumers = await Promise.all(
      ['context-menu.tsx', 'menu.tsx', 'popover.tsx', 'tooltip.tsx'].map((file) =>
        readFile(`src/overlays/${file}`, 'utf8'),
      ),
    );
    const anchoredSurface = styles.match(
      /:is\(\s*\[data-wcl-popover\],\s*\[data-wcl-menu-popover\](?:,\s*\[data-wcl-breadcrumb-popover\])?\s*\)\s*\{([^}]*)\}/,
    )?.[1];
    const menuItem = styles.match(/\[data-wcl-menu-item\]\s*\{([^}]*)\}/)?.[1];
    const reducedMotion = styles.match(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)([\s\S]*)/,
    )?.[1];
    const forcedColors = styles.match(/@media\s*\(forced-colors:\s*active\)([\s\S]*)/)?.[1];

    expect(anchoredSurface).toContain('max-inline-size: calc(100vw');
    expect(anchoredSurface).toContain('max-block-size: var(--available-height)');
    expect(anchoredSurface).toContain('background: var(--wcl-surface-raised)');
    expect(anchoredSurface).toContain(
      'border-block-start: 3px solid var(--wcl-accent-rail-on-raised)',
    );
    expect(anchorArrow).toContain('viewBox="0 0 14 7"');
    expect(anchorArrow).toContain('arrowBoundaryOffset: 12');
    expect(anchorArrow).toContain('data-wcl-anchor-arrow-rail-mask');
    expect(anchorArrow).toContain('d="M1 3.5h12v5H1Z"');
    expect(anchorArrow).toContain('data-variant="accent-rail"');
    expect(anchorArrow).toContain('d="M0 5.5h1.5L7 0l5.5 5.5H14"');
    expect(anchorArrow).toContain('data-variant="accent"');
    expect(anchorArrow).toContain('data-variant="neutral"');
    expect(anchorArrow).toContain('d="m0.5 6.5 6.5-6.5 6.5 6.5"');
    for (const consumer of anchoredConsumers) {
      expect(consumer).toContain('{...anchoredOverlayPositionProps}');
    }
    expect(styles).toMatch(
      /:is\(\s*\[data-wcl-popover\],\s*\[data-wcl-menu-popover\](?:,\s*\[data-wcl-breadcrumb-popover\])?\s*\)\s+\[data-wcl-anchor-arrow\]\[data-placement='bottom'\]\s+\[data-wcl-anchor-arrow-edge\]\[data-variant='accent-rail'\]/,
    );
    expect(styles).toMatch(
      /:is\(\s*\[data-wcl-popover\],\s*\[data-wcl-menu-popover\](?:,\s*\[data-wcl-breadcrumb-popover\])?\s*\)\s+\[data-wcl-anchor-arrow\]\[data-placement='bottom'\]\s+\[data-wcl-anchor-arrow-rail-mask\]\s*\{[^}]*display:\s*block/,
    );
    expect(styles).toMatch(
      /:is\(\s*\[data-wcl-popover\],\s*\[data-wcl-menu-popover\](?:,\s*\[data-wcl-breadcrumb-popover\])?\s*\)\s+\[data-wcl-anchor-arrow\]:not\(\[data-placement='bottom'\]\)\s+\[data-wcl-anchor-arrow-edge\]\[data-variant='accent'\]/,
    );
    expect(styles).toMatch(
      /\[data-wcl-tooltip\]\s+\[data-wcl-anchor-arrow-edge\]\[data-variant='neutral'\]\s*\{[^}]*stroke:\s*var\(--wcl-border-strong\)/,
    );
    expect(menuItem).toContain('grid-template-columns: minmax(0, 1fr) auto');
    expect(styles).toMatch(
      /\[data-wcl-menu-item\]\[data-focused\][\s\S]*var\(--wcl-accent-focus-on-raised\)/,
    );
    expect(styles).toMatch(
      /\[data-wcl-menu-item\]\[data-tone='danger'\][\s\S]*var\(--wcl-danger\)/,
    );
    expect(styles).toMatch(
      /\[data-wcl-context-menu-target\]:focus-visible[\s\S]*var\(--wcl-accent-focus\)/,
    );
    expect(reducedMotion).toMatch(
      /:is\(\s*\[data-wcl-popover\],\s*\[data-wcl-tooltip\],\s*\[data-wcl-menu-popover\](?:,\s*\[data-wcl-breadcrumb-popover\])?\s*\)[\s\S]*transition:\s*none/,
    );
    expect(forcedColors).toMatch(
      /:is\(\s*\[data-wcl-popover\],\s*\[data-wcl-tooltip\],\s*\[data-wcl-menu-popover\](?:,\s*\[data-wcl-breadcrumb-popover\])?\s*\)[\s\S]*border-color:\s*CanvasText/,
    );
  });

  it('uses whole-row menu highlights without a leading state rail', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const menuSource = await readFile('src/overlays/menu.tsx', 'utf8');
    const hoveredItem = styles.match(/\[data-wcl-menu-item\]\[data-hovered\]\s*\{([^}]*)\}/)?.[1];
    const focusedItem = styles.match(/\[data-wcl-menu-item\]\[data-focused\]\s*\{([^}]*)\}/)?.[1];

    expect(hoveredItem).toContain('background: var(--wcl-accent-soft-on-raised)');
    expect(focusedItem).toContain('background: var(--wcl-accent-soft-on-raised)');
    expect(focusedItem).toContain('box-shadow: inset 0 0 0 2px');
    expect(menuSource).not.toContain('data-wcl-menu-item-rail');
    expect(styles).not.toContain('[data-wcl-menu-item-rail]');
  });

  it('maps identity and surface roles to system colors in forced-color mode', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const forcedColors = styles.match(/@media\s*\(forced-colors:\s*active\)([\s\S]*)/);

    expect(forcedColors?.[1]).toContain('--wcl-accent: Highlight !important');
    expect(forcedColors?.[1]).toContain('--wcl-accent-contrast: HighlightText !important');
    expect(forcedColors?.[1]).toContain('--wcl-accent-fill: Highlight !important');
    expect(forcedColors?.[1]).toContain('--wcl-accent-fill-boundary: Highlight !important');
    expect(forcedColors?.[1]).toContain('--wcl-accent-hover-contrast: HighlightText !important');
    expect(forcedColors?.[1]).toContain('--wcl-accent-hover-edge: Highlight !important');
    expect(forcedColors?.[1]).toContain('--wcl-accent-rail: Highlight !important');
    expect(forcedColors?.[1]).toContain('--wcl-surface: Canvas');
    expect(forcedColors?.[1]).toContain('--wcl-text: CanvasText');
    expect(forcedColors?.[1]).toMatch(
      /:is\(\[data-wcl-status-indicator\], \[data-wcl-badge\], \[data-wcl-alert\], \[data-wcl-meter\]\)[\s\S]*--wcl-feedback-color:\s*CanvasText/,
    );
    expect(forcedColors?.[1]).toMatch(/\[data-wcl-progress-fill\][\s\S]*background:\s*Highlight/);
    expect(forcedColors?.[1]).toMatch(
      /:is\(\[data-wcl-progress-track\], \[data-wcl-meter-track\]\)[\s\S]*border-color:\s*CanvasText/,
    );
  });

  it('owns the bounded spatial grammar and equal-item behavior', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const stackChildren = styles.match(/\[data-wcl-stack\]\s*>\s*\*\s*\{([^}]*)\}/)?.[1];

    expect(styles).toContain('[data-wcl-stack]');
    expect(stackChildren).toContain('margin-block: 0');
    expect(styles).toContain("[data-wcl-inline-group][data-equal-items='true'] > *");
    expect(styles).toContain("[data-wcl-inline-group][data-equal-items='true'][data-wrap='true']");
    expect(styles).toContain('repeat(auto-fit, minmax(min(100%, 7.5rem), 1fr))');
    expect(styles).toContain('[data-wcl-responsive-grid]');
    expect(styles).toContain('repeat(auto-fit, minmax(min(100%, var(--wcl-grid-minimum)), 1fr))');
    expect(styles).toContain("[data-wcl-responsive-grid][data-equal-items='true']");
  });

  it('keeps scroll-region focus visible in ordinary and forced-color modes', async () => {
    const styles = await readFile('src/styles.css', 'utf8');

    expect(styles).toMatch(/\[data-wcl-scroll-region\]:focus-visible[\s\S]*--wcl-accent-focus/);
    expect(styles).toMatch(
      /@media\s*\(forced-colors:\s*active\)[\s\S]*\[data-wcl-scroll-region\]:focus-visible[\s\S]*Highlight/,
    );
    expect(styles).toMatch(
      /@media\s*\(forced-colors:\s*active\)[\s\S]*@layer wcl\.components[\s\S]*\[data-wcl-surface\][\s\S]*box-shadow:\s*none/,
    );
  });

  it('gives overflowing charts the ScrollRegion scrollbar states', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const chartFrame = styles.match(
      /\[data-wcl-chart-frame\]\[data-overflow='scroll'\]\s*\{([^}]*)\}/,
    )?.[1];

    expect(chartFrame).toContain('scrollbar-color: transparent transparent');
    expect(chartFrame).toContain('scrollbar-width: thin');
    expect(chartFrame).toContain('transition: scrollbar-color');
    expect(styles).toMatch(
      /\[data-wcl-chart-frame\]\[data-overflow='scroll'\]\[data-scrollbar-active\][\s\S]*scrollbar-color:\s*var\(--wcl-border-strong\) transparent/,
    );
    expect(styles).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\[data-wcl-chart-frame\]\[data-overflow='scroll'\]\s*\{[^}]*transition:\s*none/,
    );
    expect(styles).toMatch(
      /@media\s*\(forced-colors:\s*active\)[\s\S]*\[data-wcl-chart-frame\]\[data-overflow='scroll'\]\s*\{[^}]*scrollbar-color:\s*CanvasText Canvas/,
    );
  });

  it('reflows section headers from available space rather than viewport width', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const sectionHeader = styles.match(/\[data-wcl-section-header\]\s*\{([^}]*)\}/)?.[1];

    expect(sectionHeader).toContain('display: flex');
    expect(sectionHeader).toContain('flex-wrap: wrap');
    expect(styles).not.toMatch(/@media\s*\(width[^)]*\)[\s\S]*\[data-wcl-section-header\]/);
  });

  it('gives actions stable bounded sizing without overlap-producing transforms', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const actionRules = styles.match(
      /:is\(\[data-wcl-button\],\s*\[data-wcl-icon-button\],\s*\[data-wcl-toggle-button\]\)\s*\{([^}]*)\}/,
    )?.[1];
    const actionInteractionRules = [
      ...styles.matchAll(
        /:is\(\[data-wcl-button\],\s*\[data-wcl-icon-button\](?:,\s*\[data-wcl-toggle-button\])?\)[^{]*(?:hovered|pressed)[^{]*\{([^}]*)\}/g,
      ),
    ]
      .map((match) => match[1])
      .join('\n');

    expect(actionRules).toContain('min-block-size: 2.5rem');
    expect(actionRules).toContain('white-space: normal');
    expect(actionRules).toContain('overflow-wrap: anywhere');
    expect(styles).toContain("[data-size='compact']");
    expect(actionInteractionRules).not.toMatch(/transform:\s*(?:translate|scale)/);
  });

  it('supports literal primary fills with a conditional surface boundary', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const primary = styles.match(
      /:is\(\[data-wcl-button\], \[data-wcl-icon-button\], \[data-wcl-toggle-button\]\)\[data-variant='primary'\]\s*\{([^}]*)\}/,
    )?.[1];

    expect(primary).toContain('background: var(--wcl-accent-fill)');
    expect(primary).toContain('border-color: var(--wcl-accent-fill-boundary)');
  });

  it('selects accent roles for the provider canvas and each owned Surface variant', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const provider = styles.match(/\[data-wcl-provider\]\s*\{([^}]*)\}/)?.[1];

    expect(provider).toContain(
      '--wcl-accent-fill-boundary: var(--wcl-accent-fill-boundary-on-canvas)',
    );
    for (const surface of ['base', 'raised', 'subtle']) {
      const rules = styles.match(
        new RegExp(`\\[data-wcl-surface\\]\\[data-variant='${surface}'\\]\\s*\\{([^}]*)\\}`),
      )?.[1];
      expect(rules).toContain(
        `--wcl-accent-fill-boundary: var(--wcl-accent-fill-boundary-on-${surface})`,
      );
      expect(rules).toContain(`--wcl-accent-focus: var(--wcl-accent-focus-on-${surface})`);
      expect(rules).toContain(`--wcl-accent-rail: var(--wcl-accent-rail-on-${surface})`);
      expect(rules).toContain(`--wcl-accent-soft: var(--wcl-accent-soft-on-${surface})`);
    }

    const toolbar = styles.match(/\[data-wcl-toolbar\]\s*\{([^}]*)\}/)?.[1];
    expect(toolbar).toContain(
      '--wcl-accent-fill-boundary: var(--wcl-accent-fill-boundary-on-subtle)',
    );
    expect(toolbar).toContain('--wcl-accent-focus: var(--wcl-accent-focus-on-subtle)');
    expect(toolbar).toContain(
      '--wcl-accent-hover-contrast: var(--wcl-accent-hover-contrast-on-subtle)',
    );
    expect(toolbar).toContain('--wcl-accent-muted: var(--wcl-accent-muted-on-subtle)');
    expect(toolbar).toContain('--wcl-accent-rail: var(--wcl-accent-rail-on-subtle)');
    expect(toolbar).toContain('--wcl-accent-soft: var(--wcl-accent-soft-on-subtle)');

    const fieldGroup = styles.match(/\[data-wcl-field-group\]\s*\{([^}]*)\}/)?.[1];
    expect(fieldGroup).toContain(
      '--wcl-accent-fill-boundary: var(--wcl-accent-fill-boundary-on-subtle)',
    );
    expect(fieldGroup).toContain('--wcl-accent-focus: var(--wcl-accent-focus-on-subtle)');
    expect(fieldGroup).toContain(
      '--wcl-accent-hover-contrast: var(--wcl-accent-hover-contrast-on-subtle)',
    );
    expect(fieldGroup).toContain('--wcl-accent-muted: var(--wcl-accent-muted-on-subtle)');
    expect(fieldGroup).toContain('--wcl-accent-rail: var(--wcl-accent-rail-on-subtle)');
    expect(fieldGroup).toContain('--wcl-accent-soft: var(--wcl-accent-soft-on-subtle)');

    const scrollRegion = styles.match(/\[data-wcl-scroll-region\]\s*\{([^}]*)\}/)?.[1];
    expect(scrollRegion).toContain(
      '--wcl-accent-fill-boundary: var(--wcl-accent-fill-boundary-on-subtle)',
    );
    expect(scrollRegion).toContain('--wcl-accent-focus: var(--wcl-accent-focus-on-subtle)');
    expect(scrollRegion).toContain(
      '--wcl-accent-hover-contrast: var(--wcl-accent-hover-contrast-on-subtle)',
    );
    expect(scrollRegion).toContain('--wcl-accent-muted: var(--wcl-accent-muted-on-subtle)');
    expect(scrollRegion).toContain('--wcl-accent-rail: var(--wcl-accent-rail-on-subtle)');
    expect(scrollRegion).toContain('--wcl-accent-soft: var(--wcl-accent-soft-on-subtle)');
  });

  it('fades the ScrollRegion thumb after idle while preserving native visibility conditions', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const scrollRegion = styles.match(/\[data-wcl-scroll-region\]\s*\{([^}]*)\}/)?.[1];
    const visibleScrollRegion = styles.match(
      /:is\(\[data-wcl-scroll-region\]\[data-scrollbar-active\], \[data-wcl-scroll-region\]:focus-within\)\s*\{([^}]*)\}/,
    )?.[1];
    const thumb = styles.match(
      /\[data-wcl-scroll-region\]::-(?:webkit-)?scrollbar-thumb\s*\{([^}]*)\}/,
    )?.[1];
    const visibleThumb = styles.match(
      /:is\(\s*\[data-wcl-scroll-region\]\[data-scrollbar-active\],\s*\[data-wcl-scroll-region\]:focus-within\s*\)::-webkit-scrollbar-thumb\s*\{([^}]*)\}/,
    )?.[1];
    const forcedColors = styles.match(/@media\s*\(forced-colors:\s*active\)([\s\S]*)/)?.[1];

    expect(scrollRegion).toContain('scrollbar-color: transparent transparent');
    expect(scrollRegion).toContain('transition: scrollbar-color');
    expect(visibleScrollRegion).toContain('scrollbar-color: var(--wcl-border-strong) transparent');
    expect(styles).toMatch(
      /:where\(\[data-wcl-scroll-region\]\s*>\s*\*\)\s*\{[^}]*scrollbar-color:\s*auto/,
    );
    expect(thumb).toContain('background-color: transparent');
    expect(thumb).toContain('transition: background-color');
    expect(visibleThumb).toContain('background-color: var(--wcl-border-strong)');
    expect(styles).toMatch(
      /@supports\s+not\s*\(scrollbar-color:\s*auto\)\s*\{[\s\S]*\[data-wcl-scroll-region\]::-webkit-scrollbar-thumb/,
    );
    expect(styles).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\[data-wcl-scroll-region\]\s*\{[^}]*transition:\s*none/,
    );
    expect(forcedColors).toMatch(
      /\[data-wcl-scroll-region\]\s*\{[^}]*scrollbar-color:\s*CanvasText Canvas/,
    );
    expect(forcedColors).toMatch(
      /\[data-wcl-scroll-region\]::-webkit-scrollbar-thumb\s*\{[^}]*background-color:\s*CanvasText/,
    );
  });

  it('keeps resting content neutral and uses accent roles for interaction structure', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const hover = styles.match(
      /:is\(\[data-wcl-button\], \[data-wcl-icon-button\], \[data-wcl-toggle-button\]\)\[data-hovered\]\s*\{([^}]*)\}/,
    )?.[1];
    const selected = styles.match(/\[data-wcl-toggle-button\]\[data-selected\]\s*\{([^}]*)\}/)?.[1];
    const link = styles.match(/\[data-wcl-link\]\s*\{([^}]*)\}/)?.[1];
    const linkHover = styles.match(/\[data-wcl-link\]\[data-hovered\]\s*\{([^}]*)\}/)?.[1];

    expect(hover).toContain('background: var(--wcl-accent-soft)');
    expect(hover).toContain('border-color: var(--wcl-accent-muted)');
    expect(hover).toContain('color: var(--wcl-accent-hover-contrast)');
    expect(selected).toContain('color: var(--wcl-text)');
    expect(link).toContain('color: var(--wcl-text)');
    expect(link).toContain('text-decoration-color: var(--wcl-accent-muted)');
    expect(linkHover).toContain('color: var(--wcl-accent-hover-contrast)');
    expect(styles).not.toContain('var(--wcl-accent-text)');
  });

  it('uses a rail-only toggle selection and a purposeful pending rail', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const selected = styles.match(/\[data-wcl-toggle-button\]\[data-selected\]\s*\{([^}]*)\}/)?.[1];
    const selectedRail = styles.match(
      /\[data-wcl-toggle-button\]\[data-selected\]::after\s*\{([^}]*)\}/,
    )?.[1];
    const selectedHover = styles.match(
      /\[data-wcl-toggle-button\]\[data-selected\]\[data-hovered\]\s*\{([^}]*)\}/,
    )?.[1];
    const selectedPressed = styles.match(
      /\[data-wcl-toggle-button\]\[data-selected\]\[data-pressed\]\s*\{([^}]*)\}/,
    )?.[1];
    const pending = styles.match(/\[data-wcl-button\]\[data-pending\]::after\s*\{([^}]*)\}/)?.[1];

    expect(selected).toContain('background: transparent');
    expect(selected).not.toContain('inset 0 -3px var(--wcl-accent-rail)');
    expect(selectedRail).toContain('inset-inline: 0');
    expect(selectedRail).toContain('inset-block-end: 0');
    expect(selectedRail).toContain('block-size: 3px');
    expect(selectedRail).toContain('border-radius: 3px 3px 0 0');
    expect(selectedRail).toContain('background: var(--wcl-accent-rail)');
    expect(selectedHover).toContain('background: var(--wcl-accent-soft)');
    expect(selectedHover).toContain('color: var(--wcl-accent-hover-contrast)');
    expect(selectedPressed).toContain('color: var(--wcl-accent-hover-contrast)');
    expect(selectedPressed).toContain('inset 0 2px 4px');
    expect(selectedPressed).not.toContain('inset 0 -3px var(--wcl-accent-rail)');
    expect(pending).toContain('var(--wcl-warning)');
    expect(pending).toContain('var(--wcl-warning-surface)');
    expect(pending).not.toContain('transparent');
    expect(pending).toContain('wcl-action-pending');
    expect(styles).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\[data-wcl-button\]\[data-pending\]::after[\s\S]*animation:\s*none/,
    );
  });

  it('uses toggle rail geometry for focused date segments', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const dateSegment = styles.match(/\[data-wcl-date-segment\]\s*\{([^}]*)\}/)?.[1];
    const focusedSegment = styles.match(
      /\[data-wcl-date-segment\]\[data-focused\]\s*\{([^}]*)\}/,
    )?.[1];
    const dateRail = styles.match(
      /\[data-wcl-date-segment\]\[data-focused\]::after\s*\{([^}]*)\}/,
    )?.[1];
    const toggleRail = styles.match(
      /\[data-wcl-toggle-button\]\[data-selected\]::after\s*\{([^}]*)\}/,
    )?.[1];

    expect(dateSegment).toContain('position: relative');
    expect(focusedSegment).not.toContain('box-shadow: inset');
    for (const declaration of [
      'inset-inline: 0',
      'inset-block-end: 0',
      'block-size: 3px',
      'border-radius: 3px 3px 0 0',
      'background: var(--wcl-accent-rail)',
    ]) {
      expect(dateRail).toContain(declaration);
      expect(toggleRail).toContain(declaration);
    }
    expect(styles).toMatch(
      /@media\s*\(forced-colors:\s*active\)[\s\S]*\[data-wcl-date-segment\]\[data-focused\]::after[\s\S]*background:\s*Highlight[\s\S]*forced-color-adjust:\s*none/,
    );
  });

  it('uses toggle rail geometry without replacing the today marker', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const singleSelection = styles.match(
      /\[data-wcl-calendar-cell\]\[data-selected\]:not\(\[data-wcl-range-calendar\] \*\)\s*\{([^}]*)\}/,
    )?.[1];
    const rangeEndpoint = styles.match(
      /\[data-wcl-range-calendar\]\s+\[data-wcl-calendar-cell\]:is\(\s*\[data-selection-start\],\s*\[data-selection-end\],[\s\S]*?\)\s*\{([^}]*)\}/,
    )?.[1];
    const calendarRail = styles.match(
      /\[data-wcl-calendar-cell\]\[data-selected\]:not\(\[data-wcl-range-calendar\] \*\)::before\s*,[\s\S]*?\{([^}]*)\}/,
    )?.[1];
    const toggleRail = styles.match(
      /\[data-wcl-toggle-button\]\[data-selected\]::after\s*\{([^}]*)\}/,
    )?.[1];

    expect(singleSelection).not.toContain('box-shadow: inset');
    expect(rangeEndpoint).not.toContain('box-shadow: inset');
    for (const declaration of [
      'inset-inline: 0',
      'inset-block-end: 0',
      'block-size: 3px',
      'border-radius: 3px 3px 0 0',
    ]) {
      expect(calendarRail).toContain(declaration);
      expect(toggleRail).toContain(declaration);
    }
    expect(calendarRail).toContain('background: var(--wcl-accent-rail-on-raised)');
    expect(styles).not.toMatch(/\[data-wcl-calendar-cell\]\[data-invalid\]\s*\{[^}]*box-shadow/);
    expect(styles).not.toMatch(
      /\[data-wcl-calendar-cell\]\[data-selected\]\[data-invalid\]::before\s*\{[^}]*background:\s*var\(--wcl-danger\)/,
    );
    expect(styles).toMatch(/\[data-wcl-calendar-cell\]\[data-today\]::after\s*\{/);
    expect(styles).toMatch(
      /@media\s*\(forced-colors:\s*active\)[\s\S]*\[data-wcl-calendar-cell\]\[data-selected\]:not\(\[data-wcl-range-calendar\] \*\)::before[\s\S]*background:\s*Highlight[\s\S]*forced-color-adjust:\s*none/,
    );
  });

  it('keeps calendar picker fields compact and hides duplicate range-month dates', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const pickerControl = styles.match(/\[data-wcl-date-picker-control\]\s*\{([^}]*)\}/)?.[1];
    const outsideMonth = styles.match(
      /\[data-wcl-range-calendar\]\s+\[data-wcl-calendar-cell\]\[data-outside-month\]\s*\{([^}]*)\}/,
    )?.[1];
    const outsideVisibleRange = styles.match(
      /\[data-wcl-calendar-cell\]\[data-outside-visible-range\]:not\(\[data-outside-month\]\)\s*\{([^}]*)\}/,
    )?.[1];
    const hierarchy = styles.match(/\[data-wcl-calendar-hierarchy\]\s*\{([^}]*)\}/)?.[1];

    expect(pickerControl).toContain('justify-self: start');
    expect(pickerControl).toContain('inline-size: fit-content');
    expect(pickerControl).toContain('max-inline-size: 100%');
    expect(hierarchy).toContain('block-size: 15.25rem');
    expect(hierarchy).toContain('grid-auto-rows: minmax(0, 1fr)');
    expect(outsideMonth).toContain('visibility: hidden');
    expect(outsideVisibleRange).toContain('visibility: hidden');
    expect(styles).not.toMatch(/\[data-wcl-calendar-cell\]\[data-outside-visible-range\]\s*\{/);
  });

  it('reveals range drag paging handles at the calendar edges', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const handles = styles.match(
      /\[data-wcl-calendar-sheet-range\]::before,[\s\S]*?\[data-wcl-calendar-sheet-range\]::after\s*\{([^}]*)\}/,
    )?.[1];

    expect(handles).toContain('inline-size: 1.25rem');
    expect(handles).toContain('opacity: 0');
    expect(styles).toMatch(
      /\[data-wcl-calendar-sheet-range\]\[data-edge='previous'\]::before,[\s\S]*?\[data-wcl-calendar-sheet-range\]\[data-edge='next'\]::after\s*\{[^}]*opacity:\s*1/,
    );
  });

  it('distinguishes drop activity, rejection, invalidity, and pending without color alone', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const dropTarget = styles.match(
      /\[data-wcl-drop-zone\]\[data-drop-target\]\s*\{([^}]*)\}/,
    )?.[1];
    const rejected = styles.match(/\[data-wcl-drop-zone\]\[data-rejected\]\s*\{([^}]*)\}/)?.[1];
    const invalid = styles.match(/\[data-wcl-drop-zone\]\[data-invalid\]\s*\{([^}]*)\}/)?.[1];
    const pending = styles.match(
      /\[data-wcl-drop-zone\]\[data-pending\]::after\s*\{([^}]*)\}/,
    )?.[1];
    const acceptedAnnouncement = styles.match(/\[data-wcl-file-announcement\]\s*\{([^}]*)\}/)?.[1];
    const rejectedAnnouncement = styles.match(
      /:is\(\[data-wcl-file-trigger\], \[data-wcl-drop-zone\]\)\[data-rejected\]\s+\[data-wcl-file-announcement\]\s*\{([^}]*)\}/,
    )?.[1];
    const dropContainer = styles.match(/\[data-wcl-drop-zone-container\]\s*\{([^}]*)\}/)?.[1];

    expect(dropTarget).toContain('border-style: solid');
    expect(rejected).toContain('inset 4px 0');
    expect(invalid).toContain('border-style: dotted');
    expect(pending).toContain('wcl-file-pending');
    expect(acceptedAnnouncement).toContain('var(--wcl-success)');
    expect(rejectedAnnouncement).toContain('var(--wcl-danger)');
    expect(dropContainer).toContain('inline-size: 100%');
    expect(styles).toMatch(
      /@media\s*\(forced-colors:\s*active\)[\s\S]*\[data-wcl-drop-zone\]\[data-drop-target\][\s\S]*Highlight/,
    );
  });

  it('uses an animated icon action in drop zones', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const dropZone = styles.match(/\[data-wcl-drop-zone\]\s*\{([^}]*)\}/)?.[1];
    const dropZoneHover = styles.match(
      /\[data-wcl-drop-zone\]\[data-hovered\]:where\(:not\(\[data-disabled\]\)\)\s*\{([^}]*)\}/,
    )?.[1];
    const disabledDropZone = styles.match(
      /\[data-wcl-drop-zone\]\[data-disabled\]\s*\{([^}]*)\}/,
    )?.[1];
    const iconAction = styles.match(/\[data-wcl-drop-zone-action\]\s*\{([^}]*)\}/)?.[1];
    const activeGlyph = styles.match(
      /\[data-wcl-drop-zone-action\]\[data-hovered\]:where\(:not\(\[data-disabled\]\)\)\s+\[data-wcl-file-glyph\]\s*\{([^}]*)\}/,
    )?.[1];
    const focusedGlyph = styles.match(
      /\[data-wcl-drop-zone-action\]\[data-focus-visible\]\s+\[data-wcl-file-glyph\]\s*\{([^}]*)\}/,
    )?.[1];

    expect(dropZone).toContain('grid-template-columns: auto minmax(0, 1fr)');
    expect(dropZoneHover).toContain('border-color: var(--wcl-accent-muted)');
    expect(disabledDropZone).toContain('cursor: not-allowed');
    expect(iconAction).toContain('inline-size: 2.75rem');
    expect(iconAction).toContain('block-size: 2.75rem');
    expect(iconAction).toContain('outline: 0');
    expect(activeGlyph).toContain('transform: translateY(-2px) rotate(-5deg)');
    expect(focusedGlyph).toContain('stroke-width: 2');
    expect(focusedGlyph).not.toContain('transform');
    expect(styles).not.toMatch(/\[data-wcl-drop-zone-action\]\[data-hovered\]\s*\{/);
    expect(styles).not.toMatch(
      /\[data-wcl-drop-zone-action\]\[data-focus-visible\]\s*\{[^}]*outline/,
    );
    expect(styles).not.toMatch(
      /\[data-wcl-drop-zone-action\]\[data-pressed\][^{]*\[data-wcl-file-glyph\][^{]*\{[^}]*transform/,
    );
    expect(styles).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\[data-wcl-drop-zone-action\][\s\S]*transition:\s*none[\s\S]*\[data-wcl-drop-zone-action\][\s\S]*\[data-wcl-file-glyph\][\s\S]*transform:\s*none/,
    );
    expect(styles).not.toContain('[data-wcl-drop-zone] [data-wcl-file-action]');
  });

  it('keeps segmented selection on one gliding rail above adjacent hover surfaces', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const track = styles.match(/\[data-wcl-segment-track\]\s*\{([^}]*)\}/)?.[1];
    const rail = styles.match(/\[data-wcl-segment-track\]::after\s*\{([^}]*)\}/)?.[1];
    const selected = styles.match(/\[data-wcl-segment\]\[data-selected\]\s*\{([^}]*)\}/)?.[1];

    expect(track).toContain('grid-template-columns: repeat(var(--wcl-segment-count)');
    expect(track).toContain('isolation: isolate');
    expect(rail).toContain('z-index: 3');
    expect(rail).toContain('inset-inline-start: calc(var(--wcl-segment-index)');
    expect(rail).toContain('inset-inline-start var(--wcl-motion-duration)');
    expect(selected).toContain('background: transparent');
    expect(selected).toContain('color: var(--wcl-text)');
    expect(styles).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\[data-wcl-segment-track\]::after[\s\S]*transition:\s*none/,
    );
  });

  it('outlines advanced collection rows and keeps filter controls compact', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const tableCellBoundary = styles.match(/\[data-wcl-table-cell\]::after \{([^}]*)\}/)?.[1];
    const tableHover = styles.match(
      /\[data-wcl-table-row\]:is\(\[data-hovered\], \[data-pressed\]\)\s+\[data-wcl-table-cell\]::after \{([^}]*)\}/,
    )?.[1];
    const tableHoverStart = styles.match(
      /\[data-wcl-table-row\]:is\(\[data-hovered\], \[data-pressed\]\)\s+\[data-wcl-table-cell\]:first-child::after \{([^}]*)\}/,
    )?.[1];
    const tableHoverEnd = styles.match(
      /\[data-wcl-table-row\]:is\(\[data-hovered\], \[data-pressed\]\)\s+\[data-wcl-table-cell\]:last-child::after \{([^}]*)\}/,
    )?.[1];
    const tableFocus = styles.match(
      /\[data-wcl-table-row\]\[data-focus-visible\]\s+\[data-wcl-table-cell\]::after \{([^}]*)\}/,
    )?.[1];
    const treeHover = styles.match(
      /\[data-wcl-tree-item\]:is\(\[data-hovered\], \[data-pressed\]\) \{([^}]*)\}/,
    )?.[1];
    const listBoxHover = styles.match(
      /\[data-wcl-collection-option\]:is\(\[data-hovered\], \[data-pressed\]\) \{([^}]*)\}/,
    )?.[1];
    const filterControls = styles.match(/\[data-wcl-collection-filter-controls\] \{([^}]*)\}/)?.[1];

    expect(tableCellBoundary).toContain('border-block: 1px solid transparent');
    expect(tableCellBoundary).toContain("content: ''");
    expect(tableHover).toContain('border-block-color: var(--wcl-accent-focus)');
    expect(tableHoverStart).toContain('border-inline-start: 1px solid var(--wcl-accent-focus)');
    expect(tableHoverEnd).toContain('border-inline-end: 1px solid var(--wcl-accent-focus)');
    expect(tableHover).not.toContain('background:');
    expect(tableHover).not.toContain('box-shadow:');
    expect(tableFocus).toContain('border-block-width: 2px');
    expect(treeHover).toContain('outline-color: var(--wcl-accent-focus)');
    expect(treeHover).not.toContain('background:');
    expect(listBoxHover).toContain('outline-color: var(--wcl-accent-focus)');
    expect(listBoxHover).not.toContain('background:');
    expect(styles).toMatch(
      /\[data-wcl-card-option\]:is\(\[data-hovered\], \[data-pressed\]\) \[data-wcl-card\] \{[^}]*border-color:\s*var\(--wcl-accent-muted\)/,
    );
    expect(styles).not.toMatch(
      /\[data-wcl-card-option\][^{]*\[data-selected\][^{]*\[data-wcl-card\] \{[^}]*border-color/,
    );
    expect(filterControls).toContain('--wcl-field-grid-rows: auto auto');
    expect(filterControls).toContain('--wcl-field-support-display: none');
  });

  it('does not decorate showcase specimens with an unexplained calibration tick', async () => {
    const styles = await readFile('showcase/styles.css', 'utf8');
    const stageRules = [...styles.matchAll(/\.showcase-specimen-stage\s*\{([^}]*)\}/g)];
    const stage = stageRules.at(-1)?.[1];

    expect(stage).toContain('background: var(--wcl-surface)');
    expect(stage).toContain('--wcl-accent-focus: var(--wcl-accent-focus-on-base)');
    expect(stage).toContain('--wcl-accent-rail: var(--wcl-accent-rail-on-base)');
    expect(stage).not.toContain('linear-gradient');
  });

  it('styles each native color swatch through an engine-valid selector', async () => {
    const styles = await readFile('showcase/styles.css', 'utf8');

    expect(styles).toMatch(/\.showcase-accent-input::-webkit-color-swatch\s*\{/);
    expect(styles).toMatch(/\.showcase-accent-input::-moz-color-swatch\s*\{/);
    expect(styles).not.toMatch(
      /\.showcase-accent-input::-webkit-color-swatch\s*,\s*\.showcase-accent-input::-moz-color-swatch/,
    );
  });

  it('owns group, toolbar, link, tooltip, and forced-color action treatments', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const primaryHover = styles.match(
      /\[data-variant='primary'\]\[data-hovered\]\s*\{([^}]*)\}/,
    )?.[1];
    const currentLink = styles.match(/\[data-wcl-link\]\[aria-current\]\s*\{([^}]*)\}/)?.[1];
    const forcedColors = styles.match(/@media\s*\(forced-colors:\s*active\)([\s\S]*)/)?.[1];
    const forcedPrimary = forcedColors?.match(
      /:is\(\[data-wcl-button\],\s*\[data-wcl-icon-button\]\)\[data-variant='primary'\]\s*\{([^}]*)\}/,
    )?.[1];

    expect(styles).toContain("[data-wcl-button-group][data-equal-items='true']");
    expect(styles).toContain("[data-wcl-toolbar][data-orientation='vertical']");
    expect(styles).toContain('[data-wcl-action-tooltip]');
    expect(styles).toContain('[data-wcl-link]');
    expect(styles).toMatch(
      /\[data-variant='primary'\][\s\S]*?background:\s*var\(--wcl-accent-fill\)/,
    );
    expect(primaryHover).toContain('background: var(--wcl-accent-fill)');
    expect(primaryHover).toContain('border-color: var(--wcl-accent-hover-edge)');
    expect(primaryHover).toContain('box-shadow: inset 0 0 0 1px var(--wcl-accent-hover-edge)');
    expect(primaryHover).not.toContain('color-mix');
    expect(currentLink).toContain('font-weight: 700');
    expect(currentLink).toContain('var(--wcl-accent-rail)');
    expect(forcedPrimary).toContain('border-color: Highlight');
    expect(forcedPrimary).toContain('background: ButtonFace');
    expect(forcedPrimary).toContain('color: ButtonText');
    expect(styles).toMatch(
      /@media\s*\(forced-colors:\s*active\)[\s\S]*\[data-wcl-toggle-button\]\[data-selected\]::after[\s\S]*background:\s*Highlight[\s\S]*forced-color-adjust:\s*none/,
    );
  });

  it('omits empty support tracks and allows forms to reserve stable support space', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const field = styles.match(/\[data-wcl-field\]\s*\{([^}]*)\}/)?.[1];
    const control = styles.match(/\[data-wcl-field-control\]\s*\{([^}]*)\}/)?.[1];
    const support = styles.match(/\n {2}\[data-wcl-field-support\]\s*\{([^}]*)\}/)?.[1];
    const textArea = styles.match(
      /\[data-wcl-text-area\]\s+\[data-wcl-field-control\]\s*\{([^}]*)\}/,
    )?.[1];

    expect(field).toContain('grid-template-rows: var(--wcl-field-grid-rows, auto auto)');
    expect(control).toContain('min-block-size: var(--wcl-field-control-size, 2.75rem)');
    expect(control).toContain('block-size: var(--wcl-field-control-size, 2.75rem)');
    expect(support).toContain('min-block-size: 0');
    expect(styles).toMatch(
      /\[data-wcl-field\]\[data-reserve-support\] > \[data-wcl-field-support\]\s*\{[^}]*min-block-size: 2.25rem/,
    );
    expect(styles).toMatch(
      /\[data-wcl-field\]:not\(\[data-reserve-support\]\) > \[data-wcl-field-support\]:empty\s*\{[^}]*display: none/,
    );
    expect(support).toContain('display: var(--wcl-field-support-display, grid)');
    expect(textArea).toContain('block-size: auto');
    expect(textArea).not.toContain('min-block-size: 7.5rem');
    expect(styles).not.toMatch(
      /\[data-wcl-text-area\]\s+\[data-wcl-field-input\]\s*\{[^}]*min-block-size:\s*7\.5rem/,
    );
    expect(styles).toMatch(
      /\[data-wcl-field\]\[data-invalid\]\s+\[data-wcl-field-control\][\s\S]*border-color:\s*var\(--wcl-danger\)/,
    );
    expect(styles).not.toMatch(
      /\[data-wcl-field[^\]]*\][^{]*\{[^}]*transform:\s*(?:translate|scale)/,
    );
  });

  it('highlights the full field control boundary on hover', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const hover = styles.match(
      /:where\(\[data-wcl-field\]:not\(\[data-disabled\]\)\)\s+\[data-wcl-field-control\]:hover\s*\{([^}]*)\}/,
    )?.[1];

    expect(hover).toContain('border-color: var(--wcl-accent-muted)');
    expect(styles).not.toContain('[data-wcl-field-control]:has(:hover)');
    expect(styles).not.toMatch(/^\s*\[data-wcl-field-control\]:hover/m);
  });

  it('uses thin resting invalid boundaries that thicken on enabled hover', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const fieldControl = styles.match(/\[data-wcl-field-control\]\s*\{([^}]*)\}/)?.[1];
    const choiceControl = styles.match(/\[data-wcl-choice-control\]\s*\{([^}]*)\}/)?.[1];
    const invalidChoice = styles.match(
      /:is\(\[data-wcl-choice-group\], \[data-wcl-choice-field\]\)\[data-invalid\]\s+\[data-wcl-choice-control\]\s*\{([^}]*)\}/,
    )?.[1];
    const invalidChoiceHover = styles.match(
      /:is\(\[data-wcl-choice-group\], \[data-wcl-choice-field\]\)\[data-invalid\]:not\(\[data-disabled\]\)\s+\[data-wcl-choice-control\]\[data-hovered\]:not\(\[data-disabled\]\)\s*\{([^}]*)\}/,
    )?.[1];
    const invalidFieldHover = styles.match(
      /\[data-wcl-field\]\[data-invalid\]:not\(\[data-disabled\]\)\s+\[data-wcl-field-control\]:hover\s*\{([^}]*)\}/,
    )?.[1];
    const forcedInvalidFieldHover = styles.match(
      /@media\s*\(forced-colors:\s*active\)[\s\S]*?\[data-wcl-field\]\[data-invalid\]:not\(\[data-disabled\]\)\s+\[data-wcl-field-control\]:hover\s*\{([^}]*)\}/,
    )?.[1];

    expect(fieldControl).toContain(
      'outline-width var(--wcl-motion-duration) var(--wcl-motion-easing)',
    );
    expect(choiceControl).toContain(
      'outline-width var(--wcl-motion-duration) var(--wcl-motion-easing)',
    );
    expect(invalidChoice).toContain('outline-width: 1px');
    expect(invalidChoiceHover).toContain('outline-width: 2px');
    expect(invalidFieldHover).toContain('box-shadow: inset 0 0 0 1px var(--wcl-danger)');
    expect(forcedInvalidFieldHover).toContain('outline-width: 3px');
  });

  it('keeps invalid hover and date-segment emphasis in the danger family', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const invalidChoiceHover = styles.match(
      /:is\(\[data-wcl-choice-group\], \[data-wcl-choice-field\]\)\[data-invalid\]:not\(\[data-disabled\]\)\s+\[data-wcl-choice-control\]\[data-hovered\]:not\(\[data-disabled\]\)\s*\{([^}]*)\}/,
    )?.[1];
    const invalidDropZoneHover = styles.match(
      /\[data-wcl-drop-zone\]\[data-invalid\]\[data-hovered\]:where\(:not\(\[data-disabled\]\)\)\s*\{([^}]*)\}/,
    )?.[1];
    const invalidDateSegment = styles.match(
      /\[data-wcl-date-picker\]\[data-invalid\]\s+\[data-wcl-date-segment\]\[data-focused\]\s*\{([^}]*)\}/,
    )?.[1];
    const invalidDateSegmentRail = styles.match(
      /\[data-wcl-date-picker\]\[data-invalid\]\s+\[data-wcl-date-segment\]\[data-focused\]::after\s*\{([^}]*)\}/,
    )?.[1];
    const invalidDateSegmentFocus = styles.match(
      /\[data-wcl-date-picker\]\[data-invalid\]\s+\[data-wcl-date-segment\]\[data-focus-visible\]\s*\{([^}]*)\}/,
    )?.[1];

    expect(invalidChoiceHover).toContain('background: var(--wcl-danger-surface)');
    expect(invalidChoiceHover).toContain('color: var(--wcl-text)');
    expect(invalidDropZoneHover).toContain('var(--wcl-danger-surface)');
    expect(invalidDropZoneHover).not.toContain('var(--wcl-accent-soft)');
    expect(invalidDateSegment).toContain('background: var(--wcl-danger-surface)');
    expect(invalidDateSegmentRail).toContain('background: var(--wcl-danger)');
    expect(invalidDateSegmentFocus).toContain('outline-color: var(--wcl-danger)');
    expect(styles).not.toMatch(
      /\[data-wcl-calendar-cell\]\[data-hovered\][^{]*\{[^}]*var\(--wcl-danger(?:-surface)?\)/,
    );
    expect(styles).toMatch(
      /@media\s*\(forced-colors:\s*active\)[\s\S]*\[data-wcl-date-picker\]\[data-invalid\]\s+\[data-wcl-date-segment\]\[data-focused\]\s*\{[^}]*background:\s*Canvas/,
    );
    expect(styles).toMatch(
      /@media\s*\(forced-colors:\s*active\)[\s\S]*\[data-wcl-date-picker\]\[data-invalid\]\s+\[data-wcl-date-segment\]\[data-focused\]::after\s*\{[^}]*background:\s*Highlight/,
    );
    expect(styles).toMatch(
      /@media\s*\(forced-colors:\s*active\)[\s\S]*\[data-wcl-date-picker\]\[data-invalid\]\s+\[data-wcl-date-segment\]\[data-focus-visible\]\s*\{[^}]*outline-color:\s*Highlight/,
    );
  });

  it('keeps choice support stable and derives accents for subtle choice surfaces', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const support = styles.match(/\[data-wcl-choice-support\]\s*\{([^}]*)\}/)?.[1];
    const subtleChoices = styles.match(
      /:is\(\[data-wcl-choice-indicator\],\s*\[data-wcl-switch-track\],\s*\[data-wcl-segment-track\]\)\s*\{([^}]*)\}/,
    )?.[1];

    expect(support).toContain('min-block-size: 2.25rem');
    expect(styles).toMatch(
      /\[data-wcl-choice-support\]\[data-has-error\]\s+\[data-wcl-choice-description\]/,
    );
    expect(styles).toMatch(
      /\[data-wcl-choice-support\]:not\(\[data-has-error\]\)\s+\[data-wcl-choice-error\]/,
    );
    expect(subtleChoices).toContain('--wcl-accent-focus: var(--wcl-accent-focus-on-subtle)');
    expect(subtleChoices).toContain(
      '--wcl-accent-hover-contrast: var(--wcl-accent-hover-contrast-on-subtle)',
    );
    expect(subtleChoices).toContain('--wcl-accent-muted: var(--wcl-accent-muted-on-subtle)');
    expect(subtleChoices).toContain('--wcl-accent-rail: var(--wcl-accent-rail-on-subtle)');
    expect(subtleChoices).toContain('--wcl-accent-soft: var(--wcl-accent-soft-on-subtle)');
  });

  it('aligns every control in a mixed-detail choice group to the first line', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const choiceControl = styles.match(/\[data-wcl-choice-control\]\s*\{([^}]*)\}/)?.[1];
    const mixedDetailGroup = styles.match(
      /\[data-wcl-choice-group\]:has\(\[data-wcl-choice-option-description\]\)\s+\[data-wcl-choice-control\]\s*\{([^}]*)\}/,
    )?.[1];

    expect(choiceControl).toContain('align-items: center');
    expect(mixedDetailGroup).toContain('align-items: flex-start');
  });

  it('centers content within the Select trigger', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const selectTrigger = styles.match(/\[data-wcl-select-trigger\]\s*\{([^}]*)\}/)?.[1];

    expect(selectTrigger).toContain('align-items: center');
  });

  it('bounds collection overlays and rounds their inset option states', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const popover = styles.match(/\[data-wcl-selection-popover\]\s*\{([^}]*)\}/)?.[1];
    const list = styles.match(/\[data-wcl-selection-list\]\s*\{([^}]*)\}/)?.[1];
    const option = styles.match(/\[data-wcl-selection-option\]\s*\{([^}]*)\}/)?.[1];
    const selectedRail = styles.match(
      /\[data-wcl-selection-rail\]\[data-selected\]\s*\{([^}]*)\}/,
    )?.[1];
    const optionLabel = styles.match(/\[data-wcl-selection-option-label\]\s*\{([^}]*)\}/)?.[1];

    expect(popover).toContain('inline-size: var(--trigger-width)');
    expect(popover).toContain('max-inline-size: calc(100vw');
    expect(popover).toContain('max-block-size: min(20rem, var(--available-height))');
    expect(popover).toContain('background: var(--wcl-surface-raised)');
    expect(list).toContain('padding: calc(var(--wcl-space) * 0.5)');
    expect(option).toContain('padding-block: var(--wcl-option-padding, 6px)');
    expect(option).toContain('box-sizing: border-box');
    expect(option).toContain('min-block-size: var(--wcl-option-min-size, 2.75rem)');
    expect(option).toContain(
      'padding-inline: calc(var(--wcl-space) * 0.75) calc(var(--wcl-space) * 1.25)',
    );
    expect(option).toContain('border-radius: calc(var(--wcl-control-radius) * 0.5)');
    expect(option).not.toMatch(/\bpadding:/);
    expect(selectedRail).toContain('background: var(--wcl-accent-rail-on-raised)');
    expect(optionLabel).toContain('color: inherit');
    expect(optionLabel).not.toMatch(/accent/i);
    expect(styles).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\[data-wcl-selection-popover\][\s\S]*transition:\s*none/,
    );
    expect(styles).toMatch(
      /@media\s*\(forced-colors:\s*active\)[\s\S]*\[data-wcl-selection-rail\]\[data-selected\][\s\S]*background:\s*Highlight/,
    );
  });

  it('renders calibrated range rails with separable paired thumbs', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const field = styles.match(/\[data-wcl-range-field\]\s*\{([^}]*)\}/)?.[1];
    const track = styles.match(/\[data-wcl-range-track\]\s*\{([^}]*)\}/)?.[1];
    const fill = styles.match(/\[data-wcl-range-fill\]\s*\{([^}]*)\}/)?.[1];
    const thumb = styles.match(/\[data-wcl-range-thumb\]\s*\{([^}]*)\}/)?.[1];
    const interactiveThumb = styles.match(
      /:where\(\[data-wcl-range-field\]:not\(\[data-readonly\], \[data-disabled\]\)\)\s+\[data-wcl-range-thumb\]:is\(\[data-hovered\], \[data-dragging\]\)\s*\{([^}]*)\}/,
    )?.[1];
    const invalidThumb = styles.match(
      /\[data-wcl-range-field\]\[data-invalid\]\s+\[data-wcl-range-thumb\]\s*\{([^}]*)\}/,
    )?.[1];

    expect(field).toContain('min-inline-size: 0');
    expect(track).toContain('touch-action: none');
    expect(fill).toContain('background: var(--wcl-accent-rail)');
    expect(thumb).toContain('inline-size: 1.25rem');
    expect(thumb).toContain('block-size: 1.25rem');
    expect(interactiveThumb).toContain('scale: 1.08');
    expect(interactiveThumb).not.toContain('border-color');
    expect(invalidThumb).toContain('border-color: var(--wcl-danger)');
    expect(styles).toMatch(
      /\[data-wcl-range-field\]\[data-orientation='horizontal'\]\s+\[data-wcl-range-thumb\]\s*\{[^}]*top:\s*50%/,
    );
    expect(styles).toMatch(
      /\[data-wcl-range-field\]\[data-orientation='vertical'\]\s+\[data-wcl-range-thumb\]\s*\{[^}]*left:\s*50%/,
    );
    expect(styles).toMatch(
      /\[data-wcl-range-slider\]\s+\[data-wcl-range-thumb\]\[data-thumb='start'\][\s\S]*translate:\s*0 -0\.5rem/,
    );
    expect(styles).toMatch(
      /\[data-wcl-range-slider\]\s+\[data-wcl-range-thumb\]\[data-thumb='end'\][\s\S]*translate:\s*0 0\.5rem/,
    );
    expect(styles).toMatch(
      /\[data-wcl-range-field\]\[data-orientation='vertical'\][\s\S]*min-block-size:\s*12rem/,
    );
    expect(styles).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\[data-wcl-range-thumb\][\s\S]*transition:\s*none/,
    );
    expect(styles).toMatch(
      /@media\s*\(forced-colors:\s*active\)[\s\S]*\[data-wcl-range-fill\][\s\S]*background:\s*Highlight/,
    );
  });

  it('keeps native select entries readable in the active appearance', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const selectEntries = styles.match(
      /\[data-wcl-field-control\]\s*>\s*select\s+:is\(option, optgroup\)\s*\{([^}]*)\}/,
    )?.[1];

    expect(selectEntries).toContain('background-color: var(--wcl-surface-subtle)');
    expect(selectEntries).toContain('color: var(--wcl-text)');
  });

  it('owns field box sizing, readable guidance, and form-section rhythm', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const lightTheme = styles.match(/\[data-wcl-provider\]\s*\{([^}]*)\}/)?.[1];
    const placeholder = styles.match(
      /\[data-wcl-field-input\]::placeholder,[\s\S]*?\{([^}]*)\}/,
    )?.[1];
    const formSectionContent = styles.match(/\[data-wcl-form-section-content\]\s*\{([^}]*)\}/)?.[1];

    expect(lightTheme).toContain('--wcl-text-muted: #5f6c75');
    expect(placeholder).toContain('opacity: 1');
    expect(styles).toMatch(
      /:is\([^}]*\[data-wcl-field-control\][^}]*\)\s*\{[^}]*box-sizing:\s*border-box/,
    );
    expect(formSectionContent).toContain('display: grid');
    expect(formSectionContent).toContain('gap: calc(var(--wcl-space) * 2)');
  });

  it('separates number step end caps and insets the search clear action', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const actionGeometry = styles.match(
      /\[data-wcl-number-step\],[\s\S]*?\[data-wcl-search-clear\]\s*\{([^}]*)\}/,
    )?.[1];
    const searchClearGeometry = styles.match(
      /\[data-wcl-search-control\]\s+\[data-wcl-search-clear\]\s*\{([^}]*)\}/,
    )?.[1];
    const nestedActions = styles.match(
      /:is\(\[data-wcl-number-step\], \[data-wcl-search-clear\]\)\s*\{([^}]*)\}/,
    )?.[1];
    const decrement = styles.match(
      /\[data-wcl-number-step\]\[slot='decrement'\]\s*\{([^}]*)\}/,
    )?.[1];
    const increment = styles.match(
      /\[data-wcl-number-step\]\[slot='increment'\]\s*\{([^}]*)\}/,
    )?.[1];

    expect(actionGeometry).not.toContain('margin:');
    expect(actionGeometry).not.toContain('border-radius:');
    expect(decrement).toContain('border-inline-end: 1px solid var(--wcl-border)');
    expect(increment).toContain('border-inline-start: 1px solid var(--wcl-border)');
    expect(searchClearGeometry).toContain(
      'margin: calc(var(--wcl-space) * 0.625) calc(var(--wcl-space) * 0.25)',
    );
    expect(searchClearGeometry).toContain('inline-size: 2.25rem');
    expect(searchClearGeometry).toContain('border-radius: 999px');
    expect(nestedActions).toContain('--wcl-accent-focus: var(--wcl-accent-focus-on-subtle)');
    expect(nestedActions).toContain(
      '--wcl-accent-hover-contrast: var(--wcl-accent-hover-contrast-on-subtle)',
    );
    expect(nestedActions).toContain('--wcl-accent-muted: var(--wcl-accent-muted-on-subtle)');
    expect(nestedActions).toContain('--wcl-accent-soft: var(--wcl-accent-soft-on-subtle)');
  });

  it('uses bounded equal field columns and preserves semantic status colors', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const responsiveGroup = styles.match(
      /\[data-wcl-field-group\]\[data-columns='responsive'\]\s+\[data-wcl-field-group-content\]\s*\{([^}]*)\}/,
    )?.[1];
    const fieldError = styles.match(/\[data-wcl-field-error\]\s*\{([^}]*)\}/)?.[1];
    const pending = styles.match(/\[data-wcl-field-pending\]\s*\{([^}]*)\}/)?.[1];
    const forcedColors = styles.match(/@media\s*\(forced-colors:\s*active\)([\s\S]*)/)?.[1];

    expect(responsiveGroup).toContain(
      'grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr))',
    );
    expect(styles).toMatch(
      /\[data-wcl-field-group\]\[data-columns='responsive'\]\s+\[data-wcl-field-group-content\]\s*>\s*\[data-wcl-field\]\s*\{[^}]*grid-row:\s*span 3[^}]*grid-template-rows:\s*subgrid/,
    );
    expect(fieldError).toContain('color: var(--wcl-danger)');
    expect(pending).toContain('color: var(--wcl-warning)');
    expect(forcedColors).toMatch(
      /\[data-wcl-field-control\]\s*\{[^}]*border-color:\s*FieldText[^}]*background:\s*Field/,
    );
    expect(forcedColors).toMatch(
      /\[data-wcl-field\]\[data-invalid\]\s+\[data-wcl-field-control\]\s*\{[^}]*border-color:\s*CanvasText[^}]*border-style:\s*dashed/,
    );
    expect(forcedColors).toMatch(
      /\[data-wcl-field-error\]\s*\{[^}]*color:\s*CanvasText[^}]*text-decoration:\s*underline/,
    );
    expect(forcedColors).not.toMatch(
      /\[data-wcl-field(?:-error|[^\]]*\]\[data-invalid)[\s\S]*?\{[^}]*\bMark\b/,
    );
  });

  it('uses one library-owned search decoration across browser engines', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const searchInput = styles.match(
      /\[data-wcl-search-control\]\s+\[data-wcl-field-input\]\s*\{([^}]*)\}/,
    )?.[1];
    const nativeCancel = styles.match(
      /\[data-wcl-search-control\]\s+\[data-wcl-field-input\]::-webkit-search-cancel-button\s*\{([^}]*)\}/,
    )?.[1];

    expect(searchInput).toContain('appearance: auto !important');
    expect(nativeCancel).toContain('-webkit-appearance: none !important');
    expect(nativeCancel).toContain('appearance: none !important');
    expect(nativeCancel).toContain('display: none !important');
  });

  it('presents collapsed breadcrumb destinations in an anchored overlay', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const popover = styles.match(/\[data-wcl-breadcrumb-popover\]\s*\{([^}]*)\}/)?.[1];
    const overflowList = styles.match(/\[data-wcl-breadcrumb-overflow-list\]\s*\{([^}]*)\}/)?.[1];

    expect(popover).toContain('inline-size: max-content');
    expect(overflowList).toContain('display: grid');
    expect(overflowList).not.toContain('border-block-start');
    expect(styles).not.toMatch(/\[data-wcl-breadcrumb-overflow-list\]\[hidden\]/);
  });

  it('uses one filled navigation hover for breadcrumb links and overflow', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const breadcrumbLink = styles.match(/\[data-wcl-breadcrumb-link\]\s*\{([^}]*)\}/)?.[1];
    const sharedHover = styles.match(
      /:is\(\[data-wcl-breadcrumb-link\], \[data-wcl-breadcrumb-overflow-trigger\]\):is\([\s\S]*?\)\s*\{([^}]*)\}/,
    )?.[1];

    expect(sharedHover).toContain('background: var(--wcl-accent-soft)');
    expect(sharedHover).toContain('color: var(--wcl-accent-hover-contrast)');
    expect(breadcrumbLink).toContain('text-decoration: none');
    expect(sharedHover).not.toContain('text-decoration');
  });

  it('uses the established full-width selection rail for the current page', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const paginationRail = styles.match(
      /\[data-wcl-page-control\]\[data-current\]::after\s*\{([^}]*)\}/,
    )?.[1];

    expect(paginationRail).toContain('inset-inline: 0');
    expect(paginationRail).toContain('inset-block-end: 0');
    expect(paginationRail).toContain('block-size: 3px');
    expect(paginationRail).toContain('border-radius: 3px 3px 0 0');
    expect(paginationRail).toContain('background: var(--wcl-accent-rail)');
    expect(styles).not.toMatch(
      /\[data-wcl-page-control\]\[data-current\]\s*\{[^}]*border-block-end-width/,
    );
  });

  it('keeps disclosure row height independent of consumer box sizing', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const trigger = styles.match(/\[data-wcl-disclosure-trigger\]\s*\{([^}]*)\}/)?.[1];

    expect(trigger).toContain('box-sizing: border-box');
    expect(trigger).toContain('min-block-size: 2.75rem');
  });

  it('outlines disclosure and accordion rows without filling their hover surface', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const trigger = styles.match(/\[data-wcl-disclosure-trigger\]\s*\{([^}]*)\}/)?.[1];
    const hover = styles.match(
      /\[data-wcl-disclosure-trigger\]:is\(\[data-hovered\], \[data-pressed\]\)\s*\{([^}]*)\}/,
    )?.[1];
    const focus = styles.match(
      /\[data-wcl-disclosure-trigger\]\[data-focus-visible\]\s*\{([^}]*)\}/,
    )?.[1];

    expect(trigger).toContain('outline: 1px solid transparent');
    expect(hover).toContain('outline-color: var(--wcl-accent-focus)');
    expect(hover).not.toContain('background:');
    expect(hover).not.toMatch(/(?:^|[\s;])color:/);
    expect(focus).toContain('outline-width: 2px');
  });

  it('isolates disclosure row rhythm from consumer heading margins', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const heading = styles.match(/\[data-wcl-disclosure-heading\]\s*\{([^}]*)\}/)?.[1];

    expect(heading).toContain('margin: 0');
    expect(heading).not.toContain('!important');
  });

  it('removes collapsed disclosure panel padding without disabling find-in-page', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const hiddenPanel = styles.match(/\[data-wcl-disclosure-panel\]\[hidden\]\s*\{([^}]*)\}/)?.[1];

    expect(hiddenPanel).toContain('padding-block: 0');
    expect(hiddenPanel).not.toContain('display: none');
  });
});
