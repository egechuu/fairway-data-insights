import { PieChartWrapper } from '@/components/charts/ChartWrapper';
import { chartApiService } from '@/services/chartApi';

// Example: Dynamic data configuration
const chartConfig = {
  // For mock data during development
  endpoint: 'mock://dropoff',
  method: 'GET' as const,
  refreshInterval: 30000, // 30 seconds
  transformData: (data: any) => [
    { name: 'Returned Users', value: 72, percentage: '72%' },
    { name: 'Dropped Off', value: 28, percentage: '28%' },
  ],
};

// Static data as fallback
const fallbackData = [
  { name: 'Returned Users', value: 72, percentage: '72%' },
  { name: 'Dropped Off', value: 28, percentage: '28%' },
];

const metrics = [
  {
    title: 'Total Users',
    value: '12,485',
  },
  {
    title: 'Returned',
    value: '8,989 (72%)',
    color: 'text-golf-green',
    change: { value: 5.2, period: 'vs last month' },
  },
  {
    title: 'Dropped Off',
    value: '3,496 (28%)',
    color: 'text-destructive',
    change: { value: -2.1, period: 'vs last month' },
  },
];

export default function DropOffRateAll() {
  return (
    <PieChartWrapper
      title="User Drop-off Rate (All Users)"
      description="Percentage of users who dropped off after their first session"
      dataKey="value"
      apiConfig={chartConfig}
      initialData={fallbackData}
      metrics={metrics}
      enableRealTime={true}
      interactive={true}
      exportable={true}
      loadingConfig={{
        message: 'Loading user retention data...',
        showSkeleton: true,
        skeletonRows: 3,
      }}
      errorConfig={{
        message: 'Failed to load retention data',
        description: 'Unable to fetch user drop-off statistics. Please check your connection.',
        showRetry: true,
      }}
      emptyConfig={{
        message: 'No retention data available',
        description: 'There is no user retention data to display for the selected period.',
        actionText: 'Refresh Data',
      }}
      onDataUpdate={(data) => {
        console.log('Drop-off data updated:', data);
        // You can trigger additional actions here
      }}
    />
  );
}