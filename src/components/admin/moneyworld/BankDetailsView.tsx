import { useState, useEffect } from "react";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const BankDetailsView = () => {
  const [banks, setBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchBanks(); }, []);

  const fetchBanks = async () => {
    setLoading(true);
    const { data } = await supabase.from("bank_accounts").select("*");
    const userIds = data?.map(b => b.user_id) || [];
    const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, referral_code").in("user_id", userIds);
    const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
    setBanks(data?.map(b => ({ ...b, profile: profileMap.get(b.user_id) })) || []);
    setLoading(false);
  };

  const filtered = banks.filter(b => 
    b.profile?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    b.profile?.referral_code?.toLowerCase().includes(search.toLowerCase()) ||
    b.account_number?.includes(search)
  );

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" /></div>
      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50 border-b"><tr><th className="text-left p-4">Agent</th><th className="text-left p-4">Account Holder</th><th className="text-left p-4">Bank</th><th className="text-left p-4">Account No</th><th className="text-left p-4">IFSC</th><th className="text-left p-4">USDT</th></tr></thead>
          <tbody>{filtered.map(b => <tr key={b.id} className="border-b hover:bg-muted/30"><td className="p-4"><p className="font-medium">{b.profile?.full_name || "Unknown"}</p><p className="text-xs text-muted-foreground font-mono">{b.profile?.referral_code}</p></td><td className="p-4">{b.account_holder || "-"}</td><td className="p-4">{b.bank_name || "-"}</td><td className="p-4 font-mono">{b.account_number || "-"}</td><td className="p-4 font-mono">{b.ifsc_code || "-"}</td><td className="p-4 font-mono text-xs">{b.usdt_address || "-"}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
};

export default BankDetailsView;