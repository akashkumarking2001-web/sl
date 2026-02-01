import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Package } from "@/hooks/usePackages";

const PackagesManager = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [editingPackage, setEditingPackage] = useState<Package | null>(null);

    // Fetch Packages
    const { data: packages, isLoading } = useQuery({
        queryKey: ["packages"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("packages")
                .select("*")
                .order("level", { ascending: true });

            if (error) throw error;

            // Ensure features is typed correctly
            return data.map(pkg => ({
                ...pkg,
                features: Array.isArray(pkg.features)
                    ? pkg.features.map(f => String(f))
                    : typeof pkg.features === 'string'
                        ? JSON.parse(pkg.features)
                        : []
            })) as Package[];
        },
    });

    // Update Mutation
    const updateMutation = useMutation({
        mutationFn: async (updatedPkg: Package) => {
            const { error } = await supabase
                .from("packages")
                .update({
                    name: updatedPkg.name,
                    price: updatedPkg.price,
                    headline: updatedPkg.headline,
                    description: updatedPkg.description,
                    features: updatedPkg.features, // Supabase handles array->jsonb
                    bonus: updatedPkg.bonus,
                })
                .eq("id", updatedPkg.id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["packages"] });
            toast({ title: "Success", description: "Package updated successfully" });
            setEditingPackage(null);
        },
        onError: (error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    const handleSave = () => {
        if (editingPackage) {
            updateMutation.mutate(editingPackage);
        }
    };

    const handleFeatureChange = (index: number, value: string) => {
        if (!editingPackage) return;
        const newFeatures = [...(editingPackage.features || [])];
        newFeatures[index] = value;
        setEditingPackage({ ...editingPackage, features: newFeatures });
    };

    const addFeature = () => {
        if (!editingPackage) return;
        setEditingPackage({
            ...editingPackage,
            features: [...(editingPackage.features || []), ""],
        });
    };

    const removeFeature = (index: number) => {
        if (!editingPackage) return;
        const newFeatures = [...(editingPackage.features || [])];
        newFeatures.splice(index, 1);
        setEditingPackage({ ...editingPackage, features: newFeatures });
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="p-6 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-display">Manage Packages</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages?.map((pkg) => (
                    <Card key={pkg.id} className="border-2 hover:border-primary/50 transition-colors">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-start">
                                <span className="text-xl">{pkg.name}</span>
                                <span className="text-lg font-bold text-primary">₹{pkg.price}</span>
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">{pkg.headline}</p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-sm">
                                    <strong>Features:</strong>
                                    <ul className="list-disc pl-4 mt-2 h-32 overflow-y-auto">
                                        {pkg.features?.slice(0, 3).map((f, i) => (
                                            <li key={i}>{f}</li>
                                        ))}
                                        {(pkg.features?.length || 0) > 3 && <li>...and more</li>}
                                    </ul>
                                </div>
                                <Button onClick={() => setEditingPackage(pkg)} className="w-full">
                                    Edit Package
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Edit Modal / Slide-over (simplified as centered overlay) */}
            {editingPackage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95">
                        <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-background z-10 border-b">
                            <CardTitle>Edit {editingPackage.name}</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setEditingPackage(null)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Package Name</Label>
                                    <Input
                                        value={editingPackage.name}
                                        onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Price (₹)</Label>
                                    <Input
                                        type="number"
                                        value={editingPackage.price}
                                        onChange={(e) => setEditingPackage({ ...editingPackage, price: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Headline</Label>
                                <Input
                                    value={editingPackage.headline || ""}
                                    onChange={(e) => setEditingPackage({ ...editingPackage, headline: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={editingPackage.description || ""}
                                    onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Bonus Text</Label>
                                <Input
                                    value={editingPackage.bonus || ""}
                                    onChange={(e) => setEditingPackage({ ...editingPackage, bonus: e.target.value })}
                                    className="bg-accent/10 border-accent/20"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>Features ({editingPackage.features?.length || 0})</Label>
                                    <Button variant="outline" size="sm" onClick={addFeature}>
                                        <Plus className="w-4 h-4 mr-2" /> Add Feature
                                    </Button>
                                </div>
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                    {editingPackage.features?.map((feature, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <Input
                                                value={feature}
                                                onChange={(e) => handleFeatureChange(idx, e.target.value)}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:bg-destructive/10"
                                                onClick={() => removeFeature(idx)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button variant="outline" onClick={() => setEditingPackage(null)}>Cancel</Button>
                                <Button onClick={handleSave} disabled={updateMutation.isPending}>
                                    {updateMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default PackagesManager;
