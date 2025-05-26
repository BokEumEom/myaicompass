"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Brain } from "lucide-react"
import { getAIInsight } from "@/app/actions/ai-actions"

const insightTopics = [
  "AI 시대에 가장 중요한 인간 고유의 능력",
  "AI와 협업하는 효과적인 방법",
  "AI 시대에 적응하기 위한 마인드셋",
  "AI 도구를 활용한 창의력 향상 방법",
  "AI 시대의 커리어 개발 전략",
]

export function AIInsights() {
  const [insight, setInsight] = useState("")
  const [topic, setTopic] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const fetchRandomInsight = async () => {
    setIsLoading(true)

    // Select a random topic
    const randomTopic = insightTopics[Math.floor(Math.random() * insightTopics.length)]
    setTopic(randomTopic)

    try {
      const response = await getAIInsight(randomTopic)

      if (response.success) {
        setInsight(response.content)
      } else {
        setInsight("인사이트를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.")
      }
    } catch (error) {
      console.error("Error fetching insight:", error)
      setInsight("인사이트를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRandomInsight()
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-teal-600" />
          AI 인사이트
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 text-teal-600 animate-spin mb-4" />
            <p className="text-muted-foreground">인사이트를 생성하고 있습니다...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-teal-50 p-4 rounded-lg">
              <h4 className="font-medium text-teal-800 mb-2">{topic}</h4>
              <p className="text-sm whitespace-pre-wrap">{insight}</p>
            </div>
            <Button variant="outline" onClick={fetchRandomInsight} className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> 생성 중...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" /> 새로운 인사이트
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
