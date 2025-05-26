export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          display_name: string | null
          created_at: string
          updated_at: string
          last_login: string | null
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
      }
      reality_check_results: {
        Row: {
          id: string
          user_id: string
          score: number
          status: string
          created_at: string
          answers: Json
          risk_factors: string[] | null
          opportunities: string[] | null
        }
        Insert: {
          id?: string
          user_id: string
          score: number
          status: string
          created_at?: string
          answers: Json
          risk_factors?: string[] | null
          opportunities?: string[] | null
        }
        Update: {
          id?: string
          user_id?: string
          score?: number
          status?: string
          created_at?: string
          answers?: Json
          risk_factors?: string[] | null
          opportunities?: string[] | null
        }
      }
      skills: {
        Row: {
          id: string
          user_id: string
          name: string
          score: number
          previous_score: number | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          score: number
          previous_score?: number | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          score?: number
          previous_score?: number | null
          updated_at?: string
        }
      }
      completed_tasks: {
        Row: {
          id: string
          user_id: string
          task_id: string
          task_title: string
          level: string
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id: string
          task_title: string
          level: string
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string
          task_title?: string
          level?: string
          completed_at?: string
        }
      }
      quests: {
        Row: {
          id: string
          category: string
          title: string
          description: string
          difficulty: string
          time: string
          reward: string
          steps: Json
        }
        Insert: {
          id: string
          category: string
          title: string
          description: string
          difficulty: string
          time: string
          reward: string
          steps: Json
        }
        Update: {
          id?: string
          category?: string
          title?: string
          description?: string
          difficulty?: string
          time?: string
          reward?: string
          steps?: Json
        }
      }
      completed_quests: {
        Row: {
          id: string
          user_id: string
          quest_id: string
          reflection: string | null
          feedback: string | null
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          quest_id: string
          reflection?: string | null
          feedback?: string | null
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          quest_id?: string
          reflection?: string | null
          feedback?: string | null
          completed_at?: string
        }
      }
      monthly_reports: {
        Row: {
          id: string
          user_id: string
          month: string
          year: number
          score: number
          previous_score: number | null
          completed_tasks: number
          completed_quests: number
          status: string
          achievements: Json
          ai_analysis: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          month: string
          year: number
          score: number
          previous_score?: number | null
          completed_tasks: number
          completed_quests: number
          status: string
          achievements: Json
          ai_analysis?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          month?: string
          year?: number
          score?: number
          previous_score?: number | null
          completed_tasks?: number
          completed_quests?: number
          status?: string
          achievements?: Json
          ai_analysis?: string | null
          created_at?: string
        }
      }
    }
  }
}
