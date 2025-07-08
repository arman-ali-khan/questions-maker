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

  const handlePrint = () => {
    // Add print styles to the current document
    const printStyles = document.createElement('style')
    printStyles.id = 'print-styles'
    printStyles.textContent = `
      @media print {
        /* Hide everything except preview content */
        body * {
          visibility: hidden;
        }
        
        .preview-content, .preview-content * {
          visibility: visible;
        }
        
        .preview-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          font-family: "Noto Serif Bengali", serif !important;
        }
        
        .preview-content * {
          font-family: "Noto Serif Bengali", serif !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
          text-rendering: optimizeLegibility !important;
        }
        
        /* Page settings */
        @page {
          margin: 0;
          size: A4;
        }
        
        /* Preserve spacing */
        .space-y-3 > * + * { margin-top: 0.75rem !important; }
        .space-y-4 > * + * { margin-top: 1rem !important; }
        .space-y-6 > * + * { margin-top: 1.5rem !important; }
        .space-y-8 > * + * { margin-top: 2rem !important; }
        .mb-3 { margin-bottom: 0.75rem !important; }
        .mb-4 { margin-bottom: 1rem !important; }
        .mb-6 { margin-bottom: 1.5rem !important; }
        .mb-8 { margin-bottom: 2rem !important; }
        .mt-6 { margin-top: 1.5rem !important; }
        .p-6 { padding: 1.5rem !important; }
        .pb-6 { padding-bottom: 1.5rem !important; }
        .pb-4 { padding-bottom: 1rem !important; }
        .ml-4 { margin-left: 1rem !important; }
        .ml-6 { margin-left: 1.5rem !important; }
        .mr-2 { margin-right: 0.5rem !important; }
        .mr-3 { margin-right: 0.75rem !important; }
        
        /* Text styles */
        .text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
        .text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
        .text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
        .text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
        .font-bold { font-weight: 700 !important; }
        .font-semibold { font-weight: 600 !important; }
        .font-medium { font-weight: 500 !important; }
        
        /* Line heights */
        .leading-normal { line-height: 1.5 !important; }
        .leading-relaxed { line-height: 1.625 !important; }
        .leading-loose { line-height: 2 !important; }
        
        /* Grid layouts */
        .grid-cols-1 { display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
        .grid-cols-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        .grid-cols-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
        .grid { display: grid !important; }
        .gap-2 { gap: 0.5rem !important; }
        .gap-3 { gap: 0.75rem !important; }
        .gap-6 { gap: 1.5rem !important; }
        
        /* Borders */
        .border-b-2 { border-bottom-width: 2px !important; }
        .border-gray-800 { border-color: rgb(31, 41, 55) !important; }
        .border-gray-300 { border-color: rgb(209, 213, 219) !important; }
        .border-gray-600 { border-color: rgb(75, 85, 99) !important; }
        
        /* Colors */
        .text-gray-900 { color: rgb(17, 24, 39) !important; }
        .text-gray-700 { color: rgb(55, 65, 81) !important; }
        .text-gray-600 { color: rgb(75, 85, 99) !important; }
        .text-gray-500 { color: rgb(107, 114, 128) !important; }
        .text-gray-800 { color: rgb(31, 41, 55) !important; }
        .bg-gray-200 { background-color: rgb(229, 231, 235) !important; }
        
        /* Flexbox */
        .flex { display: flex !important; }
        .items-center { align-items: center !important; }
        .items-start { align-items: flex-start !important; }
        .justify-between { justify-content: space-between !important; }
        .justify-center { justify-content: center !important; }
        .text-center { text-align: center !important; }
        .text-left { text-align: left !important; }
        .text-right { text-align: right !important; }
        
        /* Spacing utilities */
        .w-5 { width: 1.25rem !important; }
        .h-5 { height: 1.25rem !important; }
        .rounded-full { border-radius: 9999px !important; }
        .flex-shrink-0 { flex-shrink: 0 !important; }
        .mt-0\.5 { margin-top: 0.125rem !important; }
        .break-words { word-wrap: break-word !important; }
        .flex-1 { flex: 1 1 0% !important; }
        .break-inside-avoid { break-inside: avoid !important; }
        
        /* List styles */
        .list-disc { list-style-type: disc !important; }
        .list-inside { list-style-position: inside !important; }
        
        /* Hide page numbers and other print elements */
        .absolute { display: none !important; }
        
        /* Ensure proper page breaks */
        .page-content {
          page-break-after: always;
          box-shadow: none !important;
          border: none !important;
        }
        
        .page-content:last-child {
          page-break-after: auto;
        }
      }
    `
    
    // Add styles to document head
    document.head.appendChild(printStyles)
    
    // Trigger print
    window.print()
    
    // Clean up styles after printing
    setTimeout(() => {
      const existingStyles = document.getElementById('print-styles')
      if (existingStyles) {
        existingStyles.remove()
      }
    }, 1000)
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
                variant="outline" 
                onClick={handlePrint} 
                disabled={questions.length === 0}
                className="text-gray-600 hover:text-gray-800"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
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