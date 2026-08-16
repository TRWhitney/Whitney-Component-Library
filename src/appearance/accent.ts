export type AccentColor = `#${string}`;

interface Rgb {
  readonly red: number;
  readonly green: number;
  readonly blue: number;
}

interface Oklch {
  readonly lightness: number;
  readonly chroma: number;
  readonly hue: number;
}

export type AccentSurface = 'base' | 'canvas' | 'raised' | 'subtle';

export interface SurfaceAccentRoles {
  readonly fillBoundary: string;
  readonly focus: string;
  readonly hoverContrast: string;
  readonly muted: string;
  readonly rail: string;
  readonly soft: string;
}

export interface AccentRoles {
  readonly accent: AccentColor;
  readonly contrast: string;
  readonly fill: string;
  readonly hoverEdge: string;
  readonly on: Readonly<Record<AccentSurface, SurfaceAccentRoles>>;
}

const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const APPEARANCE_SURFACES = {
  light: {
    base: parseHexUnchecked('#ffffff'),
    canvas: parseHexUnchecked('#e9edef'),
    raised: parseHexUnchecked('#ffffff'),
    subtle: parseHexUnchecked('#edf1f3'),
  },
  dark: {
    base: parseHexUnchecked('#182126'),
    canvas: parseHexUnchecked('#11171b'),
    raised: parseHexUnchecked('#202b31'),
    subtle: parseHexUnchecked('#243138'),
  },
} as const satisfies Record<'dark' | 'light', Record<AccentSurface, Rgb>>;
const BLACK = parseHexUnchecked('#000000');
const WHITE = parseHexUnchecked('#ffffff');
const STRUCTURAL_CONTRAST = 3;
const CONTENT_CONTRAST = 4.5;
const ACHROMATIC_THRESHOLD = 0.015;

export function deriveAccentRoles(accent: AccentColor, appearance: 'light' | 'dark'): AccentRoles {
  const sourceRgb = parseHexColor(accent);
  const source = rgbToOklch(sourceRgb);
  const normalizedAccent = accent.toLowerCase() as AccentColor;
  const surfaces = APPEARANCE_SURFACES[appearance];
  const surfaceDirection = appearance === 'light' ? 'darker' : 'lighter';
  const hoverEdgeDirection =
    contrastRatio(sourceRgb, BLACK) >= contrastRatio(sourceRgb, WHITE) ? 'darker' : 'lighter';

  return {
    accent: normalizedAccent,
    contrast: toHex(bestContentColor(sourceRgb)),
    fill: normalizedAccent,
    hoverEdge: toHex(
      oklchToRgb(vividContrast(source, [sourceRgb], STRUCTURAL_CONTRAST, hoverEdgeDirection)),
    ),
    on: {
      base: deriveSurfaceRoles(source, sourceRgb, surfaces.base, surfaceDirection),
      canvas: deriveSurfaceRoles(source, sourceRgb, surfaces.canvas, surfaceDirection),
      raised: deriveSurfaceRoles(source, sourceRgb, surfaces.raised, surfaceDirection),
      subtle: deriveSurfaceRoles(source, sourceRgb, surfaces.subtle, surfaceDirection),
    },
  };
}

function deriveSurfaceRoles(
  source: Oklch,
  sourceRgb: Rgb,
  componentSurface: Rgb,
  direction: 'darker' | 'lighter',
): SurfaceAccentRoles {
  const surface = rgbToOklch(componentSurface);
  const signal = vividContrast(source, [componentSurface], STRUCTURAL_CONTRAST, direction);
  const soft = gamutMap({
    lightness: surface.lightness + (source.lightness - surface.lightness) * 0.72,
    chroma: source.chroma * 0.88,
    hue: source.hue,
  });
  const softRgb = oklchToRgb(soft);
  const needsBoundary = contrastRatio(sourceRgb, componentSurface) < STRUCTURAL_CONTRAST;
  const boundary = needsBoundary
    ? vividContrast(source, [componentSurface, sourceRgb], STRUCTURAL_CONTRAST, direction)
    : undefined;

  return {
    fillBoundary: boundary ? toHex(oklchToRgb(boundary)) : 'transparent',
    focus: toHex(oklchToRgb(signal)),
    hoverContrast: toHex(bestContentColor(softRgb)),
    muted: toHex(oklchToRgb(signal)),
    rail:
      contrastRatio(sourceRgb, componentSurface) >= STRUCTURAL_CONTRAST
        ? toHex(sourceRgb)
        : toHex(oklchToRgb(signal)),
    soft: toHex(softRgb),
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
    red: Number.parseInt(color.slice(1, 3), 16) / 255,
    green: Number.parseInt(color.slice(3, 5), 16) / 255,
    blue: Number.parseInt(color.slice(5, 7), 16) / 255,
  };
}

function bestContentColor(background: Rgb): Rgb {
  const candidate =
    contrastRatio(background, BLACK) >= contrastRatio(background, WHITE) ? BLACK : WHITE;

  if (contrastRatio(background, candidate) < CONTENT_CONTRAST) {
    throw new Error('Black or white content must contrast with an sRGB background.');
  }

  return candidate;
}

function vividContrast(
  source: Oklch,
  backgrounds: readonly Rgb[],
  ratio: number,
  direction: 'darker' | 'lighter',
): Oklch {
  const sourceRgb = oklchToRgb(source);
  if (meetsSerializedContrast(sourceRgb, backgrounds, ratio)) {
    return source;
  }

  const base = findContrastTone(source, backgrounds, ratio, direction);
  if (source.chroma < ACHROMATIC_THRESHOLD) {
    return base;
  }

  const lightness = clamp(base.lightness + (direction === 'lighter' ? 0.06 : -0.06));
  for (let chroma = 0.4; chroma >= source.chroma; chroma -= 0.002) {
    const candidate = {lightness, chroma, hue: source.hue};
    const rgb = oklchToRgbRaw(candidate);
    if (isInGamut(rgb) && meetsSerializedContrast(rgb, backgrounds, ratio)) {
      return candidate;
    }
  }

  return {...base, lightness};
}

function findContrastTone(
  source: Oklch,
  backgrounds: readonly Rgb[],
  ratio: number,
  direction: 'darker' | 'lighter',
): Oklch {
  for (let offset = 0; offset <= 500; offset += 1) {
    const distance = offset / 500;
    const lightness =
      direction === 'lighter' ? source.lightness + distance : source.lightness - distance;
    if (lightness < 0 || lightness > 1) continue;

    const candidate = gamutMap({...source, lightness});
    const rgb = oklchToRgb(candidate);
    if (meetsSerializedContrast(rgb, backgrounds, ratio)) {
      return candidate;
    }
  }

  return {lightness: direction === 'lighter' ? 1 : 0, chroma: 0, hue: source.hue};
}

function meetsSerializedContrast(color: Rgb, backgrounds: readonly Rgb[], ratio: number): boolean {
  const serializedColor = parseHexUnchecked(toHex(color));
  return backgrounds.every((background) => contrastRatio(serializedColor, background) >= ratio);
}

function gamutMap(color: Oklch): Oklch {
  let chroma = Number.isFinite(color.chroma) ? color.chroma : 0;
  const hue = Number.isFinite(color.hue) ? color.hue : 0;

  for (let iteration = 0; iteration < 40; iteration += 1) {
    const candidate = {lightness: clamp(color.lightness), chroma, hue};
    if (isInGamut(oklchToRgbRaw(candidate))) return candidate;
    chroma *= 0.94;
  }

  return {lightness: clamp(color.lightness), chroma: 0, hue};
}

function rgbToOklch(rgb: Rgb): Oklch {
  const [red, green, blue] = [rgb.red, rgb.green, rgb.blue].map(decodeSrgb);
  const lRoot = Math.cbrt(
    0.4122214708 * (red ?? 0) + 0.5363325363 * (green ?? 0) + 0.0514459929 * (blue ?? 0),
  );
  const mRoot = Math.cbrt(
    0.2119034982 * (red ?? 0) + 0.6806995451 * (green ?? 0) + 0.1073969566 * (blue ?? 0),
  );
  const sRoot = Math.cbrt(
    0.0883024619 * (red ?? 0) + 0.2817188376 * (green ?? 0) + 0.6299787005 * (blue ?? 0),
  );
  const lightness = 0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot;
  const a = 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot;
  const b = 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot;

  return {lightness, chroma: Math.hypot(a, b), hue: Math.atan2(b, a)};
}

function oklchToRgb(color: Oklch): Rgb {
  const raw = oklchToRgbRaw(gamutMap(color));
  return {red: clamp(raw.red), green: clamp(raw.green), blue: clamp(raw.blue)};
}

function oklchToRgbRaw(color: Oklch): Rgb {
  const a = color.chroma * Math.cos(color.hue);
  const b = color.chroma * Math.sin(color.hue);
  const lRoot = color.lightness + 0.3963377774 * a + 0.2158037573 * b;
  const mRoot = color.lightness - 0.1055613458 * a - 0.0638541728 * b;
  const sRoot = color.lightness - 0.0894841775 * a - 1.291485548 * b;
  const l = lRoot ** 3;
  const m = mRoot ** 3;
  const s = sRoot ** 3;

  return {
    red: encodeSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    green: encodeSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    blue: encodeSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  };
}

function contrastRatio(first: Rgb, second: Rgb): number {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second));
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(color: Rgb): number {
  const red = decodeSrgb(color.red);
  const green = decodeSrgb(color.green);
  const blue = decodeSrgb(color.blue);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function decodeSrgb(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function encodeSrgb(channel: number): number {
  return channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055;
}

function isInGamut(color: Rgb): boolean {
  return [color.red, color.green, color.blue].every((channel) => channel >= 0 && channel <= 1);
}

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function toHex(color: Rgb): string {
  const channel = (value: number) =>
    Math.round(clamp(value) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${channel(color.red)}${channel(color.green)}${channel(color.blue)}`;
}
