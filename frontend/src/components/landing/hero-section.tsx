"use client"

import Link from "next/link"
import { Header } from "./header"

export function HeroSection() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      {/* Background Image with Overlay - Always dark overlay for readability */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-100"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.85)), url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop')`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow flex flex-col justify-center items-center text-center px-5 pb-20">
          <div className="container max-w-[1100px] mx-auto">
            <h1
              className="font-bold text-4xl md:text-5xl lg:text-6xl mb-5 text-white tracking-wide"
              style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
            >
              Find your perfect study space
            </h1>
            <p className="text-base md:text-lg font-light max-w-[550px] mx-auto leading-relaxed mb-8 text-white/90">
              Book comfortable and quiet spaces across campus for your study sessions, group projects, or solo work.
            </p>
            <Link
              href="/spaces"
              className="inline-block px-7 py-3 rounded-lg font-bold transition-all duration-300 bg-white text-black border-2 border-white hover:bg-white/10 hover:text-white"
            >
              Find A Space
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}