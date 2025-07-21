import { MetricCard } from "@/components/charts/MetricCard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Male', subscribed: 42, unsubscribed: 58, total: 7450 },
  { name: 'Female', subscribed: 38, unsubscribed: 62, total: 4280 },
  { name: 'Other', subscribed: 45, unsubscribed: 55, total: 755 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--golf-gold))', 'hsl(var(--accent))'];

export default function ComparisonGender() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Gender-wise Subscription Comparison</h1>
        <p className="text-muted-foreground">Subscription rates across different gender groups</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {data.map((gender) => (
          <div key={gender.name} className="card-golf p-4">
            <div className="metric-label">{gender.name}</div>
            <div className="metric-medium text-primary">{gender.subscribed}% subscribed</div>
            <div className="text-sm text-muted-foreground">{gender.total} users</div>
          </div>
        ))}
      </div>

      <MetricCard
        title="User Distribution by Gender"
        description="Total users per gender with subscription percentages"
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