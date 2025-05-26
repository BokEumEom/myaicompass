"use server"

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export type GeminiResponse = {
  success: boolean
  content: string
  error?: string
}

export async function generateGeminiResponse(prompt: string): Promise<GeminiResponse> {
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not defined")
    return {
      success: false,
      content: "",
      error: "API key is not configured",
    }
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Gemini API error:", errorData)
      return {
        success: false,
        content: "",
        error: `API error: ${response.status} ${response.statusText}`,
      }
    }

    const data = await response.json()

    // Extract the text from the response
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

    return {
      success: true,
      content,
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    return {
      success: false,
      content: "",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
