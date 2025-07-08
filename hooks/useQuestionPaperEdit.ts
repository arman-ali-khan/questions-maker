'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { Question, HeaderInfo, PageSettings } from '@/types/question-paper'

export function useQuestionPaperEdit(paperId: string) {
  const [user, setUser] = useState<any>(null)
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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user && paperId) {
      loadPaper()
    }
  }, [user, paperId])

  // Auto-save functionality
  const triggerAutoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      if (hasUnsavedChanges && paperId) {
        savePaper(true) // true indicates auto-save
      }
    }, 10000) // 10 seconds
  }, [hasUnsavedChanges, paperId])

  // Mark as having unsaved changes and trigger auto-save
  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true)
    triggerAutoSave()
  }, [triggerAutoSave])

  // Keyboard shortcut for Ctrl+S
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault()
        if (paperId) {
          savePaper()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [paperId])

  // Cleanup auto-save timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [])
  const checkUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      router.push('/auth/login')
      return
    }
    setUser(user)
  }

  const loadPaper = async () => {
    try {
      setLoading(true)

      // Load question paper
      const { data: paperData, error: paperError } = await supabase
        .from('question_papers')
        .select('*')
        .eq('id', paperId)
        .eq('user_id', user.id)
        .single()

      if (paperError) {
        if (paperError.code === 'PGRST116') {
          toast({
            title: 'Error',
            description: 'Question paper not found or you do not have permission to edit it',
            variant: 'destructive',
          })
          router.push('/dashboard')
          return
        }
        throw paperError
      }

      // Set paper data
      setTitle(paperData.title)
      
      // Ensure instructions field exists with default values and new fields
      const headerInfoWithInstructions = {
        ...paperData.header_info,
        instructions: paperData.header_info.instructions || [
          'সব প্রশ্নের উত্তর দিতে হবে',
          'স্পষ্ট ও সুন্দর হাতের লেখায় লিখতে হবে',
          'প্রয়োজনে আলাদা উত্তরপত্র ব্যবহার করতে হবে',
          'প্রতিটি প্রশ্ন মনোযোগ দিয়ে পড়ে উত্তর দিতে হবে'
        ],
        instructionType: paperData.header_info.instructionType || 'list',
        oneLineInstruction: paperData.header_info.oneLineInstruction || ''
      }
      
      setHeaderInfo(headerInfoWithInstructions)
      setPageSettings({
        page_size: paperData.page_size,
        margins: paperData.margins,
        language_direction: paperData.language_direction,
      })

      // Load questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('paper_id', paperId)
        .order('order_index')

      if (questionsError) throw questionsError

      // Transform questions data
      const transformedQuestions: Question[] = questionsData.map(q => ({
        id: q.id,
        type: q.type as 'mcq' | 'written',
        question_text: q.question_text,
        options: q.options || undefined,
        correct_answer: q.correct_answer || undefined,
        marks: q.marks,
        order_index: q.order_index,
        columns: q.columns || 1,
        lineHeight: q.line_height || 'relaxed',
      }))

      setQuestions(transformedQuestions)
      setLastSaved(new Date(paperData.updated_at))
      setHasUnsavedChanges(false)
    } catch (error: any) {
      console.error('Error loading paper:', error)
      toast({
        title: 'Error',
        description: 'Failed to load question paper',
        variant: 'destructive',
      })
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  // Enhanced setTitle with change tracking
  const setTitleWithTracking = (newTitle: string) => {
    setTitle(newTitle)
    markAsChanged()
  }

  // Enhanced setHeaderInfo with change tracking
  const setHeaderInfoWithTracking = (newHeaderInfo: HeaderInfo) => {
    setHeaderInfo(newHeaderInfo)
    markAsChanged()
  }

  // Enhanced setPageSettings with change tracking
  const setPageSettingsWithTracking = (newPageSettings: PageSettings) => {
    setPageSettings(newPageSettings)
    markAsChanged()
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
      columns: 1,
      lineHeight: 'relaxed',
    }
    setQuestions([...questions, newQuestion])
    markAsChanged()
  }

  const addWrittenQuestion = () => {
    const newQuestion: Question = {
      id: `written_${Date.now()}`,
      type: 'written',
      question_text: '',
      marks: 10,
      order_index: questions.length,
      lineHeight: 'relaxed',
    }
    setQuestions([...questions, newQuestion])
    markAsChanged()
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ))
    markAsChanged()
  }

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
    markAsChanged()
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
    markAsChanged()
  }

  const savePaper = async (isAutoSave = false) => {
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
            columns: q.columns,
            line_height: q.lineHeight,
          })))

        if (questionsError) throw questionsError
      }

      setHasUnsavedChanges(false)
      setLastSaved(new Date())
      
      // Clear auto-save timeout since we just saved
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
        autoSaveTimeoutRef.current = null
      }
      if (!isAutoSave) {
        toast({
          title: 'Success',
          description: 'Question paper saved successfully',
        })
      }
    } catch (error: any) {
      console.error('Save error:', error)
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
    title,
    setTitle: setTitleWithTracking,
    headerInfo,
    setHeaderInfo: setHeaderInfoWithTracking,
    pageSettings,
    setPageSettings: setPageSettingsWithTracking,
    questions,
    setQuestions,
    loading,
    saving,
    hasUnsavedChanges,
    lastSaved,
    addMCQQuestion,
    addWrittenQuestion,
    updateQuestion,
    deleteQuestion,
    handleDragEnd,
    savePaper,
    totalMarks,
  }
}