import { useCallback, useEffect, useRef, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444', '#f97316', '#10b981', '#e11d48', '#6366f1', '#0ea5e9'];

const MetricCard = ({ title, description, className, children }) => (
  <div className={`bg-white border rounded-lg shadow-sm ${className}`}>
    <div className="p-6 pb-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
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
      1: 'United States',
      2: 'Canada', 
      3: 'United Kingdom',
      4: 'Australia',
      5: 'Germany',
      6: 'France',
      7: 'Japan',
      8: 'Brazil',
      9: 'India',
      10: 'China',
      11: 'Mexico',
      12: 'Spain',
      13: 'Italy',
      14: 'Netherlands',
      15: 'Sweden',
      16: 'Norway',
      17: 'Denmark',
      18: 'Finland',
      19: 'Belgium',
      20: 'Switzerland',
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
        <h1 className="text-2xl font-bold text-gray-900">Country-wise Subscription Comparison</h1>
        <p className="text-gray-600">Subscription rates across different countries</p>
      </div>

      {loading && (
        <div className="text-center text-gray-500">Loading...</div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600">
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
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Summary Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalCountries}</div>
              <div className="text-sm text-gray-600">Total Countries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalUsers}</div>
              <div className="text-sm text-gray-600">Total Subscribed Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{avgRate}%</div>
              <div className="text-sm text-gray-600">Average Subscription Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{maxRate}%</div>
              <div className="text-sm text-gray-600">Highest Subscription Rate</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
