"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ArrowRight,
  BarChart2,
  Download,
  LineChart,
  PieChart,
  TrendingUp,
  Lightbulb,
  Brain,
  RefreshCw,
  AlertCircle,
  Share2,
} from "lucide-react"
import { analyzeUserProgress } from "@/app/actions/ai-actions"
import { generateMonthlyReport, checkAndGenerateMonthlyReport } from "@/app/actions/user-actions"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

// 월 이름 포맷팅 함수
const formatMonthName = (month: string, year: number) => {
  return `${year}년 ${month}월`
}

export default function Reports() {
  const [availableMonths, setAvailableMonths] = useState<{ month: string; year: number }[]>([])
  const [activeMonth, setActiveMonth] = useState<string | null>(null)
  const [activeYear, setActiveYear] = useState<number | null>(null)
  const [report, setReport] = useState<any>(null)
  const [aiAnalysis, setAiAnalysis] = useState("")
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false)
  const [isLoadingReport, setIsLoadingReport] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { user } = useAuth()

  // 자동 보고서 생성 확인 및 사용 가능한 월 목록 가져오기
  useEffect(() => {
    const fetchAvailableMonths = async () => {
      if (!user) return

      try {
        // 자동 보고서 생성 확인
        const result = await checkAndGenerateMonthlyReport(user.id)
        if (!result.success) {
          console.error("Error checking/generating monthly report:", result.error)
        }

        const { data, error } = await supabase
          .from("monthly_reports")
          .select("month, year")
          .eq("user_id", user.id)
          .order("year", { ascending: false })
          .order("month", { ascending: false })

        if (error) throw error

        if (data && data.length > 0) {
          setAvailableMonths(data)
          // 가장 최근 월을 기본값으로 설정
          setActiveMonth(data[0].month)
          setActiveYear(data[0].year)
        } else {
          // 보고서가 없는 경우 현재 월을 기본값으로 설정
          const now = new Date()
          const currentMonth = String(now.getMonth() + 1).padStart(2, "0")
          const currentYear = now.getFullYear()

          setAvailableMonths([])
          setActiveMonth(currentMonth)
          setActiveYear(currentYear)
        }
      } catch (error) {
        console.error("Error fetching available months:", error)
        setError("월 목록을 불러오는 중 오류가 발생했습니다.")
      } finally {
        setIsLoadingReport(false)
      }
    }

    fetchAvailableMonths()
  }, [user])

  // 선택한 월의 보고서 데이터 가져오기
  useEffect(() => {
    const fetchReportData = async () => {
      if (!user || !activeMonth || !activeYear) return

      setIsLoadingReport(true)
      setError(null)

      try {
        const { data, error } = await supabase
          .from("monthly_reports")
          .select("*")
          .eq("user_id", user.id)
          .eq("month", activeMonth)
          .eq("year", activeYear)
          .single()

        if (error) {
          // 보고서가 없는 경우
          if (error.code === "PGRST116") {
            setReport(null)
          } else {
            throw error
          }
        } else {
          // 보고서 데이터 형식 변환
          const formattedReport = {
            month: formatMonthName(data.month, data.year),
            summary: {
              score: data.score,
              previousScore: data.previous_score || 0,
              improvement: data.previous_score ? data.score - data.previous_score : 0,
              completedTasks: data.completed_tasks,
              completedQuests: data.completed_quests,
              status: data.status,
            },
            // 스킬 데이터 가져오기
            skills: [],
            achievements: Array.isArray(data.achievements) ? data.achievements : [],
            recommendations: [],
          }

          // 스킬 데이터 가져오기
          const { data: skillsData, error: skillsError } = await supabase
            .from("skills")
            .select("*")
            .eq("user_id", user.id)

          if (!skillsError && skillsData) {
            formattedReport.skills = skillsData.map((skill) => ({
              name: skill.name,
              score: skill.score,
              previousScore: skill.previous_score || skill.score - 5, // 이전 점수가 없으면 임의로 현재 점수보다 낮게 설정
            }))
          }

          // 추천 사항 (임시 데이터)
          formattedReport.recommendations = [
            {
              title: "AI 협업 시스템 구축",
              description: "팀 내에서 AI 협업 시스템을 구축하는 방법 학습하기",
              link: "/roadmap",
            },
            {
              title: "AI 시대 커리어 스토리맵 퀘스트",
              description: "AI 시대에 맞는 커리어 방향 설정하기",
              link: "/quests",
            },
          ]

          setReport(formattedReport)

          // AI 분석이 이미 있으면 사용, 없으면 새로 생성
          if (data.ai_analysis) {
            setAiAnalysis(data.ai_analysis)
          } else {
            fetchAIAnalysis(
              formattedReport.summary.previousScore,
              formattedReport.summary.score,
              formattedReport.skills,
            )
          }
        }
      } catch (error) {
        console.error("Error fetching report data:", error)
        setError("보고서 데이터를 불러오는 중 오류가 발생했습니다.")
      } finally {
        setIsLoadingReport(false)
      }
    }

    fetchReportData()
  }, [user, activeMonth, activeYear])

  // AI 분석 가져오기
  const fetchAIAnalysis = async (previousScore: number, currentScore: number, skills: any[]) => {
    setIsLoadingAnalysis(true)

    try {
      const strengths = skills.filter((skill) => skill.score >= 70).map((skill) => skill.name)
      const weaknesses = skills.filter((skill) => skill.score < 70).map((skill) => skill.name)

      const response = await analyzeUserProgress(previousScore, currentScore, strengths, weaknesses)

      if (response.success) {
        setAiAnalysis(response.content)

        // AI 분석 결과 저장
        if (user && activeMonth && activeYear) {
          await supabase
            .from("monthly_reports")
            .update({ ai_analysis: response.content })
            .eq("user_id", user.id)
            .eq("month", activeMonth)
            .eq("year", activeYear)
        }
      } else {
        setAiAnalysis("분석을 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.")
      }
    } catch (error) {
      console.error("Error fetching AI analysis:", error)
      setAiAnalysis("분석을 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.")
    } finally {
      setIsLoadingAnalysis(false)
    }
  }

  // 보고서 생성 함수
  const handleGenerateReport = async () => {
    if (!user || !activeMonth || !activeYear) return

    setIsGeneratingReport(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const { success, error } = await generateMonthlyReport(user.id, activeMonth, activeYear)

      if (success) {
        setSuccessMessage("보고서가 성공적으로 생성되었습니다.")
        // 보고서 생성 후 데이터 다시 불러오기
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        throw new Error(error || "보고서 생성 중 오류가 발생했습니다.")
      }
    } catch (error) {
      console.error("Error generating report:", error)
      setError("보고서 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.")
    } finally {
      setIsGeneratingReport(false)
    }
  }

  // PDF 저장 기능 (실제로는 구현되지 않음)
  const handleSavePDF = () => {
    setSuccessMessage("PDF 저장 기능은 아직 구현 중입니다.")
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  // 보고서 공유 기능 (실제로는 구현되지 않음)
  const handleShareReport = () => {
    setSuccessMessage("보고서 공유 기능은 아직 구현 중입니다.")
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-teal-600"
    if (score >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  const getImprovementBadge = (improvement) => {
    if (improvement > 0) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <TrendingUp className="h-3 w-3 mr-1" />+{improvement}%
        </Badge>
      )
    } else if (improvement < 0) {
      return (
        <Badge className="bg-red-100 text-red-800">
          <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
          {improvement}%
        </Badge>
      )
    } else {
      return <Badge className="bg-gray-100 text-gray-800">변화 없음</Badge>
    }
  }

  // 로딩 상태 표시
  if (isLoadingReport && !report) {
    return (
      <div className="container max-w-4xl py-12">
        <Link href="/" className="flex items-center text-sm text-muted-foreground mb-8 hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          홈으로 돌아가기
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter">월간 보고서</h1>
          <p className="text-muted-foreground mt-2">AI 시대 적응 현황과 성장 과정을 월간 보고서로 확인해보세요.</p>
        </div>

        <div className="flex flex-col items-center justify-center py-12">
          <RefreshCw className="h-12 w-12 text-teal-600 animate-spin mb-4" />
          <p className="text-muted-foreground">보고서 데이터를 불러오는 중입니다...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-12">
      <Link href="/" className="flex items-center text-sm text-muted-foreground mb-8 hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        홈으로 돌아가기
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tighter">월간 보고서</h1>
        <p className="text-muted-foreground mt-2">AI 시대 적응 현황과 성장 과정을 월간 보고서로 확인해보세요.</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert variant="default" className="mb-6 bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {report ? report.month : activeYear && activeMonth ? formatMonthName(activeMonth, activeYear) : ""} 보고서
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleSavePDF}>
            <Download className="h-4 w-4" />
            PDF 저장
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleShareReport}>
            <Share2 className="h-4 w-4" />
            공유하기
          </Button>
        </div>
      </div>

      {availableMonths.length > 0 ? (
        <Tabs
          defaultValue={`${activeYear}-${activeMonth}`}
          value={activeYear && activeMonth ? `${activeYear}-${activeMonth}` : undefined}
          onValueChange={(value) => {
            const [year, month] = value.split("-")
            setActiveYear(Number.parseInt(year))
            setActiveMonth(month)
          }}
          className="mb-8"
        >
          <TabsList className="grid grid-cols-3 mb-4">
            {availableMonths.slice(0, 3).map((item) => (
              <TabsTrigger key={`${item.year}-${item.month}`} value={`${item.year}-${item.month}`}>
                {formatMonthName(item.month, item.year)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      ) : (
        <div className="mb-8 text-center">
          <p className="text-muted-foreground mb-4">아직 생성된 보고서가 없습니다.</p>
          <Button onClick={handleGenerateReport} disabled={isGeneratingReport}>
            {isGeneratingReport ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> 보고서 생성 중...
              </>
            ) : (
              <>{activeYear && activeMonth ? formatMonthName(activeMonth, activeYear) : "현재 월"} 보고서 생성하기</>
            )}
          </Button>
        </div>
      )}

      {report ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-teal-600" />
                  종합 점수
                </CardTitle>
                <CardDescription>AI 시대 적응 종합 점수입니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`text-5xl font-bold ${getScoreColor(report.summary.score)}`}>
                    {report.summary.score}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">100점 만점</div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="text-sm text-muted-foreground">지난 달: {report.summary.previousScore}점</div>
                    {getImprovementBadge(report.summary.improvement)}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>초보자</span>
                    <span>선도자</span>
                  </div>
                  <Progress value={report.summary.score} className="h-2" />
                </div>
                <div className="bg-teal-50 text-teal-800 p-3 rounded-lg text-center">
                  현재 상태: <span className="font-medium">{report.summary.status}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-teal-600" />
                  활동 요약
                </CardTitle>
                <CardDescription>이번 달 AI 적응 활동 요약입니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-teal-600">{report.summary.completedTasks}</div>
                    <div className="text-sm text-muted-foreground mt-1">완료한 태스크</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-teal-600">{report.summary.completedQuests}</div>
                    <div className="text-sm text-muted-foreground mt-1">완료한 퀘스트</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">주요 성과</h4>
                  {report.achievements.length > 0 ? (
                    <ul className="space-y-1">
                      {report.achievements.map((achievement, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-teal-500 text-lg">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">아직 기록된 성과가 없습니다.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-teal-600" />
                역량 분석
              </CardTitle>
              <CardDescription>AI 시대 핵심 역량 분석입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {report.skills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{skill.name}</div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-muted-foreground">
                          {skill.previousScore} → {skill.score}
                        </div>
                        {getImprovementBadge(skill.score - skill.previousScore)}
                      </div>
                    </div>
                    <Progress value={skill.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-teal-600" />
                AI 분석 인사이트
              </CardTitle>
              <CardDescription>AI가 분석한 성장 인사이트입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAnalysis ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <RefreshCw className="h-8 w-8 text-teal-600 animate-spin mb-4" />
                  <p className="text-muted-foreground">AI 분석을 생성하고 있습니다...</p>
                </div>
              ) : (
                <div className="bg-teal-50 p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{aiAnalysis}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-teal-600" />
                다음 단계 추천
              </CardTitle>
              <CardDescription>AI 시대 적응을 위한 다음 단계 추천입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report.recommendations.map((recommendation, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-medium">{recommendation.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{recommendation.description}</p>
                    <div className="mt-3">
                      <Link href={recommendation.link}>
                        <Button variant="outline" size="sm" className="w-full">
                          시작하기
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/reality-check" className="w-full">
                <Button className="w-full">
                  Reality Check 다시 하기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </>
      ) : (
        !isLoadingReport && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-muted-foreground mb-6">
              {activeYear && activeMonth ? formatMonthName(activeMonth, activeYear) : "선택한 월"}에 대한 보고서가
              없습니다.
            </p>
            <Button onClick={handleGenerateReport} disabled={isGeneratingReport}>
              {isGeneratingReport ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> 보고서 생성 중...
                </>
              ) : (
                <>보고서 생성하기</>
              )}
            </Button>
          </div>
        )
      )}
    </div>
  )
}
