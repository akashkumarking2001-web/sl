import { useState, useEffect, useCallback } from "react";
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
  RefreshCw,
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

interface User {
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

interface UserListTableProps {
  filter: "all" | "active" | "inactive" | "course-only" | "combo-plan";
}

const UserListTable = ({ filter }: UserListTableProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from("profiles").select("*");

      if (filter === "active") {
        query = query.eq("has_purchased", true);
      } else if (filter === "inactive") {
        query = query.or("has_purchased.eq.false,has_purchased.is.null");
      } else if (filter === "course-only") {
        const comboPlans = ["SPARK", "MOMENTUM", "SUMMIT", "TITAN", "LEGACY"];
        query = query.eq("has_purchased", true).not("purchased_plan", "in", `(${comboPlans.join(',')})`);
      } else if (filter === "combo-plan") {
        const comboPlans = ["SPARK", "MOMENTUM", "SUMMIT", "TITAN", "LEGACY"];
        query = query.in("purchased_plan", comboPlans);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;

      // Fetch wallet balances
      const userIds = [...new Set(data?.map(u => u.user_id) || [])];
      let walletMap = new Map();

      if (userIds.length > 0) {
        const { data: walletData } = await supabase
          .from("agent_income")
          .select("user_id, wallet")
          .in("user_id", userIds);
        walletMap = new Map(walletData?.map(w => [w.user_id, Number(w.wallet)]) || []);
      }

      const usersWithWallet = data?.map(user => ({
        ...user,
        wallet: walletMap.get(user.user_id) || 0,
      })) || [];

      setUsers(usersWithWallet);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleExport = () => {
    exportToCSV(filteredUsers, "students", csvColumns.agents);
    toast({ title: "Exported successfully" });
  };

  const toggleStatus = async (user: User) => {
    const newStatus = user.status === "blocked" ? "active" : "blocked";
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ status: newStatus })
        .eq("user_id", user.user_id);

      if (error) throw error;
      toast({ title: "Status Updated", description: `User is now ${newStatus}` });
      fetchUsers();
      if (selectedUser?.user_id === user.user_id) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }
    } catch (error: any) {
      toast({ title: "Failed to update status", description: error.message, variant: "destructive" });
    }
  };

  const verifyEmailManually = async (user: User, packageName: string = "SPARK") => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          status: "active",
          has_purchased: true,
          purchased_plan: packageName,
          package: packageName
        })
        .eq("user_id", user.user_id);

      if (error) throw error;

      // Trigger income distribution
      const { distributeAllIncomesSecure } = await import("@/lib/incomeDistributionSecure");
      const incomeDistributed = await distributeAllIncomesSecure(user.user_id, packageName);

      toast({
        title: "Manually Verified",
        description: `${user.full_name || 'User'} is now active on ${packageName}. ${incomeDistributed ? 'Incomes triggered.' : 'Income check required.'}`
      });
      fetchUsers();
    } catch (error: any) {
      toast({ title: "Verification Failed", description: error.message, variant: "destructive" });
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.referral_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm);

    const matchesPlan =
      planFilter === "all" ||
      (planFilter === "purchased" && user.has_purchased) ||
      (planFilter === "free" && !user.has_purchased);

    return matchesSearch && matchesPlan;
  });

  const getStatusBadge = (user: User) => {
    if (user.status === "blocked") {
      return (
        <Badge className="bg-destructive/10 text-destructive border-destructive/20">
          <UserX className="w-3 h-3 mr-1" />
          Blocked
        </Badge>
      );
    }
    if (user.has_purchased) {
      return (
        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
          <UserCheck className="w-3 h-3 mr-1" />
          Active
        </Badge>
      );
    }
    return (
      <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
        <UserX className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    );
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
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchUsers}>
            <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                {planFilter === "all" ? "All Plans" : planFilter}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setPlanFilter("all")}>All Plans</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPlanFilter("purchased")}>Purchased</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPlanFilter("free")}>Free</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">#</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Student</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Plan</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Wallet</th>
                <th className="text-right p-4 font-medium text-sm text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-muted-foreground">
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user.user_id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-sm text-muted-foreground">{index + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <span className="font-bold text-white text-sm">
                            {(user.full_name || "U").charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user.full_name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(user)}</td>
                    <td className="p-4">
                      {user.has_purchased ? (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          {user.purchased_plan}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Free</Badge>
                      )}
                    </td>
                    <td className="p-4 font-medium text-emerald-500">
                      ₹{(user.wallet || 0).toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedUser(user)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Verify Manually"
                              className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
                            >
                              <UserCheck className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="font-bold flex justify-between gap-3" onClick={() => verifyEmailManually(user, "SPARK")}>
                              SPARK (₹200) <Badge variant="outline" className="text-[10px]">L1</Badge>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="font-bold flex justify-between gap-3" onClick={() => verifyEmailManually(user, "MOMENTUM")}>
                              MOMENTUM (₹500) <Badge variant="outline" className="text-[10px]">L2</Badge>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="font-bold flex justify-between gap-3" onClick={() => verifyEmailManually(user, "SUMMIT")}>
                              SUMMIT (₹1,000) <Badge variant="outline" className="text-[10px]">L3</Badge>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="font-bold flex justify-between gap-3" onClick={() => verifyEmailManually(user, "TITAN")}>
                              TITAN (₹2,500) <Badge variant="outline" className="text-[10px]">L4</Badge>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="font-bold flex justify-between gap-3" onClick={() => verifyEmailManually(user, "LEGACY")}>
                              LEGACY (₹5,000) <Badge variant="outline" className="text-[10px]">L5</Badge>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={user.status === "blocked" ? "text-emerald-500" : "text-destructive"}
                          onClick={() => toggleStatus(user)}
                        >
                          {user.status === "blocked" ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
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

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                    {(selectedUser.full_name || "U").charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedUser.full_name}</h2>
                    <p className="text-muted-foreground">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Wallet Balance</p>
                  <p className="text-2xl font-bold text-emerald-500">₹{(selectedUser.wallet || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground uppercase">Phone</p>
                  <p className="font-medium">{selectedUser.phone || "N/A"}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground uppercase">Referral Code</p>
                  <p className="font-medium font-mono">{selectedUser.referral_code || "N/A"}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground uppercase">Joined On</p>
                  <p className="font-medium">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground uppercase">Current Plan</p>
                  <p className="font-medium">{selectedUser.purchased_plan || "Free"}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                      Verify Manually
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem onClick={() => verifyEmailManually(selectedUser, "SPARK")}>Activate SPARK (₹200)</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => verifyEmailManually(selectedUser, "MOMENTUM")}>Activate MOMENTUM (₹500)</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => verifyEmailManually(selectedUser, "SUMMIT")}>Activate SUMMIT (₹1,000)</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => verifyEmailManually(selectedUser, "TITAN")}>Activate TITAN (₹2,500)</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => verifyEmailManually(selectedUser, "LEGACY")}>Activate LEGACY (₹5,000)</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant={selectedUser.status === "blocked" ? "outline" : "destructive"}
                  className="flex-1"
                  onClick={() => toggleStatus(selectedUser)}
                >
                  {selectedUser.status === "blocked" ? "Unblock Student" : "Block Student"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserListTable;