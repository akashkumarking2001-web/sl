import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Loader2, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import AdminSidebar from "@/components/admin/skilllearners/AdminSidebar";
import AdminDashboard from "@/components/admin/skilllearners/AdminDashboard";
import UserListTable from "@/components/admin/skilllearners/UserListTable";
import UserActions from "@/components/admin/skilllearners/UserActions";
import PaymentSettings from "@/components/admin/skilllearners/PaymentSettings";
import CourseRequestsApproval from "@/components/admin/skilllearners/CourseRequestsApproval";
import IncomeManagement from "@/components/admin/moneyworld/IncomeManagement";
import WalletManagement from "@/components/admin/moneyworld/WalletManagement";
import TaskManagement from "@/components/admin/moneyworld/TaskManagement";
import TaskCompletion from "@/components/admin/moneyworld/TaskCompletion";
import CoursesManagement from "@/components/admin/moneyworld/CoursesManagement";
import ProductsManagement from "@/components/admin/moneyworld/ProductsManagement";
import ShoppingOrdersManagement from "@/components/admin/moneyworld/ShoppingOrdersManagement";
import AffiliateManagement from "@/components/admin/moneyworld/AffiliateManagement";
import AdsManagement from "@/components/admin/moneyworld/AdsManagement";
import BankDetailsView from "@/components/admin/moneyworld/BankDetailsView";
import MessagesManagement from "@/components/admin/moneyworld/MessagesManagement";
import AdminProfile from "@/components/admin/moneyworld/AdminProfile";
import PackagePurchaseApproval from "@/components/admin/moneyworld/PackagePurchaseApproval";
import { IncomeSettings } from "@/components/admin/skilllearners/IncomeSettings";
import IndexPageEditor from "@/components/admin/skilllearners/IndexPageEditor";
import AuditLogs from "@/components/admin/skilllearners/AuditLogs";
import PackagesManager from "@/pages/admin/PackagesManager";
import StoreManager from "@/pages/admin/StoreManager";
import ThemeToggle from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type TabType =
  | "dashboard"
  | "all-students"
  | "active-students"
  | "inactive-students"
  | "course-only-students"
  | "combo-plan-students"
  | "package-requests"
  | "package-requests"
  | "course-requests"
  | "affiliate-requests"
  | "income-settings"
  | "level-income"
  | "global-income"
  | "referral-income"
  | "spillover-income"
  | "revenue-share-income"
  | "other-income"
  | "deposit-requests"
  | "withdrawal-requests"
  | "wallet-history"
  | "adjust-balance"
  | "create-task"
  | "task-verification"
  | "courses"
  | "products"
  | "shopping-orders"
  | "ads"
  | "bank-details"
  | "messages"
  | "payment-settings"
  | "profile"
  | "block-student"
  | "delete-student"
  | "index-editor"
  | "delete-student"
  | "index-editor"
  | "audit-logs"
  | "packages-manager"
  | "store-manager";

interface Notification {
  id: string;
  type: "payment" | "withdrawal" | "task" | "message";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const SkillLearnersAdmin = () => {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    inactiveStudents: 0,
    totalWallet: 0,
    totalIncome: 0,
    referralIncome: 0,
    levelIncome: 0,
    globalIncome: 0,
    taskIncome: 0,
    revenueShareIncome: 0,
    spilloverIncome: 0,
    totalWithdrawal: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    pendingTasks: 0,
    unreadMessages: 0,
    pendingPackages: 0,
    pendingCourseRequests: 0,
    pendingShoppingOrders: 0,
    pendingAffiliateRequests: 0,
    recentIncome: [],
  });
  const [siteSettings, setSiteSettings] = useState<any>({ is_shopping_enabled: true });

  const { toast } = useToast();
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const addNotification = useCallback((type: Notification["type"], title: string, message: string) => {
    const newNotification: Notification = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev].slice(0, 50));

    toast({
      title,
      description: message,
    });
  }, [toast]);

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch site settings
      let fetchedSettingsData = null;
      try {
        const { data: settingsData, error: settingsError } = await supabase
          .from("site_settings")
          .select("*")
          .maybeSingle();

        if (settingsError) {
          if (settingsError.name !== 'AbortError' && !settingsError.message?.includes('aborted')) {
            console.error("Error fetching site settings:", settingsError);
          }
        } else if (settingsData) {
          fetchedSettingsData = settingsData;
        }
      } catch (err: any) {
        if (err.name !== 'AbortError' && !err.message?.includes('aborted')) {
          console.error("Settings fetch exception:", err);
        }
      }
      setSiteSettings(fetchedSettingsData || { id: 'default', is_shopping_enabled: true });

      // Fetch all profiles
      const { data: profiles, count: totalStudents } = await supabase
        .from("profiles")
        .select("*", { count: "exact" });

      const activeStudents = profiles?.filter(p => p.has_purchased === true).length || 0;
      const inactiveStudents = profiles?.filter(p => !p.has_purchased).length || 0;

      // Fetch wallet totals
      const { data: walletData } = await supabase
        .from("agent_income")
        .select("wallet, total_income");

      const totalWallet = walletData?.reduce((sum, w) => sum + Number(w.wallet || 0), 0) || 0;
      const totalIncome = walletData?.reduce((sum, w) => sum + Number(w.total_income || 0), 0) || 0;

      // Fetch income by type
      const { data: walletHistory } = await supabase
        .from("wallet_history")
        .select("id, amount, description, status, created_at, income_type, profiles(full_name, email)")
        .order('created_at', { ascending: false });

      // Make sure we show the income even if the profile is null
      const recentIncome = walletHistory?.filter(w => w.status === 'credit').slice(0, 5) || [];

      // Unified calculation logic
      const calculateIncome = (term: string, type: string) => {
        return walletHistory
          ?.filter(w => (w.income_type === type || w.description?.toLowerCase().includes(term)) && w.status === 'credit')
          .reduce((sum, w) => sum + Number(w.amount || 0), 0) || 0;
      };

      const referralIncome = calculateIncome('referral', 'referral');
      const levelIncome = calculateIncome('level', 'level');
      const globalIncome = calculateIncome('global', 'global');
      const taskIncome = calculateIncome('task', 'task');
      const revenueShareIncome = calculateIncome('revenue share', 'revenue_share');
      const spilloverIncome = calculateIncome('spillover', 'spillover');

      const totalWithdrawal = walletHistory
        ?.filter(w => w.status === 'debit')
        .reduce((sum, w) => sum + Number(w.amount || 0), 0) || 0;

      // Fetch pending counts
      const [
        { count: pendingDepositsRaw },
        { count: pendingPayments },
        { count: pendingWithdrawals },
        { count: pendingWhatsAppTasks },
        { count: pendingAppTasks },
        { count: unreadMessages },
        { count: pendingCourseRequests },
        { count: pendingShoppingOrders }
      ] = await Promise.all([
        supabase.from("payment_proofs").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("payments").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("withdrawal_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("completed_whatsapp_tasks").select("*", { count: "exact", head: true }).eq("payment_status", "pending"),
        supabase.from("completed_app_tasks").select("*", { count: "exact", head: true }).eq("payment_status", "pending"),
        supabase.from("messages").select("*", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("course_submissions").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("shopping_orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("affiliate_applications").select("*", { count: "exact", head: true }).eq("status", "pending")
      ]);

      setStats({
        totalStudents: totalStudents || 0,
        activeStudents,
        inactiveStudents,
        totalWallet,
        totalIncome,
        referralIncome,
        levelIncome,
        globalIncome,
        taskIncome,
        revenueShareIncome,
        spilloverIncome,
        totalWithdrawal,
        pendingDeposits: (pendingDepositsRaw || 0) + (pendingPayments || 0),
        pendingWithdrawals: pendingWithdrawals || 0,
        pendingTasks: (pendingWhatsAppTasks || 0) + (pendingAppTasks || 0),
        unreadMessages: unreadMessages || 0,
        pendingPackages: pendingPayments || 0, // Using unified payments table
        pendingCourseRequests: pendingCourseRequests || 0,
        pendingShoppingOrders: pendingShoppingOrders || 0,
        pendingAffiliateRequests: (await supabase.from("affiliate_applications").select("*", { count: "exact", head: true }).eq("status", "pending")).count || 0,
        recentIncome: recentIncome || [],
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
    setLoading(false);
  }, [supabase]);

  // Check admin access
  useEffect(() => {
    const checkAdminAccess = async () => {
      // Don't act until auth is definitely loaded
      if (authLoading) return;

      if (!user) {
        // Double check session manually just in case
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.warn("Admin: No session found, redirecting...");
          navigate("/admin-login");
          return;
        }
      }

      // 1. HARDCODED MASTER ADMIN BYPASS
      if (user?.email === "admin@ascendacademy.com") {
        setIsAdmin(true);
        fetchStats();
        return;
      }

      // 2. Check for Role in Profile
      if (profile?.role === "admin") {
        setIsAdmin(true);
        fetchStats();
      } else if (profile) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
        navigate("/user-home");
      }
    };

    checkAdminAccess();
  }, [user, profile, authLoading, navigate, toast, fetchStats]);

  // Real-time subscriptions
  useEffect(() => {
    if (!isAdmin) return;

    const paymentsChannel = supabase
      .channel("admin-payments")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "payment_proofs" },
        (payload) => {
          addNotification("payment", "New Deposit Request", `New deposit of ₹${payload.new.amount} received`);
          fetchStats();
        }
      )
      .subscribe();

    const withdrawalsChannel = supabase
      .channel("admin-withdrawals")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "withdrawal_requests" },
        (payload) => {
          addNotification("withdrawal", "New Withdrawal Request", `Withdrawal of ₹${payload.new.amount} requested`);
          fetchStats();
        }
      )
      .subscribe();

    const messagesChannel = supabase
      .channel("admin-messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          addNotification("message", "New Message", `New message from ${payload.new.name}`);
          fetchStats();
        }
      )
      .subscribe();

    const packagesChannel = supabase
      .channel("admin-packages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "package_purchase_requests" },
        (payload) => {
          addNotification("payment", "New Package Request", `New ${payload.new.package_name} enrollment request`);
          fetchStats();
        }
      )
      .subscribe();

    const ordersChannel = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "shopping_orders" },
        (payload) => {
          addNotification("payment", "New Shopping Order", `New order for ₹${payload.new.total_price} received`);
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(paymentsChannel);
      supabase.removeChannel(withdrawalsChannel);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(packagesChannel);
      supabase.removeChannel(ordersChannel);
    };
  }, [isAdmin, addNotification, fetchStats]); // Added fetchStats to dependency array

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab as TabType);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Checking admin access...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <AdminDashboard
            stats={stats}
            onNavigate={handleNavigate}
            siteSettings={siteSettings}
            onSettingsUpdate={setSiteSettings}
          />
        );
      case "all-students":
        return <UserListTable filter="all" />;
      case "active-students":
        return <UserListTable filter="active" />;
      case "inactive-students":
        return <UserListTable filter="inactive" />;
      case "course-only-students":
        return <UserListTable filter="course-only" />;
      case "combo-plan-students":
        return <UserListTable filter="combo-plan" />;
      case "package-requests":
        return <PackagePurchaseApproval onRefresh={fetchStats} />;
      case "course-requests":
        return <CourseRequestsApproval onRefresh={fetchStats} />;
      case "affiliate-requests":
        return <AffiliateManagement onRefresh={fetchStats} />;
      case "income-settings":
        return <IncomeSettings />;
      case "level-income":
        return <IncomeManagement type="level" />;
      case "global-income":
        return <IncomeManagement type="global" />;
      case "referral-income":
        return <IncomeManagement type="referral" />;
      case "spillover-income":
        return <IncomeManagement type="spillover" />;
      case "revenue-share-income":
        return <IncomeManagement type="revenue_share" />;
      case "other-income":
        return <IncomeManagement type="other" />;
      case "deposit-requests":
        return <WalletManagement mode="add" onRefresh={fetchStats} />;
      case "withdrawal-requests":
        return <WalletManagement mode="withdraw" onRefresh={fetchStats} />;
      case "wallet-history":
        return <WalletManagement mode="history" onRefresh={fetchStats} />;
      case "adjust-balance":
        return <WalletManagement mode="adjust" onRefresh={fetchStats} />;
      case "create-task":
        return <TaskManagement />;
      case "task-verification":
        return <TaskCompletion onRefresh={fetchStats} />;
      case "courses":
        return <CoursesManagement />;
      case "products":
        return <ProductsManagement />;
      case "shopping-orders":
        return <ShoppingOrdersManagement onRefresh={fetchStats} />;
      case "ads":
        return <AdsManagement />;
      case "bank-details":
        return <BankDetailsView />;
      case "messages":
        return <MessagesManagement onRefresh={fetchStats} />;
      case "payment-settings":
        return <PaymentSettings />;
      case "profile":
        return <AdminProfile />;
      case "block-student":
        return <UserActions mode="block" onRefresh={fetchStats} />;
      case "delete-student":
        return <UserActions mode="delete" onRefresh={fetchStats} />;
      case "index-editor":
        return <IndexPageEditor />;
      case "audit-logs":
        return <AuditLogs />;
      case "packages-manager":
        return <PackagesManager />;
      case "store-manager":
        return <StoreManager />;
      default:
        return (
          <AdminDashboard
            stats={stats}
            onNavigate={handleNavigate}
            siteSettings={siteSettings}
            onSettingsUpdate={setSiteSettings}
          />
        );
    }
  };

  const getPageTitle = () => {
    const titles: Record<TabType, string> = {
      dashboard: "Dashboard",
      "all-students": "All Students",
      "active-students": "Active Students",
      "inactive-students": "Inactive Students",
      "course-only-students": "Course-Only Students",
      "combo-plan-students": "Combo Plan Students",
      "package-requests": "Package Requests",
      "course-requests": "Course Requests",
      "affiliate-requests": "Affiliate Requests",
      "income-settings": "Income Settings",
      "level-income": "Level Income",
      "global-income": "Global Income",
      "referral-income": "Referral Income",
      "spillover-income": "Spillover Income",
      "revenue-share-income": "Revenue Share Income",
      "other-income": "Other Income",
      "deposit-requests": "Deposit Requests",
      "withdrawal-requests": "Withdrawal Requests",
      "wallet-history": "Wallet History",
      "adjust-balance": "Adjust Balance",
      "create-task": "Create Task",
      "task-verification": "Task Verification",
      courses: "Courses Management",
      products: "Products Management",
      "shopping-orders": "Manage Orders",
      ads: "Ads Management",
      "bank-details": "Bank Details",
      messages: "Messages",
      "payment-settings": "Payment Settings",
      profile: "Admin Profile",
      "block-student": "Block Student",
      "delete-student": "Delete Student",
      "index-editor": "Index Page Editor",
      "audit-logs": "System Audit Logs",
      "packages-manager": "Packages Management",
      "store-manager": "Store Appearance & Banners",
    };
    return titles[activeTab] || "Dashboard";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab as TabType);
          setMobileSidebarOpen(false);
        }}
        onSignOut={handleSignOut}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        pendingCounts={{
          deposits: stats.pendingDeposits,
          withdrawals: stats.pendingWithdrawals,
          tasks: stats.pendingTasks,
          messages: stats.unreadMessages,
          packages: stats.pendingPackages,
          courseRequests: stats.pendingCourseRequests,
          shoppingOrders: stats.pendingShoppingOrders,
          affiliateRequests: stats.pendingAffiliateRequests,
        }}
      />

      {/* Main content */}
      <main className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">{getPageTitle()}</h1>
                <p className="text-sm text-muted-foreground">Skill Learners Admin Panel</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle variant="icon" />

              <Button
                variant="outline"
                size="sm"
                onClick={fetchStats}
                disabled={loading}
                className="hidden sm:flex"
              >
                <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                Refresh
              </Button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-3 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No notifications
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          className={cn(
                            "p-3 border-b last:border-0 hover:bg-muted/50 cursor-pointer",
                            !n.read && "bg-primary/5"
                          )}
                          onClick={() => {
                            setNotifications(prev =>
                              prev.map(notif =>
                                notif.id === n.id ? { ...notif, read: true } : notif
                              )
                            );
                          }}
                        >
                          <p className="font-medium text-sm">{n.title}</p>
                          <p className="text-xs text-muted-foreground">{n.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {n.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          {loading && activeTab === "dashboard" ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </main>
    </div>
  );
};

export default SkillLearnersAdmin;