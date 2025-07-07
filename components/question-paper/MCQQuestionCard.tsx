'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Circle, X, Columns } from 'lucide-react'
import { Question } from '@/types/question-paper'

interface MCQQuestionCardProps {
  question: Question
  index: number
  onUpdate: (id: string, updates: Partial<Question>) => void
  onDelete: (id: string) => void
}

export function MCQQuestionCard({ 
  question, 
  index, 
  onUpdate, 
  onDelete 
}: MCQQuestionCardProps) {
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
    <Card className="flex-1">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-gray-500">Question {index}</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-500">MCQ</span>
            </div>
            <Textarea
              value={question.question_text}
              onChange={(e) => onUpdate(question.id, { question_text: e.target.value })}
              placeholder="Enter your question here..."
              rows={2}
            />
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor={`marks_${question.id}`} className="text-sm">Marks:</Label>
              <Input
                id={`marks_${question.id}`}
                type="number"
                value={question.marks}
                onChange={(e) => onUpdate(question.id, { marks: parseInt(e.target.value) })}
                className="w-16"
                min="1"
              />
            </div>
            <Button variant="ghost" size="sm" onClick={() => onDelete(question.id)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Column Layout Selector */}
          <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
            <Columns className="h-4 w-4 text-gray-500" />
            <Label className="text-sm font-medium">Options Layout:</Label>
            <Select 
              value={(question.columns || 1).toString()} 
              onValueChange={(value) => onUpdate(question.id, { columns: parseInt(value) })}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Column</SelectItem>
                <SelectItem value="2">2 Columns</SelectItem>
                <SelectItem value="3">3 Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Options Grid */}
          <div className={`grid gap-3 ${getColumnClass(question.columns || 1)}`}>
            {question.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Circle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium flex-shrink-0">{optionLabels[optionIndex]}</span>
                  <div className="flex items-center space-x-2 flex-1">
                    <input
                      type="radio"
                      name={`correct_${question.id}`}
                      checked={question.correct_answer === optionLabels[optionIndex]}
                      onChange={() => onUpdate(question.id, { correct_answer: optionLabels[optionIndex] })}
                      className="text-green-600 flex-shrink-0"
                    />
                    <Label className="text-xs text-gray-500 flex-shrink-0">Correct</Label>
                  </div>
                </div>
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...(question.options || [])]
                    newOptions[optionIndex] = e.target.value
                    onUpdate(question.id, { options: newOptions })
                  }}
                  placeholder={`Option ${optionLabels[optionIndex]}`}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}