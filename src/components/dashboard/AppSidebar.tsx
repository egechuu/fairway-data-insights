import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Clock,
  Target,
  Users,
  ChevronDown,
  ChevronRight,
  Activity,
  Zap,
  TrendingUp,
  UserCheck,
  Percent,
  Globe,
  Calendar,
  Timer
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
  SidebarHeader,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const navigationItems = [
  {
    title: 'Sessions',
    icon: Clock,
    items: [
      {
        title: 'Avg Session Duration',
        url: '/sessions/avg_session_duration',
        icon: Timer,
      },
      {
        title: 'Avg Session Frequency',
        url: '/sessions/avg_session_frequency',
        icon: Calendar,
      },
      {
        title: 'Daily Sessions',
        url: '/sessions/daily_session',
        icon: TrendingUp,
      },
      {
        title: 'Weekly Sessions',
        url: '/sessions/weekly_session',
        icon: BarChart3,
      },
    ],
  },
  {
    title: 'Shots',
    icon: Target,
    items: [
      // {
      //   title: 'Most Used Clubs',
      //   url: '/shots/most_used_clubs',
      //   icon: Trophy,
      // },
      {
        title: 'Total Shots',
        url: '/shots/total_shots',
        icon: Activity,
      },
      {
        title: 'Club Performance',
        url: '/shots/club_performance',
        icon: Zap,
      },
      {
        title: 'Premium User Performance',
        url: '/shots/premium_user_performance',
        icon: TrendingUp,
      },
    ],
  },
  {
    title: 'Users',
    icon: Users,
    items: [
      {
        title: 'Subscribed Percentage',
        url: '/users/subscribed_percentage',
        icon: Percent,
      },
      {
        title: 'Drop Off Rate (All)',
        url: '/users/drop_off_rate_all',
        icon: UserCheck,
      },
      {
        title: 'Drop Off Rate (Sub)',
        url: '/users/drop_off_rate_sub',
        icon: UserCheck,
      },
      {
        title: 'Comparison by Country',
        url: '/users/comparison_country',
        icon: Globe,
      },
      {
        title: 'Comparison by Gender',
        url: '/users/comparison_gender',
        icon: Users,
      },
      {
        title: 'Comparison by Age',
        url: '/users/comparison_age',
        icon: BarChart3,
      },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isGroupActive = (items: { url: string }[]) => 
    items.some(item => isActive(item.url));

  const getNavClassName = (active: boolean) =>
    active 
      ? "bg-primary text-primary-foreground font-medium shadow-golf" 
      : "hover:bg-muted/50 transition-golf";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-border p-6">
        {!collapsed && (
          <div className="flex items-center animate-fade-in-up">
            <Target className="h-8 w-8 text-primary mr-3" />
            <div>
              <h1 className="text-xl font-bold text-primary">GolfPro</h1>
              <p className="text-xs text-muted-foreground">Analytics Dashboard</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <Target className="h-8 w-8 text-primary" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {navigationItems.map((section) => (
          <SidebarGroup key={section.title}>
            <Collapsible 
              defaultOpen={isGroupActive(section.items)}
              className="group/collapsible"
            >
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full items-center justify-between p-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-golf">
                  <div className="flex items-center">
                    <section.icon className="h-4 w-4 mr-2" />
                    {!collapsed && <span>{section.title}</span>}
                  </div>
                  {!collapsed && (
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  )}
                </CollapsibleTrigger>
              </SidebarGroupLabel>

              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton asChild>
                          <NavLink
                            to={item.url}
                            className={getNavClassName(isActive(item.url))}
                          >
                            <item.icon className="h-4 w-4 mr-2" />
                            {!collapsed && (
                              <span className="animate-slide-in-right">{item.title}</span>
                            )}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}