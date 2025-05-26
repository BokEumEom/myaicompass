"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { saveRealityCheckResults, getPreviousRealityCheckResults } from "@/app/actions/user-actions"
import { Header } from "@/components/header"
import { RealityCheckHistory } from "@/components/reality-check-history"
import {
  RealityCheckQuestions,
  QuestionModeSelector,
  questionCategories,
  baseQuestions,
  jobSpecificQuestions,
  industrySpecificQuestions,
} from "@/components/reality-check-questions"
import { RealityCheckAnalysis } from "@/components/reality-check-analysis"

export default function RealityCheck() {
  const [activeCategory, setActiveCategory] = useState("general")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [previousResults, setPreviousResults] = useState([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [questionMode, setQuestionMode] = useState("basic")
  const [jobType, setJobType] = useState("developer")
  const [industryType, setIndustryType] = useState("healthcare")
  const { user } = useAuth()
  const router = useRouter()

  // 이전 Reality Check 결과 불러오기
  useEffect(() => {
    if (user && showHistory) {
      fetchPreviousResults()
    }
  }, [user, showHistory])

  const fetchPreviousResults = async () => {
    if (!user) return

    setIsLoadingHistory(true)
    try {
      const results = await getPreviousRealityCheckResults(user.id)
      if (results.success) {
        setPreviousResults(results.data)
      }
    } catch (error) {
      console.error("Error fetching previous results:", error)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const handleAnswer = (value) => {
    // 현재 질문 세트 및 카테고리 결정
    let currentQuestions = baseQuestions
    let currentCategory = activeCategory

    // 직업별 특화 질문인 경우
    if (questionMode === "job" && jobType && jobSpecificQuestions[jobType]) {
      currentQuestions = {
        [jobType]: jobSpecificQuestions[jobType].questions,
      }
      currentCategory = jobType
    }
    // 산업별 특화 질문인 경우
    else if (questionMode === "industry" && industryType && industrySpecificQuestions[industryType]) {
      currentQuestions = {
        [industryType]: industrySpecificQuestions[industryType].questions,
      }
      currentCategory = industryType
    }

    const questionId = currentQuestions[currentCategory][currentQuestion].id
    setAnswers({ ...answers, [questionId]: Number.parseInt(value) })
  }

  const handleNext = () => {
    // 현재 질문 세트 및 카테고리 결정
    let currentQuestions = baseQuestions
    let currentCategory = activeCategory

    // 직업별 특화 질문인 경우
    if (questionMode === "job" && jobType && jobSpecificQuestions[jobType]) {
      currentQuestions = {
        [jobType]: jobSpecificQuestions[jobType].questions,
      }
      currentCategory = jobType

      // 직업별 특화 질문은 카테고리가 하나뿐이므로 마지막 질문이면 결과 표시
      if (currentQuestion >= currentQuestions[currentCategory].length - 1) {
        setShowResults(true)
        return
      }
    }
    // 산업별 특화 질문인 경우
    else if (questionMode === "industry" && industryType && industrySpecificQuestions[industryType]) {
      currentQuestions = {
        [industryType]: industrySpecificQuestions[industryType].questions,
      }
      currentCategory = industryType

      // 산업별 특화 질문은 카테고리가 하나뿐이므로 마지막 질문이면 결과 표시
      if (currentQuestion >= currentQuestions[currentCategory].length - 1) {
        setShowResults(true)
        return
      }
    }
    // 기본 질문인 경우
    else {
      const currentCategoryQuestions = currentQuestions[activeCategory]
      if (currentQuestion < currentCategoryQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        // 현재 카테고리의 마지막 질문인 경우
        const categories = Object.keys(questionCategories)
        const currentCategoryIndex = categories.indexOf(activeCategory)

        // 다음 카테고리가 있으면 이동
        if (currentCategoryIndex < categories.length - 1) {
          const nextCategory = categories[currentCategoryIndex + 1]
          setActiveCategory(nextCategory)
          setCurrentQuestion(0)
        } else {
          // 모든 카테고리의 질문이 끝났으면 결과 표시
          setShowResults(true)
        }
      }
      return
    }

    // 직업별/산업별 특화 질문에서 다음 질문으로 이동
    setCurrentQuestion(currentQuestion + 1)
  }

  const handlePrevious = () => {
    // 직업별 특화 질문인 경우
    if (questionMode === "job" && jobType && jobSpecificQuestions[jobType]) {
      if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1)
      }
      return
    }
    // 산업별 특화 질문인 경우
    else if (questionMode === "industry" && industryType && industrySpecificQuestions[industryType]) {
      if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1)
      }
      return
    }

    // 기본 질문인 경우
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    } else {
      // 현재 카테고리의 첫 질문인 경우
      const categories = Object.keys(questionCategories)
      const currentCategoryIndex = categories.indexOf(activeCategory)

      // 이전 카테고리가 있으면 이동
      if (currentCategoryIndex > 0) {
        const prevCategory = categories[currentCategoryIndex - 1]
        setActiveCategory(prevCategory)
        setCurrentQuestion(baseQuestions[prevCategory].length - 1)
      }
    }
  }

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
    setCurrentQuestion(0)
  }

  // 전체 질문 수 계산
  const getTotalQuestions = () => {
    // 직업별 특화 질문인 경우
    if (questionMode === "job" && jobType && jobSpecificQuestions[jobType]) {
      return jobSpecificQuestions[jobType].questions.length
    }
    // 산업별 특화 질문인 경우
    else if (questionMode === "industry" && industryType && industrySpecificQuestions[industryType]) {
      return industrySpecificQuestions[industryType].questions.length
    }
    // 기본 질문인 경우
    return Object.values(baseQuestions).reduce((total, categoryQuestions) => total + categoryQuestions.length, 0)
  }

  // 현재까지 답변한 질문 수 계산
  const getAnsweredQuestions = () => {
    return Object.keys(answers).length
  }

  // 현재 질문의 전체 인덱스 계산
  const getCurrentQuestionIndex = () => {
    // 직업별 특화 질문인 경우
    if (questionMode === "job" && jobType && jobSpecificQuestions[jobType]) {
      return currentQuestion + 1
    }
    // 산업별 특화 질문인 경우
    else if (questionMode === "industry" && industryType && industrySpecificQuestions[industryType]) {
      return currentQuestion + 1
    }
    // 기본 질문인 경우
    const categories = Object.keys(questionCategories)
    let index = 0

    for (let i = 0; i < categories.indexOf(activeCategory); i++) {
      index += baseQuestions[categories[i]].length
    }

    return index + currentQuestion + 1
  }

  const calculateResults = () => {
    // 모든 답변 값의 합계 계산
    const total = Object.values(answers).reduce((sum, value) => sum + value, 0)
    const maxPossible = Object.values(baseQuestions).reduce(
      (sum, categoryQuestions) => sum + categoryQuestions.length * 5,
      0,
    )
    const percentage = (total / maxPossible) * 100

    // 카테고리별 점수 계산
    const categoryScores = {}
    Object.keys(baseQuestions).forEach((category) => {
      const categoryQuestions = baseQuestions[category]
      let categoryTotal = 0
      let answeredCount = 0

      categoryQuestions.forEach((q) => {
        if (answers[q.id] !== undefined) {
          categoryTotal += answers[q.id]
          answeredCount++
        }
      })

      const categoryScore = answeredCount > 0 ? (categoryTotal / (answeredCount * 5)) * 100 : 0
      categoryScores[category] = Math.round(categoryScore)
    })

    // 상태 및 분석 결과 결정
    let status, riskFactors, opportunities

    if (percentage >= 80) {
      status = "AI 시대 선도자"
      riskFactors = [
        "과도한 AI 의존성으로 인한 비판적 사고 약화",
        "인간 고유의 가치와 직관 상실 위험",
        "AI 기술 변화에 따른 지속적 학습 부담",
        "윤리적 판단과 책임 문제에 대한 고민 필요",
      ]
      opportunities = [
        "AI 활용 전문가로서 조직 내 리더십 발휘",
        "AI와 인간 협업 시스템 구축 및 최적화",
        "AI 기반 혁신 프로젝트 주도",
        "AI 윤리와 거버넌스 분야 전문성 개발",
      ]
    } else if (percentage >= 60) {
      status = "AI 적응자"
      riskFactors = [
        "급변하는 AI 기술 변화 속도 따라가기 어려움",
        "특정 분야에 국한된 AI 활용 능력",
        "AI 결과물에 대한 과신 위험",
        "창의적 활용보다 기본적 활용에 머무름",
      ]
      opportunities = [
        "AI 활용 심화 학습을 통한 전문성 강화",
        "다양한 AI 도구 실험 및 통합 활용",
        "창의적 문제 해결 능력과 AI 결합",
        "특정 도메인에서 AI 활용 전문가로 성장",
      ]
    } else if (percentage >= 40) {
      status = "AI 탐색자"
      riskFactors = [
        "AI 기술 이해 부족으로 인한 활용 제한",
        "업무 자동화로 인한 역할 축소 위험",
        "AI 도구 선택과 활용에 대한 불확실성",
        "변화 적응에 대한 심리적 부담",
      ]
      opportunities = [
        "AI 기초 학습을 통한 이해도 향상",
        "일상 업무에 AI 도구 점진적 통합",
        "AI 활용 커뮤니티 참여 및 네트워킹",
        "특정 AI 도구 집중 학습 및 마스터",
      ]
    } else {
      status = "AI 초보자"
      riskFactors = [
        "AI에 의한 직무 대체 위험 증가",
        "디지털 역량 부족으로 인한 경쟁력 약화",
        "변화에 대한 두려움과 저항",
        "AI 시대 적응을 위한 출발점 부재",
      ]
      opportunities = [
        "기초 디지털 역량 강화 프로그램 참여",
        "AI 이해 및 기초 학습 시작",
        "AI 도구 체험 및 실험적 활용",
        "AI 시대 적응을 위한 마인드셋 개발",
      ]
    }

    // 강점과 약점 분석
    const strengths = []
    const weaknesses = []

    Object.keys(categoryScores).forEach((category) => {
      if (categoryScores[category] >= 70) {
        strengths.push({
          category: questionCategories[category],
          score: categoryScores[category],
        })
      } else if (categoryScores[category] <= 50) {
        weaknesses.push({
          category: questionCategories[category],
          score: categoryScores[category],
        })
      }
    })

    // 강점과 약점이 없는 경우 기본값 설정
    if (strengths.length === 0) {
      const highestCategory = Object.keys(categoryScores).reduce((a, b) =>
        categoryScores[a] > categoryScores[b] ? a : b,
      )
      strengths.push({
        category: questionCategories[highestCategory],
        score: categoryScores[highestCategory],
      })
    }

    if (weaknesses.length === 0) {
      const lowestCategory = Object.keys(categoryScores).reduce((a, b) =>
        categoryScores[a] < categoryScores[b] ? a : b,
      )
      weaknesses.push({
        category: questionCategories[lowestCategory],
        score: categoryScores[lowestCategory],
      })
    }

    return {
      score: Math.round(percentage),
      maxScore: 100,
      percentage,
      status,
      categoryScores,
      riskFactors,
      opportunities,
      strengths,
      weaknesses,
    }
  }

  const results = calculateResults()

  const handleSaveResults = async () => {
    if (!user) {
      router.push("/login?redirectTo=/reality-check")
      return
    }

    setSaving(true)
    try {
      const { success, error } = await saveRealityCheckResults(
        user.id,
        results.score,
        results.status,
        answers,
        results.riskFactors,
        results.opportunities,
        results.categoryScores,
        results.strengths.map((s) => s.category),
        results.weaknesses.map((w) => w.category),
      )

      if (success) {
        router.push("/roadmap")
      } else {
        console.error("Error saving results:", error)
        // Show error message
      }
    } catch (error) {
      console.error("Error saving results:", error)
      // Show error message
    } finally {
      setSaving(false)
    }
  }

  const toggleHistory = () => {
    setShowHistory(!showHistory)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container max-w-4xl py-12">
        <Link href="/" className="flex items-center text-sm text-muted-foreground mb-8 hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          홈으로 돌아가기
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter">Reality Check</h1>
          <p className="text-muted-foreground mt-2">AI 시대에 나의 현재 상태를 진단하고 준비 상태를 파악해보세요.</p>

          {user && !showResults && (
            <Button variant="outline" onClick={toggleHistory} className="mt-4">
              {showHistory ? "진단으로 돌아가기" : "이전 진단 결과 보기"}
            </Button>
          )}
        </div>

        {showHistory ? (
          <RealityCheckHistory results={previousResults} isLoading={isLoadingHistory} onBack={toggleHistory} />
        ) : !showResults ? (
          <>
            {/* 진단 모드 선택 */}
            <QuestionModeSelector
              questionMode={questionMode}
              setQuestionMode={setQuestionMode}
              jobType={jobType}
              setJobType={setJobType}
              industryType={industryType}
              setIndustryType={setIndustryType}
            />

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-muted-foreground">
                    질문 {getCurrentQuestionIndex()} / {getTotalQuestions()} ({getAnsweredQuestions()} 답변됨)
                  </div>
                  <Progress value={(getCurrentQuestionIndex() / getTotalQuestions()) * 100} className="h-2 w-[200px]" />
                </div>

                {questionMode === "basic" && (
                  <Tabs value={activeCategory} onValueChange={handleCategoryChange} className="mb-4">
                    <TabsList className="grid grid-cols-7">
                      {Object.entries(questionCategories).map(([key, value]) => (
                        <TabsTrigger key={key} value={key} className="text-xs">
                          {value}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                )}
                {questionMode === "job" && jobType && (
                  <div className="mb-4 text-center">
                    <h3 className="text-lg font-medium">{jobSpecificQuestions[jobType].title} 특화 진단</h3>
                    <p className="text-sm text-muted-foreground">
                      {jobType === "developer"
                        ? "개발자"
                        : jobType === "designer"
                          ? "디자이너"
                          : jobType === "marketer"
                            ? "마케터"
                            : "매니저/리더"}
                      를 위한 특화된 질문에 답변해주세요.
                    </p>
                  </div>
                )}
                {questionMode === "industry" && industryType && (
                  <div className="mb-4 text-center">
                    <h3 className="text-lg font-medium">
                      {industrySpecificQuestions[industryType].title} 산업 특화 진단
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {industryType === "healthcare" ? "헬스케어" : industryType === "finance" ? "금융" : "교육"} 산업에
                      특화된 질문에 답변해주세요.
                    </p>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <RealityCheckQuestions
                  activeCategory={activeCategory}
                  currentQuestion={currentQuestion}
                  answers={answers}
                  onAnswer={handleAnswer}
                  questionMode={questionMode}
                  jobType={jobType}
                  industryType={industryType}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0 && activeCategory === "general"}
                >
                  이전
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={
                    questionMode === "job" && jobType
                      ? answers[jobSpecificQuestions[jobType].questions[currentQuestion].id] === undefined
                      : questionMode === "industry" && industryType
                        ? answers[industrySpecificQuestions[industryType].questions[currentQuestion].id] === undefined
                        : answers[baseQuestions[activeCategory][currentQuestion].id] === undefined
                  }
                >
                  {getCurrentQuestionIndex() === getTotalQuestions() ? "결과 보기" : "다음"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </>
        ) : (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">진단 결과</CardTitle>
                <CardDescription className="text-center">
                  AI 시대 준비 상태: {results.score}/{results.maxScore} 점
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 심층 분석 컴포넌트 */}
                <RealityCheckAnalysis
                  results={results}
                  questionMode={questionMode}
                  jobType={jobType}
                  industryType={industryType}
                />
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button className="w-full" onClick={handleSaveResults} disabled={saving}>
                  {saving ? "저장 중..." : "결과 저장 및 로드맵 보기"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Link href="/" className="w-full">
                  <Button variant="outline" className="w-full">
                    홈으로 돌아가기
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
