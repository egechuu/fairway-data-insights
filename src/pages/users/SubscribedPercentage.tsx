import React from 'react';
import { Users, Crown, UserCheck, TrendingUp } from 'lucide-react';
import { MetricCard } from '@/components/charts/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const subscriptionData = [
  {
    tier: 'Premium Pro',
    count: 1247,
    percentage: 28.5,
    color: 'bg-gradient-to-r from-amber-400 to-amber-600',
    revenue: '$124,700',
    features: ['Unlimited Analysis', 'AI Coaching', 'Advanced Reports']
  },
  {
    tier: 'Premium',
    count: 892,
    percentage: 20.4,
    color: 'bg-gradient-to-r from-blue-500 to-blue-700',
    revenue: '$44,600',
    features: ['Detailed Analytics', 'Club Recommendations', 'Progress Tracking']
  },
  {
    tier: 'Basic',
    count: 756,
    percentage: 17.3,
    color: 'bg-gradient-to-r from-green-500 to-green-700',
    revenue: '$15,120',
    features: ['Basic Stats', 'Session History', 'Mobile App']
  },
  {
    tier: 'Free',
    count: 1475,
    percentage: 33.8,
    color: 'bg-gradient-to-r from-gray-400 to-gray-600',
    revenue: '$0',
    features: ['Limited Sessions', 'Basic Dashboard', 'Community Access']
  }
];

export const SubscribedPercentage = () => {
  const totalUsers = subscriptionData.reduce((sum, tier) => sum + tier.count, 0);
  const paidUsers = subscriptionData.filter(tier => tier.tier !== 'Free').reduce((sum, tier) => sum + tier.count, 0);
  const totalRevenue = subscriptionData.reduce((sum, tier) => {
    const revenue = parseInt(tier.revenue.replace('$', '').replace(',', ''));
    return sum + revenue;
  }, 0);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subscription Analysis</h1>
          <p className="text-muted-foreground mt-2">
            User subscription tiers and revenue breakdown
          </p>
        </div>
        <Users className="h-12 w-12 text-primary" />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={totalUsers.toLocaleString()}
          change={{ value: 15.2, period: 'vs last month' }}
          icon={Users}
          variant="premium"
          description="All tiers"
        />
        
        <MetricCard
          title="Paid Subscribers"
          value={`${((paidUsers / totalUsers) * 100).toFixed(1)}%`}
          change={{ value: 8.3, period: 'vs last month' }}
          icon={Crown}
          variant="success"
          description={`${paidUsers.toLocaleString()} users`}
        />
        
        <MetricCard
          title="Monthly Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change={{ value: 23.7, period: 'vs last month' }}
          icon={TrendingUp}
          variant="premium"
          description="Recurring revenue"
        />
        
        <MetricCard
          title="Conversion Rate"
          value="66.2%"
          change={{ value: 5.1, period: 'vs last month' }}
          icon={UserCheck}
          description="Free to paid"
        />
      </div>

      {/* Subscription Pie Chart Visual */}
      <Card className="card-golf">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="h-5 w-5 mr-2 text-primary" />
            Subscription Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Visual Pie Chart Representation */}
            <div className="relative">
              <div className="w-64 h-64 mx-auto relative">
                {/* Pie chart simulation with stacked circles */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 opacity-90"></div>
                <div className="absolute inset-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 opacity-90"></div>
                <div className="absolute inset-8 rounded-full bg-gradient-to-r from-green-500 to-green-700 opacity-90"></div>
                <div className="absolute inset-12 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 opacity-90"></div>
                
                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
                    <div className="text-sm opacity-90">Total Users</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend and Details */}
            <div className="space-y-4">
              {subscriptionData.map((tier, index) => (
                <div key={tier.tier} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-golf">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${tier.color}`}></div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{tier.tier}</h3>
                        {tier.tier === 'Premium Pro' && (
                          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                            <Crown className="w-3 h-3 mr-1" />
                            Top Tier
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {tier.count.toLocaleString()} users • {tier.revenue}/mo
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {tier.percentage}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      of total users
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Comparison */}
      <Card className="card-golf">
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="h-5 w-5 mr-2 text-primary" />
            Tier Features & Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {subscriptionData.map((tier) => (
              <div key={tier.tier} className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{tier.tier}</h3>
                  <div className={`w-3 h-3 rounded-full ${tier.color}`}></div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="text-lg font-bold text-primary">
                    {tier.count.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tier.revenue} monthly
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Features:</h4>
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-xs text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-golf-green rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
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
            <CardTitle>Revenue Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Premium Pro users generate 67% of total revenue despite being 28.5% of paid users</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Strong conversion rate from Free to Premium tier (66.2%)</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Basic tier shows potential for upselling to Premium</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="card-golf">
          <CardHeader>
            <CardTitle>Growth Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Upsell Basic Users</h4>
                <p className="text-xs text-muted-foreground">
                  Target Basic tier with Premium features trial
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Free User Conversion</h4>
                <p className="text-xs text-muted-foreground">
                  1,475 free users represent significant revenue potential
                </p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Premium Pro Expansion</h4>
                <p className="text-xs text-muted-foreground">
                  Add enterprise features for golf instructors and academies
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};