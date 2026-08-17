/**
 * Natural Earth draws de facto control, so Crimea is a polygon inside Russia's
 * MultiPolygon. ISO / UN treat Crimea as Ukraine; move it before rendering.
 * Bounds are the peninsula centroid (~34.5°E, 45.3°N), not a visited-list code.
 */
const CRIMEA_CENTROID = { minLon: 32, maxLon: 37, minLat: 44, maxLat: 46.5 };

const ISO2_RE = /^[A-Z]{2}$/;

/** Polygon ring / MultiPolygon nested coordinates from GeoJSON. */
type Position = number[];
type LinearRing = Position[];
type PolygonCoords = LinearRing[];
type MultiPolygonCoords = PolygonCoords[];

type CountryGeometry =
  | { type: 'Polygon'; coordinates: PolygonCoords }
  | { type: 'MultiPolygon'; coordinates: MultiPolygonCoords };

type CountryProperties = {
  name?: string;
  'ISO3166-1-Alpha-2'?: string;
  ISO_A2?: string;
} | null;

type CountryFeature = {
  type: 'Feature';
  properties: CountryProperties;
  geometry: CountryGeometry;
};

export type CountryFeatureCollection = {
  type: 'FeatureCollection';
  features: CountryFeature[];
};

export function reassignCrimeaToUkraine(collection: CountryFeatureCollection): CountryFeatureCollection {
  const russia = collection.features.find((feature) => iso2FromProperties(feature.properties) === 'RU');
  const ukraine = collection.features.find((feature) => iso2FromProperties(feature.properties) === 'UA');
  if (!russia || !ukraine) {
    return collection;
  }

  const russiaPolys = toMultiPolygon(russia.geometry);
  const crimea: PolygonCoords[] = [];
  const russiaRest: PolygonCoords[] = [];
  for (const polygon of russiaPolys) {
    if (isCrimeaPolygon(polygon)) {
      crimea.push(polygon);
    } else {
      russiaRest.push(polygon);
    }
  }
  if (crimea.length === 0) {
    return collection;
  }

  const ukrainePolys = [...toMultiPolygon(ukraine.geometry), ...crimea];

  return {
    ...collection,
    features: collection.features.map((feature) => {
      if (feature === russia) {
        return { ...feature, geometry: { type: 'MultiPolygon', coordinates: russiaRest } };
      }
      if (feature === ukraine) {
        return { ...feature, geometry: { type: 'MultiPolygon', coordinates: ukrainePolys } };
      }
      return feature;
    }),
  };
}

function iso2FromProperties(properties: CountryProperties): string {
  const raw = String(properties?.['ISO3166-1-Alpha-2'] ?? properties?.ISO_A2 ?? '');
  return ISO2_RE.test(raw) ? raw : '';
}

function toMultiPolygon(geometry: CountryGeometry): MultiPolygonCoords {
  return geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
}

function isCrimeaPolygon(polygon: PolygonCoords): boolean {
  const ring = polygon[0];
  if (ring.length === 0) {
    return false;
  }

  let lonSum = 0;
  let latSum = 0;
  for (const position of ring) {
    lonSum += position[0];
    latSum += position[1];
  }
  const lon = lonSum / ring.length;
  const lat = latSum / ring.length;

  return (
    lon >= CRIMEA_CENTROID.minLon &&
    lon <= CRIMEA_CENTROID.maxLon &&
    lat >= CRIMEA_CENTROID.minLat &&
    lat <= CRIMEA_CENTROID.maxLat
  );
}
