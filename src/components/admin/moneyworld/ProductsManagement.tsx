import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2,
  Plus,
  Image as ImageIcon,
  Search,
  Trash2,
  Edit2,
  ShoppingBag,
  XCircle,
  Share2,
  DollarSign,
  Tag,
  Zap,
  Layers,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { sanitizeString, validatePrice, isValidUrl } from "@/lib/sanitize";
import { logAudit } from "@/lib/audit";

const ProductsManagement = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    mrp: "",
    discount: "",
    cashback: "0",
    image_1: "",
    image_2: "",
    image_3: "",
    is_active: true,
    commission_amount: "0",
    commission_percentage: "0"
  });
  const { toast } = useToast();

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      toast({ title: "Failed to load products", variant: "destructive" });
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleCreateOrUpdate = async () => {
    if (!form.name || !form.price) {
      toast({ title: "Name and Sale Price are required", variant: "destructive" });
      return;
    }

    if (form.image_1 && !isValidUrl(form.image_1)) {
      toast({ title: "Invalid Image URL", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const sanitizedName = sanitizeString(form.name);
      const slug = sanitizedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const productData: any = {
        name: sanitizedName,
        slug: slug,
        description: sanitizeString(form.description),
        short_description: sanitizeString(form.description)?.substring(0, 150),
        price: validatePrice(form.price),
        mrp: validatePrice(form.mrp || form.price),
        cashback_amount: validatePrice(form.cashback || 0),
        affiliate_commission_amount: validatePrice(form.commission_amount || 0),
        affiliate_commission_percentage: validatePrice(form.commission_percentage || 0),
        image_url: form.image_1,
        gallery_images: [form.image_1, form.image_2, form.image_3].filter(img => img && isValidUrl(img)),
        stock_quantity: 100,
        is_active: form.is_active,
        is_featured: false,
        tags: []
      };

      if (editingId) {
        const { error } = await (supabase as any)
          .from("products")
          .update(productData)
          .eq("id", editingId);
        if (error) throw error;
        await logAudit('update', 'product', editingId, { name: sanitizedName });
        toast({ title: "Product updated successfully!" });
      } else {
        const { data, error } = await (supabase as any)
          .from("products")
          .insert(productData)
          .select()
          .single();
        if (error) throw error;
        await logAudit('create', 'product', data.id, { name: sanitizedName });
        toast({ title: "Product added successfully!" });
      }

      setForm({
        name: "",
        description: "",
        price: "",
        mrp: "",
        discount: "",
        cashback: "0",
        image_1: "",
        image_2: "",
        image_3: "",
        is_active: true,
        commission_amount: "0",
        commission_percentage: "0"
      });
      setIsAdding(false);
      setEditingId(null);
      fetchProducts();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    // Optimistic update
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p));

    const { error } = await (supabase as any)
      .from("products")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (error) {
      toast({ title: "Update failed", variant: "destructive" });
      // Revert on error
      fetchProducts();
    } else {
      await logAudit('toggle_status', 'product', id, { active: !currentStatus });
      toast({ title: `Product ${!currentStatus ? 'Activated' : 'Disabled'}` });
    }
  };

  const handleEdit = (product: any) => {
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      mrp: product.mrp?.toString() || product.price.toString(),
      discount: "",
      cashback: product.cashback_amount?.toString() || "0",
      image_1: product.image_url || "",
      image_2: product.gallery_images?.[1] || "",
      image_3: product.gallery_images?.[2] || "",
      is_active: product.is_active,
      commission_amount: product.affiliate_commission_amount?.toString() || "0",
      commission_percentage: product.affiliate_commission_percentage?.toString() || "0"
    });
    setEditingId(product.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", variant: "destructive" });
    } else {
      await logAudit('delete', 'product', id);
      toast({ title: "Deleted" });
      fetchProducts();
    }
  };

  const filteredProducts = products.filter(p =>
    (p.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !isAdding) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-primary" />
            Product Factory
          </h2>
          <p className="text-muted-foreground font-medium">Design and deploy premium products to the global store.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Filter inventory..."
              className="pl-12 h-12 rounded-2xl bg-card border-border/50 focus:ring-primary/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => {
            setIsAdding(!isAdding);
            if (isAdding) setEditingId(null);
          }} className={cn(
            "h-12 px-6 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg transition-all active:scale-95 w-full sm:w-auto",
            isAdding ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20" : "bg-primary hover:bg-primary/90 shadow-primary/20"
          )}>
            {isAdding ? <XCircle className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
            {isAdding ? "Abort Creation" : "New Creation"}
          </Button>
        </div>
      </div>

      {/* Form Section */}
      {isAdding && (
        <div className="relative overflow-hidden glass-card p-1 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-background to-accent/5 border-2 border-primary/20 shadow-2xl animate-in slide-in-from-top-4 duration-500">
          <div className="p-8 md:p-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Zap className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-black text-2xl tracking-tight">{editingId ? "Modify Blueprint" : "Product Architect"}</h3>
                <Badge className="bg-primary/10 text-primary border-primary/20 py-1 font-bold">V2 Engine</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Basic Meta */}
              <div className="lg:col-span-4 space-y-6">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b pb-2 flex items-center gap-2">
                    <Tag className="w-3 h-3" /> Core Identity
                  </h4>
                  <div className="space-y-2">
                    <Label htmlFor="product-name" className="text-[10px] font-black uppercase text-muted-foreground ml-1">Product Designation</Label>
                    <Input
                      id="product-name"
                      placeholder="e.g., Quantum Edge Smartwatch"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="h-14 rounded-2xl bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-desc" className="text-[10px] font-black uppercase text-muted-foreground ml-1">Detailed Description</Label>
                    <Textarea
                      id="product-desc"
                      placeholder="Technical specs and selling points..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="min-h-[160px] rounded-2xl bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Economy Controls */}
              <div className="lg:col-span-4 space-y-6">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b pb-2 flex items-center gap-2">
                    <DollarSign className="w-3 h-3" /> Economy Matrix
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-mrp" className="text-[10px] font-black uppercase text-muted-foreground ml-1">List Price (MRP)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="product-mrp"
                          type="number"
                          placeholder="0.00"
                          value={form.mrp}
                          onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                          className="h-14 pl-10 rounded-2xl bg-background/50 border-border/50 font-bold"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-price" className="text-[10px] font-black uppercase text-muted-foreground ml-1">Live Sale Price</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                        <Input
                          id="product-price"
                          type="number"
                          placeholder="0.00"
                          value={form.price}
                          onChange={(e) => setForm({ ...form, price: e.target.value })}
                          className="h-14 pl-10 rounded-2xl bg-background border-primary/30 focus:border-primary font-black text-xl text-primary shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Cashback Reward</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={form.cashback}
                        onChange={(e) => setForm({ ...form, cashback: e.target.value })}
                        className="h-14 rounded-2xl bg-background/50 border-border/50 font-black text-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Affiliate Fixed</Label>
                      <Input
                        type="number"
                        placeholder="Amt"
                        value={form.commission_amount}
                        onChange={(e) => setForm({ ...form, commission_amount: e.target.value })}
                        className="h-14 rounded-2xl bg-background/50 border-border/50 font-black text-blue-500"
                      />
                    </div>
                  </div>

                  <div className="group p-6 rounded-3xl bg-primary/5 border border-primary/20 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Sparkles className="w-5 h-5" /></div>
                        <Label className="text-xs font-black uppercase text-primary">Live Visibility</Label>
                      </div>
                      <Switch
                        checked={form.is_active}
                        onCheckedChange={(val) => setForm({ ...form, is_active: val })}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Assets */}
              <div className="lg:col-span-4 space-y-6">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b pb-2 flex items-center gap-2">
                    <ImageIcon className="w-3 h-3" /> Visual Assets
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Primary Display (URL)</Label>
                      <Input
                        placeholder="https://..."
                        value={form.image_1}
                        onChange={(e) => setForm({ ...form, image_1: e.target.value })}
                        className="h-14 rounded-2xl bg-background/50 border-border/50 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Alt 1</Label>
                        <Input
                          placeholder="Link"
                          value={form.image_2}
                          onChange={(e) => setForm({ ...form, image_2: e.target.value })}
                          className="h-12 rounded-xl bg-background/50 border-border/50 text-[10px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Alt 2</Label>
                        <Input
                          placeholder="Link"
                          value={form.image_3}
                          onChange={(e) => setForm({ ...form, image_3: e.target.value })}
                          className="h-12 rounded-xl bg-background/50 border-border/50 text-[10px]"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleCreateOrUpdate}
                    disabled={isSubmitting}
                    className="w-full h-16 mt-8 rounded-3xl font-black text-lg uppercase tracking-wider bg-gradient-to-r from-primary to-primary/80 shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all active:scale-95"
                  >
                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                      <>
                        {editingId ? "Apply Synchronization" : "Initiate Launch"}
                        <ArrowRight className="w-6 h-6 ml-3" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative side blob */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      )}

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map(p => (
          <div key={p.id} className="group relative bg-card rounded-[2.5rem] border border-border/40 overflow-hidden hover:border-primary/40 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full">
            {/* Visual Header */}
            <div className="aspect-[4/5] relative overflow-hidden bg-muted">
              <img
                src={p.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Badge className={cn(
                  "font-black uppercase text-[10px] px-3 py-1 rounded-full border-none shadow-lg",
                  p.is_active ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"
                )}>
                  {p.is_active ? "Live" : "Halted"}
                </Badge>
              </div>

              {/* Floating Perks */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                {p.cashback_amount > 0 && (
                  <Badge className="bg-emerald-500 text-white border-none font-black px-3 py-1 text-[10px] rounded-full shadow-lg">
                    ₹{p.cashback_amount} CASHBACK
                  </Badge>
                )}
                {(p.affiliate_commission_amount > 0 || p.affiliate_commission_percentage > 0) && (
                  <Badge className="bg-blue-600 text-white border-none font-black px-3 py-1 text-[10px] rounded-full shadow-lg">
                    {p.affiliate_commission_amount > 0 ? `₹${p.affiliate_commission_amount}` : `${p.affiliate_commission_percentage}%`} COMM
                  </Badge>
                )}
              </div>
            </div>

            {/* Intellectual Data */}
            <div className="p-6 flex-1 flex flex-col space-y-4">
              <div>
                <h4 className="font-black text-lg line-clamp-1 group-hover:text-primary transition-colors">{p.name}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1 font-medium leading-relaxed h-8">
                  {p.description || "Synthesizing product identity..."}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-border/20 pt-4 mt-auto">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Unit Capital</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-primary">₹{p.price}</span>
                    {p.mrp > p.price && (
                      <span className="text-xs text-muted-foreground line-through font-bold opacity-60">₹{p.mrp}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 rounded-xl bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all"
                    onClick={() => handleEdit(p)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 rounded-xl bg-muted/50 hover:bg-blue-500/10 hover:text-blue-500 transition-all"
                    onClick={() => {
                      const link = `${window.location.origin}/product/${p.slug}?ref=ADMIN`;
                      navigator.clipboard.writeText(link);
                      toast({ title: "Signal Captured", description: "Network reference link encoded to clipboard." });
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 rounded-xl bg-muted/50 hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                    onClick={() => handleDelete(p.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && !loading && (
          <div className="col-span-full py-32 text-center glass-card rounded-[3rem] border border-dashed border-border/60">
            <div className="w-20 h-20 bg-muted/30 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <Layers className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-2xl font-black text-muted-foreground">Warehouse Vacuum</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">No items detected in current sector. Initiate creation sequence.</p>
            <Button onClick={() => setIsAdding(true)} variant="link" className="mt-4 font-black text-primary">
              <Plus className="w-4 h-4 mr-2" /> Start First Blueprint
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsManagement;
