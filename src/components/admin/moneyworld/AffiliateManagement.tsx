import { useState, useEffect } from "react";
import {
    Loader2,
    CheckCircle2,
    XCircle,
    Search,
    Filter,
    UserCheck,
    Clock,
    Shield,
    MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { logAudit } from "@/lib/audit";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

interface AffiliateApplication {
    id: string;
    user_id: string;
    full_name: string;
    email: string;
    phone: string;
    why_join: string;
    experience: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at?: string;
    profiles?: {
        full_name: string;
        email: string;
    };
}

const AffiliateManagement = ({ onRefresh }: { onRefresh?: () => void }) => {
    const [applications, setApplications] = useState<AffiliateApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedApp, setSelectedApp] = useState<AffiliateApplication | null>(null);
    const [adminNotes, setAdminNotes] = useState("");
    const [activeTab, setActiveTab] = useState("pending");
    const { toast } = useToast();

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("affiliate_applications")
                .select(`
                    *,
                    profiles:user_id (full_name, email)
                `)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setApplications((data as any) || []);
        } catch (error) {
            console.error("Error fetching applications:", error);
            toast({
                title: "Error",
                description: "Failed to load affiliate applications.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
        setProcessingId(id);
        try {
            const { error } = await supabase
                .from("affiliate_applications")
                .update({
                    status,
                    admin_notes: adminNotes,
                    approved_at: status === 'approved' ? new Date().toISOString() : null,
                    // approved_by: user.id - handled by backend or trigger usually, or manually here if needed
                })
                .eq("id", id);

            if (error) throw error;

            // Audit Log
            await logAudit('status_update', 'affiliate', id, {
                status,
                admin_notes: adminNotes
            });

            toast({
                title: `Application ${status === 'approved' ? 'Approved' : 'Rejected'}`,
                description: "Status has been updated successfully.",
            });

            setAdminNotes("");
            setSelectedApp(null);
            fetchApplications();
            if (onRefresh) onRefresh();

        } catch (error: any) {
            console.error("Error updating status:", error);
            toast({
                title: "Update Failed",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setProcessingId(null);
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch =
            app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTab =
            activeTab === 'pending' ? app.status === 'pending' :
                activeTab === 'approved' ? app.status === 'approved' :
                    activeTab === 'rejected' ? app.status === 'rejected' : true;

        return matchesSearch && matchesTab;
    });

    if (loading) {
        return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search affiliates..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-md">
                    <TabsTrigger value="pending">Pending ({applications.filter(a => a.status === 'pending').length})</TabsTrigger>
                    <TabsTrigger value="approved">Active</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Applicant</TableHead>
                                    <TableHead>Applied On</TableHead>
                                    <TableHead>Experience</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredApplications.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            No applications found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredApplications.map((app) => (
                                        <TableRow key={app.id}>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{app.full_name}</span>
                                                    <span className="text-xs text-muted-foreground">{app.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(app.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate" title={app.experience}>
                                                {app.experience || "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        app.status === 'approved' ? 'default' :
                                                            app.status === 'rejected' ? 'destructive' : 'secondary'
                                                    }
                                                    className="capitalize"
                                                >
                                                    {app.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" onClick={() => setSelectedApp(app)}>
                                                            View Details
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-md">
                                                        <DialogHeader>
                                                            <DialogTitle>Application Details</DialogTitle>
                                                            <DialogDescription>
                                                                Review affiliate application for {app.full_name}
                                                            </DialogDescription>
                                                        </DialogHeader>

                                                        <div className="space-y-4 py-4">
                                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                                <div>
                                                                    <span className="text-muted-foreground block text-xs uppercase">Email</span>
                                                                    <span className="font-medium">{app.email}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-muted-foreground block text-xs uppercase">Phone</span>
                                                                    <span className="font-medium">{app.phone || "N/A"}</span>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-1">
                                                                <span className="text-muted-foreground text-xs uppercase">Why Join?</span>
                                                                <p className="text-sm bg-muted/50 p-3 rounded-md">{app.why_join}</p>
                                                            </div>

                                                            <div className="space-y-1">
                                                                <span className="text-muted-foreground text-xs uppercase">Experience</span>
                                                                <p className="text-sm bg-muted/50 p-3 rounded-md">{app.experience || "None provided"}</p>
                                                            </div>

                                                            {app.status === 'pending' && (
                                                                <div className="space-y-2 pt-4 border-t">
                                                                    <Textarea
                                                                        placeholder="Add admin notes (optional)..."
                                                                        value={adminNotes}
                                                                        onChange={(e) => setAdminNotes(e.target.value)}
                                                                    />
                                                                    <div className="flex gap-2 justify-end">
                                                                        <Button
                                                                            variant="destructive"
                                                                            onClick={() => handleStatusUpdate(app.id, 'rejected')}
                                                                            disabled={!!processingId}
                                                                        >
                                                                            {processingId === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reject"}
                                                                        </Button>
                                                                        <Button
                                                                            className="bg-emerald-600 hover:bg-emerald-700"
                                                                            onClick={() => handleStatusUpdate(app.id, 'approved')}
                                                                            disabled={!!processingId}
                                                                        >
                                                                            {processingId === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve"}
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {app.status !== 'pending' && (
                                                                <div className="pt-2 text-center text-sm text-muted-foreground italic">
                                                                    Application processed on {new Date(app.updated_at || "").toLocaleDateString()}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AffiliateManagement;
