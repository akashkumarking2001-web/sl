import { useState, useEffect, useCallback } from "react";
import { Loader2, Trash2, Plus, Edit2, CheckCircle2, XCircle, Play, Video, List, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { sanitizeString, validatePrice, isValidUrl } from "@/lib/sanitize";
import { logAudit } from "@/lib/audit";

const PLATFORM_PACKAGES = [
  "SPARK",
  "MOMENTUM",
  "SUMMIT",
  "TITAN",
  "LEGACY"
];

const CoursesManagement = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Episode Management state
  const [view, setView] = useState<"courses" | "episodes">("courses");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [isEpisodeDialogOpen, setIsEpisodeDialogOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<any>(null);
  const [episodeForm, setEpisodeForm] = useState({
    title: "",
    description: "",
    video_url: "",
    thumbnail_url: "",
    display_order: 0
  });

  const initialForm = {
    id: "",
    name: "",
    description: "",
    price: "",
    category: "Course",
    level: "Beginner",
    duration: "",
    package: "none",
    is_active: true
  };

  const [form, setForm] = useState(initialForm);
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();

    const channel = supabase
      .channel('admin_courses_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, () => {
        fetchCourses();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("package", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error fetching courses", description: error.message, variant: "destructive" });
    } else {
      setCourses(data || []);
    }
    setLoading(false);
  };

  const fetchEpisodes = async (courseId: string) => {
    const { data, error } = await supabase
      .from("course_episodes")
      .select("*")
      .eq("course_id", courseId)
      .order("display_order", { ascending: true });

    if (error) console.error("Error fetching episodes:", error);
    else setEpisodes(data || []);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast({ title: "Error", description: "Name and Price are required.", variant: "destructive" });
      return;
    }

    const payload = {
      course_name: sanitizeString(form.name),
      description: sanitizeString(form.description),
      price: validatePrice(form.price),
      category: sanitizeString(form.category),
      level: form.level,
      duration: sanitizeString(form.duration),
      package: form.package === "none" ? null : form.package,
      is_active: form.is_active
    };

    if (editingCourse) {
      const { error } = await supabase.from("courses").update(payload).eq("id", editingCourse.id);
      if (error) toast({ title: "Update Failed", description: error.message, variant: "destructive" });
      else {
        await logAudit('update', 'course', editingCourse.id, { name: payload.course_name });
        toast({ title: "Success", description: "Course updated successfully." });
      }
    } else {
      const { data, error } = await supabase.from("courses").insert(payload).select().single();
      if (error) toast({ title: "Creation Failed", description: error.message, variant: "destructive" });
      else {
        await logAudit('create', 'course', data.id, { name: payload.course_name });
        toast({ title: "Success", description: "New course created." });
      }
    }

    setIsDialogOpen(false);
    setEditingCourse(null);
    setForm(initialForm);
    fetchCourses();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this course? Everything related will be removed.")) {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) toast({ title: "Delete Failed", description: error.message, variant: "destructive" });
      else {
        await logAudit('delete', 'course', id);
        toast({ title: "Deleted", description: "Course removed." });
      }
      fetchCourses();
    }
  };

  const openEpisodes = (course: any) => {
    setSelectedCourse(course);
    fetchEpisodes(course.id);
    setView("episodes");
  };

  const handleSaveEpisode = async () => {
    if (!episodeForm.title || !episodeForm.video_url) {
      toast({ title: "Title and Video URL required", variant: "destructive" });
      return;
    }

    const payload = {
      course_id: selectedCourse.id,
      title: sanitizeString(episodeForm.title),
      description: sanitizeString(episodeForm.description),
      video_url: episodeForm.video_url,
      thumbnail_url: episodeForm.thumbnail_url,
      display_order: Number(episodeForm.display_order)
    };

    if (editingEpisode) {
      const { error } = await supabase.from("course_episodes").update(payload).eq("id", editingEpisode.id);
      if (error) throw error;
      toast({ title: "Session Updated" });
    } else {
      const { error } = await supabase.from("course_episodes").insert(payload);
      if (error) throw error;
      toast({ title: "New Session Added" });
    }

    setIsEpisodeDialogOpen(false);
    setEditingEpisode(null);
    setEpisodeForm({ title: "", description: "", video_url: "", thumbnail_url: "", display_order: episodes.length + 1 });
    fetchEpisodes(selectedCourse.id);
  };

  const handleDeleteEpisode = async (id: string) => {
    if (!confirm("Delete this session?")) return;
    await supabase.from("course_episodes").delete().eq("id", id);
    fetchEpisodes(selectedCourse.id);
  };

  const planCourses = courses.filter(c => c.package && PLATFORM_PACKAGES.includes(c.package));
  const normalCourses = courses.filter(c => !c.package || !PLATFORM_PACKAGES.includes(c.package));

  if (loading && courses.length === 0) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  if (view === "episodes") {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Button variant="ghost" className="gap-2" onClick={() => setView("courses")}>
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </Button>

        <div className="flex justify-between items-center bg-card p-6 rounded-2xl border border-border">
          <div>
            <h2 className="text-2xl font-black">{selectedCourse?.course_name}</h2>
            <p className="text-muted-foreground">Manage sessions/episodes for this course.</p>
          </div>
          <Button onClick={() => {
            setEditingEpisode(null);
            setEpisodeForm({ title: "", description: "", video_url: "", thumbnail_url: "", display_order: episodes.length + 1 });
            setIsEpisodeDialogOpen(true);
          }} className="rounded-xl font-bold">
            <Plus className="w-4 h-4 mr-2" /> Add New Session
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {episodes.map((ep) => (
            <div key={ep.id} className="glass-card rounded-2xl overflow-hidden group border border-border/50 bg-card/50">
              <div className="aspect-video relative bg-muted flex items-center justify-center">
                {ep.thumbnail_url ? (
                  <img src={ep.thumbnail_url} className="w-full h-full object-cover" alt="" />
                ) : (
                  <Video className="w-12 h-12 text-muted-foreground/30" />
                )}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] font-black text-white">
                  #S{ep.display_order}
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-lg mb-1">{ep.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 h-8 mb-4">{ep.description || "No session description."}</p>
                <div className="flex gap-2 justify-end pt-2 border-t border-border/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={() => {
                      setEditingEpisode(ep);
                      setEpisodeForm({
                        title: ep.title,
                        description: ep.description || "",
                        video_url: ep.video_url,
                        thumbnail_url: ep.thumbnail_url || "",
                        display_order: ep.display_order
                      });
                      setIsEpisodeDialogOpen(true);
                    }}
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-lg text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteEpisode(ep.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {episodes.length === 0 && (
            <div className="col-span-full py-20 text-center glass-card rounded-2xl opacity-50 border-dashed border-2">
              <Play className="w-16 h-16 mx-auto mb-4 text-muted-foreground/20" />
              <p className="font-bold text-muted-foreground italic">This course is empty! Add your first session to get started.</p>
            </div>
          )}
        </div>

        {/* Episode Dialog */}
        <Dialog open={isEpisodeDialogOpen} onOpenChange={setIsEpisodeDialogOpen}>
          <DialogContent className="rounded-3xl border-2 border-primary/20">
            <DialogHeader>
              <DialogTitle>{editingEpisode ? "Edit Session" : "Add New Session"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Order</Label>
                <Input
                  type="number"
                  className="col-span-1 rounded-xl"
                  value={episodeForm.display_order}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, display_order: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Session Title *</Label>
                <Input
                  placeholder="e.g. Introduction to Forex"
                  value={episodeForm.title}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, title: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Video URL / Embed Code *</Label>
                <Input
                  placeholder="https://www.youtube.com/embed/..."
                  value={episodeForm.video_url}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, video_url: e.target.value })}
                  className="rounded-xl font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label>Thumbnail URL (Optional)</Label>
                <Input
                  placeholder="https://..."
                  value={episodeForm.thumbnail_url}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, thumbnail_url: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Briefly explain what's in this video..."
                  value={episodeForm.description}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, description: e.target.value })}
                  className="rounded-xl min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEpisodeDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveEpisode} className="font-bold">Save Session</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Course Management</h2>
          <p className="text-sm text-muted-foreground">Manage your plan-based and regular courses.</p>
        </div>
        <Button onClick={() => { setEditingCourse(null); setForm(initialForm); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add New Course
        </Button>
      </div>

      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="plans">Plan Courses (Primary)</TabsTrigger>
          <TabsTrigger value="normal">Normal Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="mt-4">
          <CourseTable data={planCourses} onEdit={(c) => { setEditingCourse(c); setForm({ id: c.id, name: c.course_name, description: c.description || "", price: c.price.toString(), category: c.category || "Course", level: c.level || "Beginner", duration: c.duration || "", package: c.package || "none", is_active: c.is_active }); setIsDialogOpen(true); }} onDelete={handleDelete} onManage={openEpisodes} />
        </TabsContent>

        <TabsContent value="normal" className="mt-4">
          <CourseTable data={normalCourses} onEdit={(c) => { setEditingCourse(c); setForm({ id: c.id, name: c.course_name, description: c.description || "", price: c.price.toString(), category: c.category || "Course", level: c.level || "Beginner", duration: c.duration || "", package: c.package || "none", is_active: c.is_active }); setIsDialogOpen(true); }} onDelete={handleDelete} onManage={openEpisodes} />
        </TabsContent>
      </Tabs>

      {/* Upload/Edit Course Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle>{editingCourse ? "Edit Course" : "Upload New Course"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Course Name *</Label>
              <Input placeholder="Mastering Digital Marketing" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea placeholder="Describe what students will learn..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl min-h-[100px]" />
            </div>

            <div className="space-y-2">
              <Label>Price (₹) *</Label>
              <Input type="number" placeholder="499" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded-xl" />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Input placeholder="E-commerce, Trading, etc." value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-xl" />
            </div>

            <div className="space-y-2">
              <Label>Level</Label>
              <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Duration</Label>
              <Input placeholder="e.g. 10 hours" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="rounded-xl" />
            </div>

            <div className="space-y-2">
              <Label>Link to Package (Optional)</Label>
              <Select value={form.package || "none"} onValueChange={(v) => setForm({ ...form, package: v })}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Standalone Course" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Standalone Course)</SelectItem>
                  {PLATFORM_PACKAGES.map(pkg => (
                    <SelectItem key={pkg} value={pkg}>{pkg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex items-center gap-2 pt-8">
              <Label>Status</Label>
              <Button
                variant={form.is_active ? "default" : "outline"}
                size="sm"
                onClick={() => setForm({ ...form, is_active: !form.is_active })}
                className="gap-2 rounded-xl"
              >
                {form.is_active ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {form.is_active ? "Live" : "Disabled"}
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSave} className="rounded-xl font-bold">Save Course Data</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const CourseTable = ({ data, onEdit, onDelete, onManage }: { data: any[], onEdit: (c: any) => void, onDelete: (id: string) => void, onManage: (c: any) => void }) => (
  <div className="glass-card rounded-2xl overflow-hidden border border-border/50 bg-card/50">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/30 border-b border-border/50">
          <tr>
            <th className="text-left p-4 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Status</th>
            <th className="text-left p-4 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Course Details</th>
            <th className="text-left p-4 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Binding</th>
            <th className="text-left p-4 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Price</th>
            <th className="text-right p-4 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {data.length === 0 ? (
            <tr><td colSpan={5} className="p-12 text-center text-muted-foreground italic">No courses found in this category.</td></tr>
          ) : (
            data.map(c => (
              <tr key={c.id} className="hover:bg-primary/[0.02] transition-colors group">
                <td className="p-4">
                  {c.is_active ?
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Active</Badge> :
                    <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>
                  }
                </td>
                <td className="p-4">
                  <p className="font-bold">{c.course_name}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5"><Video className="w-3 h-3" /> multi-session architecture active</p>
                </td>
                <td className="p-4">
                  {c.package ? <Badge className="bg-gold/10 text-gold-dark border-gold/20 font-black">{c.package}</Badge> : '--'}
                </td>
                <td className="p-4 text-emerald-500 font-black">₹{c.price.toLocaleString()}</td>
                <td className="p-4 text-right flex justify-end gap-2 mt-1">
                  <Button variant="outline" size="sm" onClick={() => onManage(c)} className="rounded-xl h-8 gap-1.5 font-bold shadow-sm">
                    <List className="w-3.5 h-3.5 text-primary" /> Manage Sessions
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(c)} className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(c.id)} className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground">
                    <Trash2 className="w-3.5 h-3.5" />
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

export default CoursesManagement;