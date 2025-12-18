import { BookOpen } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    about: [
      { label: "Team", href: "/about-us#team" },
      { label: "Join us", href: "/join-us" },
    ],
    privacy: [
      { label: "Terms and Conditions", href: "/terms" },
      { label: "Contact Us", href: "/contact-us" },
    ],
    social: [
      { label: "Linkedin", href: "#linkedin" },
      { label: "Instagram", href: "#instagram" },
      { label: "Twitter/X", href: "#twitter" },
    ],
  };

  return (
    <footer className="py-16 bg-background border-t border-border">
      <div className="container-main">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="font-body text-lg font-semibold text-foreground mb-2">
              Booksmart Ex.
            </h3>
            <p className="font-body text-muted-foreground mb-4">
              Save Money, Save Nature, Safe Future
            </p>
            <p className="font-body text-sm text-muted-foreground">
              © 2025 Booksmart Exchange
            </p>
          </div>

          {/* About Links */}
          <div>
            <h4 className="font-body font-semibold text-foreground mb-4">About</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Privacy Links */}
          <div>
            <h4 className="font-body font-semibold text-foreground mb-4">Privacy</h4>
            <ul className="space-y-3">
              {footerLinks.privacy.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-body font-semibold text-foreground mb-4">Social</h4>
            <ul className="space-y-3">
              {footerLinks.social.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
