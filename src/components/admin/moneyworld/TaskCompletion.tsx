import { useState, useEffect } from "react";
import { Loader2, Check, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { approveTaskSecure, approveAppTaskSecure } from "@/lib/incomeDistributionSecure";

interface TaskCompletionProps { onRefresh: () => void; }

const TaskCompletion = ({ onRefresh }: TaskCompletionProps) => {
  const [whatsappCompletions, setWhatsappCompletions] = useState<any[]>([]);
  const [appCompletions, setAppCompletions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: whatsapp } = await supabase.from("completed_whatsapp_tasks").select("*, whatsapp_tasks(task_title, task_amount)").order("created_at", { ascending: false });
    const { data: app } = await supabase.from("completed_app_tasks").select("*, app_tasks(task_title, task_amount)").order("created_at", { ascending: false });

    const userIds = [...new Set([...(whatsapp?.map(w => w.user_id) || []), ...(app?.map(a => a.user_id) || [])])];
    const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds);
    const profileMap = new Map(profiles?.map(p => [p.user_id, p.full_name]) || []);

    setWhatsappCompletions(whatsapp?.map(w => ({ ...w, user_name: profileMap.get(w.user_id) })) || []);
    setAppCompletions(app?.map(a => ({ ...a, user_name: profileMap.get(a.user_id) })) || []);
    setLoading(false);
  };

  const handleApprove = async (item: any, type: "whatsapp" | "app") => {
    setLoading(true); // Show loading while processing
    let success = false;

    if (type === "whatsapp") {
      // SECURE: Call db function to approve WhatsApp task
      success = await approveTaskSecure(item.id);
    } else {
      // SECURE: Call db function to approve App task
      success = await approveAppTaskSecure(item.id);
    }

    if (success) {
      toast({ title: "Payment Approved & Credited Securely" });
    } else {
      toast({ title: "Error", description: "Secure approval failed. Check permissions.", variant: "destructive" });
    }

    fetchData();
    onRefresh();
    setLoading(false);
  };

  const handleReject = async (item: any, type: "whatsapp" | "app") => {
    const table = type === "whatsapp" ? "completed_whatsapp_tasks" : "completed_app_tasks";
    await supabase.from(table).update({ payment_status: "rejected", processed_at: new Date().toISOString() }).eq("id", item.id);
    toast({ title: "Rejected", variant: "destructive" });
    fetchData();
  };

  const renderTable = (items: any[], type: "whatsapp" | "app") => (
    <div className="glass-card rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50 border-b"><tr>
          <th className="text-left p-4 text-sm text-muted-foreground">Student</th>
          <th className="text-left p-4 text-sm text-muted-foreground">Task</th>
          <th className="text-left p-4 text-sm text-muted-foreground">Amount</th>
          <th className="text-left p-4 text-sm text-muted-foreground">Status</th>
          <th className="text-right p-4 text-sm text-muted-foreground">Actions</th>
        </tr></thead>
        <tbody className="divide-y divide-border">
          {items.filter(i => i.payment_status === "pending").map(item => (
            <tr key={item.id} className="hover:bg-muted/30">
              <td className="p-4 font-medium">{item.user_name || "Unknown"}</td>
              <td className="p-4">{type === "whatsapp" ? item.whatsapp_tasks?.task_title : item.app_tasks?.task_title}</td>
              <td className="p-4 text-emerald-500 font-bold">₹{type === "whatsapp" ? item.whatsapp_tasks?.task_amount : item.app_tasks?.task_amount}</td>
              <td className="p-4"><Badge className="bg-amber-500/10 text-amber-500">Pending</Badge></td>
              <td className="p-4 text-right">
                <Button variant="ghost" size="icon" onClick={() => setSelectedItem({ ...item, type })}><Eye className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleReject(item, type)}><X className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="text-emerald-500" onClick={() => handleApprove(item, type)}><Check className="w-4 h-4" /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <Tabs defaultValue="whatsapp" className="space-y-4">
      <TabsList><TabsTrigger value="whatsapp">WhatsApp Tasks</TabsTrigger><TabsTrigger value="app">App Tasks</TabsTrigger></TabsList>
      <TabsContent value="whatsapp">{renderTable(whatsappCompletions, "whatsapp")}</TabsContent>
      <TabsContent value="app">{renderTable(appCompletions, "app")}</TabsContent>
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent><DialogHeader><DialogTitle>Task Submission</DialogTitle></DialogHeader>
          {selectedItem?.file_paths?.map((path: string, i: number) => <img key={i} src={path} className="w-full rounded-lg" />)}
        </DialogContent>
      </Dialog>
    </Tabs>
  );
};

export default TaskCompletion;