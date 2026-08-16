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
    expect(forcedColors?.[1]).toContain('--wcl-accent-fill: Highlight !important');
    expect(forcedColors?.[1]).toContain('--wcl-accent-rail: Highlight !important');
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

  it('gives actions stable bounded sizing without overlap-producing transforms', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const actionRules = styles.match(
      /:is\(\[data-wcl-button\],\s*\[data-wcl-icon-button\],\s*\[data-wcl-toggle-button\]\)\s*\{([^}]*)\}/,
    )?.[1];

    expect(actionRules).toContain('min-block-size: 2.5rem');
    expect(actionRules).toContain('white-space: normal');
    expect(actionRules).toContain('overflow-wrap: anywhere');
    expect(styles).toContain("[data-size='compact']");
    expect(styles).not.toMatch(
      /:is\(\[data-wcl-button\][\s\S]*?:hover[\s\S]*?transform:\s*(?:translate|scale)/,
    );
  });

  it('uses a rail-only toggle selection and a purposeful pending rail', async () => {
    const styles = await readFile('src/styles.css', 'utf8');
    const selected = styles.match(/\[data-wcl-toggle-button\]\[data-selected\]\s*\{([^}]*)\}/)?.[1];
    const selectedPressed = styles.match(
      /\[data-wcl-toggle-button\]\[data-selected\]\[data-pressed\]\s*\{([^}]*)\}/,
    )?.[1];
    const pending = styles.match(/\[data-wcl-button\]\[data-pending\]::after\s*\{([^}]*)\}/)?.[1];

    expect(selected).toContain('background: transparent');
    expect(selected).toContain('inset 0 -3px var(--wcl-accent-rail)');
    expect(selectedPressed).toContain('inset 0 2px 4px');
    expect(selectedPressed).toContain('inset 0 -3px var(--wcl-accent-rail)');
    expect(pending).toContain('var(--wcl-warning)');
    expect(pending).toContain('var(--wcl-warning-surface)');
    expect(pending).not.toContain('transparent');
    expect(pending).toContain('wcl-action-pending');
    expect(styles).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\[data-wcl-button\]\[data-pending\]::after[\s\S]*animation:\s*none/,
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
});
