import { Users, Calendar, Book, Trophy, Shield, FolderSync, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function Home() {
  const stats = [
    {
      icon: Users,
      value: "500+",
      label: "Active Corps Members",
    },
    {
      icon: Calendar,
      value: "25+",
      label: "Monthly Events",
    },
    {
      icon: Book,
      value: "100+",
      label: "Resources Available",
    },
    {
      icon: Trophy,
      value: "12",
      label: "Years of Excellence",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your data is protected with enterprise-grade security",
    },
    {
      icon: FolderSync,
      title: "Real-time Updates",
      description: "Get instant notifications about events and resources",
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Access from anywhere, on any device",
    },
  ];

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center animate-fade-in">
            <div className="mb-8">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-soft">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6" data-testid="hero-title">
                NYSC Jos North
              </h1>
              <p className="text-xl md:text-2xl font-light mb-8 max-w-3xl mx-auto" data-testid="hero-description">
                Official Biodata Management Platform for National Youth Service Corps Jos North Local Government
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/events">
                <Button 
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-4 hover-lift"
                  data-testid="button-view-events"
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  View Events
                </Button>
              </Link>
              <Link href="/resources">
                <Button 
                  variant="outline"
                  size="lg"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20 text-lg px-8 py-4"
                  data-testid="button-browse-resources"
                >
                  <Book className="w-5 h-5 mr-3" />
                  Browse Resources
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-2">{stat.value}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome Message */}
      <section className="bg-muted py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6" data-testid="welcome-title">
            Welcome to <span className="text-gradient">NYSC Jos North</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8" data-testid="welcome-description">
            Our platform serves as the central hub for all corps members serving in Jos North Local Government Area. 
            Stay connected, informed, and engaged with our comprehensive biodata management system.
          </p>
          
          <Card className="p-8 shadow-lg hover-lift">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature) => (
                  <div key={feature.title} className="text-center" data-testid={`feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
