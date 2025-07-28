import { MetricCard } from "@/components/charts/MetricCard";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";

const COLORS = ['#22c55e', '#16a34a', '#4ade80', '#bbf7d0'];

export default function AvgSessionFrequency() {
	const [data, setData] = useState<Array<{ subscription: string; frequency: number }>>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const token = localStorage.getItem('golf_auth_token');
				const res = await fetch('/api/sessions/avg_session_frequency', {
					headers: {
						'Authorization': token ? `Bearer ${token}` : '',
						'Content-Type': 'application/json',
					},
				});
				if (!res.ok) throw new Error('Failed to fetch metrics');
				const json = await res.json();
				const formatted = Array.isArray(json)
  ? json.map(item => ({
      subscription: item.subscription,
      frequency: Number(item.frequency)
    }))
  : [];
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
				<h1 className="text-2xl font-bold text-foreground">Average Session Frequency</h1>
				<p className="text-muted-foreground">Comparing session frequency across subscription status</p>
			</div>  

			<MetricCard
				title="Session Frequency by Subscription"
				description="Average sessions per week by subscription status"
				className="min-h-[400px]"
			>
				{loading ? (
					<div className="flex items-center justify-center h-[300px] text-muted-foreground">Loading...</div>
				) : (
					<ResponsiveContainer width="100%" height={300}>
						<PieChart>
							<Pie
								data={data}
								dataKey="frequency"
								nameKey="subscription"
								cx="50%"
								cy="50%"
								outerRadius={100}
								label={({ subscription }) => subscription}
							>
								{data.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
								))}
							</Pie>
							<Tooltip
								contentStyle={{
									backgroundColor: 'hsl(var(--card))',
									border: '1px solid hsl(var(--border))',
									borderRadius: '8px'
								}}
							/>
						</PieChart>
					</ResponsiveContainer>
				)}
			</MetricCard>
		</div>
	);
}