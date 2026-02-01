import { useState, useEffect } from "react";
import { Search, Loader2, Check, X, Eye, Download, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV, csvColumns } from "@/lib/csvExport";
import { distributeAllIncomesSecure } from "@/lib/incomeDistributionSecure";

interface PackagePurchaseApprovalProps {
  onRefresh: () => void;
}

const PackagePurchaseApproval = ({ onRefresh }: PackagePurchaseApprovalProps) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles
      const userIds = [...new Set(data?.map(r => r.user_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, email, phone")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      const requestsWithProfiles = data?.map(r => ({
        ...r,
        package_name: r.plan_name, // Map for compatibility with existing UI
        profile: profileMap.get(r.user_id),
      })) || [];

      setRequests(requestsWithProfiles);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
    setLoading(false);
  };

  const handleApprove = async (request: any) => {
    setProcessing(true);
    try {
      // Update request status
      const { error: updateError } = await supabase
        .from("payments")
        .update({
          status: "approved",
          admin_notes: adminNotes,
          processed_at: new Date().toISOString(),
        })
        .eq("id", request.id);

      if (updateError) throw updateError;

      // Update user profile with purchased package
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          has_purchased: true,
          purchased_plan: request.plan_name,
          package: request.plan_name,
          status: "active",
        })
        .eq("user_id", request.user_id);

      if (profileError) throw profileError;

      // DISTRIBUTE ALL INCOMES
      const incomeDistributed = await distributeAllIncomesSecure(request.user_id, request.plan_name);

      toast({
        title: "Payment Approved",
        description: `Student activated with ${request.plan_name}. ${incomeDistributed ? 'Incomes distributed.' : 'Note: Income trigger requires verification.'}`
      });

      setSelectedRequest(null);
      setAdminNotes("");
      fetchRequests();
      onRefresh();
    } catch (error: any) {
      console.error("Error approving:", error);
      toast({ title: "Error", description: error.message || "Failed to approve payment", variant: "destructive" });
    }
    setProcessing(false);
  };

  const handleReject = async (request: any) => {
    setProcessing(true);
    try {
      const { error } = await supabase
        .from("payments")
        .update({
          status: "rejected",
          admin_notes: adminNotes,
          processed_at: new Date().toISOString(),
        })
        .eq("id", request.id);

      if (error) throw error;

      toast({ title: "Payment Rejected", variant: "destructive" });
      setSelectedRequest(null);
      setAdminNotes("");
      fetchRequests();
      onRefresh();
    } catch (error: any) {
      console.error("Error rejecting:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setProcessing(false);
  };

  const pendingRequests = requests.filter(r => r.status === "pending");
  const filteredRequests = pendingRequests.filter(r =>
    r.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.package_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    exportToCSV(requests, "package_requests", csvColumns.packageRequests);
    toast({ title: "Exported successfully" });
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
      {/* Summary */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Pending Package Requests</p>
            <p className="text-3xl font-bold text-amber-500">{pendingRequests.length}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
            <Package className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or package..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">User</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Package</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Amount</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Date</th>
                <th className="text-right p-4 font-medium text-sm text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <p className="font-medium">No pending package requests</p>
                    <p className="text-sm text-muted-foreground">All requests have been processed</p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <span className="font-bold text-white text-sm">
                            {(request.profile?.full_name || "U").charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{request.profile?.full_name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground">{request.profile?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        {request.package_name}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-emerald-500">₹{Number(request.amount).toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                        Pending
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedRequest(request)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleReject(request)}
                          disabled={processing}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-emerald-500"
                          onClick={() => handleApprove(request)}
                          disabled={processing}
                        >
                          <Check className="w-4 h-4" />
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

      {/* Detail Modal */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Package Purchase Request</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">User</p>
                  <p className="font-medium">{selectedRequest.profile?.full_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedRequest.profile?.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedRequest.profile?.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Package</p>
                  <Badge className="bg-primary/10 text-primary">{selectedRequest.package_name}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Transaction ID / UTR</p>
                  <p className="font-mono font-bold text-primary break-all">{selectedRequest.transaction_id || "MISSING_UTR"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Amount</p>
                  <p className="font-bold text-emerald-500 text-lg">₹{Number(selectedRequest.amount).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Request Date</p>
                  <p className="font-medium">{new Date(selectedRequest.created_at).toLocaleString()}</p>
                </div>
              </div>

              {selectedRequest.screenshot_url && (
                <div>
                  <p className="text-sm font-bold mb-2">Payment Proof (Screenshot)</p>
                  <div className="rounded-xl overflow-hidden border border-border bg-muted/20">
                    <img
                      src={selectedRequest.screenshot_url}
                      alt="Payment Proof"
                      className="w-full h-auto object-contain cursor-zoom-in"
                      onClick={() => window.open(selectedRequest.screenshot_url, '_blank')}
                    />
                  </div>
                </div>
              )}

              <div>
                <Label>Admin Notes</Label>
                <Textarea
                  placeholder="Add notes (optional)"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleReject(selectedRequest)}
                  disabled={processing}
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                  onClick={() => handleApprove(selectedRequest)}
                  disabled={processing}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve Package
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PackagePurchaseApproval;
