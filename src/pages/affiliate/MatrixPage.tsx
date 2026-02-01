import { useState, useEffect } from "react";
import { Search, ChevronRight, ChevronDown, Network, Target, Award, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AffiliateSidebar from "@/components/layout/AffiliateSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MatrixNode {
    id: string;
    user_id: string;
    package_type: string | null;
    downline_count: number;
    left_pos: string | null;
    mid_pos: string | null;
    right_pos: string | null;
    profile?: {
        full_name: string | null;
        referral_code: string | null;
    };
    children: MatrixNode[];
    level: number;
}

const MatrixPage = () => {
    const { user, profile } = useAuth();
    const [matrixType, setMatrixType] = useState<string>("SPARK");
    const [rootNode, setRootNode] = useState<MatrixNode | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const packages = ["SPARK", "MOMENTUM", "SUMMIT", "TITAN", "LEGACY"];

    useEffect(() => {
        if (user) {
            fetchMatrix(matrixType);
        }
    }, [user, matrixType]);

    const fetchMatrix = async (pkg: string) => {
        setLoading(true);
        try {
            // 1. Fetch all nodes for this package type
            const { data: treeNodes, error: treeError } = await supabase
                .from("revenue_share_tree")
                .select("*")
                .eq("package_type", pkg);

            if (treeError) throw treeError;
            if (!treeNodes || treeNodes.length === 0) {
                setRootNode(null);
                setLoading(false);
                return;
            }

            // 2. Fetch profiles for these users
            const userIds = treeNodes.map(n => n.user_id);
            const { data: profiles, error: profileError } = await supabase
                .from("profiles")
                .select("user_id, full_name, referral_code")
                .in("user_id", userIds);

            if (profileError) throw profileError;
            const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

            // 3. Find current user's node as root
            const myNode = treeNodes.find(n => n.user_id === user?.id);
            if (!myNode) {
                setRootNode(null);
                setLoading(false);
                return;
            }

            // 4. Build recursive structure
            const buildMatrix = (userId: string, level: number = 0): MatrixNode | null => {
                if (level > 4) return null; // Limit depth

                const node = treeNodes.find(n => n.user_id === userId);
                if (!node) return null;

                const children: MatrixNode[] = [];
                [node.left_pos, node.mid_pos, node.right_pos].forEach(childId => {
                    if (childId) {
                        const child = buildMatrix(childId, level + 1);
                        if (child) children.push(child);
                    }
                });

                return {
                    ...node,
                    profile: profileMap.get(userId),
                    children,
                    level
                };
            };

            const root = buildMatrix(user!.id);
            setRootNode(root);

        } catch (error) {
            console.error("Error fetching matrix:", error);
        }
        setLoading(false);
    };

    const MatrixNodeCard = ({ node }: { node: MatrixNode }) => {
        const [isExpanded, setIsExpanded] = useState(node.level < 1);
        const hasChildren = node.children.length > 0;

        return (
            <div className="flex flex-col items-center">
                <div
                    className={`relative p-3 rounded-2xl border-2 transition-all cursor-pointer w-48 text-center bg-card hover:shadow-xl hover:-translate-y-1 ${node.user_id === user?.id ? 'border-primary ring-4 ring-primary/10' : 'border-border'
                        }`}
                    onClick={() => hasChildren && setIsExpanded(!isExpanded)}
                >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/80 to-accent mx-auto mb-2 flex items-center justify-center text-white font-bold">
                        {node.profile?.full_name?.charAt(0) || "U"}
                    </div>
                    <p className="font-bold text-sm truncate px-1">{node.profile?.full_name || "Unknown"}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{node.profile?.referral_code || "N/A"}</p>

                    <div className="mt-2 flex items-center justify-center gap-1">
                        <Badge variant="outline" className="text-[10px] h-4 px-1">
                            {node.downline_count} / 3
                        </Badge>
                    </div>

                    {hasChildren && (
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-background border flex items-center justify-center shadow-sm">
                            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </div>
                    )}
                </div>

                {isExpanded && hasChildren && (
                    <div className="relative pt-8">
                        {/* Connecting Line Down */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-border"></div>

                        {/* Connecting Line Across */}
                        {node.children.length > 1 && (
                            <div className="absolute top-8 left-1/4 right-1/4 h-px bg-border"></div>
                        )}

                        <div className="flex gap-4 items-start justify-center">
                            {node.children.map(child => (
                                <MatrixNodeCard key={child.id} node={child} />
                            ))}
                            {/* Fill empty slots visually */}
                            {Array.from({ length: 3 - node.children.length }).map((_, i) => (
                                <div key={`empty-${i}`} className="w-48 flex flex-col items-center opacity-30">
                                    <div className="relative p-3 rounded-2xl border-2 border-dashed border-border w-full text-center bg-muted/20">
                                        <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-2 flex items-center justify-center text-muted-foreground">
                                            ?
                                        </div>
                                        <p className="font-medium text-xs text-muted-foreground italic">Available Slot</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <AffiliateSidebar>
            <div className="max-w-6xl mx-auto pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-black font-display flex items-center gap-3 tracking-tight">
                            <Network className="w-8 h-8 text-primary" />
                            Revenue <span className="text-primary italic">Matrix</span>
                        </h1>
                        <p className="text-muted-foreground mt-1">Global 3xN auto-filling structure for {matrixType} Pool</p>
                    </div>

                    <Tabs value={matrixType} onValueChange={setMatrixType} className="w-full md:w-auto">
                        <TabsList className="bg-muted/50 p-1 h-12 rounded-xl">
                            {packages.map(pkg => (
                                <TabsTrigger key={pkg} value={pkg} className="px-5 font-bold data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all">
                                    {pkg}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                {/* Legend */}
                <div className="flex gap-4 mb-8 bg-card/50 p-4 rounded-2xl border border-border/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-xs font-medium">Your Position</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-xs font-medium">Completed Level</span>
                    </div>
                    <div className="flex items-center gap-2 border-l pl-4">
                        <Award className="w-4 h-4 text-gold" />
                        <span className="text-xs font-medium text-muted-foreground italic">Every 3 members at Level 1 trigger a bonus!</span>
                    </div>
                </div>

                {/* Tree Area */}
                <div className="relative min-h-[600px] p-12 rounded-[2.5rem] glass-card overflow-x-auto bg-gradient-to-b from-primary/5 via-background to-background border border-primary/10">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full py-40 gap-4">
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                            <p className="text-muted-foreground font-medium animate-pulse">Scanning Global Matrix...</p>
                        </div>
                    ) : rootNode ? (
                        <div className="flex flex-col items-center min-w-max">
                            <MatrixNodeCard node={rootNode} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-40 text-center">
                            <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center mb-6">
                                <Network className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Matrix Not Activated</h3>
                            <p className="text-muted-foreground max-w-sm mb-6">
                                You are not currently placed in the {matrixType} matrix. Purchase this package to start earning global revenue share.
                            </p>
                            <Button className="rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/20">
                                Upgrade to {matrixType}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                    <div className="glass-card p-6 rounded-3xl border-emerald-500/20 bg-emerald-500/5">
                        <h4 className="font-bold flex items-center gap-2 mb-3">
                            <Target className="w-5 h-5 text-emerald-500" />
                            How it Works
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0 text-[10px] font-bold">1</span>
                                This is a 3-wide matrix. Every user can have only 3 direct slots.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0 text-[10px] font-bold">2</span>
                                Extra referrals "spillover" to fill the first available spot in your team.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0 text-[10px] font-bold">3</span>
                                You earn even if the system fills your matrix automatically!
                            </li>
                        </ul>
                    </div>
                    <div className="glass-card p-6 rounded-3xl border-primary/20 bg-primary/5">
                        <h4 className="font-bold flex items-center gap-2 mb-3">
                            <Award className="w-5 h-5 text-primary" />
                            Earning Potential
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                                <span className="text-muted-foreground">Level 1 (3 Members)</span>
                                <span className="font-bold text-primary">₹{matrixType === 'SPARK' ? '25' : matrixType === 'MOMENTUM' ? '50' : matrixType === 'SUMMIT' ? '100' : matrixType === 'TITAN' ? '200' : '400'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                                <span className="text-muted-foreground">Level 2 (9 Members)</span>
                                <span className="font-bold text-primary">₹{matrixType === 'SPARK' ? '50' : matrixType === 'MOMENTUM' ? '100' : matrixType === 'SUMMIT' ? '200' : matrixType === 'TITAN' ? '400' : '800'}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground italic mt-2 uppercase tracking-wide">Rewards increase exponentially as each level completes.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AffiliateSidebar>
    );
};

const Loader2 = ({ className }: { className?: string }) => (
    <div className={className}>
        <div className="relative">
            <div className="h-10 w-10 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
            <div className="absolute top-0 left-0 h-10 w-10 rounded-full border-l-2 border-r-2 border-primary animate-pulse opacity-50"></div>
        </div>
    </div>
);

export default MatrixPage;
