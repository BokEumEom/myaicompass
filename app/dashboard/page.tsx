"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AIChat } from "@/components/ai-chat"
import { AIInsights } from "@/components/ai-insights"
import { AIRecommendations } from "@/components/ai-recommendations"
import { ArrowLeft, BarChart2, Brain, Calendar, CheckCircle2, Lightbulb, Map, Target, Trophy } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Header } from "@/components/header"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [userData, setUserData] = useState({
    name: "",
    score: 0,
    status: "AI 초보자",
    completedTasks: 0,
    completedQuests: 0,
    skills: [
      { name: "AI 도구 활용", score: 0 },
      { name: "창의적 문제 해결", score: 0 },
      { name: "디지털 역량", score: 0 },
      { name: "AI 협업", score: 0 },
    ],
    completedQuestTitles: [],
    upcomingQuests: [
      { title: "AI 아트 포트폴리오", dueDate: "2023-08-15" },
      { title: "AI 시대 커리어 스토리맵", dueDate: "2023-08-22" },
    ],
  })
  const [loading, setLoading] = useState(true)
  const { user, profile } = useAuth()

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return

      try {
        // Fetch latest reality check result
        const { data: realityCheckData } = await supabase
          .from("reality_check_results")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        // Fetch skills
        const { data: skillsData } = await supabase.from("skills").select("*").eq("user_id", user.id)

        // Fetch completed tasks
        const { data: tasksData, count: tasksCount } = await supabase
          .from("completed_tasks")
          .select("*", { count: "exact" })
          .eq("user_id", user.id)

        // Fetch completed quests
        const { data: questsData, count: questsCount } = await supabase
          .from("completed_quests")
          .select("*, quests(title)", { count: "exact" })
          .eq("user_id", user.id)

        // Update user data
        setUserData({
          name: profile?.display_name || user.email,
          score: realityCheckData?.score || 0,
          status: realityCheckData?.status || "AI 초보자",
          completedTasks: tasksCount || 0,
          completedQuests: questsCount || 0,
          skills: skillsData?.length
            ? skillsData.map((skill) => ({
                name: skill.name,
                score: skill.score,
              }))
            : [
                { name: "AI 도구 활용", score: 0 },
                { name: "창의적 문제 해결", score: 0 },
                { name: "디지털 역량", score: 0 },
                { name: "AI 협업", score: 0 },
              ],
          completedQuestTitles: questsData?.length ? questsData.map((quest) => quest.quests.title) : [],
          upcomingQuests: [
            { title: "AI 아트 포트폴리오", dueDate: "2023-08-15" },
            { title: "AI 시대 커리어 스토리맵", dueDate: "2023-08-22" },
          ],
        })
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchUserData()
    } else {
      setLoading(false)
    }
  }, [user, profile])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">대시보드</h1>
            <p className="text-muted-foreground mt-1">AI 시대 적응 현황과 맞춤형 추천을 확인하세요.</p>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              홈으로
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="ai-assistant">AI 어시스턴트</TabsTrigger>
            <TabsTrigger value="recommendations">맞춤 추천</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-teal-600" />
                    AI 적응 점수
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-5xl font-bold text-teal-600">{userData.score}</div>
                    <div className="text-sm text-muted-foreground mt-1">100점 만점</div>
                    <div className="mt-2 text-sm font-medium">{userData.status}</div>
                  </div>
                  <Progress value={userData.score} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-teal-600" />
                    완료한 활동
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-teal-600">{userData.completedTasks}</div>
                      <div className="text-sm text-muted-foreground mt-1">태스크</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-teal-600">{userData.completedQuests}</div>
                      <div className="text-sm text-muted-foreground mt-1">퀘스트</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-teal-600" />
                    예정된 퀘스트
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 py-2">
                    {userData.upcomingQuests.map((quest, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="text-sm font-medium">{quest.title}</div>
                        <div className="text-xs text-muted-foreground">{quest.dueDate}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-teal-600" />
                    핵심 역량
                  </CardTitle>
                  <CardDescription>AI 시대 적응을 위한 핵심 역량 현황입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userData.skills.map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{skill.name}</div>
                          <div className="text-sm">{skill.score}/100</div>
                        </div>
                        <Progress value={skill.score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <AIInsights />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-teal-600" />
                    최근 완료한 퀘스트
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userData.completedQuestTitles.length > 0 ? (
                    <div className="space-y-3">
                      {userData.completedQuestTitles.map((title, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                          <span className="text-sm">{title}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">아직 완료한 퀘스트가 없습니다.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-teal-600" />
                    다음 단계
                  </CardTitle>
                  <CardDescription>AI 시대 적응을 위한 다음 단계 추천입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Link href="/roadmap">
                      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2 font-medium mb-1">
                          <Map className="h-4 w-4 text-teal-600" />
                          로드맵 계속하기
                        </div>
                        <p className="text-sm text-muted-foreground">개인 맞춤형 로드맵에서 다음 단계를 확인하세요.</p>
                      </div>
                    </Link>
                    <Link href="/quests">
                      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2 font-medium mb-1">
                          <Brain className="h-4 w-4 text-teal-600" />새 퀘스트 시작하기
                        </div>
                        <p className="text-sm text-muted-foreground">창의적 성장을 위한 새로운 퀘스트에 도전하세요.</p>
                      </div>
                    </Link>
                    <Link href="/reality-check">
                      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2 font-medium mb-1">
                          <BarChart2 className="h-4 w-4 text-teal-600" />
                          Reality Check 다시 하기
                        </div>
                        <p className="text-sm text-muted-foreground">현재 AI 시대 적응 상태를 다시 진단해보세요.</p>
                      </div>
                    </Link>
                    <Link href="/reports">
                      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2 font-medium mb-1">
                          <Lightbulb className="h-4 w-4 text-teal-600" />
                          월간 보고서 확인하기
                        </div>
                        <p className="text-sm text-muted-foreground">월간 성장 현황과 인사이트를 확인하세요.</p>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-assistant">
            <AIChat />
          </TabsContent>

          <TabsContent value="recommendations">
            <div className="space-y-6">
              <AIRecommendations userSkills={userData.skills} completedQuests={userData.completedQuestTitles} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
