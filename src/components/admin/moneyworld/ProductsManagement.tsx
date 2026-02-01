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
  XCircle
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
    is_active: true
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
        image_url: form.image_1,
        gallery_images: [form.image_1, form.image_2, form.image_3].filter(img => img && isValidUrl(img)),
        stock_quantity: 100,
        is_active: form.is_active,
        is_featured: false,
        tags: []
      };

      if (editingId) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingId);
        if (error) throw error;
        await logAudit('update', 'product', editingId, { name: sanitizedName });
        toast({ title: "Product updated successfully!" });
      } else {
        const { data, error } = await supabase
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
        is_active: true
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

    const { error } = await supabase
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
      is_active: product.is_active
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
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !isAdding) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => {
          setIsAdding(!isAdding);
          if (isAdding) setEditingId(null);
        }} className="rounded-xl font-bold">
          {isAdding ? <XCircle className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {isAdding ? "Cancel" : "Add New Product"}
        </Button>
      </div>

      {/* Form Section */}
      {isAdding && (
        <div className="glass-card p-6 rounded-[2rem] border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 animate-in slide-in-from-top-4 duration-300">
          <h3 className="font-black text-xl mb-6 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
            {editingId ? "Edit Product" : "Product Creator"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-bold uppercase mb-1.5 block">Product Name *</Label>
                <Input
                  placeholder="e.g., Premium Smart Watch"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label className="text-xs font-bold uppercase mb-1.5 block">Description</Label>
                <Textarea
                  placeholder="Describe your product features..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="rounded-xl min-h-[120px]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-bold uppercase mb-1.5 block">MRP (₹)</Label>
                  <Input
                    type="number"
                    placeholder="Original Price"
                    value={form.mrp}
                    onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                    className="rounded-xl font-bold"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase mb-1.5 block">Sale Price (₹) *</Label>
                  <Input
                    type="number"
                    placeholder="Selling Price"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="rounded-xl font-bold text-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-bold uppercase mb-1.5 block">Cashback (₹)</Label>
                  <Input
                    type="number"
                    placeholder="Reward amount"
                    value={form.cashback}
                    onChange={(e) => setForm({ ...form, cashback: e.target.value })}
                    className="rounded-xl font-bold text-emerald-500"
                  />
                </div>
                <div className="flex flex-col justify-end pb-1.5">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={form.is_active}
                      onCheckedChange={(val) => setForm({ ...form, is_active: val })}
                    />
                    <Label className="text-xs font-bold uppercase">Live on Store</Label>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-xs font-bold uppercase mb-1.5 block">Image URL (Primary)</Label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="https://images.unsplash.com/..."
                    value={form.image_1}
                    onChange={(e) => setForm({ ...form, image_1: e.target.value })}
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-xs font-bold uppercase mb-1.5 block border-b pb-1">Additional Images</Label>
                <div className="space-y-3 mt-3">
                  <Input
                    placeholder="Extra Image URL 2"
                    value={form.image_2}
                    onChange={(e) => setForm({ ...form, image_2: e.target.value })}
                    className="rounded-xl"
                  />
                  <Input
                    placeholder="Extra Image URL 3"
                    value={form.image_3}
                    onChange={(e) => setForm({ ...form, image_3: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="pt-4">
                <Button
                  onClick={handleCreateOrUpdate}
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Plus className="w-6 h-6 mr-2" />}
                  {editingId ? "Update Product" : "Launch Product"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(p => (
          <div key={p.id} className="glass-card rounded-[2rem] overflow-hidden group hover:border-primary/40 transition-all duration-300 bg-card/50 flex flex-col">
            {/* Preview */}
            <div className="aspect-square relative overflow-hidden bg-muted">
              <img
                src={p.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Badge className={cn(
                  "text-white border-none font-bold px-2 py-0.5",
                  p.is_active ? "bg-emerald-500" : "bg-slate-500"
                )}>
                  {p.is_active ? "Live" : "Draft"}
                </Badge>
                {p.cashback_amount > 0 && (
                  <Badge className="bg-primary text-white border-none font-black px-2 py-0.5">
                    ₹{p.cashback_amount} CB
                  </Badge>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="p-5 flex-1 flex flex-col">
              <h4 className="font-bold text-lg mb-1 line-clamp-1">{p.name}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-4 h-8">{p.description || "No description provided."}</p>

              <div className="flex items-center justify-between mb-5">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground line-through">₹{p.mrp || p.price}</span>
                  <span className="text-xl font-black text-primary">₹{p.price}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] block uppercase font-bold text-muted-foreground mb-1">Status</span>
                  <Switch
                    checked={p.is_active}
                    onCheckedChange={() => handleToggleStatus(p.id, p.is_active)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-border/50 mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl h-9"
                  onClick={() => handleEdit(p)}
                >
                  <Edit2 className="w-3.5 h-3.5 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(p.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center glass-card rounded-[2rem]">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/20 mb-4" />
            <h3 className="text-xl font-bold text-muted-foreground">No products found</h3>
            <p className="text-sm text-muted-foreground">Start by adding your first premium product!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsManagement;