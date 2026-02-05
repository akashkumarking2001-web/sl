import {
  Users,
  UserCheck,
  UserX,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Package,
  CheckSquare,
  BookOpen,
  Settings,
  AlertCircle,
  MessageSquare
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  totalWallet: number;
  totalIncome: number;
  referralIncome: number;
  levelIncome: number;
  globalIncome: number;
  taskIncome: number;
  revenueShareIncome: number;
  spilloverIncome: number;
  totalWithdrawal: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  pendingTasks: number;
  unreadMessages: number;
  pendingPackages: number;
  pendingCourseRequests: number;
  recentIncome: any[];
}

interface AdminDashboardProps {
  stats: DashboardStats;
  onNavigate: (tab: string) => void;
  siteSettings: { is_shopping_enabled: boolean };
  onSettingsUpdate: (settings: any) => void;
}

const AdminDashboard = ({ stats, onNavigate, siteSettings, onSettingsUpdate }: AdminDashboardProps) => {
  const { toast } = useToast();

  const toggleShopping = async (enabled: boolean) => {
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({ is_shopping_enabled: enabled })
        .eq("id", "global");

      if (error) throw error;

      onSettingsUpdate({ ...siteSettings, is_shopping_enabled: enabled });
      toast({
        title: enabled ? "Store Enabled" : "Store Disabled",
        description: enabled ? "Users can now access the shopping page." : "Users will see a 'Coming Soon' screen."
      });
    } catch (err: any) {
      toast({ title: "Operation failed", description: err.message, variant: "destructive" });
    }
  };
  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Active Students",
      value: stats.activeStudents,
      icon: UserCheck,
      color: "from-emerald-500 to-emerald-600",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Inactive Students",
      value: stats.inactiveStudents,
      icon: UserX,
      color: "from-amber-500 to-amber-600",
      trend: "-5%",
      trendUp: false,
    },
    {
      title: "Total Wallet",
      value: `₹${stats.totalWallet.toLocaleString()}`,
      icon: Wallet,
      color: "from-purple-500 to-purple-600",
      trend: "+15%",
      trendUp: true,
    },
    {
      title: "Total Income",
      value: `₹${stats.totalIncome.toLocaleString()}`,
      icon: TrendingUp,
      color: "from-primary to-gold-dark",
      trend: "+22%",
      trendUp: true,
    },
    {
      title: "Total Withdrawal",
      value: `₹${stats.totalWithdrawal.toLocaleString()}`,
      icon: ArrowUpRight,
      color: "from-rose-500 to-rose-600",
      trend: "+10%",
      trendUp: true,
    },
  ];

  const pendingActions = [
    {
      title: "Package Requests",
      count: stats.pendingPackages,
      icon: Package,
      tab: "package-requests",
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      title: "Course Requests",
      count: stats.pendingCourseRequests,
      icon: BookOpen,
      tab: "course-requests",
      color: "text-purple-500 bg-purple-500/10",
    },
    {
      title: "Deposit Requests",
      count: stats.pendingDeposits,
      icon: ArrowDownRight,
      tab: "deposit-requests",
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      title: "Withdrawal Requests",
      count: stats.pendingWithdrawals,
      icon: ArrowUpRight,
      tab: "withdrawal-requests",
      color: "text-amber-500 bg-amber-500/10",
    },
    {
      title: "Task Verification",
      count: stats.pendingTasks,
      icon: CheckSquare,
      tab: "task-verification",
      color: "text-primary bg-primary/10",
    },
    {
      title: "Unread Messages",
      count: stats.unreadMessages,
      icon: MessageSquare,
      tab: "messages",
      color: "text-rose-500 bg-rose-500/10",
    },
  ];

  const distributionStats = [
    { title: "Referral Income", value: stats.referralIncome, color: "text-emerald-500" },
    { title: "Level Income", value: stats.levelIncome, color: "text-blue-500" },
    { title: "Task Income", value: stats.taskIncome, color: "text-amber-500" },
    { title: "Revenue Share", value: stats.revenueShareIncome, color: "text-purple-500" },
    { title: "Spillover Income", value: stats.spilloverIncome, color: "text-rose-500" },
    { title: "Global Revenue", value: stats.globalIncome, color: "text-cyan-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 glass-card p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10">
          <h1 className="text-2xl font-bold font-display mb-2 flex items-center gap-2">
            Welcome to <span className="text-gradient-gold">Skill Learners</span> Admin
          </h1>
          <p className="text-muted-foreground">
            Manage your platform, students, courses, and transactions from here.
          </p>
        </div>

        <div className="w-full md:w-72 glass-card p-6 rounded-2xl border-2 border-primary/20 bg-primary/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm">Platform Controls</h3>
            </div>
            <Badge variant="outline" className="text-[10px] bg-primary/10">LIVE</Badge>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50">
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-tight">Shopping Mode</span>
                <span className="text-[10px] text-muted-foreground">Enable/Disable Store</span>
              </div>
              <Switch
                checked={siteSettings.is_shopping_enabled}
                onCheckedChange={toggleShopping}
              />
            </div>

            {!siteSettings.is_shopping_enabled && (
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="text-[9px] font-bold text-amber-500 leading-tight">Store is currently offline for users.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="glass-card p-5 rounded-2xl hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center", stat.color)}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                stat.trendUp ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
              )}>
                {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-2xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Distribution Summary */}
      <div className="glass-card p-6 rounded-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        <h2 className="text-lg font-bold font-display mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          Earnings Distribution Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {distributionStats.map((item, i) => (
            <div key={i} className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.title}</p>
              <p className={cn("text-xl font-black", item.color)}>₹{item.value.toLocaleString()}</p>
              <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn("h-full bg-current opacity-30", item.color)}
                  style={{ width: `${Math.min(100, (item.value / (stats.totalIncome || 1)) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Actions */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-display flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Pending Actions
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {pendingActions.map((action, i) => (
            <button
              key={i}
              onClick={() => onNavigate(action.tab)}
              className="p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-center group"
            >
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2", action.color)}>
                <action.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold group-hover:text-primary transition-colors">
                {action.count}
              </p>
              <p className="text-xs text-muted-foreground">{action.title}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6 rounded-2xl">
        <h2 className="text-lg font-bold font-display mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => onNavigate("create-task")}>
            Create New Task
          </Button>
          <Button variant="outline" onClick={() => onNavigate("courses")}>
            Add New Course
          </Button>
          <Button variant="outline" onClick={() => onNavigate("products")}>
            Add Product
          </Button>
          <Button variant="outline" onClick={() => onNavigate("ads")}>
            Post New Ad
          </Button>
          <Button variant="outline" onClick={() => onNavigate("payment-settings")}>
            Update Payment Info
          </Button>
        </div>
      </div>

      {/* Detailed Income History Log */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold font-display flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Detailed Income History
          </h2>
          <Button variant="ghost" size="sm" onClick={() => onNavigate("wallet-history")}>
            View All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-b border-white/5">
                <th className="text-left py-3 px-4 font-black uppercase tracking-widest text-[10px]">Reference</th>
                <th className="text-left py-3 px-4 font-black uppercase tracking-widest text-[10px]">User Identifier</th>
                <th className="text-left py-3 px-4 font-black uppercase tracking-widest text-[10px]">Type</th>
                <th className="text-right py-3 px-4 font-black uppercase tracking-widest text-[10px]">Amount</th>
                <th className="text-right py-3 px-4 font-black uppercase tracking-widest text-[10px]">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {stats.recentIncome.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500 italic">
                    No recent payment activity detected.
                  </td>
                </tr>
              ) : (
                stats.recentIncome.map((income, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4 px-4">
                      <p className="font-mono text-[10px] text-slate-400">#{income.id.slice(0, 8)}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-white font-bold">{income.profiles?.full_name || 'Legacy User'}</span>
                        <span className="text-[10px] text-slate-500">{income.profiles?.email || 'ID: ' + income.id.slice(0, 5)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 text-[10px] uppercase font-bold">
                        {income.income_type || 'Credit'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-emerald-500 font-black">
                        +₹{income.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex flex-col">
                        <span className="text-slate-300 font-bold">{new Date(income.created_at).toLocaleDateString()}</span>
                        <span className="text-[10px] text-slate-500">{new Date(income.created_at).toLocaleTimeString()}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
