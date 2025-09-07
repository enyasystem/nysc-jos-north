import { Users, Calendar, Book, Trophy, Shield, FolderSync, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";
import type { Engine } from "tsparticles-engine";

export default function Home() {
  // Particle options for a lively, modern effect
  const particlesInit = useCallback((engine: Engine) => {
    loadFull(engine);
  }, []);

  const particlesOptions = {
    fullScreen: { enable: false },
    background: { color: "transparent" },
    particles: {
      number: { value: 80, density: { enable: true, area: 800 } },
      color: { value: ["#38bdf8", "#f472b6", "#facc15", "#a3e635", "#fff", "#818cf8"] },
      shape: { type: ["circle", "triangle", "edge"] },
      opacity: { value: 0.7, random: { enable: true, minimumValue: 0.3 } },
      size: { value: 4, random: { enable: true, minimumValue: 1 } },
      move: {
        enable: true,
        speed: 2.2,
        direction: "none" as const,
        outModes: { default: "out" },
        random: true,
        straight: false,
        attract: { enable: false }
      },
      links: { enable: false },
      twinkle: {
        particles: {
          enable: true,
          color: "#fff",
          frequency: 0.15,
          opacity: 1
        }
      }
    },
    detectRetina: true,
    interactivity: {
      events: {
        onHover: { enable: true, mode: ["repulse", "bubble"] },
        resize: true
      },
      modes: {
        repulse: { distance: 120, duration: 0.4 },
        bubble: { distance: 180, size: 8, duration: 2, opacity: 0.8 },
        grab: { distance: 0 }
      },
      parallax: { enable: true, force: 30, smooth: 10 }
    }
  };
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
      <section className="relative gradient-bg text-white overflow-hidden">
        {/* Animated Particles */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <Particles id="tsparticles-hero" init={particlesInit} options={particlesOptions} style={{ position: "absolute" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 flex flex-col items-center justify-center z-10">
          <div className="text-center animate-fade-in-up">
            <div className="mb-10 flex flex-col items-center">
              <div className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow shadow-2xl shadow-cyan-400/20">
                <Users className="w-14 h-14 text-white drop-shadow-lg" />
              </div>
              <h1 className="text-6xl md:text-8xl font-extrabold mb-6 tracking-tight drop-shadow-lg" data-testid="hero-title">
                <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-300 bg-clip-text text-transparent animate-gradient-x">
                  NYSC Jos North
                </span>
              </h1>
              <p className="text-2xl md:text-3xl font-light mb-10 max-w-3xl mx-auto text-white/90 animate-fade-in" data-testid="hero-description">
                Official Biodata Management Platform for National Youth Service Corps Jos North Local Government
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/events">
                <Button 
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 text-xl px-10 py-5 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
                  data-testid="button-view-events"
                >
                  <Calendar className="w-6 h-6 mr-3" />
                  View Events
                </Button>
              </Link>
              <Link href="/resources">
                <Button 
                  variant="outline"
                  size="lg"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20 text-xl px-10 py-5 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
                  data-testid="button-browse-resources"
                >
                  <Book className="w-6 h-6 mr-3" />
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
