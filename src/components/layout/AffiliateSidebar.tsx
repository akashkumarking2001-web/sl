import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Wallet,
  Trophy,
  ClipboardList,
  User,
  TrendingUp,
  Layers,
  PieChart,
  CheckSquare,
  Zap,
  ArrowDownRight,
  Crown,
  ChevronRight,
  X,
  Menu,
  BookOpen,
  GitBranch
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const menuSections = [
  {
    label: "Main",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/affiliate", description: "Overview & stats" },
    ]
  },
  {
    label: "Affiliate Portal",
    items: [
      { icon: Users, label: "Learners/Students", href: "/dashboard/learners", description: "Your referred users" },
      { icon: GitBranch, label: "My Network", href: "/dashboard/network", description: "Genealogy Tree" },
      { icon: Layers, label: "Global Matrix", href: "/dashboard/matrix", description: "3xN Revenue Share" },
    ]
  },
  {
    label: "Income & Reports",
    isExpandable: true,
    items: [
      { icon: TrendingUp, label: "Direct Referral", href: "/dashboard/income/referral" },
      { icon: Layers, label: "Level Income", href: "/dashboard/income/level" },
      { icon: ArrowDownRight, label: "Spillover", href: "/dashboard/income/spillover" },
      { icon: PieChart, label: "Revenue Share", href: "/dashboard/income/revenue" },
      { icon: CheckSquare, label: "Task Income", href: "/dashboard/income/task" },
      { icon: Zap, label: "Auto Upgrade", href: "/dashboard/income/auto-upgrade" },
      { icon: Crown, label: "Royal Bonus", href: "/dashboard/income/royal" },
    ]
  },
  {
    label: "Earnings & Analytics",
    items: [
      { icon: Wallet, label: "Wallet Management", href: "/dashboard/wallet", description: "Withdraw & history" },
      { icon: Trophy, label: "Leaderboard", href: "/dashboard/leaderboard", description: "Top earners" },
      { icon: PieChart, label: "Analytics", href: "/dashboard/analytics", description: "Performance insights" },
    ]
  },
  {
    label: "Resources & More",
    items: [
      { icon: ClipboardList, label: "Tasks", href: "/dashboard/tasks", description: "Earn by completing" },
      { icon: BookOpen, label: "Submit Your Course", href: "/dashboard/submit-course", description: "Become a creator" },
      { icon: User, label: "Profile", href: "/dashboard/profile", description: "Manage account" },
    ]
  }
];

interface AffiliateSidebarProps {
  children: React.ReactNode;
}

const AffiliateSidebar = ({ children }: AffiliateSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("Income Reports");
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;
  const isIncomeActive = () => location.pathname.includes("/dashboard/income/");

  const { user } = useAuth();
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    const fetchTotalEarnings = async () => {
      if (!user?.id) return;
      try {
        const { data } = await supabase
          .from("agent_income" as any)
          .select("amount")
          .eq("agent_id", user.id);

        const earnings = (data as any[] || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
        setTotalEarnings(earnings);
      } catch (err) {
        console.error("Error fetching sidebar earnings:", err);
      }
    };

    fetchTotalEarnings();
  }, [user?.id]);
  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-72 bg-card/95 backdrop-blur-xl border-r border-border z-50
        transform transition-transform duration-300 ease-in-out overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Skill Learners" className="h-10 w-auto" />
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-4">
          {menuSections.map((section, sIndex) => (
            <div key={sIndex} className="space-y-1">
              {sIndex > 0 && <div className="h-px bg-slate-100 dark:bg-slate-800 my-4 mx-2" />}

              <div className="space-y-1">
                {section.isExpandable ? (
                  <div className="space-y-1">
                    <button
                      onClick={() => setExpandedSection(expandedSection === section.label ? null : section.label)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isIncomeActive() ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
                    >
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-4 h-4" />
                        <span>View Details</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${expandedSection === section.label ? 'rotate-90' : ''}`} />
                    </button>

                    {expandedSection === section.label && (
                      <div className="mt-1 ml-3 space-y-1 border-l border-border pl-3">
                        {section.items.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${isActive(item.href)
                              ? 'bg-[#FBBF24] text-black font-bold shadow-lg shadow-[#FBBF24]/20'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                              }`}
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  section.items.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive(item.href)
                        ? 'bg-[#FBBF24] text-black font-bold shadow-lg shadow-[#FBBF24]/20'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <div className="flex-1">
                        <span className="block">{item.label}</span>
                        {item.description && (
                          <span className={`text-[10px] block leading-tight ${isActive(item.href) ? 'text-black/60' : 'text-muted-foreground'}`}>
                            {item.description}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="p-4 mt-auto border-t border-border">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">Total Earnings</p>
            <p className="text-2xl font-black text-black">₹{totalEarnings.toLocaleString()}</p>
            <Button variant="outline" size="sm" className="w-full mt-3" asChild>
              <Link to="/dashboard/wallet">Withdraw Now</Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <Link to="/">
              <img src={logo} alt="Skill Learners" className="h-8 w-auto" />
            </Link>
            <Link to="/dashboard/profile">
              <div className="w-8 h-8 rounded-full bg-[#FBBF24] flex items-center justify-center">
                <span className="text-sm font-bold text-black">J</span>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AffiliateSidebar;
