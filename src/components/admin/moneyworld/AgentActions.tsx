import { useState } from "react";
import { Loader2, Ban, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AgentActionsProps { mode: "block" | "delete"; onRefresh: () => void; }

const AgentActions = ({ mode, onRefresh }: AgentActionsProps) => {
  const [agentId, setAgentId] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const findAgent = async () => {
    const { data } = await supabase.from("profiles").select("user_id, status").or(`referral_code.eq.${agentId},user_id.eq.${agentId}`).single();
    return data;
  };

  const handleBlock = async () => {
    if (!agentId) return;
    setLoading(true);
    const agent = await findAgent();
    if (!agent) { toast({ title: "Agent not found", variant: "destructive" }); setLoading(false); return; }
    await supabase.from("profiles").update({ status: "blocked" }).eq("user_id", agent.user_id);
    toast({ title: "Agent Blocked" });
    setAgentId("");
    onRefresh();
    setLoading(false);
  };

  const handleUnblock = async () => {
    if (!agentId) return;
    setLoading(true);
    const agent = await findAgent();
    if (!agent) { toast({ title: "Agent not found", variant: "destructive" }); setLoading(false); return; }
    await supabase.from("profiles").update({ status: "active" }).eq("user_id", agent.user_id);
    toast({ title: "Agent Unblocked" });
    setAgentId("");
    onRefresh();
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!agentId) return;
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    setLoading(true);
    const agent = await findAgent();
    if (!agent) { toast({ title: "Agent not found", variant: "destructive" }); setLoading(false); return; }
    await supabase.from("profiles").delete().eq("user_id", agent.user_id);
    toast({ title: "Agent Deleted", variant: "destructive" });
    setAgentId("");
    onRefresh();
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h2 className="text-lg font-bold">{mode === "block" ? "Block / Unblock Agent" : "Delete Agent"}</h2>
        <div><Label>Agent ID / Referral Code</Label><Input value={agentId} onChange={(e) => setAgentId(e.target.value)} placeholder="Enter agent ID or referral code" /></div>
        {mode === "block" ? (
          <div className="flex gap-3">
            <Button variant="destructive" className="flex-1" onClick={handleBlock} disabled={loading}>{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}<Ban className="w-4 h-4 mr-2" />Block</Button>
            <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600" onClick={handleUnblock} disabled={loading}><CheckCircle className="w-4 h-4 mr-2" />Unblock</Button>
          </div>
        ) : (
          <Button variant="destructive" className="w-full" onClick={handleDelete} disabled={loading}>{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}<Trash2 className="w-4 h-4 mr-2" />Delete Agent</Button>
        )}
      </div>
    </div>
  );
};

export default AgentActions;