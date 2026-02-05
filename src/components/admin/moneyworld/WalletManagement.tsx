import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Download,
  Calendar,
  Loader2,
  Check,
  X,
  Plus,
  Minus,
  Eye,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { exportToCSV, csvColumns } from "@/lib/csvExport";
import { distributeAllIncomesSecure } from "@/lib/incomeDistributionSecure";
import { logAudit } from "@/lib/audit";

interface WalletManagementProps {
  mode: "add" | "withdraw" | "history" | "withdrawal-history" | "adjust";
  onRefresh: () => void;
}

const WalletManagement = ({ mode, onRefresh }: WalletManagementProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  // Form states for adjust mode
  const [agentId, setAgentId] = useState("");
  const [incomeType, setIncomeType] = useState("wallet");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let mainData: any[] = [];

      if (mode === "add") {
        const [proofsRes, paymentsRes] = await Promise.all([
          supabase.from("payment_proofs").select("*").order("created_at", { ascending: false }),
          supabase.from("payments").select("*").order("created_at", { ascending: false })
        ]);

        const proofs = (proofsRes.data || []).map(p => ({ ...p, type: 'deposit' }));
        const payments = (paymentsRes.data || []).map(p => ({ ...p, type: 'plan' }));
        mainData = [...proofs, ...payments].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      } else if (mode === "withdraw" || mode === "withdrawal-history") {
        const { data, error } = await supabase.from("withdrawal_requests").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        mainData = data || [];
      } else if (mode === "history") {
        const { data, error } = await supabase.from("wallet_history").select("*").order("created_at", { ascending: false }).limit(500);
        if (error) throw error;
        mainData = data || [];
      }

      // Consolidate Profile Fetching
      const userIds = [...new Set(mainData?.map(item => item.user_id) || [])];
      let profileMap = new Map();

      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name, email")
          .in("user_id", userIds);

        profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      }

      const combinedData = mainData.map(item => ({
        ...item,
        profile: profileMap.get(item.user_id),
        user_name: profileMap.get(item.user_id)?.full_name || "Unknown",
      }));

      setData(combinedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [mode, supabase]);

  useEffect(() => {
    fetchData();
  }, [mode, fetchData]);

  const handleApproveDeposit = async (item: any, paymentType: "INR" | "USDT") => {
    setProcessing(true);
    try {
      if (item.type === 'plan') {
        // Handle Plan Purchase Approval
        await supabase
          .from("payments")
          .update({
            status: "approved",
            approved_at: new Date().toISOString()
          })
          .eq("id", item.id);

        // Also ensure user profile reflects the purchase
        await supabase
          .from("profiles")
          .update({ has_purchased: true, status: 'active', package: item.plan_name })
          .eq("user_id", item.user_id);

        // DISTRIBUTE ALL INCOMES
        const incomeDistributed = await distributeAllIncomesSecure(item.user_id, item.plan_name);

        toast({
          title: "Plan Purchase Approved",
          description: `User successfully upgraded to ${item.plan_name}. ${incomeDistributed ? 'Incomes distributed.' : 'Manual distribution check required.'}`
        });

        await logAudit('status_update', 'order', item.id, {
          user_id: item.user_id,
          plan: item.plan_name,
          status: 'approved',
          type: 'plan_purchase'
        });
      } else {
        // Handle Regular Wallet Deposit
        await supabase
          .from("payment_proofs")
          .update({ status: "approved", processed_at: new Date().toISOString() })
          .eq("id", item.id);

        const { data: existingIncome } = await supabase
          .from("agent_income")
          .select("*")
          .eq("user_id", item.user_id)
          .single();

        if (existingIncome) {
          await supabase
            .from("agent_income")
            .update({ wallet: Number(existingIncome.wallet) + Number(item.amount) })
            .eq("user_id", item.user_id);
        } else {
          await supabase
            .from("agent_income")
            .insert({ user_id: item.user_id, wallet: item.amount });
        }

        await supabase.from("wallet_history").insert({
          user_id: item.user_id,
          amount: item.amount,
          status: "credit",
          description: `Wallet Recharge (${paymentType})`,
          reference_id: item.id,
          reference_type: "deposit",
        });

        toast({ title: "Deposit Approved", description: `₹${item.amount} added to wallet` });

        await logAudit('status_update', 'order', item.id, {
          user_id: item.user_id,
          amount: item.amount,
          status: 'approved',
          type: 'deposit',
          payment_type: paymentType
        });
      }

      fetchData();
      onRefresh();
    } catch (error) {
      console.error("Error approving deposit:", error);
      toast({ title: "Error", description: "Failed to approve deposit", variant: "destructive" });
    }
    setProcessing(false);
  };

  const handleRejectDeposit = async (item: any) => {
    setProcessing(true);
    try {
      if (item.type === 'plan') {
        await supabase
          .from("payments")
          .update({ status: "rejected" })
          .eq("id", item.id);
      } else {
        await supabase
          .from("payment_proofs")
          .update({ status: "rejected", processed_at: new Date().toISOString() })
          .eq("id", item.id);
      }

      toast({ title: "Request Rejected", variant: "destructive" });

      await logAudit('status_update', 'order', item.id, {
        user_id: item.user_id,
        amount: item.amount,
        status: 'rejected',
        type: item.type === 'plan' ? 'plan_purchase' : 'deposit'
      });

      fetchData();
      onRefresh();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
    setProcessing(false);
  };

  const handleApproveWithdrawal = async (item: any) => {
    setProcessing(true);
    try {
      const deduction = Number(item.amount) * 0.05;
      const payableAmount = Number(item.amount) - deduction;

      // Deduct from wallet
      const { data: existingIncome } = await supabase
        .from("agent_income")
        .select("wallet")
        .eq("user_id", item.user_id)
        .single();

      if (existingIncome && Number(existingIncome.wallet) >= Number(item.amount)) {
        await supabase
          .from("agent_income")
          .update({ wallet: Number(existingIncome.wallet) - Number(item.amount) })
          .eq("user_id", item.user_id);

        // Update withdrawal status
        await supabase
          .from("withdrawal_requests")
          .update({
            status: "approved",
            processed_at: new Date().toISOString(),
          })
          .eq("id", item.id);

        // Add to wallet history
        await supabase.from("wallet_history").insert({
          user_id: item.user_id,
          amount: item.amount,
          status: "debit",
          description: "Withdrawal",
          reference_id: item.id,
          reference_type: "withdrawal",
        });

        toast({ title: "Withdrawal Approved", description: `₹${payableAmount} (after 5% deduction)` });

        await logAudit('status_update', 'order', item.id, {
          user_id: item.user_id,
          amount: item.amount,
          payable: payableAmount,
          status: 'approved',
          type: 'withdrawal'
        });

        fetchData();
        onRefresh();
      } else {
        toast({ title: "Insufficient Balance", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error approving withdrawal:", error);
      toast({ title: "Error", description: "Failed to approve withdrawal", variant: "destructive" });
    }
    setProcessing(false);
  };

  const handleRejectWithdrawal = async (item: any) => {
    setProcessing(true);
    try {
      await supabase
        .from("withdrawal_requests")
        .update({ status: "rejected", processed_at: new Date().toISOString() })
        .eq("id", item.id);

      toast({ title: "Withdrawal Rejected", variant: "destructive" });

      await logAudit('status_update', 'order', item.id, {
        user_id: item.user_id,
        amount: item.amount,
        status: 'rejected',
        type: 'withdrawal'
      });

      fetchData();
      onRefresh();
    } catch (error) {
      console.error("Error rejecting withdrawal:", error);
    }
    setProcessing(false);
  };

  const handleAdjustBalance = async (operation: "increase" | "decrease") => {
    if (!agentId || !amount) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    setProcessing(true);
    try {
      // Find user by Email or Referral Code or user_id
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_id, email, full_name")
        .or(`email.eq.${agentId},referral_code.eq.${agentId},user_id.eq.${agentId}`)
        .single();

      if (!profile) {
        toast({ title: "User not found", description: "Search by email or ID failed.", variant: "destructive" });
        setProcessing(false);
        return;
      }

      const { data: existingIncome } = await supabase
        .from("agent_income")
        .select("*")
        .eq("user_id", profile.user_id)
        .single();

      const currentVal = Number(existingIncome?.[incomeType] || 0);
      const adjustAmount = Number(amount);
      const newVal = operation === "increase"
        ? currentVal + adjustAmount
        : currentVal - adjustAmount;

      // Update specific column
      if (existingIncome) {
        await supabase
          .from("agent_income")
          .update({ [incomeType]: newVal })
          .eq("user_id", profile.user_id);
      } else {
        await supabase
          .from("agent_income")
          .insert({ user_id: profile.user_id, [incomeType]: newVal });
      }

      // Add to wallet history
      await supabase.from("wallet_history").insert({
        user_id: profile.user_id,
        amount: adjustAmount,
        status: operation === "increase" ? "credit" : "debit",
        description: reason || `Manual ${operation} (${incomeType}) by admin for ${profile.email}`,
      });

      toast({
        title: `Balance Adjusted`,
        description: `₹${adjustAmount} ${operation === "increase" ? "added to" : "deducted from"} ${incomeType} for ${profile.full_name}`,
      });

      await logAudit(
        operation === "increase" ? 'create' : 'delete',
        'user',
        profile.user_id,
        {
          amount: adjustAmount,
          type: incomeType,
          operation,
          reason: reason || 'Manual adjustment'
        }
      );

      setAmount("");
      setReason("");
      onRefresh();
    } catch (error) {
      console.error("Error adjusting balance:", error);
      toast({ title: "Error", description: "Operation failed. Check if user exists.", variant: "destructive" });
    }
    setProcessing(false);
  };

  const filteredData = data.filter((item) => {
    const name = item.profile?.full_name || item.user_name || "";
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingItems = mode === "add" || mode === "withdraw"
    ? filteredData.filter(item => item.status === "pending")
    : filteredData;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Adjust Balance Form
  if (mode === "adjust") {
    return (
      <div className="max-w-md mx-auto">
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-bold">Adjust Wallet Balance</h2>
          <div className="space-y-4">
            <div>
              <Label>Search User (Email / ID / Referral Code)</Label>
              <Input
                placeholder="Enter email or ID"
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
              />
            </div>
            <div>
              <Label>Income Type (Column to Update)</Label>
              <Select value={incomeType} onValueChange={setIncomeType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wallet">Main Wallet</SelectItem>
                  <SelectItem value="referral_income">Referral Income</SelectItem>
                  <SelectItem value="level_income">Level Income</SelectItem>
                  <SelectItem value="share_income">Share Income (Task)</SelectItem>
                  <SelectItem value="task_income">Task Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
              />
            </div>
            <div>
              <Label>Reason (Optional)</Label>
              <Textarea
                placeholder="Enter reason for adjustment"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 font-bold"
                onClick={() => handleAdjustBalance("increase")}
                disabled={processing}
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                Add Funds
              </Button>
              <Button
                variant="destructive"
                className="flex-1 font-bold"
                onClick={() => handleAdjustBalance("decrease")}
                disabled={processing}
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Minus className="w-4 h-4 mr-2" />}
                Deduct
              </Button>
            </div>
          </div>
        </div>
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
            placeholder="Search..."
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
                Status: {statusFilter}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("approved")}>Approved</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>Rejected</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => {
            const cols = mode === "withdraw" || mode === "withdrawal-history" ? csvColumns.withdrawals : mode === "add" ? csvColumns.deposits : csvColumns.walletHistory;
            exportToCSV(filteredData, mode, cols);
            toast({ title: "Exported successfully" });
          }}>
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
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Agent</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Amount</th>
                {(mode === "add" || mode === "withdraw") && (
                  <th className="text-left p-4 font-medium text-sm text-muted-foreground">
                    {mode === "add" ? "Transaction ID" : "Bank Details"}
                  </th>
                )}
                {mode === "history" && (
                  <th className="text-left p-4 font-medium text-sm text-muted-foreground">Description</th>
                )}
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Date</th>
                {(mode === "add" || mode === "withdraw") && (
                  <th className="text-right p-4 font-medium text-sm text-muted-foreground">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pendingItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <p className="font-medium">No records found</p>
                  </td>
                </tr>
              ) : (
                pendingItems.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <span className="font-bold text-white text-sm">
                            {(item.profile?.full_name || item.user_name || "U").charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {item.profile?.full_name || item.user_name || "Unknown"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.profile?.email || ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className={cn(
                          "font-bold text-lg",
                          mode === "history"
                            ? item.status === "credit" ? "text-emerald-500" : "text-destructive"
                            : "text-emerald-500"
                        )}>
                          {mode === "history" && (item.status === "credit" ? "+" : "-")}
                          ₹{Number(item.amount).toLocaleString()}
                        </span>
                        {item.type === 'plan' && (
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                            Plan: {item.plan_name}
                          </span>
                        )}
                      </div>
                    </td>
                    {mode === "add" && (
                      <td className="p-4">
                        <p className="font-mono text-sm">{item.transaction_id || "N/A"}</p>
                        {item.proof_image && (
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto"
                            onClick={() => setSelectedItem(item)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Proof
                          </Button>
                        )}
                      </td>
                    )}
                    {mode === "withdraw" && (
                      <td className="p-4">
                        {item.bank_details && (
                          <div className="text-sm">
                            <p className="font-medium">{item.bank_details.accountName}</p>
                            <p className="text-muted-foreground font-mono text-xs">
                              {item.bank_details.accountNumber}
                            </p>
                          </div>
                        )}
                      </td>
                    )}
                    {mode === "history" && (
                      <td className="p-4">
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </td>
                    )}
                    <td className="p-4">
                      {item.status === "pending" && (
                        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Pending</Badge>
                      )}
                      {item.status === "approved" && (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Approved</Badge>
                      )}
                      {item.status === "rejected" && (
                        <Badge className="bg-destructive/10 text-destructive border-destructive/20">Rejected</Badge>
                      )}
                      {item.status === "credit" && (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Credit
                        </Badge>
                      )}
                      {item.status === "debit" && (
                        <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          Debit
                        </Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    {(mode === "add" || mode === "withdraw") && item.status === "pending" && (
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => mode === "add" ? handleRejectDeposit(item) : handleRejectWithdrawal(item)}
                            disabled={processing}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          {mode === "add" ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-emerald-500 hover:bg-emerald-500/10"
                                onClick={() => handleApproveDeposit(item, "INR")}
                                disabled={processing}
                              >
                                INR
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-500 hover:bg-blue-500/10"
                                onClick={() => handleApproveDeposit(item, "USDT")}
                                disabled={processing}
                              >
                                USDT
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-emerald-500 hover:bg-emerald-500/10"
                              onClick={() => handleApproveWithdrawal(item)}
                              disabled={processing}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proof Image Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Payment Proof</DialogTitle>
          </DialogHeader>
          {selectedItem?.proof_image && (
            <img
              src={selectedItem.proof_image}
              alt="Payment proof"
              className="w-full rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletManagement;
