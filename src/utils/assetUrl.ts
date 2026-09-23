const BASE_URL = '/portfolio/';

export function assetUrl(path?: string): string | undefined {
  if (!path || /^(https?:|data:|blob:)/i.test(path)) return path;
  if (path.startsWith(BASE_URL)) return path;
  if (path.startsWith('/')) return `${BASE_URL}${path.slice(1)}`;
  return path;
}
