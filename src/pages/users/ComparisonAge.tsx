import { useCallback, useEffect, useRef, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Diverse color palette that works well in both light and dark modes
const COLORS = [
  'hsl(var(--primary))',      // Deep forest green
  'hsl(var(--accent))',       // Warm gold  
  '#3b82f6',                  // blue-500
  '#8b5cf6',                  // violet-500
  '#ef4444',                  // red-500
  '#f97316',                  // orange-500
  '#06b6d4',                  // cyan-500
  '#ec4899',                  // pink-500
  '#6366f1',                  // indigo-500
  '#84cc16'                   // lime-500
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

type Age = {
  age: string;
  subscribed_percentage: number;
  subscribed_count: number;
};

type ApiResponse = {
  age: number[];
  subscribed_percentage: string[];
  subscribed_count: string[];
};

export default function ComparisonAge() {
  const [metrics, setMetrics] = useState<Age[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const token = localStorage.getItem("golf_auth_token");


  const transformData = useCallback((data: ApiResponse): Age[] => {
    const { age, subscribed_percentage, subscribed_count } = data;
    const length = Math.min(age.length, subscribed_percentage.length, subscribed_count.length);
    
    return Array.from({ length }, (_, index) => ({
      age: String(age[index]),
      subscribed_percentage: parseFloat(subscribed_percentage[index]) || 0,
      subscribed_count: parseInt(subscribed_count[index]) || 0,
    }));
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/users/comparison_age', {
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
    .map((age) => ({
      name: age.age,
      value: age.subscribed_count,
      subscribed_percentage: age.subscribed_percentage,
      subscribed_count: age.subscribed_count,
    }));

  const totalAgeGroups = metrics.length;
  const totalUsers = metrics.reduce((sum, age) => sum + age.subscribed_count, 0);
  const avgRate = totalAgeGroups > 0
    ? (metrics.reduce((sum, c) => sum + c.subscribed_percentage, 0) / totalAgeGroups).toFixed(2)
    : "0.00";
  const maxRate = totalAgeGroups > 0
    ? Math.max(...metrics.map(c => c.subscribed_percentage)).toFixed(2)
    : "0.00";

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Age Group Subscription Comparison</h1>
        <p className="text-muted-foreground">Subscription rates across different age groups</p>
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
        {metrics.slice(0, 6).map((ageData, index) => (
          <div key={`${ageData.age}-${index}`} className="card-golf p-4">
            <div className="metric-label">{ageData.age}</div>
            <div className="metric-medium text-primary">{ageData.subscribed_percentage}%</div>
            <div className="text-sm text-muted-foreground">{ageData.subscribed_count} users</div>
          </div>
        ))}
      </div>

      {metrics.length > 0 && (
        <MetricCard
          title="Top 10 Age Groups by User Distribution"
          description="Total subscribed users per age"
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
                  `${value} subscribed users (${entry.payload.subscribed_percentage}% of age total)`,
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
              <div className="text-2xl font-bold text-primary">{totalAgeGroups}</div>
              <div className="text-sm text-muted-foreground">Total Age Groups</div>
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
