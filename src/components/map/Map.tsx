import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

import { iso2FromNaturalEarthName, isoToFlag } from './iso';
import { MapTooltip, type TooltipState } from './MapTooltip';
import { type CountryFeatureCollection, reassignCrimeaToUkraine } from './reassignCrimeaToUkraine';
import {
  countriesVisitedBy,
  type Country,
  DEFAULT_TRAVELER,
  groupCountriesByContinent,
  isTraveler,
  type Traveler,
  TRAVELER_LABELS,
  TRAVELERS,
} from './visitedCountries';

const GEO_URL = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';

export const VisitedCountriesMap: React.FC = () => {
  const [traveler, setTraveler] = useState<Traveler>(DEFAULT_TRAVELER);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [hoveredFromList, setHoveredFromList] = useState<string | null>(null);
  const [geography, setGeography] = useState<CountryFeatureCollection | null>(null);

  const visitedCountries = useMemo(() => countriesVisitedBy(traveler), [traveler]);
  const visitedSet = useMemo(() => new Set(visitedCountries.map((country) => country.iso2)), [visitedCountries]);
  const visitedByIso2 = useMemo(
    () => Object.fromEntries(visitedCountries.map((country) => [country.iso2, country])),
    [visitedCountries]
  );
  const countriesByContinent = useMemo(() => groupCountriesByContinent(visitedCountries), [visitedCountries]);

  const handleTravelerChange = useCallback((value: string) => {
    if (!isTraveler(value)) {
      return;
    }
    setTraveler(value);
    setHoveredFromList(null);
    setTooltip(null);
  }, []);

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
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Countries we have visited</h1>
        <TravelerRadioGroup value={traveler} onValueChange={handleTravelerChange} />
      </div>

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
                      visitedSet={visitedSet}
                      visitedByIso2={visitedByIso2}
                    />
                  ))
                }
              </Geographies>
            ) : null}
          </ZoomableGroup>
        </ComposableMap>
        {tooltip && <MapTooltip tooltip={tooltip} />}
      </div>

      {countriesByContinent.length === 0 ? (
        <p className="text-muted-foreground">No countries marked yet.</p>
      ) : (
        <div className="space-y-6">
          {countriesByContinent.map(([continent, countries]) => (
            <CountriesByContinent
              key={continent}
              continent={continent}
              countries={countries}
              setHoveredFromList={setHoveredFromList}
            />
          ))}
        </div>
      )}
    </>
  );
};

type TravelerRadioGroupProps = {
  value: Traveler;
  onValueChange: (value: string) => void;
};

const TravelerRadioGroup: React.FC<TravelerRadioGroupProps> = (props) => {
  const { value, onValueChange } = props;

  return (
    <RadioGroup value={value} onValueChange={onValueChange} aria-label="Whose visited countries to show">
      {TRAVELERS.map((person) => (
        <RadioGroupItem key={person} value={person}>
          {TRAVELER_LABELS[person]} ({countriesVisitedBy(person).length})
        </RadioGroupItem>
      ))}
    </RadioGroup>
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
  visitedSet: ReadonlySet<string>;
  visitedByIso2: Record<string, Country>;
  setTooltip: React.Dispatch<React.SetStateAction<TooltipState | null>>;
};

const GeographyItem: React.FC<GeographyItemProps> = (props) => {
  const { geo, hoveredFromList, visitedSet, visitedByIso2, setTooltip } = props;

  const iso2 = iso2FromGeography(geo);
  const isVisited = visitedSet.has(iso2);
  const nameFromList: string | undefined = isVisited ? visitedByIso2[iso2].name : undefined;
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
  countries: Country[];
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
          <CountryItem key={country.iso2} country={country} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />
        ))}
      </ul>
    </div>
  );
};

type CountryItemProps = {
  country: Country;
  onMouseEnter: (iso2: string) => void;
  onMouseLeave: () => void;
};

const CountryItem: React.FC<CountryItemProps> = (props) => {
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
