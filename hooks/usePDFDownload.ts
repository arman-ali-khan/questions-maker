'use client'

import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { PageSettings } from '@/types/question-paper'

export function usePDFDownload() {
  const [downloading, setDownloading] = useState(false)
  const { toast } = useToast()

  const downloadPDF = async (
    previewRef: React.RefObject<HTMLDivElement>,
    title: string,
    pageSettings: PageSettings
  ) => {
    if (!previewRef.current) return

    setDownloading(true)
    try {
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default

      const element = previewRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
      })

      const imgData = canvas.toDataURL('image/png')
      
      // Get page dimensions in mm
      let pdfWidth = 210 // A4 width in mm
      let pdfHeight = 297 // A4 height in mm
      
      if (pageSettings.page_size === 'A5') {
        pdfWidth = 148
        pdfHeight = 210
      } else if (pageSettings.page_size === 'Letter') {
        pdfWidth = 216
        pdfHeight = 279
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidth, pdfHeight],
      })

      const imgWidth = pdfWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`${title}.pdf`)

      toast({
        title: 'Success',
        description: 'PDF downloaded successfully',
      })
    } catch (error: any) {
      console.error('PDF generation error:', error)
      toast({
        title: 'Error',
        description: 'Failed to download PDF. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setDownloading(false)
    }
  }

  return { downloadPDF, downloading }
}