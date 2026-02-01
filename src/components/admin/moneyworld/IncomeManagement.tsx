import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Download,
  Calendar,
  Loader2,
  TrendingUp,
  TrendingDown,
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
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { exportToCSV, csvColumns } from "@/lib/csvExport";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  description: string;
  created_at: string;
  user_name?: string;
}

interface IncomeManagementProps {
  type: "level" | "global" | "referral" | "spillover" | "revenue_share" | "task" | "other";
}

const IncomeManagement = ({ type }: IncomeManagementProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const handleExport = () => {
    exportToCSV(filteredTransactions, `${type}_income`, csvColumns.walletHistory);
    toast({ title: "Exported successfully" });
  };

  const typeLabels: Record<string, string> = {
    level: "Level Income",
    global: "Global Income",
    referral: "Referral Income",
    spillover: "Spillover Income",
    revenue_share: "Revenue Share Income",
    task: "Task Income",
    other: "Other Income",
  };

  useEffect(() => {
    fetchTransactions();
  }, [type]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("wallet_history")
        .select("*")
        .order("created_at", { ascending: false });

      // Filter by type using income_type column first, then fall back to description
      if (type === "level") {
        query = query.or("income_type.eq.level,description.ilike.%level%");
      } else if (type === "global") {
        query = query.or("income_type.eq.global,description.ilike.%global%");
      } else if (type === "referral") {
        query = query.or("income_type.eq.referral,description.ilike.%referral%");
      } else if (type === "spillover") {
        query = query.or("income_type.eq.spillover,description.ilike.%spillover%");
      } else if (type === "revenue_share") {
        query = query.or("income_type.eq.revenue_share,description.ilike.%revenue share%");
      } else if (type === "task") {
        query = query.or("income_type.eq.task,description.ilike.%task%");
      } else if (type === "other") {
        query = query
          .is("income_type", null)
          .not("description", "ilike", "%level%")
          .not("description", "ilike", "%global%")
          .not("description", "ilike", "%referral%")
          .not("description", "ilike", "%spillover%")
          .not("description", "ilike", "%revenue share%")
          .not("description", "ilike", "%task%")
          .not("description", "ilike", "%wallet%")
          .not("description", "ilike", "%withdrawal%");
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch user profiles - we want the person who GENERATED the income (from_user_id)
      // or the recipient if it's a direct task/other income (user_id)
      const userIds = [...new Set(data?.map(t => t.from_user_id || t.user_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      const transactionsWithNames = data?.map(t => {
        const profile = profileMap.get(t.from_user_id || t.user_id);
        return {
          ...t,
          user_name: profile?.full_name || "System",
          user_email: profile?.email || "",
        };
      }) || [];

      setTransactions(transactionsWithNames);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
    setLoading(false);
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredTransactions
    .filter(t => t.status === "credit")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{typeLabels[type]}</p>
            <p className="text-3xl font-bold text-emerald-500">
              ₹{totalAmount.toLocaleString()}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by user or description..."
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
                Status: {statusFilter === "all" ? "All" : statusFilter}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("credit")}>Credit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("debit")}>Debit</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Student</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Amount</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Description</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <p className="font-medium">No transactions found</p>
                    <p className="text-sm text-muted-foreground">
                      {searchTerm ? "Try a different search term" : "No transactions available"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <span className="font-bold text-white text-sm">
                            {(transaction.user_name || "U").charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{transaction.user_name}</p>
                          <p className="text-[10px] text-muted-foreground">{(transaction as any).user_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "font-bold text-lg",
                        transaction.status === "credit" ? "text-emerald-500" : "text-destructive"
                      )}>
                        {transaction.status === "credit" ? "+" : "-"}₹{Number(transaction.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      {transaction.status === "credit" ? (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Credit
                        </Badge>
                      ) : (
                        <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          Debit
                        </Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-muted-foreground">{transaction.description}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(transaction.created_at).toLocaleString()}
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

export default IncomeManagement;