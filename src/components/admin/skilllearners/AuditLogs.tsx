import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ShieldCheck, History } from "lucide-react";

const AuditLogs = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("audit_logs")
            .select(`
        *,
        profiles:user_id (full_name, email)
      `)
            .order("created_at", { ascending: false })
            .limit(100);

        if (error) console.error("Error fetching logs:", error);
        else setLogs(data || []);
        setLoading(false);
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'create': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'update': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'delete': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            case 'toggle_status': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'status_update': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
            default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">System Audit logs</h2>
                    <p className="text-muted-foreground">Track all critical administrative actions.</p>
                </div>
                <ShieldCheck className="w-8 h-8 text-primary/40" />
            </div>

            <Card className="border-border/40 bg-card/40 backdrop-blur-md">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <History className="w-4 h-4" />
                        Recent Activity
                    </CardTitle>
                    <Badge variant="outline" className="font-mono">{logs.length} Entries</Badge>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="rounded-md border border-border/40 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead>Admin</TableHead>
                                        <TableHead>Action</TableHead>
                                        <TableHead>Entity</TableHead>
                                        <TableHead>Details</TableHead>
                                        <TableHead className="text-right">Timestamp</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                                No audit logs found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        logs.map((log) => (
                                            <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm">{log.profiles?.full_name || 'System'}</span>
                                                        <span className="text-[10px] text-muted-foreground">{log.profiles?.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={getActionColor(log.action)}>
                                                        {log.action.toUpperCase()}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-xs uppercase tracking-wider text-primary/70">{log.entity_type}</span>
                                                        <span className="text-[10px] text-muted-foreground font-mono truncate w-24">{log.entity_id}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="max-w-xs truncate text-xs">
                                                    {JSON.stringify(log.details)}
                                                </TableCell>
                                                <TableCell className="text-right text-[10px] font-mono whitespace-nowrap">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AuditLogs;
