import React, { useCallback, useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

import { iso2FromNaturalEarthName } from './naturalEarthIso2';
import { type CountryFeatureCollection, reassignCrimeaToUkraine } from './reassignCrimeaToUkraine';
import { VISITED_COUNTRIES, type VisitedCountry } from './visitedCountries';

const GEO_URL = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';

/** Geography object from Geographies children (GeoJSON Feature + react-simple-maps rsmKey). */
type RsmGeography = {
  rsmKey: string;
  properties: {
    name?: string;
    'ISO3166-1-Alpha-2'?: string;
    ISO_A2?: string;
  } | null;
  id?: string | number;
  [key: string]: unknown;
};

type TooltipState = {
  name: string;
  iso2: string;
  isVisited: boolean;
  x: number;
  y: number;
} | null;

export const VisitedCountriesMap: React.FC = () => {
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const [hoveredFromList, setHoveredFromList] = useState<string | null>(null);
  const [geography, setGeography] = useState<CountryFeatureCollection | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(GEO_URL)
      .then((response) => response.json())
      .then((data: CountryFeatureCollection) => {
        if (!cancelled) {
          setGeography(reassignCrimeaToUkraine(data));
        }
      })
      .catch(() => {
        /* Map stays empty if GeoJSON fails to load. */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section aria-labelledby="visited-countries-heading">
      <h1 id="visited-countries-heading" className="text-xl font-semibold mb-4">
        Countries I've Visited <span className="text-muted-foreground font-normal">({VISITED_COUNTRIES.length})</span>
      </h1>

      <div className="relative mb-8 rounded-lg overflow-hidden border border-border bg-muted/30">
        <ComposableMap projection="geoMercator" projectionConfig={{ scale: 120, center: [20, 20] }}>
          <ZoomableGroup center={[0, 20]} zoom={1}>
            {geography ? (
              <Geographies geography={geography}>
                {({ geographies }: { geographies: RsmGeography[] }) =>
                  geographies.map((geo) => (
                    <GeographyItem
                      key={geo.rsmKey}
                      geo={geo}
                      setTooltip={setTooltip}
                      hoveredFromList={hoveredFromList}
                    />
                  ))
                }
              </Geographies>
            ) : null}
          </ZoomableGroup>
        </ComposableMap>

        {tooltip && (
          <div
            className="pointer-events-none fixed z-50 px-3 py-2 text-sm rounded-md bg-popover text-popover-foreground
              border border-border shadow-md"
            style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
          >
            <span className="mr-1.5 text-base" role="img" aria-label={`Flag of ${tooltip.name}`}>
              {isoToFlag(tooltip.iso2)}
            </span>
            <span className="font-medium">{tooltip.name}</span>
            <span className="text-muted-foreground"> — {tooltip.isVisited ? 'visited' : 'not visited'}</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {COUNTRIES_BY_CONTINENT.map(([continent, countries]) => (
          <CountriesByContinent
            key={continent}
            continent={continent}
            countries={countries}
            setHoveredFromList={setHoveredFromList}
          />
        ))}
      </div>
    </section>
  );
};

type GeographyItemProps = {
  geo: RsmGeography;
  hoveredFromList: string | null;
  setTooltip: React.Dispatch<React.SetStateAction<TooltipState>>;
};

const GeographyItem: React.FC<GeographyItemProps> = (props) => {
  const { geo, hoveredFromList, setTooltip } = props;

  const iso2 = iso2FromGeography(geo);
  const isVisited = visitedSet.has(iso2);
  const nameFromList: string | undefined = isVisited ? visitedByName[iso2].name : undefined;
  const nameFromGeo: string | undefined = geo.properties?.name;
  const displayName = nameFromList ?? nameFromGeo ?? 'Unknown';
  const isHighlightedFromList = iso2 === hoveredFromList;

  const onMouseEnter = useCallback(
    (evt: React.MouseEvent) => {
      setTooltip({ name: displayName, iso2, isVisited, x: evt.clientX, y: evt.clientY });
    },
    [setTooltip, displayName, iso2, isVisited]
  );

  const onMouseMove = useCallback(
    (evt: React.MouseEvent) => {
      setTooltip((prev) => (prev ? { ...prev, x: evt.clientX, y: evt.clientY } : null));
    },
    [setTooltip]
  );

  const onMouseLeave = useCallback(() => {
    setTooltip(null);
  }, [setTooltip]);

  return (
    <Geography
      key={geo.rsmKey}
      geography={geo}
      fill={isHighlightedFromList ? 'var(--color-primary)' : isVisited ? 'var(--color-primary)' : 'var(--color-muted)'}
      stroke="var(--color-border)"
      strokeWidth={0.5}
      style={{
        default: {
          outline: 'none',
          cursor: 'pointer',
          fill: isHighlightedFromList
            ? 'var(--color-primary)'
            : isVisited
              ? 'color-mix(in oklch, var(--color-primary) 80%, white)'
              : 'var(--color-muted)',
        },
        hover: {
          outline: 'none',
          cursor: 'pointer',
          fill: isHighlightedFromList
            ? 'var(--color-primary)'
            : isVisited
              ? 'var(--color-primary)'
              : 'color-mix(in oklch, var(--color-muted) 80%, var(--color-foreground))',
        },
        pressed: {
          outline: 'none',
          cursor: 'pointer',
          fill: isHighlightedFromList
            ? 'var(--color-primary)'
            : isVisited
              ? 'color-mix(in oklch, var(--color-primary) 80%, white)'
              : 'color-mix(in oklch, var(--color-muted) 60%, var(--color-foreground))',
        },
      }}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    />
  );
};

type CountriesByContinentProps = {
  continent: string;
  countries: VisitedCountry[];
  setHoveredFromList: (iso2: string | null) => void;
};

const CountriesByContinent: React.FC<CountriesByContinentProps> = (props) => {
  const { continent, countries, setHoveredFromList } = props;

  const onMouseEnter = useCallback(
    (iso2: string) => {
      setHoveredFromList(iso2);
    },
    [setHoveredFromList]
  );

  const onMouseLeave = useCallback(() => {
    setHoveredFromList(null);
  }, [setHoveredFromList]);

  return (
    <div key={continent}>
      <h3 className="text-sm font-semibold text-muted-foreground mb-2">{continent}</h3>
      <ul className="flex flex-wrap gap-2 text-sm list-none pl-0" aria-label={`Countries visited in ${continent}`}>
        {countries.map((country) => (
          <Country key={country.iso2} country={country} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />
        ))}
      </ul>
    </div>
  );
};

type CountryProps = {
  country: VisitedCountry;
  onMouseEnter: (iso2: string) => void;
  onMouseLeave: () => void;
};

const Country: React.FC<CountryProps> = (props) => {
  const { country, onMouseEnter, onMouseLeave } = props;

  const handleMouseEnter = useCallback(() => {
    onMouseEnter(country.iso2);
  }, [country.iso2, onMouseEnter]);

  return (
    <li
      key={country.iso2}
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted cursor-default hover:bg-primary/15
        hover:ring-1 hover:ring-primary/50 transition-colors"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className="text-base" role="img" aria-label={`Flag of ${country.name}`}>
        {isoToFlag(country.iso2)}
      </span>
      <span>{country.name}</span>
    </li>
  );
};

/** Group countries by continent, preserving order of first occurrence. */
const COUNTRIES_BY_CONTINENT = (() => {
  const groups = new Map<string, VisitedCountry[]>();
  for (const country of VISITED_COUNTRIES) {
    const existing = groups.get(country.continent) ?? [];
    existing.push(country);
    groups.set(country.continent, existing);
  }
  return Array.from(groups.entries());
})();

const visitedSet = new Set(VISITED_COUNTRIES.map((c) => c.iso2));
const visitedByName = Object.fromEntries(VISITED_COUNTRIES.map((c) => [c.iso2, c]));

const ISO2_RE = /^[A-Z]{2}$/;

function iso2FromGeography(geo: RsmGeography): string {
  return iso2FromProperties(geo.properties, geo.id);
}

function iso2FromProperties(properties: RsmGeography['properties'], id?: string | number): string {
  const raw = String(properties?.['ISO3166-1-Alpha-2'] ?? properties?.ISO_A2 ?? id ?? '');
  if (ISO2_RE.test(raw)) {
    return raw;
  }

  return iso2FromNaturalEarthName(properties?.name) ?? '';
}

/** Convert ISO 3166-1 alpha-2 to flag emoji (e.g. "AU" → "🇦🇺") */
function isoToFlag(iso2: string): string {
  if (!ISO2_RE.test(iso2)) {
    return '';
  }
  return [...iso2].map((char) => String.fromCodePoint(0x1f1e6 - 65 + char.charCodeAt(0))).join('');
}
