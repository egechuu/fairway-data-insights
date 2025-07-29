import { useCallback, useEffect, useRef, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444', '#f97316', '#10b981', '#e11d48', '#6366f1', '#0ea5e9'];

const MetricCard = ({ title, description, className, children }) => (
  <div className={`card-golf ${className}`}>
    <div className="p-6 pb-2">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <div className="p-6 pt-0">
      {children}
    </div>
  </div>
);

type Country = {
  country: string;
  subscribed_percentage: number;
  subscribed_count: number;
};

type ApiResponse = {
  country: number[];
  subscribed_percentage: string[];
  subscribed_count: string[];
};

export default function ComparisonCountry() {
  const [metrics, setMetrics] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const token = localStorage.getItem("golf_auth_token");

  const getCountryName = (countryId: number): string => {
    const countryMap: { [key: number]: string } = {
      1: 'United States of America',
      2: 'Afghanistan',
      3: 'Albania',
      4: 'Algeria',
      5: 'American Samoa',
      6: 'Andorra',
      7: 'Angola',
      8: 'Anguilla',
      9: 'Antarctica',
      10: 'Antigua and Barbuda',
      11: 'Argentina',
      12: 'Armenia',
      13: 'Aruba',
      14: 'Australia',
      15: 'Austria',
      16: 'Azerbaijan',
      17: 'Bahamas',
      18: 'Bahrain',
      19: 'Bangladesh',
      20: 'Barbados',
      21: 'Belarus',
      22: 'Belgium',
      23: 'Belize',
      24: 'Benin',
      25: 'Bermuda',
      26: 'Bhutan',
      27: 'Bolivia (Plurinational State of)',
      28: 'Bonaire',
      29: 'Bosnia and Herzegovina',
      30: 'Botswana',
      31: 'Bouvet Island',
      32: 'Brazil',
      33: 'British Indian Ocean Territory',
      34: 'Brunei Darussalam',
      35: 'Bulgaria',
      36: 'Burkina Faso',
      37: 'Burundi',
      38: 'Cabo Verde',
      39: 'Cambodia',
      40: 'Cameroon',
      41: 'Canada',
      42: 'Cayman Islands',
      43: 'Central African Republic',
      44: 'Chad',
      45: 'Chile',
      46: 'China',
      47: 'Christmas Island',
      48: 'Cocos (Keeling) Islands',
      49: 'Colombia',
      50: 'Comoros',
      51: 'Congo (the Democratic Republic of the)',
      52: 'Congo',
      53: 'Cook Islands',
      54: 'Costa Rica',
      55: 'Croatia',
      56: 'Cuba',
      57: 'Curaçao',
      58: 'Cyprus',
      59: 'Czechia',
      60: 'Côte d\'Ivoire',
      61: 'Denmark',
      62: 'Djibouti',
      63: 'Dominica',
      64: 'Dominican Republic',
      65: 'Ecuador',
      66: 'Egypt',
      67: 'El Salvador',
      68: 'Equatorial Guinea',
      69: 'Eritrea',
      70: 'Estonia',
      71: 'Eswatini',
      72: 'Ethiopia',
      73: 'Falkland Islands [Malvinas]',
      74: 'Faroe Islands',
      75: 'Fiji',
      76: 'Finland',
      77: 'France',
      78: 'French Guiana',
      79: 'French Polynesia',
      80: 'French Southern Territories',
      81: 'Gabon',
      82: 'Gambia',
      83: 'Georgia',
      84: 'Germany',
      85: 'Ghana',
      86: 'Gibraltar',
      87: 'Greece',
      88: 'Greenland',
      89: 'Grenada',
      90: 'Guadeloupe',
      91: 'Guam',
      92: 'Guatemala',
      93: 'Guernsey',
      94: 'Guinea',
      95: 'Guinea-Bissau',
      96: 'Guyana',
      97: 'Haiti',
      98: 'Heard Island and McDonald Islands',
      99: 'Holy See',
      100: 'Honduras',
      101: 'Hong Kong',
      102: 'Hungary',
      103: 'Iceland',
      104: 'India',
      105: 'Indonesia',
      106: 'Iran (Islamic Republic of)',
      107: 'Iraq',
      108: 'Ireland',
      109: 'Isle of Man',
      110: 'Israel',
      111: 'Italy',
      112: 'Jamaica',
      113: 'Japan',
      114: 'Jersey',
      115: 'Jordan',
      116: 'Kazakhstan',
      117: 'Kenya',
      118: 'Kiribati',
      119: 'Korea (the Democratic People\'s Republic of)',
      120: 'Korea (the Republic of)',
      121: 'Kuwait',
      122: 'Kyrgyzstan',
      123: 'Lao People\'s Democratic Republic',
      124: 'Latvia',
      125: 'Lebanon',
      126: 'Lesotho',
      127: 'Liberia',
      128: 'Libya',
      129: 'Liechtenstein',
      130: 'Lithuania',
      131: 'Luxembourg',
      132: 'Macao',
      133: 'Madagascar',
      134: 'Malawi',
      135: 'Malaysia',
      136: 'Maldives',
      137: 'Mali',
      138: 'Malta',
      139: 'Marshall Islands',
      140: 'Martinique',
      141: 'Mauritania',
      142: 'Mauritius',
      143: 'Mayotte',
      144: 'Mexico',
      145: 'Micronesia (Federated States of)',
      146: 'Moldova (the Republic of)',
      147: 'Monaco',
      148: 'Mongolia',
      149: 'Montenegro',
      150: 'Montserrat',
      151: 'Morocco',
      152: 'Mozambique',
      153: 'Myanmar',
      154: 'Namibia',
      155: 'Nauru',
      156: 'Nepal',
      157: 'Netherlands',
      158: 'New Caledonia',
      159: 'New Zealand',
      160: 'Nicaragua',
      161: 'Niger',
      162: 'Nigeria',
      163: 'Niue',
      164: 'Norfolk Island',
      165: 'Northern Mariana Islands',
      166: 'Norway',
      167: 'Oman',
      168: 'Pakistan',
      169: 'Palau',
      170: 'Palestine',
      171: 'Panama',
      172: 'Papua New Guinea',
      173: 'Paraguay',
      174: 'Peru',
      175: 'Philippines',
      176: 'Pitcairn',
      177: 'Poland',
      178: 'Portugal',
      179: 'Puerto Rico',
      180: 'Qatar',
      181: 'Republic of North Macedonia',
      182: 'Romania',
      183: 'Russian Federation',
      184: 'Rwanda',
      185: 'Réunion',
      186: 'Saint Barthélemy',
      187: 'Saint Helena',
      188: 'Saint Kitts and Nevis',
      189: 'Saint Lucia',
      190: 'Saint Martin (French part)',
      191: 'Saint Pierre and Miquelon',
      192: 'Saint Vincent and the Grenadines',
      193: 'Samoa',
      194: 'San Marino',
      195: 'Sao Tome and Principe',
      196: 'Saudi Arabia',
      197: 'Senegal',
      198: 'Serbia',
      199: 'Seychelles',
      200: 'Sierra Leone',
      201: 'Singapore',
      202: 'Sint Maarten (Dutch part)',
      203: 'Slovakia',
      204: 'Slovenia',
      205: 'Solomon Islands',
      206: 'Somalia',
      207: 'South Africa',
      208: 'South Georgia and the South Sandwich Islands',
      209: 'South Sudan',
      210: 'Spain',
      211: 'Sri Lanka',
      212: 'Sudan',
      213: 'Suriname',
      214: 'Svalbard and Jan Mayen',
      215: 'Sweden',
      216: 'Switzerland',
      217: 'Syrian Arab Republic',
      218: 'Taiwan',
      219: 'Tajikistan',
      220: 'Tanzania',
      221: 'Thailand',
      222: 'Timor-Leste',
      223: 'Togo',
      224: 'Tokelau',
      225: 'Tonga',
      226: 'Trinidad and Tobago',
      227: 'Tunisia',
      228: 'Turkey',
      229: 'Turkmenistan',
      230: 'Turks and Caicos Islands',
      231: 'Tuvalu',
      232: 'Uganda',
      233: 'Ukraine',
      234: 'United Arab Emirates',
      235: 'United Kingdom of Great Britain and Northern Ireland',
      236: 'United States Minor Outlying Islands',
      237: 'Uruguay',
      238: 'Uzbekistan',
      239: 'Vanuatu',
      240: 'Venezuela (Bolivarian Republic of)',
      241: 'VietNam',
      242: 'Virgin Islands (British)',
      243: 'Virgin Islands (U.S.)',
      244: 'Wallis and Futuna',
      245: 'Western Sahara',
      246: 'Yemen',
      247: 'Zambia',
      248: 'Zimbabwe',
      249: 'Åland Islands',
    };
    return countryMap[countryId] || `Country ${countryId}`;
  };

  const transformData = useCallback((data: ApiResponse): Country[] => {
    const { country, subscribed_percentage, subscribed_count } = data;
    const length = Math.min(country.length, subscribed_percentage.length, subscribed_count.length);
    
    return Array.from({ length }, (_, index) => ({
      country: getCountryName(country[index]),
      subscribed_percentage: parseFloat(subscribed_percentage[index]) || 0,
      subscribed_count: parseInt(subscribed_count[index]) || 0,
    }));
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/users/comparison_country', {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const transformedData = transformData(data);
      setMetrics(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [token, transformData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const pieChartData = [...metrics]
    .sort((a, b) => b.subscribed_count - a.subscribed_count)
    .slice(0, 10)
    .map((country) => ({
      name: country.country,
      value: country.subscribed_count,
      subscribed_percentage: country.subscribed_percentage,
      subscribed_count: country.subscribed_count,
    }));

  const totalCountries = metrics.length;
  const totalUsers = metrics.reduce((sum, country) => sum + country.subscribed_count, 0);
  const avgRate = totalCountries > 0
    ? (metrics.reduce((sum, c) => sum + c.subscribed_percentage, 0) / totalCountries).toFixed(2)
    : "0.00";
  const maxRate = totalCountries > 0
    ? Math.max(...metrics.map(c => c.subscribed_percentage)).toFixed(2)
    : "0.00";

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Country-wise Subscription Comparison</h1>
        <p className="text-muted-foreground">Subscription rates across different countries</p>
      </div>

      {loading && (
        <div className="text-center text-muted-foreground">Loading...</div>
      )}

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded text-destructive">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {metrics.slice(0, 6).map((countryData, index) => (
          <div key={`${countryData.country}-${index}`} className="card-golf p-4">
            <div className="metric-label">{countryData.country}</div>
            <div className="metric-medium text-primary">{countryData.subscribed_percentage}%</div>
            <div className="text-sm text-muted-foreground">{countryData.subscribed_count} users</div>
          </div>
        ))}
      </div>

      {metrics.length > 0 && (
        <MetricCard
          title="Top 10 Countries by User Distribution"
          description="Total subscribed users per country"
          className="min-h-[500px]"
        >
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, subscribed_percentage, subscribed_count }) => 
                  `${name}: ${subscribed_count} (${subscribed_percentage}%)`
                }
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, entry) => [
                  `${value} subscribed users (${entry.payload.subscribed_percentage}% of country total)`,
                  entry.payload.name
                ]} 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </MetricCard>
      )}

      {metrics.length > 0 && (
        <div className="card-golf p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Summary Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalCountries}</div>
              <div className="text-sm text-muted-foreground">Total Countries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-golf-green">{totalUsers}</div>
              <div className="text-sm text-muted-foreground">Total Subscribed Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{avgRate}%</div>
              <div className="text-sm text-muted-foreground">Average Subscription Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{maxRate}%</div>
              <div className="text-sm text-muted-foreground">Highest Subscription Rate</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
