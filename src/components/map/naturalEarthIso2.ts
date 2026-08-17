/**
 * Natural Earth (the source of our GeoJSON) leaves ISO_A2 as "-99" for a few
 * real countries — most notably France and Norway — because their polygons
 * don't map 1:1 onto the ISO definition (metropolitan vs overseas territory).
 */
const NATURAL_EARTH_ISO2_BY_NAME: Record<string, string> = {
  France: 'FR',
  Norway: 'NO',
};

/** ISO alpha-2 for Natural Earth polygons that ship with ISO_A2 "-99". */
export function iso2FromNaturalEarthName(name: string | undefined): string | undefined {
  if (!name) {
    return undefined;
  }
  return NATURAL_EARTH_ISO2_BY_NAME[name];
}
