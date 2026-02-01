import { useState, useEffect } from "react";
import { Loader2, Save, QrCode, Building, CreditCard, Bitcoin, Smartphone, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { logAudit } from "@/lib/audit";

const PaymentSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    upi_id: "",
    usdt_address: "",
    qr_code_url: "",
    whatsapp_number: "",
    payment_instructions: "",
    is_shopping_enabled: true,
  });
  const { toast } = useToast();

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("site_settings")
        .select("*")
        .eq("id", "global")
        .single();

      if (error) throw error;
      if (data) {
        setSettings({
          upi_id: data.upi_id || "",
          usdt_address: data.usdt_address || "",
          qr_code_url: data.qr_code_url || "",
          whatsapp_number: data.whatsapp_number || "",
          payment_instructions: data.payment_instructions || "",
          is_shopping_enabled: data.is_shopping_enabled !== false, // Default to true if null/undefined
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await (supabase as any)
        .from("site_settings")
        .upsert({
          id: "global",
          upi_id: settings.upi_id,
          usdt_address: settings.usdt_address,
          qr_code_url: settings.qr_code_url,
          whatsapp_number: settings.whatsapp_number,
          payment_instructions: settings.payment_instructions,
          is_shopping_enabled: settings.is_shopping_enabled,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      if (error) throw error;

      await logAudit('update', 'settings', 'payment_settings', {
        updated_fields: Object.keys(settings)
      });

      toast({ title: "Settings Saved", description: "Payment settings have been updated successfully." });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="glass-card p-6 rounded-2xl border-2 border-primary/20">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold font-display flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Online Shopping Module
            </h2>
            <p className="text-sm text-muted-foreground">
              Enable or disable the entire e-commerce store for users.
            </p>
          </div>
          <Switch
            checked={settings.is_shopping_enabled}
            onCheckedChange={(checked) => setSettings({ ...settings, is_shopping_enabled: checked })}
          />
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl">
        <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          UPI Payment Details
        </h2>
        <div className="grid gap-4">
          <div>
            <Label>UPI ID</Label>
            <Input
              value={settings.upi_id}
              onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
              placeholder="yourname@upi"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This UPI ID will be shown to users for making payments
            </p>
          </div>
          <div>
            <Label>QR Code URL (Optional)</Label>
            <Input
              value={settings.qr_code_url}
              onChange={(e) => setSettings({ ...settings, qr_code_url: e.target.value })}
              placeholder="https://your-qr-code-image-url.png"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Upload your QR code image and paste the URL here
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl">
        <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-primary" />
          Support & Activation
        </h2>
        <div>
          <Label>WhatsApp Number (for instant activation)</Label>
          <Input
            value={settings.whatsapp_number}
            onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
            placeholder="+910000000000"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Include country code (e.g. +91 for India)
          </p>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl">
        <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
          <Bitcoin className="w-5 h-5 text-primary" />
          Crypto Payment Details
        </h2>
        <div>
          <Label>USDT Address (TRC20)</Label>
          <Input
            value={settings.usdt_address}
            onChange={(e) => setSettings({ ...settings, usdt_address: e.target.value })}
            placeholder="TRC20 wallet address"
            className="font-mono"
          />
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl">
        <h2 className="text-xl font-bold font-display mb-6">Payment Instructions</h2>
        <Textarea
          value={settings.payment_instructions}
          onChange={(e) => setSettings({ ...settings, payment_instructions: e.target.value })}
          placeholder="Enter instructions for users..."
          rows={4}
        />
        <p className="text-xs text-muted-foreground mt-1">
          This message will be shown to users on the payment page
        </p>
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto">
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save Payment Settings
          </>
        )}
      </Button>
    </div>
  );
};

export default PaymentSettings;