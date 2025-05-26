"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, RefreshCw, ExternalLink } from "lucide-react"
import { getPersonalizedRecommendations } from "@/app/actions/ai-actions"

interface AIRecommendationsProps {
  userSkills: { name: string; score: number }[]
  completedQuests: string[]
}

interface Recommendation {
  title: string
  description: string
  resource: string
}

export function AIRecommendations({ userSkills, completedQuests }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchRecommendations = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await getPersonalizedRecommendations(userSkills, completedQuests)

      if (response.success && response.recommendations) {
        setRecommendations(response.recommendations)
      } else {
        setError("추천을 불러오는 중 문제가 발생했습니다.")
        console.error("Error details:", response.error, response.rawContent)
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error)
      setError("추천을 불러오는 중 문제가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-teal-600" />
          AI 맞춤 추천
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 text-teal-600 animate-spin mb-4" />
            <p className="text-muted-foreground">맞춤형 추천을 생성하고 있습니다...</p>
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchRecommendations}>다시 시도</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.length > 0 ? (
              recommendations.map((rec, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                  <div className="mt-3 flex items-center text-sm text-teal-600">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    <span>{rec.resource}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">추천을 불러올 수 없습니다.</p>
                <Button onClick={fetchRecommendations}>다시 시도</Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
