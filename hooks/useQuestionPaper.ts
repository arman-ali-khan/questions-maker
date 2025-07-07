'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { Question, HeaderInfo, PageSettings } from '@/types/question-paper'

export function useQuestionPaper() {
  const [user, setUser] = useState<any>(null)
  const [paperId, setPaperId] = useState<string>('')
  const [title, setTitle] = useState('Untitled Question Paper')
  const [headerInfo, setHeaderInfo] = useState<HeaderInfo>({
    school_name: '',
    school_address: '',
    exam_name: '',
    subject: '',
    date: '',
    time: '',
    marks: '',
    instructions: [
      'সব প্রশ্নের উত্তর দিতে হবে',
      'স্পষ্ট ও সুন্দর হাতের লেখায় লিখতে হবে',
      'প্রয়োজনে আলাদা উত্তরপত্র ব্যবহার করতে হবে',
      'প্রতিটি প্রশ্ন মনোযোগ দিয়ে পড়ে উত্তর দিতে হবে'
    ],
    instructionType: 'list',
    oneLineInstruction: ''
  })
  const [pageSettings, setPageSettings] = useState<PageSettings>({
    page_size: 'A4',
    margins: { top: 25, right: 25, bottom: 25, left: 25 },
    language_direction: 'ltr',
  })
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      createNewPaper()
    }
  }, [user])

  const checkUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      router.push('/auth/login')
      return
    }
    setUser(user)
  }

  const createNewPaper = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('question_papers')
        .insert([{
          user_id: user.id,
          title,
          page_size: pageSettings.page_size,
          margins: pageSettings.margins,
          header_info: headerInfo,
          language_direction: pageSettings.language_direction,
        }])
        .select()

      if (error) throw error
      if (data) {
        setPaperId(data[0].id)
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to create question paper',
        variant: 'destructive',
      })
    }
  }

  const addMCQQuestion = () => {
    const newQuestion: Question = {
      id: `mcq_${Date.now()}`,
      type: 'mcq',
      question_text: '',
      options: ['', '', '', ''],
      correct_answer: '',
      marks: 1,
      order_index: questions.length,
      columns: 1, // Default to 1 column
      lineHeight: 'relaxed', // Default line height
    }
    setQuestions([...questions, newQuestion])
  }

  const addWrittenQuestion = () => {
    const newQuestion: Question = {
      id: `written_${Date.now()}`,
      type: 'written',
      question_text: '',
      marks: 10,
      order_index: questions.length,
      lineHeight: 'relaxed', // Default line height
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ))
  }

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(questions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const updatedQuestions = items.map((item, index) => ({
      ...item,
      order_index: index,
    }))

    setQuestions(updatedQuestions)
  }

  const savePaper = async () => {
    if (!paperId || !user) return

    setSaving(true)
    try {
      // Update question paper
      const { error: paperError } = await supabase
        .from('question_papers')
        .update({
          title,
          page_size: pageSettings.page_size,
          margins: pageSettings.margins,
          header_info: headerInfo,
          language_direction: pageSettings.language_direction,
          updated_at: new Date().toISOString(),
        })
        .eq('id', paperId)

      if (paperError) throw paperError

      // Delete existing questions
      await supabase
        .from('questions')
        .delete()
        .eq('paper_id', paperId)

      // Insert new questions
      if (questions.length > 0) {
        const { error: questionsError } = await supabase
          .from('questions')
          .insert(questions.map(q => ({
            paper_id: paperId,
            type: q.type,
            question_text: q.question_text,
            options: q.options,
            correct_answer: q.correct_answer,
            marks: q.marks,
            order_index: q.order_index,
            columns: q.columns, // Save column setting
            line_height: q.lineHeight, // Save line height setting
          })))

        if (questionsError) throw questionsError
      }

      toast({
        title: 'Success',
        description: 'Question paper saved successfully',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to save question paper',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0)

  return {
    user,
    paperId,
    title,
    setTitle,
    headerInfo,
    setHeaderInfo,
    pageSettings,
    setPageSettings,
    questions,
    setQuestions,
    loading,
    saving,
    addMCQQuestion,
    addWrittenQuestion,
    updateQuestion,
    deleteQuestion,
    handleDragEnd,
    savePaper,
    totalMarks,
  }
}