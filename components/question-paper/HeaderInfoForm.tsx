'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import { HeaderInfo } from '@/types/question-paper'

interface HeaderInfoFormProps {
  headerInfo: HeaderInfo
  setHeaderInfo: (info: HeaderInfo) => void
  totalMarks: number
}

export function HeaderInfoForm({ 
  headerInfo, 
  setHeaderInfo, 
  totalMarks 
}: HeaderInfoFormProps) {
  const defaultInstructions = [
    'সব প্রশ্নের উত্তর দিতে হবে',
    'স্পষ্ট ও সুন্দর হাতের লেখায় লিখতে হবে',
    'প্রয়োজনে আলাদা উত্তরপত্র ব্যবহার করতে হবে',
    'প্রতিটি প্রশ্ন মনোযোগ দিয়ে পড়ে উত্তর দিতে হবে'
  ]

  const instructions = headerInfo.instructions || defaultInstructions

  const addInstruction = () => {
    const newInstructions = [...instructions, '']
    setHeaderInfo({...headerInfo, instructions: newInstructions})
  }

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions]
    newInstructions[index] = value
    setHeaderInfo({...headerInfo, instructions: newInstructions})
  }

  const removeInstruction = (index: number) => {
    const newInstructions = instructions.filter((_, i) => i !== index)
    setHeaderInfo({...headerInfo, instructions: newInstructions})
  }

  const resetToDefault = () => {
    setHeaderInfo({...headerInfo, instructions: defaultInstructions})
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Header Information</CardTitle>
          <CardDescription>Set up your question paper header</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="school_name">School Name</Label>
              <Input
                id="school_name"
                value={headerInfo.school_name}
                onChange={(e) => setHeaderInfo({...headerInfo, school_name: e.target.value})}
                placeholder="Enter school name"
                className="bangla-text"
              />
            </div>
            <div>
              <Label htmlFor="school_address">School Address</Label>
              <Textarea
                id="school_address"
                value={headerInfo.school_address}
                onChange={(e) => setHeaderInfo({...headerInfo, school_address: e.target.value})}
                placeholder="Enter school address"
                rows={2}
                className="bangla-text"
              />
            </div>
            <div>
              <Label htmlFor="exam_name">Exam Name</Label>
              <Input
                id="exam_name"
                value={headerInfo.exam_name}
                onChange={(e) => setHeaderInfo({...headerInfo, exam_name: e.target.value})}
                placeholder="Enter exam name"
                className="bangla-text"
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={headerInfo.subject}
                onChange={(e) => setHeaderInfo({...headerInfo, subject: e.target.value})}
                placeholder="Enter subject"
                className="bangla-text"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={headerInfo.date}
                  onChange={(e) => setHeaderInfo({...headerInfo, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  value={headerInfo.time}
                  onChange={(e) => setHeaderInfo({...headerInfo, time: e.target.value})}
                  placeholder="2 hours"
                  className="bangla-text"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="marks">Total Marks</Label>
              <Input
                id="marks"
                value={headerInfo.marks || totalMarks.toString()}
                onChange={(e) => setHeaderInfo({...headerInfo, marks: e.target.value})}
                placeholder={totalMarks.toString()}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Instructions</CardTitle>
              <CardDescription>Customize the instructions for your question paper</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={resetToDefault}>
                Reset to Default
              </Button>
              <Button variant="outline" size="sm" onClick={addInstruction}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {instructions.map((instruction, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
              <Input
                value={instruction}
                onChange={(e) => updateInstruction(index, e.target.value)}
                placeholder="Enter instruction"
                className="flex-1 bangla-text"
              />
              {instructions.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeInstruction(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {instructions.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <p className="text-sm">No instructions added yet</p>
              <Button variant="outline" size="sm" onClick={addInstruction} className="mt-2">
                <Plus className="h-4 w-4 mr-1" />
                Add First Instruction
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}