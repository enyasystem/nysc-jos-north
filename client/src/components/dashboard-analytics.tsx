import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Users, Calendar, FileText, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkeletonStats } from "@/components/ui/skeleton";
import type { Event, Exco, Developer, Resource } from "@shared/schema";

interface AnalyticsProps {
  className?: string;
}

export function DashboardAnalytics({ className }: AnalyticsProps) {
  const { data: events, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: excos, isLoading: excosLoading } = useQuery<Exco[]>({
    queryKey: ["/api/excos"],
  });

  const { data: developers, isLoading: developersLoading } = useQuery<Developer[]>({
    queryKey: ["/api/developers"],
  });

  const { data: resources, isLoading: resourcesLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });

  const isLoading = eventsLoading || excosLoading || developersLoading || resourcesLoading;

  if (isLoading) {
    return <SkeletonStats />;
  }

  const stats = [
    {
      title: "Total Events",
      value: events?.length || 0,
      change: `+${events?.filter(e => e.status === "published").length || 0} published`,
      icon: Calendar,
      color: "from-primary to-primary/80",
      trend: "up"
    },
    {
      title: "Active Excos",
      value: excos?.filter(e => e.isActive).length || 0,
      change: `${excos?.length || 0} total members`,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      trend: "up"
    },
    {
      title: "Resources",
      value: resources?.length || 0,
      change: `${resources?.filter(r => r.category === "Documents").length || 0} documents`,
      icon: FileText,
      color: "from-green-500 to-green-600",
      trend: "up"
    },
    {
      title: "Dev Team",
      value: developers?.filter(d => d.status === "active").length || 0,
      change: `${developers?.length || 0} total developers`,
      icon: Activity,
      color: "from-purple-500 to-purple-600",
      trend: "up"
    },
  ];

  const recentActivity = [
    { action: "New event created", item: "Community Outreach", time: "2 hours ago", type: "event" },
    { action: "Resource uploaded", item: "NYSC Handbook 2024", time: "4 hours ago", type: "resource" },
    { action: "Exco profile updated", item: "Fatima Musa", time: "1 day ago", type: "exco" },
    { action: "Developer added", item: "Sarah Johnson", time: "2 days ago", type: "developer" },
  ];

  return (
    <div className={className} data-testid="dashboard-analytics">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card 
            key={stat.title} 
            className="overflow-hidden shadow-lg hover-lift border-0 bg-gradient-to-br"
            style={{
              background: `linear-gradient(135deg, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})`
            }}
            data-testid={`stat-card-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <CardContent className="p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6" />
                </div>
                <Badge 
                  variant="secondary" 
                  className="bg-white/20 text-white border-white/20"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.trend}
                </Badge>
              </div>
              <h3 className="text-3xl font-bold mb-2 animate-fade-in">{stat.value}</h3>
              <p className="text-white/80 text-sm">{stat.title}</p>
              <div className="mt-4 text-sm text-white/60">
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="shadow-lg" data-testid="recent-activity-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                data-testid={`activity-${index}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === "event" ? "bg-primary" :
                    activity.type === "resource" ? "bg-green-500" :
                    activity.type === "exco" ? "bg-blue-500" : "bg-purple-500"
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.item}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}