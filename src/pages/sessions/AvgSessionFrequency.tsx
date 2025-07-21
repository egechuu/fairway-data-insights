import { MetricCard } from "@/components/charts/MetricCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { subscription: 'Premium', frequency: 4.2 },
  { subscription: 'Basic', frequency: 2.8 },
  { subscription: 'Trial', frequency: 1.5 },
  { subscription: 'Free', frequency: 1.1 },
];

export default function AvgSessionFrequency() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Average Session Frequency</h1>
        <p className="text-muted-foreground">Comparing session frequency across subscription types</p>
      </div>

      <MetricCard
        title="Session Frequency by Subscription"
        description="Average sessions per week by subscription type"
        className="min-h-[400px]"
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            layout="horizontal"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
            <YAxis dataKey="subscription" type="category" stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Bar dataKey="frequency" fill="hsl(var(--primary))" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </MetricCard>
    </div>
  );
}