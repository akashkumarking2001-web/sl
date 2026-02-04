import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, MapPin, CheckCircle2, Trash2, Home, Briefcase } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Address {
    id: string;
    label: string;
    full_name: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    postal_code: string;
    phone: string;
    is_default: boolean;
}

interface AddressManagerProps {
    onSelectAddress: (address: Address) => void;
    selectedAddressId?: string;
}

const AddressManager = ({ onSelectAddress, selectedAddressId }: AddressManagerProps) => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { user } = useAuth();
    const { toast } = useToast();

    // Form State
    const [newAddress, setNewAddress] = useState({
        label: "Home",
        full_name: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        phone: "",
        is_default: false
    });

    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            if (user) {
                // Cancel previous
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                }
                abortControllerRef.current = new AbortController();

                await fetchAddresses();
            } else {
                if (mounted) setLoading(false);
            }
        };

        load();

        return () => {
            mounted = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [user]);

    const fetchAddresses = async () => {
        try {
            setLoading(true);

            // Timeout promise to prevent infinite loading
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out after 30s")), 30000)
            );

            const queryPromise = supabase
                .from("user_addresses")
                .select("*")
                .eq("user_id", user?.id)
                .order("is_default", { ascending: false });

            const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

            if (error) throw error;

            console.log("Addresses loaded:", data);
            setAddresses(data || []);

            // Auto-select default if none selected
            if (!selectedAddressId && data && data.length > 0) {
                const defaultAddr = data.find((a: any) => a.is_default) || data[0];
                if (defaultAddr) onSelectAddress(defaultAddr);
            }
        } catch (error: any) {
            console.error("Error fetching addresses:", error);
            toast({ title: "Error", description: error.message || "Failed to load addresses.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async () => {
        console.log("handleAddAddress started", newAddress);
        if (!newAddress.full_name || !newAddress.address_line1 || !newAddress.city || !newAddress.postal_code || !newAddress.phone) {
            toast({ title: "Missing Fields", description: "Please fill in all required fields.", variant: "destructive" });
            return;
        }

        setSubmitting(true);
        try {
            console.log("Preparing to insert address for user:", user?.id);

            // 1. Unset other defaults if this is default
            if (newAddress.is_default && addresses.length > 0) {
                console.log("Unsetting existing default addresses...");
                await supabase
                    .from("user_addresses")
                    .update({ is_default: false })
                    .eq("user_id", user?.id);
            }

            // 2. Perform Insert with safety timeout
            console.log("Inserting new address...");

            const insertPromise = supabase
                .from("user_addresses")
                .insert({
                    user_id: user?.id,
                    ...newAddress,
                    is_default: addresses.length === 0 ? true : newAddress.is_default
                })
                .select()
                .single();

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Database request timed out after 30s")), 30000)
            );

            const { data, error } = await Promise.race([insertPromise, timeoutPromise]) as any;

            if (error) {
                console.error("Supabase insert error:", error);
                throw error;
            }

            console.log("Address inserted successfully:", data);
            toast({ title: "Address Added", description: "Your new address has been saved." });
            setShowDialog(false);
            fetchAddresses();

            // Reset form
            setNewAddress({
                label: "Home",
                full_name: "",
                address_line1: "",
                address_line2: "",
                city: "",
                state: "",
                postal_code: "",
                phone: "",
                is_default: false
            });

        } catch (error: any) {
            console.error("handleAddAddress catch block:", error);
            toast({ title: "Error", description: error.message || "Failed to save address", variant: "destructive" });
        } finally {
            setSubmitting(false);
            console.log("handleAddAddress finished");
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this address?")) return;

        const { error } = await supabase.from("user_addresses").delete().eq("id", id);
        if (!error) {
            toast({ title: "Deleted", description: "Address removed successfully." });
            fetchAddresses();
        }
    };

    if (loading) return <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                    <div
                        key={addr.id}
                        onClick={() => onSelectAddress(addr)}
                        className={`cursor-pointer rounded-2xl p-4 border transition-all relative group ${selectedAddressId === addr.id
                            ? "bg-primary/5 border-primary shadow-md"
                            : "bg-surface border-border hover:border-primary/50"
                            }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                {addr.label === "Home" ? <Home className="w-4 h-4 text-primary" /> : <Briefcase className="w-4 h-4 text-primary" />}
                                <span className="font-bold text-sm">{addr.label}</span>
                                {addr.is_default && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-bold uppercase">Default</span>}
                            </div>
                            {selectedAddressId === addr.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                        </div>

                        <div className="text-sm text-muted-foreground space-y-1">
                            <p className="font-semibold text-foreground">{addr.full_name}</p>
                            <p>{addr.address_line1}</p>
                            {addr.address_line2 && <p>{addr.address_line2}</p>}
                            <p>{addr.city}, {addr.state} - {addr.postal_code}</p>
                            <p className="text-xs mt-2">Phone: {addr.phone}</p>
                        </div>

                        <button
                            onClick={(e) => handleDelete(addr.id, e)}
                            className="absolute top-4 right-4 text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogTrigger asChild>
                        <button className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border p-6 hover:bg-muted/30 transition-colors min-h-[160px]">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Plus className="w-5 h-5 text-primary" />
                            </div>
                            <span className="font-bold text-sm text-muted-foreground">Add New Address</span>
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Add New Address</DialogTitle>
                            <DialogDescription className="text-sm text-foreground/60">
                                Enter the details for your new delivery address below.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Label</Label>
                                    <div className="flex gap-2">
                                        {["Home", "Office", "Other"].map(l => (
                                            <button
                                                key={l}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${newAddress.label === l ? 'bg-primary text-black border-primary shadow-lg shadow-primary/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50'}`}
                                                onClick={() => setNewAddress({ ...newAddress, label: l })}
                                            >
                                                {l}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input
                                        value={newAddress.full_name}
                                        onChange={e => setNewAddress({ ...newAddress, full_name: e.target.value })}
                                        placeholder="Receiver's Name"
                                        className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Address Line 1</Label>
                                <Input
                                    value={newAddress.address_line1}
                                    onChange={e => setNewAddress({ ...newAddress, address_line1: e.target.value })}
                                    placeholder="House No, Building, Street"
                                    className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Address Line 2 (Optional)</Label>
                                <Input
                                    value={newAddress.address_line2}
                                    onChange={e => setNewAddress({ ...newAddress, address_line2: e.target.value })}
                                    placeholder="Area, Landmark"
                                    className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>City</Label>
                                    <Input
                                        value={newAddress.city}
                                        onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                        placeholder="City"
                                        className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>State</Label>
                                    <Input
                                        value={newAddress.state}
                                        onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                                        placeholder="State"
                                        className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Pincode</Label>
                                    <Input
                                        value={newAddress.postal_code}
                                        onChange={e => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                                        placeholder="123456"
                                        className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <Input
                                        value={newAddress.phone}
                                        onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                                        placeholder="+91..."
                                        className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="checkbox"
                                    id="is_default"
                                    checked={newAddress.is_default}
                                    onChange={e => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                                    className="rounded border-gray-300"
                                />
                                <Label htmlFor="is_default" className="cursor-pointer">Make this my default address</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                            <Button onClick={handleAddAddress} disabled={submitting}>
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Address"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default AddressManager;
