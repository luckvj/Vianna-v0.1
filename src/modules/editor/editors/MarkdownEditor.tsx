import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link,
  Image,
  List,
  ListOrdered,
  Quote,
  Table,
  Eye,
  Edit3,
  Columns,
  Download,
  Heading1,
  Heading2,
  Heading3,
  CheckSquare,
  Minus,
} from 'lucide-react'

interface MarkdownEditorProps {
  content: string
  onChange: (content: string) => void
}

type ViewMode = 'edit' | 'preview' | 'split'

function ToolbarButton({ onClick, children, title }: {
  onClick: () => void
  children: React.ReactNode
  title: string
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      title={title}
      className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
    >
      {children}
    </motion.button>
  )
}

export default function MarkdownEditor({ content, onChange }: MarkdownEditorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 })

  const insertText = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end)

    onChange(newText)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const insertAtLineStart = (prefix: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const lineStart = content.lastIndexOf('\n', start - 1) + 1
    const newText = content.substring(0, lineStart) + prefix + content.substring(lineStart)

    onChange(newText)
  }

  const toolbarActions = {
    bold: () => insertText('**', '**'),
    italic: () => insertText('*', '*'),
    strikethrough: () => insertText('~~', '~~'),
    code: () => insertText('`', '`'),
    codeBlock: () => insertText('\n```\n', '\n```\n'),
    link: () => insertText('[', '](url)'),
    image: () => insertText('![alt](', ')'),
    h1: () => insertAtLineStart('# '),
    h2: () => insertAtLineStart('## '),
    h3: () => insertAtLineStart('### '),
    bulletList: () => insertAtLineStart('- '),
    numberedList: () => insertAtLineStart('1. '),
    taskList: () => insertAtLineStart('- [ ] '),
    quote: () => insertAtLineStart('> '),
    horizontalRule: () => insertText('\n---\n'),
    table: () => insertText('\n| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n'),
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement
    const text = textarea.value.substring(0, textarea.selectionStart)
    const lines = text.split('\n')
    setCursorPosition({
      line: lines.length,
      col: lines[lines.length - 1].length + 1,
    })
  }

  const exportMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  const wordCount = useMemo(() => {
    return content.trim().split(/\s+/).filter(Boolean).length
  }, [content])

  return (
    <div className="h-full flex flex-col bg-slate-900/50">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-1">
          {/* Headings */}
          <ToolbarButton onClick={toolbarActions.h1} title="Heading 1">
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={toolbarActions.h2} title="Heading 2">
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={toolbarActions.h3} title="Heading 3">
            <Heading3 className="w-4 h-4" />
          </ToolbarButton>

          <div className="w-px h-6 bg-white/10 mx-1" />

          {/* Text formatting */}
          <ToolbarButton onClick={toolbarActions.bold} title="Bold (Ctrl+B)">
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={toolbarActions.italic} title="Italic (Ctrl+I)">
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={toolbarActions.strikethrough} title="Strikethrough">
            <Strikethrough className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={toolbarActions.code} title="Inline Code">
            <Code className="w-4 h-4" />
          </ToolbarButton>

          <div className="w-px h-6 bg-white/10 mx-1" />

          {/* Links & Images */}
          <ToolbarButton onClick={toolbarActions.link} title="Insert Link">
            <Link className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={toolbarActions.image} title="Insert Image">
            <Image className="w-4 h-4" />
          </ToolbarButton>

          <div className="w-px h-6 bg-white/10 mx-1" />

          {/* Lists */}
          <ToolbarButton onClick={toolbarActions.bulletList} title="Bullet List">
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={toolbarActions.numberedList} title="Numbered List">
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={toolbarActions.taskList} title="Task List">
            <CheckSquare className="w-4 h-4" />
          </ToolbarButton>

          <div className="w-px h-6 bg-white/10 mx-1" />

          {/* Blocks */}
          <ToolbarButton onClick={toolbarActions.quote} title="Quote">
            <Quote className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={toolbarActions.table} title="Insert Table">
            <Table className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={toolbarActions.horizontalRule} title="Horizontal Rule">
            <Minus className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex glass rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('edit')}
              className={`p-1.5 rounded transition-all ${
                viewMode === 'edit' ? 'bg-indigo-500 text-white' : 'text-white/60'
              }`}
              title="Edit only"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`p-1.5 rounded transition-all ${
                viewMode === 'split' ? 'bg-indigo-500 text-white' : 'text-white/60'
              }`}
              title="Split view"
            >
              <Columns className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`p-1.5 rounded transition-all ${
                viewMode === 'preview' ? 'bg-indigo-500 text-white' : 'text-white/60'
              }`}
              title="Preview only"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportMarkdown}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor pane */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'flex-1'} flex flex-col border-r border-white/10`}>
            <textarea
              value={content}
              onChange={handleTextareaChange}
              onSelect={handleTextareaSelect}
              onKeyUp={handleTextareaSelect}
              onClick={handleTextareaSelect}
              className="flex-1 w-full p-6 bg-transparent text-white resize-none focus:outline-none font-mono text-sm leading-relaxed"
              placeholder="Start writing in Markdown..."
              spellCheck={false}
            />
          </div>
        )}

        {/* Preview pane */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'flex-1'} overflow-auto bg-slate-900/30`}>
            <div className="max-w-3xl mx-auto p-8 prose prose-invert prose-lg">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark as any}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  },
                }}
              >
                {content || '*Start typing to see preview*'}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1.5 border-t border-white/10 bg-black/20 text-xs text-white/50">
        <span>
          Ln {cursorPosition.line}, Col {cursorPosition.col}
        </span>
        <span>
          {wordCount} words • {content.length} characters
        </span>
      </div>

      <style>{`
        .prose h1 { color: white; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; }
        .prose h2 { color: white; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.3rem; }
        .prose h3, .prose h4 { color: white; }
        .prose p { color: rgba(255,255,255,0.8); }
        .prose a { color: #818cf8; }
        .prose strong { color: white; }
        .prose blockquote { border-left-color: #6366f1; color: rgba(255,255,255,0.7); }
        .prose code { background: rgba(0,0,0,0.3); padding: 0.2rem 0.4rem; border-radius: 0.25rem; }
        .prose pre { background: rgba(0,0,0,0.4); }
        .prose ul, .prose ol { color: rgba(255,255,255,0.8); }
        .prose li::marker { color: rgba(255,255,255,0.5); }
        .prose table { border-color: rgba(255,255,255,0.2); }
        .prose th, .prose td { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.8); }
        .prose th { background: rgba(255,255,255,0.05); }
        .prose hr { border-color: rgba(255,255,255,0.1); }
        .prose img { border-radius: 0.5rem; }
      `}</style>
    </div>
  )
}
