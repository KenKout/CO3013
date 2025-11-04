"use client"

import { useState } from "react"
import Link from "next/link"
import { Logo } from "../landing/logo"
import { UserIcon, EnvelopeIcon, LockIcon } from "./auth-icons"
import { useMobile } from "@/hooks/use-mobile"
import { useTheme } from "next-themes"

interface SignUpFormProps {
  onSwitchToSignIn: () => void
}

export function SignUpForm({ onSwitchToSignIn }: SignUpFormProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const isMobile = useMobile()
  const { theme } = useTheme()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign up logic here
    console.log("Sign up:", { firstName, lastName, email, password })
  }

  const logoColor = theme === "dark" ? "white" : "currentColor"

  return (
    <form
      onSubmit={handleSubmit}
      className="h-full flex flex-col items-center justify-center px-[70px] text-center bg-background"
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-10 text-foreground">
        <Logo className="w-[30px] h-[30px]" color={logoColor} />
        <span
          className="text-2xl font-bold"
          style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
        >
          study space
        </span>
      </Link>

      {/* Title */}
      <h1
        className="text-5xl font-bold mb-8 text-foreground"
        style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
      >
        First time here?
      </h1>

      {/* Name Inputs Row */}
      <div className="flex flex-col md:flex-row gap-4 w-full mb-5">
        {/* First Name */}
        <div className="relative flex-1">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground">
            <UserIcon className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full py-4 px-5 pl-[50px] bg-muted border-none rounded-lg text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ fontFamily: 'var(--font-body, Roboto, sans-serif)' }}
          />
        </div>

        {/* Last Name */}
        <div className="relative flex-1">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground">
            <UserIcon className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full py-4 px-5 pl-[50px] bg-muted border-none rounded-lg text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ fontFamily: 'var(--font-body, Roboto, sans-serif)' }}
          />
        </div>
      </div>

      {/* Email Input */}
      <div className="relative mb-5 w-full">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground">
          <EnvelopeIcon className="w-5 h-5" />
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full py-4 px-5 pl-[50px] bg-muted border-none rounded-lg text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          style={{ fontFamily: 'var(--font-body, Roboto, sans-serif)' }}
        />
      </div>

      {/* Password Input */}
      <div className="relative mb-5 w-full">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground">
          <LockIcon className="w-5 h-5" />
        </div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full py-4 px-5 pl-[50px] bg-muted border-none rounded-lg text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          style={{ fontFamily: 'var(--font-body, Roboto, sans-serif)' }}
        />
      </div>

      {/* Sign Up Button */}
      <button
        type="submit"
        className="mt-4 px-11 py-4 rounded-lg font-bold uppercase tracking-wider transition-transform active:scale-95 bg-foreground text-background border border-foreground hover:bg-background hover:text-foreground"
      >
        Sign Up
      </button>

      {/* Mobile Only - Switch to Sign In */}
      {isMobile && (
        <p className="mt-6 text-sm text-foreground">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="font-bold hover:opacity-80 transition-opacity"
          >
            Sign In
          </button>
        </p>
      )}
    </form>
  )
}