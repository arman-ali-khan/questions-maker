import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      question_papers: {
        Row: {
          id: string
          user_id: string
          title: string
          page_size: string
          margins: {
            top: number
            right: number
            bottom: number
            left: number
          }
          header_info: {
            school_name: string
            school_address: string
            exam_name: string
            subject: string
            date: string
            time: string
            marks: string
          }
          language_direction: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          page_size?: string
          margins?: {
            top: number
            right: number
            bottom: number
            left: number
          }
          header_info?: {
            school_name: string
            school_address: string
            exam_name: string
            subject: string
            date: string
            time: string
            marks: string
          }
          language_direction?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          page_size?: string
          margins?: {
            top: number
            right: number
            bottom: number
            left: number
          }
          header_info?: {
            school_name: string
            school_address: string
            exam_name: string
            subject: string
            date: string
            time: string
            marks: string
          }
          language_direction?: string
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          paper_id: string
          type: string
          question_text: string
          options: string[] | null
          correct_answer: string | null
          marks: number
          columns: number
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          paper_id: string
          type: string
          question_text: string
          options?: string[] | null
          correct_answer?: string | null
          marks?: number
          columns?: number
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          paper_id?: string
          type?: string
          question_text?: string
          options?: string[] | null
          correct_answer?: string | null
          marks?: number
          columns?: number
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}