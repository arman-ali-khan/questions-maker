'use client'

import { Draggable } from '@hello-pangea/dnd'
import { Question, HeaderInfo, PageSettings } from '@/types/question-paper'

interface QuestionPaperPreviewProps {
  headerInfo: HeaderInfo
  questions: Question[]
  title: string
  totalMarks: number
  pageSettings: PageSettings
  isDragMode?: boolean
  onDragEnd?: (result: any) => void
}

export function QuestionPaperPreview({ 
  headerInfo, 
  questions, 
  title, 
  totalMarks,
  pageSettings,
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
    let baseHeight = 70 // Base height for question text and spacing (reduced for two-column)
    
    if (question.type === 'mcq' && question.options) {
      const optionsPerRow = question.columns || 1
      const totalRows = Math.ceil(question.options.length / optionsPerRow)
      baseHeight += totalRows * 35 // Each option row takes ~35px (reduced for two-column)
    } else if (question.type === 'written') {
      const lines = Math.max(4, Math.floor(question.marks / 2))
      baseHeight += lines * 25 // Each line takes ~25px (reduced for two-column)
    }
    
    // Adjust for line height
    const lineHeightMultiplier = question.lineHeight === 'loose' ? 1.3 : 
                                question.lineHeight === 'normal' ? 0.9 : 1.0
    
    return baseHeight * lineHeightMultiplier
  }

  // Get page dimensions based on page settings
  const getPageDimensions = () => {
    switch (pageSettings.page_size) {
      case 'A4':
        return { width: 794, height: 1123 } // A4 in pixels at 96 DPI
      case 'A5':
        return { width: 559, height: 794 } // A5 in pixels at 96 DPI
      case 'Letter':
        return { width: 816, height: 1056 } // Letter in pixels at 96 DPI
      default:
        return { width: 794, height: 1123 }
    }
  }

  // Split questions into pages based on available space and page settings
  const splitQuestionsIntoPages = (questions: Question[]) => {
    const pages: (Question & { displayIndex: number })[][] = []
    let currentPageLeftColumn: (Question & { displayIndex: number })[] = []
    let currentPageRightColumn: (Question & { displayIndex: number })[] = []
    let leftColumnHeight = 0
    let rightColumnHeight = 0
    let isFillingLeftColumn = true
    
    const pageDimensions = getPageDimensions()
    const margins = pageSettings.margins
    
    // Calculate available height for content (page height minus margins)
    const marginTopPx = (margins.top / 25.4) * 96 // Convert mm to pixels
    const marginBottomPx = (margins.bottom / 25.4) * 96
    const availableHeight = pageDimensions.height - marginTopPx - marginBottomPx
    
    // Calculate header and instructions height
    const headerHeight = 200 // Approximate header height
    const instructionsHeight = 100 // Approximate instructions height
    // Calculate max height for each column
    const maxFirstPageColumnHeight = availableHeight - headerHeight - instructionsHeight
    const maxSubsequentPageColumnHeight = availableHeight - 80 // Space for page header
    
    questions.forEach((question, index) => {
      const questionWithIndex = { ...question, displayIndex: index + 1 }
      const questionHeight = calculateQuestionHeight(question)
      
      // Determine max height for current page
      const isFirstPage = pages.length === 0 && currentPageLeftColumn.length === 0 && currentPageRightColumn.length === 0
      const currentMaxColumnHeight = isFirstPage ? maxFirstPageColumnHeight : maxSubsequentPageColumnHeight
      
      // Try to add to left column first
      if (isFillingLeftColumn) {
        if (leftColumnHeight + questionHeight <= currentMaxColumnHeight) {
          currentPageLeftColumn.push(questionWithIndex)
          leftColumnHeight += questionHeight
        } else {
          // Left column is full, switch to right column
          isFillingLeftColumn = false
          if (rightColumnHeight + questionHeight <= currentMaxColumnHeight) {
            currentPageRightColumn.push(questionWithIndex)
            rightColumnHeight += questionHeight
          } else {
            // Both columns are full, start new page
            pages.push([...currentPageLeftColumn, ...currentPageRightColumn])
            currentPageLeftColumn = [questionWithIndex]
            currentPageRightColumn = []
            leftColumnHeight = questionHeight
            rightColumnHeight = 0
            isFillingLeftColumn = true
          }
        }
      } else {
        // Filling right column
        if (rightColumnHeight + questionHeight <= currentMaxColumnHeight) {
          currentPageRightColumn.push(questionWithIndex)
          rightColumnHeight += questionHeight
        } else {
          // Right column is full, start new page
          pages.push([...currentPageLeftColumn, ...currentPageRightColumn])
          currentPageLeftColumn = [questionWithIndex]
          currentPageRightColumn = []
          leftColumnHeight = questionHeight
          rightColumnHeight = 0
          isFillingLeftColumn = true
        }
      }
    })
    
    // Add the last page if it has questions
    if (currentPageLeftColumn.length > 0 || currentPageRightColumn.length > 0) {
      pages.push([...currentPageLeftColumn, ...currentPageRightColumn])
    }
    
    return pages
  }

  const renderQuestion = (question: Question & { displayIndex: number }, isDraggable = false) => {
    const questionContent = (
      <div 
        className={`space-y-2 break-inside-avoid mb-4 text-sm ${isDraggable ? 'cursor-move hover:bg-blue-50 p-3 rounded-lg border-2 border-dashed border-transparent hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md' : ''}`}
      >
        <div className="flex justify-start items-start">
          <div className="flex-1">
            <p className={`font-medium text-gray-900 bangla-text text-sm ${getLineHeightClass(question.lineHeight)}`}>
              <span className="mr-2 font-semibold">{question.displayIndex}.</span>
              {question.question_text || `প্রশ্ন ${question.displayIndex}`}
            </p>
          </div>
        </div>

        {question.type === 'mcq' && question.options && (
          <div className="ml-4">
            <div className={`grid gap-2 ${getColumnClass(question.columns || 1)}`}>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-start space-x-2">
                  <span className="w-5 h-5 border-2 border-gray-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 bangla-text mt-0.5">
                    {optionLabels[optionIndex]}
                  </span>
                  <span className={`text-gray-800 break-words bangla-text text-sm ${getLineHeightClass(question.lineHeight)}`}>
                    {option || `বিকল্প ${optionLabels[optionIndex]}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {question.type === 'written' && (
          <div className="ml-4 space-y-2">
            {[...Array(Math.max(3, Math.floor(question.marks / 2)))].map((_, lineIndex) => (
              <div key={lineIndex} className="border-b border-gray-300 h-5"></div>
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

  // Get page dimensions for styling
  const pageDimensions = getPageDimensions()
  const pageStyle = {
    width: `${pageDimensions.width}px`,
    minHeight: `${pageDimensions.height}px`,
    maxWidth: `${pageDimensions.width}px`,
  }

  // Split questions into pages
  const pages = splitQuestionsIntoPages(questions)
  
  return (
    <div className="space-y-8 bangla-text preview-content">
      {pages.map((pageQuestions, pageIndex) => (
        <div 
          key={pageIndex} 
          className="bg-white border border-gray-300 shadow-lg mx-auto relative page-content"
          style={pageStyle}
        >
          {/* Page content with margins */}
          <div 
            className="h-full"
            style={{
              padding: `${pageSettings.margins.top}mm ${pageSettings.margins.right}mm ${pageSettings.margins.bottom}mm ${pageSettings.margins.left}mm`,
              direction: pageSettings.language_direction === 'rtl' ? 'rtl' : 'ltr',
            }}
          >
            {/* Header - only show on first page */}
            {pageIndex === 0 && (
              <>
                <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
                  {headerInfo.school_name && (
                    <h1 className="text-2xl font-bold mb-3 text-gray-900 bangla-title">{headerInfo.school_name}</h1>
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
                <div className="text-sm flex gap-2 mb-8">
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
              <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 bangla-text">
                  {headerInfo.subject || title} - পৃষ্ঠা {pageIndex + 1}
                </h2>
                <p className="text-sm text-gray-600 mt-2 bangla-text">প্রশ্নপত্রের ধারাবাহিকতা</p>
              </div>
            )}

            {/* Questions for this page */}
            <div className="grid grid-cols-2 gap-8">
              {isDragMode ? (
                // Single column for drag mode (easier to manage)
                <div className="col-span-2 space-y-4">
                  {pageQuestions.map((question) => 
                    renderQuestion(question, true)
                  )}
                </div>
              ) : (
                // Two-column layout for questions with proper ordering
                <>
                  <div className="space-y-4">
                    {pageQuestions
                      .filter((_, index) => index % 2 === 0)
                      .map((question) => renderQuestion(question, false))}
                  </div>
                  <div className="space-y-4">
                    {pageQuestions
                      .filter((_, index) => index % 2 === 1)
                      .map((question) => renderQuestion(question, false))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Page number indicator */}
          <div className="absolute bottom-2 right-4 text-xs text-gray-500 bangla-text">
            পৃষ্ঠা {pageIndex + 1}
          </div>
        </div>
      ))}

      {/* Show message if no questions */}
      {questions.length === 0 && (
        <div 
          className="bg-white border border-gray-300 shadow-lg mx-auto flex items-center justify-center page-content"
          style={pageStyle}
        >
          <div className="text-center text-gray-500">
            <p className="text-lg bangla-text">এখনো কোনো প্রশ্ন যোগ করা হয়নি।</p>
            <p className="text-sm mt-2 bangla-text">প্রশ্নপত্র তৈরি করতে MCQ বা লিখিত প্রশ্ন যোগ করুন!</p>
          </div>
        </div>
      )}
    </div>
  )
}