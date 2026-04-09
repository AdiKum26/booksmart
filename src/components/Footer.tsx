import logo from "@/assets/logo.png";

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
      { label: "Instagram", href: "https://www.instagram.com/booksmartexllc?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
    ],
  };

  return (
    <footer className="py-16 bg-background border-t border-border">
      <div className="container-main">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <img src={logo} alt="Smart Booksmart Exchange" className="h-16 w-auto" />
            </div>
            <p className="font-body text-sm text-muted-foreground">
              © 2026 Booksmart Exchange
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
                    target="_blank"
                    rel="noopener noreferrer"
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
