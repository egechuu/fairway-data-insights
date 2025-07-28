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
} from "recharts";

type WeeklyData = {
  week: string;
  successRate: number;
  avgShots: number;
};

type Metrics = {
  weekly_data: WeeklyData[];
  total_shots_analyzed: number;
  avg_success_rate: number;
  best_week: string;
  best_week_success_rate: number;
  improvement: number;
};

export default function PremiumUserPerformance() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("golf_auth_token");
        const res = await fetch("/api/shots/premium_user_performance", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) throw new Error("Failed to fetch metrics");

        const data = await res.json();
        console.log("Fetched premium user data:", data);

        const parsedMetrics: Metrics = {
          weekly_data: Array.isArray(data.weekly_premium_user_performance)
            ? data.weekly_premium_user_performance
            : [],
          total_shots_analyzed: parseInt(data.total_shots_analyzed) || 0,
          avg_success_rate: parseFloat(data.avg_success_rate) || 0,
          best_week: data.best_week?.week || "",
          best_week_success_rate: parseFloat(data.best_week?.success_rate) || 0,
          improvement: parseFloat(data.improvement) || 0
        };

        console.log("Parsed weekly data:", parsedMetrics.weekly_data);


        setMetrics(parsedMetrics);
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Premium User Performance</h1>
        <p className="text-muted-foreground">
          Weekly tracking of premium users' shot accuracy and performance
        </p>
      </div>

      {error && <p className="text-red-500">Error: {error}</p>}
      {loading && <p className="text-muted">Loading...</p>}

      {!loading && metrics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="card-golf p-4">
              <div className="metric-label">Average Success Rate</div>
              <div className="metric-large text-primary">
                {metrics.avg_success_rate
                  ? `${metrics.avg_success_rate.toFixed(1)}%`
                  : "—"}
              </div>
            </div>

            <div className="card-golf p-4">
              <div className="metric-label">Best Week</div>
              <div className="metric-medium text-accent">
                {metrics.best_week
                  ? `${metrics.best_week} (${metrics.best_week_success_rate.toFixed(0)}%)`
                  : "—"}
              </div>
            </div>

            <div className="card-golf p-4">
              <div className="metric-label">Improvement</div>
              <div className="metric-medium text-secondary">
                {metrics.improvement !== undefined
                  ? `${metrics.improvement > 0 ? "+" : ""}${metrics.improvement.toFixed(1)}%`
                  : "—"}
              </div>
            </div>
          </div>

          <MetricCard
            title="Weekly Premium User Performance"
            description="Success rate (bars) and average successful shots per user (line)"
            className="min-h-[400px]"
          >
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart
                data={metrics.weekly_data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="avg_success_score"
                  fill="hsl(var(--golf-gold))"
                  radius={4}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avg_shots"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </MetricCard>
        </>
      )}
    </div>
  );
}
