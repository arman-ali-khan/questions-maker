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
      
      // Wait for fonts to load completely
      await document.fonts.ready
      
      // Add a small delay to ensure everything is rendered
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Ensure all images are loaded
      const images = element.querySelectorAll('img')
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve()
        return new Promise(resolve => {
          img.onload = resolve
          img.onerror = resolve
        })
      }))

      // Get all preview pages
      const previewPages = element.querySelectorAll('.preview-content > div')
      
      if (previewPages.length === 0) {
        throw new Error('No content found to generate PDF')
      }

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

      // Process each page
      for (let i = 0; i < previewPages.length; i++) {
        const page = previewPages[i] as HTMLElement
        
        // Create a temporary container with proper styling
        const tempContainer = document.createElement('div')
        tempContainer.style.position = 'absolute'
        tempContainer.style.left = '-9999px'
        tempContainer.style.top = '0'
        tempContainer.style.width = `${page.offsetWidth}px`
        tempContainer.style.height = `${page.offsetHeight}px`
        tempContainer.style.backgroundColor = '#ffffff'
        tempContainer.style.fontFamily = "'SolaimanLipi', Arial, sans-serif"
        tempContainer.style.fontSize = '14px'
        tempContainer.style.lineHeight = '1.5'
        tempContainer.style.color = '#000000'
        
        // Clone the page content
        const clonedPage = page.cloneNode(true) as HTMLElement
        tempContainer.appendChild(clonedPage)
        document.body.appendChild(tempContainer)
        
        // Apply styles to all elements in the cloned content
        const allElements = tempContainer.querySelectorAll('*')
        allElements.forEach((el: any) => {
          el.style.fontFamily = "'SolaimanLipi', Arial, sans-serif"
          el.style.webkitFontSmoothing = 'antialiased'
          el.style.mozOsxFontSmoothing = 'grayscale'
          
          // Preserve margins and padding
          const computedStyle = window.getComputedStyle(el)
          el.style.margin = computedStyle.margin
          el.style.padding = computedStyle.padding
          el.style.lineHeight = computedStyle.lineHeight
          el.style.fontSize = computedStyle.fontSize
          el.style.fontWeight = computedStyle.fontWeight
          el.style.color = computedStyle.color
          el.style.backgroundColor = computedStyle.backgroundColor
          el.style.border = computedStyle.border
          el.style.borderRadius = computedStyle.borderRadius
          el.style.textAlign = computedStyle.textAlign
        })
        
        // Wait a bit for styles to apply
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Create canvas for this specific page
        const canvas = await html2canvas(tempContainer, {
          scale: 2, // Good balance between quality and performance
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: tempContainer.offsetWidth,
          height: tempContainer.offsetHeight,
          scrollX: 0,
          scrollY: 0,
          windowWidth: tempContainer.offsetWidth,
          windowHeight: tempContainer.offsetHeight,
          ignoreElements: (element) => {
            // Ignore elements that might cause issues
            return element.classList?.contains('no-pdf') || false
          },
          onclone: (clonedDoc, element) => {
            // Inject comprehensive font styles
            const style = clonedDoc.createElement('style')
            style.textContent = `
              @import url('https://fonts.googleapis.com/css2?family=SolaimanLipi&display=swap');
              
              * {
                font-family: 'SolaimanLipi', Arial, sans-serif !important;
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
                text-rendering: optimizeLegibility !important;
              }
              
              body, html {
                font-family: 'SolaimanLipi', Arial, sans-serif !important;
                background: white !important;
              }
              
              .bangla-text, .bangla-text * {
                font-family: 'SolaimanLipi', Arial, sans-serif !important;
              }
              
              .preview-content, .preview-content * {
                font-family: 'SolaimanLipi', Arial, sans-serif !important;
              }
              
              /* Preserve spacing */
              .space-y-3 > * + * { margin-top: 0.75rem !important; }
              .space-y-4 > * + * { margin-top: 1rem !important; }
              .space-y-6 > * + * { margin-top: 1.5rem !important; }
              .mb-3 { margin-bottom: 0.75rem !important; }
              .mb-4 { margin-bottom: 1rem !important; }
              .mb-6 { margin-bottom: 1.5rem !important; }
              .mb-8 { margin-bottom: 2rem !important; }
              .mt-6 { margin-top: 1.5rem !important; }
              .p-6 { padding: 1.5rem !important; }
              .pb-6 { padding-bottom: 1.5rem !important; }
              .pb-4 { padding-bottom: 1rem !important; }
              .ml-6 { margin-left: 1.5rem !important; }
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
              .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
              .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
              .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
              .grid { display: grid !important; }
              .gap-3 { gap: 0.75rem !important; }
              .gap-6 { gap: 1.5rem !important; }
              
              /* Borders */
              .border-b-2 { border-bottom-width: 2px !important; }
              .border-gray-800 { border-color: rgb(31, 41, 55) !important; }
              .border-gray-300 { border-color: rgb(209, 213, 219) !important; }
              
              /* Colors */
              .text-gray-900 { color: rgb(17, 24, 39) !important; }
              .text-gray-700 { color: rgb(55, 65, 81) !important; }
              .text-gray-600 { color: rgb(75, 85, 99) !important; }
              .text-gray-500 { color: rgb(107, 114, 128) !important; }
              
              /* Flexbox */
              .flex { display: flex !important; }
              .items-center { align-items: center !important; }
              .items-start { align-items: flex-start !important; }
              .justify-between { justify-content: space-between !important; }
              .justify-center { justify-content: center !important; }
              .text-center { text-align: center !important; }
              .text-left { text-align: left !important; }
              .text-right { text-align: right !important; }
            `
            clonedDoc.head.appendChild(style)
            
            // Force font loading in cloned document
            const fontLink = clonedDoc.createElement('link')
            fontLink.href = 'https://fonts.googleapis.com/css2?family=SolaimanLipi&display=swap'
            fontLink.rel = 'stylesheet'
            clonedDoc.head.appendChild(fontLink)
          }
        })

        // Clean up temporary container
        document.body.removeChild(tempContainer)

        const imgData = canvas.toDataURL('image/png', 1.0)
        
        // Calculate dimensions to fit the page properly
        const imgWidth = pdfWidth
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        
        // Add new page if not the first page
        if (i > 0) {
          pdf.addPage([pdfWidth, pdfHeight])
        }
        
        // Add the image to PDF
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST')
      }

      // Save the PDF
      const fileName = title.replace(/[^a-z0-9\u0980-\u09FF]/gi, '_').toLowerCase() || 'question_paper'
      pdf.save(`${fileName}.pdf`)

      toast({
        title: 'Success',
        description: 'PDF downloaded successfully with proper formatting',
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