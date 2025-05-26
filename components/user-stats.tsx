"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle2, Trophy } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"

export function UserStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    score: 0,
    status: "AI 초보자",
    completedTasks: 0,
    completedQuests: 0,
    joinDate: "",
    lastActive: "",
    skills: [] as { name: string; score: number }[],
    achievements: [] as string[],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return

      try {
        setLoading(true)

        // 가입일 및 마지막 활동일 가져오기
        const { data: userData } = await supabase
          .from("users")
          .select("created_at, last_login")
          .eq("id", user.id)
          .single()

        // 최신 Reality Check 결과 가져오기
        const { data: realityCheckData } = await supabase
          .from("reality_check_results")
          .select("score, status")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        // 완료한 태스크 및 퀘스트 수 가져오기
        const { count: tasksCount } = await supabase
          .from("completed_tasks")
          .select("*", { count: "exact" })
          .eq("user_id", user.id)

        const { count: questsCount } = await supabase
          .from("completed_quests")
          .select("*", { count: "exact" })
          .eq("user_id", user.id)

        // 스킬 데이터 가져오기
        const { data: skillsData } = await supabase.from("skills").select("name, score").eq("user_id", user.id)

        // 최근 월간 보고서에서 성과 가져오기
        const { data: reportData } = await supabase
          .from("monthly_reports")
          .select("achievements")
          .eq("user_id", user.id)
          .order("year", { ascending: false })
          .order("month", { ascending: false })
          .limit(1)
          .single()

        setStats({
          score: realityCheckData?.score || 0,
          status: realityCheckData?.status || "AI 초보자",
          completedTasks: tasksCount || 0,
          completedQuests: questsCount || 0,
          joinDate: userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : "",
          lastActive: userData?.last_login ? new Date(userData.last_login).toLocaleDateString() : "",
          skills: skillsData || [],
          achievements: reportData?.achievements || [],
        })
      } catch (error) {
        console.error("Error fetching user stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserStats()
  }, [user])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>사용자 통계</CardTitle>
          <CardDescription>AI 시대 적응 현황과 활동 통계입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>사용자 통계</CardTitle>
        <CardDescription>AI 시대 적응 현황과 활동 통계입니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">AI 적응 점수</div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-teal-600">{stats.score}</div>
              <Badge variant="outline" className="bg-teal-50 text-teal-800">
                {stats.status}
              </Badge>
            </div>
            <Progress value={stats.score} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">완료한 활동</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-2 rounded-lg text-center">
                <div className="text-xl font-bold text-teal-600">{stats.completedTasks}</div>
                <div className="text-xs text-muted-foreground">태스크</div>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg text-center">
                <div className="text-xl font-bold text-teal-600">{stats.completedQuests}</div>
                <div className="text-xs text-muted-foreground">퀘스트</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">계정 정보</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">가입일: {stats.joinDate}</div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">마지막 활동: {stats.lastActive}</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">핵심 역량</div>
          <div className="space-y-3">
            {stats.skills.length > 0 ? (
              stats.skills.map((skill, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{skill.name}</span>
                    <span>{skill.score}/100</span>
                  </div>
                  <Progress value={skill.score} className="h-1.5" />
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">아직 기록된 역량이 없습니다.</div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">최근 성과</div>
          {stats.achievements.length > 0 ? (
            <div className="space-y-1">
              {stats.achievements.slice(0, 3).map((achievement, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Trophy className="h-4 w-4 text-teal-600 mt-0.5" />
                  <span className="text-sm">{achievement}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">아직 기록된 성과가 없습니다.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
