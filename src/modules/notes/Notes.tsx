import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Folder,
  Pin,
  MoreHorizontal,
  Trash2,
  Edit3,
  Clock,
} from 'lucide-react'
import { format } from 'date-fns'
import type { Note, NoteFolder } from '../../types'

// Sample data
const sampleFolders: NoteFolder[] = [
  { id: 'work', name: 'Work', color: '#3b82f6', position: 0, created_at: Date.now() },
  { id: 'personal', name: 'Personal', color: '#ec4899', position: 1, created_at: Date.now() },
  { id: 'ideas', name: 'Ideas', color: '#10b981', position: 2, created_at: Date.now() },
]

const sampleNotes: Note[] = [
  {
    id: '1',
    title: 'Meeting Notes - Q1 Planning',
    content: 'Discussed roadmap for Q1. Key priorities include:\n- Launch new dashboard\n- Improve performance\n- User feedback integration',
    folder_id: 'work',
    pinned: true,
    color: '#3b82f6',
    created_at: Date.now() - 86400000,
    updated_at: Date.now() - 3600000,
  },
  {
    id: '2',
    title: 'Book recommendations',
    content: '1. Atomic Habits\n2. Deep Work\n3. The Psychology of Money',
    folder_id: 'personal',
    pinned: false,
    created_at: Date.now() - 172800000,
    updated_at: Date.now() - 172800000,
  },
  {
    id: '3',
    title: 'App feature ideas',
    content: '- Dark mode toggle\n- Drag and drop\n- Calendar sync\n- Mobile app',
    folder_id: 'ideas',
    pinned: true,
    color: '#10b981',
    created_at: Date.now() - 259200000,
    updated_at: Date.now() - 86400000,
  },
  {
    id: '4',
    title: 'Quick thoughts',
    content: 'Remember to follow up with the client about the proposal...',
    pinned: false,
    created_at: Date.now() - 3600000,
    updated_at: Date.now() - 3600000,
  },
]

function NoteCard({ note, isSelected, onClick }: {
  note: Note
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`glass-card cursor-pointer group relative ${
        isSelected ? 'ring-2 ring-indigo-500' : ''
      }`}
      style={{
        borderLeftColor: note.color || 'transparent',
        borderLeftWidth: note.color ? 4 : 1,
      }}
    >
      {/* Pin indicator */}
      {note.pinned && (
        <div className="absolute top-3 right-3">
          <Pin className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        </div>
      )}

      {/* Title */}
      <h3 className="font-medium text-white mb-2 pr-8 line-clamp-1">
        {note.title || 'Untitled'}
      </h3>

      {/* Preview */}
      <p className="text-sm text-white/60 line-clamp-3 mb-4">
        {note.content || 'No content'}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-white/40">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {format(new Date(note.updated_at), 'MMM d')}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 rounded hover:bg-white/10">
            <Edit3 className="w-3 h-3" />
          </button>
          <button className="p-1 rounded hover:bg-white/10">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function NoteEditor({ note, onSave, onClose }: {
  note: Note | null
  onSave: (note: Partial<Note>) => void
  onClose: () => void
}) {
  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')

  return (
    <div className="glass-card h-full flex flex-col">
      {/* Editor header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
        <input
          type="text"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-medium text-white bg-transparent outline-none flex-1"
        />
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-white/10">
            <Pin className="w-4 h-4 text-white/50" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10">
            <MoreHorizontal className="w-4 h-4 text-white/50" />
          </button>
        </div>
      </div>

      {/* Editor content */}
      <textarea
        placeholder="Start writing..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 bg-transparent text-white/90 resize-none outline-none leading-relaxed"
      />

      {/* Editor footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
        <span className="text-xs text-white/40">
          {note ? `Last edited ${format(new Date(note.updated_at), 'MMM d, h:mm a')}` : 'New note'}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-white/60 hover:bg-white/5"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSave({ title, content })}
            className="glass-button-primary"
          >
            Save
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(sampleNotes)
  const [folders] = useState<NoteFolder[]>(sampleFolders)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const filteredNotes = notes
    .filter((n) => !selectedFolderId || n.folder_id === selectedFolderId)
    .filter(
      (n) =>
        !searchQuery ||
        n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return b.updated_at - a.updated_at
    })

  const handleCreateNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: '',
      content: '',
      folder_id: selectedFolderId || undefined,
      pinned: false,
      created_at: Date.now(),
      updated_at: Date.now(),
    }
    setNotes((prev) => [newNote, ...prev])
    setSelectedNote(newNote)
    setIsEditing(true)
  }

  const handleSaveNote = (updates: Partial<Note>) => {
    if (!selectedNote) return
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNote.id
          ? { ...n, ...updates, updated_at: Date.now() }
          : n
      )
    )
    setIsEditing(false)
  }

  return (
    <div className="max-w-7xl mx-auto flex gap-6 h-[calc(100vh-150px)]">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <div className="glass-card h-full">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input pl-10 py-2 text-sm"
            />
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
              <span>All Notes</span>
              <span className="ml-auto text-sm text-white/50">{notes.length}</span>
            </button>
            {folders.map((folder) => {
              const count = notes.filter((n) => n.folder_id === folder.id).length
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

      {/* Notes grid or editor */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {selectedFolderId
              ? folders.find((f) => f.id === selectedFolderId)?.name
              : 'All Notes'}
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateNote}
            className="glass-button-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Note
          </motion.button>
        </div>

        {/* Content */}
        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Notes grid */}
          <div className={`${isEditing ? 'w-1/3' : 'flex-1'} overflow-auto`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {filteredNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    isSelected={selectedNote?.id === note.id}
                    onClick={() => {
                      setSelectedNote(note)
                      setIsEditing(true)
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Editor */}
          <AnimatePresence>
            {isEditing && selectedNote && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex-1"
              >
                <NoteEditor
                  note={selectedNote}
                  onSave={handleSaveNote}
                  onClose={() => setIsEditing(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
