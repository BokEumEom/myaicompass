"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Brain, Clock, Lightbulb, MessageSquare, Palette, Star, Trophy } from "lucide-react"
import { AIFeedback } from "@/components/ai-feedback"

// 샘플 퀘스트 데이터
const questsData = {
  insight: {
    title: "나만의 인사이트 발굴",
    description: "AI 시대에 나만의 관점과 인사이트를 발굴하는 퀘스트입니다.",
    quests: [
      {
        id: "insight-1",
        title: "주간 업계 뉴스 분석",
        description: "일주일에 한 번, 업계 뉴스를 요약하고 나만의 의견을 작성해보세요.",
        difficulty: "중간",
        time: "1시간/주",
        reward: "인사이트 포인트 +10",
        steps: [
          "AI로 최신 업계 뉴스 5개를 요약합니다.",
          "각 뉴스에 대한 나만의 의견을 작성합니다.",
          "AI에게 피드백을 요청합니다.",
          "인사이트를 정리하여 기록합니다.",
        ],
      },
      {
        id: "insight-2",
        title: "트렌드 예측 저널",
        description: "AI 시대의 트렌드를 예측하고 저널 형식으로 기록해보세요.",
        difficulty: "어려움",
        time: "2시간/월",
        reward: "인사이트 포인트 +20",
        steps: [
          "현재 트렌드를 AI로 분석합니다.",
          "향후 6개월 내 예상되는 변화를 예측합니다.",
          "나의 분야에 미칠 영향을 분석합니다.",
          "저널 형식으로 정리하여 공유합니다.",
        ],
      },
      {
        id: "insight-3",
        title: "AI 활용 사례 연구",
        description: "다양한 분야의 AI 활용 사례를 연구하고 인사이트를 도출해보세요.",
        difficulty: "중간",
        time: "3시간",
        reward: "인사이트 포인트 +15",
        steps: [
          "관심 분야의 AI 활용 사례 3개를 조사합니다.",
          "각 사례의 성공 요인을 분석합니다.",
          "나의 분야에 적용할 수 있는 방법을 고민합니다.",
          "인사이트를 정리하여 공유합니다.",
        ],
      },
    ],
  },
  collaboration: {
    title: "AI와 협업하기",
    description: "AI를 효과적인 협업 파트너로 활용하는 방법을 배우는 퀘스트입니다.",
    quests: [
      {
        id: "collab-1",
        title: "ChatGPT 업무 도우미 만들기",
        description: "자신의 업무에 맞는 ChatGPT 프롬프트 템플릿을 만들어보세요.",
        difficulty: "쉬움",
        time: "2시간",
        reward: "협업 포인트 +10",
        steps: [
          "자주 하는 업무 3가지를 리스트업합니다.",
          "각 업무에 맞는 프롬프트 템플릿을 작성합니다.",
          "템플릿을 테스트하고 개선합니다.",
          "최종 템플릿을 저장하고 활용합니다.",
        ],
      },
      {
        id: "collab-2",
        title: "AI 브레인스토밍 세션",
        description: "AI와 함께 창의적인 브레인스토밍 세션을 진행해보세요.",
        difficulty: "중간",
        time: "1.5시간",
        reward: "협업 포인트 +15",
        steps: [
          "해결하고 싶은 문제를 정의합니다.",
          "AI에게 다양한 관점에서 아이디어를 요청합니다.",
          "AI의 아이디어를 바탕으로 나만의 아이디어를 발전시킵니다.",
          "최종 아이디어를 정리하고 실행 계획을 세웁니다.",
        ],
      },
      {
        id: "collab-3",
        title: "AI 피드백 시스템 구축",
        description: "자신의 작업물에 대한 AI 피드백 시스템을 구축해보세요.",
        difficulty: "어려움",
        time: "3시간",
        reward: "협업 포인트 +20",
        steps: [
          "피드백이 필요한 작업 영역을 정의합니다.",
          "각 영역에 맞는 피드백 프롬프트를 작성합니다.",
          "피드백 시스템을 테스트하고 개선합니다.",
          "정기적인 피드백 루틴을 설정합니다.",
        ],
      },
    ],
  },
  creativity: {
    title: "창의력 확장",
    description: "AI를 활용하여 창의적인 결과물을 만드는 퀘스트입니다.",
    quests: [
      {
        id: "creative-1",
        title: "AI 이미지 생성 프로젝트",
        description: "Midjourney나 DALL·E를 활용하여 나만의 브랜드 이미지를 만들어보세요.",
        difficulty: "중간",
        time: "2시간",
        reward: "창의력 포인트 +15",
        steps: [
          "브랜드 컨셉과 스타일을 정의합니다.",
          "다양한 프롬프트로 이미지를 생성합니다.",
          "생성된 이미지를 평가하고 개선합니다.",
          "최종 이미지를 선택하고 활용 계획을 세웁니다.",
        ],
      },
      {
        id: "creative-2",
        title: "AI 스토리텔링 워크숍",
        description: "AI와 함께 창의적인 스토리를 만들어보세요.",
        difficulty: "쉬움",
        time: "1.5시간",
        reward: "창의력 포인트 +10",
        steps: [
          "스토리의 주제와 핵심 메시지를 정합니다.",
          "AI에게 스토리 구조와 아이디어를 요청합니다.",
          "AI의 제안을 바탕으로 나만의 스토리를 발전시킵니다.",
          "최종 스토리를 정리하고 공유합니다.",
        ],
      },
      {
        id: "creative-3",
        title: "AI 아트 포트폴리오",
        description: "AI 도구를 활용하여 창의적인 아트 포트폴리오를 만들어보세요.",
        difficulty: "어려움",
        time: "4시간",
        reward: "창의력 포인트 +20",
        steps: [
          "포트폴리오 컨셉과 테마를 정합니다.",
          "다양한 AI 도구로 작품을 생성합니다.",
          "작품에 나만의 스타일을 가미합니다.",
          "포트폴리오로 구성하여 공유합니다.",
        ],
      },
    ],
  },
  reflection: {
    title: "스토리 기반 회고",
    description: "자신의 경험과 성장을 스토리로 정리하고 공유하는 퀘스트입니다.",
    quests: [
      {
        id: "reflect-1",
        title: "AI 시대 나의 여정",
        description: "AI 시대에 적응하며 겪은 나의 여정을 스토리로 정리해보세요.",
        difficulty: "중간",
        time: "2시간",
        reward: "회고 포인트 +15",
        steps: [
          "AI와의 첫 만남부터 현재까지의 경험을 정리합니다.",
          "주요 전환점과 배움의 순간을 식별합니다.",
          "AI의 도움을 받아 스토리 구조를 완성합니다.",
          "최종 스토리를 정리하고 공유합니다.",
        ],
      },
      {
        id: "reflect-2",
        title: "미래 자아에게 보내는 편지",
        description: "AI 시대에 성장한 미래의 자신에게 편지를 써보세요.",
        difficulty: "쉬움",
        time: "1시간",
        reward: "회고 포인트 +10",
        steps: [
          "현재의 목표와 도전을 정리합니다.",
          "미래에 달성하고 싶은 성장을 구체화합니다.",
          "AI의 도움을 받아 편지 초안을 작성합니다.",
          "최종 편지를 완성하고 저장합니다.",
        ],
      },
      {
        id: "reflect-3",
        title: "AI 시대 커리어 스토리맵",
        description: "AI 시대에 맞춘 나의 커리어 스토리맵을 만들어보세요.",
        difficulty: "어려움",
        time: "3시간",
        reward: "회고 포인트 +20",
        steps: [
          "과거의 커리어 경로를 정리합니다.",
          "현재의 강점과 개발 영역을 분석합니다.",
          "AI 시대에 맞는 미래 커리어 방향을 설정합니다.",
          "시각적 스토리맵으로 정리하고 공유합니다.",
        ],
      },
    ],
  },
}

export default function Quests() {
  const [activeCategory, setActiveCategory] = useState("insight")
  const [selectedQuest, setSelectedQuest] = useState(null)

  const handleQuestSelect = (quest) => {
    setSelectedQuest(quest)
  }

  const handleBackToList = () => {
    setSelectedQuest(null)
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case "insight":
        return <Lightbulb className="h-5 w-5" />
      case "collaboration":
        return <MessageSquare className="h-5 w-5" />
      case "creativity":
        return <Palette className="h-5 w-5" />
      case "reflection":
        return <Brain className="h-5 w-5" />
      default:
        return <Lightbulb className="h-5 w-5" />
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "쉬움":
        return "bg-green-100 text-green-800"
      case "중간":
        return "bg-yellow-100 text-yellow-800"
      case "어려움":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container max-w-4xl py-12">
      <Link href="/" className="flex items-center text-sm text-muted-foreground mb-8 hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        홈으로 돌아가기
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tighter">Creative Growth Quest</h1>
        <p className="text-muted-foreground mt-2">AI 시대에 나만의 창의적 성장을 위한 퀘스트를 수행해보세요.</p>
      </div>

      {!selectedQuest ? (
        <>
          <Tabs defaultValue="insight" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="insight" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <span className="hidden sm:inline">인사이트 발굴</span>
                <span className="sm:hidden">인사이트</span>
              </TabsTrigger>
              <TabsTrigger value="collaboration" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">AI와 협업</span>
                <span className="sm:hidden">협업</span>
              </TabsTrigger>
              <TabsTrigger value="creativity" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">창의력 확장</span>
                <span className="sm:hidden">창의력</span>
              </TabsTrigger>
              <TabsTrigger value="reflection" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">스토리 회고</span>
                <span className="sm:hidden">회고</span>
              </TabsTrigger>
            </TabsList>

            {Object.keys(questsData).map((category) => (
              <TabsContent key={category} value={category} className="space-y-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center p-2 bg-teal-50 rounded-full mb-2">
                    {getCategoryIcon(category)}
                  </div>
                  <h2 className="text-2xl font-bold">{questsData[category].title}</h2>
                  <p className="text-muted-foreground">{questsData[category].description}</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {questsData[category].quests.map((quest) => (
                    <Card
                      key={quest.id}
                      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleQuestSelect(quest)}
                    >
                      <div className="h-2 bg-teal-500" />
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{quest.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{quest.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className={getDifficultyColor(quest.difficulty)}>
                            <Star className="h-3 w-3 mr-1" />
                            {quest.difficulty}
                          </Badge>
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            <Clock className="h-3 w-3 mr-1" />
                            {quest.time}
                          </Badge>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-50 border-t">
                        <div className="flex items-center text-sm text-teal-600">
                          <Trophy className="h-4 w-4 mr-1" />
                          {quest.reward}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="flex justify-between mt-8">
            <Link href="/roadmap">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                로드맵으로 돌아가기
              </Button>
            </Link>
            <Link href="/reports">
              <Button>
                월간 보고서 보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <div>
          <Button variant="ghost" onClick={handleBackToList} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            퀘스트 목록으로 돌아가기
          </Button>

          <Card>
            <div className="h-2 bg-teal-500" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{selectedQuest.title}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline" className={getDifficultyColor(selectedQuest.difficulty)}>
                    <Star className="h-3 w-3 mr-1" />
                    {selectedQuest.difficulty}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    <Clock className="h-3 w-3 mr-1" />
                    {selectedQuest.time}
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-base mt-2">{selectedQuest.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">퀘스트 단계</h3>
                <div className="space-y-4">
                  {selectedQuest.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-medium text-sm">
                        {index + 1}
                      </div>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">퀘스트 팁</h3>
                <p className="text-sm text-yellow-700">
                  이 퀘스트를 완료하면 창의적 성장에 큰 도움이 됩니다. 결과물을 포트폴리오에 추가하고 다른 사람들과
                  공유해보세요. AI를 도구로 활용하되, 최종 결정과 창의적 방향은 항상 여러분이 주도해야 합니다.
                </p>
              </div>
            </CardContent>
            {/* Add AI Feedback component */}
            <div className="mt-6">
              <AIFeedback questTitle={selectedQuest.title} />
            </div>
            <CardFooter className="flex flex-col gap-4">
              <div className="w-full flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center text-teal-600">
                  <Trophy className="h-5 w-5 mr-2" />
                  <span className="font-medium">{selectedQuest.reward}</span>
                </div>
                <Button>퀘스트 시작하기</Button>
              </div>
              <Button variant="outline" onClick={handleBackToList} className="w-full">
                다른 퀘스트 보기
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
