import { MetricCard } from "@/components/charts/MetricCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const distanceData = [
  { club: 'Driver', distance: 285 },
  { club: '3-Wood', distance: 245 },
  { club: '5-Iron', distance: 175 },
  { club: '7-Iron', distance: 155 },
  { club: '9-Iron', distance: 125 },
  { club: 'Pitching Wedge', distance: 105 },
];

const speedData = [
  { club: 'Driver', speed: 165 },
  { club: '3-Wood', speed: 155 },
  { club: '5-Iron', speed: 125 },
  { club: '7-Iron', speed: 115 },
  { club: '9-Iron', speed: 95 },
  { club: 'Pitching Wedge', speed: 85 },
];

const spinData = [
  { club: 'Driver', spin: 2450 },
  { club: '3-Wood', spin: 3200 },
  { club: '5-Iron', spin: 4800 },
  { club: '7-Iron', spin: 6200 },
  { club: '9-Iron', spin: 7800 },
  { club: 'Pitching Wedge', spin: 9200 },
];

export default function ClubPerformance() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Club Performance Metrics</h1>
        <p className="text-muted-foreground">Average distance, ball speed, and spin rate by club type</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Average Distance"
          description="Distance in yards"
          className="min-h-[350px]"
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={distanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="club" stroke="hsl(var(--muted-foreground))" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="distance" fill="hsl(var(--primary))" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </MetricCard>

        <MetricCard
          title="Average Ball Speed"
          description="Speed in mph"
          className="min-h-[350px]"
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={speedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="club" stroke="hsl(var(--muted-foreground))" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="speed" fill="hsl(var(--secondary))" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </MetricCard>

        <MetricCard
          title="Average Spin Rate"
          description="RPM"
          className="min-h-[350px]"
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={spinData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="club" stroke="hsl(var(--muted-foreground))" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="spin" fill="hsl(var(--accent))" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </MetricCard>
      </div>
    </div>
  );
}