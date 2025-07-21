import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
  };
  icon?: LucideIcon;
  variant?: 'default' | 'premium' | 'success' | 'warning';
  description?: string;
  loading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  variant = 'default',
  description,
  loading = false,
}) => {
  const getChangeIcon = () => {
    if (!change) return null;
    if (change.value > 0) return TrendingUp;
    if (change.value < 0) return TrendingDown;
    return Minus;
  };

  const getChangeColor = () => {
    if (!change) return '';
    if (change.value > 0) return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    if (change.value < 0) return 'text-red-600 bg-red-50 dark:bg-red-900/20';
    return 'text-muted-foreground bg-muted';
  };

  const getCardVariant = () => {
    switch (variant) {
      case 'premium':
        return 'card-golf-premium';
      case 'success':
        return 'card-golf border-green-200 dark:border-green-800';
      case 'warning':
        return 'card-golf border-yellow-200 dark:border-yellow-800';
      default:
        return 'card-golf';
    }
  };

  const ChangeIcon = getChangeIcon();

  return (
    <Card className={getCardVariant()}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className={`h-4 w-4 ${variant === 'premium' ? 'text-accent' : 'text-muted-foreground'}`} />
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {loading ? (
            <div className="space-y-2">
              <div className="h-8 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
            </div>
          ) : (
            <>
              <div className="metric-large">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </div>
              
              <div className="flex items-center justify-between">
                {change && (
                  <Badge 
                    variant="secondary" 
                    className={`${getChangeColor()} flex items-center space-x-1 px-2 py-1`}
                  >
                    {ChangeIcon && <ChangeIcon className="h-3 w-3" />}
                    <span className="text-xs font-medium">
                      {Math.abs(change.value)}% {change.period}
                    </span>
                  </Badge>
                )}
                
                {description && (
                  <span className="text-xs text-muted-foreground">
                    {description}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};