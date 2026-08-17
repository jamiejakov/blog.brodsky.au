import React, { useCallback, useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

import { iso2FromNaturalEarthName, isoToFlag } from './iso';
import { MapTooltip, type TooltipState } from './MapTooltip';
import { type CountryFeatureCollection, reassignCrimeaToUkraine } from './reassignCrimeaToUkraine';
import { COUNTRIES_BY_CONTINENT, VISITED_COUNTRIES, type VisitedCountry } from './visitedCountries';

const GEO_URL = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';

export const VisitedCountriesMap: React.FC = () => {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
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
    <>
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
        {tooltip && <MapTooltip tooltip={tooltip} />}
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
    </>
  );
};

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

type GeographyItemProps = {
  geo: RsmGeography;
  hoveredFromList: string | null;
  setTooltip: React.Dispatch<React.SetStateAction<TooltipState | null>>;
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
