import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/resources", label: "Resources" },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border"
      style={{ background: 'linear-gradient(180deg, rgba(1,79,67,0.95), rgba(1,79,67,0.88))' }}
      data-testid="main-navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" data-testid="logo-link" aria-label="Go to home">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0">
                <Flag className="w-6 h-6 text-primary-foreground" aria-hidden="true" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-foreground leading-5">NYSC Jos North</h1>
                <p className="text-xs text-muted-foreground">Biodata Platform</p>
              </div>
              <div className="block sm:hidden">
                <h1 className="text-sm font-semibold text-foreground">NYSC Jos</h1>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  data-testid={`nav-link-${link.label.toLowerCase()}`}
                  aria-current={isActiveLink(link.href) ? "page" : undefined}
                >
                  <span
                    className={cn(
                      "nav-link text-foreground hover:text-primary font-medium transition-colors duration-200 px-2 py-1 rounded-md",
                      isActiveLink(link.href) && "bg-primary/10 text-primary"
                    )}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Link href="/admin" data-testid="admin-link">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 hover-lift">
                  Admin
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              data-testid="mobile-menu-button"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={cn("md:hidden bg-card border-t border-border overflow-hidden transition-max-h duration-300", isMobileMenuOpen ? "max-h-96" : "max-h-0")}
        aria-hidden={!isMobileMenuOpen}
        data-testid="mobile-menu"
      >
        <div className={cn("px-3 pt-3 pb-4 space-y-1", isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none")}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}>
              <button
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-foreground hover:bg-primary/5 hover:text-primary font-medium",
                  isActiveLink(link.href) && "bg-primary/10 text-primary"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={isActiveLink(link.href) ? "page" : undefined}
              >
                {link.label}
              </button>
            </Link>
          ))}

          <Link href="/admin" data-testid="mobile-admin-link">
            <button className="w-full text-left px-3 py-2 rounded-md bg-primary text-primary-foreground font-medium" onClick={() => setIsMobileMenuOpen(false)}>
              Admin Dashboard
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
