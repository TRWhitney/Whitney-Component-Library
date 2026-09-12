// react-markdown escapes HTML by default. No raw-HTML plugin or public renderer overrides.
export function safeUrl(url: string, key: string): string | undefined {
  const clean = url.trim();
  if (
    !clean ||
    [...clean].some((character) => character.charCodeAt(0) <= 32 || character.charCodeAt(0) === 127)
  )
    return undefined;
  const scheme = /^([a-z][a-z\d+.-]*):/i.exec(clean)?.[1]?.toLowerCase();
  if (scheme && scheme !== 'http' && scheme !== 'https' && !(key === 'href' && scheme === 'mailto'))
    return undefined;
  return clean;
}
