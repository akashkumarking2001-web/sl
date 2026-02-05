import { useState, useEffect } from "react";
import { Loader2, Trash2, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { logAudit } from "@/lib/audit";

const AdsManagement = () => {
  const { isAdmin, loading: roleLoading } = useAdminCheck();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", vendor: "" });
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) {
      fetchAds();
    }
  }, [isAdmin]);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("ads_management").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setAds(data || []);
    } catch (error: any) {
      toast({ title: "Error fetching ads", description: error.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!form.title.trim()) { toast({ title: "Enter title", variant: "destructive" }); return; }
    if (form.title.length > 50) { toast({ title: "Title too long", description: "Max 50 chars", variant: "destructive" }); return; }

    try {
      const { error } = await supabase.from("ads_management").insert({ ads_title: form.title, ads_vendor: form.vendor });
      if (error) throw error;
      toast({ title: "Ad Created", description: "The ad is now live." });

      await logAudit('create', 'ad', form.title, { vendor: form.vendor });

      setForm({ title: "", vendor: "" });
      fetchAds();
    } catch (error: any) {
      toast({ title: "Creation Failed", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ad?")) return;
    try {
      const { error } = await supabase.from("ads_management").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Deleted", description: "Ad removed successfully." });

      await logAudit('delete', 'ad', id, { ad_id: id });

      fetchAds();
    } catch (error: any) {
      toast({ title: "Delete Failed", description: error.message, variant: "destructive" });
    }
  };

  if (roleLoading || (loading && isAdmin)) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-destructive">
        <AlertCircle className="w-12 h-12 mb-4" />
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl max-w-lg space-y-4">
        <h3 className="font-bold text-lg">Create Ad</h3>
        <div className="grid gap-3">
          <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ad Title" /></div>
          <div><Label>Vendor</Label><Input value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} placeholder="Vendor Name (Optional)" /></div>
          <Button onClick={handleCreate}><Plus className="w-4 h-4 mr-2" />Post Ad</Button>
        </div>
      </div>
      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="text-left p-4">ID</th>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">Vendor</th>
              <th className="text-left p-4">Posted</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No active ads found.</td></tr>
            ) : (
              ads.map((a, i) => (
                <tr key={a.id} className="border-b hover:bg-muted/20">
                  <td className="p-4 font-mono text-xs text-muted-foreground">W{String(i + 1).padStart(3, "0")}</td>
                  <td className="p-4 font-medium">{a.ads_title}</td>
                  <td className="p-4 text-sm">{a.ads_vendor || "-"}</td>
                  <td className="p-4 text-sm text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(a.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdsManagement;
