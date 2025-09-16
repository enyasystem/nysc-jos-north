// Temporary: disable TS checking for this complex 3D page while we align three/@types/three and react-three versions
// Permanent fix: align `three`, `@types/three`, `@react-three/fiber` and `@react-three/drei` versions and update types accordingly.
// @ts-nocheck
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
import * as THREE from 'three';
import { OrbitControls, Environment, ContactShadows, MeshTransmissionMaterial } from '@react-three/drei';
// Postprocessing removed temporarily due to runtime error in dev environment
// import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import { useRef, useMemo, useState, useEffect } from 'react';
// Local lightweight aliases to avoid requiring @types/three during development
type Mesh = any;
type Group = any;
import { Suspense } from 'react';

// Simple, lightweight typewriter text component
function TypewriterText({ text, className = '' }: { text: string; className?: string }) {
  const [display, setDisplay] = useState('');
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let timer: any;
    const typingSpeed = 220; // ms per char
    const deletingSpeed = 120; // ms per char
    const pause = 2200; // ms after full text

    // Always keep display in sync with index first
    setDisplay(text.slice(0, index));

    if (!deleting) {
      if (index < text.length) {
        // schedule next character
        timer = setTimeout(() => setIndex((i) => i + 1), typingSpeed);
      } else if (index === text.length) {
        // fully typed; pause then start deleting
        timer = setTimeout(() => setDeleting(true), pause);
      }
    } else {
      if (index > 0) {
        // schedule deletion
        timer = setTimeout(() => setIndex((i) => i - 1), deletingSpeed);
      } else {
        // finished deleting -> start typing again
        setDeleting(false);
      }
    }

    return () => clearTimeout(timer);
  }, [index, deleting, text]);

  return (
    <span className={`${className} inline-block typewriter-glow`} aria-live="polite">
      {display}
    </span>
  );
}

// Local styles for glow and (legacy) blink keyframes
const styleEl = (
  <style>{`
    @keyframes blink { 0%,49% { opacity: 1 } 50%,100% { opacity: 0 } }
    .animate-blink { animation: blink 1s steps(2,start) infinite }

    /* Subtle pulsing glow for the hero typewriter text */
    .typewriter-glow {
      color: #ffffff;
      /* layered text-shadow for soft glow */
      text-shadow: 0 0 6px rgba(255,255,255,0.06), 0 0 18px rgba(16,185,129,0.04);
      transition: text-shadow 220ms ease-in-out, transform 220ms ease-in-out;
      will-change: text-shadow, transform;
      animation: glowPulse 2.8s ease-in-out infinite;
    }

    @keyframes glowPulse {
      0% {
        text-shadow: 0 0 4px rgba(255,255,255,0.04), 0 0 10px rgba(16,185,129,0.02);
        transform: translateY(0);
      }
      50% {
        text-shadow: 0 0 12px rgba(255,255,255,0.12), 0 0 28px rgba(16,185,129,0.08);
        transform: translateY(-2px);
      }
      100% {
        text-shadow: 0 0 4px rgba(255,255,255,0.04), 0 0 10px rgba(16,185,129,0.02);
        transform: translateY(0);
      }
    }
  `}</style>
);

// --- 3D Scene Component for Realism ---
function Scene({ realistic = false }: { realistic?: boolean }) {
  // Rotating globe refs
  const globeGroupRef = useRef<Group | null>(null);
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
  // Increase globe size for better visibility
  const globeRadius = 2.2;
  const josPos = useMemo(() => latLonToCartesian(9.8965, 8.8583, globeRadius), [globeRadius]);

  // Load Earth textures with error handling – fall back to null if a texture fails to load
  const [earthTexture, setEarthTexture] = useState<any | null>(null);
  const [normalMap, setNormalMap] = useState<any | null>(null);
  const [bumpMap, setBumpMap] = useState<any | null>(null);
  const [specularMap, setSpecularMap] = useState<any | null>(null);
  const [cloudsMap, setCloudsMap] = useState<any | null>(null);
  const cloudRef = useRef<Mesh | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const urls = {
      earth: 'https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg',
      normal: 'https://threejs.org/examples/textures/earth_normalmap_2048.jpg',
      bump: 'https://threejs.org/examples/textures/earthbump1k.jpg',
  spec: 'https://threejs.org/examples/textures/earthspec1k.jpg',
  clouds: 'https://threejs.org/examples/textures/earth_clouds_1024.png',
    };

    // helper: create a simple canvas-based fallback Earth-like texture when external loads fail
    const createFallbackEarthTexture = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        // sky/ocean
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#2b6fb3');
        grad.addColorStop(1, '#0b3d66');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // simple continents as green blobs
        ctx.fillStyle = '#3a8a3a';
        for (let i = 0; i < 10; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const w = 160 + Math.random() * 260;
          const h = 80 + Math.random() * 160;
          ctx.beginPath();
          ctx.ellipse(x, y, w, h, Math.random() * Math.PI, 0, Math.PI * 2);
          ctx.fill();
        }
        // clouds
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        for (let i = 0; i < 30; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const r = 8 + Math.random() * 60;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
        const texture = new THREE.CanvasTexture(canvas);
        try { texture.encoding = THREE.sRGBEncoding; texture.needsUpdate = true; } catch (e) { }
        return texture;
      } catch (e) {
        console.warn('Failed to create fallback earth texture', e);
        return null;
      }
    };

    loader.load(urls.earth,
      (tex: THREE.Texture) => {
        try { tex.encoding = THREE.sRGBEncoding; tex.needsUpdate = true; } catch (e) { /* ignore when not applicable */ }
        setEarthTexture(tex);
      },
      undefined,
      (err: any) => {
        console.warn('Failed to load earth texture', err);
        const fallback = createFallbackEarthTexture();
        if (fallback) setEarthTexture(fallback);
        else setEarthTexture(null);
      }
    );

    loader.load(urls.normal,
      (tex: THREE.Texture) => {
        try { tex.needsUpdate = true; } catch (e) { }
        setNormalMap(tex);
      },
      undefined,
      (err: any) => { console.warn('Failed to load normal map', err); setNormalMap(null); }
    );

    loader.load(urls.bump,
      (tex: THREE.Texture) => {
        try { tex.needsUpdate = true; } catch (e) { }
        setBumpMap(tex);
      },
      undefined,
      (err: any) => { console.warn('Failed to load bump map', err); setBumpMap(null); }
    );

    loader.load(urls.spec,
      (tex: THREE.Texture) => {
        try { tex.needsUpdate = true; } catch (e) { }
        setSpecularMap(tex);
      },
      undefined,
      (err: any) => { console.warn('Failed to load specular map', err); setSpecularMap(null); }
    );

    loader.load(urls.clouds,
      (tex: THREE.Texture) => {
        try { tex.encoding = THREE.sRGBEncoding; tex.needsUpdate = true; } catch (e) { }
        setCloudsMap(tex);
      },
      undefined,
      (err: any) => { console.warn('Failed to load clouds map', err); setCloudsMap(null); }
    );

    // Load a premium SVG icon as data URL and apply it to the plane mesh's material
    try {
      const badgeSvg = encodeURIComponent(`
        <svg xmlns='http://www.w3.org/2000/svg' width='1024' height='1024' viewBox='0 0 200 200'>
          <defs>
            <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
              <stop offset='0%' stop-color='#06b6d4'/>
              <stop offset='100%' stop-color='#7c3aed'/>
            </linearGradient>
            <filter id='f' x='-50%' y='-50%' width='200%' height='200%'>
              <feDropShadow dx='0' dy='6' stdDeviation='10' flood-color='#000' flood-opacity='0.25' />
            </filter>
          </defs>
          <g filter='url(#f)'>
            <rect x='10' y='10' width='180' height='180' rx='24' fill='url(#g)' />
            <circle cx='100' cy='80' r='34' fill='rgba(255,255,255,0.14)' />
            <text x='100' y='92' font-family='Arial, Helvetica, sans-serif' font-size='36' fill='#fff' font-weight='700' text-anchor='middle'>NYSC</text>
            <text x='100' y='132' font-family='Arial, Helvetica, sans-serif' font-size='14' fill='rgba(255,255,255,0.9)' text-anchor='middle'>Jos North</text>
          </g>
        </svg>
      `);
      const svgDataUrl = `data:image/svg+xml;charset=utf-8,${badgeSvg}`;
      loader.load(svgDataUrl, (tex: THREE.Texture) => {
        try { tex.encoding = THREE.sRGBEncoding; tex.needsUpdate = true; } catch (e) { }
        setEarthTexture((prev: any) => prev || tex);
      }, undefined, (err: any) => console.warn('Failed to load badge SVG texture', err));
    } catch (e) {
      console.warn('Failed to create SVG data URL', e);
    }
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Gentle continuous rotation of the whole globe group so markers move with it
    if (globeGroupRef.current) {
      // Slightly faster when realistic to match screenshot feel
      globeGroupRef.current.rotation.y = t * (realistic ? 0.18 : 0.08);
    } else if (globeRef.current) {
      globeRef.current.rotation.y = t * (realistic ? 0.18 : 0.08);
    }
    // Pulse marker slightly
    if (markerRef.current) {
      const pulse = 1 + Math.sin(t * 3) * 0.08;
      markerRef.current.scale.set(pulse, pulse, pulse);
    }
    // Gentle bobbing for the badge to add polish
    if (globeRef.current) {
      const bob = Math.sin(t * 1.2) * 0.06;
      globeRef.current.position.y = bob;
    }
    // Rotate clouds slightly faster for subtle movement
    if (cloudRef.current) {
      cloudRef.current.rotation.y = t * (realistic ? 0.28 : 0.12);
    }
  });
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={0.9} />
  {/* Camera shake removed to avoid view drifting in smaller hero placements */}
      {/* Rotating globe with a subtle cloud layer and a marker for Jos North */}
      <group ref={globeGroupRef}>
        {/* 3D textured globe */}
        <mesh ref={globeRef} rotation={[0, 0, 0]} castShadow receiveShadow>
          <sphereGeometry args={[globeRadius, 64, 64]} />
          {/* Use PBR-style standard material for more natural lighting/reflections */}
          <meshStandardMaterial
            {...(earthTexture ? { map: earthTexture } : {})}
            {...(normalMap ? { normalMap } : {})}
            {...(bumpMap ? { bumpMap } : {})}
            // Use roughness/metalness to simulate ocean specular and land roughness
            roughness={0.6}
            metalness={0.05}
            envMapIntensity={0.8}
            // slightly emissive to keep colors vivid against dark gradient
            emissive={new THREE.Color(0x000000)}
            // When specularMap exists, use it as an aoMap-like influence via displacement of roughness
            {...(specularMap ? { aoMap: specularMap, aoMapIntensity: 0.6 } : {})}
          />
        </mesh>

        {/* Cloud layer */}
        {cloudsMap && (
          <mesh ref={cloudRef} rotation={[0, 0, 0]} castShadow receiveShadow>
            {/* Slightly larger cloud shell with smoother geometry for soft look */}
            <sphereGeometry args={[globeRadius + 0.03, 96, 96]} />
            <meshStandardMaterial
              map={cloudsMap}
              transparent
              opacity={0.72}
              depthWrite={false}
              alphaTest={0.01}
              // subtle sheen and smoothness
              roughness={0.9}
              metalness={0}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* Soft halo ring behind the globe for depth (use Standard material to avoid JSX name issue) */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.7]}>
          <ringGeometry args={[globeRadius + 0.08, globeRadius + 0.5, 128]} />
          <meshStandardMaterial color="#06b6d4" transparent opacity={0.05} emissive="#0ea5a4" emissiveIntensity={0.6} />
        </mesh>

        {/* Small marker for Jos North LGA (kept for reference) */}
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
      {styleEl}
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
  <section className="relative text-white overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--admin-deep-sea), rgba(1,79,67,0.88))' }}>
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
              <Canvas
                camera={{ position: [0, 0, 7], fov: 60 }}
                gl={{ alpha: true, antialias: true }}
                shadows
                onCreated={(state) => {
                  try {
                    state.gl.outputEncoding = THREE.sRGBEncoding;
                    state.gl.toneMapping = THREE.ACESFilmicToneMapping as any;
                    state.gl.toneMappingExposure = 1;
                  } catch (e) { }
                }}
              >
                <Scene realistic />
              </Canvas>
            </Suspense>
          </div>
          {/* Hero text left */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left animate-fade-in-up z-10">
            <div className="mb-10 flex flex-col items-center md:items-start">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 animate-bounce-slow shadow-lg">
                <Users className="w-12 h-12 text-white/95" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-sm" data-testid="hero-title">
                <TypewriterText text="NYSC Jos North" className="text-white" />
              </h1>
              <p className="text-lg md:text-xl font-medium mb-8 max-w-2xl mx-auto md:mx-0 text-white/90 animate-fade-in" data-testid="hero-description">
                Official biodata management platform for NYSC Jos North — register, find resources, and join events.
              </p>
            </div>
    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/events">
                <Button 
                  size="lg"
      className="btn-accent text-white hover:opacity-95 text-lg px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
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
      className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-lg px-8 py-3 rounded-full shadow hover:scale-105 transition-transform duration-200"
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
                <Canvas
                  camera={{ position: [0, 0, 7], fov: 60 }}
                  gl={{ alpha: true, antialias: true }}
                  shadows
                  onCreated={(state) => {
                    try {
                      state.gl.outputEncoding = THREE.sRGBEncoding;
                      state.gl.toneMapping = THREE.ACESFilmicToneMapping as any;
                      state.gl.toneMappingExposure = 1;
                    } catch (e) { }
                  }}
                >
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
          {/* Center the stats: use a responsive grid that becomes 3 columns on md and center the grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center items-center">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-1">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={feature.title} className="p-4 h-full card transform transition-shadow hover:shadow-lg" style={{ animationName: 'fadeUp', animationDuration: '420ms', animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}>
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-primary/10">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dev Section: developer bios and contact links */}
      <section className="py-20 bg-gradient-to-b from-white/6 to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Meet the Dev Team</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">Short bios and contact links for the developers who built and maintain this platform.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {[
              {
                name: 'Ada',
                role: 'Frontend Engineer',
                bio: 'Builds the user interface and ensures responsive, accessible experiences. Focus: React, TypeScript, and UX polish.',
                github: 'https://github.com/ada-dev'
              },
              {
                name: 'Chinedu',
                role: 'Backend Engineer',
                bio: 'Designs APIs, manages data models, and keeps the server reliable. Focus: Node, TypeScript, and database schema.',
                github: 'https://github.com/chinedu-dev'
              },
              {
                name: 'Sade',
                role: 'Fullstack Developer',
                bio: 'Bridges frontend and backend work, handling integration and deployment. Focus: DevOps, CI, and end-to-end testing.',
                github: 'https://github.com/sade-dev'
              }
            ].map((dev, i) => (
              <Card
                key={dev.name}
                className="p-6 shadow-sm h-full card"
                style={{ animationDelay: `${i * 80}ms`, animationName: 'fadeUp', animationDuration: '420ms', animationFillMode: 'both' }}
              >
                <CardContent className="bg-transparent p-0 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-full bg-primary/10 text-foreground/90 flex items-center justify-center font-semibold text-lg mb-4">{dev.name.charAt(0)}</div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{dev.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{dev.role}</p>
                    <p className="text-sm text-foreground/90 mb-4">{dev.bio}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <a
                      href={dev.github}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                    >
                      View GitHub
                    </a>
                    <a
                      href={`mailto:${dev.name.toLowerCase()}@example.com`}
                      className="text-sm text-muted-foreground hover:text-foreground/90 transition-colors"
                    >
                      Contact
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* View all devs button */}
      <section className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/developers">
            <Button size="lg" className="px-6 py-3 rounded-full bg-white/6 text-white hover:bg-white/10 shadow">View all developers</Button>
          </Link>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">Resources</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Browse available resources and documentation curated for corps members.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Guides', desc: 'Registration and mobilisation guides', href: '/resources' },
              { title: 'Event Kits', desc: 'Materials for running events', href: '/resources' },
              { title: 'Forms', desc: 'Downloadable forms and templates', href: '/resources' },
            ].map((r) => (
              <Card key={r.title} className="p-4 h-full card">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-foreground mb-1">{r.title}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{r.desc}</p>
                  <div className="text-right">
                    <Link href={r.href} className="text-sm text-foreground/80 hover:text-foreground">Explore</Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Excos Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">Executive Committee</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Meet the branch executive committee members leading events and outreach.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Tunde', post: 'Chairperson' },
              { name: 'Ruth', post: 'Secretary' },
              { name: 'Bala', post: 'Treasurer' }
            ].map((e) => (
              <Card key={e.name} className="p-4 h-full card">
                <CardContent className="p-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center font-semibold text-lg mb-3">{e.name.charAt(0)}</div>
                  <h4 className="font-semibold text-foreground mb-1">{e.name}</h4>
                  <p className="text-sm text-muted-foreground">{e.post}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/excos">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">View full committee</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">Ready to get started?</h3>
          <p className="text-muted-foreground mb-8">Create an account, browse resources, and join events — all in one place.</p>
          <div className="flex justify-center">
            <Link href="/register">
              <Button size="lg" className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 shadow-lg">Create Account</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Premium Animations: keyframes used by testimonials */}
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }`}</style>
    </div>
  );
}
