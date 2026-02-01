import { useState, useEffect } from "react";
import { Trophy, Medal, Award, Crown, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import AffiliateSidebar from "@/components/layout/AffiliateSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface LeaderboardEntry {
  agent_id: string;
  full_name: string;
  earnings: number;
  referrals: number;
  rank: number;
}

const rankIcons: Record<number, { icon: any; color: string }> = {
  1: { icon: Crown, color: "text-yellow-500" },
  2: { icon: Medal, color: "text-gray-400" },
  3: { icon: Award, color: "text-amber-600" },
};

const LeaderboardPage = () => {
  const [period, setPeriod] = useState<"allTime" | "monthly" | "today">("allTime");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      let periodDate: string | null = null;
      const now = new Date();

      if (period === 'monthly') {
        // First day of current month
        periodDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      } else if (period === 'today') {
        // Start of today (00:00)
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);
        periodDate = today.toISOString();
      }

      // Call RPC
      const { data, error } = await supabase.rpc('get_affiliate_leaderboard', {
        period_start: periodDate
      });

      if (error) throw error;
      setLeaderboard((data as unknown as LeaderboardEntry[]) || []);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      // Fallback empty if strict schema failure or RPC missing
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const myEntry = leaderboard.find(u => u.agent_id === profile?.id) || {
    rank: '-',
    earnings: 0,
    referrals: 0 // We could fetch this separately if not in top 20, but for now fallback
  };

  return (
    <AffiliateSidebar>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-card p-6 lg:p-8 rounded-3xl mb-6 bg-gradient-to-r from-primary/10 to-accent/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-gold opacity-10 rounded-full blur-3xl" />
          <div className="relative">
            <h1 className="text-2xl lg:text-3xl font-bold font-display mb-2 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-primary" />
              Leaderboard
            </h1>
            <p className="text-muted-foreground mb-4">Top performers ranked by earnings</p>

            {/* My Rank */}
            {profile && (
              <div className="inline-flex items-center gap-4 p-3 bg-card/50 rounded-xl border border-border/50 backdrop-blur-md">
                <span className="text-sm text-muted-foreground">Your Rank:</span>
                <span className="text-xl font-bold text-primary">#{myEntry.rank}</span>
                <span className="text-sm text-muted-foreground">|</span>
                <span className="text-sm">₹{myEntry.earnings.toLocaleString()} earned</span>
              </div>
            )}
          </div>
        </div>

        {/* Period Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={period === "allTime" ? "hero" : "outline"}
            size="sm"
            onClick={() => setPeriod("allTime")}
            className="rounded-full"
          >
            All Time
          </Button>
          <Button
            variant={period === "monthly" ? "hero" : "outline"}
            size="sm"
            onClick={() => setPeriod("monthly")}
            className="rounded-full"
          >
            This Month
          </Button>
          <Button
            variant={period === "today" ? "hero" : "outline"}
            size="sm"
            onClick={() => setPeriod("today")}
            className="rounded-full"
          >
            Today
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            {leaderboard.length >= 3 && (
              <div className="grid grid-cols-3 gap-3 mb-8 items-end">
                {/* 2nd Place */}
                <div className="glass-card p-4 rounded-2xl text-center order-1 transform translate-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center mx-auto mb-3 ring-4 ring-gray-400/30">
                    <span className="text-2xl font-bold text-white">{leaderboard[1].full_name?.charAt(0) || "U"}</span>
                  </div>
                  <Medal className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="font-bold text-sm truncate">{leaderboard[1].full_name}</p>
                  <p className="text-lg font-bold text-gradient-gold">₹{leaderboard[1].earnings.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{leaderboard[1].referrals} referrals</p>
                </div>

                {/* 1st Place */}
                <div className="glass-card p-6 rounded-2xl text-center order-0 md:order-1 ring-2 ring-yellow-500/50 bg-gradient-to-b from-yellow-500/10 to-transparent z-10">
                  <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="w-20 h-20 rounded-full bg-gradient-gold flex items-center justify-center mx-auto mb-3 ring-4 ring-yellow-500/30 shadow-lg shadow-yellow-500/20">
                    <span className="text-3xl font-bold text-primary-foreground">{leaderboard[0].full_name?.charAt(0) || "U"}</span>
                  </div>
                  <p className="font-bold truncate text-lg">{leaderboard[0].full_name}</p>
                  <p className="text-2xl font-bold text-gradient-gold">₹{leaderboard[0].earnings.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{leaderboard[0].referrals} referrals</p>
                </div>

                {/* 3rd Place */}
                <div className="glass-card p-4 rounded-2xl text-center order-2 transform translate-y-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center mx-auto mb-3 ring-4 ring-amber-600/30">
                    <span className="text-2xl font-bold text-white">{leaderboard[2].full_name?.charAt(0) || "U"}</span>
                  </div>
                  <Award className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                  <p className="font-bold text-sm truncate">{leaderboard[2].full_name}</p>
                  <p className="text-lg font-bold text-gradient-gold">₹{leaderboard[2].earnings.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{leaderboard[2].referrals} referrals</p>
                </div>
              </div>
            )}

            {/* Full Leaderboard List */}
            <div className="glass-card rounded-2xl overflow-hidden border border-border/50">
              <div className="p-4 border-b border-border/50 bg-card/50">
                <h2 className="font-bold font-display">Rankings</h2>
              </div>
              <div className="divide-y divide-border/50">
                {leaderboard.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No data for this period yet.
                  </div>
                ) : (
                  leaderboard.map((user) => {
                    const RankIcon = rankIcons[user.rank]?.icon;
                    const rankColor = rankIcons[user.rank]?.color;

                    return (
                      <div key={user.agent_id} className={`flex items-center justify-between p-4 hover:bg-muted/30 transition-colors ${user.agent_id === profile?.id ? 'bg-primary/5' : ''}`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${user.rank <= 3 ? 'bg-primary/10' : 'bg-muted'
                            }`}>
                            {RankIcon ? (
                              <RankIcon className={`w-5 h-5 ${rankColor}`} />
                            ) : (
                              <span className="font-bold text-sm text-muted-foreground">#{user.rank}</span>
                            )}
                          </div>
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                            <span className="font-bold text-slate-600 dark:text-slate-300">{user.full_name?.charAt(0) || <User className="w-4 h-4" />}</span>
                          </div>
                          <div>
                            <p className="font-medium flex items-center gap-2">
                              {user.full_name}
                              {user.agent_id === profile?.id && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">YOU</span>}
                            </p>
                            <p className="text-xs text-muted-foreground">{user.referrals} referrals</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gradient-gold">₹{user.earnings.toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}

      </div>
    </AffiliateSidebar>
  );
};

export default LeaderboardPage;
