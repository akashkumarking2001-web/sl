import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TaskManagement = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [whatsappTask, setWhatsappTask] = useState({ title: "", description: "", requirements: "", amount: "" });
  const [appTask, setAppTask] = useState({ title: "", description: "", requirements: "", url1: "", url2: "", amount: "", proofType: "screenshot" });

  const handleCreateWhatsAppTask = async () => {
    if (!whatsappTask.title || !whatsappTask.amount) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await supabase.from("whatsapp_tasks").insert({
        task_title: whatsappTask.title,
        task_description: whatsappTask.description,
        requirements: whatsappTask.requirements,
        task_amount: Number(whatsappTask.amount),
      });
      toast({ title: "WhatsApp Task Created" });
      setWhatsappTask({ title: "", description: "", requirements: "", amount: "" });
    } catch (error) {
      toast({ title: "Error creating task", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleCreateAppTask = async () => {
    if (!appTask.title || !appTask.amount) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await supabase.from("app_tasks").insert({
        task_title: appTask.title,
        task_description: appTask.description,
        requirements: appTask.requirements,
        optional_url_1: appTask.url1,
        optional_url_2: appTask.url2,
        task_amount: Number(appTask.amount),
        proof_type: appTask.proofType,
      });
      toast({ title: "App Task Created" });
      setAppTask({ title: "", description: "", requirements: "", url1: "", url2: "", amount: "", proofType: "screenshot" });
    } catch (error) {
      toast({ title: "Error creating task", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <Tabs defaultValue="whatsapp" className="space-y-4">
      <TabsList>
        <TabsTrigger value="whatsapp">WhatsApp Task</TabsTrigger>
        <TabsTrigger value="app">App Task</TabsTrigger>
      </TabsList>

      <TabsContent value="whatsapp">
        <div className="glass-card p-6 rounded-2xl space-y-4 max-w-lg">
          <h3 className="font-bold text-lg">Create WhatsApp Task</h3>
          <div className="space-y-3">
            <div><Label>Title *</Label><Input value={whatsappTask.title} onChange={(e) => setWhatsappTask({ ...whatsappTask, title: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={whatsappTask.description} onChange={(e) => setWhatsappTask({ ...whatsappTask, description: e.target.value })} /></div>
            <div><Label>Requirements</Label><Input value={whatsappTask.requirements} onChange={(e) => setWhatsappTask({ ...whatsappTask, requirements: e.target.value })} placeholder="Separate with #" /></div>
            <div><Label>Amount (₹) *</Label><Input type="number" value={whatsappTask.amount} onChange={(e) => setWhatsappTask({ ...whatsappTask, amount: e.target.value })} /></div>
            <Button onClick={handleCreateWhatsAppTask} disabled={loading}>{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Create Task</Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="app">
        <div className="glass-card p-6 rounded-2xl space-y-4 max-w-lg">
          <h3 className="font-bold text-lg">Create App Task</h3>
          <div className="space-y-3">
            <div><Label>Title *</Label><Input value={appTask.title} onChange={(e) => setAppTask({ ...appTask, title: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={appTask.description} onChange={(e) => setAppTask({ ...appTask, description: e.target.value })} /></div>
            <div><Label>Requirements</Label><Input value={appTask.requirements} onChange={(e) => setAppTask({ ...appTask, requirements: e.target.value })} /></div>
            <div><Label>URL 1</Label><Input value={appTask.url1} onChange={(e) => setAppTask({ ...appTask, url1: e.target.value })} /></div>
            <div><Label>Amount (₹) *</Label><Input type="number" value={appTask.amount} onChange={(e) => setAppTask({ ...appTask, amount: e.target.value })} /></div>
            <Button onClick={handleCreateAppTask} disabled={loading}>{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Create Task</Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default TaskManagement;