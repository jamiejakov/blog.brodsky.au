/**
 * Natural Earth (the source of our GeoJSON) leaves ISO_A2 as "-99" for a few
 * real countries — France, Norway, and Kosovo — because their polygons don't
 * map 1:1 onto the ISO definition (metropolitan vs overseas territory, or
 * disputed status). Taiwan is coded `CN-TW` rather than `TW`.
 */
const NATURAL_EARTH_ISO2_BY_NAME: Record<string, string> = {
  France: 'FR',
  Kosovo: 'XK',
  Norway: 'NO',
  Taiwan: 'TW',
};

const ISO2_RE = /^[A-Z]{2}$/;

/** ISO alpha-2 for Natural Earth polygons that ship with ISO_A2 "-99". */
export function iso2FromNaturalEarthName(name: string | undefined): string | undefined {
  if (!name) {
    return undefined;
  }
  return NATURAL_EARTH_ISO2_BY_NAME[name];
}

/** Convert ISO 3166-1 alpha-2 to flag emoji (e.g. "AU" → "🇦🇺") */
export function isoToFlag(iso2: string): string {
  if (!ISO2_RE.test(iso2)) {
    return '';
  }
  return [...iso2].map((char) => String.fromCodePoint(0x1f1e6 - 65 + char.charCodeAt(0))).join('');
}
