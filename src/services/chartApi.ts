// Example API service implementations for chart data
// This demonstrates how to integrate with real APIs

import { ChartDataPoint, ChartApiConfig } from '@/types/chart';

class ChartApiService {
  private baseUrl = process.env.REACT_APP_API_URL || '/api';

  // Generic API call method
  async fetchData(config: ChartApiConfig): Promise<ChartDataPoint[]> {
    const url = config.endpoint.startsWith('http') 
      ? config.endpoint 
      : `${this.baseUrl}${config.endpoint}`;

    const response = await fetch(url, {
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
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return config.transformData ? config.transformData(data) : data;
  }

  // Example: Mock API for development/testing
  async getMockData(type: string): Promise<ChartDataPoint[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

    switch (type) {
      case 'sessions':
        return [
          { date: 'Jan', sessions: 1240, duration: 28 },
          { date: 'Feb', sessions: 1350, duration: 32 },
          { date: 'Mar', sessions: 1180, duration: 29 },
          { date: 'Apr', sessions: 1520, duration: 35 },
          { date: 'May', sessions: 1680, duration: 31 },
          { date: 'Jun', sessions: 1450, duration: 33 },
        ];

      case 'users':
        return [
          { name: 'Active Users', value: 8920 },
          { name: 'New Users', value: 2340 },
          { name: 'Returning Users', value: 6580 },
        ];

      case 'shots':
        return [
          { month: 'Jan', shots: 12450 },
          { month: 'Feb', shots: 15230 },
          { month: 'Mar', shots: 18940 },
          { month: 'Apr', shots: 21560 },
          { month: 'May', shots: 25180 },
          { month: 'Jun', shots: 28920 },
        ];

      case 'dropoff':
        return [
          { name: 'Returned Users', value: 72, percentage: '72%' },
          { name: 'Dropped Off', value: 28, percentage: '28%' },
        ];

      default:
        return [];
    }
  }

  // Example: Real-time WebSocket connection for live updates
  setupWebSocket(endpoint: string, onData: (data: ChartDataPoint[]) => void) {
    const ws = new WebSocket(`ws://localhost:8080${endpoint}`);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onData(data);
      } catch (error) {
        console.error('WebSocket data parsing error:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return ws;
  }

  // Example: GraphQL integration
  async fetchGraphQLData(query: string, variables?: Record<string, any>): Promise<any> {
    const response = await fetch(`${this.baseUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(`GraphQL Error: ${result.errors.map((e: any) => e.message).join(', ')}`);
    }

    return result.data;
  }

  // Example: Third-party analytics integration (Google Analytics, Mixpanel, etc.)
  async fetchGoogleAnalytics(params: {
    startDate: string;
    endDate: string;
    metrics: string[];
    dimensions?: string[];
  }): Promise<ChartDataPoint[]> {
    // This would integrate with Google Analytics Reporting API
    // For demo purposes, returning mock data
    const mockResponse = {
      reports: [{
        data: {
          rows: [
            { dimensions: ['2024-01-01'], metrics: [{ values: ['1240'] }] },
            { dimensions: ['2024-01-02'], metrics: [{ values: ['1350'] }] },
            { dimensions: ['2024-01-03'], metrics: [{ values: ['1180'] }] },
          ]
        }
      }]
    };

    return mockResponse.reports[0].data.rows.map(row => ({
      date: row.dimensions[0],
      value: parseInt(row.metrics[0].values[0])
    }));
  }

  // Example: Database integration (if you have a direct connection)
  async fetchFromDatabase(query: string, params?: any[]): Promise<ChartDataPoint[]> {
    // This would use your database client (e.g., PostgreSQL, MySQL)
    // For demo purposes, returning mock data
    console.log('Database query:', query, params);
    
    return [
      { id: 1, name: 'Sample Data', value: 100 },
      { id: 2, name: 'More Data', value: 150 },
    ];
  }
}

export const chartApiService = new ChartApiService();

// Example configurations for different data sources
export const apiConfigurations = {
  // REST API example
  dailySessionsRest: {
    endpoint: '/analytics/sessions/daily',
    method: 'GET' as const,
    refreshInterval: 30000,
    transformData: (data: any[]) => data.map(item => ({
      date: new Date(item.date).toLocaleDateString(),
      sessions: item.session_count,
      duration: Math.round(item.avg_duration / 60), // Convert to minutes
    })),
  },

  // GraphQL example
  userMetricsGraphQL: {
    endpoint: '/graphql',
    method: 'POST' as const,
    params: {
      query: `
        query GetUserMetrics($timeframe: String!) {
          userMetrics(timeframe: $timeframe) {
            activeUsers
            newUsers
            returningUsers
            subscriptionRate
          }
        }
      `,
      variables: { timeframe: '7d' }
    },
    transformData: (data: any) => [
      { name: 'Active', value: data.userMetrics.activeUsers },
      { name: 'New', value: data.userMetrics.newUsers },
      { name: 'Returning', value: data.userMetrics.returningUsers },
    ],
  },

  // Mock data for development
  mockSessions: {
    endpoint: 'mock://sessions',
    method: 'GET' as const,
    refreshInterval: 5000, // 5 seconds for demo
    transformData: (data: any[]) => data,
  },
} as const;