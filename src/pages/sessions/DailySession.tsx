import { MetricCard } from "@/components/charts/MetricCard";
import { useEffect, useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function safeNumber(value: any): number {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

export default function DailySession() {
  const [data, setData] = useState<Array<{
    day: string,
    daily_session_frequency: number,
    avg_duration: number
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('golf_auth_token');
        const res = await fetch('/api/sessions/daily_session', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch metrics');
        const json = await res.json();
        console.log("Raw API response:", json);

        const dayOrder = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ];

        const formatted = Array.isArray(json)
          ? json
               .map(item => ({
                day: String(item.day).trim(),
                daily_session_frequency: safeNumber(item.sessions),
                avg_duration: safeNumber(item.avgDuration),
              }))
              .sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day))
          : [];

        console.log("Formatted chart data:", formatted);
        setData(formatted);
      } catch (err) {
        console.error("Error fetching daily session data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Daily Session Analytics</h1>
        <p className="text-muted-foreground">Daily session count and average duration trends</p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
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
              <Bar
                yAxisId="left"
                dataKey="daily_session_frequency"
                fill="hsl(var(--primary))"
                radius={4}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avg_duration"
                stroke="hsl(var(--accent))"
                strokeWidth={3}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </MetricCard>
      )}
    </div>
  );
}
