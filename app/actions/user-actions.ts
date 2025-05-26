"use server"

import { createServerClient } from "@/lib/supabase-server"

export async function saveRealityCheckResults(
  userId: string,
  score: number,
  status: string,
  answers: any,
  riskFactors: string[],
  opportunities: string[],
  categoryScores?: any,
  strengths?: string[],
  weaknesses?: string[],
) {
  const supabase = createServerClient()

  try {
    // Ensure user exists in the users table
    await ensureUserExists(userId)

    // Save reality check results
    const { error: resultError } = await supabase.from("reality_check_results").insert({
      user_id: userId,
      score,
      status,
      answers,
      risk_factors: riskFactors,
      opportunities,
      category_scores: categoryScores || null,
      strengths: strengths || null,
      weaknesses: weaknesses || null,
    })

    if (resultError) {
      console.error("Error saving reality check results:", resultError)
      return { success: false, error: resultError.message }
    }

    // Update or insert skills
    const skills = [
      { name: "AI 도구 활용", score: Math.floor(Math.random() * 30) + 50 },
      { name: "창의적 문제 해결", score: Math.floor(Math.random() * 30) + 50 },
      { name: "디지털 역량", score: Math.floor(Math.random() * 30) + 50 },
      { name: "AI 협업", score: Math.floor(Math.random() * 30) + 50 },
    ]

    for (const skill of skills) {
      // Get previous score
      const { data: prevSkill } = await supabase
        .from("skills")
        .select("score")
        .eq("user_id", userId)
        .eq("name", skill.name)
        .single()

      const previousScore = prevSkill?.score

      // Upsert skill
      const { error: skillError } = await supabase.from("skills").upsert({
        user_id: userId,
        name: skill.name,
        score: skill.score,
        previous_score: previousScore,
        updated_at: new Date().toISOString(),
      })

      if (skillError) {
        console.error(`Error upserting skill ${skill.name}:`, skillError)
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in saveRealityCheckResults:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getPreviousRealityCheckResults(userId: string) {
  const supabase = createServerClient()

  try {
    // Ensure user exists in the users table
    await ensureUserExists(userId)

    // Get all reality check results for the user
    const { data, error } = await supabase
      .from("reality_check_results")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching reality check results:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getPreviousRealityCheckResults:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function completeTask(userId: string, taskId: string, taskTitle: string, level: string) {
  const supabase = createServerClient()

  try {
    // Ensure user exists in the users table
    await ensureUserExists(userId)

    const { error } = await supabase.from("completed_tasks").insert({
      user_id: userId,
      task_id: taskId,
      task_title: taskTitle,
      level,
    })

    if (error) {
      console.error("Error completing task:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in completeTask:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function completeQuest(userId: string, questId: string, reflection: string, feedback: string) {
  const supabase = createServerClient()

  try {
    // Ensure user exists in the users table
    await ensureUserExists(userId)

    const { error } = await supabase.from("completed_quests").insert({
      user_id: userId,
      quest_id: questId,
      reflection,
      feedback,
    })

    if (error) {
      console.error("Error completing quest:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in completeQuest:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function generateMonthlyReport(userId: string, month: string, year: number) {
  const supabase = createServerClient()

  try {
    // Ensure user exists in the users table
    await ensureUserExists(userId)

    // Get latest reality check result
    const { data: realityCheckData } = await supabase
      .from("reality_check_results")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    // Get previous month's report for comparison
    const prevMonth = month === "01" ? "12" : String(Number.parseInt(month) - 1).padStart(2, "0")
    const prevYear = month === "01" ? year - 1 : year

    const { data: prevReport } = await supabase
      .from("monthly_reports")
      .select("score")
      .eq("user_id", userId)
      .eq("month", prevMonth)
      .eq("year", prevYear)
      .single()

    // Count completed tasks and quests for the month
    const startDate = new Date(`${year}-${month}-01T00:00:00Z`)
    const nextMonth = Number.parseInt(month) === 12 ? "01" : String(Number.parseInt(month) + 1).padStart(2, "0")
    const nextYear = Number.parseInt(month) === 12 ? year + 1 : year
    const endDate = new Date(`${nextYear}-${nextMonth}-01T00:00:00Z`)

    const { count: tasksCount } = await supabase
      .from("completed_tasks")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .gte("completed_at", startDate.toISOString())
      .lt("completed_at", endDate.toISOString())

    const { count: questsCount } = await supabase
      .from("completed_quests")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .gte("completed_at", startDate.toISOString())
      .lt("completed_at", endDate.toISOString())

    // Generate achievements based on completed tasks and quests
    let achievements = []

    if (tasksCount > 0 || questsCount > 0) {
      // Get some completed tasks for this month
      const { data: completedTasks } = await supabase
        .from("completed_tasks")
        .select("task_title")
        .eq("user_id", userId)
        .gte("completed_at", startDate.toISOString())
        .lt("completed_at", endDate.toISOString())
        .limit(3)

      // Get some completed quests for this month
      const { data: completedQuests } = await supabase
        .from("completed_quests")
        .select("quests(title)")
        .eq("user_id", userId)
        .gte("completed_at", startDate.toISOString())
        .lt("completed_at", endDate.toISOString())
        .limit(3)

      // Add task achievements
      if (completedTasks && completedTasks.length > 0) {
        completedTasks.forEach((task) => {
          achievements.push(`${task.task_title} 태스크 완료`)
        })
      }

      // Add quest achievements
      if (completedQuests && completedQuests.length > 0) {
        completedQuests.forEach((quest) => {
          if (quest.quests && quest.quests.title) {
            achievements.push(`${quest.quests.title} 퀘스트 완료`)
          }
        })
      }
    }

    // If no achievements, add default ones
    if (achievements.length === 0) {
      achievements = [
        "AI 프롬프트 엔지니어링 기술 향상",
        "AI 아트 포트폴리오 퀘스트 완료",
        "AI 활용 업무 생산성 30% 향상",
      ]
    }

    // Generate report
    const { error } = await supabase.from("monthly_reports").upsert({
      user_id: userId,
      month,
      year,
      score: realityCheckData?.score || 75, // 기본값 추가
      previous_score: prevReport?.score || null,
      completed_tasks: tasksCount || 0,
      completed_quests: questsCount || 0,
      status: realityCheckData?.status || "AI 초보자",
      achievements,
      ai_analysis: null,
    })

    if (error) {
      console.error("Error generating monthly report:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in generateMonthlyReport:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// 현재 월에 대한 보고서가 있는지 확인하고 없으면 생성하는 함수
export async function checkAndGenerateMonthlyReport(userId: string) {
  const supabase = createServerClient()

  try {
    // Ensure user exists in the users table
    await ensureUserExists(userId)

    // 사용자 설정 확인 (auto_generate_reports 필드가 없을 수 있으므로 기본값 true 사용)
    let autoGenerateReports = true

    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("auto_generate_reports")
        .eq("id", userId)
        .single()

      if (!userError && userData) {
        // auto_generate_reports 필드가 있으면 해당 값 사용
        autoGenerateReports = userData.auto_generate_reports !== false
      }
    } catch (error) {
      console.log("Error fetching user settings or auto_generate_reports field doesn't exist:", error)
      // 기본값 true 유지
    }

    // 자동 보고서 생성이 비활성화되어 있으면 종료
    if (autoGenerateReports === false) {
      return { success: true, message: "Auto-generate reports is disabled" }
    }

    // 현재 날짜 정보
    const now = new Date()
    const currentMonth = String(now.getMonth() + 1).padStart(2, "0")
    const currentYear = now.getFullYear()

    // 현재 월에 대한 보고서가 있는지 확인
    const { data: existingReport, error: reportError } = await supabase
      .from("monthly_reports")
      .select("id")
      .eq("user_id", userId)
      .eq("month", currentMonth)
      .eq("year", currentYear)
      .single()

    if (reportError && reportError.code !== "PGRST116") {
      console.error("Error checking existing report:", reportError)
      return { success: false, error: reportError.message }
    }

    // 보고서가 없으면 생성
    if (!existingReport) {
      return await generateMonthlyReport(userId, currentMonth, currentYear)
    }

    return { success: true, message: "Report already exists" }
  } catch (error) {
    console.error("Error in checkAndGenerateMonthlyReport:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// 사용자가 users 테이블에 존재하는지 확인하고, 없으면 추가하는 함수
async function ensureUserExists(userId: string) {
  const supabase = createServerClient()

  try {
    // 사용자가 존재하는지 확인
    const { data: existingUser, error: userError } = await supabase.from("users").select("id").eq("id", userId).single()

    // 사용자가 없으면 추가
    if (userError && userError.code === "PGRST116") {
      // 사용자 정보 가져오기 (Supabase Auth에서)
      const { data: authUser } = await supabase.auth.getUser(userId)

      let email = "unknown@example.com"
      let displayName = "사용자"

      if (authUser && authUser.user) {
        email = authUser.user.email || email
        displayName = authUser.user.user_metadata?.full_name || email.split("@")[0]
      }

      // 사용자 추가
      const { error: insertError } = await supabase.from("users").insert({
        id: userId,
        email: email,
        display_name: displayName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        auto_generate_reports: true,
      })

      if (insertError) {
        console.error("Error inserting user:", insertError)
        throw new Error(`Failed to create user: ${insertError.message}`)
      }
    } else if (userError) {
      console.error("Error checking user existence:", userError)
      throw new Error(`Failed to check user existence: ${userError.message}`)
    }

    return true
  } catch (error) {
    console.error("Error in ensureUserExists:", error)
    throw error
  }
}
