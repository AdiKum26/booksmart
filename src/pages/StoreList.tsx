import { useState, useEffect } from "react";
import { Phone, Mail, MapPin, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface StoreData {
  id: string;
  name: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  created_at: string;
}

const StoreList = () => {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      const { data } = await supabase
        .from("stores")
        .select("*")
        .order("created_at", { ascending: false });
      setStores(data || []);
      setLoading(false);
    };
    fetchStores();
  }, []);

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
            <li className="text-muted-foreground">Store List</li>
          </ol>
        </nav>

        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Store List</h1>

        <p className="text-muted-foreground text-sm mb-8">
          Total stores showing: {stores.length}
        </p>

        {loading ? (
          <p className="text-foreground/60 text-center py-12">Loading stores...</p>
        ) : stores.length === 0 ? (
          <p className="text-foreground/60 text-center py-12">No stores available yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div key={store.id} className="bg-foreground/80 text-background p-6 flex flex-col justify-between min-h-[250px]">
                <div>
                  <h3 className="font-display text-2xl mb-3">{store.name}</h3>
                  {store.description && (
                    <p className="text-background/70 text-sm mb-4 line-clamp-2">{store.description}</p>
                  )}
                  <div className="space-y-2 text-sm text-background/80">
                    {store.phone && (
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4" /> {store.phone}
                      </p>
                    )}
                    {store.email && (
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4" /> {store.email}
                      </p>
                    )}
                    {store.address && (
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> {store.address}
                      </p>
                    )}
                  </div>
                </div>
                <Link
                  to={`/shop?store=${store.id}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm text-background hover:text-background/80 underline"
                >
                  View Products <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default StoreList;
