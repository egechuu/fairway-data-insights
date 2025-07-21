import { MetricCard } from "@/components/charts/MetricCard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: '18-25', subscribed: 35, unsubscribed: 65, total: 2180 },
  { name: '26-35', subscribed: 48, unsubscribed: 52, total: 3850 },
  { name: '36-45', subscribed: 52, unsubscribed: 48, total: 4120 },
  { name: '46-55', subscribed: 41, unsubscribed: 59, total: 1940 },
  { name: '56-65', subscribed: 38, unsubscribed: 62, total: 285 },
  { name: '65+', subscribed: 45, unsubscribed: 55, total: 110 },
];

const COLORS = ['hsl(var(--golf-green))', 'hsl(var(--primary))', 'hsl(var(--golf-gold))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--golf-sand))'];

export default function ComparisonAge() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Age Group Subscription Comparison</h1>
        <p className="text-muted-foreground">Subscription rates across different age groups</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {data.map((age) => (
          <div key={age.name} className="card-golf p-4">
            <div className="metric-label">Age {age.name}</div>
            <div className="metric-medium text-primary">{age.subscribed}% subscribed</div>
            <div className="text-sm text-muted-foreground">{age.total} users</div>
          </div>
        ))}
      </div>

      <MetricCard
        title="User Distribution by Age Group"
        description="Total users per age group with subscription percentages"
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