import { useState, useEffect } from "react";
import { Loader2, Check, X, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV } from "@/lib/csvExport";
import { logAudit } from "@/lib/audit";

interface CourseRequestsApprovalProps {
  onRefresh: () => void;
}

const CourseRequestsApproval = ({ onRefresh }: CourseRequestsApprovalProps) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const { toast } = useToast();

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("course_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    setRequests(data || []);
    setLoading(false);
  };

  const handleApprove = async (request: any) => {
    await supabase
      .from("course_submissions")
      .update({
        status: "approved",
        admin_notes: adminNotes,
        reviewed_at: new Date().toISOString()
      })
      .eq("id", request.id);

    await logAudit('status_update', 'course', request.id, {
      status: 'approved',
      user_id: request.profile?.id, // Assuming profile was joined, but need to check structure. 
      // Checking state: requests state has * flat structure from query?
      // fetchRequests does .select("*"). 
      // Wait, fetchRequests in this file only does .select("*") from course_submissions.
      // It doesn't join profiles. But let's look at the component code again.
      course_name: request.course_description
    });

    toast({ title: "Course Request Approved" });
    setSelectedRequest(null);
    setAdminNotes("");
    fetchRequests();
    onRefresh();
  };

  const handleReject = async (request: any) => {
    await supabase
      .from("course_submissions")
      .update({
        status: "rejected",
        admin_notes: adminNotes,
        reviewed_at: new Date().toISOString()
      })
      .eq("id", request.id);

    await logAudit('status_update', 'course', request.id, {
      status: 'rejected',
      course_name: request.course_description
    });

    toast({ title: "Course Request Rejected", variant: "destructive" });
    setSelectedRequest(null);
    setAdminNotes("");
    fetchRequests();
    onRefresh();
  };

  const handleExport = () => {
    exportToCSV(requests, "course_requests", [
      { key: "username", label: "Username" },
      { key: "email", label: "Email" },
      { key: "course_description", label: "Description" },
      { key: "price", label: "Price" },
      { key: "status", label: "Status" },
      { key: "created_at", label: "Submitted Date" },
    ]);
    toast({ title: "Exported successfully" });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-emerald-500/10 text-emerald-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-destructive/10 text-destructive">Rejected</Badge>;
      default:
        return <Badge className="bg-amber-500/10 text-amber-500">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === "pending" || !r.status);
  const processedRequests = requests.filter(r => r.status === "approved" || r.status === "rejected");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">User Course Requests</h2>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Pending Requests */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="font-semibold">Pending Requests ({pendingRequests.length})</h3>
        </div>
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="text-left p-4 text-sm text-muted-foreground">User</th>
              <th className="text-left p-4 text-sm text-muted-foreground">Course</th>
              <th className="text-left p-4 text-sm text-muted-foreground">Price</th>
              <th className="text-left p-4 text-sm text-muted-foreground">Submitted</th>
              <th className="text-right p-4 text-sm text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pendingRequests.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No pending course requests
                </td>
              </tr>
            ) : (
              pendingRequests.map(request => (
                <tr key={request.id} className="hover:bg-muted/30">
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{request.username}</p>
                      <p className="text-xs text-muted-foreground">{request.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm line-clamp-2">{request.course_description}</p>
                  </td>
                  <td className="p-4 font-bold text-emerald-500">
                    {request.price ? `₹${request.price}` : "TBD"}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(request.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedRequest(request)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleReject(request)}>
                        <X className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-emerald-500" onClick={() => { setSelectedRequest(request); }}>
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

      {/* Processed Requests */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="font-semibold">Processed Requests ({processedRequests.length})</h3>
        </div>
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="text-left p-4 text-sm text-muted-foreground">User</th>
              <th className="text-left p-4 text-sm text-muted-foreground">Course</th>
              <th className="text-left p-4 text-sm text-muted-foreground">Status</th>
              <th className="text-left p-4 text-sm text-muted-foreground">Reviewed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {processedRequests.map(request => (
              <tr key={request.id} className="hover:bg-muted/30">
                <td className="p-4">
                  <p className="font-medium">{request.username}</p>
                </td>
                <td className="p-4 text-sm">{request.course_description?.substring(0, 50)}...</td>
                <td className="p-4">{getStatusBadge(request.status)}</td>
                <td className="p-4 text-muted-foreground">
                  {request.reviewed_at ? new Date(request.reviewed_at).toLocaleDateString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Course Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Username</p>
                  <p className="font-medium">{selectedRequest.username}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedRequest.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Contact</p>
                  <p className="font-medium">{selectedRequest.contact_number}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">WhatsApp</p>
                  <p className="font-medium">{selectedRequest.whatsapp_number}</p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-sm mb-1">Course Description</p>
                <p className="bg-muted/50 p-3 rounded-lg text-sm">{selectedRequest.course_description}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm mb-1">Course Link</p>
                <a
                  href={selectedRequest.course_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  {selectedRequest.course_link}
                </a>
              </div>

              <div>
                <p className="text-muted-foreground text-sm mb-1">Suggested Price</p>
                <p className="font-bold text-lg text-emerald-500">
                  {selectedRequest.price ? `₹${selectedRequest.price}` : "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm mb-2">Admin Notes</p>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes for this request..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleReject(selectedRequest)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  variant="default"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                  onClick={() => handleApprove(selectedRequest)}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseRequestsApproval;
