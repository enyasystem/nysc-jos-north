import React from "react";
import { Users, Calendar, Book, Trophy, Shield, FolderSync, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";
import type { Engine } from "tsparticles-engine";
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, MeshTransmissionMaterial } from '@react-three/drei';
// Postprocessing removed temporarily due to runtime error in dev environment
// import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import { useRef, useMemo, useState, useEffect } from 'react';
// Local lightweight aliases to avoid requiring @types/three during development
type Mesh = any;
type Group = any;
import { Suspense } from 'react';

// --- 3D Scene Component for Realism ---
function Scene({ realistic = false }: { realistic?: boolean }) {
  // Rotating globe refs
  const globeRef = useRef<Mesh | null>(null);
  const markerRef = useRef<Mesh | null>(null);

  // Convert lat/lon to 3D cartesian on a sphere of given radius
  const latLonToCartesian = (lat: number, lon: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return [x, y, z] as [number, number, number];
  };

  // Example: Jos (approx) latitude/longitude
  const josPos = useMemo(() => latLonToCartesian(9.8965, 8.8583, 1.75), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Gentle continuous rotation
    if (globeRef.current) {
      globeRef.current.rotation.y = t * (realistic ? 0.12 : 0.06);
    }
    // Pulse marker slightly
    if (markerRef.current) {
      const pulse = 1 + Math.sin(t * 3) * 0.08;
      markerRef.current.scale.set(pulse, pulse, pulse);
    }
  });
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={0.9} />
  {/* Camera shake removed to avoid view drifting in smaller hero placements */}
      {/* Rotating globe with a subtle cloud layer and a marker for Jos North */}
      <group>
        <mesh ref={globeRef} castShadow receiveShadow>
          <sphereGeometry args={[1.7, 64, 64]} />
          <meshPhysicalMaterial
            color={realistic ? '#2b6cb0' : '#3b82f6'}
            roughness={0.8}
            metalness={0.05}
            clearcoat={0.05}
          />
        </mesh>

        {/* Cloud layer */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.72, 64, 64]} />
          <meshStandardMaterial color="#ffffff" opacity={0.06} transparent />
        </mesh>

        {/* Small marker for Jos North LGA */}
        <mesh ref={markerRef} position={josPos}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.9} />
        </mesh>
      </group>
      {/* Contact shadow for realism */}
      <ContactShadows position={[0, -2, 0]} opacity={0.25} scale={8} blur={2.8} far={3.5} />
  <Environment preset="city" background={false} />
  {/* Disable autoRotate so the camera remains stable inside the hero section */}
  <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
  {/* Postprocessing removed to avoid runtime error in @react-three/postprocessing */}
    </>
  );
}

export default function Home() {
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    const onError = (e: ErrorEvent) => {
      const stack = (e.error && e.error.stack) || `${e.filename}:${e.lineno}:${e.colno}`;
      const msg = `Error: ${e.message}\n${stack}`;
      console.error(msg, e.error);
  // Defer setState to avoid React "setState during render" warnings
  setTimeout(() => setLastError(msg), 0);
    };

    const onRejection = (e: PromiseRejectionEvent) => {
      const reason = e.reason;
      const stack = reason && reason.stack ? reason.stack : String(reason);
      const msg = `UnhandledRejection: ${String(reason)}\n${stack}`;
      console.error(msg, reason);
  // Defer setState to avoid React "setState during render" warnings
  setTimeout(() => setLastError(msg), 0);
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection as EventListener);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection as EventListener);
    };
  }, []);
  // Particle options for a lively, modern effect
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
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
        outModes: "out",
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
      {lastError && (
        <div className="fixed inset-4 z-50 bg-black/70 flex items-start justify-center p-8">
          <div className="max-w-3xl w-full bg-white rounded p-6 overflow-auto">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold">Runtime Error</h3>
              <button className="text-sm text-muted-foreground" onClick={() => setLastError(null)}>Dismiss</button>
            </div>
            <pre className="text-xs whitespace-pre-wrap mt-4">{lastError}</pre>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <section className="relative gradient-bg text-white overflow-hidden">
        {/* Animated Particles */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <Particles id="tsparticles-hero" init={particlesInit} options={particlesOptions as any} style={{ position: "absolute" }} />
        </div>
        {/* Responsive flex row for hero content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 flex flex-col md:flex-row items-center justify-between z-10 gap-12 md:gap-0">
          {/* 3D Animated ICT Data Sphere: absolute behind text on mobile, right on desktop */}
          <div
            className="block md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] opacity-70 select-none pointer-events-none z-0"
            aria-hidden="true"
          >
            <Suspense fallback={null}>
              <Canvas camera={{ position: [0, 0, 7], fov: 60 }} gl={{ alpha: true }}>
                <Scene realistic />
              </Canvas>
            </Suspense>
          </div>
          {/* Hero text left */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left animate-fade-in-up z-10">
            <div className="mb-10 flex flex-col items-center md:items-start">
              <div className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center mb-8 animate-bounce-slow shadow-2xl shadow-cyan-400/20">
                <Users className="w-14 h-14 text-white drop-shadow-lg" />
              </div>
              <h1 className="text-6xl md:text-8xl font-extrabold mb-6 tracking-tight drop-shadow-lg" data-testid="hero-title">
                <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-300 bg-clip-text text-transparent animate-gradient-x">
                  NYSC Jos North
                </span>
              </h1>
              <p className="text-2xl md:text-3xl font-light mb-10 max-w-3xl mx-auto md:mx-0 text-white/90 animate-fade-in" data-testid="hero-description">
                Official Biodata Management Platform for National Youth Service Corps Jos North Local Government
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
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
          {/* 3D Animated ICT Data Sphere right (desktop only) */}
          <div className="hidden md:flex w-full md:w-1/2 justify-center items-center relative mt-12 md:mt-0 z-0">
            <div className="w-[320px] h-[320px] md:w-[420px] md:h-[420px] lg:w-[520px] lg:h-[520px] opacity-80 select-none pointer-events-none">
              <Suspense fallback={null}>
                <Canvas camera={{ position: [0, 0, 7], fov: 60 }} gl={{ alpha: true }}>
                  <Scene realistic />
                </Canvas>
              </Suspense>
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
