import { MetricCard } from "@/components/charts/MetricCard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Returned Users', value: 72, percentage: '72%' },
  { name: 'Dropped Off', value: 28, percentage: '28%' },
];

const COLORS = ['hsl(var(--golf-green))', 'hsl(var(--destructive))'];

export default function DropOffRateAll() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">User Drop-off Rate (All Users)</h1>
        <p className="text-muted-foreground">Percentage of users who dropped off after their first session</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card-golf p-4">
          <div className="metric-label">Total Users</div>
          <div className="metric-large">12,485</div>
        </div>
        <div className="card-golf p-4">
          <div className="metric-label">Returned</div>
          <div className="metric-medium text-golf-green">8,989 (72%)</div>
        </div>
        <div className="card-golf p-4">
          <div className="metric-label">Dropped Off</div>
          <div className="metric-medium text-destructive">3,496 (28%)</div>
        </div>
      </div>

      <MetricCard
        title="User Retention After First Session"
        description="Distribution of users who return vs those who drop off"
        className="min-h-[400px]"
      >
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}\n${percentage}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </MetricCard>
    </div>
  );
}