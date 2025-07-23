import React from 'react';
import { AlertCircle, BarChart3, RefreshCw, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  EmptyStateConfig, 
  LoadingStateConfig, 
  ErrorStateConfig 
} from '@/types/chart';

interface LoadingStateProps extends LoadingStateConfig {}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading chart data...',
  showSkeleton = true,
  skeletonRows = 4,
}) => {
  if (showSkeleton) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{message}</span>
        </div>
        <div className="space-y-2">
          {Array.from({ length: skeletonRows }).map((_, i) => (
            <Skeleton 
              key={i} 
              className="h-8 w-full" 
              style={{ 
                width: `${Math.random() * 40 + 60}%`,
                height: `${Math.random() * 20 + 30}px` 
              }} 
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center space-y-2">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

interface ErrorStateProps extends ErrorStateConfig {}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Failed to load chart data',
  description = 'There was an error loading the chart. Please try again.',
  showRetry = true,
  onRetry,
}) => {
  return (
    <div className="p-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="space-y-3">
          <div>
            <p className="font-medium">{message}</p>
            <p className="text-sm">{description}</p>
          </div>
          {showRetry && onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="mt-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Try Again
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};

interface EmptyStateProps extends EmptyStateConfig {}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No data available',
  description = 'There is no data to display for this chart.',
  showIcon = true,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center space-y-4">
        {showIcon && (
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <div className="space-y-2">
          <h3 className="font-medium text-foreground">{message}</h3>
          <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
        </div>
        {actionText && onAction && (
          <Button variant="outline" size="sm" onClick={onAction}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
};

// Wrapper component that handles all states
interface ChartStateWrapperProps {
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  children: React.ReactNode;
  loadingConfig?: LoadingStateConfig;
  errorConfig?: ErrorStateConfig;
  emptyConfig?: EmptyStateConfig;
  onRetry?: () => void;
}

export const ChartStateWrapper: React.FC<ChartStateWrapperProps> = ({
  loading,
  error,
  isEmpty,
  children,
  loadingConfig,
  errorConfig,
  emptyConfig,
  onRetry,
}) => {
  if (loading) {
    return <LoadingState {...loadingConfig} />;
  }

  if (error) {
    return (
      <ErrorState 
        {...errorConfig} 
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (isEmpty) {
    return <EmptyState {...emptyConfig} />;
  }

  return <>{children}</>;
};