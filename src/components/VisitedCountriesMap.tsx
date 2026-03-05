import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

const GEO_URL = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';

type VisitedCountry = { name: string; iso2: string; continent: string };

/** Countries visited, grouped by continent. */
const VISITED_COUNTRIES: VisitedCountry[] = [
  // Americas
  { name: 'Canada', iso2: 'CA', continent: 'Americas' },
  { name: 'United States of America', iso2: 'US', continent: 'Americas' },
  { name: 'Mexico', iso2: 'MX', continent: 'Americas' },
  { name: 'Cuba', iso2: 'CU', continent: 'Americas' },
  { name: 'Dominican Republic', iso2: 'DO', continent: 'Americas' },
  { name: 'Venezuela', iso2: 'VE', continent: 'Americas' },
  { name: 'Brazil', iso2: 'BR', continent: 'Americas' },
  { name: 'Argentina', iso2: 'AR', continent: 'Americas' },
  // Europe
  { name: 'Spain', iso2: 'ES', continent: 'Europe' },
  { name: 'Portugal', iso2: 'PT', continent: 'Europe' },
  { name: 'France', iso2: 'FR', continent: 'Europe' },
  { name: 'Belgium', iso2: 'BE', continent: 'Europe' },
  { name: 'Luxembourg', iso2: 'LU', continent: 'Europe' },
  { name: 'Great Britain', iso2: 'GB', continent: 'Europe' },
  { name: 'Germany', iso2: 'DE', continent: 'Europe' },
  { name: 'The Netherlands', iso2: 'NL', continent: 'Europe' },
  { name: 'Italy', iso2: 'IT', continent: 'Europe' },
  { name: 'San Marino', iso2: 'SM', continent: 'Europe' },
  { name: 'Vatican City', iso2: 'VA', continent: 'Europe' },
  { name: 'Monaco', iso2: 'MC', continent: 'Europe' },
  { name: 'Switzerland', iso2: 'CH', continent: 'Europe' },
  { name: 'Liechtenstein', iso2: 'LI', continent: 'Europe' },
  { name: 'Austria', iso2: 'AT', continent: 'Europe' },
  { name: 'Czech Republic', iso2: 'CZ', continent: 'Europe' },
  { name: 'Slovakia', iso2: 'SK', continent: 'Europe' },
  { name: 'Hungary', iso2: 'HU', continent: 'Europe' },
  { name: 'Croatia', iso2: 'HR', continent: 'Europe' },
  { name: 'Greece', iso2: 'GR', continent: 'Europe' },
  { name: 'Poland', iso2: 'PL', continent: 'Europe' },
  { name: 'Ukraine', iso2: 'UA', continent: 'Europe' },
  { name: 'Belarus', iso2: 'BY', continent: 'Europe' },
  { name: 'Lithuania', iso2: 'LT', continent: 'Europe' },
  { name: 'Latvia', iso2: 'LV', continent: 'Europe' },
  { name: 'Estonia', iso2: 'EE', continent: 'Europe' },
  { name: 'Norway', iso2: 'NO', continent: 'Europe' },
  { name: 'Sweden', iso2: 'SE', continent: 'Europe' },
  { name: 'Finland', iso2: 'FI', continent: 'Europe' },
  { name: 'Russia', iso2: 'RU', continent: 'Europe' },
  { name: 'Turkey', iso2: 'TR', continent: 'Europe' },
  // Africa
  { name: 'Egypt', iso2: 'EG', continent: 'Africa' },
  { name: 'Kenya', iso2: 'KE', continent: 'Africa' },
  { name: 'Botswana', iso2: 'BW', continent: 'Africa' },
  { name: 'Zambia', iso2: 'ZM', continent: 'Africa' },
  { name: 'South Africa', iso2: 'ZA', continent: 'Africa' },
  // Asia
  { name: 'United Arab Emirates', iso2: 'AE', continent: 'Asia' },
  { name: 'Maldives', iso2: 'MV', continent: 'Asia' },
  { name: 'Sri Lanka', iso2: 'LK', continent: 'Asia' },
  { name: 'China', iso2: 'CN', continent: 'Asia' },
  { name: 'Thailand', iso2: 'TH', continent: 'Asia' },
  { name: 'Singapore', iso2: 'SG', continent: 'Asia' },
  { name: 'Indonesia', iso2: 'ID', continent: 'Asia' },
  { name: 'Vietnam', iso2: 'VN', continent: 'Asia' },
  { name: 'Cambodia', iso2: 'KH', continent: 'Asia' },
  { name: 'Japan', iso2: 'JP', continent: 'Asia' },
  { name: 'South Korea', iso2: 'KR', continent: 'Asia' },
  { name: 'Malaysia', iso2: 'MY', continent: 'Asia' },
  { name: 'Philippines', iso2: 'PH', continent: 'Asia' },
  // Oceania
  { name: 'Australia', iso2: 'AU', continent: 'Oceania' },
  { name: 'New Zealand', iso2: 'NZ', continent: 'Oceania' },
  { name: 'Fiji', iso2: 'FJ', continent: 'Oceania' },
];

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

/** Convert ISO 3166-1 alpha-2 to flag emoji (e.g. "AU" → "🇦🇺") */
function isoToFlag(iso2: string): string {
  return [...iso2].map((char) => String.fromCodePoint(0x1f1e6 - 65 + char.charCodeAt(0))).join('');
}

type TooltipState = { name: string; iso2: string; isVisited: boolean; x: number; y: number } | null;

export function VisitedCountriesMap() {
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  return (
    <section className="visited-countries" aria-labelledby="visited-countries-heading">
      <h2 id="visited-countries-heading" className="text-xl font-semibold mb-4">
        Countries I've Visited <span className="text-muted-foreground font-normal">({VISITED_COUNTRIES.length})</span>
      </h2>

      <div className="visited-countries__map relative mb-8 rounded-lg overflow-hidden border border-border bg-muted/30">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 120,
            center: [20, 20],
          }}
        >
          <ZoomableGroup center={[0, 20]} zoom={1}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const iso2 = String(geo.properties?.['ISO3166-1-Alpha-2'] ?? geo.properties?.ISO_A2 ?? geo.id ?? '');
                  const isVisited = visitedSet.has(iso2);
                  const displayName = visitedByName[iso2]?.name ?? (geo.properties?.name as string) ?? iso2;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isVisited ? 'var(--color-primary)' : 'var(--color-muted)'}
                      stroke="var(--color-border)"
                      strokeWidth={0.5}
                      style={{
                        default: {
                          outline: 'none',
                          cursor: 'pointer',
                          fill: isVisited
                            ? 'color-mix(in oklch, var(--color-primary) 80%, white)'
                            : 'var(--color-muted)',
                        },
                        hover: {
                          outline: 'none',
                          cursor: 'pointer',
                          fill: isVisited
                            ? 'var(--color-primary)'
                            : 'color-mix(in oklch, var(--color-muted) 80%, var(--color-foreground))',
                        },
                        pressed: {
                          outline: 'none',
                          cursor: 'pointer',
                          fill: isVisited
                            ? 'color-mix(in oklch, var(--color-primary) 80%, white)'
                            : 'color-mix(in oklch, var(--color-muted) 60%, var(--color-foreground))',
                        },
                      }}
                      onMouseEnter={(evt: React.MouseEvent) => {
                        setTooltip({ name: displayName, iso2, isVisited, x: evt.clientX, y: evt.clientY });
                      }}
                      onMouseMove={(evt: React.MouseEvent) => {
                        setTooltip((prev) => (prev ? { ...prev, x: evt.clientX, y: evt.clientY } : null));
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {tooltip && (
          <div
            className="pointer-events-none fixed z-50 px-3 py-2 text-sm rounded-md bg-popover text-popover-foreground
              border border-border shadow-md"
            style={{
              left: tooltip.x + 12,
              top: tooltip.y + 12,
            }}
          >
            <span className="mr-1.5 text-base" role="img" aria-label={`Flag of ${tooltip.name}`}>
              {isoToFlag(tooltip.iso2)}
            </span>
            <span className="font-medium">{tooltip.name}</span>
            <span className="text-muted-foreground"> — {tooltip.isVisited ? 'visited' : 'not visited'}</span>
          </div>
        )}
      </div>

      <div className="visited-countries__list space-y-6">
        {COUNTRIES_BY_CONTINENT.map(([continent, countries]) => (
          <div key={continent}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">{continent}</h3>
            <ul className="flex flex-wrap gap-2 text-sm list-none" aria-label={`Countries visited in ${continent}`}>
              {countries.map((country) => (
                <li key={country.iso2}>
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted">
                    <span className="text-base" role="img" aria-label={`Flag of ${country.name}`}>
                      {isoToFlag(country.iso2)}
                    </span>
                    <span>{country.name}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
