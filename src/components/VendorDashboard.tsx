import { useState, useEffect } from "react";
import { Plus, Store, Package, Pencil, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

interface StoreData {
  id: string;
  name: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
}

interface ProductData {
  id: string;
  title: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  on_sale: boolean;
  category_id: string | null;
  categories?: { name: string } | null;
}

interface Category {
  id: string;
  name: string;
}

const VendorDashboard = ({ user }: { user: User }) => {
  const { toast } = useToast();
  const [store, setStore] = useState<StoreData | null>(null);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Store form
  const [storeDialogOpen, setStoreDialogOpen] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [storeSaving, setStoreSaving] = useState(false);

  // Product form
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);
  const [productTitle, setProductTitle] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productOriginalPrice, setProductOriginalPrice] = useState("");
  const [productCategoryId, setProductCategoryId] = useState("");
  const [productOnSale, setProductOnSale] = useState(false);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productSaving, setProductSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const [storeRes, catRes] = await Promise.all([
      supabase.from("stores").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("categories").select("*").order("name"),
    ]);

    if (storeRes.data) {
      setStore(storeRes.data);
      const prodRes = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("store_id", storeRes.data.id)
        .order("created_at", { ascending: false });
      setProducts(prodRes.data || []);
    }
    setCategories(catRes.data || []);
    setLoading(false);
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setStoreSaving(true);
    const { error } = await supabase.from("stores").insert({
      user_id: user.id,
      name: storeName,
      description: storeDescription || null,
      phone: storePhone || null,
      email: storeEmail || null,
      address: storeAddress || null,
    });
    setStoreSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Store created!", description: "Your store is now live." });
      setStoreDialogOpen(false);
      resetStoreForm();
      fetchData();
    }
  };

  const handleUpdateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;
    setStoreSaving(true);
    const { error } = await supabase
      .from("stores")
      .update({
        name: storeName,
        description: storeDescription || null,
        phone: storePhone || null,
        email: storeEmail || null,
        address: storeAddress || null,
      })
      .eq("id", store.id);
    setStoreSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Store updated!" });
      setStoreDialogOpen(false);
      fetchData();
    }
  };

  const resetStoreForm = () => {
    setStoreName("");
    setStoreDescription("");
    setStorePhone("");
    setStoreEmail("");
    setStoreAddress("");
  };

  const openEditStore = () => {
    if (store) {
      setStoreName(store.name);
      setStoreDescription(store.description || "");
      setStorePhone(store.phone || "");
      setStoreEmail(store.email || "");
      setStoreAddress(store.address || "");
    }
    setStoreDialogOpen(true);
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductTitle("");
    setProductDescription("");
    setProductPrice("");
    setProductOriginalPrice("");
    setProductCategoryId("");
    setProductOnSale(false);
    setProductImage(null);
  };

  const openEditProduct = (product: ProductData) => {
    setEditingProduct(product);
    setProductTitle(product.title);
    setProductDescription(product.description || "");
    setProductPrice(product.price.toString());
    setProductOriginalPrice(product.original_price?.toString() || "");
    setProductCategoryId(product.category_id || "");
    setProductOnSale(product.on_sale || false);
    setProductImage(null);
    setProductDialogOpen(true);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) {
      toast({ title: "Image upload failed", description: error.message, variant: "destructive" });
      return null;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;
    setProductSaving(true);

    let imageUrl = editingProduct?.image_url || null;
    if (productImage) {
      const url = await uploadImage(productImage);
      if (url) imageUrl = url;
    }

    const productData = {
      title: productTitle,
      description: productDescription || null,
      price: parseFloat(productPrice),
      original_price: productOriginalPrice ? parseFloat(productOriginalPrice) : null,
      category_id: productCategoryId || null,
      on_sale: productOnSale,
      image_url: imageUrl,
    };

    let error;
    if (editingProduct) {
      ({ error } = await supabase.from("products").update(productData).eq("id", editingProduct.id));
    } else {
      ({ error } = await supabase.from("products").insert({
        ...productData,
        user_id: user.id,
        store_id: store.id,
      }));
    }

    setProductSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingProduct ? "Product updated!" : "Product listed!" });
      setProductDialogOpen(false);
      resetProductForm();
      fetchData();
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const { error } = await supabase.from("products").delete().eq("id", productId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Product deleted" });
      fetchData();
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-foreground/60">Loading...</div>;
  }

  return (
    <div className="space-y-12">
      {/* Store Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl text-foreground flex items-center gap-2">
            <Store className="w-6 h-6" /> My Store
          </h3>
          {store ? (
            <Button onClick={openEditStore} variant="outline" className="rounded-none gap-2">
              <Pencil className="w-4 h-4" /> Edit Store
            </Button>
          ) : (
            <Dialog open={storeDialogOpen} onOpenChange={setStoreDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-none bg-foreground text-background hover:bg-foreground/90 gap-2">
                  <Plus className="w-4 h-4" /> Create Store
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">Create Your Store</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateStore} className="space-y-4">
                  <div>
                    <Label>Store Name *</Label>
                    <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} required className="rounded-none" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea value={storeDescription} onChange={(e) => setStoreDescription(e.target.value)} className="rounded-none" />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={storePhone} onChange={(e) => setStorePhone(e.target.value)} className="rounded-none" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} className="rounded-none" />
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Input value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} className="rounded-none" />
                  </div>
                  <Button type="submit" disabled={storeSaving} className="rounded-none bg-foreground text-background hover:bg-foreground/90 w-full">
                    {storeSaving ? "Creating..." : "Create Store"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {store ? (
          <div className="border border-border p-6">
            <h4 className="font-display text-xl mb-2">{store.name}</h4>
            {store.description && <p className="text-foreground/70 mb-2">{store.description}</p>}
            <div className="text-sm text-foreground/60 space-y-1">
              {store.phone && <p>📞 {store.phone}</p>}
              {store.email && <p>✉️ {store.email}</p>}
              {store.address && <p>📍 {store.address}</p>}
            </div>
          </div>
        ) : (
          <p className="text-foreground/60">You haven't created a store yet. Create one to start listing textbooks!</p>
        )}

        {/* Edit Store Dialog */}
        {store && (
          <Dialog open={storeDialogOpen} onOpenChange={setStoreDialogOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">Edit Store</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateStore} className="space-y-4">
                <div>
                  <Label>Store Name *</Label>
                  <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} required className="rounded-none" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={storeDescription} onChange={(e) => setStoreDescription(e.target.value)} className="rounded-none" />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={storePhone} onChange={(e) => setStorePhone(e.target.value)} className="rounded-none" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} className="rounded-none" />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} className="rounded-none" />
                </div>
                <Button type="submit" disabled={storeSaving} className="rounded-none bg-foreground text-background hover:bg-foreground/90 w-full">
                  {storeSaving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Products Section */}
      {store && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-2xl text-foreground flex items-center gap-2">
              <Package className="w-6 h-6" /> My Textbooks
            </h3>
            <Dialog open={productDialogOpen} onOpenChange={(open) => { setProductDialogOpen(open); if (!open) resetProductForm(); }}>
              <DialogTrigger asChild>
                <Button className="rounded-none bg-foreground text-background hover:bg-foreground/90 gap-2">
                  <Plus className="w-4 h-4" /> List Textbook
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">
                    {editingProduct ? "Edit Textbook" : "List a Textbook"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div>
                    <Label>Title *</Label>
                    <Input value={productTitle} onChange={(e) => setProductTitle(e.target.value)} required className="rounded-none" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea value={productDescription} onChange={(e) => setProductDescription(e.target.value)} className="rounded-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Price ($) *</Label>
                      <Input type="number" step="0.01" min="0" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} required className="rounded-none" />
                    </div>
                    <div>
                      <Label>Original Price ($)</Label>
                      <Input type="number" step="0.01" min="0" value={productOriginalPrice} onChange={(e) => setProductOriginalPrice(e.target.value)} className="rounded-none" />
                    </div>
                  </div>
                  <div>
                    <Label>Category / Major</Label>
                    <Select value={productCategoryId} onValueChange={setProductCategoryId}>
                      <SelectTrigger className="rounded-none">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="on-sale"
                      checked={productOnSale}
                      onChange={(e) => setProductOnSale(e.target.checked)}
                    />
                    <Label htmlFor="on-sale">Mark as on sale</Label>
                  </div>
                  <div>
                    <Label>Textbook Photo</Label>
                    <div className="mt-2 border-2 border-dashed border-border rounded-none p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProductImage(e.target.files?.[0] || null)}
                        className="hidden"
                        id="product-image"
                      />
                      <label htmlFor="product-image" className="cursor-pointer flex flex-col items-center gap-2 text-foreground/60 hover:text-foreground">
                        <Upload className="w-8 h-8" />
                        <span className="text-sm">{productImage ? productImage.name : "Click to upload image"}</span>
                      </label>
                    </div>
                    {editingProduct?.image_url && !productImage && (
                      <img src={editingProduct.image_url} alt="Current" className="mt-2 w-20 h-20 object-cover" />
                    )}
                  </div>
                  <Button type="submit" disabled={productSaving} className="rounded-none bg-foreground text-background hover:bg-foreground/90 w-full">
                    {productSaving ? "Saving..." : editingProduct ? "Update Textbook" : "List Textbook"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {products.length === 0 ? (
            <p className="text-foreground/60">No textbooks listed yet. Click "List Textbook" to add one!</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="border border-border p-4">
                  {product.image_url && (
                    <img src={product.image_url} alt={product.title} className="w-full aspect-[4/5] object-cover mb-3" />
                  )}
                  <h4 className="font-body font-medium text-sm mb-1">{product.title}</h4>
                  {product.categories && (
                    <span className="text-xs text-foreground/50">{product.categories.name}</span>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {product.original_price && (
                      <span className="text-muted-foreground line-through text-sm">${Number(product.original_price).toFixed(2)}</span>
                    )}
                    <span className="font-medium">${Number(product.price).toFixed(2)}</span>
                    {product.on_sale && <span className="text-xs bg-foreground text-background px-2 py-0.5">SALE</span>}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="rounded-none gap-1" onClick={() => openEditProduct(product)}>
                      <Pencil className="w-3 h-3" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-none gap-1 text-destructive" onClick={() => handleDeleteProduct(product.id)}>
                      <Trash2 className="w-3 h-3" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
