export interface Question {
  id: string
  type: 'mcq' | 'written'
  question_text: string
  options?: string[]
  correct_answer?: string
  marks: number
  order_index: number
  columns?: number // New field for MCQ column layout
}

export interface HeaderInfo {
  school_name: string
  school_address: string
  exam_name: string
  subject: string
  date: string
  time: string
  marks: string
}

export interface PageSettings {
  page_size: string
  margins: {
    top: number
    right: number
    bottom: number
    left: number
  }
  language_direction: string
}