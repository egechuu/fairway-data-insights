import { MetricCard } from "@/components/charts/MetricCard";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { week: 'Week 1', sessions: 315, avgDuration: 31 },
  { week: 'Week 2', sessions: 428, avgDuration: 29 },
  { week: 'Week 3', sessions: 392, avgDuration: 33 },
  { week: 'Week 4', sessions: 476, avgDuration: 28 },
  { week: 'Week 5', sessions: 521, avgDuration: 35 },
  { week: 'Week 6', sessions: 445, avgDuration: 32 },
];

export default function WeeklySession() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Weekly Session Analytics</h1>
        <p className="text-muted-foreground">Weekly session count and average duration trends</p>
      </div>

      <MetricCard
        title="Weekly Session Metrics"
        description="Session count (bars) and average duration (line)"
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
            <Bar yAxisId="left" dataKey="sessions" fill="hsl(var(--secondary))" radius={4} />
            <Line yAxisId="right" type="monotone" dataKey="avgDuration" stroke="hsl(var(--accent))" strokeWidth={3} />
          </ComposedChart>
        </ResponsiveContainer>
      </MetricCard>
    </div>
  );
}