"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Compass, AlertCircle, Loader2, Info } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { resendVerificationEmail } from "@/app/actions/auth-actions"
import { authLogger } from "@/lib/auth-logger"
import { attemptSessionRecovery } from "@/lib/session-recovery"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [verificationNeeded, setVerificationNeeded] = useState(false)
  const [resendingEmail, setResendingEmail] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [rememberMe, setRememberMe] = useState(false)
  const { signIn, user, refreshSession } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get redirect destination and error messages from URL
  const redirectTo = searchParams.get("redirectTo") || "/dashboard"
  const urlError = searchParams.get("error")
  const needVerification = searchParams.get("needVerification") === "true"
  const verificationEmail = searchParams.get("email") || ""

  // Handle URL parameters and session recovery on mount
  useEffect(() => {
    const initPage = async () => {
      console.log("로그인 페이지 마운트, 사용자 상태:", user ? "로그인됨" : "로그인되지 않음")

      // Check if already logged in
      if (user) {
        console.log("이미 로그인됨, 리다이렉션:", redirectTo)
        router.push(redirectTo)
        return
      }

      // Handle URL error messages
      if (urlError === "session_error") {
        authLogger.info("Session error detected, attempting recovery")
        const recovered = await attemptSessionRecovery()

        if (recovered) {
          authLogger.info("Session recovered, refreshing page")
          window.location.href = redirectTo // Full page refresh to ensure clean state
          return
        }

        setError("로그인 세션에 문제가 발생했습니다. 다시 로그인해주세요.")
      }

      // Handle verification needed parameter
      if (needVerification && verificationEmail) {
        authLogger.info("Email verification needed", { email: verificationEmail })
        setVerificationNeeded(true)
        setEmail(verificationEmail)
      }

      setPageLoading(false)
    }

    initPage()
  }, [user, router, redirectTo, urlError, needVerification, verificationEmail, refreshSession])

  // Memoized submit handler to prevent recreation on renders
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      console.log("로그인 폼 제출됨:", email)
      setError(null)
      setLoading(true)
      setVerificationNeeded(false)
      setResendSuccess(false)

      try {
        authLogger.info("Login form submitted", { email })
        const { error, needsEmailVerification } = await signIn(email, password)

        if (error) {
          authLogger.warn("Login error from form", { error: error.message, email })
          setError(error.message)
          setLoading(false)
          return
        }

        if (needsEmailVerification) {
          authLogger.info("Email verification needed after login attempt", { email })
          setVerificationNeeded(true)
          setLoading(false)
          return
        }

        // 세션 확인
        const { data: sessionData } = await supabase.auth.getSession()

        if (sessionData.session) {
          console.log("세션 확인됨, 리다이렉션:", redirectTo)
          router.push(redirectTo)
        } else {
          console.error("로그인은 성공했지만 세션이 설정되지 않음")
          setError("로그인 세션을 설정하는 데 문제가 발생했습니다. 다시 시도해주세요.")
          setLoading(false)
        }
      } catch (err) {
        authLogger.error("Unexpected login form error", { error: err, email })
        setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.")
        setLoading(false)
      }
    },
    [email, password, signIn, router, redirectTo],
  )

  // Memoized resend verification handler
  const handleResendVerification = useCallback(async () => {
    if (!email) return

    setResendingEmail(true)
    setResendSuccess(false)
    setError(null)

    try {
      authLogger.info("Resending verification email", { email })
      const { success, error } = await resendVerificationEmail(email)

      if (success) {
        authLogger.info("Verification email resent successfully", { email })
        setResendSuccess(true)
      } else {
        authLogger.warn("Failed to resend verification email", { error, email })
        setError(error || "이메일 재전송 중 오류가 발생했습니다.")
      }
    } catch (err) {
      authLogger.error("Unexpected error resending verification email", { error: err, email })
      setError("이메일 재전송 중 오류가 발생했습니다.")
    } finally {
      setResendingEmail(false)
    }
  }, [email])

  // Show loading state while checking session
  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-teal-600 animate-spin mb-4" />
          <p className="text-sm text-muted-foreground">로그인 상태를 확인하는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Compass className="h-8 w-8 text-teal-600" />
            <span className="text-2xl font-bold">MyAI Compass</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>로그인</CardTitle>
            <CardDescription>MyAI Compass에 로그인하여 AI 시대 적응 여정을 계속하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            {verificationNeeded ? (
              <div className="space-y-4">
                <Alert className="bg-yellow-50 border-yellow-200">
                  <Info className="h-4 w-4 text-yellow-800" />
                  <AlertDescription className="text-yellow-800">
                    이메일 인증이 필요합니다. 이메일({email})을 확인하여 인증 링크를 클릭해주세요.
                  </AlertDescription>
                </Alert>

                {resendSuccess ? (
                  <Alert className="bg-green-50 border-green-200">
                    <Info className="h-4 w-4 text-green-800" />
                    <AlertDescription className="text-green-800">
                      인증 이메일이 재전송되었습니다. 이메일을 확인해주세요.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleResendVerification}
                    disabled={resendingEmail}
                  >
                    {resendingEmail ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 이메일 재전송 중...
                      </>
                    ) : (
                      "인증 이메일 재전송"
                    )}
                  </Button>
                )}

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setVerificationNeeded(false)}
                    className="text-sm text-teal-600 hover:underline"
                  >
                    다른 계정으로 로그인
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">비밀번호</Label>
                    <Link href="/forgot-password" className="text-xs text-teal-600 hover:underline">
                      비밀번호를 잊으셨나요?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="current-password"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember-me"
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <Label htmlFor="remember-me" className="text-sm text-gray-700">
                    로그인 상태 유지
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 로그인 중...
                    </>
                  ) : (
                    "로그인"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-muted-foreground">
              계정이 없으신가요?{" "}
              <Link href="/signup" className="text-teal-600 hover:underline">
                회원가입
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
