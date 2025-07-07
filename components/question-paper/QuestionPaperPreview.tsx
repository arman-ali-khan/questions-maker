'use client'

import { Question, HeaderInfo } from '@/types/question-paper'

interface QuestionPaperPreviewProps {
  headerInfo: HeaderInfo
  questions: Question[]
  title: string
  totalMarks: number
}

export function QuestionPaperPreview({ 
  headerInfo, 
  questions, 
  title, 
  totalMarks 
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

  // Calculate question height to determine column distribution
  const calculateQuestionHeight = (question: Question) => {
    let baseHeight = 60 // Base height for question text and spacing
    
    if (question.type === 'mcq' && question.options) {
      const optionsPerRow = question.columns || 1
      const totalRows = Math.ceil(question.options.length / optionsPerRow)
      baseHeight += totalRows * 35 // Each option row takes ~35px
    } else if (question.type === 'written') {
      const lines = Math.max(4, Math.floor(question.marks / 2))
      baseHeight += lines * 25 // Each line takes ~25px
    }
    
    return baseHeight
  }

  // Split questions into columns based on available space
  const splitQuestionsIntoColumns = (questions: Question[]) => {
    const leftColumn: (Question & { displayIndex: number })[] = []
    const rightColumn: (Question & { displayIndex: number })[] = []
    
    let leftColumnHeight = 0
    const maxColumnHeight = 800 // Approximate max height for one column (adjustable)
    
    questions.forEach((question, index) => {
      const questionWithIndex = { ...question, displayIndex: index + 1 }
      const questionHeight = calculateQuestionHeight(question)
      
      // If left column has space and adding this question won't exceed limit
      if (leftColumnHeight + questionHeight <= maxColumnHeight) {
        leftColumn.push(questionWithIndex)
        leftColumnHeight += questionHeight
      } else {
        // Move to right column
        rightColumn.push(questionWithIndex)
      }
    })
    
    return { leftColumn, rightColumn }
  }

  const { leftColumn, rightColumn } = splitQuestionsIntoColumns(questions)

  const renderQuestion = (question: Question & { displayIndex: number }) => (
    <div key={question.id} className="space-y-3 break-inside-avoid mb-8">
      <div className="flex justify-start items-start">
        <div className="flex-1">
          <p className="font-medium text-gray-900 bangla-text leading-relaxed">
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
                <span className="text-gray-800 break-words bangla-text leading-relaxed">
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
  
  return (
    <div className="space-y-8 bangla-text">
      {/* Header */}
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

      {/* Questions in Sequential Column Layout */}
      {questions.length > 0 ? (
        <div className="grid grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-0">
            <div className="text-xs text-gray-500 mb-4 text-center border-b pb-2">
              বাম কলাম
              {leftColumn.length > 0 && (
                <span className="ml-2">
                  (প্রশ্ন {leftColumn[0].displayIndex}
                  {leftColumn.length > 1 && ` - ${leftColumn[leftColumn.length - 1].displayIndex}`})
                </span>
              )}
            </div>
            {leftColumn.map((question) => 
              renderQuestion(question)
            )}
          </div>
          
          {/* Right Column */}
          <div className="space-y-0">
            <div className="text-xs text-gray-500 mb-4 text-center border-b pb-2">
              ডান কলাম
              {rightColumn.length > 0 && (
                <span className="ml-2">
                  (প্রশ্ন {rightColumn[0].displayIndex}
                  {rightColumn.length > 1 && ` - ${rightColumn[rightColumn.length - 1].displayIndex}`})
                </span>
              )}
            </div>
            {rightColumn.map((question) => 
              renderQuestion(question)
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg bangla-text">এখনো কোনো প্রশ্ন যোগ করা হয়নি।</p>
          <p className="text-sm mt-2 bangla-text">প্রশ্নপত্র তৈরি করতে MCQ বা লিখিত প্রশ্ন যোগ করুন!</p>
        </div>
      )}
    </div>
  )
}