import { useCallback, useEffect, useRef, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Updated colors to work better with dark mode
const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--golf-green))', 
  'hsl(var(--accent))',
  'hsl(var(--secondary))',
  '#22c55e', // green-500
  '#3b82f6', // blue-500  
  '#8b5cf6', // violet-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#10b981'  // emerald-500
];

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

type Gender = {
  gender: string;
  subscribed_percentage: number;
  subscribed_count: number;
};

type ApiResponse = {
  gender : string[];
  subscribed_percentage: string[];
  subscribed_count: string[];
};

export default function ComparisonGender() {
  const [metrics, setMetrics] = useState<Gender[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const token = localStorage.getItem("golf_auth_token");

  const transformData = useCallback((data: ApiResponse): Gender[] => {
    const { gender, subscribed_percentage, subscribed_count } = data;
    const length = Math.min(gender.length, subscribed_percentage.length, subscribed_count.length);
    
    return Array.from({ length }, (_, index) => ({
      gender: String(gender[index]),
      subscribed_percentage: parseFloat(subscribed_percentage[index]) || 0,
      subscribed_count: parseInt(subscribed_count[index]) || 0,
    }));
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/users/comparison_gender', {
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
    .map((gender) => ({
      name: gender.gender,
      value: gender.subscribed_count,
      subscribed_percentage: gender.subscribed_percentage,
      subscribed_count: gender.subscribed_count,
    }));

  const totalGenderGroups = metrics.length;
  const totalUsers = metrics.reduce((sum, gender) => sum + gender.subscribed_count, 0);
  const avgRate = totalGenderGroups > 0
    ? (metrics.reduce((sum, c) => sum + c.subscribed_percentage, 0) / totalGenderGroups).toFixed(2)
    : "0.00";
  const maxRate = totalGenderGroups > 0
    ? Math.max(...metrics.map(c => c.subscribed_percentage)).toFixed(2)
    : "0.00";

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Gender-wise Subscription Comparison</h1>
        <p className="text-muted-foreground">Subscription rates by gender</p>
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
        {metrics.map((genderData, index)  => (
          <div key={`${genderData.gender}-${index}`} className="card-golf p-4">
            <div className="metric-label">{genderData.gender}</div>
            <div className="metric-medium text-primary">{genderData.subscribed_percentage}%</div>
            <div className="text-sm text-muted-foreground">{genderData.subscribed_count} users</div>
          </div>
        ))}
      </div>

      {metrics.length > 0 && (
        <MetricCard
          title="Gender Distribution"
          description="Total subscribed users per gender"
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
                  `${value} subscribed users (${entry.payload.subscribed_percentage}% of gender total)`,
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
