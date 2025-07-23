import { BarChartWrapper } from '@/components/charts/ChartWrapper';

// Example: API configuration for real data
const apiConfig = {
  endpoint: '/api/analytics/shots/monthly',
  method: 'GET' as const,
  refreshInterval: 60000, // 1 minute
  retryAttempts: 3,
  retryDelay: 2000,
  transformData: (data: any[]) => data.map(item => ({
    month: new Date(item.date).toLocaleDateString('en-US', { month: 'short' }),
    shots: item.total_shots,
    growth: item.growth_percentage,
  })),
};

// Fallback data for offline/development mode
const fallbackData = [
  { month: 'Jan', shots: 12450, growth: 8.5 },
  { month: 'Feb', shots: 15230, growth: 22.3 },
  { month: 'Mar', shots: 18940, growth: 24.4 },
  { month: 'Apr', shots: 21560, growth: 13.8 },
  { month: 'May', shots: 25180, growth: 16.8 },
  { month: 'Jun', shots: 28920, growth: 14.9 },
];

const metrics = [
  {
    title: 'Total Shots',
    value: '122,280',
    change: { value: 15.2, period: 'this quarter' },
  },
  {
    title: 'This Month',
    value: '28,920',
    color: 'text-secondary',
    change: { value: 14.9, period: 'vs last month' },
  },
  {
    title: 'Average Growth',
    value: '+16.8%',
    color: 'text-accent',
  },
];

export default function TotalShots() {
  return (
    <BarChartWrapper
      title="Total Shots Analytics"
      description="Monthly breakdown of total shots taken by users"
      dataKey="shots"
      categoryKey="month"
      apiConfig={apiConfig}
      initialData={fallbackData}
      metrics={metrics}
      enableRealTime={true}
      interactive={true}
      exportable={true}
      loadingConfig={{
        message: 'Loading shot analytics...',
        showSkeleton: true,
        skeletonRows: 6,
      }}
      errorConfig={{
        message: 'Failed to load shot data',
        description: 'Unable to fetch shot analytics. This might be a temporary issue.',
        showRetry: true,
      }}
      emptyConfig={{
        message: 'No shot data available',
        description: 'No shots have been recorded for the selected time period.',
        actionText: 'View All Time Data',
      }}
      onDataUpdate={(data) => {
        console.log('Shots data updated:', data);
        // Could trigger notifications for significant changes
        const latestMonth = data[data.length - 1];
        if (latestMonth && typeof latestMonth.shots === 'number' && latestMonth.shots > 30000) {
          console.log('🎉 Monthly shot goal exceeded!');
        }
      }}
    />
  );
}