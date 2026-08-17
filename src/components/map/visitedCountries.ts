export type VisitedCountry = {
  name: string;
  iso2: string;
  continent: string;
};

/** Countries visited, grouped by continent. */
export const VISITED_COUNTRIES: VisitedCountry[] = [
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
