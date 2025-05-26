"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Info, HelpCircle } from "lucide-react"

// 질문 카테고리 정의
export const questionCategories = {
  general: "일반적인 AI 적응",
  technical: "기술적 이해와 활용",
  creative: "창의적 활용과 협업",
  career: "커리어 및 직업 변화",
  mindset: "마인드셋 및 학습 태도",
  advanced: "고급 AI 활용 능력",
  ethical: "AI 윤리 및 책임",
}

// 기본 질문 세트
export const baseQuestions = {
  general: [
    {
      id: "g1",
      question: "내 업무 중 반복적이고 자동화될 수 있는 요소가 많다",
      description: "현재 업무에서 AI가 대체할 수 있는 부분이 얼마나 되는지 생각해보세요.",
    },
    {
      id: "g2",
      question: "나는 AI 도구들을 사용해본 경험이 있다",
      description: "ChatGPT, DALL-E, Midjourney 등의 AI 도구를 사용해본 경험을 고려하세요.",
    },
    {
      id: "g3",
      question: "최근 1년간 내 기술/지식이 업그레이드되었다",
      description: "새로운 기술이나 지식을 습득하기 위해 노력한 정도를 평가해보세요.",
    },
    {
      id: "g4",
      question: "나의 커뮤니케이션 능력, 창의력, 협업능력은 강점이다",
      description: "AI가 대체하기 어려운 인간 고유의 능력에 대해 평가해보세요.",
    },
    {
      id: "g5",
      question: "AI를 도구로 활용해 나만의 결과물을 낸 경험이 있다",
      description: "AI를 활용하여 창의적인 결과물을 만들어본 경험을 고려하세요.",
    },
  ],
  technical: [
    {
      id: "t1",
      question: "AI 모델의 기본 원리와 한계를 이해하고 있다",
      description: "AI 기술의 작동 방식과 한계점에 대한 이해도를 평가해보세요.",
    },
    {
      id: "t2",
      question: "효과적인 프롬프트 작성 방법을 알고 있다",
      description: "AI에게 원하는 결과를 얻기 위한 프롬프트 작성 능력을 평가해보세요.",
    },
    {
      id: "t3",
      question: "AI 도구를 업무 프로세스에 통합해 사용할 수 있다",
      description: "AI 도구를 일상 업무 흐름에 통합하는 능력을 평가해보세요.",
    },
    {
      id: "t4",
      question: "AI가 생성한 결과물을 검증하고 개선할 수 있다",
      description: "AI 결과물의 정확성을 판단하고 필요시 수정하는 능력을 평가해보세요.",
    },
    {
      id: "t5",
      question: "다양한 AI 도구의 특성과 적합한 사용 상황을 구분할 수 있다",
      description: "상황에 맞는 AI 도구를 선택하는 능력을 평가해보세요.",
    },
  ],
  creative: [
    {
      id: "c1",
      question: "AI와 협업하여 창의적인 문제를 해결한 경험이 있다",
      description: "AI를 활용하여 창의적인 문제 해결에 접근한 경험을 평가해보세요.",
    },
    {
      id: "c2",
      question: "AI의 제안을 바탕으로 나만의 아이디어를 발전시킬 수 있다",
      description: "AI의 결과물을 출발점으로 삼아 독창적인 아이디어로 발전시키는 능력을 평가해보세요.",
    },
    {
      id: "c3",
      question: "AI를 활용하여 다양한 관점과 아이디어를 탐색할 수 있다",
      description: "AI를 통해 다양한 시각과 접근 방식을 탐색하는 능력을 평가해보세요.",
    },
    {
      id: "c4",
      question: "AI와 인간의 창의성 차이를 이해하고 상호보완적으로 활용할 수 있다",
      description: "AI와 인간 창의성의 차이점을 이해하고 시너지를 내는 능력을 평가해보세요.",
    },
    {
      id: "c5",
      question: "AI를 활용하여 기존에 시도하지 않았던 새로운 분야에 도전해본 적이 있다",
      description: "AI의 도움으로 새로운 영역에 도전한 경험을 평가해보세요.",
    },
  ],
  career: [
    {
      id: "ca1",
      question: "AI가 내 직업/산업에 미치는 영향을 이해하고 있다",
      description: "AI가 자신의 직업이나 산업에 미치는 영향에 대한 이해도를 평가해보세요.",
    },
    {
      id: "ca2",
      question: "AI 시대에 가치 있는 역량을 개발하기 위한 계획이 있다",
      description: "AI 시대에 경쟁력을 유지하기 위한 역량 개발 계획을 평가해보세요.",
    },
    {
      id: "ca3",
      question: "AI와 차별화된 나만의 전문성과 강점을 명확히 알고 있다",
      description: "AI와 차별화되는 자신만의 고유한 강점에 대한 이해도를 평가해보세요.",
    },
    {
      id: "ca4",
      question: "AI 시대에 새롭게 등장하는 직업과 기회에 대해 탐색하고 있다",
      description: "AI로 인해 생겨나는 새로운 직업과 기회에 대한 탐색 정도를 평가해보세요.",
    },
    {
      id: "ca5",
      question: "AI 도구를 활용하여 내 커리어를 발전시키는 방법을 알고 있다",
      description: "AI를 커리어 발전의 도구로 활용하는 능력을 평가해보세요.",
    },
  ],
  mindset: [
    {
      id: "m1",
      question: "AI 기술의 빠른 변화에 적응하는 것에 불안감이 적다",
      description: "AI 기술의 빠른 변화 속도에 대한 적응력과 심리적 안정감을 평가해보세요.",
    },
    {
      id: "m2",
      question: "AI를 위협이 아닌 기회로 인식하고 있다",
      description: "AI에 대한 긍정적인 마인드셋과 기회로 바라보는 시각을 평가해보세요.",
    },
    {
      id: "m3",
      question: "지속적인 학습과 성장에 대한 의지가 강하다",
      description: "끊임없이 학습하고 성장하려는 의지와 실천력을 평가해보세요.",
    },
    {
      id: "m4",
      question: "실패와 시행착오를 통해 배우는 것에 거부감이 없다",
      description: "새로운 도구와 방법을 시도하면서 겪는 실패를 학습 기회로 삼는 태도를 평가해보세요.",
    },
    {
      id: "m5",
      question: "AI 윤리와 책임에 대해 고민하고 있다",
      description: "AI 사용에 있어 윤리적 측면과 사회적 책임에 대한 인식을 평가해보세요.",
    },
  ],
  // 새로 추가된 고급 AI 활용 능력 카테고리
  advanced: [
    {
      id: "a1",
      question: "여러 AI 도구를 조합하여 복잡한 워크플로우를 구축할 수 있다",
      description: "다양한 AI 도구를 연결하여 복잡한 작업을 자동화하는 능력을 평가해보세요.",
    },
    {
      id: "a2",
      question: "AI 모델의 파라미터와 설정을 조정하여 결과물을 최적화할 수 있다",
      description: "AI 모델의 다양한 설정을 이해하고 조정하는 능력을 평가해보세요.",
    },
    {
      id: "a3",
      question: "AI 모델 학습에 필요한 데이터 준비와 전처리 방법을 이해하고 있다",
      description: "AI 모델 학습을 위한 데이터 준비 과정에 대한 이해도를 평가해보세요.",
    },
    {
      id: "a4",
      question: "특정 도메인에 맞게 AI 모델을 파인튜닝하거나 커스터마이징할 수 있다",
      description: "특정 분야나 목적에 맞게 AI 모델을 조정하는 능력을 평가해보세요.",
    },
    {
      id: "a5",
      question: "AI 기술 트렌드를 지속적으로 모니터링하고 새로운 기술을 빠르게 습득한다",
      description: "최신 AI 기술 동향을 파악하고 새로운 기술을 학습하는 능력을 평가해보세요.",
    },
  ],
  // 새로 추가된 AI 윤리 및 책임 카테고리
  ethical: [
    {
      id: "e1",
      question: "AI 사용 시 개인정보 보호와 데이터 보안을 고려한다",
      description: "AI 사용 과정에서 개인정보와 데이터 보안에 대한 인식을 평가해보세요.",
    },
    {
      id: "e2",
      question: "AI가 생성한 콘텐츠의 저작권과 법적 책임에 대해 이해하고 있다",
      description: "AI 생성 콘텐츠의 저작권과 법적 측면에 대한 이해도를 평가해보세요.",
    },
    {
      id: "e3",
      question: "AI 시스템의 편향성과 공정성 문제를 인식하고 대응할 수 있다",
      description: "AI 시스템에 내재된 편향성을 인식하고 대응하는 능력을 평가해보세요.",
    },
    {
      id: "e4",
      question: "AI 기술이 사회와 환경에 미치는 영향을 고려한다",
      description: "AI 기술의 사회적, 환경적 영향에 대한 인식을 평가해보세요.",
    },
    {
      id: "e5",
      question: "AI 사용에 있어 투명성과 설명 가능성의 중요성을 이해하고 있다",
      description: "AI 의사결정 과정의 투명성과 설명 가능성에 대한 이해도를 평가해보세요.",
    },
  ],
}

// 직업별 특화 질문 세트
export const jobSpecificQuestions = {
  developer: {
    title: "개발자",
    questions: [
      {
        id: "dev1",
        question: "AI 코드 어시스턴트를 활용하여 개발 생산성을 향상시킬 수 있다",
        description: "GitHub Copilot, Tabnine 등의 AI 코드 어시스턴트 활용 능력을 평가해보세요.",
      },
      {
        id: "dev2",
        question: "AI를 활용한 코드 리뷰와 버그 탐지를 수행할 수 있다",
        description: "AI를 활용하여 코드 품질을 향상시키는 능력을 평가해보세요.",
      },
      {
        id: "dev3",
        question: "AI 모델을 애플리케이션에 통합하는 방법을 이해하고 있다",
        description: "AI API 연동 및 모델 배포에 대한 이해도를 평가해보세요.",
      },
      {
        id: "dev4",
        question: "AI 개발 관련 윤리적 고려사항을 이해하고 적용할 수 있다",
        description: "AI 개발 과정에서의 윤리적 측면 고려 능력을 평가해보세요.",
      },
      {
        id: "dev5",
        question: "AI 기반 개발 도구의 한계를 이해하고 적절히 보완할 수 있다",
        description: "AI 개발 도구의 한계를 인식하고 보완하는 능력을 평가해보세요.",
      },
    ],
  },
  designer: {
    title: "디자이너",
    questions: [
      {
        id: "des1",
        question: "AI 이미지 생성 도구를 디자인 워크플로우에 통합할 수 있다",
        description: "DALL-E, Midjourney 등의 AI 이미지 생성 도구 활용 능력을 평가해보세요.",
      },
      {
        id: "des2",
        question: "AI가 생성한 디자인을 평가하고 개선할 수 있다",
        description: "AI 생성 디자인의 품질을 평가하고 개선하는 능력을 평가해보세요.",
      },
      {
        id: "des3",
        question: "AI와 협업하여 창의적인 디자인 솔루션을 도출할 수 있다",
        description: "AI를 디자인 파트너로 활용하는 능력을 평가해보세요.",
      },
      {
        id: "des4",
        question: "AI 디자인 도구의 효과적인 프롬프트 작성법을 알고 있다",
        description: "원하는 디자인 결과를 얻기 위한 프롬프트 작성 능력을 평가해보세요.",
      },
      {
        id: "des5",
        question: "AI가 디자인 산업에 미치는 영향을 이해하고 적응 전략을 가지고 있다",
        description: "변화하는 디자인 산업에 대한 이해와 적응 전략을 평가해보세요.",
      },
    ],
  },
  marketer: {
    title: "마케터",
    questions: [
      {
        id: "mar1",
        question: "AI를 활용하여 마케팅 콘텐츠를 생성하고 최적화할 수 있다",
        description: "AI 콘텐츠 생성 도구를 마케팅에 활용하는 능력을 평가해보세요.",
      },
      {
        id: "mar2",
        question: "AI 기반 데이터 분석을 통해 마케팅 인사이트를 도출할 수 있다",
        description: "AI를 활용한 마케팅 데이터 분석 능력을 평가해보세요.",
      },
      {
        id: "mar3",
        question: "AI를 활용하여 고객 세그먼테이션과 타겟팅을 수행할 수 있다",
        description: "AI 기반 고객 분석 및 세그먼테이션 능력을 평가해보세요.",
      },
      {
        id: "mar4",
        question: "AI 마케팅 자동화 도구를 효과적으로 활용할 수 있다",
        description: "AI 기반 마케팅 자동화 도구 활용 능력을 평가해보세요.",
      },
      {
        id: "mar5",
        question: "AI가 마케팅 전략과 실행에 미치는 영향을 이해하고 있다",
        description: "AI가 마케팅 분야에 미치는 영향에 대한 이해도를 평가해보세요.",
      },
    ],
  },
  manager: {
    title: "매니저/리더",
    questions: [
      {
        id: "man1",
        question: "AI 도구를 팀 워크플로우에 효과적으로 통합할 수 있다",
        description: "팀 업무에 AI 도구를 도입하고 통합하는 능력을 평가해보세요.",
      },
      {
        id: "man2",
        question: "AI를 활용한 의사결정 지원 시스템을 이해하고 활용할 수 있다",
        description: "AI 기반 의사결정 지원 도구 활용 능력을 평가해보세요.",
      },
      {
        id: "man3",
        question: "팀원들의 AI 역량 개발을 지원하고 코칭할 수 있다",
        description: "팀원들의 AI 활용 능력 향상을 지원하는 능력을 평가해보세요.",
      },
      {
        id: "man4",
        question: "AI 도입에 따른 조직 변화를 효과적으로 관리할 수 있다",
        description: "AI 도입에 따른 변화 관리 능력을 평가해보세요.",
      },
      {
        id: "man5",
        question: "AI 활용에 관한 조직의 윤리적 가이드라인을 수립할 수 있다",
        description: "AI 윤리 가이드라인 수립 능력을 평가해보세요.",
      },
    ],
  },
}

// 산업별 특화 질문 세트
export const industrySpecificQuestions = {
  healthcare: {
    title: "헬스케어",
    questions: [
      {
        id: "hc1",
        question: "AI가 헬스케어 산업에 미치는 영향을 이해하고 있다",
        description: "AI가 의료 진단, 치료, 연구 등에 미치는 영향에 대한 이해도를 평가해보세요.",
      },
      {
        id: "hc2",
        question: "의료 데이터의 특수성과 AI 활용 시 고려사항을 이해하고 있다",
        description: "의료 데이터의 민감성과 AI 활용 시 윤리적, 법적 고려사항에 대한 이해도를 평가해보세요.",
      },
      {
        id: "hc3",
        question: "AI 기반 의료 진단 및 의사결정 지원 시스템의 한계를 이해하고 있다",
        description: "AI 의료 시스템의 한계와 인간 의료진의 역할에 대한 이해도를 평가해보세요.",
      },
      {
        id: "hc4",
        question: "환자 케어에 AI를 윤리적으로 통합하는 방법을 이해하고 있다",
        description: "환자 케어에 AI를 도입할 때의 윤리적 고려사항에 대한 이해도를 평가해보세요.",
      },
      {
        id: "hc5",
        question: "AI 헬스케어 솔루션의 규제 및 인증 요구사항을 이해하고 있다",
        description: "의료 AI 솔루션의 규제 환경과 인증 요구사항에 대한 이해도를 평가해보세요.",
      },
    ],
  },
  finance: {
    title: "금융",
    questions: [
      {
        id: "fin1",
        question: "AI가 금융 서비스 및 상품에 미치는 영향을 이해하고 있다",
        description: "AI가 금융 산업에 미치는 영향과 변화에 대한 이해도를 평가해보세요.",
      },
      {
        id: "fin2",
        question: "AI 기반 금융 분석 및 예측 도구를 활용할 수 있다",
        description: "AI 금융 분석 도구 활용 능력을 평가해보세요.",
      },
      {
        id: "fin3",
        question: "금융 데이터 활용 시 개인정보 보호와 규제 준수의 중요성을 이해하고 있다",
        description: "금융 데이터의 민감성과 규제 환경에 대한 이해도를 평가해보세요.",
      },
      {
        id: "fin4",
        question: "AI 기반 금융 사기 탐지 및 리스크 관리 시스템을 이해하고 있다",
        description: "AI 금융 보안 및 리스크 관리에 대한 이해도를 평가해보세요.",
      },
      {
        id: "fin5",
        question: "AI가 금융 포용성과 접근성에 미치는 영향을 이해하고 있다",
        description: "AI가 금융 서비스의 포용성과 접근성에 미치는 영향에 대한 이해도를 평가해보세요.",
      },
    ],
  },
  education: {
    title: "교육",
    questions: [
      {
        id: "edu1",
        question: "AI 기반 학습 도구와 플랫폼을 교육에 통합할 수 있다",
        description: "교육 환경에 AI 도구를 도입하고 활용하는 능력을 평가해보세요.",
      },
      {
        id: "edu2",
        question: "AI를 활용한 개인화 학습 경험을 설계할 수 있다",
        description: "AI를 통한 학습자 맞춤형 교육 설계 능력을 평가해보세요.",
      },
      {
        id: "edu3",
        question: "AI 시대에 필요한 디지털 리터러시와 AI 리터러시를 가르칠 수 있다",
        description: "학생들에게 AI 관련 역량을 교육하는 능력을 평가해보세요.",
      },
      {
        id: "edu4",
        question: "AI 활용 시 학생 데이터 보호와 윤리적 고려사항을 이해하고 있다",
        description: "교육 환경에서 AI 활용 시 윤리적 측면에 대한 이해도를 평가해보세요.",
      },
      {
        id: "edu5",
        question: "AI가 교육자의 역할과 교육 방법론에 미치는 영향을 이해하고 있다",
        description: "AI 시대의 교육자 역할 변화에 대한 이해도를 평가해보세요.",
      },
    ],
  },
}

interface RealityCheckQuestionsProps {
  activeCategory: string
  currentQuestion: number
  answers: Record<string, number>
  onAnswer: (value: string) => void
  questionMode: string
  jobType: string
  industryType: string
}

export function RealityCheckQuestions({
  activeCategory,
  currentQuestion,
  answers,
  onAnswer,
  questionMode,
  jobType,
  industryType,
}: RealityCheckQuestionsProps) {
  const [showHelp, setShowHelp] = useState(false)

  // 현재 질문 세트 결정
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

  // 현재 질문이 없는 경우 처리
  if (!currentQuestions[currentCategory] || !currentQuestions[currentCategory][currentQuestion]) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center">
            <p className="text-muted-foreground">해당 카테고리에 질문이 없습니다.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const question = currentQuestions[currentCategory][currentQuestion]

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{question.question}</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setShowHelp(!showHelp)}>
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
        {showHelp && <CardDescription>{question.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <RadioGroup value={answers[question.id]?.toString() || ""} onValueChange={onAnswer} className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">전혀 그렇지 않다</div>
            <div className="text-sm font-medium">매우 그렇다</div>
          </div>
          <div className="flex justify-between gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <div key={value} className="flex flex-col items-center gap-2">
                <RadioGroupItem value={value.toString()} id={`q${question.id}-${value}`} className="h-6 w-6" />
                <Label htmlFor={`q${question.id}-${value}`} className="text-sm">
                  {value}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}

export function QuestionModeSelector({
  questionMode,
  setQuestionMode,
  jobType,
  setJobType,
  industryType,
  setIndustryType,
}) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">진단 모드 선택</CardTitle>
        <CardDescription>진단 목적에 맞는 질문 세트를 선택하세요.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>진단 모드</Label>
          <Tabs value={questionMode} onValueChange={setQuestionMode} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="basic">기본 진단</TabsTrigger>
              <TabsTrigger value="job">직업별 특화</TabsTrigger>
              <TabsTrigger value="industry">산업별 특화</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {questionMode === "job" && (
          <div className="space-y-2">
            <Label>직업 분야</Label>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger>
                <SelectValue placeholder="직업 분야를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(jobSpecificQuestions).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {questionMode === "industry" && (
          <div className="space-y-2">
            <Label>산업 분야</Label>
            <Select value={industryType} onValueChange={setIndustryType}>
              <SelectTrigger>
                <SelectValue placeholder="산업 분야를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(industrySpecificQuestions).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="bg-yellow-50 p-3 rounded-lg flex items-start gap-2">
          <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            {questionMode === "basic"
              ? "기본 진단은 AI 시대 적응을 위한 일반적인 역량을 평가합니다."
              : questionMode === "job"
                ? "직업별 특화 진단은 선택한 직업 분야에서 AI 활용에 필요한 특화된 역량을 평가합니다."
                : "산업별 특화 진단은 선택한 산업 분야에서 AI가 미치는 영향과 필요한 역량을 평가합니다."}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
