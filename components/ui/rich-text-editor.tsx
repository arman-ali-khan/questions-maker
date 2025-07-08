'use client'

import React, { useRef, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  lineHeight?: 'normal' | 'relaxed' | 'loose'
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter your question...',
  className,
  lineHeight = 'relaxed'
}: RichTextEditorProps) {
  const quillRef = useRef<any>(null)

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

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['link', 'formula'],
        ['clean']
      ],
      handlers: {
        // Custom handlers can be added here
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }), [])

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'align', 'direction',
    'script', 'formula'
  ]

  return (
    <div className={cn('rich-text-editor', className)}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className={cn(
          'question-textarea bangla-text',
          getLineHeightClass(lineHeight)
        )}
        style={{
          fontFamily: '"Noto Serif Bengali", serif',
        }}
      />
      
      <style jsx global>{`
        .rich-text-editor .ql-editor {
          font-family: "Noto Serif Bengali", serif !important;
          font-size: 14px;
          line-height: ${lineHeight === 'loose' ? '2' : lineHeight === 'normal' ? '1.5' : '1.625'};
          min-height: 80px;
          padding: 12px;
          border: none;
          background: transparent;
        }
        
        .rich-text-editor .ql-editor.ql-blank::before {
          font-family: "Noto Serif Bengali", serif !important;
          font-style: normal;
          color: hsl(var(--muted-foreground));
        }
        
        .rich-text-editor .ql-toolbar {
          border: 1px solid hsl(var(--border));
          border-bottom: none;
          border-radius: 6px 6px 0 0;
          background: hsl(var(--background));
          padding: 8px;
        }
        
        .rich-text-editor .ql-container {
          border: 1px solid hsl(var(--border));
          border-radius: 0 0 6px 6px;
          background: hsl(var(--background));
          font-family: "Noto Serif Bengali", serif !important;
        }
        
        .rich-text-editor .ql-toolbar .ql-stroke {
          fill: none;
          stroke: hsl(var(--foreground));
        }
        
        .rich-text-editor .ql-toolbar .ql-fill {
          fill: hsl(var(--foreground));
          stroke: none;
        }
        
        .rich-text-editor .ql-toolbar .ql-picker {
          color: hsl(var(--foreground));
        }
        
        .rich-text-editor .ql-toolbar button:hover,
        .rich-text-editor .ql-toolbar button:focus {
          color: hsl(var(--primary));
        }
        
        .rich-text-editor .ql-toolbar button.ql-active {
          color: hsl(var(--primary));
        }
        
        .rich-text-editor .ql-toolbar .ql-picker-options {
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          border-radius: 6px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .rich-text-editor .ql-toolbar .ql-picker-item:hover {
          background: hsl(var(--accent));
        }
        
        .rich-text-editor .ql-editor strong {
          font-weight: 600;
        }
        
        .rich-text-editor .ql-editor em {
          font-style: italic;
        }
        
        .rich-text-editor .ql-editor u {
          text-decoration: underline;
        }
        
        .rich-text-editor .ql-editor s {
          text-decoration: line-through;
        }
        
        .rich-text-editor .ql-editor ol,
        .rich-text-editor .ql-editor ul {
          padding-left: 1.5em;
        }
        
        .rich-text-editor .ql-editor blockquote {
          border-left: 4px solid hsl(var(--border));
          padding-left: 16px;
          margin-left: 0;
          margin-right: 0;
          font-style: italic;
        }
        
        .rich-text-editor .ql-editor .ql-align-center {
          text-align: center;
        }
        
        .rich-text-editor .ql-editor .ql-align-right {
          text-align: right;
        }
        
        .rich-text-editor .ql-editor .ql-align-justify {
          text-align: justify;
        }
        
        .rich-text-editor .ql-editor .ql-direction-rtl {
          direction: rtl;
          text-align: right;
        }
        
        /* Focus styles */
        .rich-text-editor .ql-container.ql-snow {
          border-color: hsl(var(--border));
        }
        
        .rich-text-editor:focus-within .ql-container.ql-snow {
          border-color: hsl(var(--ring));
          box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
        }
        
        .rich-text-editor:focus-within .ql-toolbar.ql-snow {
          border-color: hsl(var(--ring));
        }
        
        /* Floating toolbar styles */
        .rich-text-editor .ql-tooltip {
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          border-radius: 6px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          color: hsl(var(--foreground));
        }
        
        .rich-text-editor .ql-tooltip input {
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          border-radius: 4px;
          color: hsl(var(--foreground));
          padding: 4px 8px;
        }
        
        .rich-text-editor .ql-tooltip a {
          color: hsl(var(--primary));
        }
      `}</style>
    </div>
  )
}