import { useState, useEffect } from "react";
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { 
  TrendingUp, BookOpen, Users, Wallet, Target, Award, 
  ArrowUpRight, ArrowDownRight, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressDashboardProps {
  hasPurchased: boolean;
  purchasedPlan: string;
}

const ProgressDashboard = ({ hasPurchased, purchasedPlan }: ProgressDashboardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Sample data - in real app this would come from API
  const courseProgress = [
    { name: "Week 1", progress: 100, target: 100 },
    { name: "Week 2", progress: 85, target: 100 },
    { name: "Week 3", progress: 60, target: 100 },
    { name: "Week 4", progress: 30, target: 100 },
  ];

  const earningsData = [
    { month: "Jan", earnings: 0, referrals: 0 },
    { month: "Feb", earnings: 500, referrals: 2 },
    { month: "Mar", earnings: 1200, referrals: 5 },
    { month: "Apr", earnings: 800, referrals: 3 },
    { month: "May", earnings: 2100, referrals: 8 },
    { month: "Jun", earnings: 1800, referrals: 6 },
  ];

  const referralStats = [
    { name: "Active", value: 12, color: "hsl(var(--primary))" },
    { name: "Pending", value: 5, color: "hsl(var(--accent))" },
    { name: "Converted", value: 8, color: "hsl(142, 76%, 36%)" },
  ];

  const stats = [
    { 
      label: "Course Progress", 
      value: "68%", 
      change: "+12%", 
      positive: true,
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500"
    },
    { 
      label: "Total Earnings", 
      value: "₹6,400", 
      change: "+24%", 
      positive: true,
      icon: Wallet,
      color: "from-emerald-500 to-teal-500"
    },
    { 
      label: "Active Referrals", 
      value: "12", 
      change: "+3", 
      positive: true,
      icon: Users,
      color: "from-violet-500 to-purple-500"
    },
    { 
      label: "Rank", 
      value: "#45", 
      change: "+8", 
      positive: true,
      icon: Award,
      color: "from-amber-500 to-orange-500"
    },
  ];

  // Animate progress on mount
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setAnimatedProgress(68);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (!hasPurchased) {
    return (
      <div className="glass-card p-6 rounded-2xl border-2 border-dashed border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Target className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Unlock Your Progress Dashboard</h3>
            <p className="text-sm text-muted-foreground">
              Purchase any plan to track your course progress, earnings, and referral stats with beautiful charts.
            </p>
          </div>
          <Sparkles className="w-8 h-8 text-primary/40" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Progress Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">Track your learning journey and earnings</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          {purchasedPlan}
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={stat.label}
            className={cn(
              "glass-card p-4 rounded-xl transition-all duration-500",
              isAnimating && "animate-fade-in"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
                stat.positive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
              )}>
                {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-bold mb-0.5">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Course Progress Chart */}
        <div className="glass-card p-5 rounded-2xl">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Weekly Course Progress
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseProgress} barSize={30}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="progress" 
                  fill="url(#progressGradient)" 
                  radius={[6, 6, 0, 0]}
                  animationDuration={1500}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Earnings Chart */}
        <div className="glass-card p-5 rounded-2xl">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-500" />
            Earnings Overview
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`₹${value}`, 'Earnings']}
                />
                <defs>
                  <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="hsl(142, 76%, 36%)" 
                  strokeWidth={2}
                  fill="url(#earningsGradient)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Referral Stats */}
      <div className="glass-card p-5 rounded-2xl">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-violet-500" />
          Referral Breakdown
        </h3>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={referralStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {referralStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-4">
            {referralStats.map((stat) => (
              <div key={stat.name} className="text-center">
                <div 
                  className="w-3 h-3 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: stat.color }}
                />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Ring */}
      <div className="glass-card p-5 rounded-2xl">
        <div className="flex items-center gap-6">
          {/* Circular Progress */}
          <div className="relative w-24 h-24">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#ringGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${animatedProgress * 2.51} 251`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold">{animatedProgress}%</span>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Overall Progress</h3>
            <p className="text-sm text-muted-foreground mb-3">
              You're doing great! Keep up the momentum to reach your goals.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">Completed: 9 lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                <span className="text-muted-foreground">Remaining: 4 lessons</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
