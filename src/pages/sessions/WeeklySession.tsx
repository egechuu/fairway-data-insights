import { useState, useCallback } from 'react';
import { ChartWrapper } from '@/components/charts/ChartWrapper';

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
      if (name === 'averageDuration') return [`${value} min`, 'Average Duration'];
      return [value, name];
    },
  },
  series: [
    { type: 'bar', dataKey: 'sessions', name: 'Session Count', color: 'hsl(var(--secondary))' },
    { type: 'line', dataKey: 'averageDuration', name: 'Average Duration', color: 'hsl(var(--accent))' },
  ],
};

const token = localStorage.getItem('golf_auth_token');
const apiConfig = {
  endpoint: '/api/sessions/weekly_session',
  method: 'GET' as const,
  refreshInterval: 0,
  headers: {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  },
  transformData: (data: any[]) => data.map(item => ({
    week: item.week,
    sessions: item.sessions,
    averageDuration: item.avgDuration,
    secondary: item.avgDuration,
  })),
};

export default function WeeklySession() {
  const [metrics, setMetrics] = useState([
    { title: 'Total Sessions', value: '-'},
    { title: 'Peak Week', value: '-', color: 'text-secondary' },
    { title: 'Avg Duration', value: '-', color: 'text-accent'},
  ]);


  const handleDataUpdate = useCallback((data: any[]) => {
    console.log('Weekly session data updated:', data);
    if (!data || data.length === 0) return;

    const totalSessions = data.reduce((sum, item) => sum + (Number(item.sessions) || 0), 0);
    const avgDuration = (
      data.reduce((sum, item) => sum + (Number(item.averageDuration) || 0), 0) / data.length
    ).toFixed(1);
    const peakWeek = data.reduce((prev, curr) =>
      (curr.sessions || 0) > (prev.sessions || 0) ? curr : prev
    );

    setMetrics([
      {
        title: 'Total Sessions',
        value: totalSessions.toLocaleString()
      },
      {
        title: 'Peak Week',
        value: `${peakWeek.week} (${peakWeek.sessions})`,
        color: 'text-secondary',
      },
      {
        title: 'Avg Duration',
        value: `${avgDuration} min`,
        color: 'text-accent'
      },
    ]);
  }, []); 

  return (
    <ChartWrapper
      title="Weekly Session Analytics"
      description="Weekly session count and average duration trends"
      chartConfig={chartConfig}
      apiConfig={apiConfig}
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
      onDataUpdate={handleDataUpdate}
    />
  );
}