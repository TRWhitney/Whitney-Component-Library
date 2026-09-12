// Accept only the stored comma-separated RGBA form, never a general CSS value.
const number = '(?:\\d+(?:\\.\\d*)?|\\.\\d+)';
const rgba = new RegExp(
  `^rgba\\([ \\t]*(${number})[ \\t]*,[ \\t]*(${number})[ \\t]*,[ \\t]*(${number})[ \\t]*,[ \\t]*(${number})[ \\t]*\\)$`,
);

export function validatedRgba(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const match = rgba.exec(value);
  if (!match) return null;
  const channels = match.slice(1).map(Number);
  if (
    channels.some(
      (channel, index) => !Number.isFinite(channel) || channel > (index === 3 ? 1 : 255),
    )
  )
    return null;
  return value;
}

export function parseColorContent(content: string): {color: string; value: string} | null {
  const match = /^(rgba\([^)]*\))[ \t]+(\S(?:.*\S)?)$/.exec(content);
  const color = validatedRgba(match?.[1]);
  return color && match ? {color, value: match[2]!} : null;
}
