import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MessageDialog from "@/components/MessageDialog";
import type { User } from "@supabase/supabase-js";

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
  user_id: string;
  categories?: { name: string } | null;
  stores?: { name: string } | null;
}

interface Category {
  id: string;
  name: string;
}

const ProductCard = ({
  product,
  onMessage,
}: {
  product: Product;
  onMessage: (product: Product) => void;
}) => (
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
      <Button
        onClick={() => onMessage(product)}
        className="bg-foreground text-background hover:bg-foreground/90 rounded-none px-6 py-2 text-sm font-medium"
      >
        Message Seller
      </Button>
    </div>
  </div>
);

const Shop = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const storeFilter = searchParams.get("store");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messageTarget, setMessageTarget] = useState<Product | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedSearch(value), 300);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleMessage = (product: Product) => {
    if (!currentUser) {
      toast({ title: "Sign in required", description: "Sign in to message sellers.", variant: "destructive" });
      navigate("/my-account");
      return;
    }
    if (currentUser.id === product.user_id) {
      toast({ title: "That's your listing", description: "You can't message yourself." });
      return;
    }
    setMessageTarget(product);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        (() => {
          let query = supabase
            .from("products")
            .select("*, categories(name), stores(name)");
          if (storeFilter) query = query.eq("store_id", storeFilter);
          if (debouncedSearch) {
            query = query.or(
              `title.ilike.%${debouncedSearch}%,description.ilike.%${debouncedSearch}%`
            );
          }
          return query;
        })(),
        supabase.from("categories").select("*").order("name"),
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, [storeFilter, debouncedSearch]);

  let filtered = [...products];
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

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-9 rounded-none border-border w-full sm:max-w-md"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <p className="text-muted-foreground text-sm">
            Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </p>

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
          <p className="text-center py-12 text-foreground/60">
            {debouncedSearch
              ? `No books found for "${debouncedSearch}".`
              : "No products available yet."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onMessage={handleMessage} />
            ))}
          </div>
        )}
      </main>

      {messageTarget && currentUser && (
        <MessageDialog
          productId={messageTarget.id}
          productTitle={messageTarget.title}
          sellerId={messageTarget.user_id}
          currentUserId={currentUser.id}
          open={true}
          onClose={() => setMessageTarget(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default Shop;
