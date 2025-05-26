"use server"

import { generateGeminiResponse } from "@/lib/gemini-api"

export async function getPersonalizedFeedback(questTitle: string, userInput: string) {
  const prompt = `
    당신은 사람들이 AI 시대에 적응하도록 돕는 AI 코치입니다.
    사용자가 "${questTitle}" 퀘스트를 완료하고 다음과 같은 성찰을 제출했습니다:
    
    "${userInput}"
    
    다음 요소를 포함하는 건설적인 피드백(약 100-150단어)을 한국어로 제공해주세요:
    1. 사용자의 구체적인 노력과 인사이트를 인정합니다
    2. 이해나 적용을 더 깊게 할 수 있는 1-2가지 구체적인 방법을 제안합니다
    3. 사용자의 작업을 더 넓은 AI 적응 기술과 연결합니다
    4. 격려하는 메시지로 마무리합니다
    
    "피드백입니다"와 같은 소개 문구 없이 단락 형식으로 응답해주세요.
  `

  return generateGeminiResponse(prompt)
}

export async function getPersonalizedRecommendations(
  userSkills: { name: string; score: number }[],
  completedQuests: string[],
) {
  const skillsText = userSkills.map((skill) => `${skill.name}: ${skill.score}/100`).join("\n")
  const completedQuestsText = completedQuests.length > 0 ? completedQuests.join("\n") : "아직 없음"

  const prompt = `
    당신은 사람들이 AI 시대에 적응하도록 돕는 AI 코치입니다.
    사용자의 현재 기술과 완료한 퀘스트를 기반으로 3가지 개인 맞춤형 다음 단계를 한국어로 제안해주세요.
    
    사용자의 현재 기술:
    ${skillsText}
    
    완료한 퀘스트:
    ${completedQuestsText}
    
    각 추천에 대해:
    1. 구체적이고 실행 가능한 제목(5-7단어)을 제공합니다
    2. 이것이 사용자에게 어떤 도움이 될지 간략하게 설명합니다(15-20단어)
    3. 특정 리소스나 접근 방식을 제안합니다
    
    다음 구조의 JSON으로 응답을 포맷해주세요:
    [
      {
        "title": "추천 제목",
        "description": "추천에 대한 간략한 설명",
        "resource": "특정 리소스나 접근 방식 제안"
      },
      ...
    ]
    
    JSON만 반환하고 추가 텍스트나 마크다운 코드 블록(\`\`\`)은 포함하지 마세요.
  `

  const response = await generateGeminiResponse(prompt)

  if (response.success) {
    try {
      // Extract JSON from the response, handling potential markdown formatting
      let jsonStr = response.content.trim()

      // Check if the response is wrapped in markdown code blocks
      const jsonBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonBlockMatch && jsonBlockMatch[1]) {
        // Extract just the JSON part
        jsonStr = jsonBlockMatch[1].trim()
      }

      // Parse the JSON
      const recommendations = JSON.parse(jsonStr)
      return { success: true, recommendations }
    } catch (error) {
      console.error("Error parsing recommendations JSON:", error, "Raw content:", response.content)
      return {
        success: false,
        error: "추천 사항을 파싱하는데 실패했습니다",
        rawContent: response.content,
      }
    }
  }

  return { success: false, error: response.error || "추천 사항을 생성하는데 실패했습니다" }
}

export async function getAIInsight(topic: string) {
  const prompt = `
    당신은 AI 적응과 미래 기술에 대한 인사이트를 제공하는 AI 전문가입니다.
    다음 주제에 대한 간결하고 사려 깊은 인사이트(약 80-120단어)를 한국어로 제공해주세요:
    
    "${topic}"
    
    당신의 인사이트는 다음을 포함해야 합니다:
    1. 실용적이고 실행 가능한 내용
    2. 구체적인 예시나 적용 사례
    3. 사람들이 AI 시대에 더 잘 적응할 수 있는 방법과의 연관성
    4. 생각을 자극하는 질문이나 성찰 포인트로 마무리
    
    대화체로 격려하는 톤으로 작성해주세요. "제 인사이트는"과 같은 소개 문구는 사용하지 마세요.
  `

  return generateGeminiResponse(prompt)
}

export async function analyzeUserProgress(
  previousScore: number,
  currentScore: number,
  strengths: string[],
  weaknesses: string[],
) {
  const strengthsText = strengths.join(", ")
  const weaknessesText = weaknesses.join(", ")

  const prompt = `
    당신은 사람들이 AI 시대에 적응하도록 돕는 AI 코치입니다.
    사용자의 AI 시대 적응 진행 상황을 분석하고 개인 맞춤형 인사이트를 한국어로 제공해주세요.
    
    이전 평가 점수: ${previousScore}/100
    현재 평가 점수: ${currentScore}/100
    
    강점: ${strengthsText}
    개선 영역: ${weaknessesText}
    
    다음을 제공해주세요:
    1. 진행 상황에 대한 간략한 분석(2-3문장)
    2. 강점에 대한 구체적인 인사이트(1-2문장)
    3. 개선 영역에 기반한 실행 가능한 추천 사항(1-2문장)
    4. 격려하는 결론(1문장)
    
    소개 문구 없이 단락 형식으로 응답해주세요.
  `

  return generateGeminiResponse(prompt)
}
