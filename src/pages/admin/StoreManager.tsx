import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2, Save, Image as ImageIcon, LayoutGrid } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const StoreManager = () => {
    return (
        <div className="p-6 space-y-8">
            <h1 className="text-3xl font-bold font-display">Store Management</h1>
            <Tabs defaultValue="banners" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="banners" className="gap-2"><ImageIcon className="w-4 h-4" /> Banners (Hero)</TabsTrigger>
                    <TabsTrigger value="sections" className="gap-2"><LayoutGrid className="w-4 h-4" /> Sections & Layout</TabsTrigger>
                </TabsList>

                <TabsContent value="banners">
                    <BannersManager />
                </TabsContent>

                <TabsContent value="sections">
                    <SectionsManager />
                </TabsContent>
            </Tabs>
        </div>
    );
};

// --- Banners Sub-Component ---
interface Banner {
    id: string;
    title: string | null;
    description: string | null;
    image_url: string;
    redirect_link: string | null;
    is_active: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}

const BannersManager = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [newBanner, setNewBanner] = useState({ title: "", description: "", image_url: "", redirect_link: "", display_order: 0 });

    const { data: banners, isLoading } = useQuery({
        queryKey: ["store_banners"],
        queryFn: async () => {
            const { data, error } = await supabase.from("store_banners").select("*").order("display_order");
            if (error) throw error;
            return data as Banner[];
        }
    });

    const createMutation = useMutation({
        mutationFn: async (banner: typeof newBanner) => {
            const { error } = await supabase.from("store_banners").insert([banner]);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["store_banners"] });
            toast({ title: "Banner Created" });
            setNewBanner({ title: "", description: "", image_url: "", redirect_link: "", display_order: 0 });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("store_banners").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["store_banners"] });
            toast({ title: "Banner Deleted" });
        }
    });

    const toggleActiveMutation = useMutation({
        mutationFn: async ({ id, is_active }: { id: string, is_active: boolean }) => {
            const { error } = await supabase.from("store_banners").update({ is_active }).eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["store_banners"] })
    });

    if (isLoading) return <Loader2 className="animate-spin" />;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Banner</CardTitle>
                    <CardDescription>Upload an image elsewhere and paste the URL here.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input value={newBanner.title} onChange={e => setNewBanner({ ...newBanner, title: e.target.value })} placeholder="Summer Sale" className="focus-visible:ring-[#FBBF24]" />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Input value={newBanner.description} onChange={e => setNewBanner({ ...newBanner, description: e.target.value })} placeholder="Get up to 50% off..." className="focus-visible:ring-[#FBBF24]" />
                    </div>
                    <div className="space-y-2">
                        <Label>Image URL</Label>
                        <Input value={newBanner.image_url} onChange={e => setNewBanner({ ...newBanner, image_url: e.target.value })} placeholder="https://..." className="focus-visible:ring-[#FBBF24]" />
                    </div>
                    <div className="space-y-2">
                        <Label>Link</Label>
                        <Input value={newBanner.redirect_link} onChange={e => setNewBanner({ ...newBanner, redirect_link: e.target.value })} placeholder="/shopping?category=summer" className="focus-visible:ring-[#FBBF24]" />
                    </div>
                    <div className="space-y-2">
                        <Label>Order</Label>
                        <Input type="number" value={newBanner.display_order} onChange={e => setNewBanner({ ...newBanner, display_order: parseInt(e.target.value) })} className="focus-visible:ring-[#FBBF24]" />
                    </div>
                    <div className="flex items-end">
                        <Button onClick={() => createMutation.mutate(newBanner)} disabled={createMutation.isPending} className="w-full bg-[#FBBF24] text-black hover:bg-[#FBBF24]/90 font-bold">
                            <Plus className="w-4 h-4 mr-2" /> Create Banner
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6">
                <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Current Banners</h3>
                {banners?.map(banner => (
                    <Card key={banner.id} className="group overflow-hidden border-slate-100 hover:border-[#FBBF24]/30 transition-all shadow-sm">
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-64 h-40 relative shrink-0">
                                <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/20" />
                            </div>
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-black text-lg">{banner.title}</h3>
                                        <Badge variant="outline" className="font-mono text-[10px]">{banner.display_order}</Badge>
                                    </div>
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-2">{banner.description}</p>
                                    <p className="text-[10px] font-bold text-[#FBBF24] uppercase tracking-wider">{banner.redirect_link}</p>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor={`active-${banner.id}`} className="text-xs font-bold uppercase text-slate-400">Status</Label>
                                            <Switch
                                                id={`active-${banner.id}`}
                                                checked={banner.is_active}
                                                onCheckedChange={(checked) => toggleActiveMutation.mutate({ id: banner.id, is_active: checked })}
                                                className="data-[state=checked]:bg-[#FBBF24]"
                                            />
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(banner.id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div >
    );
};

// --- Sections Sub-Component ---
const SectionsManager = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // We only toggle active/inactive here as per "If I want to hide... I should be able to toggle a boolean"
    // And edit specific config fields if needed.

    const { data: sections, isLoading } = useQuery({
        queryKey: ["store_sections"],
        queryFn: async () => {
            const { data, error } = await supabase.from("store_sections").select("*").order("display_order");
            if (error) throw error;
            return data;
        }
    });

    const updateSectionMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: string, updates: any }) => {
            const { error } = await supabase.from("store_sections").update(updates).eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["store_sections"] });
            toast({ title: "Section Updated" });
        }
    });

    if (isLoading) return <Loader2 className="animate-spin" />;

    return (
        <div className="space-y-4">
            <Card className="bg-amber-50 border-amber-200">
                <CardContent className="pt-6">
                    <p className="text-sm text-amber-800 font-medium">
                        These sections appear on the Shop Home Page in the order shown. Toggle them to show/hide.
                    </p>
                </CardContent>
            </Card>

            <div className="grid gap-4">
                {sections?.map(section => (
                    <Card key={section.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-bold">{section.title}</CardTitle>
                            <Switch
                                checked={section.is_active}
                                onCheckedChange={(checked) => updateSectionMutation.mutate({ id: section.id, updates: { is_active: checked } })}
                            />
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Section Title</Label>
                                    <Input
                                        defaultValue={section.title}
                                        onBlur={(e) => {
                                            if (e.target.value !== section.title) {
                                                updateSectionMutation.mutate({ id: section.id, updates: { title: e.target.value } });
                                            }
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Order</Label>
                                    <Input
                                        type="number"
                                        defaultValue={section.display_order}
                                        onBlur={(e) => {
                                            const val = parseInt(e.target.value);
                                            if (val !== section.display_order) {
                                                updateSectionMutation.mutate({ id: section.id, updates: { display_order: val } });
                                            }
                                        }}
                                    />
                                </div>
                                {/* Advanced Config Editor (JSON) - Hidden power feature */}
                                <div className="space-y-2">
                                    <Label>Config (Sort, Limit)</Label>
                                    <Input
                                        defaultValue={JSON.stringify(section.config)}
                                        onBlur={(e) => {
                                            try {
                                                const json = JSON.parse(e.target.value);
                                                updateSectionMutation.mutate({ id: section.id, updates: { config: json } });
                                            } catch (err) {
                                                toast({ title: "Invalid JSON", variant: "destructive" });
                                            }
                                        }}
                                        className="font-mono text-xs"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default StoreManager;
