import React, { useState } from 'react';
import AffiliateSidebar from '@/components/layout/AffiliateSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  IndianRupee, 
  Target, 
  BarChart3,
  Calendar,
  Download,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

// Mock data for charts
const revenueData = [
  { date: 'Mon', earnings: 1200, referrals: 3 },
  { date: 'Tue', earnings: 1800, referrals: 5 },
  { date: 'Wed', earnings: 1400, referrals: 2 },
  { date: 'Thu', earnings: 2400, referrals: 6 },
  { date: 'Fri', earnings: 2100, referrals: 4 },
  { date: 'Sat', earnings: 3200, referrals: 8 },
  { date: 'Sun', earnings: 2800, referrals: 5 },
];

const monthlyRevenueData = [
  { month: 'Jan', earnings: 12000 },
  { month: 'Feb', earnings: 18000 },
  { month: 'Mar', earnings: 24000 },
  { month: 'Apr', earnings: 21000 },
  { month: 'May', earnings: 32000 },
  { month: 'Jun', earnings: 28000 },
];

const courseCompletionData = [
  { name: 'Completed', value: 65, color: 'hsl(var(--primary))' },
  { name: 'In Progress', value: 25, color: 'hsl(var(--accent))' },
  { name: 'Not Started', value: 10, color: 'hsl(var(--muted))' },
];

const referralFunnelData = [
  { stage: 'Link Clicks', value: 1250, color: 'hsl(var(--primary))' },
  { stage: 'Sign Ups', value: 320, color: 'hsl(var(--accent))' },
  { stage: 'Purchases', value: 85, color: 'hsl(152 65% 42%)' },
];

type TimeRange = '7d' | '30d' | '90d' | '1y';

const AnalyticsPage: React.FC = () => {
  const { profile } = useAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  const stats = [
    {
      title: 'Total Earnings',
      value: '₹45,250',
      change: '+12.5%',
      trend: 'up',
      icon: IndianRupee,
      color: 'text-primary'
    },
    {
      title: 'Active Referrals',
      value: '128',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-accent'
    },
    {
      title: 'Conversion Rate',
      value: '6.8%',
      change: '-0.5%',
      trend: 'down',
      icon: Target,
      color: 'text-emerald-500'
    },
    {
      title: 'Avg. Order Value',
      value: '₹2,499',
      change: '+3.1%',
      trend: 'up',
      icon: BarChart3,
      color: 'text-violet-500'
    },
  ];

  const timeRanges: { label: string; value: TimeRange }[] = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
    { label: '1 Year', value: '1y' },
  ];

  return (
    <AffiliateSidebar>
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Analytics</h1>
            </div>
            <p className="text-muted-foreground">
              Track your performance, earnings, and referral metrics
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
              {timeRanges.map((range) => (
                <Button
                  key={range.value}
                  variant={timeRange === range.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeRange(range.value)}
                  className={cn(
                    "text-xs",
                    timeRange === range.value && "bg-primary text-primary-foreground"
                  )}
                >
                  {range.label}
                </Button>
              ))}
            </div>
            
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card 
              key={stat.title} 
              className="glass-card border-border/50 overflow-hidden group hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={cn(
                        "text-sm font-medium",
                        stat.trend === 'up' ? "text-emerald-500" : "text-red-500"
                      )}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground">vs last period</span>
                    </div>
                  </div>
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                    "bg-gradient-to-br from-primary/10 to-accent/10"
                  )}>
                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Trend Chart */}
          <Card className="lg:col-span-2 glass-card border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Revenue Trend</CardTitle>
                  <CardDescription>Your earnings over time</CardDescription>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="w-3 h-3" />
                  +18% growth
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeRange === '7d' ? revenueData : monthlyRevenueData}>
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey={timeRange === '7d' ? "date" : "month"} 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `₹${value / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Earnings']}
                    />
                    <Area
                      type="monotone"
                      dataKey="earnings"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorEarnings)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Course Completion Pie Chart */}
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Course Completion</CardTitle>
              <CardDescription>Referral course progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={courseCompletionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {courseCompletionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value}%`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {courseCompletionData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Row Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Referral Funnel */}
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Referral Funnel</CardTitle>
              <CardDescription>Conversion through stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={referralFunnelData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      type="number" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      dataKey="stage" 
                      type="category" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {referralFunnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Daily Activity */}
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Daily Referrals</CardTitle>
              <CardDescription>New referrals per day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar 
                      dataKey="referrals" 
                      fill="hsl(var(--accent))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Insights */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Quick Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <div className="flex items-center gap-3 mb-2">
                  <ArrowUpRight className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">Best Day</span>
                </div>
                <p className="text-sm text-muted-foreground">Saturday generates 35% more referrals</p>
              </div>
              
              <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-accent" />
                  <span className="font-semibold text-foreground">Top Package</span>
                </div>
                <p className="text-sm text-muted-foreground">Gold package has highest conversion</p>
              </div>
              
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-5 h-5 text-emerald-500" />
                  <span className="font-semibold text-foreground">Goal Progress</span>
                </div>
                <p className="text-sm text-muted-foreground">You're 68% to your monthly goal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AffiliateSidebar>
  );
};

export default AnalyticsPage;
