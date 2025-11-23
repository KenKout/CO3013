"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SignInForm } from "./sign-in-form"
import { SignUpForm } from "./sign-up-form"
import { useMobile } from "@/hooks/use-mobile"
import { useAuth } from "@/hooks/useAuth"

export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const isMobile = useMobile()
  const router = useRouter()
  const { isAuthenticated, initializing } = useAuth()

  // Redirect to home if already logged in
  useEffect(() => {
    if (!initializing && isAuthenticated && !isRedirecting) {
      setIsRedirecting(true)
      // Use replace instead of push to avoid adding to history
      router.replace("/")
    }
  }, [isAuthenticated, initializing, isRedirecting, router])

  // Show loading state while checking authentication or redirecting
  if (initializing || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  // Don't render the auth forms if authenticated (redirect in progress)
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Redirecting...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-5">
      <div className="relative w-full max-w-[1600px] h-[85vh] min-h-[750px] bg-background rounded-xl shadow-2xl overflow-hidden">
        {/* Sign In Form */}
        <div
          className={`absolute top-0 h-full w-full md:w-1/2 transition-all duration-600 ease-in-out ${
            isSignUp ? (isMobile ? "-translate-x-full" : "translate-x-full") : "translate-x-0"
          } ${isSignUp ? "opacity-0 md:opacity-100 z-[1]" : "opacity-100 z-[2]"}`}
        >
          <SignInForm onSwitchToSignUp={() => setIsSignUp(true)} />
        </div>

        {/* Sign Up Form */}
        <div
          className={`absolute top-0 h-full w-full md:w-1/2 transition-all duration-600 ease-in-out ${
            isSignUp ? "translate-x-0 md:translate-x-full opacity-100 z-[5]" : "translate-x-full md:translate-x-0 opacity-0 z-[1]"
          }`}
        >
          <SignUpForm onSwitchToSignIn={() => setIsSignUp(false)} />
        </div>

        {/* Overlay Panel - Hidden on Mobile */}
        {!isMobile && (
          <div
            className={`absolute top-0 left-1/2 h-full w-1/2 overflow-hidden transition-transform duration-600 ease-in-out z-[100] ${
              isSignUp ? "-translate-x-full" : "translate-x-0"
            }`}
          >
            <div
              className={`relative h-full w-[200%] transition-transform duration-600 ease-in-out ${
                isSignUp ? "translate-x-1/2" : "translate-x-0"
              }`}
              style={{
                left: "-100%",
              }}
            >
              {/* Background Image with Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0.3) 100%), url('https://images.unsplash.com/photo-1541873676-a18131494184?q=80&w=2518&auto=format&fit=crop')`,
                }}
              />

              {/* Left Panel (Welcome Back) */}
              <div
                className={`absolute top-0 h-full w-1/2 flex flex-col items-center justify-center px-10 text-center transition-transform duration-600 ease-in-out ${
                  isSignUp ? "translate-x-0" : "-translate-x-[20%]"
                }`}
              >
                <h1
                  className="text-4xl font-bold text-white mb-4"
                  style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
                >
                  Welcome Back!
                </h1>
                <p className="text-lg text-white/90 mb-8 max-w-[80%] leading-relaxed">
                  Already have an account? Sign in to continue your journey.
                </p>
                <button
                  onClick={() => setIsSignUp(false)}
                  className="px-11 py-4 rounded-lg font-bold uppercase tracking-wider transition-transform active:scale-95 bg-transparent border-2 border-white text-white hover:bg-white/10"
                >
                  Sign In
                </button>
              </div>

              {/* Right Panel (First Time Here) */}
              <div
                className={`absolute top-0 right-0 h-full w-1/2 flex flex-col items-center justify-center px-10 text-center transition-transform duration-600 ease-in-out ${
                  isSignUp ? "translate-x-[20%]" : "translate-x-0"
                }`}
              >
                <h1
                  className="text-4xl font-bold text-white mb-4"
                  style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
                >
                  First time here?
                </h1>
                <p className="text-lg text-white/90 mb-2 max-w-[80%] leading-relaxed">
                  A smart, convenient, and modern
                </p>
                <p className="text-lg font-semibold text-white mb-2 max-w-[80%]">
                  classroom booking system
                </p>
                <p className="text-lg text-white/90 mb-8 max-w-[80%] leading-relaxed">
                  for students and lecturers
                </p>
                <button
                  onClick={() => setIsSignUp(true)}
                  className="px-11 py-4 rounded-lg font-bold uppercase tracking-wider transition-transform active:scale-95 bg-transparent border-2 border-white text-white hover:bg-white/10"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}