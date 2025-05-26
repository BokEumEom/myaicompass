"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart2,
  Brain,
  Lightbulb,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  Zap,
  BookOpen,
} from "lucide-react"
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
import { Radar } from "react-chartjs-2"
import { questionCategories } from "./reality-check-questions"

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

interface RealityCheckAnalysisProps {
  results: {
    score: number
    maxScore: number
    percentage: number
    status: string
    categoryScores: Record<string, number>
    riskFactors: string[]
    opportunities: string[]
    strengths: { category: string; score: number }[]
    weaknesses: { category: string; score: number }[]
  }
  questionMode: string
  jobType?: string
  industryType?: string
}

export function RealityCheckAnalysis({ results, questionMode, jobType, industryType }: RealityCheckAnalysisProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // 레이더 차트 데이터
  const radarData = {
    labels: Object.keys(results.categoryScores).map((key) => {
      // 기본 카테고리인 경우
      if (questionCategories[key]) {
        return questionCategories[key]
      }
      // 직업별 특화 카테고리인 경우
      else if (questionMode === "job" && jobType) {
        return "직업 특화 역량"
      }
      // 산업별 특화 카테고리인 경우
      else if (questionMode === "industry" && industryType) {
        return "산업 특화 역량"
      }
      return key
    }),
    datasets: [
      {
        label: "역량 점수",
        data: Object.values(results.categoryScores),
        backgroundColor: "rgba(20, 184, 166, 0.2)",
        borderColor: "rgb(20, 184, 166)",
        pointBackgroundColor: "rgb(20, 184, 166)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(20, 184, 166)",
      },
    ],
  }

  // AI 시대 적응 단계별 특성
  const adaptationStages = {
    "AI 초보자": {
      characteristics: [
        "AI 기술에 대한 기본적인 이해가 부족합니다.",
        "AI 도구 사용 경험이 제한적입니다.",
        "AI 시대 변화에 대한 불안감이 있을 수 있습니다.",
        "디지털 역량이 제한적일 수 있습니다.",
      ],
      recommendations: [
        "기초 AI 개념과 용어를 학습하세요.",
        "ChatGPT와 같은 기본적인 AI 도구 사용법을 익히세요.",
        "일상 업무에 AI 도구를 점진적으로 통합해보세요.",
        "AI 시대에 필요한 기초 디지털 역량을 강화하세요.",
      ],
    },
    "AI 탐색자": {
      characteristics: [
        "AI 기술의 기본 개념을 이해하고 있습니다.",
        "일부 AI 도구를 업무에 활용하고 있습니다.",
        "AI 시대 변화에 적응하려는 의지가 있습니다.",
        "AI 활용 범위를 확장하고자 합니다.",
      ],
      recommendations: [
        "다양한 AI 도구를 실험하고 비교해보세요.",
        "프롬프트 엔지니어링 기술을 향상시키세요.",
        "AI와 협업하는 워크플로우를 개발하세요.",
        "특정 도메인에서 AI 활용 사례를 연구하세요.",
      ],
    },
    "AI 적응자": {
      characteristics: [
        "다양한 AI 도구를 효과적으로 활용하고 있습니다.",
        "AI와 협업하여 창의적인 결과물을 만들 수 있습니다.",
        "AI 시대 변화에 적극적으로 대응하고 있습니다.",
        "AI 활용에 있어 자신만의 방법론을 개발하고 있습니다.",
      ],
      recommendations: [
        "AI 도구를 조합한 복잡한 워크플로우를 구축해보세요.",
        "AI와 인간의 강점을 결합한 하이브리드 접근법을 개발하세요.",
        "특정 도메인에서 AI 활용 전문성을 키우세요.",
        "AI 윤리와 책임에 대한 이해를 심화하세요.",
      ],
    },
    "AI 시대 선도자": {
      characteristics: [
        "AI 기술을 전략적으로 활용하여 혁신을 주도합니다.",
        "AI와 인간의 시너지를 극대화하는 방법을 이해하고 있습니다.",
        "AI 시대의 변화를 기회로 전환할 수 있습니다.",
        "AI 활용에 있어 다른 사람들을 지도하고 영감을 줄 수 있습니다.",
      ],
      recommendations: [
        "AI 기반 혁신 프로젝트를 주도해보세요.",
        "AI 시대 리더십 역량을 개발하세요.",
        "AI 지식과 경험을 다른 사람들과 공유하세요.",
        "AI 기술 트렌드를 예측하고 선제적으로 대응하세요.",
      ],
    },
  }

  // 직업별 특화 분석
  const jobSpecificAnalysis = {
    developer: {
      title: "개발자를 위한 AI 적응 전략",
      insights: [
        "AI 코드 어시스턴트를 활용하여 반복적인 코딩 작업을 자동화하세요.",
        "AI가 대체하기 어려운 시스템 설계 및 아키텍처 역량을 강화하세요.",
        "AI 모델 통합 및 API 활용 능력을 개발하세요.",
        "AI 윤리 및 책임 있는 개발 방법론을 학습하세요.",
      ],
      opportunities: [
        "AI 기반 개발 도구 전문가로 성장할 수 있습니다.",
        "AI 시스템 설계 및 통합 분야에서 새로운 기회를 찾을 수 있습니다.",
        "AI 모델 최적화 및 커스터마이징 역량을 개발할 수 있습니다.",
        "AI 개발 윤리 및 거버넌스 분야에서 전문성을 키울 수 있습니다.",
      ],
    },
    designer: {
      title: "디자이너를 위한 AI 적응 전략",
      insights: [
        "AI 이미지 생성 도구를 디자인 워크플로우에 통합하여 아이디어 발상을 가속화하세요.",
        "AI가 대체하기 어려운 창의적 방향성 설정과 심미적 판단 능력을 강화하세요.",
        "AI 도구의 효과적인 프롬프트 작성 기술을 개발하세요.",
        "AI와 협업하는 새로운 디자인 방법론을 탐색하세요.",
      ],
      opportunities: [
        "AI 디자인 도구 전문가로 성장할 수 있습니다.",
        "AI와 인간 디자이너의 협업을 주도하는 역할을 맡을 수 있습니다.",
        "AI 기반 디자인 시스템 개발 분야에서 새로운 기회를 찾을 수 있습니다.",
        "AI 디자인 윤리 및 접근성 분야에서 전문성을 키울 수 있습니다.",
      ],
    },
    marketer: {
      title: "마케터를 위한 AI 적응 전략",
      insights: [
        "AI 콘텐츠 생성 도구를 활용하여 마케팅 콘텐츠 제작을 가속화하세요.",
        "AI 데이터 분석 도구를 통해 고객 인사이트를 더 깊이 이해하세요.",
        "AI 마케팅 자동화 도구를 활용하여 캠페인 효율성을 높이세요.",
        "AI가 대체하기 어려운 브랜드 전략 및 창의적 마케팅 기획 능력을 강화하세요.",
      ],
      opportunities: [
        "AI 마케팅 전략 전문가로 성장할 수 있습니다.",
        "AI 기반 고객 인사이트 분석 분야에서 새로운 기회를 찾을 수 있습니다.",
        "AI 마케팅 자동화 및 최적화 역량을 개발할 수 있습니다.",
        "AI 마케팅 윤리 및 개인정보 보호 분야에서 전문성을 키울 수 있습니다.",
      ],
    },
    manager: {
      title: "매니저/리더를 위한 AI 적응 전략",
      insights: [
        "AI 도구를 팀 워크플로우에 통합하여 생산성을 향상시키세요.",
        "AI 기반 의사결정 지원 시스템을 활용하여 더 나은 결정을 내리세요.",
        "팀원들의 AI 역량 개발을 지원하고 코칭하세요.",
        "AI 도입에 따른 조직 변화를 효과적으로 관리하세요.",
      ],
      opportunities: [
        "AI 변화 관리 리더로 성장할 수 있습니다.",
        "AI 전략 및 거버넌스 분야에서 새로운 기회를 찾을 수 있습니다.",
        "AI 인재 개발 및 코칭 역량을 키울 수 있습니다.",
        "AI 윤리 및 책임 있는 AI 도입 분야에서 전문성을 개발할 수 있습니다.",
      ],
    },
  }

  // 산업별 특화 분석
  const industrySpecificAnalysis = {
    healthcare: {
      title: "헬스케어 산업의 AI 적응 전략",
      insights: [
        "AI 진단 보조 도구의 한계와 활용 방법을 이해하세요.",
        "환자 데이터 보호와 AI 활용의 균형을 유지하세요.",
        "AI 헬스케어 솔루션의 규제 및 인증 요구사항을 숙지하세요.",
        "AI와 의료 전문가의 협업 모델을 개발하세요.",
      ],
      trends: [
        "AI 기반 의료 영상 분석 기술의 발전",
        "개인 맞춤형 치료 계획을 위한 AI 활용 증가",
        "원격 의료 및 모니터링에 AI 통합",
        "의료 연구 및 신약 개발에 AI 활용 확대",
      ],
    },
    finance: {
      title: "금융 산업의 AI 적응 전략",
      insights: [
        "AI 기반 금융 분석 및 예측 도구의 활용법을 익히세요.",
        "금융 데이터 활용 시 개인정보 보호와 규제 준수에 주의하세요.",
        "AI 금융 사기 탐지 및 리스크 관리 시스템을 이해하세요.",
        "AI와 금융 전문가의 협업 모델을 개발하세요.",
      ],
      trends: [
        "AI 기반 개인 맞춤형 금융 상품 및 서비스 확대",
        "자동화된 투자 자문 및 포트폴리오 관리 서비스 증가",
        "실시간 사기 탐지 및 리스크 관리에 AI 활용 강화",
        "금융 포용성 향상을 위한 AI 솔루션 개발",
      ],
    },
    education: {
      title: "교육 산업의 AI 적응 전략",
      insights: [
        "AI 기반 학습 도구를 교육 과정에 통합하세요.",
        "학생 개인별 맞춤형 학습 경험을 설계하세요.",
        "AI 시대에 필요한 디지털 리터러시를 가르치세요.",
        "학생 데이터 보호와 AI 활용의 균형을 유지하세요.",
      ],
      trends: [
        "AI 기반 개인 맞춤형 학습 경로 설계 확대",
        "자동화된 평가 및 피드백 시스템 도입 증가",
        "가상 교육 보조 및 튜터링 시스템 발전",
        "교육자 역할의 변화와 AI 협업 모델 개발",
      ],
    },
  }

  // 현재 상태에 따른 분석 정보 가져오기
  const currentStageAnalysis = adaptationStages[results.status] || adaptationStages["AI 초보자"]

  // 직업별 특화 분석 정보 가져오기
  const currentJobAnalysis = jobType && jobSpecificAnalysis[jobType] ? jobSpecificAnalysis[jobType] : null

  // 산업별 특화 분석 정보 가져오기
  const currentIndustryAnalysis =
    industryType && industrySpecificAnalysis[industryType] ? industrySpecificAnalysis[industryType] : null

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">종합 분석</TabsTrigger>
          <TabsTrigger value="strengths">강점 및 개선점</TabsTrigger>
          <TabsTrigger value="recommendations">맞춤 추천</TabsTrigger>
          {(questionMode === "job" || questionMode === "industry") && (
            <TabsTrigger value="specialized">특화 분석</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-teal-600" />
                AI 시대 적응 상태
              </CardTitle>
              <CardDescription>현재 AI 시대 적응 상태에 대한 종합 분석입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-4 bg-teal-50 rounded-full mb-2">
                  <Brain className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold">{results.status}</h3>
                <Progress value={results.percentage} className="h-2 mt-2" />
                <p className="text-sm text-muted-foreground mt-2">{results.percentage.toFixed(0)}% 준비 완료</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    위험 요소
                  </h4>
                  <ul className="space-y-2">
                    {results.riskFactors.map((risk, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-red-500 text-lg">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-teal-600 flex items-center gap-1">
                    <Lightbulb className="h-4 w-4" />
                    기회 요소
                  </h4>
                  <ul className="space-y-2">
                    {results.opportunities.map((opportunity, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-teal-500 text-lg">•</span>
                        <span>{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">현재 단계의 특성</h4>
                <div className="space-y-2">
                  {currentStageAnalysis.characteristics.map((characteristic, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-600 mt-0.5" />
                      <p className="text-sm">{characteristic}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-80">
                <h4 className="font-semibold mb-3 flex items-center gap-1">
                  <Target className="h-4 w-4 text-teal-600" />
                  역량 레이더 차트
                </h4>
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

        <TabsContent value="strengths" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                강점 영역
              </CardTitle>
              <CardDescription>AI 시대 적응에 있어 당신의 강점 영역입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.strengths.map((strength, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{strength.category}</h4>
                      <Badge className="bg-green-100 text-green-800">
                        {strength.score}점
                        <TrendingUp className="ml-1 h-3 w-3" />
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {strength.category === "일반적인 AI 적응"
                        ? "AI 도구 활용과 적응에 대한 기본적인 이해와 경험이 있습니다."
                        : strength.category === "기술적 이해와 활용"
                          ? "AI 기술의 원리와 활용 방법에 대한 이해도가 높습니다."
                          : strength.category === "창의적 활용과 협업"
                            ? "AI와 협업하여 창의적인 결과물을 만들어내는 능력이 뛰어납니다."
                            : strength.category === "커리어 및 직업 변화"
                              ? "AI 시대의 직업 변화에 대한 이해와 대응 능력이 뛰어납니다."
                              : strength.category === "마인드셋 및 학습 태도"
                                ? "AI 시대에 필요한 학습 의지와 적응적 마인드셋을 갖추고 있습니다."
                                : strength.category === "고급 AI 활용 능력"
                                  ? "복잡한 AI 도구와 시스템을 활용하는 고급 능력을 갖추고 있습니다."
                                  : strength.category === "AI 윤리 및 책임"
                                    ? "AI 활용에 있어 윤리적 측면과 책임에 대한 인식이 높습니다."
                                    : "이 영역에서 뛰어난 역량을 보여주고 있습니다."}
                    </p>
                    <div className="mt-3">
                      <h5 className="text-sm font-medium mb-2">강화 전략:</h5>
                      <ul className="space-y-1">
                        {strength.category === "일반적인 AI 적응" ? (
                          <>
                            <li className="text-sm flex items-start gap-2">
                              <ArrowUpRight className="h-3 w-3 text-green-600 mt-1" />
                              <span>더 다양한 AI 도구를 실험하고 활용 범위를 확장하세요.</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                              <ArrowUpRight className="h-3 w-3 text-green-600 mt-1" />
                              <span>AI 도구를 일상 업무에 더 깊이 통합하는 방법을 모색하세요.</span>
                            </li>
                          </>
                        ) : strength.category === "기술적 이해와 활용" ? (
                          <>
                            <li className="text-sm flex items-start gap-2">
                              <ArrowUpRight className="h-3 w-3 text-green-600 mt-1" />
                              <span>고급 프롬프트 엔지니어링 기술을 개발하세요.</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                              <ArrowUpRight className="h-3 w-3 text-green-600 mt-1" />
                              <span>AI 모델의 파라미터와 설정을 조정하는 고급 기술을 습득하세요.</span>
                            </li>
                          </>
                        ) : strength.category === "창의적 활용과 협업" ? (
                          <>
                            <li className="text-sm flex items-start gap-2">
                              <ArrowUpRight className="h-3 w-3 text-green-600 mt-1" />
                              <span>AI와 협업하여 더 복잡한 창의적 프로젝트에 도전하세요.</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                              <ArrowUpRight className="h-3 w-3 text-green-600 mt-1" />
                              <span>AI와 인간의 창의성을 결합한 새로운 워크플로우를 개발하세요.</span>
                            </li>
                          </>
                        ) : strength.category === "커리어 및 직업 변화" ? (
                          <>
                            <li className="text-sm flex items-start gap-2">
                              <ArrowUpRight className="h-3 w-3 text-green-600 mt-1" />
                              <span>AI 시대의 새로운 직업 기회를 적극적으로 탐색하세요.</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                              <ArrowUpRight className="h-3 w-3 text-green-600 mt-1" />
                              <span>AI 관련 전문성을 바탕으로 커리어 발전 계획을 수립하세요.</span>
                            </li>
                          </>
                        ) : strength.category === "마인드셋 및 학습 태도" ? (
                          <>
                            <li className="text-sm flex items-start gap-2">
                              <ArrowUpRight className="h-3 w-3 text-green-600 mt-1" />
                              <span>지속적인 학습 습관을 더욱 체계화하고 발전시키세요.</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                              <ArrowUpRight className="h-3 w-3 text-green-600 mt-1" />
                              <span>다른 사람들의 AI 적응을 돕고 멘토링하는 역할을 고려해보세요.</span>
                            </li>
                          </>
                        ) : strength.category === "고급 AI 활용 능력" ? (
                          <>
                            <li className="text-sm flex items-start gap-2">
                              <ArrowUpRight className="h-3 w-3 text-green-600 mt-1" />
                              <span>AI 시스템 설계 및 최적화 역량을 더욱 발전시키세요.</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                              <ArrowUpRight className="h-3 w-3 text-green-600 mt-1" />
                              <span>AI 기술 트렌드를 선도하고 혁신적인 활용 방안을 모색하세요.</span>
                            </li>
                          </>
                        ) : strength.category === "AI 윤리 및 책임" ? (
                          <>
                            <li className="text-sm flex items-start gap-2">
                              <ArrowUpRight className="h-3 w-3 text-green-600 mt-1" />
                              <span>AI 윤리 및 거버넌스 분야에서 전문성을 더욱 발전시키세요.</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                              <ArrowUpRight className="h-3 w-3 text-green-600 mt-1" />
                              <span>조직 내 AI 윤리 가이드라인 수립에 기여해보세요.</span>
                            </li>
                          </>
                        ) : (
                          <>
                            <li className="text-sm flex items-start gap-2">
                              <ArrowUpRight className="h-3 w-3 text-green-600 mt-1" />
                              <span>이 영역의 강점을 더욱 발전시키는 심화 학습을 진행하세요.</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                              <ArrowUpRight className="h-3 w-3 text-green-600 mt-1" />
                              <span>이 강점을 활용하여 다른 영역의 역량도 향상시켜 보세요.</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                개선 필요 영역
              </CardTitle>
              <CardDescription>AI 시대 적응을 위해 개선이 필요한 영역입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.weaknesses.map((weakness, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{weakness.category}</h4>
                      <Badge variant="outline" className="bg-orange-100 text-orange-800">
                        {weakness.score}점
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {weakness.category === "일반적인 AI 적응"
                        ? "AI 도구 활용과 적응에 대한 기본적인 이해와 경험이 부족합니다."
                        : weakness.category === "기술적 이해와 활용"
                          ? "AI 기술의 원리와 활용 방법에 대한 이해도가 낮습니다."
                          : weakness.category === "창의적 활용과 협업"
                            ? "AI와 협업하여 창의적인 결과물을 만들어내는 경험이 부족합니다."
                            : weakness.category === "커리어 및 직업 변화"
                              ? "AI 시대의 직업 변화에 대한 이해와 대응이 미흡합니다."
                              : weakness.category === "마인드셋 및 학습 태도"
                                ? "AI 시대에 필요한 학습 의지와 적응적 마인드셋이 부족합니다."
                                : weakness.category === "고급 AI 활용 능력"
                                  ? "복잡한 AI 도구와 시스템을 활용하는 고급 능력이 부족합니다."
                                  : weakness.category === "AI 윤리 및 책임"
                                    ? "AI 활용에 있어 윤리적 측면과 책임에 대한 인식이 부족합니다."
                                    : "이 영역에서 개선이 필요합니다."}
                    </p>
                    <div className="mt-3">
                      <h5 className="text-sm font-medium mb-2">개선 전략:</h5>
                      <ul className="space-y-1">
                        {weakness.category === "일반적인 AI 적응" ? (
                          <>
                            <li className="text-sm flex items-start gap-2">
                              <Zap className="h-3 w-3 text-orange-600 mt-1" />
                              <span>ChatGPT와 같은 기본적인 AI 도구 사용법을 익히세요.</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                              <Zap className="h-3 w-3 text-orange-600 mt-1" />
                              <span>일상 업무에 AI 도구를 점진적으로 통합해보세요.</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                              <BookOpen className="h-3 w-3 text-blue-600 mt-1" />
                              <span>추천 자료: "AI 초보자를 위한 가이드" 퀘스트</span>
                            </li>
                          </>
                        ) : weakness.category === "기술적 이해와 활용" ? (
                          <>
                            <li className="text-sm flex items-start gap-2">
                              <Zap className="h-3 w-3 text-orange-600 mt-1" />
                              <span>AI 기술의 기본 원리와 작동 방식을 학습하세요.</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                              <Zap className="h-3 w-3 text-orange-600 mt-1" />
                              <span>효과적인 프롬프트 작성법을 연습하세요.</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                              <BookOpen className="h-3 w-3 text-blue-600 mt-1" />
                              <span>추천 자료: "프롬프트 엔지니어링 기초" 퀘스트</span>
                            </li>
                          </>
                        ) : weakness.category === "창의적 활용과 협업" ? (
                          <>
                            <li className="text-sm flex items-start gap-2">
                              <Zap className="h-3 w-3 text-orange-600 mt-1" />
                              <span>AI와 함께 간단한 창의적 프로젝트를 시도해보세요.</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                              <Zap className="h-3 w-3 text-orange-600 mt-1" />
                              <span>AI의 제안을 바탕으로 아이디어를 발전시키는 연습을 하세요.</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                              <BookOpen className="h-3 w-3 text-blue-600 mt-1" />
                              <span>추천 자료: "AI와 창의적 협업" 퀘스트</span>
                            </li>
                          </>
                        ) : weakness.category === "커리어 및 직업 변화" ? (
                          <>
                            <li className="text-sm flex items-start gap-2">
                              <Zap className="h-3 w-3 text-orange-600 mt-1" />
                              <span>AI가 자신의 직업에 미치는 영향을 연구하세요.</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                              <Zap className="h-3 w-3 text-orange-600 mt-1" />
                              <span>AI 시대에 가치 있는 역량 개발 계획을 수립하세요.</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                              <BookOpen className="h-3 w-3 text-blue-600 mt-1" />
                              <span>추천 자료: "AI 시대 커리어 전략" 퀘스트</span>
                            </li>
                          </>
                        ) : weakness.category === "마인드셋 및 학습 태도" ? (
                          <>
                            <li className="text-sm flex items-start gap-2">
                              <Zap className="h-3 w-3 text-orange-600 mt-1" />
                              <span>AI를 위협이 아닌 기회로 바라보는 관점을 개발하세요.</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                              <Zap className="h-3 w-3 text-orange-600 mt-1" />
                              <span>지속적인 학습 습관을 형성하세요.</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                              <BookOpen className="h-3 w-3 text-blue-600 mt-1" />
                              <span>추천 자료: "AI 시대 성장 마인드셋" 퀘스트</span>
                            </li>
                          </>
                        ) : weakness.category === "고급 AI 활용 능력" ? (
                          <>
                            <li className="text-sm flex items-start gap-2">
                              <Zap className="h-3 w-3 text-orange-600 mt-1" />
                              <span>다양한 AI 도구를 조합하는 워크플로우를 실험해보세요.</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                              <Zap className="h-3 w-3 text-orange-600 mt-1" />
                              <span>AI 모델의 파라미터와 설정을 조정하는 방법을 학습하세요.</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                              <BookOpen className="h-3 w-3 text-blue-600 mt-1" />
                              <span>추천 자료: "고급 AI 활용 기법" 퀘스트</span>
                            </li>
                          </>
                        ) : weakness.category === "AI 윤리 및 책임" ? (
                          <>
                            <li className="text-sm flex items-start gap-2">
                              <Zap className="h-3 w-3 text-orange-600 mt-1" />
                              <span>AI 윤리와 책임에 관한 기본 원칙을 학습하세요.</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                              <Zap className="h-3 w-3 text-orange-600 mt-1" />
                              <span>AI 사용 시 개인정보 보호와 데이터 보안을 고려하세요.</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                              <BookOpen className="h-3 w-3 text-blue-600 mt-1" />
                              <span>추천 자료: "AI 윤리와 책임" 퀘스트</span>
                            </li>
                          </>
                        ) : (
                          <>
                            <li className="text-sm flex items-start gap-2">
                              <Zap className="h-3 w-3 text-orange-600 mt-1" />
                              <span>이 영역의 기초부터 차근차근 학습하세요.</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                              <Zap className="h-3 w-3 text-orange-600 mt-1" />
                              <span>실습과 경험을 통해 점진적으로 역량을 키우세요.</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-teal-600" />
                맞춤 추천 사항
              </CardTitle>
              <CardDescription>AI 시대 적응을 위한 맞춤형 추천 사항입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-medium">다음 단계 추천</h4>
                <div className="space-y-3">
                  {currentStageAnalysis.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <ArrowUpRight className="h-4 w-4 text-teal-600 mt-0.5" />
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>

                <h4 className="font-medium mt-6">학습 자료 추천</h4>
                <div className="space-y-3">
                  {results.status === "AI 초보자" ? (
                    <>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm mb-1">AI 기초 개념 이해하기</h5>
                        <p className="text-xs text-muted-foreground">
                          AI의 기본 개념과 작동 원리를 이해하는 입문 자료입니다.
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm mb-1">ChatGPT 활용 가이드</h5>
                        <p className="text-xs text-muted-foreground">
                          ChatGPT를 효과적으로 활용하는 방법을 배울 수 있는 가이드입니다.
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm mb-1">AI 도구 탐색하기</h5>
                        <p className="text-xs text-muted-foreground">
                          다양한 AI 도구를 소개하고 기본적인 활용법을 알려주는 자료입니다.
                        </p>
                      </div>
                    </>
                  ) : results.status === "AI 탐색자" ? (
                    <>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm mb-1">프롬프트 엔지니어링 마스터하기</h5>
                        <p className="text-xs text-muted-foreground">
                          효과적인 프롬프트 작성법을 배울 수 있는 심화 가이드입니다.
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm mb-1">AI 업무 자동화 워크숍</h5>
                        <p className="text-xs text-muted-foreground">
                          반복적인 업무를 AI로 자동화하는 방법을 배울 수 있는 워크숍입니다.
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm mb-1">AI와 창의적 문제 해결</h5>
                        <p className="text-xs text-muted-foreground">
                          AI를 활용한 창의적 문제 해결 방법을 배울 수 있는 자료입니다.
                        </p>
                      </div>
                    </>
                  ) : results.status === "AI 적응자" ? (
                    <>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm mb-1">AI 도구 통합 워크플로우 구축</h5>
                        <p className="text-xs text-muted-foreground">
                          다양한 AI 도구를 통합하여 효율적인 워크플로우를 구축하는 방법을 배울 수 있습니다.
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm mb-1">도메인별 AI 활용 사례 연구</h5>
                        <p className="text-xs text-muted-foreground">
                          특정 도메인에서 AI를 전문적으로 활용한 사례를 분석하는 자료입니다.
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm mb-1">AI 윤리와 책임</h5>
                        <p className="text-xs text-muted-foreground">
                          AI 활용에 있어 윤리적 측면과 책임에 대해 심층적으로 다루는 자료입니다.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm mb-1">AI 전략 수립 및 리더십</h5>
                        <p className="text-xs text-muted-foreground">
                          조직의 AI 전략을 수립하고 리더십을 발휘하는 방법을 배울 수 있는 자료입니다.
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm mb-1">AI 기반 혁신 프로젝트 기획</h5>
                        <p className="text-xs text-muted-foreground">
                          AI를 활용한 혁신적인 프로젝트를 기획하고 실행하는 방법을 배울 수 있습니다.
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm mb-1">AI 멘토링 및 지식 공유</h5>
                        <p className="text-xs text-muted-foreground">
                          AI 지식을 효과적으로 공유하고 다른 사람들을 멘토링하는 방법을 배울 수 있습니다.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <h4 className="font-medium mt-6">추천 퀘스트</h4>
                <div className="space-y-3">
                  {results.status === "AI 초보자" ? (
                    <>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm mb-1">ChatGPT 업무 도우미 만들기</h5>
                        <p className="text-xs text-muted-foreground">
                          자신의 업무에 맞는 ChatGPT 프롬프트 템플릿을 만들어보는 퀘스트입니다.
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm mb-1">AI 도구 탐색 일지</h5>
                        <p className="text-xs text-muted-foreground">
                          다양한 AI 도구를 탐색하고 사용 경험을 기록하는 퀘스트입니다.
                        </p>
                      </div>
                    </>
                  ) : results.status === "AI 탐색자" ? (
                    <>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm mb-1">AI 브레인스토밍 세션</h5>
                        <p className="text-xs text-muted-foreground">
                          AI와 함께 창의적인 브레인스토밍 세션을 진행하는 퀘스트입니다.
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm mb-1">AI 피드백 시스템 구축</h5>
                        <p className="text-xs text-muted-foreground">
                          자신의 작업물에 대한 AI 피드백 시스템을 구축하는 퀘스트입니다.
                        </p>
                      </div>
                    </>
                  ) : results.status === "AI 적응자" ? (
                    <>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm mb-1">AI 활용 사례 연구</h5>
                        <p className="text-xs text-muted-foreground">
                          다양한 분야의 AI 활용 사례를 연구하고 인사이트를 도출하는 퀘스트입니다.
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm mb-1">AI 아트 포트폴리오</h5>
                        <p className="text-xs text-muted-foreground">
                          AI 도구를 활용하여 창의적인 아트 포트폴리오를 만드는 퀘스트입니다.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm mb-1">AI 시대 커리어 스토리맵</h5>
                        <p className="text-xs text-muted-foreground">
                          AI 시대에 맞춘 나의 커리어 스토리맵을 만드는 퀘스트입니다.
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm mb-1">AI 멘토링 프로그램 개발</h5>
                        <p className="text-xs text-muted-foreground">
                          다른 사람들의 AI 적응을 돕는 멘토링 프로그램을 개발하는 퀘스트입니다.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {(questionMode === "job" || questionMode === "industry") && (
          <TabsContent value="specialized" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-teal-600" />
                  {questionMode === "job" && currentJobAnalysis
                    ? currentJobAnalysis.title
                    : questionMode === "industry" && currentIndustryAnalysis
                      ? currentIndustryAnalysis.title
                      : "특화 분석"}
                </CardTitle>
                <CardDescription>
                  {questionMode === "job"
                    ? "선택한 직업 분야에 특화된 AI 적응 분석입니다."
                    : "선택한 산업 분야에 특화된 AI 적응 분석입니다."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {questionMode === "job" && currentJobAnalysis ? (
                  <>
                    <div>
                      <h4 className="font-medium mb-3">핵심 인사이트</h4>
                      <div className="space-y-2">
                        {currentJobAnalysis.insights.map((insight, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Lightbulb className="h-4 w-4 text-teal-600 mt-0.5" />
                            <p className="text-sm">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">기회 요소</h4>
                      <div className="space-y-2">
                        {currentJobAnalysis.opportunities.map((opportunity, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <ArrowUpRight className="h-4 w-4 text-green-600 mt-0.5" />
                            <p className="text-sm">{opportunity}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : questionMode === "industry" && currentIndustryAnalysis ? (
                  <>
                    <div>
                      <h4 className="font-medium mb-3">핵심 인사이트</h4>
                      <div className="space-y-2">
                        {currentIndustryAnalysis.insights.map((insight, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Lightbulb className="h-4 w-4 text-teal-600 mt-0.5" />
                            <p className="text-sm">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">산업 트렌드</h4>
                      <div className="space-y-2">
                        {currentIndustryAnalysis.trends.map((trend, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                            <p className="text-sm">{trend}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">특화 분석 데이터가 없습니다.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
