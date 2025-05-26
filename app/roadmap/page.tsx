"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, CheckCircle, Clock, ExternalLink, Lightbulb, Target } from "lucide-react"

// 샘플 로드맵 데이터 (실제로는 사용자의 Reality Check 결과에 따라 동적으로 생성)
const roadmapData = {
  beginner: {
    title: "AI 초보자 로드맵",
    description: "AI 기초 이해와 기본 도구 활용 능력을 키우는 로드맵입니다.",
    steps: [
      {
        id: 1,
        title: "AI 기초 이해하기",
        description: "AI의 기본 개념과 작동 원리를 이해합니다.",
        tasks: [
          { id: "b1-1", title: "AI 기초 개념 학습하기", difficulty: "쉬움", time: "1시간", link: "#" },
          { id: "b1-2", title: "ChatGPT 사용법 익히기", difficulty: "쉬움", time: "30분", link: "#" },
          { id: "b1-3", title: "AI 도구 종류 알아보기", difficulty: "쉬움", time: "1시간", link: "#" },
        ],
      },
      {
        id: 2,
        title: "기본 AI 도구 활용하기",
        description: "일상 업무에 AI 도구를 활용하는 방법을 배웁니다.",
        tasks: [
          { id: "b2-1", title: "ChatGPT로 이메일 작성하기", difficulty: "쉬움", time: "30분", link: "#" },
          { id: "b2-2", title: "Dall-E로 이미지 생성해보기", difficulty: "중간", time: "1시간", link: "#" },
          { id: "b2-3", title: "AI 요약 도구 사용해보기", difficulty: "쉬움", time: "30분", link: "#" },
        ],
      },
      {
        id: 3,
        title: "디지털 역량 강화하기",
        description: "기본적인 디지털 역량을 강화합니다.",
        tasks: [
          { id: "b3-1", title: "온라인 협업 도구 익히기", difficulty: "중간", time: "2시간", link: "#" },
          { id: "b3-2", title: "기초 데이터 분석 배우기", difficulty: "어려움", time: "4시간", link: "#" },
          { id: "b3-3", title: "디지털 정보 검색 능력 향상", difficulty: "쉬움", time: "1시간", link: "#" },
        ],
      },
    ],
  },
  intermediate: {
    title: "AI 탐색자 로드맵",
    description: "AI 도구를 업무에 적용하고 활용 능력을 향상시키는 로드맵입니다.",
    steps: [
      {
        id: 1,
        title: "AI 도구 심화 활용하기",
        description: "다양한 AI 도구를 업무에 적용합니다.",
        tasks: [
          { id: "i1-1", title: "ChatGPT 프롬프트 엔지니어링", difficulty: "중간", time: "2시간", link: "#" },
          { id: "i1-2", title: "Midjourney 고급 기능 활용", difficulty: "어려움", time: "3시간", link: "#" },
          { id: "i1-3", title: "AI 코드 어시스턴트 활용하기", difficulty: "중간", time: "2시간", link: "#" },
        ],
      },
      {
        id: 2,
        title: "업무 자동화 시작하기",
        description: "반복적인 업무를 AI로 자동화합니다.",
        tasks: [
          { id: "i2-1", title: "AI로 데이터 정리 자동화", difficulty: "중간", time: "2시간", link: "#" },
          { id: "i2-2", title: "AI 문서 요약 시스템 구축", difficulty: "어려움", time: "3시간", link: "#" },
          { id: "i2-3", title: "AI 이메일 응답 자동화", difficulty: "중간", time: "2시간", link: "#" },
        ],
      },
      {
        id: 3,
        title: "창의적 문제 해결 능력 키우기",
        description: "AI와 함께 창의적인 문제 해결 방법을 배웁니다.",
        tasks: [
          { id: "i3-1", title: "AI 브레인스토밍 기법 배우기", difficulty: "중간", time: "1시간", link: "#" },
          { id: "i3-2", title: "AI로 아이디어 시각화하기", difficulty: "중간", time: "2시간", link: "#" },
          { id: "i3-3", title: "AI와 협업하여 문제 해결하기", difficulty: "어려움", time: "3시간", link: "#" },
        ],
      },
    ],
  },
  advanced: {
    title: "AI 적응자 로드맵",
    description: "AI를 전문적으로 활용하고 창의적인 결과물을 만드는 로드맵입니다.",
    steps: [
      {
        id: 1,
        title: "AI 전문 활용 능력 개발",
        description: "특정 분야에서 AI를 전문적으로 활용합니다.",
        tasks: [
          { id: "a1-1", title: "분야별 AI 활용 사례 연구", difficulty: "어려움", time: "4시간", link: "#" },
          { id: "a1-2", title: "AI 모델 파인튜닝 이해하기", difficulty: "어려움", time: "5시간", link: "#" },
          { id: "a1-3", title: "AI 윤리와 한계 이해하기", difficulty: "중간", time: "2시간", link: "#" },
        ],
      },
      {
        id: 2,
        title: "AI 협업 시스템 구축",
        description: "팀 내에서 AI 협업 시스템을 구축합니다.",
        tasks: [
          { id: "a2-1", title: "팀 AI 활용 워크플로우 설계", difficulty: "어려움", time: "4시간", link: "#" },
          { id: "a2-2", title: "AI 협업 가이드라인 만들기", difficulty: "중간", time: "3시간", link: "#" },
          { id: "a2-3", title: "AI 도구 통합 환경 구축", difficulty: "어려움", time: "5시간", link: "#" },
        ],
      },
      {
        id: 3,
        title: "AI 활용 창의적 프로젝트",
        description: "AI를 활용한 창의적인 프로젝트를 수행합니다.",
        tasks: [
          { id: "a3-1", title: "AI 활용 개인 브랜딩 프로젝트", difficulty: "중간", time: "6시간", link: "#" },
          { id: "a3-2", title: "AI로 새로운 비즈니스 모델 구상", difficulty: "어려움", time: "8시간", link: "#" },
          { id: "a3-3", title: "AI 활용 포트폴리오 제작", difficulty: "중간", time: "5시간", link: "#" },
        ],
      },
    ],
  },
  expert: {
    title: "AI 선도자 로드맵",
    description: "AI 시대를 선도하고 혁신적인 가치를 창출하는 로드맵입니다.",
    steps: [
      {
        id: 1,
        title: "AI 전략 수립 및 리더십",
        description: "AI 활용 전략을 수립하고 리더십을 발휘합니다.",
        tasks: [
          { id: "e1-1", title: "AI 트렌드 분석 및 예측", difficulty: "어려움", time: "5시간", link: "#" },
          { id: "e1-2", title: "AI 활용 비즈니스 전략 수립", difficulty: "어려움", time: "6시간", link: "#" },
          { id: "e1-3", title: "AI 리더십 역량 개발", difficulty: "중간", time: "4시간", link: "#" },
        ],
      },
      {
        id: 2,
        title: "AI 혁신 프로젝트 주도",
        description: "AI를 활용한 혁신적인 프로젝트를 주도합니다.",
        tasks: [
          { id: "e2-1", title: "AI 기반 혁신 아이디어 발굴", difficulty: "어려움", time: "5시간", link: "#" },
          { id: "e2-2", title: "AI 프로젝트 기획 및 실행", difficulty: "어려움", time: "10시간", link: "#" },
          { id: "e2-3", title: "AI 프로젝트 성과 측정 및 개선", difficulty: "중간", time: "4시간", link: "#" },
        ],
      },
      {
        id: 3,
        title: "AI 지식 공유 및 멘토링",
        description: "AI 지식을 공유하고 다른 사람들을 멘토링합니다.",
        tasks: [
          { id: "e3-1", title: "AI 활용 사례 연구 발표", difficulty: "중간", time: "6시간", link: "#" },
          { id: "e3-2", title: "AI 멘토링 프로그램 개발", difficulty: "어려움", time: "8시간", link: "#" },
          { id: "e3-3", title: "AI 커뮤니티 구축 및 참여", difficulty: "중간", time: "온고잉", link: "#" },
        ],
      },
    ],
  },
}

export default function Roadmap() {
  const [activeLevel, setActiveLevel] = useState("beginner")
  const [completedTasks, setCompletedTasks] = useState({})

  const toggleTaskCompletion = (taskId) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }))
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
        <h1 className="text-3xl font-bold tracking-tighter">Action Roadmap</h1>
        <p className="text-muted-foreground mt-2">AI 시대에 적응하고 성장하기 위한 맞춤형 로드맵입니다.</p>
      </div>

      <Tabs defaultValue="beginner" value={activeLevel} onValueChange={setActiveLevel} className="mb-8">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="beginner">초보자</TabsTrigger>
          <TabsTrigger value="intermediate">탐색자</TabsTrigger>
          <TabsTrigger value="advanced">적응자</TabsTrigger>
          <TabsTrigger value="expert">선도자</TabsTrigger>
        </TabsList>

        {Object.keys(roadmapData).map((level) => (
          <TabsContent key={level} value={level} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">{roadmapData[level].title}</h2>
              <p className="text-muted-foreground">{roadmapData[level].description}</p>
            </div>

            {roadmapData[level].steps.map((step) => (
              <Card key={step.id} className="mb-6">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="bg-teal-100 text-teal-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                      {step.id}
                    </div>
                    <div>
                      <CardTitle>{step.title}</CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {step.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-4 border rounded-lg flex items-start gap-3 ${
                          completedTasks[task.id] ? "bg-gray-50 border-gray-200" : "bg-white"
                        }`}
                      >
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          className={`flex-shrink-0 w-6 h-6 rounded-full border ${
                            completedTasks[task.id]
                              ? "bg-teal-500 border-teal-500 flex items-center justify-center"
                              : "border-gray-300"
                          }`}
                        >
                          {completedTasks[task.id] && <CheckCircle className="h-5 w-5 text-white" />}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4
                              className={`font-medium ${completedTasks[task.id] ? "line-through text-gray-500" : ""}`}
                            >
                              {task.title}
                            </h4>
                            <Link href={task.link} className="text-teal-600 hover:text-teal-700">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className={getDifficultyColor(task.difficulty)}>
                              <Target className="h-3 w-3 mr-1" />
                              {task.difficulty}
                            </Badge>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              <Clock className="h-3 w-3 mr-1" />
                              {task.time}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => {
                  const levels = Object.keys(roadmapData)
                  const currentIndex = levels.indexOf(activeLevel)
                  if (currentIndex > 0) {
                    setActiveLevel(levels[currentIndex - 1])
                  }
                }}
                disabled={activeLevel === "beginner"}
              >
                이전 단계
              </Button>
              <Link href="/quests">
                <Button>
                  성장 퀘스트 보기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  const levels = Object.keys(roadmapData)
                  const currentIndex = levels.indexOf(activeLevel)
                  if (currentIndex < levels.length - 1) {
                    setActiveLevel(levels[currentIndex + 1])
                  }
                }}
                disabled={activeLevel === "expert"}
              >
                다음 단계
              </Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
        <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-yellow-800">AI 시대 적응 팁</h4>
          <p className="text-sm text-yellow-700 mt-1">
            로드맵의 모든 단계를 한 번에 완료하려고 하지 마세요. 매일 조금씩 꾸준히 실천하는 것이 중요합니다. 완료한
            태스크는 체크하여 진행 상황을 추적하고, 월간 보고서에서 성장 과정을 확인할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}
