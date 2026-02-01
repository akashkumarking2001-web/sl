import { useState, useEffect } from "react";
import { Search, User, ChevronRight, ChevronDown, Users, DollarSign, Network } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AffiliateSidebar from "@/components/layout/AffiliateSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NetworkNode {
    id: string;
    full_name: string | null;
    referral_code: string | null;
    purchased_plan: string | null;
    created_at: string;
    children: NetworkNode[];
    level: number;
    total_team?: number;
}

const NetworkPage = () => {
    const { user, profile } = useAuth();
    const [networkData, setNetworkData] = useState<NetworkNode | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [stats, setStats] = useState({
        directReferrals: 0,
        totalTeam: 0,
        activeMembers: 0
    });

    useEffect(() => {
        if (user) {
            fetchNetwork();
        }
    }, [user]);

    const fetchNetwork = async () => {
        setLoading(true);
        if (!profile?.referral_code) {
            setLoading(false);
            return;
        }

        try {
            // 1. Fetch all users who might be in the downline
            // Note: For a very large system, this should be done recursively on the backend (Postgres function)
            // For this implementation, we'll fetch a reasonable depth
            const { data: allProfiles, error } = await supabase
                .from("profiles")
                .select("id, full_name, referral_code, purchased_plan, created_at, referred_by");

            if (error) {
                console.error("Error fetching profiles:", error);
                return;
            }

            if (!allProfiles) return;

            // Build tree
            const buildTree = (referralCode: string, level: number = 0): NetworkNode[] => {
                if (level > 5) return []; // Limit depth for client-side performance

                return allProfiles
                    .filter(p => p.referred_by === referralCode)
                    .map(p => {
                        const children = buildTree(p.referral_code || "INVALID", level + 1);
                        return {
                            ...p,
                            children,
                            level,
                            total_team: children.length + children.reduce((acc, c) => acc + (c.total_team || 0), 0)
                        } as NetworkNode;
                    });
            };

            const rootChildren = buildTree(profile.referral_code);

            const rootNode: NetworkNode = {
                id: user!.id,
                full_name: profile.full_name,
                referral_code: profile.referral_code,
                purchased_plan: profile.purchased_plan,
                created_at: profile.created_at,
                children: rootChildren,
                level: 0,
                total_team: rootChildren.length + rootChildren.reduce((acc, c) => acc + (c.total_team || 0), 0)
            };

            setNetworkData(rootNode);

            // Calculate stats
            const directs = rootChildren.length;
            const team = rootNode.total_team || 0;
            const active = allProfiles.filter(p => p.purchased_plan && p.referred_by === profile.referral_code).length; // Simplify active to directs for now or recursive

            setStats({
                directReferrals: directs,
                totalTeam: team,
                activeMembers: active // This needs better logic for deep active count
            });

        } catch (error) {
            console.error("Error fetching network:", error);
        } finally {
            setLoading(false);
        }
    };

    const TreeNode = ({ node, expanded = false }: { node: NetworkNode, expanded?: boolean }) => {
        const [isExpanded, setIsExpanded] = useState(expanded);
        const hasChildren = node.children && node.children.length > 0;

        // Status color
        const isActive = !!node.purchased_plan;
        const statusColor = isActive ? "bg-emerald-500" : "bg-gray-400";
        const statusBorder = isActive ? "border-emerald-200 bg-emerald-50" : "border-gray-200 bg-gray-50";

        return (
            <div className="ml-4 md:ml-8 relative">
                {/* Connection Line */}
                <div className="absolute -left-4 md:-left-8 top-8 w-4 md:w-8 h-px bg-border"></div>

                <div className="mb-4">
                    <div
                        className={`flex items-center gap-3 p-3 rounded-xl border ${statusBorder} relative z-10 transition-all hover:shadow-md cursor-pointer`}
                        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
                    >
                        {/* Connection Node */}
                        <div className={`absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white ${statusColor}`}></div>

                        {hasChildren && (
                            <div className="mr-1">
                                {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                            </div>
                        )}

                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${isActive ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'}`}>
                            {node.full_name?.charAt(0).toUpperCase() || "U"}
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <div className="flex items-center gap-2">
                                <p className="font-semibold text-sm">{node.full_name || "Unknown User"}</p>
                                {isActive && <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-white/50">{node.purchased_plan}</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground">ID: {node.referral_code} • Team: {node.total_team || 0}</p>
                        </div>

                        <div className="hidden md:block text-right">
                            <p className="text-xs text-muted-foreground">Joined</p>
                            <p className="text-xs font-medium">{new Date(node.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {isExpanded && node.children.length > 0 && (
                    <div className="relative border-l border-border ml-[21px]">
                        {node.children.map(child => (
                            <TreeNode key={child.id} node={child} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <AffiliateSidebar>
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-display flex items-center gap-3">
                            <Users className="w-8 h-8 text-primary" />
                            My Network
                        </h1>
                        <p className="text-muted-foreground mt-1">Visualize your team structure and growth</p>
                    </div>
                    <Button variant="outline" onClick={fetchNetwork} disabled={loading}>
                        Refresh
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-200/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Direct Referrals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-500" />
                                {stats.directReferrals}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Team Size</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold flex items-center gap-2">
                                <Users className="w-5 h-5 text-purple-500" />
                                {stats.totalTeam}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-200/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Active Members</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-emerald-500" />
                                {stats.activeMembers}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 bg-white/50 backdrop-blur-sm"
                    />
                </div>

                {/* Tree Visualization */}
                <div className="min-h-[400px] p-4 md:p-8 rounded-2xl glass-card overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : networkData ? (
                        <div className="-ml-4 md:ml-0">
                            {/* Root Node (You) */}
                            <div className="mb-4">
                                <div className="flex items-center gap-3 p-4 rounded-xl border border-primary/30 bg-primary/5 shadow-sm">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center text-white font-bold text-lg shadow-md">
                                        {networkData.full_name?.charAt(0).toUpperCase() || "Y"}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{networkData.full_name} (Me)</h3>
                                        <p className="text-sm text-muted-foreground">Plan: {networkData.purchased_plan || "Free"} • Code: {networkData.referral_code}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Children */}
                            <div className="border-l-2 border-primary/20 ml-6 pl-6 pt-4">
                                {networkData.children.length > 0 ? (
                                    networkData.children.map(child => (
                                        <TreeNode key={child.id} node={child} expanded={false} />
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>No referrals found. Share your link to grow your team!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            Network data not found.
                        </div>
                    )}
                </div>
            </div>
        </AffiliateSidebar>
    );
};

export default NetworkPage;
