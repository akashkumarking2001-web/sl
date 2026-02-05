import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Shield,
    Search,
    Filter,
    Download,
    RefreshCw,
    Eye,
    Clock,
    User,
    FileText,
} from 'lucide-react';
import { format } from 'date-fns';

interface AuditLog {
    id: string;
    user_id: string | null;
    action: string;
    entity_type: string;
    entity_id: string | null;
    details: any;
    created_at: string;
}

const AuditLogsViewer = () => {
    const { toast } = useToast();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAction, setFilterAction] = useState<string>('all');
    const [filterEntity, setFilterEntity] = useState<string>('all');
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

    // Fetch audit logs
    const fetchLogs = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('audit_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);

            if (filterAction !== 'all') {
                query = query.eq('action', filterAction);
            }

            if (filterEntity !== 'all') {
                query = query.eq('entity_type', filterEntity);
            }

            if (searchTerm) {
                query = query.or(
                    `user_id.ilike.%${searchTerm}%,entity_id.ilike.%${searchTerm}%,action.ilike.%${searchTerm}%`
                );
            }

            const { data, error } = await query;

            if (error) throw error;

            setLogs(data || []);
        } catch (error: any) {
            console.error('Error fetching audit logs:', error);
            toast({
                title: 'Error',
                description: 'Failed to load audit logs',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [filterAction, filterEntity, searchTerm]);

    // Export logs to CSV
    const exportToCSV = () => {
        const headers = ['Timestamp', 'User ID', 'Action', 'Entity Type', 'Entity ID', 'Details'];
        const rows = logs.map((log) => [
            format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss'),
            log.user_id || 'System',
            log.action,
            log.entity_type,
            log.entity_id || 'N/A',
            JSON.stringify(log.details || {}),
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        toast({
            title: 'Export Successful',
            description: `${logs.length} logs exported to CSV`,
        });
    };

    // Get action badge color
    const getActionBadgeVariant = (action: string) => {
        if (action.includes('create') || action.includes('approve')) return 'default';
        if (action.includes('update') || action.includes('edit')) return 'secondary';
        if (action.includes('delete') || action.includes('reject')) return 'destructive';
        return 'outline';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold font-display">Audit Logs</h2>
                        <p className="text-sm text-muted-foreground">
                            Complete activity history and system events
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportToCSV} disabled={logs.length === 0}>
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by user ID, entity ID, or action..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Select value={filterAction} onValueChange={setFilterAction}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by action" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Actions</SelectItem>
                        <SelectItem value="create">Create</SelectItem>
                        <SelectItem value="update">Update</SelectItem>
                        <SelectItem value="delete">Delete</SelectItem>
                        <SelectItem value="approve">Approve</SelectItem>
                        <SelectItem value="reject">Reject</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filterEntity} onValueChange={setFilterEntity}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by entity" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Entities</SelectItem>
                        <SelectItem value="payment">Payments</SelectItem>
                        <SelectItem value="user">Users</SelectItem>
                        <SelectItem value="order">Orders</SelectItem>
                        <SelectItem value="withdrawal">Withdrawals</SelectItem>
                        <SelectItem value="task">Tasks</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-xl bg-card border border-border/50 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{logs.length}</p>
                            <p className="text-xs text-muted-foreground">Total Logs</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-card border border-border/50 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-emerald" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {logs.filter((l) => {
                                    const diff = Date.now() - new Date(l.created_at).getTime();
                                    return diff < 24 * 60 * 60 * 1000;
                                }).length}
                            </p>
                            <p className="text-xs text-muted-foreground">Last 24 Hours</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-card border border-border/50 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-amber" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {new Set(logs.map((l) => l.user_id).filter(Boolean)).size}
                            </p>
                            <p className="text-xs text-muted-foreground">Unique Users</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-card border border-border/50 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-violet/10 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-violet" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {logs.filter((l) => l.action.includes('approve') || l.action.includes('reject')).length}
                            </p>
                            <p className="text-xs text-muted-foreground">Admin Actions</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logs Table */}
            <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>User ID</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Entity Type</TableHead>
                            <TableHead>Entity ID</TableHead>
                            <TableHead className="text-right">Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12">
                                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">Loading audit logs...</p>
                                </TableCell>
                            </TableRow>
                        ) : logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12">
                                    <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                                    <p className="text-muted-foreground">No audit logs found</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Try adjusting your filters
                                    </p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log) => (
                                <TableRow key={log.id} className="hover:bg-muted/50 transition-colors">
                                    <TableCell className="font-mono text-xs">
                                        {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm:ss')}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                        {log.user_id ? log.user_id.slice(0, 8) : 'System'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getActionBadgeVariant(log.action)}>
                                            {log.action}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-medium">{log.entity_type}</span>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                        {log.entity_id ? log.entity_id.slice(0, 8) : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSelectedLog(log)}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Details Modal */}
            {selectedLog && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedLog(null)}
                >
                    <div
                        className="bg-card rounded-2xl border border-border/50 max-w-2xl w-full max-h-[80vh] overflow-auto p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Audit Log Details</h3>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedLog(null)}>
                                ✕
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                                <p className="font-mono text-sm">
                                    {format(new Date(selectedLog.created_at), 'PPpp')}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">User ID</label>
                                <p className="font-mono text-sm">{selectedLog.user_id || 'System'}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Action</label>
                                <p className="text-sm">
                                    <Badge variant={getActionBadgeVariant(selectedLog.action)}>
                                        {selectedLog.action}
                                    </Badge>
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Entity</label>
                                <p className="text-sm">
                                    {selectedLog.entity_type} ({selectedLog.entity_id || 'N/A'})
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Details</label>
                                <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto max-h-60">
                                    {JSON.stringify(selectedLog.details, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuditLogsViewer;
