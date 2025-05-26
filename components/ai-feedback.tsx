"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, RefreshCw, Send } from "lucide-react"
import { getPersonalizedFeedback } from "@/app/actions/ai-actions"

interface AIFeedbackProps {
  questTitle: string
}

export function AIFeedback({ questTitle }: AIFeedbackProps) {
  const [userInput, setUserInput] = useState("")
  const [feedback, setFeedback] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim() || isLoading) return

    setIsLoading(true)

    try {
      const response = await getPersonalizedFeedback(questTitle, userInput)

      if (response.success) {
        setFeedback(response.content)
        setIsSubmitted(true)
      } else {
        setFeedback("죄송합니다. 피드백을 생성하는 중에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.")
      }
    } catch (error) {
      console.error("Error getting feedback:", error)
      setFeedback("죄송합니다. 피드백을 생성하는 중에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setUserInput("")
    setFeedback("")
    setIsSubmitted(false)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="h-5 w-5 text-teal-600" />
          AI 피드백 받기
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isSubmitted ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              퀘스트를 완료한 후 여러분의 경험, 배운 점, 어려웠던 점 등을 공유해주세요. AI 코치가 맞춤형 피드백을
              제공해드립니다.
            </p>
            <form onSubmit={handleSubmit}>
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="퀘스트를 수행하면서 배운 점, 어려웠던 점, 인사이트 등을 자유롭게 작성해주세요..."
                className="min-h-[120px]"
                disabled={isLoading}
              />
              <Button type="submit" className="mt-4 w-full" disabled={isLoading || !userInput.trim()}>
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> 피드백 생성 중...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> 피드백 요청하기
                  </>
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-teal-50 p-4 rounded-lg">
              <h4 className="font-medium text-teal-800 mb-2">AI 코치 피드백</h4>
              <p className="text-sm whitespace-pre-wrap">{feedback}</p>
            </div>
            <Button variant="outline" onClick={handleReset} className="w-full">
              다시 작성하기
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
