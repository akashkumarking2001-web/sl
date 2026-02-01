import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Save, DollarSign, Users, TrendingUp, Share2 } from "lucide-react";
import { logAudit } from "@/lib/audit";

interface IncomeSettingsData {
  id: string;
  package_name: string;
  referral_commission: number;
  spillover_level_1: number;
  spillover_level_2: number;
  spillover_level_3: number;
  spillover_level_4: number;
  revenue_share_level_1: number;
  revenue_share_level_2: number;
  revenue_share_level_3: number;
  revenue_share_level_4: number;
  revenue_share_level_5: number;
  revenue_share_level_6: number;
  revenue_share_level_7: number;
  revenue_share_level_8: number;
  level_1_income: number;
  level_2_income: number;
  level_3_income: number;
  level_4_income: number;
  level_5_income: number;
  level_6_income: number;
  level_7_income: number;
  level_8_income: number;
  level_9_income: number;
  level_10_income: number;
  level_11_income: number;
  level_12_income: number;
}


export const IncomeSettings = () => {
  const [settings, setSettings] = useState<IncomeSettingsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(false);
  const [activePackage, setActivePackage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('income_settings')
        .select('*')
        .order('id'); // specific order might be needed, or add a rank column

      if (error) throw error;

      const activeComboPlans = ["SPARK", "MOMENTUM", "SUMMIT", "TITAN", "LEGACY"];
      const filteredData = data?.filter(s => activeComboPlans.includes(s.package_name)) || [];

      setSettings(filteredData);
      if (filteredData.length > 0 && !activePackage) {
        setActivePackage(filteredData[0].package_name);
      }
    } catch (error) {
      console.error('Error fetching income settings:', error);
      toast.error('Failed to load income settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInitialize = async () => {
    setInitializing(true);
    try {
      const activeComboPlans = ["SPARK", "MOMENTUM", "SUMMIT", "TITAN", "LEGACY"];

      // 1. Delete any packages that are NOT in our active list
      const { error: deleteError } = await supabase
        .from('income_settings')
        .delete()
        .not('package_name', 'in', `(${activeComboPlans.join(',')})`);

      if (deleteError) console.warn("Cleanup warning:", deleteError);

      // 2. Initialize missing ones
      const { data: existing } = await supabase.from('income_settings').select('package_name');
      const existingNames = new Set(existing?.map(e => e.package_name));

      const newPackages = activeComboPlans
        .filter(p => !existingNames.has(p))
        .map(name => ({
          package_name: name,
          referral_commission: 0,
          level_1_income: 0,
        }));

      if (newPackages.length > 0) {
        const { error } = await supabase.from('income_settings').insert(newPackages);
        if (error) throw error;
        toast.success(`Active Combo Plans initialized.`);

        await logAudit('create', 'settings', 'income_initialization', { packages_added: activeComboPlans });
      } else {
        toast.info("Combo plans are already configured.");
      }
      fetchSettings();
    } catch (error) {
      console.error("Error initializing:", error);
      toast.error("Failed to initialize settings");
    } finally {
      setInitializing(false);
    }
  };

  const handleInputChange = (packageName: string, field: string, value: string) => {
    setSettings(prev => prev.map(s =>
      s.package_name === packageName
        ? { ...s, [field]: parseFloat(value) || 0 }
        : s
    ));
  };

  const handleSave = async (packageName: string) => {
    setSaving(packageName);
    try {
      const packageSettings = settings.find(s => s.package_name === packageName);
      if (!packageSettings) return;

      const { id, ...updateData } = packageSettings;

      const { error } = await supabase
        .from('income_settings')
        .update(updateData)
        .eq('package_name', packageName);

      if (error) throw error;
      toast.success(`${packageName} package settings saved successfully!`);

      await logAudit('update', 'settings', packageName, {
        package: packageName,
        updated_fields: Object.keys(updateData)
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(null);
    }
  };

  const getPackageSettings = (packageName: string) => {
    return settings.find(s => s.package_name === packageName) || null;
  };

  const packages = settings.map(s => s.package_name);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentSettings = getPackageSettings(activePackage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Income Settings</h2>
          <p className="text-muted-foreground">Configure commission rates for all income types per package</p>
        </div>
        <Button onClick={handleInitialize} disabled={initializing} variant="outline">
          {initializing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Initialize Defaults
        </Button>
      </div>

      {packages.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
          <p className="text-muted-foreground mb-4">No packages configured. Click Initialize Defaults to start.</p>
        </div>
      ) : (
        <Tabs value={activePackage} onValueChange={setActivePackage}>
          <TabsList className="grid w-full grid-cols-5 h-auto flex-wrap justify-start gap-2 bg-transparent">
            {packages.map(pkg => (
              <TabsTrigger key={pkg} value={pkg} className="text-sm border bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                {pkg}
              </TabsTrigger>
            ))}
          </TabsList>

          {packages.map(pkg => {
            const pkgSettings = getPackageSettings(pkg);
            if (!pkgSettings) return null;

            return (
              <TabsContent key={pkg} value={pkg} className="space-y-6 mt-6">
                {/* Referral Income */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="h-5 w-5 text-green-500" />
                      Referral Income (Direct Sponsor)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Referral Commission (₹)</Label>
                        <Input
                          type="number"
                          value={pkgSettings.referral_commission}
                          onChange={(e) => handleInputChange(pkg, 'referral_commission', e.target.value)}
                          placeholder="Enter amount"
                        />
                        <p className="text-xs text-muted-foreground">
                          Amount credited to direct sponsor when user purchases this package
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Level Income */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      Level Income (12 Levels)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(level => (
                        <div key={level} className="space-y-2">
                          <Label className="text-sm">Level {level} (₹)</Label>
                          <Input
                            type="number"
                            value={(pkgSettings as any)[`level_${level}_income`]}
                            onChange={(e) => handleInputChange(pkg, `level_${level}_income`, e.target.value)}
                            placeholder="0"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Income distributed across 12 upline levels when a user purchases this package
                    </p>
                  </CardContent>
                </Card>

                {/* Spillover Income */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Share2 className="h-5 w-5 text-purple-500" />
                      Spillover Income (Milestone Rewards)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Level 1 (5 members) ₹</Label>
                        <Input
                          type="number"
                          value={pkgSettings.spillover_level_1}
                          onChange={(e) => handleInputChange(pkg, 'spillover_level_1', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Level 2 (30 members) ₹</Label>
                        <Input
                          type="number"
                          value={pkgSettings.spillover_level_2}
                          onChange={(e) => handleInputChange(pkg, 'spillover_level_2', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Level 3 (155 members) ₹</Label>
                        <Input
                          type="number"
                          value={pkgSettings.spillover_level_3}
                          onChange={(e) => handleInputChange(pkg, 'spillover_level_3', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Level 4 (625 members) ₹</Label>
                        <Input
                          type="number"
                          value={pkgSettings.spillover_level_4}
                          onChange={(e) => handleInputChange(pkg, 'spillover_level_4', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Bonus rewards when sponsor reaches spillover milestones
                    </p>
                  </CardContent>
                </Card>

                {/* Revenue Share Income */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <DollarSign className="h-5 w-5 text-orange-500" />
                      Revenue Share Income (Tree Completion)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(level => (
                        <div key={level} className="space-y-2">
                          <Label className="text-sm">Level {level} (₹)</Label>
                          <Input
                            type="number"
                            value={(pkgSettings as any)[`revenue_share_level_${level}`]}
                            onChange={(e) => handleInputChange(pkg, `revenue_share_level_${level}`, e.target.value)}
                            placeholder="0"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Income earned when positions in revenue share tree are filled
                    </p>
                  </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={() => handleSave(pkg)}
                    disabled={saving === pkg}
                    size="lg"
                  >
                    {saving === pkg ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save {pkg} Settings
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
};
