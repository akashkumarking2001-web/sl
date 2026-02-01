import { useState, useEffect } from "react";
import { Loader2, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MessagesManagementProps { onRefresh: () => void; }

const MessagesManagement = ({ onRefresh }: MessagesManagementProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [broadcast, setBroadcast] = useState("");
  const { toast } = useToast();

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
    setMessages(data || []);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    await supabase.from("messages").update({ is_read: true }).eq("id", id);
    fetchMessages();
    onRefresh();
  };

  const sendBroadcast = async () => {
    if (!broadcast.trim()) return;
    await supabase.from("admin_notifications").insert({ message: broadcast, is_broadcast: true });
    toast({ title: "Notification Sent" });
    setBroadcast("");
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl max-w-lg space-y-4">
        <h3 className="font-bold text-lg">Send Broadcast Notification</h3>
        <Textarea value={broadcast} onChange={(e) => setBroadcast(e.target.value)} placeholder="Enter message to broadcast..." />
        <Button onClick={sendBroadcast}><Mail className="w-4 h-4 mr-2" />Send to All Users</Button>
      </div>
      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50 border-b"><tr><th className="text-left p-4">From</th><th className="text-left p-4">Contact</th><th className="text-left p-4">Message</th><th className="text-left p-4">Date</th><th className="text-right p-4">Status</th></tr></thead>
          <tbody>{messages.map(m => <tr key={m.id} className="border-b hover:bg-muted/30"><td className="p-4 font-medium">{m.name}</td><td className="p-4 text-sm text-muted-foreground"><div>{m.email}</div><div>{m.phone}</div></td><td className="p-4 max-w-xs truncate">{m.message}</td><td className="p-4 text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</td><td className="p-4 text-right">{m.is_read ? <Badge className="bg-emerald-500/10 text-emerald-500">Read</Badge> : <Button size="sm" variant="outline" onClick={() => markAsRead(m.id)}><Check className="w-3 h-3 mr-1" />Mark Read</Button>}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
};

export default MessagesManagement;