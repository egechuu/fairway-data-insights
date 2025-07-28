import { BarChartWrapper } from '@/components/charts/ChartWrapper';
import { useState, useEffect } from 'react';

interface ShotData {
  total_shots: number;
  month: string;
  shots: number;
  growth: number;
}

interface ApiResponse {
  shots_per_months?: any[];
  shots_per_month?: any[];
  this_month_count?: string;
  growth?: string;
}

export default function TotalShots() {
  const [metricsData, setMetricsData] = useState({
    totalShots: 0,
    thisMonth: 0,
    averageGrowth: 0
  });

  const token = localStorage.getItem('golf_auth_token');

  const apiConfig = {
    endpoint: '/api/shots/total_shots',
    method: 'GET' as const,
    refreshInterval: 0,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
    transformData: (data: ApiResponse) => {
      // Handle the actual API response structure
      const shotsData = data.shots_per_months || data.shots_per_month || [];
      const thisMonthCount = parseInt(data.this_month_count || '0');
      const growth = parseFloat(data.growth || '0');

      const transformedData = shotsData.map((item) => ({
        total_shots: thisMonthCount,
        month: (item.month.charAt(0).toUpperCase() + item.month.slice(1).toLowerCase()).trim(),
        shots: parseInt(item.total_shot_count || '0'),
        growth: growth,
      }));

      // Sort months in chronological order
      const monthOrder = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const sortedData = transformedData.sort((a, b) => {
        return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
      });

      // Calculate total shots from all months
      const totalShots = sortedData.reduce((sum: number, item: any) => sum + item.shots, 0);

      // Calculate average growth
      const validGrowthValues = sortedData.filter((item: any) => item.growth > 0);
      const averageGrowth = validGrowthValues.length > 0
        ? validGrowthValues.reduce((sum: number, item: any) => sum + item.growth, 0) / validGrowthValues.length
        : growth;

      // Only update metrics data if values have actually changed
      setMetricsData(prev => {
        if (prev.totalShots !== totalShots ||
            prev.thisMonth !== thisMonthCount ||
            prev.averageGrowth !== averageGrowth) {
          return {
            totalShots,
            thisMonth: thisMonthCount,
            averageGrowth
          };
        }
        return prev;
      });

      return sortedData;
    }
  };

  const metrics = [
    {
      title: 'Total Shots',
      value: metricsData.totalShots.toLocaleString(),
      change: { value: 15.2, period: 'this quarter' },
    },
    {
      title: 'This Month',
      value: metricsData.thisMonth.toLocaleString(),
      color: 'text-secondary',
      change: { value: 14.9, period: 'vs last month' },
    },
    {
      title: 'Average Growth',
      value: `${metricsData.averageGrowth.toFixed(1)}%`,
      color: 'text-accent',
    },
  ];

  return (
    <BarChartWrapper
      title="Total Shots Analytics"
      description="Monthly breakdown of total shots taken by users"
      dataKey="shots"
      categoryKey="month"
      apiConfig={apiConfig}
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
      }}
    />
  );
}