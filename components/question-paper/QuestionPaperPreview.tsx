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
      <div className="text-sm">
        <p className="font-semibold mb-2 bangla-text">নির্দেশনা:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {instructions.map((instruction, index) => (
            <li key={index} className="bangla-text">{instruction}</li>
          ))}
        </ul>
      </div>

      {/* Questions in Two Columns */}
      <div className="grid grid-cols-2 gap-8">
        {questions.map((question, index) => (
          <div key={question.id} className="space-y-4 break-inside-avoid">
            <div className="flex justify-start items-start">
              <div className="flex-1">
                <p className="font-medium text-gray-900 bangla-text">
                  <span className="mr-3">{index + 1}.</span>
                  {question.question_text || `প্রশ্ন ${index + 1}`}
                </p>
              </div>
            </div>

            {question.type === 'mcq' && question.options && (
              <div className="ml-8">
                <div className={`grid gap-4 ${getColumnClass(question.columns || 1)}`}>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-3">
                      <span className="w-6 h-6 border-2 border-gray-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 bangla-text">
                        {optionLabels[optionIndex]}
                      </span>
                      <span className="text-gray-800 break-words bangla-text">{option || `বিকল্প ${optionLabels[optionIndex]}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {question.type === 'written' && (
              <div className="ml-8 space-y-4">
                {[...Array(Math.max(3, Math.floor(question.marks / 3)))].map((_, lineIndex) => (
                  <div key={lineIndex} className="border-b border-gray-400 h-8"></div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg bangla-text">এখনো কোনো প্রশ্ন যোগ করা হয়নি।</p>
          <p className="text-sm mt-2 bangla-text">প্রশ্নপত্র তৈরি করতে MCQ বা লিখিত প্রশ্ন যোগ করুন!</p>
        </div>
      )}
    </div>
  )
}