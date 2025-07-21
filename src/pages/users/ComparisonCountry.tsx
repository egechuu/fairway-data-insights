import { MetricCard } from "@/components/charts/MetricCard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'USA', subscribed: 45, unsubscribed: 55, total: 4250 },
  { name: 'Canada', subscribed: 52, unsubscribed: 48, total: 2180 },
  { name: 'UK', subscribed: 38, unsubscribed: 62, total: 1840 },
  { name: 'Australia', subscribed: 41, unsubscribed: 59, total: 1520 },
  { name: 'Germany', subscribed: 35, unsubscribed: 65, total: 980 },
  { name: 'Japan', subscribed: 48, unsubscribed: 52, total: 760 },
];

const COLORS = ['hsl(var(--golf-green))', 'hsl(var(--golf-gold))', 'hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--golf-sand))'];

export default function ComparisonCountry() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Country-wise Subscription Comparison</h1>
        <p className="text-muted-foreground">Subscription rates across different countries</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {data.map((country) => (
          <div key={country.name} className="card-golf p-4">
            <div className="metric-label">{country.name}</div>
            <div className="metric-medium text-primary">{country.subscribed}% subscribed</div>
            <div className="text-sm text-muted-foreground">{country.total} users</div>
          </div>
        ))}
      </div>

      <MetricCard
        title="User Distribution by Country"
        description="Total users per country with subscription percentages"
        className="min-h-[400px]"
      >
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, subscribed }) => `${name}\n${subscribed}% sub`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="total"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name, entry) => [
              `${value} users (${entry.payload.subscribed}% subscribed)`,
              entry.payload.name
            ]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </MetricCard>
    </div>
  );
}