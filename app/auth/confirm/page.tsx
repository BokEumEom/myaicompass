"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Compass, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { resendVerificationEmail } from "@/app/actions/auth-actions"

export default function ConfirmEmailPage() {
  const [verifying, setVerifying] = useState(true)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // 이메일 확인 토큰이 URL에 있는지 확인
        const token = searchParams.get("token")
        const type = searchParams.get("type")

        if (!token || type !== "signup") {
          setVerifying(false)
          setError("유효하지 않은 확인 링크입니다. 이메일을 다시 확인해주세요.")
          return
        }

        // Supabase로 이메일 확인
        const { error, data } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "signup",
        })

        if (error) {
          setVerifying(false)
          setError(error.message || "이메일 확인 중 오류가 발생했습니다. 다시 시도해주세요.")
          return
        }

        // 사용자 이메일 저장 (재전송 기능을 위해)
        if (data.user) {
          setEmail(data.user.email)
        }

        // 확인 성공
        setVerifying(false)
        setVerified(true)

        // 3초 후 대시보드로 리디렉션
        setTimeout(() => {
          router.push("/dashboard")
        }, 3000)
      } catch (err) {
        console.error("Email verification error:", err)
        setVerifying(false)
        setError("이메일 확인 중 오류가 발생했습니다. 다시 시도해주세요.")
      }
    }

    confirmEmail()
  }, [searchParams, router])

  const handleResendEmail = async () => {
    if (!email) return

    setResending(true)
    setResendSuccess(false)

    try {
      const { success, error } = await resendVerificationEmail(email)

      if (success) {
        setResendSuccess(true)
      } else {
        setError(error || "이메일 재전송 중 오류가 발생했습니다. 다시 시도해주세요.")
      }
    } catch (err) {
      console.error("Resend verification email error:", err)
      setError("이메일 재전송 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setResending(false)
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
            <CardTitle className="text-center">이메일 인증</CardTitle>
            <CardDescription className="text-center">
              {verifying
                ? "이메일 인증을 확인하고 있습니다..."
                : verified
                  ? "이메일 인증이 완료되었습니다!"
                  : "이메일 인증에 문제가 발생했습니다."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {verifying ? (
              <div className="flex flex-col items-center justify-center py-6">
                <Loader2 className="h-12 w-12 text-teal-600 animate-spin mb-4" />
                <p className="text-center text-muted-foreground">
                  이메일 인증을 확인하고 있습니다. 잠시만 기다려주세요...
                </p>
              </div>
            ) : verified ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="bg-green-100 p-3 rounded-full mb-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <p className="text-center mb-4">
                  이메일 인증이 성공적으로 완료되었습니다. 잠시 후 대시보드로 이동합니다.
                </p>
                <p className="text-sm text-muted-foreground text-center">
                  자동으로 이동하지 않는 경우 아래 버튼을 클릭하세요.
                </p>
              </div>
            ) : (
              <>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>

                {email && (
                  <div className="pt-2">
                    {resendSuccess ? (
                      <Alert className="bg-green-50 text-green-800 border-green-200">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>인증 이메일이 재전송되었습니다. 이메일을 확인해주세요.</AlertDescription>
                      </Alert>
                    ) : (
                      <Button variant="outline" className="w-full" onClick={handleResendEmail} disabled={resending}>
                        {resending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 이메일 재전송 중...
                          </>
                        ) : (
                          "인증 이메일 재전송"
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {verified ? (
              <Link href="/dashboard">
                <Button>대시보드로 이동</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="outline">로그인 페이지로 이동</Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
