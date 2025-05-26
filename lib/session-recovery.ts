import { supabase } from "./supabase"
import { authLogger } from "./auth-logger"

export async function attemptSessionRecovery() {
  try {
    authLogger.info("Attempting session recovery")

    // Check if we have a session
    const { data: sessionData } = await supabase.auth.getSession()

    if (!sessionData.session) {
      authLogger.info("No session to recover")
      return false
    }

    // Try to refresh the session
    const { data, error } = await supabase.auth.refreshSession()

    if (error) {
      authLogger.error("Session refresh failed", { error })
      // Clear the invalid session
      await supabase.auth.signOut({ scope: "local" })
      return false
    }

    if (data.session) {
      authLogger.info("Session recovered successfully")
      return true
    }

    return false
  } catch (err) {
    authLogger.error("Session recovery error", { error: err })
    return false
  }
}
