import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  FileCode,
  FileSpreadsheet,
  FileImage,
  File,
  FolderOpen,
  Save,
  Download,
  Upload,
  Plus,
  X,
  ChevronRight,
  Maximize2,
  Minimize2,
  FileJson,
  FileType,
} from 'lucide-react'

// Editors
import CodeEditor from './editors/CodeEditor'
import RichTextEditor from './editors/RichTextEditor'
import SpreadsheetEditor from './editors/SpreadsheetEditor'
import PdfViewer from './editors/PdfViewer'
import ImageViewer from './editors/ImageViewer'
import MarkdownEditor from './editors/MarkdownEditor'

export interface OpenFile {
  id: string
  name: string
  path: string
  type: FileType
  content: any
  modified: boolean
  language?: string
}

export type FileType =
  | 'code'
  | 'richtext'
  | 'spreadsheet'
  | 'pdf'
  | 'image'
  | 'markdown'
  | 'text'
  | 'unknown'

const fileTypeMap: Record<string, { type: FileType; language?: string }> = {
  // Code files
  '.js': { type: 'code', language: 'javascript' },
  '.jsx': { type: 'code', language: 'javascript' },
  '.ts': { type: 'code', language: 'typescript' },
  '.tsx': { type: 'code', language: 'typescript' },
  '.py': { type: 'code', language: 'python' },
  '.java': { type: 'code', language: 'java' },
  '.c': { type: 'code', language: 'c' },
  '.cpp': { type: 'code', language: 'cpp' },
  '.cs': { type: 'code', language: 'csharp' },
  '.go': { type: 'code', language: 'go' },
  '.rs': { type: 'code', language: 'rust' },
  '.rb': { type: 'code', language: 'ruby' },
  '.php': { type: 'code', language: 'php' },
  '.swift': { type: 'code', language: 'swift' },
  '.kt': { type: 'code', language: 'kotlin' },
  '.scala': { type: 'code', language: 'scala' },
  '.r': { type: 'code', language: 'r' },
  '.sql': { type: 'code', language: 'sql' },
  '.sh': { type: 'code', language: 'shell' },
  '.bash': { type: 'code', language: 'shell' },
  '.ps1': { type: 'code', language: 'powershell' },
  '.html': { type: 'code', language: 'html' },
  '.htm': { type: 'code', language: 'html' },
  '.css': { type: 'code', language: 'css' },
  '.scss': { type: 'code', language: 'scss' },
  '.sass': { type: 'code', language: 'scss' },
  '.less': { type: 'code', language: 'less' },
  '.json': { type: 'code', language: 'json' },
  '.xml': { type: 'code', language: 'xml' },
  '.yaml': { type: 'code', language: 'yaml' },
  '.yml': { type: 'code', language: 'yaml' },
  '.toml': { type: 'code', language: 'toml' },
  '.ini': { type: 'code', language: 'ini' },
  '.cfg': { type: 'code', language: 'ini' },
  '.conf': { type: 'code', language: 'ini' },
  '.vue': { type: 'code', language: 'vue' },
  '.svelte': { type: 'code', language: 'svelte' },

  // Text files
  '.txt': { type: 'text' },
  '.log': { type: 'text' },
  '.csv': { type: 'spreadsheet' },

  // Rich text / Documents
  '.doc': { type: 'richtext' },
  '.docx': { type: 'richtext' },
  '.rtf': { type: 'richtext' },
  '.odt': { type: 'richtext' },

  // Spreadsheets
  '.xls': { type: 'spreadsheet' },
  '.xlsx': { type: 'spreadsheet' },
  '.ods': { type: 'spreadsheet' },

  // PDF
  '.pdf': { type: 'pdf' },

  // Images
  '.png': { type: 'image' },
  '.jpg': { type: 'image' },
  '.jpeg': { type: 'image' },
  '.gif': { type: 'image' },
  '.bmp': { type: 'image' },
  '.svg': { type: 'image' },
  '.webp': { type: 'image' },
  '.ico': { type: 'image' },
  '.tiff': { type: 'image' },
  '.tif': { type: 'image' },

  // Markdown
  '.md': { type: 'markdown' },
  '.markdown': { type: 'markdown' },
  '.mdx': { type: 'markdown' },
}

function getFileType(filename: string): { type: FileType; language?: string } {
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase()
  return fileTypeMap[ext] || { type: 'unknown' }
}

function getFileIcon(type: FileType) {
  switch (type) {
    case 'code':
      return FileCode
    case 'richtext':
      return FileText
    case 'spreadsheet':
      return FileSpreadsheet
    case 'image':
      return FileImage
    case 'pdf':
      return File
    case 'markdown':
      return FileType
    default:
      return FileJson
  }
}

function FileTab({ file, isActive, onSelect, onClose }: {
  file: OpenFile
  isActive: boolean
  onSelect: () => void
  onClose: () => void
}) {
  const Icon = getFileIcon(file.type)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`flex items-center gap-2 px-4 py-2 cursor-pointer border-b-2 transition-all ${
        isActive
          ? 'bg-white/10 border-indigo-500 text-white'
          : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
      }`}
      onClick={onSelect}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm max-w-[120px] truncate">{file.name}</span>
      {file.modified && <span className="w-2 h-2 rounded-full bg-orange-400" />}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className="p-0.5 rounded hover:bg-white/20 ml-1"
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  )
}

function WelcomeScreen({ onNewFile, onOpenFile }: {
  onNewFile: (type: FileType) => void
  onOpenFile: () => void
}) {
  const newFileOptions = [
    { type: 'text' as FileType, label: 'Text File', icon: FileText, color: 'from-blue-500 to-cyan-500' },
    { type: 'code' as FileType, label: 'Code File', icon: FileCode, color: 'from-green-500 to-emerald-500' },
    { type: 'richtext' as FileType, label: 'Document', icon: FileText, color: 'from-purple-500 to-pink-500' },
    { type: 'spreadsheet' as FileType, label: 'Spreadsheet', icon: FileSpreadsheet, color: 'from-orange-500 to-amber-500' },
    { type: 'markdown' as FileType, label: 'Markdown', icon: FileType, color: 'from-indigo-500 to-violet-500' },
  ]

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-2xl">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <FileText className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Document Editor</h2>
        <p className="text-white/50 mb-8">
          Create and edit text files, code, documents, spreadsheets, and more
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {newFileOptions.map((option) => {
            const Icon = option.icon
            return (
              <motion.button
                key={option.type}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNewFile(option.type)}
                className="glass-card text-center hover:bg-white/10"
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium text-white">{option.label}</p>
              </motion.button>
            )
          })}
        </div>

        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenFile}
            className="glass-button flex items-center gap-2"
          >
            <FolderOpen className="w-5 h-5" />
            Open File
          </motion.button>
        </div>

        <div className="mt-12 text-left">
          <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-4">
            Supported File Types
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white/60">
            <div>
              <p className="font-medium text-white/80 mb-1">Code</p>
              <p>.js, .ts, .py, .java, .c, .cpp, .go, .rs, .rb, .php, .html, .css, .json, .xml, .yaml</p>
            </div>
            <div>
              <p className="font-medium text-white/80 mb-1">Documents</p>
              <p>.doc, .docx, .rtf, .odt, .txt</p>
            </div>
            <div>
              <p className="font-medium text-white/80 mb-1">Spreadsheets</p>
              <p>.xls, .xlsx, .csv, .ods</p>
            </div>
            <div>
              <p className="font-medium text-white/80 mb-1">Other</p>
              <p>.pdf, .md, .png, .jpg, .gif, .svg</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Editor() {
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([])
  const [activeFileId, setActiveFileId] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const activeFile = openFiles.find((f) => f.id === activeFileId)

  const createNewFile = useCallback((type: FileType) => {
    const extensions: Record<FileType, string> = {
      code: '.js',
      text: '.txt',
      richtext: '.docx',
      spreadsheet: '.xlsx',
      markdown: '.md',
      pdf: '.pdf',
      image: '.png',
      unknown: '.txt',
    }

    const newFile: OpenFile = {
      id: crypto.randomUUID(),
      name: `Untitled${extensions[type]}`,
      path: '',
      type,
      content: type === 'spreadsheet' ? [[]] : '',
      modified: false,
      language: type === 'code' ? 'javascript' : undefined,
    }

    setOpenFiles((prev) => [...prev, newFile])
    setActiveFileId(newFile.id)
  }, [])

  const openFileFromDisk = useCallback(async () => {
    // Create file input
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = Object.keys(fileTypeMap).join(',')

    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files
      if (!files) return

      for (const file of Array.from(files)) {
        const { type, language } = getFileType(file.name)

        let content: any = ''

        if (type === 'image') {
          content = URL.createObjectURL(file)
        } else if (type === 'pdf') {
          content = URL.createObjectURL(file)
        } else if (type === 'spreadsheet') {
          // Will be handled by SpreadsheetEditor
          const arrayBuffer = await file.arrayBuffer()
          content = arrayBuffer
        } else if (type === 'richtext') {
          // Will be handled by RichTextEditor
          const arrayBuffer = await file.arrayBuffer()
          content = arrayBuffer
        } else {
          content = await file.text()
        }

        const newFile: OpenFile = {
          id: crypto.randomUUID(),
          name: file.name,
          path: file.name,
          type,
          content,
          modified: false,
          language,
        }

        setOpenFiles((prev) => [...prev, newFile])
        setActiveFileId(newFile.id)
      }
    }

    input.click()
  }, [])

  const updateFileContent = useCallback((fileId: string, content: any) => {
    setOpenFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, content, modified: true } : f
      )
    )
  }, [])

  const closeFile = useCallback((fileId: string) => {
    setOpenFiles((prev) => {
      const newFiles = prev.filter((f) => f.id !== fileId)
      if (activeFileId === fileId) {
        setActiveFileId(newFiles.length > 0 ? newFiles[newFiles.length - 1].id : null)
      }
      return newFiles
    })
  }, [activeFileId])

  const saveFile = useCallback(async (fileId: string) => {
    const file = openFiles.find((f) => f.id === fileId)
    if (!file) return

    // For now, trigger download
    let blob: Blob
    let filename = file.name

    if (file.type === 'spreadsheet') {
      // Handle via SpreadsheetEditor
      return
    } else if (file.type === 'richtext') {
      // Handle via RichTextEditor
      return
    } else {
      blob = new Blob([file.content], { type: 'text/plain' })
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)

    setOpenFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, modified: false } : f))
    )
  }, [openFiles])

  const renderEditor = () => {
    if (!activeFile) return null

    switch (activeFile.type) {
      case 'code':
      case 'text':
        return (
          <CodeEditor
            content={activeFile.content}
            language={activeFile.language || 'plaintext'}
            onChange={(content) => updateFileContent(activeFile.id, content)}
          />
        )
      case 'richtext':
        return (
          <RichTextEditor
            content={activeFile.content}
            onChange={(content) => updateFileContent(activeFile.id, content)}
            onSave={() => saveFile(activeFile.id)}
          />
        )
      case 'spreadsheet':
        return (
          <SpreadsheetEditor
            content={activeFile.content}
            filename={activeFile.name}
            onChange={(content) => updateFileContent(activeFile.id, content)}
          />
        )
      case 'pdf':
        return <PdfViewer url={activeFile.content} />
      case 'image':
        return <ImageViewer url={activeFile.content} filename={activeFile.name} />
      case 'markdown':
        return (
          <MarkdownEditor
            content={activeFile.content}
            onChange={(content) => updateFileContent(activeFile.id, content)}
          />
        )
      default:
        return (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-white/50">Unsupported file type</p>
          </div>
        )
    }
  }

  return (
    <div className={`flex flex-col h-full ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900' : ''}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 glass-dark">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => createNewFile('text')}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white"
            title="New File"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openFileFromDisk}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white"
            title="Open File"
          >
            <FolderOpen className="w-5 h-5" />
          </motion.button>
          {activeFile && (
            <>
              <div className="w-px h-6 bg-white/10 mx-2" />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => saveFile(activeFile.id)}
                className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white"
                title="Save"
              >
                <Save className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => saveFile(activeFile.id)}
                className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </motion.button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white"
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      {openFiles.length > 0 && (
        <div className="flex items-center overflow-x-auto border-b border-white/10 bg-black/20">
          <AnimatePresence>
            {openFiles.map((file) => (
              <FileTab
                key={file.id}
                file={file}
                isActive={file.id === activeFileId}
                onSelect={() => setActiveFileId(file.id)}
                onClose={() => closeFile(file.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Editor area */}
      <div className="flex-1 overflow-hidden">
        {openFiles.length === 0 ? (
          <WelcomeScreen onNewFile={createNewFile} onOpenFile={openFileFromDisk} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFileId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              {renderEditor()}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
