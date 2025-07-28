import { MetricCard } from "@/components/charts/MetricCard";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


export default function ClubPerformance() {
  const [data, setData] = useState<Array<{
    club: string;
    distance: number;
    speed: number;
    spin: number;
  }>>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem('golf_auth_token');
          const res = await fetch('/api/shots/club_performance', {
            headers: {
              'Authorization': token ? `Bearer ${token}` : '',
              'Content-Type': 'application/json',
            },
          });
          if (!res.ok) throw new Error('Failed to fetch metrics');
          const json = await res.json();
          const formatted = Array.isArray(json)
    ? json.map(item => ({
        club: item.club,
        distance: Number(item.distance),
        speed: Number(item.speed),
        spin: Number(item.spin)
      })): [];
          setData(formatted);
        } catch (err) {
          // Optionally handle error
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []);
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
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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