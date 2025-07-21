import { MetricCard } from "@/components/charts/MetricCard";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', sessions: 45, avgDuration: 32 },
  { day: 'Tue', sessions: 52, avgDuration: 28 },
  { day: 'Wed', sessions: 38, avgDuration: 35 },
  { day: 'Thu', sessions: 61, avgDuration: 30 },
  { day: 'Fri', sessions: 73, avgDuration: 25 },
  { day: 'Sat', sessions: 89, avgDuration: 42 },
  { day: 'Sun', sessions: 95, avgDuration: 38 },
];

export default function DailySession() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Daily Session Analytics</h1>
        <p className="text-muted-foreground">Daily session count and average duration trends</p>
      </div>

      <MetricCard
        title="Daily Session Metrics"
        description="Session count (bars) and average duration (line)"
        className="min-h-[400px]"
      >
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
            <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Bar yAxisId="left" dataKey="sessions" fill="hsl(var(--primary))" radius={4} />
            <Line yAxisId="right" type="monotone" dataKey="avgDuration" stroke="hsl(var(--accent))" strokeWidth={3} />
          </ComposedChart>
        </ResponsiveContainer>
      </MetricCard>
    </div>
  );
}