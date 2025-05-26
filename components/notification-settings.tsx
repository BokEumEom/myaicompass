"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"

export function NotificationSettings() {
  const { user } = useAuth()
  const [emailNotifications, setEmailNotifications] = useState({
    monthlyReport: true,
    newFeatures: true,
    questReminders: true,
    achievementAlerts: true,
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase.from("user_notifications").select("*").eq("user_id", user.id).single()

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching notification settings:", error)
          return
        }

        if (data) {
          setEmailNotifications({
            monthlyReport: data.monthly_report_email !== false,
            newFeatures: data.new_features_email !== false,
            questReminders: data.quest_reminders_email !== false,
            achievementAlerts: data.achievement_alerts_email !== false,
          })
        }
      } catch (error) {
        console.error("Error in fetchNotificationSettings:", error)
      }
    }

    fetchNotificationSettings()
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      const { error } = await supabase.from("user_notifications").upsert({
        user_id: user?.id,
        monthly_report_email: emailNotifications.monthlyReport,
        new_features_email: emailNotifications.newFeatures,
        quest_reminders_email: emailNotifications.questReminders,
        achievement_alerts_email: emailNotifications.achievementAlerts,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      setSuccess(true)
    } catch (err) {
      console.error("Notification settings update error:", err)
      setError("알림 설정 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>알림 설정</CardTitle>
        <CardDescription>이메일 알림 설정을 관리하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>알림 설정이 성공적으로 업데이트되었습니다.</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="monthlyReport" className="block mb-1">
                  월간 보고서 알림
                </Label>
                <p className="text-xs text-muted-foreground">새로운 월간 보고서가 생성되면 알림을 받습니다.</p>
              </div>
              <Switch
                id="monthlyReport"
                checked={emailNotifications.monthlyReport}
                onCheckedChange={(checked) => setEmailNotifications((prev) => ({ ...prev, monthlyReport: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="newFeatures" className="block mb-1">
                  새로운 기능 알림
                </Label>
                <p className="text-xs text-muted-foreground">새로운 기능이나 업데이트가 있을 때 알림을 받습니다.</p>
              </div>
              <Switch
                id="newFeatures"
                checked={emailNotifications.newFeatures}
                onCheckedChange={(checked) => setEmailNotifications((prev) => ({ ...prev, newFeatures: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="questReminders" className="block mb-1">
                  퀘스트 리마인더
                </Label>
                <p className="text-xs text-muted-foreground">진행 중인 퀘스트에 대한 리마인더를 받습니다.</p>
              </div>
              <Switch
                id="questReminders"
                checked={emailNotifications.questReminders}
                onCheckedChange={(checked) => setEmailNotifications((prev) => ({ ...prev, questReminders: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="achievementAlerts" className="block mb-1">
                  성과 알림
                </Label>
                <p className="text-xs text-muted-foreground">새로운 성과를 달성했을 때 알림을 받습니다.</p>
              </div>
              <Switch
                id="achievementAlerts"
                checked={emailNotifications.achievementAlerts}
                onCheckedChange={(checked) =>
                  setEmailNotifications((prev) => ({ ...prev, achievementAlerts: checked }))
                }
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? "저장 중..." : "설정 저장"}
        </Button>
      </CardFooter>
    </Card>
  )
}
