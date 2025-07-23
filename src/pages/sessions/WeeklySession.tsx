import { ChartWrapper } from '@/components/charts/ChartWrapper';

// Complex chart configuration for composed chart
const chartConfig = {
  type: 'composed' as const,
  dataKey: 'sessions',
  categoryKey: 'week',
  colors: ['hsl(var(--secondary))', 'hsl(var(--accent))'],
  responsive: true,
  showGrid: true,
  showLegend: true,
  showTooltip: true,
  height: 300,
  margin: { top: 20, right: 30, left: 20, bottom: 5 },
  tooltipProps: {
    formatter: (value: any, name: string) => {
      if (name === 'sessions') return [`${value} sessions`, 'Session Count'];
      if (name === 'avgDuration') return [`${value} min`, 'Avg Duration'];
      return [value, name];
    },
  },
};

// API configuration with WebSocket for real-time updates
const apiConfig = {
  endpoint: '/api/analytics/sessions/weekly',
  method: 'GET' as const,
  refreshInterval: 15000, // 15 seconds for demo
  transformData: (data: any[]) => data.map(item => ({
    week: `Week ${item.week_number}`,
    sessions: item.session_count,
    avgDuration: Math.round(item.average_duration / 60), // Convert to minutes
    secondary: Math.round(item.average_duration / 60), // For the line chart
  })),
};

const fallbackData = [
  { week: 'Week 1', sessions: 315, avgDuration: 31, secondary: 31 },
  { week: 'Week 2', sessions: 428, avgDuration: 29, secondary: 29 },
  { week: 'Week 3', sessions: 392, avgDuration: 33, secondary: 33 },
  { week: 'Week 4', sessions: 476, avgDuration: 28, secondary: 28 },
  { week: 'Week 5', sessions: 521, avgDuration: 35, secondary: 35 },
  { week: 'Week 6', sessions: 445, avgDuration: 32, secondary: 32 },
];

const metrics = [
  {
    title: 'Total Sessions',
    value: '2,577',
    change: { value: 12.4, period: 'vs last 6 weeks' },
  },
  {
    title: 'Peak Week',
    value: 'Week 5 (521)',
    color: 'text-secondary',
  },
  {
    title: 'Avg Duration',
    value: '31.3 min',
    color: 'text-accent',
    change: { value: 2.8, period: 'improvement' },
  },
];

export default function WeeklySession() {
  return (
    <ChartWrapper
      title="Weekly Session Analytics"
      description="Weekly session count and average duration trends"
      chartConfig={chartConfig}
      apiConfig={apiConfig}
      initialData={fallbackData}
      metrics={metrics}
      enableRealTime={true}
      interactive={true}
      exportable={true}
      loadingConfig={{
        message: 'Loading session analytics...',
        showSkeleton: true,
        skeletonRows: 6,
      }}
      errorConfig={{
        message: 'Failed to load session data',
        description: 'Unable to fetch weekly session analytics.',
        showRetry: true,
      }}
      emptyConfig={{
        message: 'No session data available',
        description: 'No session data found for the selected time period.',
        actionText: 'View Historical Data',
      }}
      onDataUpdate={(data) => {
        console.log('Weekly session data updated:', data);
        
        // Example: Real-time alert for unusual patterns
        const latestWeek = data[data.length - 1];
        if (latestWeek && typeof latestWeek.sessions === 'number' && latestWeek.sessions > 500) {
          console.log('🚀 High session volume detected!');
        }
        
        // Example: Calculate trends
        if (data.length >= 2 && latestWeek) {
          const previousWeek = data[data.length - 2];
          const currentSessions = typeof latestWeek.sessions === 'number' ? latestWeek.sessions : 0;
          const previousSessions = typeof previousWeek.sessions === 'number' ? previousWeek.sessions : 0;
          
          if (previousSessions > 0) {
            const trend = ((currentSessions - previousSessions) / previousSessions) * 100;
            console.log(`Session trend: ${trend.toFixed(1)}%`);
          }
        }
      }}
    />
  );
}