import React from 'react';
import { MetricCard } from '@/components/charts/MetricCard';
import { DynamicChart } from '@/components/charts/DynamicChart';
import { ChartStateWrapper } from '@/components/charts/ChartStates';
import { useChartData } from '@/hooks/useChartData';
import { 
  ChartConfig, 
  ChartApiConfig, 
  ChartDataPoint,
  MetricData,
  EmptyStateConfig,
  LoadingStateConfig,
  ErrorStateConfig
} from '@/types/chart';

interface ChartWrapperProps {
  title: string;
  description?: string;
  chartConfig: ChartConfig;
  apiConfig?: ChartApiConfig;
  initialData?: ChartDataPoint[];
  metrics?: MetricData[];
  className?: string;
  
  // State configurations
  loadingConfig?: LoadingStateConfig;
  errorConfig?: ErrorStateConfig;
  emptyConfig?: EmptyStateConfig;
  
  // Real-time updates
  enableRealTime?: boolean;
  
  // Custom actions
  onDataUpdate?: (data: ChartDataPoint[]) => void;
  
  // Interactive features
  interactive?: boolean;
  exportable?: boolean;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({
  title,
  description,
  chartConfig,
  apiConfig,
  initialData,
  metrics,
  className,
  loadingConfig,
  errorConfig,
  emptyConfig,
  enableRealTime = false,
  onDataUpdate,
  interactive = true,
  exportable = false,
}) => {
  const { data, loading, error, isEmpty, refetch, lastUpdated } = useChartData(
    enableRealTime ? apiConfig : undefined,
    initialData
  );

  // Handle data updates
  React.useEffect(() => {
    if (onDataUpdate && data.length > 0) {
      onDataUpdate(data);
    }
  }, [data, onDataUpdate]);

  const handleExport = () => {
    if (!exportable || data.length === 0) return;
    
    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            {exportable && (
              <button
                onClick={handleExport}
                className="text-xs text-primary hover:text-primary/80 transition-colors"
                disabled={data.length === 0}
              >
                Export CSV
              </button>
            )}
          </div>
        </div>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Metrics Cards */}
      {metrics && metrics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {metrics.map((metric, index) => (
            <div key={index} className="card-golf p-4">
              <div className="metric-label">{metric.title}</div>
              <div 
                className={`metric-medium ${metric.color || 'text-primary'}`}
              >
                {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
              </div>
              {metric.change && (
                <div className="text-sm text-muted-foreground">
                  {metric.change.value > 0 ? '+' : ''}{metric.change.value}% {metric.change.period}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <MetricCard
        title={`${title} Chart`}
        description="Interactive data visualization"
        className={`min-h-[400px] ${className}`}
      >
        <ChartStateWrapper
          loading={loading}
          error={error}
          isEmpty={isEmpty}
          loadingConfig={loadingConfig}
          errorConfig={{...errorConfig, onRetry: refetch}}
          emptyConfig={emptyConfig}
          onRetry={refetch}
        >
          <DynamicChart
            data={data}
            config={chartConfig}
            loading={loading}
          />
        </ChartStateWrapper>
      </MetricCard>
    </div>
  );
};

// Pre-configured chart types for common use cases
export const BarChartWrapper: React.FC<Omit<ChartWrapperProps, 'chartConfig'> & { dataKey: string; categoryKey?: string }> = 
  ({ dataKey, categoryKey, ...props }) => (
    <ChartWrapper
      {...props}
      chartConfig={{
        type: 'bar',
        dataKey,
        categoryKey,
        colors: ['hsl(var(--golf-green))'],
        responsive: true,
        showGrid: true,
        showLegend: false,
        showTooltip: true,
      }}
    />
  );

export const LineChartWrapper: React.FC<Omit<ChartWrapperProps, 'chartConfig'> & { dataKey: string; categoryKey?: string }> = 
  ({ dataKey, categoryKey, ...props }) => (
    <ChartWrapper
      {...props}
      chartConfig={{
        type: 'line',
        dataKey,
        categoryKey,
        colors: ['hsl(var(--primary))'],
        responsive: true,
        showGrid: true,
        showLegend: false,
        showTooltip: true,
      }}
    />
  );

export const PieChartWrapper: React.FC<Omit<ChartWrapperProps, 'chartConfig'> & { dataKey: string }> = 
  ({ dataKey, ...props }) => (
    <ChartWrapper
      {...props}
      chartConfig={{
        type: 'pie',
        dataKey,
        colors: ['hsl(var(--golf-green))', 'hsl(var(--destructive))', 'hsl(var(--golf-gold))'],
        responsive: true,
        showLegend: true,
        showTooltip: true,
      }}
    />
  );