import { MetricCard } from "@/components/charts/MetricCard";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { week: 'Week 1', successRate: 68, avgShots: 12.4 },
  { week: 'Week 2', successRate: 72, avgShots: 13.1 },
  { week: 'Week 3', successRate: 69, avgShots: 11.8 },
  { week: 'Week 4', successRate: 75, avgShots: 14.2 },
  { week: 'Week 5', successRate: 78, avgShots: 15.6 },
  { week: 'Week 6', successRate: 81, avgShots: 16.3 },
  { week: 'Week 7', successRate: 76, avgShots: 14.9 },
  { week: 'Week 8', successRate: 83, avgShots: 17.1 },
];

export default function PremiumUserPerformance() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Premium User Performance</h1>
        <p className="text-muted-foreground">Weekly tracking of premium users' shot accuracy and performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card-golf p-4">
          <div className="metric-label">Average Success Rate</div>
          <div className="metric-large text-primary">75.2%</div>
        </div>
        <div className="card-golf p-4">
          <div className="metric-label">Best Week</div>
          <div className="metric-medium text-accent">Week 8 (83%)</div>
        </div>
        <div className="card-golf p-4">
          <div className="metric-label">Improvement</div>
          <div className="metric-medium text-secondary">+15%</div>
        </div>
      </div>

      <MetricCard
        title="Weekly Premium User Performance"
        description="Success rate (bars) and average successful shots per user (line)"
        className="min-h-[400px]"
      >
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
            <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Bar yAxisId="left" dataKey="successRate" fill="hsl(var(--golf-gold))" radius={4} />
            <Line yAxisId="right" type="monotone" dataKey="avgShots" stroke="hsl(var(--primary))" strokeWidth={3} />
          </ComposedChart>
        </ResponsiveContainer>
      </MetricCard>
    </div>
  );
}