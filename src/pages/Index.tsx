import React, { useState } from 'react';
import { LoginPage } from '@/components/auth/LoginPage';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, BarChart3, Users, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { isAuthenticated, isLoading, login, logout } = useAuth();
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (data: { email: string; password: string; rememberMe: boolean }) => {
    setLoginLoading(true);
    const result = await login(data.email, data.password, data.rememberMe);
    setLoginLoading(false);
    return result;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <DashboardLayout onLogout={logout}>
      <div className="space-y-8 animate-fade-in-up">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center mb-6">
            <Trophy className="h-16 w-16 text-primary mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">Welcome to GolfPro Analytics</h1>
              <p className="text-xl text-muted-foreground mt-2">
                Elevate your golf game with comprehensive data insights
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-golf-premium">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4,370</div>
              <p className="text-xs text-muted-foreground">
                +15.2% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-golf-premium">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Shots</CardTitle>
              <Target className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142,845</div>
              <p className="text-xs text-muted-foreground">
                +23.7% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-golf-premium">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
              <BarChart3 className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32.5 min</div>
              <p className="text-xs text-muted-foreground">
                +8.3% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/sessions/avg_session_duration">
            <Card className="card-golf hover:shadow-glow transition-golf cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Session Analytics</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-golf" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Analyze session duration, frequency, and user engagement patterns
                </p>
                <div className="flex items-center text-primary font-medium">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Details
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/shots/most_used_clubs">
            <Card className="card-golf hover:shadow-glow transition-golf cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Shot Analysis</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-golf" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Explore club usage, performance metrics, and shot analytics
                </p>
                <div className="flex items-center text-primary font-medium">
                  <Target className="h-4 w-4 mr-2" />
                  View Details
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/users/subscribed_percentage">
            <Card className="card-golf hover:shadow-glow transition-golf cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>User Insights</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-golf" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Monitor subscription rates, demographics, and user behavior
                </p>
                <div className="flex items-center text-primary font-medium">
                  <Users className="h-4 w-4 mr-2" />
                  View Details
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Feature Highlights */}
        <Card className="card-golf">
          <CardHeader>
            <CardTitle>Platform Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-golf-green rounded-full mr-3"></div>
                    Real-time session tracking and analysis
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-golf-gold rounded-full mr-3"></div>
                    Comprehensive club performance metrics
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    User engagement and subscription insights
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Performance Insights</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                    Advanced data visualization and reporting
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-secondary rounded-full mr-3"></div>
                    Personalized recommendations and coaching
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-golf-fairway rounded-full mr-3"></div>
                    Progress tracking and goal setting
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Index;
