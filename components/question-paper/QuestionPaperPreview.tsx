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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-6">
        {headerInfo.school_name && (
          <h1 className="text-2xl font-bold mb-3 text-gray-900">{headerInfo.school_name}</h1>
        )}
        {headerInfo.school_address && (
          <p className="text-sm mb-4 text-gray-700">{headerInfo.school_address}</p>
        )}
        {headerInfo.exam_name && (
          <h2 className="text-xl font-semibold mb-4 text-gray-900">{headerInfo.exam_name}</h2>
        )}
        
        <div className="flex justify-between items-center text-sm mt-6">
          <div className="text-left">
            {headerInfo.subject && <div className="mb-1"><strong>Subject:</strong> {headerInfo.subject}</div>}
            {headerInfo.date && <div><strong>Date:</strong> {headerInfo.date}</div>}
          </div>
          <div className="text-right">
            {headerInfo.time && <div className="mb-1"><strong>Time:</strong> {headerInfo.time}</div>}
            <div><strong>Full Marks:</strong> {headerInfo.marks || totalMarks}</div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-sm">
        <p className="font-semibold mb-2">Instructions:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>Answer all questions</li>
          <li>Write clearly and legibly</li>
          <li>Use separate answer sheets if necessary</li>
          <li>Read each question carefully before answering</li>
        </ul>
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {questions.map((question, index) => (
          <div key={question.id} className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  <span className="mr-3">{index + 1}.</span>
                  {question.question_text || `Question ${index + 1}`}
                </p>
              </div>
              <div className="text-sm text-gray-600 ml-6 font-medium">
                [{question.marks} mark{question.marks !== 1 ? 's' : ''}]
              </div>
            </div>

            {question.type === 'mcq' && question.options && (
              <div className="ml-8">
                <div className={`grid gap-4 ${getColumnClass(question.columns || 1)}`}>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-3">
                      <span className="w-6 h-6 border-2 border-gray-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {optionLabels[optionIndex]}
                      </span>
                      <span className="text-gray-800 break-words">{option || `Option ${optionLabels[optionIndex]}`}</span>
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
          <p className="text-lg">No questions added yet.</p>
          <p className="text-sm mt-2">Start creating your question paper by adding MCQ or Written questions!</p>
        </div>
      )}
    </div>
  )
}