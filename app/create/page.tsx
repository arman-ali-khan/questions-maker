'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Save, Download } from 'lucide-react'
import { useQuestionPaper } from '@/hooks/useQuestionPaper'
import { usePDFDownload } from '@/hooks/usePDFDownload'
import { QuestionTabs } from '@/components/question-paper/QuestionTabs'
import { HeaderInfoForm } from '@/components/question-paper/HeaderInfoForm'
import { PageSettingsForm } from '@/components/question-paper/PageSettingsForm'

export default function CreatePaperPage() {
  const [activeTab, setActiveTab] = useState('mcq')
  const previewRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const {
    title,
    setTitle,
    headerInfo,
    setHeaderInfo,
    pageSettings,
    setPageSettings,
    questions,
    saving,
    hasUnsavedChanges,
    lastSaved,
    addMCQQuestion,
    addWrittenQuestion,
    updateQuestion,
    deleteQuestion,
    handleDragEnd,
    savePaper,
    totalMarks,
  } = useQuestionPaper()

  const { downloadPDF, downloading } = usePDFDownload()

  const handleDownloadPDF = () => {
    downloadPDF(previewRef, title, pageSettings)
  }

  // Format last saved time
  const formatLastSaved = (date: Date | null) => {
    if (!date) return ''
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return date.toLocaleDateString()
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
              {/* Save status indicator */}
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                {hasUnsavedChanges && (
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Unsaved changes</span>
                  </span>
                )}
                {!hasUnsavedChanges && lastSaved && (
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Saved {formatLastSaved(lastSaved)}</span>
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={savePaper} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save (Ctrl+S)'}
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