import { supabase } from "./supabase"

type LogLevel = "info" | "warn" | "error" | "debug"

interface AuthLogEvent {
  event: string
  userId?: string
  email?: string
  timestamp: string
  details?: any
  level: LogLevel
}

const logs: AuthLogEvent[] = []
const MAX_LOGS = 100

export const authLogger = {
  log(level: LogLevel, event: string, details?: any) {
    const logEvent: AuthLogEvent = {
      event,
      timestamp: new Date().toISOString(),
      details,
      level,
    }

    // Add user info if available
    try {
      const { data } = supabase.auth.getSession()
      if (data.session?.user) {
        logEvent.userId = data.session.user.id
        logEvent.email = data.session.user.email
      }
    } catch (e) {
      // Ignore errors when getting session
    }

    // Add to in-memory logs
    logs.unshift(logEvent)
    if (logs.length > MAX_LOGS) logs.pop()

    // Console log
    console[level](`[Auth] ${event}`, details)

    // In production, you could send this to a logging service
    if (process.env.NODE_ENV === "production" && (level === "error" || level === "warn")) {
      // Send to your logging service
      // Example: sendToLogService(logEvent)
    }
  },

  info(event: string, details?: any) {
    this.log("info", event, details)
  },

  warn(event: string, details?: any) {
    this.log("warn", event, details)
  },

  error(event: string, details?: any) {
    this.log("error", event, details)
  },

  debug(event: string, details?: any) {
    if (process.env.NODE_ENV !== "production") {
      this.log("debug", event, details)
    }
  },

  getRecentLogs() {
    return [...logs]
  },
}
