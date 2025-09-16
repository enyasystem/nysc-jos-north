import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import AdminNavigation from "@/components/admin-navigation";
import AdminFooter from "@/components/admin-footer";
import { useLocation } from "wouter";
import Home from "@/pages/home";
import Events from "@/pages/events";
import Resources from "@/pages/resources";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/events" component={Events}/>
      <Route path="/resources" component={Resources}/>
      <Route path="/admin" component={Admin}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="nysc-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
 
function AppContent() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  return (
    <div className="min-h-screen bg-background dark:bg-background transition-colors duration-300">
      {/* For admin routes, AdminLayout handles navigation and footer to avoid duplicates */}
      {!isAdminRoute && <Navigation />}
      <main className={isAdminRoute ? "pt-0" : "pt-16"}>
        <Router />
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
