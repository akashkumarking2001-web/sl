import { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Filter,
  Calendar,
  ShoppingCart,
  GitBranch,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AffiliateSidebar from "@/components/layout/AffiliateSidebar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Referral {
  id: string;
  full_name: string | null;
  email: string | null;
  has_purchased: boolean | null;
  purchased_plan: string | null;
  created_at: string;
  referrals?: Referral[];
}

const LearnersPage = () => {
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [search, setSearch] = useState("");
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const { profile } = useAuth();

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!profile?.id) return;

      try {
        // Fetch direct referrals
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, email, has_purchased, purchased_plan, created_at")
          .eq("referred_by", profile.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        // For each referral, fetch their referrals (level 2)
        const referralsWithChildren = await Promise.all(
          (data || []).map(async (referral) => {
            const { data: childReferrals } = await supabase
              .from("profiles")
              .select("id, full_name, email, has_purchased, purchased_plan, created_at")
              .eq("referred_by", referral.id);

            return {
              ...referral,
              referrals: childReferrals || []
            };
          })
        );

        setReferrals(referralsWithChildren);
      } catch (error) {
        console.error("Error fetching referrals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [profile]);

  const filteredReferrals = referrals.filter(referral => {
    const matchesFilter = filter === "all" ||
      (filter === "active" && referral.has_purchased) ||
      (filter === "inactive" && !referral.has_purchased);
    const matchesSearch =
      (referral.full_name?.toLowerCase().includes(search.toLowerCase()) || false) ||
      (referral.email?.toLowerCase().includes(search.toLowerCase()) || false);
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: referrals.length,
    active: referrals.filter(r => r.has_purchased).length,
    inactive: referrals.filter(r => !r.has_purchased).length,
    level2Total: referrals.reduce((sum, r) => sum + (r.referrals?.length || 0), 0),
  };

  // Calculate earnings
  const directEarnings = stats.active * 300; // ₹300 per direct active referral
  const level2Active = referrals.reduce((sum, r) =>
    sum + (r.referrals?.filter(child => child.has_purchased).length || 0), 0
  );
  const level2Earnings = level2Active * 100; // ₹100 per level 2 active referral
  const totalEarnings = directEarnings + level2Earnings;

  const toggleExpand = (id: string) => {
    setExpandedUsers(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <AffiliateSidebar>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-display mb-2">Referral Network</h1>
          <p className="text-muted-foreground">Track your referrals and their team hierarchy</p>
        </div>

        {/* Earnings Summary */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-card to-accent/10 border border-primary/20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold">Referral Earnings Breakdown</h2>
              <p className="text-sm text-muted-foreground">Your earnings from referral network</p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-card/60 rounded-xl border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Level 1 Earnings</p>
              <p className="text-xl font-bold text-emerald">₹{directEarnings.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{stats.active} active × ₹300</p>
            </div>
            <div className="p-4 bg-card/60 rounded-xl border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Level 2 Earnings</p>
              <p className="text-xl font-bold text-[#FBBF24]">₹{level2Earnings.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{level2Active} active × ₹100</p>
            </div>
            <div className="p-4 bg-card/60 rounded-xl border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Team Size</p>
              <p className="text-xl font-bold">{stats.total + stats.level2Total}</p>
              <p className="text-xs text-muted-foreground">L1: {stats.total} | L2: {stats.level2Total}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-[#FBBF24]/20 to-[#D97706]/20 rounded-xl border border-[#FBBF24]/30">
              <p className="text-xs text-muted-foreground mb-1">Total Earnings</p>
              <p className="text-xl font-bold text-[#FBBF24]">₹{totalEarnings.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">From network</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-2xl p-4 text-left transition-all border ${filter === "all"
                ? "bg-card border-primary/50 ring-2 ring-primary/20"
                : "bg-card/50 border-border/50 hover:border-border"
              }`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Referrals</p>
          </button>

          <button
            onClick={() => setFilter("active")}
            className={`rounded-2xl p-4 text-left transition-all border ${filter === "active"
                ? "bg-card border-emerald/50 ring-2 ring-emerald/20"
                : "bg-card/50 border-border/50 hover:border-border"
              }`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald to-emerald-light flex items-center justify-center mb-3">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold">{stats.active}</p>
            <p className="text-sm text-muted-foreground">Active (Purchased)</p>
          </button>

          <button
            onClick={() => setFilter("inactive")}
            className={`rounded-2xl p-4 text-left transition-all border ${filter === "inactive"
                ? "bg-card border-destructive/50 ring-2 ring-destructive/20"
                : "bg-card/50 border-border/50 hover:border-border"
              }`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-destructive to-destructive/70 flex items-center justify-center mb-3">
              <UserX className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold">{stats.inactive}</p>
            <p className="text-sm text-muted-foreground">Inactive</p>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </Button>
        </div>

        {/* Referral Tree */}
        <div className="rounded-2xl bg-card border border-border/50 overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30">
            <h3 className="font-bold flex items-center gap-2 text-black">
              <GitBranch className="w-5 h-5 text-[#FBBF24]" />
              Referral Hierarchy
            </h3>
            <p className="text-sm text-muted-foreground">Click on a user to see their referrals</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="w-6 h-6 text-muted-foreground animate-spin" />
            </div>
          ) : filteredReferrals.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No referrals found</p>
              <p className="text-sm text-muted-foreground mt-1">Share your referral link to start building your network!</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filteredReferrals.map((referral) => (
                <div key={referral.id}>
                  {/* Level 1 User */}
                  <div
                    className={`flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer ${expandedUsers.has(referral.id) ? 'bg-muted/20' : ''
                      }`}
                    onClick={() => referral.referrals && referral.referrals.length > 0 && toggleExpand(referral.id)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Expand indicator */}
                      <div className="w-6 flex items-center justify-center">
                        {referral.referrals && referral.referrals.length > 0 ? (
                          expandedUsers.has(referral.id) ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-border" />
                        )}
                      </div>

                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{referral.full_name?.charAt(0) || "U"}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{referral.full_name || "Unknown"}</p>
                          <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium">
                            Level 1
                          </span>
                          {referral.referrals && referral.referrals.length > 0 && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-accent/10 text-accent font-medium">
                              {referral.referrals.length} in team
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{referral.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {new Date(referral.created_at).toLocaleDateString()}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${referral.has_purchased
                          ? "bg-emerald/10 text-emerald border border-emerald/20"
                          : "bg-muted text-muted-foreground"
                        }`}>
                        {referral.has_purchased ? (
                          <>
                            <ShoppingCart className="w-3 h-3" />
                            {referral.purchased_plan}
                          </>
                        ) : (
                          "Pending"
                        )}
                      </span>
                      {referral.has_purchased && (
                        <span className="text-sm font-medium text-emerald">+₹300</span>
                      )}
                    </div>
                  </div>

                  {/* Level 2 Users (Children) */}
                  {expandedUsers.has(referral.id) && referral.referrals && referral.referrals.length > 0 && (
                    <div className="bg-muted/10 border-t border-border/30">
                      {referral.referrals.map((child) => (
                        <div
                          key={child.id}
                          className="flex items-center justify-between p-4 pl-16 hover:bg-muted/20 transition-colors border-b border-border/20 last:border-b-0"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-accent" />
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/80 to-accent/40 flex items-center justify-center">
                              <span className="text-xs font-bold text-white">{child.full_name?.charAt(0) || "U"}</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm">{child.full_name || "Unknown"}</p>
                                <span className="px-2 py-0.5 text-[10px] rounded-full bg-accent/10 text-accent font-medium">
                                  Level 2
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">{child.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${child.has_purchased
                                ? "bg-emerald/10 text-emerald border border-emerald/20"
                                : "bg-muted text-muted-foreground"
                              }`}>
                              {child.has_purchased ? child.purchased_plan : "Pending"}
                            </span>
                            {child.has_purchased && (
                              <span className="text-xs font-medium text-accent">+₹100</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AffiliateSidebar>
  );
};

export default LearnersPage;
