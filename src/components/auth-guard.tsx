"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import LoginPage from "@/app/login/page";

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])


  if (isLoading) {
    return null;
  }

  if (!user) {
    // In Electron, render the login page directly
    return <LoginPage />;
  }

  return <>{children}</>
} 