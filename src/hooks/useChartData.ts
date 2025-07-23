import { useState, useEffect, useCallback, useRef } from 'react';
import { ChartDataPoint, ChartApiConfig, ChartState } from '@/types/chart';

export const useChartData = (config?: ChartApiConfig, initialData?: ChartDataPoint[]) => {
  const [state, setState] = useState<ChartState>({
    data: initialData || [],
    loading: !!config,
    error: null,
    lastUpdated: null,
    isEmpty: false,
  });

  const retryCountRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchData = useCallback(async () => {
    if (!config) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(config.endpoint, {
        method: config.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
        ...(config.method === 'POST' && config.params && {
          body: JSON.stringify(config.params)
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();
      const transformedData = config.transformData ? config.transformData(rawData) : rawData;
      
      setState({
        data: transformedData,
        loading: false,
        error: null,
        lastUpdated: new Date(),
        isEmpty: !transformedData || transformedData.length === 0,
      });

      retryCountRef.current = 0;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data';
      
      if (retryCountRef.current < (config.retryAttempts || 3)) {
        retryCountRef.current++;
        setTimeout(() => {
          fetchData();
        }, config.retryDelay || 1000);
        return;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        isEmpty: prev.data.length === 0,
      }));
    }
  }, [config]);

  const refetch = useCallback(() => {
    retryCountRef.current = 0;
    fetchData();
  }, [fetchData]);

  const updateData = useCallback((newData: ChartDataPoint[]) => {
    setState(prev => ({
      ...prev,
      data: newData,
      lastUpdated: new Date(),
      isEmpty: newData.length === 0,
    }));
  }, []);

  // Set up polling for real-time updates
  useEffect(() => {
    if (config && config.refreshInterval) {
      intervalRef.current = setInterval(fetchData, config.refreshInterval);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [config, fetchData]);

  // Initial fetch
  useEffect(() => {
    if (config) {
      fetchData();
    }
  }, [fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    ...state,
    refetch,
    updateData,
  };
};

// Example API configurations
export const apiConfigs = {
  // Daily sessions example
  dailySessions: {
    endpoint: '/api/analytics/sessions/daily',
    method: 'GET' as const,
    refreshInterval: 30000, // 30 seconds
    transformData: (data: any[]) => data.map(item => ({
      date: item.date,
      sessions: item.total_sessions,
      duration: item.avg_duration,
    })),
  },

  // User analytics example
  userMetrics: {
    endpoint: '/api/analytics/users',
    method: 'GET' as const,
    refreshInterval: 60000, // 1 minute
    transformData: (data: any) => [
      { name: 'Active Users', value: data.active_users },
      { name: 'New Users', value: data.new_users },
      { name: 'Returning Users', value: data.returning_users },
    ],
  },

  // Shot analytics example
  shotPerformance: {
    endpoint: '/api/analytics/shots/performance',
    method: 'POST' as const,
    params: { timeframe: '7d' },
    refreshInterval: 120000, // 2 minutes
    transformData: (data: any[]) => data.map(item => ({
      week: item.week,
      successRate: item.success_rate,
      avgShots: item.average_shots,
    })),
  },
} as const;