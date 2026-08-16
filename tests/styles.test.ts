import {readFile} from 'node:fs/promises';

import {describe, expect, it} from 'vitest';

describe('static appearance styles', () => {
  it('settles motion without removing state meaning when reduced motion is requested', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const reducedMotion = styles.match(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?--wcl-motion-duration:\s*0\.01ms/,
    );

    expect(reducedMotion).not.toBeNull();
  });

  it('maps identity and surface roles to system colors in forced-color mode', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const forcedColors = styles.match(/@media\s*\(forced-colors:\s*active\)([\s\S]*)/);

    expect(forcedColors?.[1]).toContain('--wcl-accent: Highlight !important');
    expect(forcedColors?.[1]).toContain('--wcl-accent-contrast: HighlightText !important');
    expect(forcedColors?.[1]).toContain('--wcl-surface: Canvas');
    expect(forcedColors?.[1]).toContain('--wcl-text: CanvasText');
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

  it('reflows section headers from available space rather than viewport width', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const sectionHeader = styles.match(/\[data-wcl-section-header\]\s*\{([^}]*)\}/)?.[1];

    expect(sectionHeader).toContain('display: flex');
    expect(sectionHeader).toContain('flex-wrap: wrap');
    expect(styles).not.toMatch(/@media\s*\(width[^)]*\)[\s\S]*\[data-wcl-section-header\]/);
  });
});
