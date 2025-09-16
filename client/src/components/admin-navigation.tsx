import { Link } from "wouter";
import { Flag, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminNavigation() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-sm border-b border-white/6"
      data-testid="admin-navigation-top"
      role="banner"
    >
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-16 focus:bg-white/10 focus:px-3 focus:py-2 rounded">
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-white/8 rounded-md flex items-center justify-center">
              <Flag className="w-5 h-5 text-emerald-200" aria-hidden="true" />
            </div>
            <div className="text-white">
              <div className="text-sm font-semibold">Admin Panel</div>
              <div className="text-xs text-white/80">NYSC Jos North</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/">
              <Button variant="ghost" className="text-white/90" aria-label="Back to public site">
                Back to site
              </Button>
            </Link>
            <Button variant="ghost" className="text-white/90" aria-label="Sign out">
              <LogOut className="w-4 h-4 mr-2 text-emerald-200" aria-hidden="true" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
