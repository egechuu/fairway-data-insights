import { MetricCard } from "@/components/charts/MetricCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', shots: 12450 },
  { month: 'Feb', shots: 15230 },
  { month: 'Mar', shots: 18940 },
  { month: 'Apr', shots: 21560 },
  { month: 'May', shots: 25180 },
  { month: 'Jun', shots: 28920 },
];

export default function TotalShots() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Total Shots Analytics</h1>
        <p className="text-muted-foreground">Monthly breakdown of total shots taken by users</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card-golf p-4">
          <div className="metric-label">Total Shots</div>
          <div className="metric-large">122,280</div>
        </div>
        <div className="card-golf p-4">
          <div className="metric-label">This Month</div>
          <div className="metric-medium text-secondary">28,920</div>
        </div>
        <div className="card-golf p-4">
          <div className="metric-label">Growth</div>
          <div className="metric-medium text-accent">+15.2%</div>
        </div>
      </div>

      <MetricCard
        title="Monthly Shot Count"
        description="Total shots taken by all users per month"
        className="min-h-[400px]"
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Bar dataKey="shots" fill="hsl(var(--golf-green))" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </MetricCard>
    </div>
  );
}