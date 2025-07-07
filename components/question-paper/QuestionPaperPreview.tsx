'use client'

import { Draggable } from '@hello-pangea/dnd'
import { Question, HeaderInfo } from '@/types/question-paper'

interface QuestionPaperPreviewProps {
  headerInfo: HeaderInfo
  questions: Question[]
  title: string
  totalMarks: number
  isDragMode?: boolean
  onDragEnd?: (result: any) => void
}

export function QuestionPaperPreview({ 
  headerInfo, 
  questions, 
  title, 
  totalMarks,
  isDragMode = false,
  onDragEnd
}: QuestionPaperPreviewProps) {
  const optionLabels = ['ক', 'খ', 'গ', 'ঘ']
  
  const defaultInstructions = [
    'সব প্রশ্নের উত্তর দিতে হবে',
    'স্পষ্ট ও সুন্দর হাতের লেখায় লিখতে হবে',
    'প্রয়োজনে আলাদা উত্তরপত্র ব্যবহার করতে হবে',
    'প্রতিটি প্রশ্ন মনোযোগ দিয়ে পড়ে উত্তর দিতে হবে'
  ]

  const instructions = headerInfo.instructions || defaultInstructions
  const instructionType = headerInfo.instructionType || 'list'
  const oneLineInstruction = headerInfo.oneLineInstruction || ''
  
  const getColumnClass = (columns: number) => {
    switch (columns) {
      case 1:
        return 'grid-cols-1'
      case 2:
        return 'grid-cols-2'
      case 3:
        return 'grid-cols-3'
      default:
        return 'grid-cols-1'
    }
  }

  const getLineHeightClass = (lineHeight?: string) => {
    switch (lineHeight) {
      case 'normal':
        return 'leading-normal'
      case 'relaxed':
        return 'leading-relaxed'
      case 'loose':
        return 'leading-loose'
      default:
        return 'leading-relaxed'
    }
  }

  // Calculate question height to determine page breaks
  const calculateQuestionHeight = (question: Question) => {
    let baseHeight = 80 // Base height for question text and spacing
    
    if (question.type === 'mcq' && question.options) {
      const optionsPerRow = question.columns || 1
      const totalRows = Math.ceil(question.options.length / optionsPerRow)
      baseHeight += totalRows * 40 // Each option row takes ~40px
    } else if (question.type === 'written') {
      const lines = Math.max(4, Math.floor(question.marks / 2))
      baseHeight += lines * 30 // Each line takes ~30px
    }
    
    // Adjust for line height
    const lineHeightMultiplier = question.lineHeight === 'loose' ? 1.3 : 
                                question.lineHeight === 'normal' ? 0.9 : 1.0
    
    return baseHeight * lineHeightMultiplier
  }

  // Split questions into pages based on available space
  const splitQuestionsIntoPages = (questions: Question[]) => {
    const pages: (Question & { displayIndex: number })[][] = []
    let currentPage: (Question & { displayIndex: number })[] = []
    let currentPageHeight = 0
    
    // Calculate available height for questions (total page height minus header and instructions)
    const headerHeight = 200 // Approximate header height
    const instructionsHeight = 100 // Approximate instructions height
    const maxPageHeight = 800 // Approximate max height for questions on first page
    const maxSecondPageHeight = 900 // More space on subsequent pages (no header)
    
    questions.forEach((question, index) => {
      const questionWithIndex = { ...question, displayIndex: index + 1 }
      const questionHeight = calculateQuestionHeight(question)
      
      // Determine max height for current page
      const isFirstPage = pages.length === 0 && currentPage.length === 0
      const currentMaxHeight = isFirstPage ? maxPageHeight : maxSecondPageHeight
      
      // If adding this question would exceed the page height, start a new page
      if (currentPageHeight + questionHeight > currentMaxHeight && currentPage.length > 0) {
        pages.push(currentPage)
        currentPage = [questionWithIndex]
        currentPageHeight = questionHeight
      } else {
        currentPage.push(questionWithIndex)
        currentPageHeight += questionHeight
      }
    })
    
    // Add the last page if it has questions
    if (currentPage.length > 0) {
      pages.push(currentPage)
    }
    
    return pages
  }

  const renderQuestion = (question: Question & { displayIndex: number }, isDraggable = false) => {
    const questionContent = (
      <div 
        className={`space-y-3 break-inside-avoid mb-8 ${isDraggable ? 'cursor-move hover:bg-blue-50 p-3 rounded-lg border-2 border-dashed border-transparent hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md' : ''}`}
      >
        <div className="flex justify-start items-start">
          <div className="flex-1">
            <p className={`font-medium text-gray-900 bangla-text ${getLineHeightClass(question.lineHeight)}`}>
              <span className="mr-3 font-semibold">{question.displayIndex}.</span>
              {question.question_text || `প্রশ্ন ${question.displayIndex}`}
              <span className="ml-2 text-sm text-gray-600">({question.marks} নম্বর)</span>
            </p>
          </div>
        </div>

        {question.type === 'mcq' && question.options && (
          <div className="ml-6">
            <div className={`grid gap-3 ${getColumnClass(question.columns || 1)}`}>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-start space-x-3">
                  <span className="w-6 h-6 border-2 border-gray-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 bangla-text mt-0.5">
                    {optionLabels[optionIndex]}
                  </span>
                  <span className={`text-gray-800 break-words bangla-text ${getLineHeightClass(question.lineHeight)}`}>
                    {option || `বিকল্প ${optionLabels[optionIndex]}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {question.type === 'written' && (
          <div className="ml-6 space-y-3">
            {[...Array(Math.max(4, Math.floor(question.marks / 2)))].map((_, lineIndex) => (
              <div key={lineIndex} className="border-b border-gray-300 h-6"></div>
            ))}
          </div>
        )}
      </div>
    )

    if (isDraggable) {
      return (
        <Draggable key={question.id} draggableId={question.id} index={question.displayIndex - 1}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={snapshot.isDragging ? 'opacity-75 transform rotate-2' : ''}
            >
              {questionContent}
            </div>
          )}
        </Draggable>
      )
    }

    return <div key={question.id}>{questionContent}</div>
  }

  // Split questions into pages
  const pages = splitQuestionsIntoPages(questions)
  
  return (
    <div className="space-y-8 bangla-text">
      {pages.map((pageQuestions, pageIndex) => (
        <div key={pageIndex} className={pageIndex > 0 ? 'page-break-before' : ''}>
          {/* Header - only show on first page */}
          {pageIndex === 0 && (
            <>
              <div className="text-center border-b-2 border-gray-800 pb-6">
                {headerInfo.school_name && (
                  <h1 className="text-2xl font-bold mb-3 text-gray-900 bangla-text">{headerInfo.school_name}</h1>
                )}
                {headerInfo.school_address && (
                  <p className="text-sm mb-4 text-gray-700 bangla-text">{headerInfo.school_address}</p>
                )}
                {headerInfo.exam_name && (
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 bangla-text">{headerInfo.exam_name}</h2>
                )}
                
                <div className="flex justify-between items-center text-sm mt-6">
                  <div className="text-left">
                    {headerInfo.subject && <div className="mb-1 bangla-text"><strong>বিষয়:</strong> {headerInfo.subject}</div>}
                    {headerInfo.date && <div className="bangla-text"><strong>তারিখ:</strong> {headerInfo.date}</div>}
                  </div>
                  <div className="text-right">
                    {headerInfo.time && <div className="mb-1 bangla-text"><strong>সময়:</strong> {headerInfo.time}</div>}
                    <div className="bangla-text"><strong>পূর্ণমান:</strong> {headerInfo.marks || totalMarks}</div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-sm flex gap-2">
                <p className="font-semibold mb-2 bangla-text w-36">বিশেষ দ্রষ্টব্য:- </p>
                
                {instructionType === 'oneline' ? (
                  // One line instruction
                  <p className="text-gray-700 bangla-text leading-relaxed">
                    {oneLineInstruction || 'সব প্রশ্নের উত্তর দিতে হবে এবং স্পষ্ট হাতের লেখায় লিখতে হবে।'}
                  </p>
                ) : (
                  // List instructions
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {instructions.map((instruction, index) => (
                      <li key={index} className="bangla-text">{instruction}</li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}

          {/* Page header for subsequent pages */}
          {pageIndex > 0 && (
            <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 bangla-text">
                {headerInfo.subject || title} - পৃষ্ঠা {pageIndex + 1}
              </h2>
              <p className="text-sm text-gray-600 mt-2 bangla-text">প্রশ্নপত্রের ধারাবাহিকতা</p>
            </div>
          )}

          {/* Questions for this page */}
          <div className="space-y-0">
            {isDragMode ? (
              // Single column for drag mode (easier to manage)
              <div className="space-y-4">
                {pageQuestions.map((question) => 
                  renderQuestion(question, true)
                )}
              </div>
            ) : (
              // Normal layout for questions
              <div className="space-y-0">
                {pageQuestions.map((question) => 
                  renderQuestion(question, false)
                )}
              </div>
            )}
          </div>

          {/* Page break indicator (visual only) */}
          {pageIndex < pages.length - 1 && !isDragMode && (
            <div className="mt-8 pt-4 border-t-2 border-dashed border-gray-300 text-center">
              <p className="text-xs text-gray-500 bangla-text">পৃষ্ঠা {pageIndex + 1} শেষ - পরবর্তী পৃষ্ঠায় চলবে</p>
            </div>
          )}
        </div>
      ))}

      {/* Show message if no questions */}
      {questions.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg bangla-text">এখনো কোনো প্রশ্ন যোগ করা হয়নি।</p>
          <p className="text-sm mt-2 bangla-text">প্রশ্নপত্র তৈরি করতে MCQ বা লিখিত প্রশ্ন যোগ করুন!</p>
        </div>
      )}
    </div>
  )
}