import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: "About Us", href: "/about-us", isRoute: true },
    { label: "Dashboard", href: "#dashboard", isRoute: false },
    { label: "Shop", href: "#shop", isRoute: false },
    { label: "Store List", href: "#stores", isRoute: false },
    { label: "Checkout", href: "#checkout", isRoute: false },
    { label: "Cart", href: "#cart", isRoute: false },
    { label: "My account", href: "#account", isRoute: false },
  ];

  return (
    <header className="sticky top-0 z-50 bg-dark border-b border-dark-surface">
      <div className="container-main">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex flex-col items-center bg-text-light px-2 py-1">
              <span className="text-xs font-bold tracking-wider text-dark">SMART</span>
              <div className="flex gap-0.5">
                <div className="w-4 h-5 bg-dark rounded-sm" />
                <div className="w-4 h-5 bg-dark rounded-sm" />
              </div>
            </div>
            <span className="font-body text-lg font-semibold text-text-light">Booksmart Ex.</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-text-light/80 font-body text-sm font-medium transition-colors hover:text-text-light"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-text-light/80 font-body text-sm font-medium transition-colors hover:text-text-light"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          {/* Cart Icon */}
          <div className="flex items-center gap-4">
            <button className="text-text-light/80 hover:text-text-light transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </button>
            
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-text-light/80 hover:text-text-light"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-dark-surface">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) =>
                link.isRoute ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-text-light/80 font-body text-sm font-medium transition-colors hover:text-text-light"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-text-light/80 font-body text-sm font-medium transition-colors hover:text-text-light"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
