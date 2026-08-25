export const TRAVELERS = ['vadim', 'kotone', 'haru'] as const;
export type Traveler = (typeof TRAVELERS)[number];

export const DEFAULT_TRAVELER: Traveler = 'vadim';

export const TRAVELER_LABELS: Record<Traveler, string> = {
  vadim: 'Vadim',
  kotone: 'Kotone',
  haru: 'Haru',
};

export const CONTINENTS = ['Americas', 'Europe', 'Africa', 'Asia', 'Oceania'] as const;
export type Continent = (typeof CONTINENTS)[number];

export type Country = {
  name: string;
  iso2: string;
  continent: Continent;
  vadim: boolean;
  kotone: boolean;
  haru: boolean;
};

export function isTraveler(value: string): value is Traveler {
  return (TRAVELERS as readonly string[]).includes(value);
}

/** Sovereign states. Flip vadim / kotone / haru to mark a visit. */
export const COUNTRIES: Country[] = [
  // Americas
  { name: 'Antigua and Barbuda', iso2: 'AG', continent: 'Americas', vadim: false, kotone: false, haru: false },
  { name: 'Argentina', iso2: 'AR', continent: 'Americas', vadim: true, kotone: false, haru: false },
  { name: 'Bahamas', iso2: 'BS', continent: 'Americas', vadim: false, kotone: false, haru: false },
  { name: 'Barbados', iso2: 'BB', continent: 'Americas', vadim: false, kotone: false, haru: false },
  { name: 'Belize', iso2: 'BZ', continent: 'Americas', vadim: false, kotone: false, haru: false },
  { name: 'Bolivia', iso2: 'BO', continent: 'Americas', vadim: false, kotone: false, haru: false },
  { name: 'Brazil', iso2: 'BR', continent: 'Americas', vadim: true, kotone: false, haru: false },
  { name: 'Canada', iso2: 'CA', continent: 'Americas', vadim: true, kotone: false, haru: false },
  { name: 'Chile', iso2: 'CL', continent: 'Americas', vadim: false, kotone: false, haru: false },
  { name: 'Colombia', iso2: 'CO', continent: 'Americas', vadim: false, kotone: false, haru: false },
  { name: 'Costa Rica', iso2: 'CR', continent: 'Americas', vadim: false, kotone: false, haru: false },
  { name: 'Cuba', iso2: 'CU', continent: 'Americas', vadim: true, kotone: false, haru: false },
  { name: 'Dominica', iso2: 'DM', continent: 'Americas', vadim: false, kotone: false, haru: false },
  { name: 'Dominican Republic', iso2: 'DO', continent: 'Americas', vadim: true, kotone: true, haru: false },
  { name: 'Ecuador', iso2: 'EC', continent: 'Americas', vadim: false, kotone: false, haru: false },
  { name: 'El Salvador', iso2: 'SV', continent: 'Americas', vadim: false, kotone: false, haru: false },
  { name: 'Grenada', iso2: 'GD', continent: 'Americas', vadim: false, kotone: false, haru: false },
  { name: 'Guatemala', iso2: 'GT', continent: 'Americas', vadim: false, kotone: false, haru: false },
  { name: 'Guyana', iso2: 'GY', continent: 'Americas', vadim: false, kotone: false, haru: false },
  { name: 'Haiti', iso2: 'HT', continent: 'Americas', vadim: false, kotone: false, haru: false },
  { name: 'Honduras', iso2: 'HN', continent: 'Americas', vadim: false, kotone: false, haru: false },
  { name: 'Jamaica', iso2: 'JM', continent: 'Americas', vadim: false, kotone: false, haru: false },
  { name: 'Mexico', iso2: 'MX', continent: 'Americas', vadim: true, kotone: false, haru: false },
  { name: 'Nicaragua', iso2: 'NI', continent: 'Americas', vadim: false, kotone: false, haru: false },
  { name: 'Panama', iso2: 'PA', continent: 'Americas', vadim: false, kotone: false, haru: false },
  { name: 'Paraguay', iso2: 'PY', continent: 'Americas', vadim: false, kotone: false, haru: false },
  { name: 'Peru', iso2: 'PE', continent: 'Americas', vadim: false, kotone: false, haru: false },
  { name: 'Saint Kitts and Nevis', iso2: 'KN', continent: 'Americas', vadim: false, kotone: false, haru: false },
  { name: 'Saint Lucia', iso2: 'LC', continent: 'Americas', vadim: false, kotone: false, haru: false },
  {
    name: 'Saint Vincent and the Grenadines',
    iso2: 'VC',
    continent: 'Americas',
    vadim: false,
    kotone: false,
    haru: false,
  },
  { name: 'Suriname', iso2: 'SR', continent: 'Americas', vadim: false, kotone: false, haru: false },
  { name: 'Trinidad and Tobago', iso2: 'TT', continent: 'Americas', vadim: false, kotone: false, haru: false },
  { name: 'United States of America', iso2: 'US', continent: 'Americas', vadim: true, kotone: false, haru: false },
  { name: 'Uruguay', iso2: 'UY', continent: 'Americas', vadim: false, kotone: false, haru: false },
  { name: 'Venezuela', iso2: 'VE', continent: 'Americas', vadim: true, kotone: false, haru: false },
  // Europe
  { name: 'Albania', iso2: 'AL', continent: 'Europe', vadim: false, kotone: false, haru: false },
  { name: 'Andorra', iso2: 'AD', continent: 'Europe', vadim: false, kotone: false, haru: false },
  { name: 'Austria', iso2: 'AT', continent: 'Europe', vadim: true, kotone: true, haru: false },
  { name: 'Belarus', iso2: 'BY', continent: 'Europe', vadim: true, kotone: false, haru: false },
  { name: 'Belgium', iso2: 'BE', continent: 'Europe', vadim: true, kotone: true, haru: false },
  { name: 'Bosnia and Herzegovina', iso2: 'BA', continent: 'Europe', vadim: false, kotone: false, haru: false },
  { name: 'Bulgaria', iso2: 'BG', continent: 'Europe', vadim: false, kotone: false, haru: false },
  { name: 'Croatia', iso2: 'HR', continent: 'Europe', vadim: true, kotone: false, haru: false },
  { name: 'Cyprus', iso2: 'CY', continent: 'Europe', vadim: false, kotone: false, haru: false },
  { name: 'Czech Republic', iso2: 'CZ', continent: 'Europe', vadim: true, kotone: false, haru: false },
  { name: 'Denmark', iso2: 'DK', continent: 'Europe', vadim: false, kotone: false, haru: false },
  { name: 'Estonia', iso2: 'EE', continent: 'Europe', vadim: true, kotone: false, haru: false },
  { name: 'Finland', iso2: 'FI', continent: 'Europe', vadim: true, kotone: false, haru: false },
  { name: 'France', iso2: 'FR', continent: 'Europe', vadim: true, kotone: true, haru: false },
  { name: 'Germany', iso2: 'DE', continent: 'Europe', vadim: true, kotone: true, haru: false },
  { name: 'Great Britain', iso2: 'GB', continent: 'Europe', vadim: true, kotone: true, haru: false },
  { name: 'Greece', iso2: 'GR', continent: 'Europe', vadim: true, kotone: false, haru: false },
  { name: 'Hungary', iso2: 'HU', continent: 'Europe', vadim: true, kotone: false, haru: false },
  { name: 'Iceland', iso2: 'IS', continent: 'Europe', vadim: false, kotone: false, haru: false },
  { name: 'Ireland', iso2: 'IE', continent: 'Europe', vadim: false, kotone: false, haru: false },
  { name: 'Italy', iso2: 'IT', continent: 'Europe', vadim: true, kotone: true, haru: false },
  { name: 'Kosovo', iso2: 'XK', continent: 'Europe', vadim: false, kotone: false, haru: false },
  { name: 'Latvia', iso2: 'LV', continent: 'Europe', vadim: true, kotone: true, haru: false },
  { name: 'Liechtenstein', iso2: 'LI', continent: 'Europe', vadim: true, kotone: true, haru: false },
  { name: 'Lithuania', iso2: 'LT', continent: 'Europe', vadim: true, kotone: false, haru: false },
  { name: 'Luxembourg', iso2: 'LU', continent: 'Europe', vadim: true, kotone: true, haru: false },
  { name: 'Malta', iso2: 'MT', continent: 'Europe', vadim: false, kotone: false, haru: false },
  { name: 'Moldova', iso2: 'MD', continent: 'Europe', vadim: false, kotone: false, haru: false },
  { name: 'Monaco', iso2: 'MC', continent: 'Europe', vadim: true, kotone: false, haru: false },
  { name: 'Montenegro', iso2: 'ME', continent: 'Europe', vadim: false, kotone: false, haru: false },
  { name: 'North Macedonia', iso2: 'MK', continent: 'Europe', vadim: false, kotone: false, haru: false },
  { name: 'Norway', iso2: 'NO', continent: 'Europe', vadim: true, kotone: false, haru: false },
  { name: 'Poland', iso2: 'PL', continent: 'Europe', vadim: true, kotone: false, haru: false },
  { name: 'Portugal', iso2: 'PT', continent: 'Europe', vadim: true, kotone: false, haru: false },
  { name: 'Romania', iso2: 'RO', continent: 'Europe', vadim: false, kotone: false, haru: false },
  { name: 'Russia', iso2: 'RU', continent: 'Europe', vadim: true, kotone: false, haru: false },
  { name: 'San Marino', iso2: 'SM', continent: 'Europe', vadim: true, kotone: true, haru: false },
  { name: 'Serbia', iso2: 'RS', continent: 'Europe', vadim: false, kotone: false, haru: false },
  { name: 'Slovakia', iso2: 'SK', continent: 'Europe', vadim: true, kotone: false, haru: false },
  { name: 'Slovenia', iso2: 'SI', continent: 'Europe', vadim: false, kotone: false, haru: false },
  { name: 'Spain', iso2: 'ES', continent: 'Europe', vadim: true, kotone: false, haru: false },
  { name: 'Sweden', iso2: 'SE', continent: 'Europe', vadim: true, kotone: false, haru: false },
  { name: 'Switzerland', iso2: 'CH', continent: 'Europe', vadim: true, kotone: true, haru: false },
  { name: 'The Netherlands', iso2: 'NL', continent: 'Europe', vadim: true, kotone: false, haru: false },
  { name: 'Turkey', iso2: 'TR', continent: 'Europe', vadim: true, kotone: false, haru: false },
  { name: 'Ukraine', iso2: 'UA', continent: 'Europe', vadim: true, kotone: false, haru: false },
  { name: 'Vatican City', iso2: 'VA', continent: 'Europe', vadim: true, kotone: true, haru: false },
  // Africa
  { name: 'Algeria', iso2: 'DZ', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Angola', iso2: 'AO', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Benin', iso2: 'BJ', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Botswana', iso2: 'BW', continent: 'Africa', vadim: true, kotone: false, haru: false },
  { name: 'Burkina Faso', iso2: 'BF', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Burundi', iso2: 'BI', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Cabo Verde', iso2: 'CV', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Cameroon', iso2: 'CM', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Central African Republic', iso2: 'CF', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Chad', iso2: 'TD', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Comoros', iso2: 'KM', continent: 'Africa', vadim: false, kotone: false, haru: false },
  {
    name: 'Democratic Republic of the Congo',
    iso2: 'CD',
    continent: 'Africa',
    vadim: false,
    kotone: false,
    haru: false,
  },
  { name: 'Djibouti', iso2: 'DJ', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Egypt', iso2: 'EG', continent: 'Africa', vadim: true, kotone: false, haru: false },
  { name: 'Equatorial Guinea', iso2: 'GQ', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Eritrea', iso2: 'ER', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Eswatini', iso2: 'SZ', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Ethiopia', iso2: 'ET', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Gabon', iso2: 'GA', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Gambia', iso2: 'GM', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Ghana', iso2: 'GH', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Guinea', iso2: 'GN', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Guinea-Bissau', iso2: 'GW', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Ivory Coast', iso2: 'CI', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Kenya', iso2: 'KE', continent: 'Africa', vadim: true, kotone: false, haru: false },
  { name: 'Lesotho', iso2: 'LS', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Liberia', iso2: 'LR', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Libya', iso2: 'LY', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Madagascar', iso2: 'MG', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Malawi', iso2: 'MW', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Mali', iso2: 'ML', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Mauritania', iso2: 'MR', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Mauritius', iso2: 'MU', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Morocco', iso2: 'MA', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Mozambique', iso2: 'MZ', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Namibia', iso2: 'NA', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Niger', iso2: 'NE', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Nigeria', iso2: 'NG', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Republic of the Congo', iso2: 'CG', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Rwanda', iso2: 'RW', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'São Tomé and Príncipe', iso2: 'ST', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Senegal', iso2: 'SN', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Seychelles', iso2: 'SC', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Sierra Leone', iso2: 'SL', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Somalia', iso2: 'SO', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'South Africa', iso2: 'ZA', continent: 'Africa', vadim: true, kotone: false, haru: false },
  { name: 'South Sudan', iso2: 'SS', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Sudan', iso2: 'SD', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Tanzania', iso2: 'TZ', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Togo', iso2: 'TG', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Tunisia', iso2: 'TN', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Uganda', iso2: 'UG', continent: 'Africa', vadim: false, kotone: false, haru: false },
  { name: 'Zambia', iso2: 'ZM', continent: 'Africa', vadim: true, kotone: false, haru: false },
  { name: 'Zimbabwe', iso2: 'ZW', continent: 'Africa', vadim: false, kotone: false, haru: false },
  // Asia
  { name: 'Afghanistan', iso2: 'AF', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Armenia', iso2: 'AM', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Azerbaijan', iso2: 'AZ', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Bahrain', iso2: 'BH', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Bangladesh', iso2: 'BD', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Bhutan', iso2: 'BT', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Brunei', iso2: 'BN', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Cambodia', iso2: 'KH', continent: 'Asia', vadim: true, kotone: false, haru: false },
  { name: 'China', iso2: 'CN', continent: 'Asia', vadim: true, kotone: false, haru: false },
  { name: 'Georgia', iso2: 'GE', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'India', iso2: 'IN', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Indonesia', iso2: 'ID', continent: 'Asia', vadim: true, kotone: false, haru: false },
  { name: 'Iran', iso2: 'IR', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Iraq', iso2: 'IQ', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Israel', iso2: 'IL', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Japan', iso2: 'JP', continent: 'Asia', vadim: true, kotone: true, haru: true },
  { name: 'Jordan', iso2: 'JO', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Kazakhstan', iso2: 'KZ', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Kuwait', iso2: 'KW', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Kyrgyzstan', iso2: 'KG', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Laos', iso2: 'LA', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Lebanon', iso2: 'LB', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Malaysia', iso2: 'MY', continent: 'Asia', vadim: true, kotone: false, haru: false },
  { name: 'Maldives', iso2: 'MV', continent: 'Asia', vadim: true, kotone: false, haru: false },
  { name: 'Mongolia', iso2: 'MN', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Myanmar', iso2: 'MM', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Nepal', iso2: 'NP', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'North Korea', iso2: 'KP', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Oman', iso2: 'OM', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Pakistan', iso2: 'PK', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Palestine', iso2: 'PS', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Philippines', iso2: 'PH', continent: 'Asia', vadim: true, kotone: true, haru: false },
  { name: 'Qatar', iso2: 'QA', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Saudi Arabia', iso2: 'SA', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Singapore', iso2: 'SG', continent: 'Asia', vadim: true, kotone: true, haru: false },
  { name: 'South Korea', iso2: 'KR', continent: 'Asia', vadim: true, kotone: true, haru: false },
  { name: 'Sri Lanka', iso2: 'LK', continent: 'Asia', vadim: true, kotone: false, haru: false },
  { name: 'Syria', iso2: 'SY', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Taiwan', iso2: 'TW', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Tajikistan', iso2: 'TJ', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Thailand', iso2: 'TH', continent: 'Asia', vadim: true, kotone: false, haru: false },
  { name: 'Timor-Leste', iso2: 'TL', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Turkmenistan', iso2: 'TM', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'United Arab Emirates', iso2: 'AE', continent: 'Asia', vadim: true, kotone: true, haru: false },
  { name: 'Uzbekistan', iso2: 'UZ', continent: 'Asia', vadim: false, kotone: false, haru: false },
  { name: 'Vietnam', iso2: 'VN', continent: 'Asia', vadim: true, kotone: false, haru: false },
  { name: 'Yemen', iso2: 'YE', continent: 'Asia', vadim: false, kotone: false, haru: false },
  // Oceania
  { name: 'Australia', iso2: 'AU', continent: 'Oceania', vadim: true, kotone: true, haru: true },
  { name: 'Fiji', iso2: 'FJ', continent: 'Oceania', vadim: true, kotone: true, haru: false },
  { name: 'Kiribati', iso2: 'KI', continent: 'Oceania', vadim: false, kotone: false, haru: false },
  { name: 'Marshall Islands', iso2: 'MH', continent: 'Oceania', vadim: false, kotone: false, haru: false },
  { name: 'Micronesia', iso2: 'FM', continent: 'Oceania', vadim: false, kotone: false, haru: false },
  { name: 'Nauru', iso2: 'NR', continent: 'Oceania', vadim: false, kotone: false, haru: false },
  { name: 'New Zealand', iso2: 'NZ', continent: 'Oceania', vadim: true, kotone: true, haru: false },
  { name: 'Palau', iso2: 'PW', continent: 'Oceania', vadim: false, kotone: false, haru: false },
  { name: 'Papua New Guinea', iso2: 'PG', continent: 'Oceania', vadim: false, kotone: false, haru: false },
  { name: 'Samoa', iso2: 'WS', continent: 'Oceania', vadim: false, kotone: false, haru: false },
  { name: 'Solomon Islands', iso2: 'SB', continent: 'Oceania', vadim: false, kotone: false, haru: false },
  { name: 'Tonga', iso2: 'TO', continent: 'Oceania', vadim: false, kotone: false, haru: false },
  { name: 'Tuvalu', iso2: 'TV', continent: 'Oceania', vadim: false, kotone: false, haru: false },
  { name: 'Vanuatu', iso2: 'VU', continent: 'Oceania', vadim: false, kotone: false, haru: false },
];

export function countriesVisitedBy(traveler: Traveler): Country[] {
  return COUNTRIES.filter((country) => country[traveler]);
}

/** Group countries by continent, preserving continent order. */
export function groupCountriesByContinent(countries: readonly Country[]): [Continent, Country[]][] {
  const groups = new Map<Continent, Country[]>();
  for (const continent of CONTINENTS) {
    groups.set(continent, []);
  }
  for (const country of countries) {
    const group = groups.get(country.continent);
    if (group) {
      group.push(country);
    }
  }
  return [...groups.entries()].filter(([, list]) => list.length > 0);
}
