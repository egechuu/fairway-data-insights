import React from 'react';
import { Clock, Users, TrendingUp } from 'lucide-react';
import { MetricCard } from '@/components/charts/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AvgSessionDuration = () => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Average Session Duration</h1>
          <p className="text-muted-foreground mt-2">
            Track how long users spend practicing their golf swing
          </p>
        </div>
        <Clock className="h-12 w-12 text-primary" />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Overall Average"
          value="32.5 min"
          change={{ value: 12.5, period: 'vs last month' }}
          icon={Clock}
          variant="premium"
          description="All users"
        />
        
        <MetricCard
          title="Premium Users"
          value="45.2 min"
          change={{ value: 8.3, period: 'vs last month' }}
          icon={TrendingUp}
          variant="success"
          description="Subscription active"
        />
        
        <MetricCard
          title="Free Users"
          value="23.1 min"
          change={{ value: 15.7, period: 'vs last month' }}
          icon={Users}
          description="Free tier"
        />
        
        <MetricCard
          title="Weekend Sessions"
          value="38.7 min"
          change={{ value: 5.2, period: 'vs weekdays' }}
          icon={Clock}
          description="Sat-Sun average"
        />
      </div>

      {/* Detailed Analysis */}
      <Card className="card-golf">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            Session Duration Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Key Findings</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-golf-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Premium users spend 96% more time per session than free users</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-golf-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Weekend sessions are 68% longer on average</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Morning sessions (6-10 AM) show highest engagement</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Mobile users have 15% shorter sessions than desktop</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recommendations</h3>
              <div className="space-y-3">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Increase Free User Engagement</h4>
                  <p className="text-xs text-muted-foreground">
                    Consider adding guided tutorials for free users to extend session duration
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Optimize Mobile Experience</h4>
                  <p className="text-xs text-muted-foreground">
                    Improve mobile UI to match desktop session engagement levels
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Weekend Content</h4>
                  <p className="text-xs text-muted-foreground">
                    Launch weekend-specific features to capitalize on higher engagement
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart placeholder */}
      <Card className="card-golf">
        <CardHeader>
          <CardTitle>Session Duration Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Chart visualization will be implemented here</p>
              <p className="text-sm text-muted-foreground mt-1">
                Show duration trends over time with user type breakdown
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};