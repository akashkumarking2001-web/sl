import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const IndexPageEditor = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    // State for Hero Section
    const [heroContent, setHeroContent] = useState({
        title: "",
        subtitle: "",
        ctaText: "",
        ctaLink: ""
    });

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('site_content' as any)
                .select('*')
                .eq('section_key', 'hero')
                .maybeSingle();

            if (error) throw error;

            if (data && (data as any).content) {
                setHeroContent((data as any).content);
            } else {
                // Default content if nothing in DB
                setHeroContent({
                    title: "Unlock Your Potential with Ascend Academy",
                    subtitle: "Join the world's fastest-growing learning platform and start earning today.",
                    ctaText: "Get Started Now",
                    ctaLink: "/register"
                });
            }
        } catch (error) {
            console.error("Error fetching content:", error);
            toast({
                title: "Error",
                description: "Failed to load site content.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveHero = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('site_content' as any)
                .upsert({
                    section_key: 'hero',
                    content: heroContent,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'section_key' } as any);

            if (error) throw error;

            toast({
                title: "Success",
                description: "Hero section updated successfully.",
            });
        } catch (error) {
            console.error("Error saving content:", error);
            toast({
                title: "Error",
                description: "Failed to save content.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Index Page Editor</h2>

            {/* Hero Section Edit Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Hero Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="hero-title">Main Headline</Label>
                        <Input
                            id="hero-title"
                            value={heroContent.title}
                            onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
                            placeholder="Enter main headline"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="hero-subtitle">Subtitle</Label>
                        <Textarea
                            id="hero-subtitle"
                            value={heroContent.subtitle}
                            onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
                            placeholder="Enter subtitle text"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="hero-cta-text">Button Text</Label>
                            <Input
                                id="hero-cta-text"
                                value={heroContent.ctaText}
                                onChange={(e) => setHeroContent({ ...heroContent, ctaText: e.target.value })}
                                placeholder="e.g. Get Started"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="hero-cta-link">Button Link</Label>
                            <Input
                                id="hero-cta-link"
                                value={heroContent.ctaLink}
                                onChange={(e) => setHeroContent({ ...heroContent, ctaLink: e.target.value })}
                                placeholder="e.g. /register"
                            />
                        </div>
                    </div>

                    <Button onClick={handleSaveHero} disabled={saving} className="mt-4">
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Hero Section
                    </Button>
                </CardContent>
            </Card>

            {/* Add more sections here (About, Plans, etc.) following the same pattern */}
            <Card className="opacity-50 pointer-events-none">
                <CardHeader>
                    <CardTitle>Other Sections (Coming Soon)</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">About, Plans, and other sections will be editable here soon.</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default IndexPageEditor;
