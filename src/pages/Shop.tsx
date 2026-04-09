import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  on_sale: boolean;
  category_id: string | null;
  store_id: string;
  categories?: { name: string } | null;
  stores?: { name: string } | null;
}

interface Category {
  id: string;
  name: string;
}

const ProductCard = ({ product }: { product: Product }) => (
  <div className="flex flex-col">
    <div className="relative aspect-[4/5] mb-4 overflow-hidden bg-muted">
      {product.on_sale && (
        <span className="absolute top-3 right-3 bg-white text-foreground text-xs font-semibold px-3 py-1 z-10">
          SALE
        </span>
      )}
      {product.image_url ? (
        <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image</div>
      )}
    </div>
    <h3 className="font-body text-center text-foreground text-sm md:text-base mb-1 px-2">
      {product.title}
    </h3>
    {product.categories && (
      <p className="text-center text-xs text-muted-foreground mb-2">{product.categories.name}</p>
    )}
    <div className="flex justify-center items-center gap-2 mb-4">
      {product.original_price && (
        <span className="text-muted-foreground line-through text-sm">
          ${Number(product.original_price).toFixed(2)}
        </span>
      )}
      <span className="text-foreground font-medium">${Number(product.price).toFixed(2)}</span>
    </div>
    <div className="flex justify-center">
      <Link to={`/store-list?store=${product.store_id}`}>
        <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-none px-6 py-2 text-sm font-medium">
          Contact owner
        </Button>
      </Link>
    </div>
  </div>
);

const Shop = () => {
  const [searchParams] = useSearchParams();
  const storeFilter = searchParams.get("store");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [prodRes, catRes] = await Promise.all([
        (() => {
          let query = supabase
            .from("products")
            .select("*, categories(name), stores(name)");
          if (storeFilter) query = query.eq("store_id", storeFilter);
          return query;
        })(),
        supabase.from("categories").select("*").order("name"),
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, [storeFilter]);

  let filtered = [...products];
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }
  if (selectedCategory !== "all") {
    filtered = filtered.filter((p) => p.category_id === selectedCategory);
  }
  if (sortBy === "price-low") filtered.sort((a, b) => a.price - b.price);
  else if (sortBy === "price-high") filtered.sort((a, b) => b.price - a.price);
  else if (sortBy === "name") filtered.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container-main py-8">
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link to="/" className="text-foreground underline hover:no-underline">Home</Link>
            </li>
            <li className="text-muted-foreground">/</li>
            <li className="text-muted-foreground">Shop</li>
          </ol>
        </nav>

        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Shop</h1>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <p className="text-muted-foreground text-sm">
            Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </p>

          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-none border-border"
            />
          </div>

          <div className="flex gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px] rounded-none border-border">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] rounded-none border-border">
                <SelectValue placeholder="Default sorting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default sorting</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Sort by Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <p className="text-center py-12 text-foreground/60">Loading products...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-12 text-foreground/60">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
