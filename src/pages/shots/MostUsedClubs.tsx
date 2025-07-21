import React from 'react';
import { Trophy, Target, Users, BarChart3 } from 'lucide-react';
import { MetricCard } from '@/components/charts/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const clubData = [
  { name: 'Driver', usage: 2845, percentage: 23.5, performance: 'excellent' },
  { name: '7 Iron', usage: 2234, percentage: 18.4, performance: 'good' },
  { name: 'Pitching Wedge', usage: 1876, percentage: 15.5, performance: 'good' },
  { name: '3 Wood', usage: 1543, percentage: 12.7, performance: 'average' },
  { name: 'Sand Wedge', usage: 1289, percentage: 10.6, performance: 'excellent' },
  { name: '5 Iron', usage: 987, percentage: 8.1, performance: 'average' },
  { name: 'Putter', usage: 845, percentage: 7.0, performance: 'good' },
  { name: '9 Iron', usage: 523, percentage: 4.3, performance: 'needs improvement' },
];

export const MostUsedClubs = () => {
  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Excellent</Badge>;
      case 'good':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Good</Badge>;
      case 'average':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Average</Badge>;
      case 'needs improvement':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Needs Work</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Most Used Clubs</h1>
          <p className="text-muted-foreground mt-2">
            Club usage statistics for active users (5+ sessions in 30 days)
          </p>
        </div>
        <Trophy className="h-12 w-12 text-primary" />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Shots Analyzed"
          value="12,142"
          change={{ value: 18.2, period: 'vs last month' }}
          icon={Target}
          variant="premium"
          description="Active users only"
        />
        
        <MetricCard
          title="Most Popular Club"
          value="Driver"
          icon={Trophy}
          variant="success"
          description="23.5% of all shots"
        />
        
        <MetricCard
          title="Active Users"
          value="284"
          change={{ value: 12.1, period: 'vs last month' }}
          icon={Users}
          description="5+ sessions"
        />
        
        <MetricCard
          title="Avg Clubs per Session"
          value="5.7"
          change={{ value: 3.4, period: 'vs last month' }}
          icon={BarChart3}
          description="Different clubs used"
        />
      </div>

      {/* Club Usage Chart */}
      <Card className="card-golf">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-primary" />
            Club Usage Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clubData.map((club, index) => (
              <div key={club.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium">{club.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {club.usage.toLocaleString()} shots
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getPerformanceBadge(club.performance)}
                    <span className="text-lg font-bold text-primary">
                      {club.percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${club.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-golf">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary" />
              Usage Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-golf-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Driver is the most used club, indicating focus on distance</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-golf-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Short irons (7-9) and wedges represent 42% of practice shots</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Putter usage is lower than expected for skill development</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Sand wedge shows excellent performance despite moderate usage</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="card-golf">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-primary" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-medium text-sm text-green-800 dark:text-green-200 mb-1">
                  Promote Putting Practice
                </h4>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Add putting challenges to increase short game focus
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-sm text-blue-800 dark:text-blue-200 mb-1">
                  9 Iron Improvement
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Provide targeted feedback for 9 iron technique
                </p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <h4 className="font-medium text-sm text-amber-800 dark:text-amber-200 mb-1">
                  Balanced Practice
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Encourage more varied club selection in practice sessions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};