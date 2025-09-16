import { useState } from "react";
import { Users, Calendar, Book, Settings, BarChart3, Plus, List } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DashboardAnalytics } from "@/components/dashboard-analytics";
import ExcosManagement from "@/components/admin/excos-management";
import DevelopersManagement from "@/components/admin/developers-management";
import EventsManagement from "@/components/admin/events-management";
import ResourcesManagement from "@/components/admin/resources-management";
import UiSettings from "@/components/admin/ui-settings";
import AdminLayout from "@/components/admin-layout";

type AdminSection = "dashboard" | "excos" | "developers" | "events" | "resources" | "ui-settings";

export default function Admin() {
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");

  const sidebarItems: { id: AdminSection; label: string; icon: React.ComponentType<any> }[] = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "excos", label: "Manage Excos", icon: Users },
    { id: "developers", label: "Manage Developers", icon: Settings },
    { id: "events", label: "Manage Events", icon: Calendar },
    { id: "resources", label: "Manage Resources", icon: Book },
    { id: "ui-settings", label: "UI Settings", icon: Settings },
  ];

  const stats = [
    { title: "Total Events", value: "24", change: "+5 this week", icon: Calendar, color: "bg-primary" },
    { title: "Resources", value: "156", change: "+12 updated", icon: Book, color: "bg-secondary" },
    { title: "Active Excos", value: "12", change: "+2 this month", icon: Users, color: "bg-accent" },
    { title: "Developers", value: "8", change: "System stable", icon: Settings, color: "bg-purple-500" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "excos":
        return <ExcosManagement />;
      case "developers":
        return <DevelopersManagement />;
      case "events":
        return <EventsManagement />;
      case "resources":
        return <ResourcesManagement />;
      case "ui-settings":
        return <UiSettings />;
      default:
        return (
          <div className="p-8" data-testid="admin-dashboard">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2 animate-fade-in">Admin Dashboard</h1>
              <p className="text-emerald-100">Real-time overview of NYSC Jos North portal activities</p>
            </div>

            <DashboardAnalytics className="mb-8" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6 shadow-lg hover-lift border-0 bg-white/3 text-white" data-testid="quick-actions-card">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <div className="w-2 h-8 bg-emerald-300 rounded-full" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button
                    className="w-full justify-start btn-premium hover-lift"
                    onClick={() => setActiveSection("events")}
                    data-testid="quick-action-create-event"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Event
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover-lift border-white/6 text-white"
                    onClick={() => setActiveSection("resources")}
                    data-testid="quick-action-upload-resource"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Resource
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover-lift border-white/6 text-white"
                    onClick={() => setActiveSection("excos")}
                    data-testid="quick-action-add-exco"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Exco
                  </Button>
                </div>
              </Card>

              <Card className="p-6 shadow-lg hover-lift border-0 bg-white/3 text-white" data-testid="platform-management-card">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <div className="w-2 h-8 bg-emerald-300 rounded-full" />
                  Platform Management
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover-lift border-white/6 text-white"
                    onClick={() => setActiveSection("ui-settings")}
                    data-testid="platform-action-customize-ui"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Customize UI
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover-lift border-white/6 text-white"
                    onClick={() => setActiveSection("developers")}
                    data-testid="platform-action-manage-team"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Manage Team
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover-lift border-white/6 text-white"
                    onClick={() => setActiveSection("resources")}
                    data-testid="platform-action-manage-resources"
                  >
                    <List className="w-4 h-4 mr-2" />
                    Manage Resources
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <AdminLayout>
      <div className="flex" data-testid="admin-page">
  <aside className="admin-sidebar w-64 flex-shrink-0 shadow-xl min-h-screen text-emerald-100 border-r border-white/6" data-testid="admin-sidebar">
          <div className="p-6 pt-6">
            <nav className="space-y-2" data-testid="admin-navigation">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-left",
                    activeSection === item.id ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                  data-testid={`nav-${item.id}`}
                >
      <item.icon className="w-5 h-5 text-emerald-200" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

  <div className="flex-1 bg-transparent">{renderContent()}</div>
      </div>
    </AdminLayout>
  );
}
 
