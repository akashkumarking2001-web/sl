import { useState, useEffect } from "react";
import {
  ClipboardList,
  MessageCircle,
  Download,
  Gift,
  Play,
  Upload,
  CheckCircle2,
  Clock,
  ExternalLink,
  Send,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AffiliateSidebar from "@/components/layout/AffiliateSidebar";

interface WhatsAppTask {
  id: string;
  task_title: string;
  task_description: string | null;
  task_amount: number;
  media_url: string | null;
  requirements: string | null;
  is_active: boolean;
  userStatus?: "available" | "pending" | "completed";
}

interface AppTask {
  id: string;
  task_title: string;
  task_description: string | null;
  task_amount: number;
  file_url: string | null;
  optional_url_1: string | null;
  optional_url_2: string | null;
  requirements: string | null;
  proof_type: string;
  is_active: boolean;
  userStatus?: "available" | "pending" | "completed";
}

const TasksPage = () => {
  const [activeTab, setActiveTab] = useState<"whatsapp" | "app" | "bonus">("whatsapp");
  const [whatsappTasks, setWhatsappTasks] = useState<WhatsAppTask[]>([]);
  const [appTasks, setAppTasks] = useState<AppTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bonusForm, setBonusForm] = useState({
    mobile: "",
    description: "",
    file: null as File | null,
  });

  const { toast } = useToast();
  const { user, profile } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch all data in parallel for performance
      const [
        { data: waTasksData },
        { data: completedWA },
        { data: appTasksData },
        { data: completedApp }
      ] = await Promise.all([
        supabase.from("whatsapp_tasks").select("*").eq("is_active", true).order("created_at", { ascending: false }),
        supabase.from("completed_whatsapp_tasks").select("task_id, payment_status").eq("user_id", user.id),
        supabase.from("app_tasks").select("*").eq("is_active", true).order("created_at", { ascending: false }),
        supabase.from("completed_app_tasks").select("task_id, payment_status").eq("user_id", user.id)
      ]);

      // Process WhatsApp Tasks
      const waCompletedMap = new Map(completedWA?.map(c => [c.task_id, c.payment_status]) || []);
      const waWithStatus = (waTasksData || []).map(task => ({
        ...task,
        userStatus: waCompletedMap.has(task.id)
          ? (waCompletedMap.get(task.id) === "approved" ? "completed" : "pending")
          : "available"
      })) as WhatsAppTask[];
      setWhatsappTasks(waWithStatus);

      // Process App Tasks
      const appCompletedMap = new Map(completedApp?.map(c => [c.task_id, c.payment_status]) || []);
      const appWithStatus = (appTasksData || []).map(task => ({
        ...task,
        userStatus: appCompletedMap.has(task.id)
          ? (appCompletedMap.get(task.id) === "approved" ? "completed" : "pending")
          : "available"
      })) as AppTask[];
      setAppTasks(appWithStatus);

    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({ title: "Error loading tasks", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleTaskSubmit = async (taskId: string, taskType: "whatsapp" | "app") => {
    if (!uploadedFile || !user) {
      toast({ title: "Error", description: "Please upload a screenshot", variant: "destructive" });
      return;
    }

    // Security: Validate File Type & Size
    if (!uploadedFile.type.startsWith("image/")) {
      toast({ title: "Invalid File", description: "Only image files are allowed.", variant: "destructive" });
      return;
    }
    if (uploadedFile.size > 5 * 1024 * 1024) { // 5MB
      toast({ title: "File too large", description: "Max file size is 5MB.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload file to storage
      const fileExt = uploadedFile.name.split('.').pop();
      // Sanitize filename to prevent directory traversal or weird chars
      const cleanFileName = `proof_${Date.now()}.${fileExt}`.replace(/[^a-zA-Z0-9._-]/g, '');
      const filePath = `${user.id}/${taskId}/${cleanFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("task-media")
        .upload(filePath, uploadedFile, {
          upsert: false // Prevent interaction with existing files
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("task-media")
        .getPublicUrl(filePath);

      // Insert completion record
      const table = taskType === "whatsapp" ? "completed_whatsapp_tasks" : "completed_app_tasks";

      const { error: insertError } = await supabase
        .from(table)
        .insert({
          user_id: user.id,
          task_id: taskId,
          file_paths: [urlData.publicUrl],
          payment_status: "pending",
        });

      if (insertError) throw insertError;

      toast({
        title: "Task Submitted!",
        description: "Your submission is under review. Reward will be credited upon approval."
      });

      setSelectedTask(null);
      setUploadedFile(null);
      fetchTasks();
    } catch (error) {
      console.error("Error submitting task:", error);
      toast({ title: "Error", description: "Failed to submit task", variant: "destructive" });
    }

    setIsSubmitting(false);
  };

  const handleBonusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      // For bonus submissions, we can add to messages or a custom table
      const { error } = await supabase
        .from("messages")
        .insert({
          name: profile?.full_name || "User",
          email: profile?.email || "",
          phone: bonusForm.mobile,
          message: `Bonus Income Application: ${bonusForm.description}`,
          is_read: false,
        });

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "We'll review your submission and credit the reward if approved."
      });
      setBonusForm({ mobile: "", description: "", file: null });
    } catch (error) {
      console.error("Error submitting bonus:", error);
      toast({ title: "Error", description: "Failed to submit application", variant: "destructive" });
    }

    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <AffiliateSidebar>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AffiliateSidebar>
    );
  }

  return (
    <AffiliateSidebar>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-card p-6 rounded-3xl mb-6 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-lg">
              <ClipboardList className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold font-display">Tasks</h1>
              <p className="text-muted-foreground">Complete tasks to earn extra income</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={activeTab === "whatsapp" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("whatsapp")}
            className="gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Tasks ({whatsappTasks.length})
          </Button>
          <Button
            variant={activeTab === "app" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("app")}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            App Tasks ({appTasks.length})
          </Button>
          <Button
            variant={activeTab === "bonus" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("bonus")}
            className="gap-2"
          >
            <Gift className="w-4 h-4" />
            More Income
          </Button>
        </div>

        {/* WhatsApp Tasks */}
        {activeTab === "whatsapp" && (
          <div className="space-y-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6">
              <p className="text-sm">
                <strong>How it works:</strong> Watch the video, share it on your WhatsApp status, take a screenshot showing views, and submit for approval.
              </p>
            </div>

            {whatsappTasks.length === 0 ? (
              <div className="glass-card p-8 rounded-2xl text-center text-muted-foreground">
                No WhatsApp tasks available at the moment
              </div>
            ) : (
              whatsappTasks.map((task) => (
                <div key={task.id} className="glass-card p-5 rounded-2xl">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${task.userStatus === 'completed' ? 'bg-emerald-500/10' :
                        task.userStatus === 'pending' ? 'bg-primary/10' : 'bg-muted'
                        }`}>
                        {task.userStatus === 'completed' ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        ) : task.userStatus === 'pending' ? (
                          <Clock className="w-6 h-6 text-primary" />
                        ) : (
                          <MessageCircle className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold">{task.task_title}</h3>
                        {task.task_description && (
                          <p className="text-sm text-muted-foreground">{task.task_description}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Reward: <span className="text-emerald-500 font-medium">₹{task.task_amount}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                      {task.userStatus === 'available' && (
                        <>
                          {task.media_url && (
                            <Button variant="outline" size="sm" className="flex-1 md:flex-initial" asChild>
                              <a href={task.media_url} target="_blank" rel="noopener noreferrer">
                                <Play className="w-4 h-4 mr-1" />
                                Watch
                              </a>
                            </Button>
                          )}
                          <Button size="sm" className="flex-1 md:flex-initial" onClick={() => setSelectedTask(task.id)}>
                            <Upload className="w-4 h-4 mr-1" />
                            Submit
                          </Button>
                        </>
                      )}
                      {task.userStatus === 'pending' && (
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">Under Review</span>
                      )}
                      {task.userStatus === 'completed' && (
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-sm font-medium">Completed ✓</span>
                      )}
                    </div>
                  </div>

                  {/* Upload Section */}
                  {selectedTask === task.id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <Label className="text-sm font-medium mb-2 block">Upload Screenshot</Label>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                            className="hidden"
                            id={`upload-${task.id}`}
                          />
                          <label
                            htmlFor={`upload-${task.id}`}
                            className="flex items-center justify-center gap-2 h-10 px-4 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary transition-colors"
                          >
                            <Upload className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {uploadedFile ? uploadedFile.name : "Choose file"}
                            </span>
                          </label>
                        </div>
                        <Button
                          onClick={() => handleTaskSubmit(task.id, "whatsapp")}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* App Tasks */}
        {activeTab === "app" && (
          <div className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
              <p className="text-sm">
                <strong>How it works:</strong> Install the app using our link, complete the required action, take a screenshot, and submit for verification.
              </p>
            </div>

            {appTasks.length === 0 ? (
              <div className="glass-card p-8 rounded-2xl text-center text-muted-foreground">
                No App tasks available at the moment
              </div>
            ) : (
              appTasks.map((task) => (
                <div key={task.id} className="glass-card p-5 rounded-2xl">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${task.userStatus === 'completed' ? 'bg-emerald-500/10' :
                          task.userStatus === 'pending' ? 'bg-primary/10' : 'bg-blue-500/10'
                          }`}>
                          {task.userStatus === 'completed' ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                          ) : task.userStatus === 'pending' ? (
                            <Clock className="w-6 h-6 text-primary" />
                          ) : (
                            <Download className="w-6 h-6 text-blue-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold">{task.task_title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Reward: <span className="text-emerald-500 font-medium">₹{task.task_amount}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {task.requirements && (
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        {task.requirements}
                      </p>
                    )}

                    {task.userStatus === 'available' && (
                      <div className="flex gap-2">
                        {task.optional_url_1 && (
                          <Button variant="outline" size="sm" className="flex-1" asChild>
                            <a href={task.optional_url_1} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Open Link
                            </a>
                          </Button>
                        )}
                        <Button size="sm" className="flex-1" onClick={() => setSelectedTask(task.id)}>
                          <Upload className="w-4 h-4 mr-1" />
                          Submit Proof
                        </Button>
                      </div>
                    )}

                    {task.userStatus === 'pending' && (
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium w-fit">Under Review</span>
                    )}

                    {task.userStatus === 'completed' && (
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-sm font-medium w-fit">Completed ✓</span>
                    )}

                    {/* Upload Section */}
                    {selectedTask === task.id && (
                      <div className="pt-4 border-t border-border">
                        <Label className="text-sm font-medium mb-2 block">Upload Proof Screenshot</Label>
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                              className="hidden"
                              id={`upload-${task.id}`}
                            />
                            <label
                              htmlFor={`upload-${task.id}`}
                              className="flex items-center justify-center gap-2 h-10 px-4 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary transition-colors"
                            >
                              <Upload className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {uploadedFile ? uploadedFile.name : "Choose file"}
                              </span>
                            </label>
                          </div>
                          <Button
                            onClick={() => handleTaskSubmit(task.id, "app")}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* More Income / Bonus Tasks */}
        {activeTab === "bonus" && (
          <div className="glass-card p-6 rounded-3xl">
            <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              Apply for Bonus Income
            </h2>
            <p className="text-muted-foreground mb-6">
              Complete special offers and submit your application for additional income opportunities.
            </p>

            <form onSubmit={handleBonusSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">User ID</Label>
                  <Input value={profile?.referral_code || user?.id?.slice(0, 8) || ""} disabled className="bg-muted" />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Full Name</Label>
                  <Input value={profile?.full_name || ""} disabled className="bg-muted" />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Mobile Number *</Label>
                <Input
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={bonusForm.mobile}
                  onChange={(e) => setBonusForm({ ...bonusForm, mobile: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Describe Task Completion *</Label>
                <Textarea
                  placeholder="Explain what task you completed and provide any relevant details..."
                  value={bonusForm.description}
                  onChange={(e) => setBonusForm({ ...bonusForm, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Upload Proof</Label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setBonusForm({ ...bonusForm, file: e.target.files?.[0] || null })}
                  className="hidden"
                  id="bonus-upload"
                />
                <label
                  htmlFor="bonus-upload"
                  className="flex items-center justify-center gap-2 h-24 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {bonusForm.file ? bonusForm.file.name : "Click to upload screenshot or document"}
                  </span>
                </label>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
    </AffiliateSidebar>
  );
};

export default TasksPage;
