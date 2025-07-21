import { MetricCard } from "@/components/charts/MetricCard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Retained Subscribers', value: 84, percentage: '84%' },
  { name: 'Dropped Off', value: 16, percentage: '16%' },
];

const COLORS = ['hsl(var(--golf-gold))', 'hsl(var(--destructive))'];

export default function DropOffRateSub() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Subscriber Drop-off Rate</h1>
        <p className="text-muted-foreground">Percentage of subscribed users who dropped off after their first session</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card-golf p-4">
          <div className="metric-label">Total Subscribers</div>
          <div className="metric-large">4,287</div>
        </div>
        <div className="card-golf p-4">
          <div className="metric-label">Retained</div>
          <div className="metric-medium text-golf-gold">3,601 (84%)</div>
        </div>
        <div className="card-golf p-4">
          <div className="metric-label">Dropped Off</div>
          <div className="metric-medium text-destructive">686 (16%)</div>
        </div>
      </div>

      <MetricCard
        title="Subscriber Retention After First Session"
        description="Distribution of subscribers who return vs those who drop off"
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