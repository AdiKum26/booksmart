import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: "About Us", href: "/about-us", isRoute: true },
    { label: "Join Us", href: "/join-us", isRoute: true },
    { label: "Shop", href: "/shop", isRoute: true },
    { label: "Store List", href: "/store-list", isRoute: true },
    { label: "Checkout", href: "#checkout", isRoute: false },
    { label: "Cart", href: "#cart", isRoute: false },
    { label: "My account", href: "/my-account", isRoute: true },
    { label: "Contact Us", href: "/contact-us", isRoute: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container-main">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Smart Booksmart Exchange" className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-dark/80 font-body text-sm font-medium transition-colors hover:text-dark"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-dark/80 font-body text-sm font-medium transition-colors hover:text-dark"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          {/* Cart Icon */}
          <div className="flex items-center gap-4">
            <button className="text-dark/80 hover:text-dark transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-dark/80 hover:text-dark"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) =>
                link.isRoute ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-dark/80 font-body text-sm font-medium transition-colors hover:text-dark"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-dark/80 font-body text-sm font-medium transition-colors hover:text-dark"
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
