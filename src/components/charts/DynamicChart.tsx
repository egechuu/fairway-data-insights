import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  LineChart,
  PieChart,
  AreaChart,
  ComposedChart,
  Bar,
  Line,
  Pie,
  Cell,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ChartDataPoint, ChartConfig } from '@/types/chart';

interface DynamicChartProps {
  data: ChartDataPoint[];
  config: ChartConfig;
  loading?: boolean;
  className?: string;
}

export const DynamicChart: React.FC<DynamicChartProps> = ({
  data,
  config,
  loading = false,
  className,
}) => {
  const {
    type,
    dataKey,
    categoryKey,
    colors = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))'],
    gradient = false,
    stacked = false,
    showLegend = true,
    showTooltip = true,
    showGrid = true,
    responsive = true,
    height = 300,
    margin = { top: 20, right: 30, left: 20, bottom: 5 },
    xAxisProps = {},
    yAxisProps = {},
    tooltipProps = {},
    legendProps = {},
  } = config;

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`} style={{ height }}>
        <div className="bg-muted rounded h-full" />
      </div>
    );
  }

  const commonProps = {
    data,
    margin,
  };

  const tooltipStyle = {
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    ...tooltipProps.contentStyle,
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
            <XAxis 
              dataKey={categoryKey || 'name'} 
              stroke="hsl(var(--muted-foreground))" 
              {...xAxisProps}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              {...yAxisProps}
            />
            {showTooltip && <Tooltip contentStyle={tooltipStyle} {...tooltipProps} />}
            {showLegend && <Legend {...legendProps} />}
            <Bar 
              dataKey={dataKey} 
              fill={colors[0]} 
              radius={4}
              stackId={stacked ? 'stack' : undefined}
            />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
            <XAxis 
              dataKey={categoryKey || 'name'} 
              stroke="hsl(var(--muted-foreground))" 
              {...xAxisProps}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              {...yAxisProps}
            />
            {showTooltip && <Tooltip contentStyle={tooltipStyle} {...tooltipProps} />}
            {showLegend && <Legend {...legendProps} />}
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={colors[0]} 
              strokeWidth={3}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
            <XAxis 
              dataKey={categoryKey || 'name'} 
              stroke="hsl(var(--muted-foreground))" 
              {...xAxisProps}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              {...yAxisProps}
            />
            {showTooltip && <Tooltip contentStyle={tooltipStyle} {...tooltipProps} />}
            {showLegend && <Legend {...legendProps} />}
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={colors[0]} 
              fill={gradient ? `url(#gradient-${dataKey})` : colors[0]}
              stackId={stacked ? 'stack' : undefined}
            />
            {gradient && (
              <defs>
                <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={colors[0]} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            )}
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart {...commonProps}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}\n${value}`}
              outerRadius={100}
              dataKey={dataKey}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            {showTooltip && <Tooltip contentStyle={tooltipStyle} {...tooltipProps} />}
            {showLegend && <Legend {...legendProps} />}
          </PieChart>
        );

      case 'composed':
        return (
          <ComposedChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
            <XAxis 
              dataKey={categoryKey || 'name'} 
              stroke="hsl(var(--muted-foreground))" 
              {...xAxisProps}
            />
            <YAxis 
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))" 
              {...yAxisProps}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="hsl(var(--muted-foreground))" 
            />
            {showTooltip && <Tooltip contentStyle={tooltipStyle} {...tooltipProps} />}
            {showLegend && <Legend {...legendProps} />}
            <Bar yAxisId="left" dataKey={dataKey} fill={colors[0]} radius={4} />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="secondary" 
              stroke={colors[1]} 
              strokeWidth={3} 
            />
          </ComposedChart>
        );

      default:
        return <div>Unsupported chart type: {type}</div>;
    }
  };

  const ChartComponent = responsive ? ResponsiveContainer : 'div';
  const chartProps = responsive ? { width: '100%', height } : { style: { height } };

  return (
    <ChartComponent {...chartProps} className={className}>
      {renderChart()}
    </ChartComponent>
  );
};