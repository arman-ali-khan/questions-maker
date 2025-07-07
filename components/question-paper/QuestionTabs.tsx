'use client'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, GripVertical, Eye } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Question, HeaderInfo, PageSettings } from '@/types/question-paper'
import { MCQQuestionCard } from './MCQQuestionCard'
import { WrittenQuestionCard } from './WrittenQuestionCard'
import { QuestionPaperPreview } from './QuestionPaperPreview'

interface QuestionTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  questions: Question[]
  addMCQQuestion: () => void
  addWrittenQuestion: () => void
  updateQuestion: (id: string, updates: Partial<Question>) => void
  deleteQuestion: (id: string) => void
  handleDragEnd: (result: any) => void
  headerInfo: HeaderInfo
  pageSettings: PageSettings
  title: string
  totalMarks: number
  previewRef: React.RefObject<HTMLDivElement>
}

export function QuestionTabs({
  activeTab,
  setActiveTab,
  questions,
  addMCQQuestion,
  addWrittenQuestion,
  updateQuestion,
  deleteQuestion,
  handleDragEnd,
  headerInfo,
  pageSettings,
  title,
  totalMarks,
  previewRef
}: QuestionTabsProps) {
  const getPageDimensions = () => {
    switch (pageSettings.page_size) {
      case 'A4':
        return { width: '210mm', height: '297mm' }
      case 'A5':
        return { width: '148mm', height: '210mm' }
      case 'Letter':
        return { width: '8.5in', height: '11in' }
      default:
        return { width: '210mm', height: '297mm' }
    }
  }

  const mcqQuestions = questions.filter(q => q.type === 'mcq')
  const writtenQuestions = questions.filter(q => q.type === 'written')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="mcq">
          MCQ Questions
          {mcqQuestions.length > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {mcqQuestions.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="written">
          Written Questions
          {writtenQuestions.length > 0 && (
            <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              {writtenQuestions.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="all">All Questions</TabsTrigger>
        <TabsTrigger value="preview">
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </TabsTrigger>
      </TabsList>

      <TabsContent value="mcq" className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Multiple Choice Questions</h3>
            <p className="text-sm text-gray-600 mt-1">
              Create MCQ questions with customizable column layouts for options
            </p>
          </div>
          <Button onClick={addMCQQuestion} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add MCQ
          </Button>
        </div>
        
        <div className="space-y-6">
          {mcqQuestions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-gray-500">
                <Plus className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                <p className="text-lg font-medium mb-2">No MCQ questions yet</p>
                <p className="text-sm mb-4">Add your first multiple choice question to get started</p>
                <Button onClick={addMCQQuestion} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First MCQ
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {mcqQuestions.map((question, index) => (
                <MCQQuestionCard
                  key={question.id}
                  question={question}
                  index={index + 1}
                  onUpdate={updateQuestion}
                  onDelete={deleteQuestion}
                />
              ))}
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="written" className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Written Questions</h3>
            <p className="text-sm text-gray-600 mt-1">
              Create long-answer and short-answer questions
            </p>
          </div>
          <Button onClick={addWrittenQuestion} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Written
          </Button>
        </div>
        <div className="space-y-4">
          {writtenQuestions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-gray-500">
                <Plus className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                <p className="text-lg font-medium mb-2">No written questions yet</p>
                <p className="text-sm mb-4">Add your first written question to get started</p>
                <Button onClick={addWrittenQuestion} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Written Question
                </Button>
              </div>
            </div>
          ) : (
            writtenQuestions.map((question, index) => (
              <WrittenQuestionCard
                key={question.id}
                question={question}
                index={index + 1}
                onUpdate={updateQuestion}
                onDelete={deleteQuestion}
              />
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="all" className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">All Questions</h3>
            <p className="text-sm text-gray-600 mt-1">
              Manage and reorder all your questions with drag & drop
            </p>
          </div>
          <div className="space-x-2">
            <Button onClick={addMCQQuestion} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add MCQ
            </Button>
            <Button onClick={addWrittenQuestion} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Written
            </Button>
          </div>
        </div>
        
        {questions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-gray-500">
              <Plus className="h-8 w-8 mx-auto mb-3 text-gray-400" />
              <p className="text-lg font-medium mb-2">No questions yet</p>
              <p className="text-sm mb-4">Start building your question paper</p>
              <div className="space-x-2">
                <Button onClick={addMCQQuestion} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add MCQ
                </Button>
                <Button onClick={addWrittenQuestion} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Written
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {questions.map((question, index) => (
                    <Draggable key={question.id} draggableId={question.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-start space-x-2"
                        >
                          <div {...provided.dragHandleProps} className="pt-4">
                            <GripVertical className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          </div>
                          {question.type === 'mcq' ? (
                            <MCQQuestionCard
                              question={question}
                              index={index + 1}
                              onUpdate={updateQuestion}
                              onDelete={deleteQuestion}
                            />
                          ) : (
                            <WrittenQuestionCard
                              question={question}
                              index={index + 1}
                              onUpdate={updateQuestion}
                              onDelete={deleteQuestion}
                            />
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </TabsContent>

      <TabsContent value="preview" className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Question Paper Preview</h3>
            <p className="text-sm text-gray-600 mt-1">
              See exactly how your question paper will look when printed
            </p>
          </div>
          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
            <span className="font-medium">Total Questions:</span> {questions.length} | 
            <span className="font-medium ml-2">Total Marks:</span> {totalMarks}
          </div>
        </div>
        
        {questions.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Eye className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium text-gray-600 mb-2">No questions to preview</p>
            <p className="text-sm text-gray-500 mb-4">Add some questions to see the preview</p>
            <div className="space-x-2">
              <Button onClick={addMCQQuestion} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add MCQ
              </Button>
              <Button onClick={addWrittenQuestion} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Written
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white border rounded-lg overflow-hidden shadow-lg">
            <div 
              ref={previewRef}
              className="preview-content mx-auto bg-white"
              style={{
                width: getPageDimensions().width,
                minHeight: getPageDimensions().height,
                padding: `${pageSettings.margins.top}mm ${pageSettings.margins.right}mm ${pageSettings.margins.bottom}mm ${pageSettings.margins.left}mm`,
                direction: pageSettings.language_direction === 'rtl' ? 'rtl' : 'ltr',
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#000',
              }}
            >
              <QuestionPaperPreview 
                headerInfo={headerInfo}
                questions={questions}
                title={title}
                totalMarks={totalMarks}
              />
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}