// Comprehensive examples of dynamic chart implementation
// This file demonstrates all the features of the dynamic chart system

import React, { useState } from 'react';
import { 
  ChartWrapper, 
  BarChartWrapper, 
  LineChartWrapper, 
  PieChartWrapper 
} from '@/components/charts/ChartWrapper';
import { DynamicChart } from '@/components/charts/DynamicChart';
import { useChartData } from '@/hooks/useChartData';
import { chartApiService } from '@/services/chartApi';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, Settings } from 'lucide-react';

// Example 1: Simple Bar Chart with Static Data
export function SimpleBarChartExample() {
  const staticData = [
    { name: 'Product A', value: 400 },
    { name: 'Product B', value: 300 },
    { name: 'Product C', value: 200 },
    { name: 'Product D', value: 278 },
  ];

  return (
    <BarChartWrapper
      title="Product Sales"
      description="Monthly sales by product"
      dataKey="value"
      categoryKey="name"
      initialData={staticData}
      enableRealTime={false}
    />
  );
}

// Example 2: Line Chart with API Integration
export function ApiLineChartExample() {
  const apiConfig = {
    endpoint: '/api/analytics/revenue/daily',
    method: 'GET' as const,
    refreshInterval: 30000, // 30 seconds
    retryAttempts: 3,
    transformData: (data: any[]) => data.map(item => ({
      date: new Date(item.date).toLocaleDateString(),
      revenue: item.total_revenue,
      orders: item.order_count,
    })),
  };

  const metrics = [
    {
      title: 'Total Revenue',
      value: '$24,580',
      change: { value: 12.5, period: 'vs last week' },
    },
    {
      title: 'Average Daily',
      value: '$3,511',
      color: 'text-secondary',
    },
  ];

  return (
    <LineChartWrapper
      title="Daily Revenue Trends"
      description="Revenue and order trends over the last 7 days"
      dataKey="revenue"
      categoryKey="date"
      apiConfig={apiConfig}
      metrics={metrics}
      enableRealTime={true}
      exportable={true}
    />
  );
}

// Example 3: Pie Chart with Custom Configuration
export function CustomPieChartExample() {
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  const data = [
    { name: 'Desktop', value: 45, users: 1250 },
    { name: 'Mobile', value: 35, users: 980 },
    { name: 'Tablet', value: 20, users: 560 },
  ];

  const chartConfig = {
    type: 'pie' as const,
    dataKey: 'value',
    colors: [
      'hsl(var(--golf-green))', 
      'hsl(var(--golf-gold))', 
      'hsl(var(--accent))'
    ],
    responsive: true,
    showLegend: true,
    showTooltip: true,
    tooltipProps: {
      formatter: (value: any, name: string, props: any) => [
        `${value}% (${props.payload.users} users)`,
        name
      ],
    },
  };

  return (
    <ChartWrapper
      title="User Device Distribution"
      description="Breakdown of users by device type"
      chartConfig={chartConfig}
      initialData={data}
      onDataUpdate={(data) => {
        console.log('Device data updated:', data);
        setSelectedSegment(typeof data[0]?.name === 'string' ? data[0].name : null);
      }}
    />
  );
}

// Example 4: Real-time Chart with WebSocket
export function RealTimeChartExample() {
  const [isConnected, setIsConnected] = useState(false);
  const [liveData, setLiveData] = useState<any[]>([]);

  React.useEffect(() => {
    // Simulate WebSocket connection
    const interval = setInterval(() => {
      const newDataPoint = {
        time: new Date().toLocaleTimeString(),
        users: Math.floor(Math.random() * 100) + 50,
        sessions: Math.floor(Math.random() * 200) + 100,
      };
      
      setLiveData(prev => [...prev.slice(-9), newDataPoint]); // Keep last 10 points
    }, 2000);

    setIsConnected(true);

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, []);

  const chartConfig = {
    type: 'line' as const,
    dataKey: 'users',
    categoryKey: 'time',
    colors: ['hsl(var(--primary))', 'hsl(var(--secondary))'],
    responsive: true,
    showGrid: true,
    showTooltip: true,
    height: 300,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Real-time User Activity</h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-muted-foreground">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
      
      <ChartWrapper
        title=""
        chartConfig={chartConfig}
        initialData={liveData}
        enableRealTime={false} // We're managing updates manually
      />
    </div>
  );
}

// Example 5: Chart with Custom Loading, Error, and Empty States
export function CustomStatesChartExample() {
  const [forceError, setForceError] = useState(false);
  const [forceEmpty, setForceEmpty] = useState(false);
  const [forceLoading, setForceLoading] = useState(false);

  const apiConfig = forceError ? {
    endpoint: '/api/invalid-endpoint',
    method: 'GET' as const,
  } : {
    endpoint: '/api/analytics/sample',
    method: 'GET' as const,
    transformData: () => forceEmpty ? [] : [
      { name: 'Sample A', value: 100 },
      { name: 'Sample B', value: 200 },
    ],
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setForceLoading(!forceLoading)}
        >
          {forceLoading ? 'Stop Loading' : 'Force Loading'}
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setForceError(!forceError)}
        >
          {forceError ? 'Fix Error' : 'Force Error'}
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setForceEmpty(!forceEmpty)}
        >
          {forceEmpty ? 'Add Data' : 'Force Empty'}
        </Button>
      </div>

      <BarChartWrapper
        title="Custom States Example"
        description="Demonstrates loading, error, and empty states"
        dataKey="value"
        categoryKey="name"
        apiConfig={apiConfig}
        enableRealTime={false}
        loadingConfig={{
          message: 'Fetching chart data from server...',
          showSkeleton: true,
          skeletonRows: 5,
        }}
        errorConfig={{
          message: 'Oops! Something went wrong',
          description: 'We encountered an error while loading your data. Please try again or contact support if the issue persists.',
          showRetry: true,
        }}
        emptyConfig={{
          message: 'No data found',
          description: 'There is no data available for the selected criteria. Try adjusting your filters or date range.',
          actionText: 'Reset Filters',
          onAction: () => console.log('Reset filters clicked'),
        }}
      />
    </div>
  );
}

// Example 6: Multi-Chart Dashboard
export function DashboardExample() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGlobalRefresh = () => {
    setRefreshKey(prev => prev + 1);
    console.log('Refreshing all charts...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex gap-2">
          <Button onClick={handleGlobalRefresh} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh All
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleBarChartExample />
        <CustomPieChartExample />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ApiLineChartExample />
        <RealTimeChartExample />
      </div>
    </div>
  );
}

// Example 7: Chart Configuration Object
export const chartConfigExamples = {
  // Basic bar chart
  simpleBar: {
    type: 'bar' as const,
    dataKey: 'value',
    categoryKey: 'name',
    colors: ['hsl(var(--primary))'],
    responsive: true,
  },

  // Stacked bar chart
  stackedBar: {
    type: 'bar' as const,
    dataKey: 'value',
    categoryKey: 'month',
    stacked: true,
    colors: ['hsl(var(--primary))', 'hsl(var(--secondary))'],
    showLegend: true,
  },

  // Area chart with gradient
  gradientArea: {
    type: 'area' as const,
    dataKey: 'revenue',
    categoryKey: 'date',
    gradient: true,
    colors: ['hsl(var(--golf-green))'],
    showGrid: true,
  },

  // Composed chart (bar + line)
  composed: {
    type: 'composed' as const,
    dataKey: 'primary',
    categoryKey: 'period',
    colors: ['hsl(var(--primary))', 'hsl(var(--accent))'],
    showLegend: true,
    margin: { top: 20, right: 30, left: 20, bottom: 5 },
  },
};

// Example 8: API Configuration Examples
export const apiConfigExamples = {
  // Simple GET request
  simpleGet: {
    endpoint: '/api/data',
    method: 'GET' as const,
  },

  // POST with parameters
  postWithParams: {
    endpoint: '/api/analytics',
    method: 'POST' as const,
    params: {
      timeframe: '7d',
      metrics: ['sessions', 'users'],
    },
  },

  // With custom headers and transformation
  withTransform: {
    endpoint: '/api/external-data',
    method: 'GET' as const,
    headers: {
      'Authorization': 'Bearer token',
      'X-API-Key': 'your-api-key',
    },
    transformData: (data: any) => data.results.map((item: any) => ({
      name: item.label,
      value: item.count,
    })),
  },

  // Real-time with polling
  realTime: {
    endpoint: '/api/live-data',
    method: 'GET' as const,
    refreshInterval: 5000, // 5 seconds
    retryAttempts: 3,
    retryDelay: 1000,
  },
};

export default function ChartExamples() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Dynamic Chart Examples</h1>
        <p className="text-muted-foreground">
          Comprehensive examples demonstrating all features of the dynamic chart system
        </p>
      </div>

      <DashboardExample />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomStatesChartExample />
        <RealTimeChartExample />
      </div>
    </div>
  );
}