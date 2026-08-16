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
    expect(forcedColors?.[1]).toContain('--wcl-accent-fill-boundary: Highlight !important');
    expect(forcedColors?.[1]).toContain('--wcl-accent-hover-contrast: HighlightText !important');
    expect(forcedColors?.[1]).toContain('--wcl-accent-hover-edge: Highlight !important');
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
});
