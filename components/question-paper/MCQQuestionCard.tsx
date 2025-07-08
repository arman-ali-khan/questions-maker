'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Circle, X, Columns, LineChart } from 'lucide-react'
import { Question } from '@/types/question-paper'
import { RichTextEditor } from '@/components/ui/rich-text-editor'

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

  const getLineHeightClass = (lineHeight: string) => {
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

  return (
    <Card className="flex-1">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-gray-500">প্রশ্ন {index}</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-500">MCQ</span>
            </div>
            <RichTextEditor
              value={question.question_text}
              onChange={(value) => onUpdate(question.id, { question_text: value })}
              placeholder="এখানে আপনার প্রশ্ন লিখুন..."
              lineHeight={question.lineHeight || 'relaxed'}
              className="w-full"
            />
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor={`marks_${question.id}`} className="text-sm">নম্বর:</Label>
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
          {/* Layout Controls */}
          <div className="space-y-4 pb-3 border-b border-gray-200 flex justify-between items-center">
            {/* Column Layout Selector */}
            <div className="space-y-2 flex items-center gap-2">
              <div className="flex items-center space-x-2">
                <Columns className="h-4 w-4 text-gray-500" />
                <Label className="text-sm font-medium">বিকল্প বিন্যাস:</Label>
              </div>
              <RadioGroup
                value={(question.columns || 1).toString()}
                onValueChange={(value) => onUpdate(question.id, { columns: parseInt(value) })}
                className="flex !mt-0 space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id={`columns-1-${question.id}`} />
                  <Label htmlFor={`columns-1-${question.id}`} className="text-sm bangla-text">১ </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id={`columns-2-${question.id}`} />
                  <Label htmlFor={`columns-2-${question.id}`} className="text-sm bangla-text">২ </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Line Height Selector */}
            <div className="space-y-2 !mt-0 flex items-center gap-2">
              <div className="flex items-center space-x-2">
                <LineChart className="h-4 w-4 text-gray-500" />
                <Label className="text-sm font-medium">লাইন উচ্চতা:</Label>
              </div>
              <RadioGroup
                value={question.lineHeight || 'relaxed'}
                onValueChange={(value) => onUpdate(question.id, { lineHeight: value as 'normal' | 'relaxed' | 'loose' })}
                className="flex !mt-0 space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id={`lineheight-normal-${question.id}`} />
                  <Label htmlFor={`lineheight-normal-${question.id}`} className="text-sm bangla-text">সাধারণ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="relaxed" id={`lineheight-relaxed-${question.id}`} />
                  <Label htmlFor={`lineheight-relaxed-${question.id}`} className="text-sm bangla-text">মাঝারি</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="loose" id={`lineheight-loose-${question.id}`} />
                  <Label htmlFor={`lineheight-loose-${question.id}`} className="text-sm bangla-text">প্রশস্ত</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Options Grid */}
          <div className={`grid gap-3 ${getColumnClass(question.columns || 1)}`}>
            {question.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Circle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium flex-shrink-0 bangla-text">{optionLabels[optionIndex]}</span>
                  <div className="flex items-center space-x-2 flex-1">
                    <input
                      type="radio"
                      name={`correct_${question.id}`}
                      checked={question.correct_answer === optionLabels[optionIndex]}
                      onChange={() => onUpdate(question.id, { correct_answer: optionLabels[optionIndex] })}
                      className="text-green-600 flex-shrink-0"
                    />
                    <Label className="text-xs text-gray-500 flex-shrink-0">সঠিক</Label>
                  </div>
                </div>
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...(question.options || [])]
                    newOptions[optionIndex] = e.target.value
                    onUpdate(question.id, { options: newOptions })
                  }}
                  placeholder={`বিকল্প ${optionLabels[optionIndex]}`}
                  className={`w-full question-input bangla-text ${getLineHeightClass(question.lineHeight || 'relaxed')}`}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}