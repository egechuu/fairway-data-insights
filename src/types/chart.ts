// Chart configuration and data types for dynamic chart system

export interface ChartDataPoint {
  [key: string]: string | number | undefined;
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'area' | 'composed';
  dataKey: string;
  categoryKey?: string;
  colors?: string[];
  gradient?: boolean;
  stacked?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
  responsive?: boolean;
  height?: number;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  xAxisProps?: Record<string, any>;
  yAxisProps?: Record<string, any>;
  tooltipProps?: Record<string, any>;
  legendProps?: Record<string, any>;
}

export interface MetricData {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
  };
  color?: string;
}

export interface ChartApiConfig {
  endpoint: string;
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  params?: Record<string, any>;
  transformData?: (data: any) => ChartDataPoint[];
  refreshInterval?: number; // in milliseconds
  retryAttempts?: number;
  retryDelay?: number;
}

export interface ChartState {
  data: ChartDataPoint[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isEmpty: boolean;
}

export interface EmptyStateConfig {
  message?: string;
  description?: string;
  showIcon?: boolean;
  actionText?: string;
  onAction?: () => void;
}

export interface LoadingStateConfig {
  message?: string;
  showSkeleton?: boolean;
  skeletonRows?: number;
}

export interface ErrorStateConfig {
  message?: string;
  description?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}