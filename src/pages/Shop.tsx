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

interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  onSale?: boolean;
}

const products: Product[] = [
  {
    id: 1,
    title: "Grantsmanship: Program Planning & Proposal Writing (2nd Edition)",
    price: 50.00,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=500&fit=crop",
  },
  {
    id: 2,
    title: "Legal Environment of Business 14ed",
    price: 40.00,
    originalPrice: 62.99,
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=500&fit=crop",
    onSale: true,
  },
  {
    id: 3,
    title: "MGMT 200 – Legal Environment of Business",
    price: 40.00,
    originalPrice: 62.99,
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=500&fit=crop",
    onSale: true,
  },
  {
    id: 4,
    title: "The Legal Environment of Business (14th Edition)",
    price: 80.00,
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=500&fit=crop",
  },
];

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="flex flex-col">
      {/* Product Image */}
      <div className="relative aspect-[4/5] mb-4 overflow-hidden">
        {product.onSale && (
          <span className="absolute top-3 right-3 bg-white text-foreground text-xs font-semibold px-3 py-1 z-10">
            SALE
          </span>
        )}
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <h3 className="font-body text-center text-foreground text-sm md:text-base mb-2 px-2">
        {product.title}
      </h3>

      {/* Price */}
      <div className="flex justify-center items-center gap-2 mb-4">
        {product.originalPrice && (
          <span className="text-muted-foreground line-through text-sm">
            ${product.originalPrice.toFixed(2)}
          </span>
        )}
        <span className="text-foreground font-medium">
          ${product.price.toFixed(2)}
        </span>
      </div>

      {/* Add to Cart Button */}
      <div className="flex justify-center">
        <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-none px-6 py-2 text-sm font-medium">
          Add to cart
        </Button>
      </div>
    </div>
  );
};

const Shop = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container-main py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link to="/" className="text-foreground underline hover:no-underline">
                Home
              </Link>
            </li>
            <li className="text-muted-foreground">/</li>
            <li className="text-muted-foreground">Shop</li>
          </ol>
        </nav>

        {/* Page Title */}
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6">
          Shop
        </h1>

        {/* Results Count and Sorting */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <p className="text-muted-foreground text-sm">
            Showing all {products.length} results
          </p>

          <Select defaultValue="default">
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

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
