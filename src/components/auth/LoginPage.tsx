import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Trophy, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import golfHero from '@/assets/golf-hero.jpg';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(false),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginPageProps {
  onLogin: (data: LoginForm) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const rememberMe = watch('rememberMe');

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      onLogin(data);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged into Golf Analytics.",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Hero Section */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${golfHero})` }}
        />
        <div className="absolute inset-0 gradient-hero" />
        
        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="animate-fade-in-up">
            <div className="flex items-center mb-8">
              <Trophy className="h-12 w-12 text-accent mr-4" />
              <h1 className="text-4xl font-bold">GolfPro Analytics</h1>
            </div>
            
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Elevate Your Game<br />
              <span className="text-accent">with Data</span>
            </h2>
            
            <p className="text-xl mb-8 opacity-90 max-w-md">
              Transform your golf performance with comprehensive analytics, 
              detailed insights, and personalized recommendations.
            </p>
            
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-accent mr-2" />
                <span className="text-lg font-medium">Performance Tracking</span>
              </div>
              <div className="flex items-center">
                <Trophy className="h-6 w-6 text-accent mr-2" />
                <span className="text-lg font-medium">Club Analytics</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Golf Ball Animation */}
        <div className="absolute bottom-20 right-20">
          <div className="w-8 h-8 bg-white rounded-full animate-golf-bounce shadow-glow"></div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="h-10 w-10 text-primary mr-3" />
              <h1 className="text-3xl font-bold text-primary">GolfPro Analytics</h1>
            </div>
          </div>

          <div className="glass rounded-2xl p-8 shadow-golf">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
              <p className="text-muted-foreground">Sign in to your golf analytics dashboard</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 transition-golf focus:ring-2 focus:ring-primary"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="h-12 pr-12 transition-golf focus:ring-2 focus:ring-primary"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-golf"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setValue('rememberMe', checked as boolean)}
                  />
                  <Label htmlFor="rememberMe" className="text-sm cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary-hover transition-golf font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold btn-golf-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button className="text-primary hover:text-primary-hover font-medium transition-golf">
                  Contact your administrator
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};