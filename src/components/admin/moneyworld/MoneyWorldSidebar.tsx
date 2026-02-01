import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  Globe,
  Share2,
  MoreHorizontal,
  Plus,
  Minus,
  History,
  ArrowUpDown,
  ClipboardList,
  CheckSquare,
  BookOpen,
  ShoppingBag,
  Megaphone,
  Building2,
  MessageSquare,
  User,
  Ban,
  Trash2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MoneyWorldSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSignOut: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  pendingCounts: {
    deposits: number;
    withdrawals: number;
    tasks: number;
    messages: number;
    packages: number;
  };
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  children?: NavItem[];
}

const MoneyWorldSidebar = ({
  collapsed,
  onToggle,
  activeTab,
  onTabChange,
  onSignOut,
  mobileOpen,
  onMobileClose,
  pendingCounts,
}: MoneyWorldSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(["agents", "income", "wallet", "tasks"]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      id: "agents-section",
      label: "Users",
      icon: Users,
      children: [
        { id: "agents", label: "All Users", icon: Users },
        { id: "active-agents", label: "Active Users", icon: UserCheck },
        { id: "inactive-agents", label: "Inactive Users", icon: UserX },
        { id: "package-approvals", label: "Package Approvals", icon: Shield, badge: pendingCounts.packages },
      ],
    },
    {
      id: "income-section",
      label: "Income",
      icon: TrendingUp,
      children: [
        { id: "level-income", label: "Level Income", icon: TrendingUp },
        { id: "global-income", label: "Global Income", icon: Globe },
        { id: "referral-income", label: "Referral Income", icon: Share2 },
        { id: "other-income", label: "Other Income", icon: MoreHorizontal },
      ],
    },
    {
      id: "wallet-section",
      label: "Wallet",
      icon: ArrowUpDown,
      children: [
        { id: "add-money", label: "Add Money", icon: Plus, badge: pendingCounts.deposits },
        { id: "withdraw-money", label: "Withdraw Money", icon: Minus, badge: pendingCounts.withdrawals },
        { id: "wallet-history", label: "Wallet History", icon: History },
        { id: "withdrawal-history", label: "Withdrawal History", icon: History },
        { id: "increase-decrease", label: "Adjust Balance", icon: ArrowUpDown },
      ],
    },
    {
      id: "tasks-section",
      label: "Tasks",
      icon: ClipboardList,
      children: [
        { id: "add-task", label: "Add Task", icon: ClipboardList },
        { id: "task-completion", label: "Task Completion", icon: CheckSquare, badge: pendingCounts.tasks },
      ],
    },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "products", label: "Products", icon: ShoppingBag },
    { id: "ads", label: "Ads Management", icon: Megaphone },
    { id: "bank-details", label: "Bank Details", icon: Building2 },
    { id: "messages", label: "Messages", icon: MessageSquare, badge: pendingCounts.messages },
    { id: "profile", label: "Profile", icon: User },
    { id: "block-agent", label: "Block Agent", icon: Ban },
    { id: "delete-agent", label: "Delete Agent", icon: Trash2 },
  ];

  const renderNavItem = (item: NavItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const sectionId = item.id.replace("-section", "");
    const isExpanded = expandedSections.includes(sectionId);
    const isActive = item.id === activeTab || item.children?.some(child => child.id === activeTab);

    if (hasChildren) {
      return (
        <div key={item.id} className="space-y-1">
          <button
            onClick={() => !collapsed && toggleSection(sectionId)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
              isActive
                ? "bg-primary/10 text-primary"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && (
              <>
                <span className="font-medium text-sm flex-1 text-left">{item.label}</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform",
                    isExpanded && "rotate-180"
                  )}
                />
              </>
            )}
          </button>
          {!collapsed && isExpanded && (
            <div className="ml-4 space-y-1 border-l-2 border-border pl-3">
              {item.children!.map(child => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => onTabChange(item.id)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
          activeTab === item.id
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            : "hover:bg-muted text-muted-foreground hover:text-foreground"
        )}
      >
        <item.icon className="w-5 h-5 shrink-0" />
        {!collapsed && (
          <>
            <span className="font-medium text-sm flex-1 text-left">{item.label}</span>
            {item.badge && item.badge > 0 && (
              <Badge variant="destructive" className="h-5 min-w-5 px-1.5">
                {item.badge}
              </Badge>
            )}
          </>
        )}
        {collapsed && item.badge && item.badge > 0 && (
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px]">
            {item.badge}
          </Badge>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 hidden lg:block",
          collapsed ? "w-20" : "w-72"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
            <div className="flex items-center gap-3">
              <img src={logo} alt="Skill Learners" className="h-10 w-auto" />
              <div>
                <h2 className="font-bold text-sm">Skill Learners</h2>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto">
              <Shield className="w-5 h-5 text-white" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn("shrink-0", collapsed && "mx-auto")}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map((item) => renderNavItem(item))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border bg-card">
          <button
            onClick={onSignOut}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-destructive hover:bg-destructive/10",
              collapsed && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="font-medium text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-72 bg-card border-r border-border transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Skill Learners" className="h-10 w-auto" />
            <div>
              <h2 className="font-bold text-sm">Skill Learners</h2>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onMobileClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map((item) => renderNavItem(item))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border bg-card">
          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default MoneyWorldSidebar;