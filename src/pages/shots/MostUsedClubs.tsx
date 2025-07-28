import React, { useEffect, useState } from 'react';
import { Trophy, Target, Users, BarChart3 } from 'lucide-react';
import { MetricCard } from '@/components/charts/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';


export const MostUsedClubs = () => {
  const [metrics, setMetrics] = useState({
    total_shots_analyzed: '',
    club_metrics: {
      club_type: [] as string[],
      total_shots: [] as string[],
      total_shot_percentage: [] as string[]
    },
    this_month: { this_month_count: '', percentage_change: '' },
    avg_clubs_per_session: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get JWT token from localStorage
        const token = localStorage.getItem('golf_auth_token'); 
        const res = await fetch('/api/shots/most_used_clubs', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch metrics');
        const data = await res.json();
        console.log("Fetched club data:", data);
        setMetrics({
          total_shots_analyzed: data.total_shots_analyzed.total_shots,
          club_metrics: {
            club_type: data.club_metrics.club_type,
            total_shots: data.club_metrics.total_shots,
            total_shot_percentage: data.club_metrics.total_shot_percentage
          },
          this_month: {
            this_month_count: data.this_month.this_month_count,
            percentage_change: data.this_month.percentage_change
          },
          avg_clubs_per_session: data.avg_clubs_per_session
        });
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 20) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">High Usage</Badge>;
    } else if (percentage >= 10) {
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Moderate Usage</Badge>;
    } else if (percentage >= 5) {
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Light Usage</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Seldom Usage</Badge>;
    }
  };

  // Parse club data into a more usable format
  const clubData = metrics.club_metrics.club_type.map((clubName, index) => ({
    name: clubName,
    usage: parseInt(metrics.club_metrics.total_shots[index] || '0'),
    percentage: parseFloat(metrics.club_metrics.total_shot_percentage[index] || '0')
  }));

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading club metrics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error: {error}</p>
            <p className="text-muted-foreground">Showing example data</p>
          </div>
        </div>
      </div>
    );
  }

  const topClub = clubData[0];
  const totalShots = parseInt(metrics.total_shots_analyzed || '0');
  const thisMonthChange = parseFloat(metrics.this_month.percentage_change || '0');
  const avgClubsPerSession = parseFloat(metrics.avg_clubs_per_session || '0');

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
          value={totalShots.toLocaleString()}
          change={{ value: thisMonthChange, period: 'vs last month' }}
          icon={Target}
          variant="premium"
          description="Active users only"
        />
        
        <MetricCard
          title="Most Popular Club"
          value={topClub?.name || 'N/A'}
          icon={Trophy}
          variant="success"
          description={`${topClub?.percentage.toFixed(1)}% of all shots`}
        />
        
        <MetricCard
          title="This Month"
          value={metrics.this_month.this_month_count}
          change={{ value: thisMonthChange, period: 'vs last month' }}
          icon={Users}
          description="New shots"
        />
        
        <MetricCard
          title="Avg Clubs per Session"
          value={avgClubsPerSession.toFixed(1)}
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
                    {getPerformanceBadge(club.percentage)}
                    <span className="text-lg font-bold text-primary">
                      {club.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(club.percentage, 100)}%` }}
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
                <span>Short irons (7-9) and wedges represent significant practice time</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Balanced club usage shows comprehensive practice approach</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Mid-irons show consistent usage patterns</span>
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
                  Maintain Driver Focus
                </h4>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Continue distance training with driver practice
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-sm text-blue-800 dark:text-blue-200 mb-1">
                  Short Game Development
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Increase wedge practice for scoring improvement
                </p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <h4 className="font-medium text-sm text-amber-800 dark:text-amber-200 mb-1">
                  Long Iron Practice
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Consider more practice with 3-4 irons for course strategy
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};