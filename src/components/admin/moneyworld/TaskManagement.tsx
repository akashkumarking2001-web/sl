import { useState } from "react";
import {
  Loader2,
  MessageSquare,
  Smartphone,
  Plus,
  Sparkles,
  DollarSign,
  ClipboardList,
  Link as LinkIcon,
  ShieldCheck,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
      const { error } = await supabase.from("whatsapp_tasks").insert({
        task_title: whatsappTask.title,
        task_description: whatsappTask.description,
        requirements: whatsappTask.requirements,
        task_amount: Number(whatsappTask.amount),
      });
      if (error) throw error;
      toast({ title: "WhatsApp Task Created", description: "The task is now live for users." });
      setWhatsappTask({ title: "", description: "", requirements: "", amount: "" });
    } catch (error: any) {
      toast({ title: "Error creating task", description: error.message, variant: "destructive" });
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
      const { error } = await supabase.from("app_tasks").insert({
        task_title: appTask.title,
        task_description: appTask.description,
        requirements: appTask.requirements,
        optional_url_1: appTask.url1,
        optional_url_2: appTask.url2,
        task_amount: Number(appTask.amount),
        proof_type: appTask.proofType,
      });
      if (error) throw error;
      toast({ title: "App Task Created", description: "The task is now live for users." });
      setAppTask({ title: "", description: "", requirements: "", url1: "", url2: "", amount: "", proofType: "screenshot" });
    } catch (error: any) {
      toast({ title: "Error creating task", description: error.message, variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black flex items-center gap-3">
            <Zap className="w-8 h-8 text-amber-500 fill-amber-500/20" />
            Task Architect
          </h2>
          <p className="text-muted-foreground font-medium">Create and deploy high-engagement tasks for the community.</p>
        </div>
      </div>

      <Tabs defaultValue="whatsapp" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md bg-muted/50 p-1 rounded-2xl h-14 border border-border/50">
          <TabsTrigger value="whatsapp" className="rounded-xl gap-2 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <MessageSquare className="w-4 h-4" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="app" className="rounded-xl gap-2 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Smartphone className="w-4 h-4" />
            App Review
          </TabsTrigger>
        </TabsList>

        <TabsContent value="whatsapp" className="mt-8 space-y-6">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-12">
              <div className="relative overflow-hidden glass-card p-1 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/10 via-background to-primary/5 border-2 border-primary/20 shadow-2xl shadow-primary/5">
                <div className="p-8 md:p-10 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-inner">
                      <MessageSquare className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-black text-2xl tracking-tight">WhatsApp Deployment</h3>
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 py-1">Direct Outreach</Badge>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Task Title</Label>
                        <Input
                          placeholder="e.g., Daily Status Update Campaign"
                          value={whatsappTask.title}
                          onChange={(e) => setWhatsappTask({ ...whatsappTask, title: e.target.value })}
                          className="h-14 rounded-2xl bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all font-bold"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Description & Goal</Label>
                        <Textarea
                          placeholder="What should the user do specifically?"
                          value={whatsappTask.description}
                          onChange={(e) => setWhatsappTask({ ...whatsappTask, description: e.target.value })}
                          className="min-h-[150px] rounded-2xl bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all leading-relaxed"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Requirements (Separate with #)</Label>
                        <Input
                          placeholder="Screenshot#Link#Contact Number"
                          value={whatsappTask.requirements}
                          onChange={(e) => setWhatsappTask({ ...whatsappTask, requirements: e.target.value })}
                          className="h-14 rounded-2xl bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Reward Per Task (₹)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={whatsappTask.amount}
                            onChange={(e) => setWhatsappTask({ ...whatsappTask, amount: e.target.value })}
                            className="h-14 pl-12 rounded-2xl bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all font-black text-xl text-emerald-600"
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button
                          onClick={handleCreateWhatsAppTask}
                          disabled={loading}
                          className="w-full h-16 rounded-[1.5rem] bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                          {loading ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <Plus className="w-6 h-6 mr-3" />}
                          Deploy Task Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative blob */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="app" className="mt-8">
          <div className="relative overflow-hidden glass-card p-1 rounded-[2.5rem] bg-gradient-to-br from-blue-500/10 via-background to-primary/5 border-2 border-primary/20 shadow-2xl shadow-primary/5">
            <div className="p-8 md:p-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 shadow-inner">
                  <Smartphone className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-black text-2xl tracking-tight">App Task Configuration</h3>
                  <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 py-1">Platform Growth</Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Task Title</Label>
                    <Input
                      placeholder="e.g., Download & Review SkillLearners"
                      value={appTask.title}
                      onChange={(e) => setAppTask({ ...appTask, title: e.target.value })}
                      className="h-14 rounded-2xl bg-background/50 border-border/50 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Instruction Details</Label>
                    <Textarea
                      placeholder="Detailed steps for the user..."
                      value={appTask.description}
                      onChange={(e) => setAppTask({ ...appTask, description: e.target.value })}
                      className="min-h-[180px] rounded-2xl bg-background/50 border-border/50 leading-relaxed"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">App Store Link</Label>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="https://..."
                        value={appTask.url1}
                        onChange={(e) => setAppTask({ ...appTask, url1: e.target.value })}
                        className="h-14 pl-12 rounded-2xl bg-background/50 border-border/50 font-medium text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Proof Requirements</Label>
                    <Input
                      placeholder="e.g., Screenshot of PlayStore Review"
                      value={appTask.requirements}
                      onChange={(e) => setAppTask({ ...appTask, requirements: e.target.value })}
                      className="h-14 rounded-2xl bg-background/50 border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Payout (₹)</Label>
                    <div className="relative">
                      <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={appTask.amount}
                        onChange={(e) => setAppTask({ ...appTask, amount: e.target.value })}
                        className="h-14 pl-12 rounded-2xl bg-background/50 border-border/50 font-black text-xl text-blue-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1 space-y-6 flex flex-col">
                  <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-800/50 flex flex-col justify-between flex-1">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold">
                        <ShieldCheck className="w-5 h-5" />
                        Verification
                      </div>
                      <p className="text-xs text-blue-600/70 font-medium leading-relaxed">
                        App tasks are manually verified by moderators. Ensure requirements are clear to minimize disputes.
                      </p>
                    </div>

                    <Button
                      onClick={handleCreateAppTask}
                      disabled={loading}
                      className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-500/20 mt-8"
                    >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <Plus className="w-6 h-6 mr-3" />}
                      Launch App Task
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative blob */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Informational Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: ClipboardList, label: "Total Tasks", val: "24", color: "text-blue-500" },
          { icon: ShieldCheck, label: "Avg Approval Rate", val: "94%", color: "text-emerald-500" },
          { icon: DollarSign, label: "Distributed Rewards", val: "₹1.2L", color: "text-primary" }
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl border border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-black">{stat.val}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManagement;
