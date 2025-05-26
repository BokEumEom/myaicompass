"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BarChart3, LineChart, TrendingUp, TrendingDown, Minus } from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler,
} from "chart.js"
import { Line, Bar, Radar } from "react-chartjs-2"

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
)

export function RealityCheckHistory({ results, isLoading, onBack }) {
  const [activeTab, setActiveTab] = useState("overview")

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600 mb-4"></div>
            <p className="text-muted-foreground">이전 진단 결과를 불러오는 중입니다...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!results || results.length === 0) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">이전 진단 결과가 없습니다.</p>
            <Button onClick={onBack}>진단으로 돌아가기</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 결과를 날짜순으로 정렬 (최신순)
  const sortedResults = [...results].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  // 시간에 따른 점수 변화 데이터
  const scoreData = {
    labels: sortedResults.map((r) => new Date(r.created_at).toLocaleDateString()).reverse(),
    datasets: [
      {
        label: "AI 적응 점수",
        data: sortedResults.map((r) => r.score).reverse(),
        borderColor: "rgb(20, 184, 166)",
        backgroundColor: "rgba(20, 184, 166, 0.5)",
        tension: 0.3,
      },
    ],
  }

  // 가장 최근 두 결과 비교
  const latestResult = sortedResults[0]
  const previousResult = sortedResults.length > 1 ? sortedResults[1] : null

  // 카테고리별 점수 비교 데이터 (최신 vs 이전)
  const categoryNames = latestResult.category_scores ? Object.keys(latestResult.category_scores) : []

  const categoryData = {
    labels: categoryNames.map((key) => {
      switch (key) {
        case "general":
          return "일반적인 AI 적응"
        case "technical":
          return "기술적 이해와 활용"
        case "creative":
          return "창의적 활용과 협업"
        case "career":
          return "커리어 및 직업 변화"
        case "mindset":
          return "마인드셋 및 학습 태도"
        default:
          return key
      }
    }),
    datasets: [
      {
        label: "현재",
        data: categoryNames.map((key) => latestResult.category_scores[key] || 0),
        backgroundColor: "rgba(20, 184, 166, 0.7)",
      },
      ...(previousResult && previousResult.category_scores
        ? [
            {
              label: "이전",
              data: categoryNames.map((key) => previousResult.category_scores[key] || 0),
              backgroundColor: "rgba(148, 163, 184, 0.7)",
            },
          ]
        : []),
    ],
  }

  // 레이더 차트 데이터
  const radarData = {
    labels: categoryNames.map((key) => {
      switch (key) {
        case "general":
          return "일반적인 AI 적응"
        case "technical":
          return "기술적 이해와 활용"
        case "creative":
          return "창의적 활용과 협업"
        case "career":
          return "커리어 및 직업 변화"
        case "mindset":
          return "마인드셋 및 학습 태도"
        default:
          return key
      }
    }),
    datasets: [
      {
        label: "현재",
        data: categoryNames.map((key) => latestResult.category_scores[key] || 0),
        backgroundColor: "rgba(20, 184, 166, 0.2)",
        borderColor: "rgb(20, 184, 166)",
        pointBackgroundColor: "rgb(20, 184, 166)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(20, 184, 166)",
      },
      ...(previousResult && previousResult.category_scores
        ? [
            {
              label: "이전",
              data: categoryNames.map((key) => previousResult.category_scores[key] || 0),
              backgroundColor: "rgba(148, 163, 184, 0.2)",
              borderColor: "rgb(148, 163, 184)",
              pointBackgroundColor: "rgb(148, 163, 184)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgb(148, 163, 184)",
            },
          ]
        : []),
    ],
  }

  // 점수 변화 계산
  const calculateChange = (current, previous) => {
    if (!previous) return { value: 0, direction: "none" }
    const change = current - previous
    return {
      value: Math.abs(change),
      direction: change > 0 ? "up" : change < 0 ? "down" : "none",
    }
  }

  const scoreChange = calculateChange(latestResult.score, previousResult ? previousResult.score : null)

  // 상태 변화 표시
  const getStatusChangeText = () => {
    if (!previousResult) return null
    if (latestResult.status === previousResult.status) return `이전과 동일: ${latestResult.status}`
    return `${previousResult.status} → ${latestResult.status}`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Reality Check 이력</CardTitle>
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              진단으로 돌아가기
            </Button>
          </div>
          <CardDescription>
            시간에 따른 AI 적응 상태 변화를 확인하세요. 총 {results.length}회 진단 완료.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="overview">개요</TabsTrigger>
              <TabsTrigger value="categories">카테고리별 분석</TabsTrigger>
              <TabsTrigger value="trends">추이 분석</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">최근 진단 점수</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-teal-600">{latestResult.score}</div>
                      {scoreChange.direction !== "none" && (
                        <div
                          className={`flex items-center ${
                            scoreChange.direction === "up" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {scoreChange.direction === "up" ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          <span>{scoreChange.value}점</span>
                        </div>
                      )}
                    </div>
                    <Progress value={latestResult.score} className="h-2 mt-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(latestResult.created_at).toLocaleDateString()} 진단
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">현재 상태</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-medium">{latestResult.status}</div>
                    {getStatusChangeText() && (
                      <p className="text-xs text-muted-foreground mt-1">{getStatusChangeText()}</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">진단 횟수</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-teal-600">{results.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      첫 진단: {new Date(results[results.length - 1].created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <LineChart className="h-4 w-4 mr-2 text-teal-600" />
                    시간에 따른 점수 변화
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Line
                      data={scoreData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            min: 0,
                            max: 100,
                          },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">강점 영역</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {latestResult.strengths && latestResult.strengths.length > 0 ? (
                      <ul className="space-y-1">
                        {latestResult.strengths.map((strength, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-green-500 text-lg">•</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">데이터가 없습니다.</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">개선 필요 영역</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {latestResult.weaknesses && latestResult.weaknesses.length > 0 ? (
                      <ul className="space-y-1">
                        {latestResult.weaknesses.map((weakness, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-orange-500 text-lg">•</span>
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">데이터가 없습니다.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2 text-teal-600" />
                    카테고리별 점수 비교
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Bar
                      data={categoryData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            min: 0,
                            max: 100,
                          },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">카테고리별 변화</CardTitle>
                </CardHeader>
                <CardContent>
                  {latestResult.category_scores && previousResult && previousResult.category_scores ? (
                    <div className="space-y-4">
                      {Object.entries(latestResult.category_scores).map(([key, score]) => {
                        const prevScore = previousResult.category_scores[key] || 0
                        const change = calculateChange(score, prevScore)
                        let categoryName = ""

                        switch (key) {
                          case "general":
                            categoryName = "일반적인 AI 적응"
                            break
                          case "technical":
                            categoryName = "기술적 이해와 활용"
                            break
                          case "creative":
                            categoryName = "창의적 활용과 협업"
                            break
                          case "career":
                            categoryName = "커리어 및 직업 변화"
                            break
                          case "mindset":
                            categoryName = "마인드셋 및 학습 태도"
                            break
                          default:
                            categoryName = key
                        }

                        return (
                          <div key={key} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{categoryName}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">
                                  {prevScore} → {score}
                                </span>
                                <span
                                  className={`flex items-center ${
                                    change.direction === "up"
                                      ? "text-green-600"
                                      : change.direction === "down"
                                        ? "text-red-600"
                                        : "text-gray-600"
                                  }`}
                                >
                                  {change.direction === "up" ? (
                                    <TrendingUp className="h-4 w-4" />
                                  ) : change.direction === "down" ? (
                                    <TrendingDown className="h-4 w-4" />
                                  ) : (
                                    <Minus className="h-4 w-4" />
                                  )}
                                </span>
                              </div>
                            </div>
                            <Progress value={score} className="h-2" />
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">비교할 이전 데이터가 없습니다.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">역량 레이더 차트</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Radar
                      data={radarData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          r: {
                            min: 0,
                            max: 100,
                            ticks: {
                              stepSize: 20,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">진단 이력</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sortedResults.map((result, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">{new Date(result.created_at).toLocaleDateString()} 진단</div>
                          <div className="text-sm text-muted-foreground">{result.status}</div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-2xl font-bold text-teal-600">{result.score}</div>
                          <Progress value={result.score} className="h-2 flex-1" />
                        </div>
                        {result.category_scores && (
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            {Object.entries(result.category_scores).map(([key, score]) => {
                              let categoryName = ""

                              switch (key) {
                                case "general":
                                  categoryName = "일반적인 AI 적응"
                                  break
                                case "technical":
                                  categoryName = "기술적 이해와 활용"
                                  break
                                case "creative":
                                  categoryName = "창의적 활용과 협업"
                                  break
                                case "career":
                                  categoryName = "커리어 및 직업 변화"
                                  break
                                case "mindset":
                                  categoryName = "마인드셋 및 학습 태도"
                                  break
                                default:
                                  categoryName = key
                              }

                              return (
                                <div key={key} className="text-xs flex items-center gap-1">
                                  <span className="text-muted-foreground">{categoryName}:</span>
                                  <span className="font-medium">{score}</span>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">성장 인사이트</CardTitle>
                </CardHeader>
                <CardContent>
                  {results.length > 1 ? (
                    <div className="space-y-4">
                      <p className="text-sm">
                        첫 진단 대비 {Math.abs(latestResult.score - results[results.length - 1].score)}점
                        {latestResult.score >= results[results.length - 1].score ? " 향상" : " 감소"}되었습니다.
                      </p>

                      <div className="p-4 bg-teal-50 rounded-lg">
                        <h4 className="font-medium text-teal-800 mb-2">성장 포인트</h4>
                        <p className="text-sm">
                          {results.length > 1 && latestResult.score > results[results.length - 1].score
                            ? "지속적인 진단과 학습을 통해 AI 시대 적응력이 향상되고 있습니다. 특히 강점 영역을 더욱 발전시키고, 개선이 필요한 영역에 집중하면 더 빠른 성장이 가능합니다."
                            : "진단 결과를 통해 개선이 필요한 영역을 파악하고, 맞춤형 로드맵을 통해 체계적으로 역량을 강화해 나가세요. 정기적인 진단을 통해 성장 과정을 추적하는 것이 중요합니다."}
                        </p>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <p>
                          정기적인 Reality Check를 통해 AI 시대 적응 상태를 지속적으로 모니터링하세요. 3개월마다 한 번씩
                          진단을 수행하는 것을 권장합니다.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      아직 충분한 진단 데이터가 없습니다. 정기적인 진단을 통해 시간에 따른 변화를 추적해보세요.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button onClick={onBack} className="w-full">
            진단으로 돌아가기
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
