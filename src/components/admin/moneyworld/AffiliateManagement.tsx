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
    MoreHorizontal,
    Mail,
    Phone,
    Calendar,
    ChevronRight,
    Briefcase,
    Zap,
    ExternalLink
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
import { cn } from "@/lib/utils";

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
                })
                .eq("id", id);

            if (error) throw error;

            await logAudit('status_update', 'affiliate', id, {
                status,
                admin_notes: adminNotes
            });

            toast({
                title: `Application ${status === 'approved' ? 'Approved' : 'Rejected'}`,
                description: "The applicant's status has been updated.",
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
            (app.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (app.email || "").toLowerCase().includes(searchQuery.toLowerCase());

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
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black flex items-center gap-3">
                        <UserCheck className="w-8 h-8 text-blue-500" />
                        Affiliate Command
                    </h2>
                    <p className="text-muted-foreground font-medium">Review and process partnership applications.</p>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-12 h-12 rounded-2xl bg-card border-border/50 focus:ring-primary/20 transition-all font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-md bg-muted/50 p-1 rounded-2xl h-14 border border-border/50">
                    <TabsTrigger value="pending" className="rounded-xl gap-2 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <Clock className="w-4 h-4" />
                        Pending
                        <Badge variant="secondary" className="ml-1 h-5 min-w-5 flex items-center justify-center p-0 text-[10px] font-black">
                            {applications.filter(a => a.status === 'pending').length}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="approved" className="rounded-xl gap-2 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Approved
                    </TabsTrigger>
                    <TabsTrigger value="rejected" className="rounded-xl gap-2 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <XCircle className="w-4 h-4 text-rose-500" />
                        Rejected
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="relative overflow-hidden glass-card rounded-[2.5rem] border border-border/40 bg-card/30 shadow-2xl backdrop-blur-md">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="hover:bg-transparent border-border/40">
                                        <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest pl-8">Applicant Intelligence</TableHead>
                                        <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest">Submission Date</TableHead>
                                        <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest">Growth Plan</TableHead>
                                        <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest">Verification</TableHead>
                                        <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest text-right pr-8">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredApplications.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="py-24 text-center">
                                                <div className="flex flex-col items-center gap-4 opacity-40">
                                                    <Shield className="w-16 h-16" />
                                                    <p className="font-bold text-lg italic">No data found in this transmission.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredApplications.map((app) => (
                                            <TableRow key={app.id} className="hover:bg-muted/10 transition-colors border-border/20 group">
                                                <TableCell className="py-5 pl-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-black text-primary border border-primary/20">
                                                            {app.full_name?.charAt(0) || 'U'}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-base">{app.full_name}</span>
                                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <Mail className="w-3 h-3" /> {app.email}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-5">
                                                    <div className="flex items-center gap-2 font-bold text-sm">
                                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                                        {new Date(app.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-5 max-w-xs">
                                                    <p className="text-xs text-muted-foreground line-clamp-2 font-medium leading-relaxed italic">
                                                        "{app.why_join?.substring(0, 100)}..."
                                                    </p>
                                                </TableCell>
                                                <TableCell className="py-5">
                                                    <Badge
                                                        className={cn(
                                                            "font-black uppercase text-[10px] px-3 py-1 rounded-full border-none",
                                                            app.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                                                                app.status === 'rejected' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                                                        )}
                                                    >
                                                        {app.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-5 text-right pr-8">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="rounded-xl font-bold bg-background/50 hover:bg-primary hover:text-white transition-all border-border/50"
                                                                onClick={() => {
                                                                    setSelectedApp(app);
                                                                    setAdminNotes(app.status !== 'pending' ? (app as any).admin_notes || "" : "");
                                                                }}
                                                            >
                                                                Inspect <ChevronRight className="w-4 h-4 ml-1" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-2xl rounded-[2rem] p-0 overflow-hidden border-none shadow-3xl bg-background">
                                                            <div className="relative h-2 bg-primary w-full"></div>
                                                            <div className="p-8 space-y-8">
                                                                <DialogHeader>
                                                                    <div className="flex items-center gap-4 mb-4">
                                                                        <div className="w-16 h-16 rounded-[1.25rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                                                            <Shield className="w-8 h-8" />
                                                                        </div>
                                                                        <div>
                                                                            <DialogTitle className="text-3xl font-black tracking-tight">{app.full_name}</DialogTitle>
                                                                            <DialogDescription className="font-bold text-primary flex items-center gap-1">
                                                                                <Zap className="w-4 h-4 fill-current" /> Affiliate Dossier
                                                                            </DialogDescription>
                                                                        </div>
                                                                    </div>
                                                                </DialogHeader>

                                                                <div className="grid md:grid-cols-2 gap-8">
                                                                    <div className="space-y-6">
                                                                        <div className="space-y-4">
                                                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b pb-2">Direct Contact</h4>
                                                                            <div className="space-y-3">
                                                                                <div className="flex items-center gap-3">
                                                                                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground"><Mail className="w-4 h-4" /></div>
                                                                                    <span className="font-bold text-sm">{app.email}</span>
                                                                                </div>
                                                                                <div className="flex items-center gap-3">
                                                                                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground"><Phone className="w-4 h-4" /></div>
                                                                                    <span className="font-bold text-sm">{app.phone || "Not Listed"}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="space-y-4">
                                                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b pb-2">Professional Experience</h4>
                                                                            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 text-sm font-medium leading-relaxed italic">
                                                                                {app.experience || "No previous records provided."}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-6">
                                                                        <div className="space-y-4">
                                                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b pb-2">Strategic Vision</h4>
                                                                            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 text-sm font-medium leading-relaxed">
                                                                                {app.why_join}
                                                                            </div>
                                                                        </div>

                                                                        {app.status === 'pending' ? (
                                                                            <div className="space-y-4 pt-4">
                                                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Admin Verdict</h4>
                                                                                <Textarea
                                                                                    placeholder="Enter internal notes or feedback..."
                                                                                    className="min-h-[100px] rounded-[1.25rem] bg-card/50 border-border/50 focus:ring-primary/20 text-sm p-4"
                                                                                    value={adminNotes}
                                                                                    onChange={(e) => setAdminNotes(e.target.value)}
                                                                                />
                                                                                <div className="flex gap-3">
                                                                                    <Button
                                                                                        variant="destructive"
                                                                                        className="flex-1 h-14 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-rose-500/20"
                                                                                        onClick={() => handleStatusUpdate(app.id, 'rejected')}
                                                                                        disabled={!!processingId}
                                                                                    >
                                                                                        {processingId === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-5 h-5 mr-2" />}
                                                                                        Reject
                                                                                    </Button>
                                                                                    <Button
                                                                                        className="flex-1 h-14 rounded-2xl font-black text-sm uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
                                                                                        onClick={() => handleStatusUpdate(app.id, 'approved')}
                                                                                        disabled={!!processingId}
                                                                                    >
                                                                                        {processingId === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                                                                                        Approve
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="p-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/20 border border-border/50 flex flex-col items-center justify-center text-center space-y-3">
                                                                                <div className={cn(
                                                                                    "w-12 h-12 rounded-full flex items-center justify-center border-4",
                                                                                    app.status === 'approved' ? "bg-emerald-500 text-white border-emerald-500/20" : "bg-rose-500 text-white border-rose-500/20"
                                                                                )}>
                                                                                    {app.status === 'approved' ? <Briefcase className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                                                                                </div>
                                                                                <div>
                                                                                    <h5 className="font-black uppercase text-[10px] tracking-widest text-muted-foreground mb-1">Status Finalized</h5>
                                                                                    <p className="font-black text-lg capitalize">{app.status}</p>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
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
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AffiliateManagement;
