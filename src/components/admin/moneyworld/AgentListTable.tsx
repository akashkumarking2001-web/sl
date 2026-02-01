import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Download,
  Eye,
  Mail,
  Phone,
  Calendar,
  Loader2,
  UserCheck,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { exportToCSV, csvColumns } from "@/lib/csvExport";
import { useToast } from "@/hooks/use-toast";

interface Agent {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  referral_code: string | null;
  status: string | null;
  has_purchased: boolean | null;
  purchased_plan: string | null;
  created_at: string;
  country: string | null;
  state: string | null;
  address: string | null;
  wallet?: number;
}

interface AgentListTableProps {
  filter: "all" | "active" | "inactive";
}

const AgentListTable = ({ filter }: AgentListTableProps) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const { toast } = useToast();

  const handleExport = () => {
    exportToCSV(filteredAgents, "users", csvColumns.agents);
    toast({ title: "Exported successfully" });
  };

  useEffect(() => {
    fetchAgents();
  }, [filter]);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      let query = supabase.from("profiles").select("*");

      if (filter === "active") {
        query = query.or("status.eq.active,status.is.null");
      } else if (filter === "inactive") {
        query = query.or("status.eq.inactive,status.eq.blocked");
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch wallet balances
      const { data: walletData } = await supabase.from("agent_income").select("user_id, wallet");
      const walletMap = new Map(walletData?.map(w => [w.user_id, Number(w.wallet)]) || []);

      const agentsWithWallet = data?.map(agent => ({
        ...agent,
        wallet: walletMap.get(agent.user_id) || 0,
      })) || [];

      setAgents(agentsWithWallet);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
    setLoading(false);
  };

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.referral_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.phone?.includes(searchTerm);

    const matchesPlan =
      planFilter === "all" ||
      (planFilter === "purchased" && agent.has_purchased) ||
      (planFilter === "free" && !agent.has_purchased);

    return matchesSearch && matchesPlan;
  });

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "active":
      case null:
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            <UserCheck className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            <UserX className="w-3 h-3 mr-1" />
            Inactive
          </Badge>
        );
      case "blocked":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            <UserX className="w-3 h-3 mr-1" />
            Blocked
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone, or referral code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Plan: {planFilter === "all" ? "All" : planFilter}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setPlanFilter("all")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPlanFilter("purchased")}>Purchased</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPlanFilter("free")}>Free</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm">
        <span className="text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredAgents.length}</span> of{" "}
          <span className="font-medium text-foreground">{agents.length}</span> agents
        </span>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">#</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Agent</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Contact</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Plan</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Wallet</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Joined</th>
                <th className="text-right p-4 font-medium text-sm text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center">
                    <p className="font-medium">No agents found</p>
                    <p className="text-sm text-muted-foreground">
                      {searchTerm ? "Try a different search term" : "No agents available"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAgents.map((agent, index) => (
                  <tr key={agent.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-sm text-muted-foreground">{index + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <span className="font-bold text-white text-sm">
                            {(agent.full_name || "U").charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{agent.full_name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {agent.referral_code || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-32">{agent.email || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          <span>{agent.phone || "N/A"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(agent.status)}</td>
                    <td className="p-4">
                      {agent.has_purchased ? (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          {agent.purchased_plan}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Free</Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-emerald-500">
                        ₹{(agent.wallet || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(agent.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedAgent(agent)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Agent Detail Modal */}
      <Dialog open={!!selectedAgent} onOpenChange={() => setSelectedAgent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agent Details</DialogTitle>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="font-bold text-white text-2xl">
                    {(selectedAgent.full_name || "U").charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-lg">{selectedAgent.full_name || "Unknown"}</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {selectedAgent.referral_code}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedAgent.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedAgent.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  {getStatusBadge(selectedAgent.status)}
                </div>
                <div>
                  <p className="text-muted-foreground">Plan</p>
                  <p className="font-medium">{selectedAgent.purchased_plan || "Free"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Wallet Balance</p>
                  <p className="font-bold text-emerald-500">
                    ₹{(selectedAgent.wallet || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Joined</p>
                  <p className="font-medium">
                    {new Date(selectedAgent.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Address</p>
                  <p className="font-medium">
                    {[selectedAgent.address, selectedAgent.state, selectedAgent.country]
                      .filter(Boolean)
                      .join(", ") || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentListTable;