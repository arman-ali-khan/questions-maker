'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Columns, Eye } from 'lucide-react'
import { Question } from '@/types/question-paper'

interface MCQPreviewCardProps {
  question: Question
  index: number
  onUpdate: (id: string, updates: Partial<Question>) => void
}

export function MCQPreviewCard({ 
  question, 
  index, 
  onUpdate 
}: MCQPreviewCardProps) {
  const optionLabels = ['ক', 'খ', 'গ', 'ঘ']

  const getColumnClass = (columns: number) => {
    switch (columns) {
      case 1:
        return 'grid-cols-1'
      case 2:
        return 'grid-cols-1 md:grid-cols-2'
      case 3:
        return 'grid-cols-1 md:grid-cols-3'
      default:
        return 'grid-cols-1'
    }
  }

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sm font-medium text-gray-500">Question {index}</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-blue-600 font-medium">MCQ</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-500">{question.marks} mark{question.marks !== 1 ? 's' : ''}</span>
            </div>
            <p className="font-medium text-gray-900 mb-4">
              {question.question_text || `Question ${index}`}
            </p>
          </div>
        </div>
        
        {/* Column Layout Selector for Preview */}
        <div className="flex items-center space-x-3 py-3 px-4 bg-gray-50 rounded-lg border">
          <Eye className="h-4 w-4 text-blue-600" />
          <Label className="text-sm font-medium text-gray-700">Preview Layout:</Label>
          <Select 
            value={(question.columns || 1).toString()} 
            onValueChange={(value) => onUpdate(question.id, { columns: parseInt(value) })}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">
                <div className="flex items-center space-x-2">
                  <Columns className="h-3 w-3" />
                  <span>1 Column</span>
                </div>
              </SelectItem>
              <SelectItem value="2">
                <div className="flex items-center space-x-2">
                  <Columns className="h-3 w-3" />
                  <span>2 Columns</span>
                </div>
              </SelectItem>
              <SelectItem value="3">
                <div className="flex items-center space-x-2">
                  <Columns className="h-3 w-3" />
                  <span>3 Columns</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="text-xs text-gray-500 ml-2">
            Change layout to see preview
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Preview of Options */}
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-600 mb-3">Options Preview:</div>
          <div className={`grid gap-4 ${getColumnClass(question.columns || 1)}`}>
            {question.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-3 p-2 rounded border bg-white">
                <span className="w-6 h-6 border-2 border-gray-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  {optionLabels[optionIndex]}
                </span>
                <span className="text-gray-800 break-words flex-1">
                  {option || `Option ${optionLabels[optionIndex]}`}
                </span>
                {question.correct_answer === optionLabels[optionIndex] && (
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" title="Correct Answer"></div>
                )}
              </div>
            ))}
          </div>
          
          {/* Layout Information */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs text-blue-700 font-medium mb-1">Layout Information:</div>
            <div className="text-xs text-blue-600">
              {question.columns === 1 && "Single column layout - Best for long options or detailed explanations"}
              {question.columns === 2 && "Two column layout - Balanced layout for medium-length options"}
              {question.columns === 3 && "Three column layout - Compact layout for short options"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}