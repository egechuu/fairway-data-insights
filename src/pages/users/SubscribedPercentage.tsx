import React, { useEffect, useState } from 'react';
import { Users, Crown } from 'lucide-react';
import { MetricCard } from '@/components/charts/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

type SubscriptionPlan = {
  plan: string;
  count: number;
  percentage: number;
  color: string;
};

export const SubscribedPercentage = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function getColorByPlan(plan: string): string {
    switch (plan) {
      case 'ONE YEAR SUBSCRIPTION':
        return '#f59e0b'; // amber-500
      case 'SIX MONTH PROMO':
        return '#3b82f6'; // blue-500
      case 'LIFETIME':
        return '#10b981'; // green-500
      case 'ONE YEAR TO LIFETIME UPGRADE':
        return '#6b7280'; // gray-500
      case 'THREE MONTH PROMO':
        return '#8b5cf6'; // purple-500
      case 'ONE MONTH PROMO':
        return '#ec4899'; // pink-500
      default:
        return '#6b7280'; // gray-500 fallback
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('golf_auth_token');
        const res = await fetch('/api/users/subscribed_percentage', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('Failed to fetch metrics');
        const data = await res.json();
        console.log("Fetched subscription data:", data);

        const parsedplans: SubscriptionPlan[] = data.plan.map(
          (planName: string, index: number) => ({
            plan: planName,
            count: parseInt(data.plan_count[index]) || 0,
            percentage: parseFloat(data.percentage[index]) || 0,
            color: getColorByPlan(planName),
          })
        );

        setPlans(parsedplans);
        console.log("Parsed subscription plans:", parsedplans);
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalUsers = plans.reduce((sum, data) => sum + data.count, 0);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Subscription Analysis</h1>
          <p className="text-muted-foreground mt-2">Comprehensive view of user subscription plans and distribution</p>
        </div>
        <div className="flex-shrink-0">
          <Users className="h-12 w-12 text-primary" />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={totalUsers.toLocaleString()}
          icon={Users}
          variant="premium"
          description="All plans"
        />
      </div>

      {/* Subscription Distribution */}
      <Card className="card-golf">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="h-5 w-5 mr-2 text-primary" />
            Subscription Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pie Chart */}
            <div className="flex flex-col items-center justify-center">
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={plans}
                      dataKey="count"
                      nameKey="plan"
                      cx="50%"
                      cy="45%"
                      outerRadius={100}
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {plans.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [value.toLocaleString(), 'Users']}
                      labelFormatter={(label) => `Plan: ${label}`}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      align="center"
                      wrapperStyle={{ 
                        paddingTop: '20px',
                        fontSize: '12px',
                        textAlign: 'center'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Plan Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Plan Details</h3>
              {plans.map((plan) => (
                <div
                  key={plan.plan}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: plan.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-foreground truncate">{plan.plan}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {plan.count.toLocaleString()} users
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-bold text-primary">{plan.percentage.toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">of total</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-golf">
          <CardHeader>
            <CardTitle className="text-foreground">Revenue Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-foreground leading-relaxed">
                  Premium Pro users generate 67% of total revenue despite being 28.5% of paid users
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-foreground leading-relaxed">
                  Strong conversion rate from Free to Premium plan (66.2%)
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-foreground leading-relaxed">
                  Basic plan shows potential for upselling to Premium
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="card-golf">
          <CardHeader>
            <CardTitle className="text-foreground">Growth Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium text-sm mb-2 text-foreground">Upsell Basic Users</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Target Basic plan with Premium features trial
                </p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-sm mb-2 text-foreground">Free User Conversion</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  1,475 free users represent significant revenue potential
                </p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <h4 className="font-medium text-sm mb-2 text-foreground">Premium Pro Expansion</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
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
