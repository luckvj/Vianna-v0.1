import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Folder,
  File as FileIcon,
  Image,
  FileText,
  Film,
  Music,
  Archive,
  Plus,
  Upload,
  Grid,
  List,
  MoreHorizontal,
  Trash2,
  Download,
  Eye,
} from 'lucide-react'
import { format } from 'date-fns'
import type { File as FileType, FileFolder } from '../../types'

// Sample data
const sampleFolders: FileFolder[] = [
  { id: 'documents', name: 'Documents', color: '#3b82f6', position: 0, created_at: Date.now() },
  { id: 'images', name: 'Images', color: '#10b981', position: 1, created_at: Date.now() },
  { id: 'projects', name: 'Projects', color: '#8b5cf6', position: 2, created_at: Date.now() },
]

const sampleFiles: FileType[] = [
  { id: '1', name: 'Project Proposal.pdf', path: '/documents/proposal.pdf', type: 'pdf', size: 2456789, folder_id: 'documents', created_at: Date.now() - 86400000 },
  { id: '2', name: 'Meeting Notes.docx', path: '/documents/notes.docx', type: 'docx', size: 45678, folder_id: 'documents', created_at: Date.now() - 172800000 },
  { id: '3', name: 'Screenshot.png', path: '/images/screenshot.png', type: 'png', size: 567890, folder_id: 'images', created_at: Date.now() - 3600000 },
  { id: '4', name: 'Logo Design.svg', path: '/images/logo.svg', type: 'svg', size: 12345, folder_id: 'images', created_at: Date.now() - 7200000 },
  { id: '5', name: 'Source Code.zip', path: '/projects/code.zip', type: 'zip', size: 45678901, folder_id: 'projects', created_at: Date.now() - 259200000 },
]

const getFileIcon = (type?: string) => {
  switch (type) {
    case 'pdf':
    case 'docx':
    case 'doc':
    case 'txt':
      return FileText
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return Image
    case 'mp4':
    case 'mov':
    case 'avi':
      return Film
    case 'mp3':
    case 'wav':
    case 'flac':
      return Music
    case 'zip':
    case 'rar':
    case '7z':
      return Archive
    default:
      return FileIcon
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

function FileCard({ file, viewMode }: { file: FileType; viewMode: 'grid' | 'list' }) {
  const Icon = getFileIcon(file.type)

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white/70" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium truncate">{file.name}</p>
          <p className="text-xs text-white/50">
            {formatFileSize(file.size || 0)} • {format(new Date(file.created_at), 'MMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 rounded-lg hover:bg-white/10">
            <Eye className="w-4 h-4 text-white/50" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10">
            <Download className="w-4 h-4 text-white/50" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10">
            <Trash2 className="w-4 h-4 text-white/50" />
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="glass-card cursor-pointer group"
    >
      {/* Preview area */}
      <div className="aspect-square rounded-xl bg-white/5 flex items-center justify-center mb-3">
        <Icon className="w-12 h-12 text-white/40" />
      </div>

      {/* File info */}
      <p className="text-white font-medium truncate mb-1">{file.name}</p>
      <p className="text-xs text-white/50">{formatFileSize(file.size || 0)}</p>

      {/* Actions */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 rounded-lg bg-black/40 hover:bg-black/60">
          <MoreHorizontal className="w-4 h-4 text-white" />
        </button>
      </div>
    </motion.div>
  )
}

function DropZone({ onDrop }: { onDrop: (files: FileList) => void }) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) {
      onDrop(e.dataTransfer.files)
    }
  }, [onDrop])

  return (
    <motion.div
      animate={{ scale: isDragging ? 1.02 : 1 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`drop-zone ${isDragging ? 'active' : ''}`}
    >
      <Upload className="w-12 h-12 mx-auto mb-4 text-white/30" />
      <p className="text-white/60 mb-2">Drag and drop files here</p>
      <p className="text-sm text-white/40">or click to browse</p>
    </motion.div>
  )
}

export default function Files() {
  const [files, setFiles] = useState<FileType[]>(sampleFiles)
  const [folders] = useState<FileFolder[]>(sampleFolders)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showDropZone, setShowDropZone] = useState(false)

  const filteredFiles = selectedFolderId
    ? files.filter((f) => f.folder_id === selectedFolderId)
    : files

  const handleFileDrop = (fileList: FileList) => {
    const newFiles: FileType[] = Array.from(fileList).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      path: URL.createObjectURL(file),
      type: file.name.split('.').pop(),
      size: file.size,
      folder_id: selectedFolderId || undefined,
      created_at: Date.now(),
    }))
    setFiles((prev) => [...newFiles, ...prev])
    setShowDropZone(false)
  }

  return (
    <div className="max-w-7xl mx-auto flex gap-6 h-[calc(100vh-150px)]">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <div className="glass-card h-full">
          {/* Storage info */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/50">Storage</span>
              <span className="text-sm text-white">2.4 GB / 10 GB</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-1/4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
            </div>
          </div>

          {/* Folders */}
          <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">
            Folders
          </h3>
          <div className="space-y-1 mb-6">
            <button
              onClick={() => setSelectedFolderId(null)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                selectedFolderId === null
                  ? 'bg-indigo-500/20 text-white'
                  : 'text-white/70 hover:bg-white/5'
              }`}
            >
              <Folder className="w-5 h-5" />
              <span>All Files</span>
              <span className="ml-auto text-sm text-white/50">{files.length}</span>
            </button>
            {folders.map((folder) => {
              const count = files.filter((f) => f.folder_id === folder.id).length
              return (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                    selectedFolderId === folder.id
                      ? 'bg-indigo-500/20 text-white'
                      : 'text-white/70 hover:bg-white/5'
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: folder.color }}
                  />
                  <span>{folder.name}</span>
                  <span className="ml-auto text-sm text-white/50">{count}</span>
                </button>
              )
            })}
          </div>

          {/* New folder */}
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/50 hover:bg-white/5">
            <Plus className="w-5 h-5" />
            <span>New Folder</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {selectedFolderId
              ? folders.find((f) => f.id === selectedFolderId)?.name
              : 'All Files'}
          </h2>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex glass rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-indigo-500 text-white' : 'text-white/60'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-indigo-500 text-white' : 'text-white/60'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDropZone(!showDropZone)}
              className="glass-button-primary flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload
            </motion.button>
          </div>
        </div>

        {/* Drop zone */}
        <AnimatePresence>
          {showDropZone && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <DropZone onDrop={handleFileDrop} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Files */}
        <div className="flex-1 overflow-auto">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {filteredFiles.map((file) => (
                  <FileCard key={file.id} file={file} viewMode="grid" />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="glass-card space-y-1">
              <AnimatePresence>
                {filteredFiles.map((file) => (
                  <FileCard key={file.id} file={file} viewMode="list" />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
