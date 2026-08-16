export type AccentColor = `#${string}`;

interface Rgb {
  readonly red: number;
  readonly green: number;
  readonly blue: number;
}

export interface AccentRoles {
  readonly accent: AccentColor;
  readonly contrast: string;
  readonly focus: string;
  readonly muted: string;
  readonly soft: string;
  readonly text: string;
}

const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const LIGHT_SURFACES = ['#e9edef', '#ffffff', '#edf1f3'].map(parseHexUnchecked);
const DARK_SURFACES = ['#11171b', '#182126', '#202b31', '#243138'].map(parseHexUnchecked);
const DARK_TEXT = parseHexUnchecked('#152027');
const LIGHT_TEXT = parseHexUnchecked('#f2f6f8');
const BLACK = parseHexUnchecked('#000000');
const WHITE = parseHexUnchecked('#ffffff');

export function deriveAccentRoles(accent: AccentColor, appearance: 'light' | 'dark'): AccentRoles {
  const parsedAccent = parseHexColor(accent);
  const surfaces = appearance === 'light' ? LIGHT_SURFACES : DARK_SURFACES;
  const themeText = appearance === 'light' ? DARK_TEXT : LIGHT_TEXT;
  const preferredContrast =
    contrastRatio(parsedAccent, DARK_TEXT) >= contrastRatio(parsedAccent, LIGHT_TEXT)
      ? DARK_TEXT
      : LIGHT_TEXT;
  const guaranteedContrast =
    contrastRatio(parsedAccent, BLACK) >= contrastRatio(parsedAccent, WHITE) ? BLACK : WHITE;
  const contrast =
    contrastRatio(parsedAccent, preferredContrast) >= 4.5 ? preferredContrast : guaranteedContrast;

  return {
    accent: accent.toLowerCase() as AccentColor,
    contrast: toHex(contrast),
    focus: toHex(ensureContrast(parsedAccent, surfaces, themeText, 3)),
    muted: toHex(mix(surfaces[1] ?? surfaces[0] ?? themeText, parsedAccent, 0.33)),
    soft: toHex(mix(surfaces[1] ?? surfaces[0] ?? themeText, parsedAccent, 0.13)),
    text: toHex(ensureContrast(parsedAccent, surfaces, themeText, 4.5)),
  };
}

function parseHexColor(color: AccentColor): Rgb {
  if (!HEX_COLOR.test(color)) {
    throw new TypeError(
      `AppearanceProvider accent must be a six-digit hexadecimal color; received "${color}".`,
    );
  }

  return parseHexUnchecked(color);
}

function parseHexUnchecked(color: string): Rgb {
  return {
    red: Number.parseInt(color.slice(1, 3), 16),
    green: Number.parseInt(color.slice(3, 5), 16),
    blue: Number.parseInt(color.slice(5, 7), 16),
  };
}

function contrastRatio(first: Rgb, second: Rgb): number {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second));
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));

  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(color: Rgb): number {
  const [red, green, blue] = [color.red, color.green, color.blue].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * (red ?? 0) + 0.7152 * (green ?? 0) + 0.0722 * (blue ?? 0);
}

function ensureContrast(
  color: Rgb,
  backgrounds: readonly Rgb[],
  targetColor: Rgb,
  targetRatio: number,
): Rgb {
  const passes = (candidate: Rgb) =>
    backgrounds.every((background) => contrastRatio(candidate, background) >= targetRatio);

  if (passes(color)) {
    return color;
  }

  let lower = 0;
  let upper = 1;

  for (let iteration = 0; iteration < 16; iteration += 1) {
    const amount = (lower + upper) / 2;
    const candidate = mix(color, targetColor, amount);

    if (passes(candidate)) {
      upper = amount;
    } else {
      lower = amount;
    }
  }

  const result = mix(color, targetColor, upper);
  return passes(result) ? result : targetColor;
}

function mix(from: Rgb, to: Rgb, amount: number): Rgb {
  const interpolate = (start: number, end: number) => Math.round(start + (end - start) * amount);

  return {
    red: interpolate(from.red, to.red),
    green: interpolate(from.green, to.green),
    blue: interpolate(from.blue, to.blue),
  };
}

function toHex(color: Rgb): string {
  const channel = (value: number) => value.toString(16).padStart(2, '0');
  return `#${channel(color.red)}${channel(color.green)}${channel(color.blue)}`;
}
