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
});
