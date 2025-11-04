import { AuthPage } from "@/components/auth/auth-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In / Sign Up - Study Space",
  description: "Sign in to your account or create a new one to start booking study spaces.",
}

export default function AuthPageRoute() {
  return <AuthPage />
}