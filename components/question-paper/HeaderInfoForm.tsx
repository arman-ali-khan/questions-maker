'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
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
  return (
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
            />
          </div>
          <div>
            <Label htmlFor="exam_name">Exam Name</Label>
            <Input
              id="exam_name"
              value={headerInfo.exam_name}
              onChange={(e) => setHeaderInfo({...headerInfo, exam_name: e.target.value})}
              placeholder="Enter exam name"
            />
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={headerInfo.subject}
              onChange={(e) => setHeaderInfo({...headerInfo, subject: e.target.value})}
              placeholder="Enter subject"
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
  )
}