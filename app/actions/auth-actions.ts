"use server"

import { createServerClient } from "@/lib/supabase-server"

export async function resendVerificationEmail(email: string) {
  const supabase = createServerClient()

  try {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    })

    if (error) {
      console.error("Error resending verification email:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in resendVerificationEmail:", error)
    return { success: false, error: "이메일 재전송 중 오류가 발생했습니다." }
  }
}

export async function checkEmailVerification(userId: string) {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase.auth.admin.getUserById(userId)

    if (error) {
      console.error("Error checking email verification:", error)
      return { success: false, error: error.message }
    }

    if (!data.user) {
      return { success: false, error: "사용자를 찾을 수 없습니다." }
    }

    return {
      success: true,
      verified: data.user.email_confirmed_at !== null,
      email: data.user.email,
    }
  } catch (error) {
    console.error("Error in checkEmailVerification:", error)
    return { success: false, error: "이메일 인증 상태 확인 중 오류가 발생했습니다." }
  }
}
