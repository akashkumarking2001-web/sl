import { useState, useEffect } from "react";
import { Loader2, Ban, Trash2, UserCheck, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logAudit } from "@/lib/audit";

interface UserActionsProps {
  mode: "block" | "delete";
  onRefresh: () => void;
}

const UserActions = ({ mode, onRefresh }: UserActionsProps) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; user: any | null }>({ open: false, user: null });
  const { toast } = useToast();

  useEffect(() => { fetchUsers(); }, [mode]);

  const fetchUsers = async () => {
    setLoading(true);
    let query = supabase.from("profiles").select("*");

    if (mode === "block") {
      // Show all users for blocking/unblocking
      query = query.order("created_at", { ascending: false });
    } else {
      // For delete, show all
      query = query.order("created_at", { ascending: false });
    }

    const { data } = await query;
    setUsers(data || []);
    setLoading(false);
  };

  const handleBlock = async (user: any) => {
    const newStatus = user.status === "blocked" ? "active" : "blocked";
    await supabase.from("profiles").update({ status: newStatus }).eq("id", user.id);
    toast({ title: newStatus === "blocked" ? "Student Blocked" : "Student Unblocked" });

    await logAudit(
      'toggle_status',
      'user',
      user.id,
      { email: user.email, status: newStatus }
    );

    fetchUsers();
    onRefresh();
    setConfirmDialog({ open: false, user: null });
  };

  const handleDelete = async (user: any) => {
    // Delete from profiles (auth user remains but profile is removed)
    await supabase.from("profiles").delete().eq("id", user.id);
    toast({ title: "Student Deleted", variant: "destructive" });

    await logAudit(
      'delete',
      'user',
      user.id,
      { email: user.email }
    );

    fetchUsers();
    onRefresh();
    setConfirmDialog({ open: false, user: null });
  };

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.referral_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="text-left p-4 text-sm text-muted-foreground">Student</th>
              <th className="text-left p-4 text-sm text-muted-foreground">Email</th>
              <th className="text-left p-4 text-sm text-muted-foreground">Status</th>
              <th className="text-left p-4 text-sm text-muted-foreground">Joined</th>
              <th className="text-right p-4 text-sm text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-muted/30">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="font-bold text-white text-sm">{(user.full_name || "U").charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{user.full_name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground font-mono">{user.referral_code}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">
                  <div>
                    {user.email}
                    {user.is_email_verified && (
                      <Badge className="ml-2 h-4 px-1 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px]">VERIFIED</Badge>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  {user.status === "blocked" ? (
                    <Badge className="bg-destructive/10 text-destructive">Blocked</Badge>
                  ) : (
                    <Badge className="bg-emerald-500/10 text-emerald-500">Active</Badge>
                  )}
                </td>
                <td className="p-4 text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  {mode === "block" ? (
                    <Button
                      variant={user.status === "blocked" ? "outline" : "destructive"}
                      size="sm"
                      onClick={() => setConfirmDialog({ open: true, user })}
                    >
                      {user.status === "blocked" ? (
                        <><UserCheck className="w-4 h-4 mr-1" />Unblock</>
                      ) : (
                        <><Ban className="w-4 h-4 mr-1" />Block</>
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setConfirmDialog({ open: true, user })}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />Delete
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ open: false, user: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {mode === "block"
                ? (confirmDialog.user?.status === "blocked" ? "Unblock Student?" : "Block Student?")
                : "Delete Student?"
              }
            </AlertDialogTitle>
            <AlertDialogDescription>
              {mode === "block"
                ? confirmDialog.user?.status === "blocked"
                  ? `This will restore access for ${confirmDialog.user?.full_name || "this student"}.`
                  : `This will prevent ${confirmDialog.user?.full_name || "this student"} from accessing the platform.`
                : `This will permanently remove ${confirmDialog.user?.full_name || "this student"} from the system. This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => mode === "block" ? handleBlock(confirmDialog.user) : handleDelete(confirmDialog.user)}
              className={mode === "delete" ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              {mode === "block"
                ? (confirmDialog.user?.status === "blocked" ? "Unblock" : "Block")
                : "Delete"
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserActions;