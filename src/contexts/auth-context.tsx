"use client"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { RailwayService, User as RailwayUser, Member } from '@/lib/railway'

interface AuthContextType {
  user: User | null
  session: Session | null
  railwayUser: RailwayUser | null
  member: Member | null
  login: (email: string, password: string) => Promise<{ error: any }>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [railwayUser, setRailwayUser] = useState<RailwayUser | null>(null)
  const [member, setMember] = useState<Member | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Persistent cache - no time limits for desktop app
  const isValidating = useRef(false)
  const railwayUserCache = useRef<RailwayUser | null>(null)
  const memberCache = useRef<Member | null>(null)
  const cachedUserEmail = useRef<string | null>(null)

  // Check if session is still valid
  const isSessionValid = (session: Session | null) => {
    if (!session) return false
    
    const now = Math.floor(Date.now() / 1000)
    const expiresAt = session.expires_at
    
    return expiresAt ? now < expiresAt : true
  }

  // Check if we can use cached data (only re-validate on email change or no cache)
  const canUseCachedData = (email: string) => {
    return (
      railwayUserCache.current && 
      memberCache.current &&
      cachedUserEmail.current === email
    )
  }

  // Validate client access with Railway database
  const validateClientAccess = async (supabaseUser: User) => {
    const email = supabaseUser.email!
    
    // Use cached data if available for the same user
    if (canUseCachedData(email)) {
      console.log('✅ Using cached Railway user data for:', email)
      setRailwayUser(railwayUserCache.current)
      setMember(memberCache.current)
      return true
    }
    
    // Prevent concurrent validations
    if (isValidating.current) {
      console.log('⏳ Validation already in progress for:', email)
      return true
    }
    
    isValidating.current = true
    
    try {
      console.log('🔍 Validating client access for email:', email)
      
      const validation = await RailwayService.validateClientAccess(
        supabaseUser.id, 
        email
      )
      
      if (validation.isValid && validation.user) {
        // Cache the user data indefinitely
        railwayUserCache.current = validation.user
        memberCache.current = validation.member || null
        cachedUserEmail.current = email
        setRailwayUser(validation.user)
        setMember(validation.member || null)
        console.log('💾 Cached Railway user data for:', email)
        return true
      } else {
        console.warn('❌ Validation failed:', validation.error)
        railwayUserCache.current = null
        memberCache.current = null
        cachedUserEmail.current = null
        return false
      }
    } catch (error) {
      console.error('💥 Error validating client access:', error)
      return false
    } finally {
      isValidating.current = false
    }
  }

  // Clear all auth state and cache
  const clearAuthState = () => {
    setUser(null)
    setSession(null)
    setRailwayUser(null)
    setMember(null)
    railwayUserCache.current = null
    memberCache.current = null
    cachedUserEmail.current = null
    isValidating.current = false
    console.log('🧹 Cleared all auth state and cache')
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      // Check if session is valid
      if (session && !isSessionValid(session)) {
        console.warn('Session expired, clearing auth state')
        clearAuthState()
        setIsLoading(false)
        return
      }

      setSession(session)
      setUser(session?.user ?? null)
      
      // Validate client access if user exists
      if (session?.user) {
        const isValid = await validateClientAccess(session.user)
        if (!isValid) {
          // Clear state but don't call signOut to avoid loop
          clearAuthState()
        }
      }
      
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change:', event, session?.user?.email)
      
      // Handle session clearing
      if (!session) {
        clearAuthState()
        setIsLoading(false)
        return
      }
      
      // Handle session expiration
      if (event === 'TOKEN_REFRESHED' && session && !isSessionValid(session)) {
        console.warn('Session expired during refresh')
        clearAuthState()
        setIsLoading(false)
        return
      }

      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const isValid = await validateClientAccess(session.user)
        if (!isValid) {
          // Clear state and manually sign out with delay to prevent loop
          clearAuthState()
          setTimeout(() => {
            supabase.auth.signOut()
          }, 100)
        }
      } else {
        setRailwayUser(null)
        setMember(null)
      }
      
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    // Clear cache before new login (user might be different)
    clearAuthState()
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const logout = async () => {
    try {
      // Check if session is still valid before attempting logout
      if (session && !isSessionValid(session)) {
        console.warn('Session already expired, clearing local state only')
        clearAuthState()
        return
      }

      // Try to sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.warn('Supabase logout error:', error)
        // Even if server logout fails, clear local state
      }
    } catch (error) {
      console.warn('Logout error:', error)
      // Handle any unexpected errors
    } finally {
      // Always clear local state and cache regardless of server response
      clearAuthState()
    }
  }

  const value = {
    user,
    session,
    railwayUser,
    member,
    login,
    logout,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 