'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Save, Download } from 'lucide-react'
import { useQuestionPaperEdit } from '@/hooks/useQuestionPaperEdit'
import { usePDFDownload } from '@/hooks/usePDFDownload'
import { QuestionTabs } from '@/components/question-paper/QuestionTabs'
import { HeaderInfoForm } from '@/components/question-paper/HeaderInfoForm'
import { PageSettingsForm } from '@/components/question-paper/PageSettingsForm'

export default function EditPaperPage() {
  const [activeTab, setActiveTab] = useState('mcq')
  const previewRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const params = useParams()
  const paperId = params.id as string

  const {
    title,
    setTitle,
    headerInfo,
    setHeaderInfo,
    pageSettings,
    setPageSettings,
    questions,
    loading,
    saving,
    addMCQQuestion,
    addWrittenQuestion,
    updateQuestion,
    deleteQuestion,
    handleDragEnd,
    savePaper,
    totalMarks,
  } = useQuestionPaperEdit(paperId)

  const { downloadPDF, downloading } = usePDFDownload()

  const handleDownloadPDF = () => {
    downloadPDF(previewRef, title, pageSettings)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-medium text-lg border-none shadow-none focus:ring-0 px-0"
                placeholder="Question Paper Title"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={savePaper} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button 
                onClick={handleDownloadPDF} 
                disabled={downloading || questions.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                {downloading ? 'Downloading...' : 'Download PDF'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <QuestionTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              questions={questions}
              addMCQQuestion={addMCQQuestion}
              addWrittenQuestion={addWrittenQuestion}
              updateQuestion={updateQuestion}
              deleteQuestion={deleteQuestion}
              handleDragEnd={handleDragEnd}
              headerInfo={headerInfo}
              pageSettings={pageSettings}
              title={title}
              totalMarks={totalMarks}
              previewRef={previewRef}
            />
          </div>

          <div className="space-y-6">
            <HeaderInfoForm
              headerInfo={headerInfo}
              setHeaderInfo={setHeaderInfo}
              totalMarks={totalMarks}
            />

            <PageSettingsForm
              pageSettings={pageSettings}
              setPageSettings={setPageSettings}
            />
          </div>
        </div>
      </div>
    </div>
  )
}