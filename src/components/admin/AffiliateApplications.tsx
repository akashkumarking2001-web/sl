import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
    Loader2,
    CheckCircle2,
    XCircle,
    Clock,
    User,
    Mail,
    Phone,
    MapPin,
    MessageSquare
} from "lucide-react";

interface AffiliateApplication {
    id: string;
    user_id: string;
    full_name: string;
    email: string;
    phone: string | null;
    address: string | null;
    why_join: string | null;
    experience: string | null;
    status: string;
    admin_notes: string | null;
    created_at: string;
}

export const AffiliateApplications = () => {
    const [applications, setApplications] = useState<AffiliateApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("affiliate_applications")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setApplications(data || []);
        } catch (error: any) {
            console.error("Error fetching applications:", error);
            toast({
                title: "Error",
                description: "Failed to load affiliate applications",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (applicationId: string, userId: string) => {
        try {
            setProcessingId(applicationId);

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { error } = await supabase
                .from("affiliate_applications")
                .update({
                    status: "approved",
                    approved_by: user.id,
                    approved_at: new Date().toISOString(),
                })
                .eq("id", applicationId);

            if (error) throw error;

            toast({
                title: "Application Approved",
                description: "The affiliate application has been approved successfully",
            });

            fetchApplications();
        } catch (error: any) {
            console.error("Error approving application:", error);
            toast({
                title: "Error",
                description: "Failed to approve application",
                variant: "destructive",
            });
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (applicationId: string) => {
        try {
            setProcessingId(applicationId);

            const { error } = await supabase
                .from("affiliate_applications")
                .update({
                    status: "rejected",
                })
                .eq("id", applicationId);

            if (error) throw error;

            toast({
                title: "Application Rejected",
                description: "The affiliate application has been rejected",
            });

            fetchApplications();
        } catch (error: any) {
            console.error("Error rejecting application:", error);
            toast({
                title: "Error",
                description: "Failed to reject application",
                variant: "destructive",
            });
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Approved</Badge>;
            case "rejected":
                return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
            default:
                return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Affiliate Applications</h2>
                    <p className="text-muted-foreground">Review and manage affiliate program applications</p>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2">
                    {applications.filter(a => a.status === "pending").length} Pending
                </Badge>
            </div>

            {applications.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <User className="w-12 h-12 text-muted-foreground/50 mb-4" />
                        <p className="text-lg font-semibold text-muted-foreground">No applications yet</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {applications.map((app) => (
                        <Card key={app.id} className="border-2">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="w-5 h-5" />
                                            {app.full_name}
                                        </CardTitle>
                                        <CardDescription>
                                            Applied on {new Date(app.created_at).toLocaleDateString()}
                                        </CardDescription>
                                    </div>
                                    {getStatusBadge(app.status)}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <span>{app.email}</span>
                                    </div>
                                    {app.phone && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            <span>{app.phone}</span>
                                        </div>
                                    )}
                                    {app.address && (
                                        <div className="flex items-center gap-2 text-sm col-span-2">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                            <span>{app.address}</span>
                                        </div>
                                    )}
                                </div>

                                {app.why_join && (
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase flex items-center gap-2">
                                            <MessageSquare className="w-3 h-3" />
                                            Why Join
                                        </Label>
                                        <p className="text-sm bg-muted p-3 rounded-lg">{app.why_join}</p>
                                    </div>
                                )}

                                {app.experience && (
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase flex items-center gap-2">
                                            <MessageSquare className="w-3 h-3" />
                                            Experience
                                        </Label>
                                        <p className="text-sm bg-muted p-3 rounded-lg">{app.experience}</p>
                                    </div>
                                )}

                                {app.status === "pending" && (
                                    <div className="flex gap-3 pt-4 border-t">
                                        <Button
                                            onClick={() => handleApprove(app.id, app.user_id)}
                                            disabled={processingId === app.id}
                                            className="flex-1"
                                        >
                                            {processingId === app.id ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                            )}
                                            Approve
                                        </Button>
                                        <Button
                                            onClick={() => handleReject(app.id)}
                                            disabled={processingId === app.id}
                                            variant="destructive"
                                            className="flex-1"
                                        >
                                            {processingId === app.id ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <XCircle className="w-4 h-4 mr-2" />
                                            )}
                                            Reject
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={className}>{children}</div>;
}
