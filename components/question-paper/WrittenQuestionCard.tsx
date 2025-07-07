'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, LineChart } from 'lucide-react'
import { Question } from '@/types/question-paper'

interface WrittenQuestionCardProps {
  question: Question
  index: number
  onUpdate: (id: string, updates: Partial<Question>) => void
  onDelete: (id: string) => void
}

export function WrittenQuestionCard({ 
  question, 
  index, 
  onUpdate, 
  onDelete 
}: WrittenQuestionCardProps) {
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
              <span className="text-sm text-gray-500">লিখিত</span>
            </div>
            <Textarea
              value={question.question_text}
              onChange={(e) => onUpdate(question.id, { question_text: e.target.value })}
              placeholder="এখানে আপনার প্রশ্ন লিখুন..."
              rows={3}
              className={`question-textarea bangla-text ${getLineHeightClass(question.lineHeight || 'relaxed')}`}
            />
            
            {/* Line Height Control */}
            <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-200">
              <LineChart className="h-4 w-4 text-gray-500" />
              <Label className="text-sm font-medium">লাইন উচ্চতা:</Label>
              <Select 
                value={question.lineHeight || 'relaxed'} 
                onValueChange={(value) => onUpdate(question.id, { lineHeight: value as 'normal' | 'relaxed' | 'loose' })}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">সাধারণ</SelectItem>
                  <SelectItem value="relaxed">মাঝারি</SelectItem>
                  <SelectItem value="loose">প্রশস্ত</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
    </Card>
  )
}