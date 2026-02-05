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
    shop_upi_id: "",
    shop_usdt_address: "",
    shop_qr_code_url: ""
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
          is_shopping_enabled: data.is_shopping_enabled !== false,
          shop_upi_id: data.shop_upi_id || "",
          shop_usdt_address: data.shop_usdt_address || "",
          shop_qr_code_url: data.shop_qr_code_url || ""
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
          shop_upi_id: settings.shop_upi_id,
          shop_usdt_address: settings.shop_usdt_address,
          shop_qr_code_url: settings.shop_qr_code_url,
          updated_at: new Date().toISOString(),
        });

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
    <div className="space-y-8 max-w-4xl">
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

      <div className="grid md:grid-cols-2 gap-8">
        {/* SECTION A: E-LEARNING */}
        <div className="space-y-6">
          <h3 className="text-lg font-black uppercase tracking-widest text-primary border-b pb-2">Section A: Course Payments</h3>

          <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 bg-primary/10 rounded-bl-xl">
              <span className="text-xs font-bold text-primary">Courses / Digital</span>
            </div>
            <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Course UPI & Crypto
            </h2>
            <div className="grid gap-4">
              <div>
                <Label>UPI ID</Label>
                <Input
                  value={settings.upi_id}
                  onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
                  placeholder="courses@upi"
                />
              </div>
              <div>
                <Label>QR Code URL</Label>
                <Input
                  value={settings.qr_code_url}
                  onChange={(e) => setSettings({ ...settings, qr_code_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label>USDT Address (TRC20)</Label>
                <Input
                  value={settings.usdt_address}
                  onChange={(e) => setSettings({ ...settings, usdt_address: e.target.value })}
                  placeholder="TRC20..."
                  className="font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION B: E-COMMERCE */}
        <div className="space-y-6">
          <h3 className="text-lg font-black uppercase tracking-widest text-blue-500 border-b pb-2">Section B: Shopping Payments</h3>

          <div className="glass-card p-6 rounded-2xl relative overflow-hidden bg-blue-50/50 border-blue-100">
            <div className="absolute top-0 right-0 p-2 bg-blue-100 rounded-bl-xl">
              <span className="text-xs font-bold text-blue-600">Products / Physical</span>
            </div>
            <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2 text-slate-800">
              <ShoppingBag className="w-5 h-5 text-blue-500" />
              Shopping UPI & Crypto
            </h2>
            <div className="grid gap-4">
              <div>
                <Label>Shop UPI ID</Label>
                <Input
                  value={settings.shop_upi_id}
                  onChange={(e) => setSettings({ ...settings, shop_upi_id: e.target.value })}
                  placeholder="shop@upi"
                  className="bg-white"
                />
              </div>
              <div>
                <Label>Shop QR Code URL</Label>
                <Input
                  value={settings.shop_qr_code_url}
                  onChange={(e) => setSettings({ ...settings, shop_qr_code_url: e.target.value })}
                  placeholder="https://..."
                  className="bg-white"
                />
              </div>
              <div>
                <Label>Shop USDT Address</Label>
                <Input
                  value={settings.shop_usdt_address}
                  onChange={(e) => setSettings({ ...settings, shop_usdt_address: e.target.value })}
                  placeholder="TRC20..."
                  className="font-mono text-xs bg-white"
                />
              </div>
            </div>
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
            Display for users to contact support if payment is pending.
          </p>
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full h-12 text-lg font-bold">
        {saving ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Saving Settings...
          </>
        ) : (
          <>
            <Save className="w-5 h-5 mr-2" />
            Save All Payment Settings
          </>
        )}
      </Button>
    </div>
  );
};

export default PaymentSettings;
