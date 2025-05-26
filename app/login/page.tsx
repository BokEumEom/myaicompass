"use client"

import type React from "react"

import { useState } from "react"
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

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [verificationNeeded, setVerificationNeeded] = useState(false)
  const [resendingEmail, setResendingEmail] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/dashboard"

  // 이메일 인증 필요 상태 확인
  const needVerification = searchParams.get("needVerification") === "true"
  const verificationEmail = searchParams.get("email") || ""

  if (needVerification && verificationEmail && !verificationNeeded) {
    setVerificationNeeded(true)
    setEmail(verificationEmail)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setVerificationNeeded(false)
    setResendSuccess(false)

    try {
      const { error, needsEmailVerification } = await signIn(email, password)

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      if (needsEmailVerification) {
        setVerificationNeeded(true)
        setLoading(false)
        return
      }

      router.push(redirectTo)
    } catch (err) {
      console.error("Login error:", err)
      setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.")
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!email) return

    setResendingEmail(true)
    setResendSuccess(false)

    try {
      const { success, error } = await resendVerificationEmail(email)

      if (success) {
        setResendSuccess(true)
      } else {
        setError(error || "이메일 재전송 중 오류가 발생했습니다.")
      }
    } catch (err) {
      console.error("Resend verification email error:", err)
      setError("이메일 재전송 중 오류가 발생했습니다.")
    } finally {
      setResendingEmail(false)
    }
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
                  />
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
