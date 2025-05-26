"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Compass, CheckCircle, ArrowRight } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function AuthSuccessPage() {
  const [countdown, setCountdown] = useState(5)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // 이미 로그인한 사용자는 대시보드로 리디렉션
    if (user) {
      router.push("/dashboard")
      return
    }

    // 카운트다운 시작
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/login")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [user, router])

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
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle>회원가입 완료!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>MyAI Compass 회원가입이 성공적으로 완료되었습니다. 이메일 인증을 위해 발송된 링크를 확인해주세요.</p>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                이메일 인증을 완료하면 모든 기능을 사용할 수 있습니다. 인증 이메일이 보이지 않는 경우 스팸 폴더를
                확인해주세요.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">{countdown}초 후 로그인 페이지로 이동합니다...</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/login">
              <Button>
                로그인 페이지로 이동
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
