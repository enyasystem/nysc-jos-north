import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border" data-testid="main-navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" data-testid="logo-link">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Flag className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">NYSC Jos North</h1>
                <p className="text-xs text-muted-foreground">Biodata Platform</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} data-testid={`nav-link-${link.label.toLowerCase()}`}>
                <span
                  className={cn(
                    "nav-link text-foreground hover:text-primary font-medium transition-colors duration-300",
                    isActiveLink(link.href) && "text-primary"
                  )}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <Link href="/admin" data-testid="admin-link">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="mobile-menu-button"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border" data-testid="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}>
                <span
                  className={cn(
                    "block px-3 py-2 text-foreground hover:text-primary font-medium",
                    isActiveLink(link.href) && "text-primary"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <Link href="/admin" data-testid="mobile-admin-link">
              <span
                className="block px-3 py-2 text-primary font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Dashboard
              </span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
