"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { authLogger } from "@/lib/auth-logger"

type AuthContextType = {
  user: User | null
  profile: any | null
  loading: boolean
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: any; needsEmailVerification?: boolean; success?: boolean }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  refreshSession: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Function to fetch user profile
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

      if (error) {
        authLogger.error("Error fetching user profile", { error, userId })
        return null
      }

      return data
    } catch (err) {
      authLogger.error("Unexpected error fetching user profile", { error: err, userId })
      return null
    }
  }, [])

  // Function to create user profile if it doesn't exist
  const createUserProfile = useCallback(
    async (user: User) => {
      try {
        const { error } = await supabase.from("users").insert({
          id: user.id,
          email: user.email,
          display_name: user.user_metadata.display_name || user.email?.split("@")[0],
          created_at: new Date().toISOString(),
        })

        if (error) {
          authLogger.error("Error creating user profile", { error, userId: user.id })
          return null
        }

        // Fetch the newly created profile
        return await fetchUserProfile(user.id)
      } catch (err) {
        authLogger.error("Unexpected error creating user profile", { error: err, userId: user.id })
        return null
      }
    },
    [fetchUserProfile],
  )

  // Function to refresh the session
  const refreshSession = useCallback(async () => {
    try {
      authLogger.info("Manually refreshing session")
      const { data, error } = await supabase.auth.refreshSession()

      if (error) {
        authLogger.error("Manual session refresh failed", { error })
        return false
      }

      if (data.session) {
        setUser(data.session.user)
        authLogger.info("Session refreshed successfully")
        return true
      }

      return false
    } catch (err) {
      authLogger.error("Unexpected error during manual session refresh", { error: err })
      return false
    }
  }, [])

  useEffect(() => {
    let mounted = true

    // Get current session
    const getSession = async () => {
      try {
        authLogger.info("Getting initial session")
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          authLogger.error("Error getting session", { error })
          setLoading(false)
          return
        }

        if (!mounted) return

        if (session) {
          authLogger.info("Session found", { userId: session.user.id })
          setUser(session.user)

          // Check token expiration and refresh if needed
          const expiresAt = session.expires_at * 1000 // convert to ms
          const timeToExpiry = expiresAt - Date.now()

          if (timeToExpiry < 600000) {
            // Less than 10 minutes
            authLogger.info("Session expiring soon, refreshing", { timeToExpiry })
            await refreshSession()
          }

          // Fetch user profile
          const profile = await fetchUserProfile(session.user.id)

          if (!mounted) return

          if (profile) {
            setProfile(profile)
          } else {
            // Try to create profile if it doesn't exist
            const newProfile = await createUserProfile(session.user)
            if (mounted && newProfile) {
              setProfile(newProfile)
            }
          }
        } else {
          authLogger.info("No session found")
          setUser(null)
          setProfile(null)
        }
      } catch (error) {
        authLogger.error("Unexpected error getting session", { error })
      } finally {
        if (mounted) setLoading(false)
      }
    }

    getSession()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      authLogger.info("Auth state changed", { event })

      if (session) {
        setUser(session.user)

        // Fetch or create user profile
        const profile = await fetchUserProfile(session.user.id)

        if (!mounted) return

        if (profile) {
          setProfile(profile)
        } else if (event === "SIGNED_IN") {
          // Only create profile on sign in, not on token refresh
          const newProfile = await createUserProfile(session.user)
          if (mounted && newProfile) {
            setProfile(newProfile)
          }
        }
      } else {
        setUser(null)
        setProfile(null)
      }

      setLoading(false)
      router.refresh()
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [router, fetchUserProfile, createUserProfile, refreshSession])

  const signIn = async (email: string, password: string) => {
    try {
      console.log("로그인 시도:", email)
      authLogger.info("Attempting sign in", { email })
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        // More specific error handling
        if (error.message.includes("Email not confirmed")) {
          authLogger.warn("Login attempt with unconfirmed email", { email })
          return { error: null, needsEmailVerification: true, success: false }
        } else if (error.message.includes("Invalid login credentials")) {
          authLogger.warn("Invalid login credentials", { email })
          return { error: { message: "이메일 또는 비밀번호가 올바르지 않습니다." }, success: false }
        } else if (error.message.includes("rate limit")) {
          authLogger.warn("Login rate limit exceeded", { email })
          return { error: { message: "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요." }, success: false }
        }

        authLogger.error("Authentication error", { error, email })
        return { error, success: false }
      }

      // Verify session was established
      const session = await supabase.auth.getSession()
      if (!session.data.session) {
        console.error("로그인은 성공했지만 세션이 설정되지 않음")
        authLogger.error("Session not established after login", { email })
        return { error: { message: "로그인 세션을 생성하는데 실패했습니다. 다시 시도해주세요." }, success: false }
      }

      console.log("로그인 성공:", email)
      authLogger.info("Sign in successful", { email, userId: data.user?.id })
      return { error: null, success: true }
    } catch (err) {
      console.error("예상치 못한 로그인 오류:", err)
      authLogger.error("Unexpected login error", { error: err, email })
      return { error: { message: "로그인 중 오류가 발생했습니다. 다시 시도해주세요." }, success: false }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      authLogger.info("Attempting sign up", { email })
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      })

      if (error) {
        authLogger.error("Sign up error", { error, email })
      } else {
        authLogger.info("Sign up successful, verification email sent", { email })
      }

      return { error }
    } catch (err) {
      authLogger.error("Unexpected sign up error", { error: err, email })
      return { error: { message: "회원가입 중 오류가 발생했습니다. 다시 시도해주세요." } }
    }
  }

  const signOut = async () => {
    try {
      authLogger.info("Signing out user", { userId: user?.id })
      await supabase.auth.signOut()
      router.push("/")
    } catch (err) {
      authLogger.error("Error during sign out", { error: err, userId: user?.id })
    }
  }

  const resetPassword = async (email: string) => {
    try {
      authLogger.info("Requesting password reset", { email })
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        authLogger.error("Password reset error", { error, email })
      } else {
        authLogger.info("Password reset email sent", { email })
      }

      return { error }
    } catch (err) {
      authLogger.error("Unexpected password reset error", { error: err, email })
      return { error: { message: "비밀번호 재설정 중 오류가 발생했습니다. 다시 시도해주세요." } }
    }
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
