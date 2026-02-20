import { Link } from "react-router-dom";

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Features", to: "/#features" },
      { label: "Dashboard", to: "/dashboard" },
      { label: "Pricing", to: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Blog", to: "#" },
      { label: "Careers", to: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", to: "#" },
      { label: "API Reference", to: "#" },
      { label: "Support", to: "#" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-heading text-lg font-bold text-foreground mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <span className="text-xs font-bold text-primary-foreground">S</span>
              </div>
              SentimentAI
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Real-time sentiment analysis powered by advanced AI models.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-heading font-semibold text-sm text-foreground mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 SentimentAI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {["Twitter", "GitHub", "LinkedIn"].map((name) => (
              <a
                key={name}
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
