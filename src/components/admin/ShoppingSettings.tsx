import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Loader2 } from "lucide-react";

export const ShoppingSettings = () => {
    const [shoppingEnabled, setShoppingEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from("site_settings")
                .select("*")
                .eq("key", "shopping_enabled")
                .single();

            if (error && error.code !== "PGRST116") throw error;

            setShoppingEnabled(data?.value === "true" || false);
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (enabled: boolean) => {
        try {
            setShoppingEnabled(enabled);

            const { error } = await supabase
                .from("site_settings")
                .upsert({
                    key: "shopping_enabled",
                    value: enabled.toString(),
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: "key"
                });

            if (error) throw error;

            toast({
                title: enabled ? "Shopping Enabled" : "Shopping Disabled",
                description: enabled
                    ? "Users can now browse and purchase products"
                    : "Shopping feature is now disabled for users",
            });
        } catch (error: any) {
            console.error("Error updating settings:", error);
            setShoppingEnabled(!enabled); // Revert on error
            toast({
                title: "Error",
                description: "Failed to update shopping settings",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    Shopping Module
                </CardTitle>
                <CardDescription>
                    Enable or disable the e-commerce shopping feature for all users
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="shopping-toggle" className="text-base font-semibold">
                            Enable Shopping
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            {shoppingEnabled
                                ? "Shopping is currently enabled"
                                : "Shopping is currently disabled"}
                        </p>
                    </div>
                    <Switch
                        id="shopping-toggle"
                        checked={shoppingEnabled}
                        onCheckedChange={handleToggle}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
