import { PieChartWrapper } from '@/components/charts/ChartWrapper';
import { useState, useCallback, useRef } from 'react';

export default function DropOffRateAll() {
  const [metricsData, setMetricsData] = useState({
    total_user_count: 0,
    drop_off_count: 0,
    returned_count: 0,
    drop_off_rate: 0
  });

  const token = localStorage.getItem('golf_auth_token');
  const lastDataRef = useRef<string>('');

  const transformData = useCallback((data: any) => {
    const total_user_count = parseInt(data.total_user_count || '0');
    const drop_off_count = parseFloat(data.drop_off_count || '0');
    const returned_count = parseInt(data.returned_count || '0');
    const drop_off_rate = parseFloat(data.drop_off_rate || '0');
    
    // Return data formatted for the pie chart (no state updates here)
    return [
      {
        name: 'Dropped Off',
        value: drop_off_count,
        percentage: drop_off_rate,
        total_user_count,
        returned_count
      },
      {
        name: 'Returned',
        value: returned_count,
        percentage: 100 - drop_off_rate,
        total_user_count,
        drop_off_count
      }
    ];
  }, []);

  const apiConfig = {
    endpoint: '/api/users/drop_off_rate_all',
    method: 'GET' as const,
    refreshInterval: 0,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
    transformData
  };

  // Fallback data for when API fails or is loading
  const fallbackData = [
    { name: 'Dropped Off', value: 0, percentage: 0 },
    { name: 'Returned', value: 0, percentage: 0 }
  ];

  // Metrics to display alongside the chart
  const metrics = [
    {
      title: 'Total Users',
      value: metricsData.total_user_count,
      color: '#3b82f6'
    },
    {
      title: 'Drop-off Rate',
      value: `${metricsData.drop_off_rate.toFixed(1)}%`,
      color: '#ef4444'
    },
    {
      title: 'Users Dropped Off',
      value: metricsData.drop_off_count,
      color: '#ef4444'
    },
    {
      title: 'Users Returned',
      value: metricsData.returned_count,
      color: '#10b981'
    }
  ];

  return (
    <PieChartWrapper
      title="User Drop-off Rate (All Users)"
      description="Percentage of users who dropped off after their first session"
      dataKey="value"
      apiConfig={apiConfig}
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
      onDataUpdate={useCallback((data) => {
        console.log('Drop-off data updated:', data);
        
        
        // Update metrics state only once when data is received
        if (data && data.length > 0 && data[0].total_user_count !== undefined) {
          const firstDataPoint = data[0];
          const secondDataPoint = data[1];
          
          const newMetricsData = {
            total_user_count: parseInt(String(firstDataPoint.total_user_count || 0)),
            drop_off_count: parseFloat(String(firstDataPoint.value || 0)),
            returned_count: parseInt(String(secondDataPoint.value || 0)),
            drop_off_rate: parseFloat(String(firstDataPoint.percentage || 0))
          };
          
          // Only update if data has actually changed
          const dataHash = JSON.stringify(newMetricsData);
          if (dataHash !== lastDataRef.current) {
            lastDataRef.current = dataHash;
            setMetricsData(newMetricsData);
          }
        }
      }, [])}
    />
  );
}