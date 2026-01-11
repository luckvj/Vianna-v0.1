import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Bell, Minus, Square, X } from 'lucide-react'
import { format } from 'date-fns'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/calendar': 'Calendar',
  '/tasks': 'Tasks',
  '/notes': 'Notes',
  '/files': 'Files',
  '/contacts': 'Contacts',
  '/projects': 'Projects',
  '/goals': 'Goals & Habits',
  '/settings': 'Settings',
}

export default function TopBar() {
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')

  const pageTitle = pageTitles[location.pathname] || 'Vianna'
  const today = new Date()

  const handleMinimize = () => window.electron?.window.minimize()
  const handleMaximize = () => window.electron?.window.maximize()
  const handleClose = () => window.electron?.window.close()

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-white/5 glass-dark title-bar">
      {/* Left: Page title and date */}
      <div className="flex items-center gap-6">
        <div>
          <h2 className="text-lg font-semibold text-white">{pageTitle}</h2>
        </div>
        <div className="hidden md:block text-sm text-white/50">
          {format(today, 'EEEE, MMMM d, yyyy')}
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input pl-10 py-2 text-sm"
          />
        </div>
      </div>

      {/* Right: Actions and window controls */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-xl hover:bg-white/5 transition-colors"
        >
          <Bell className="w-5 h-5 text-white/70" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </motion.button>

        {/* Separator */}
        <div className="w-px h-6 bg-white/10 mx-2" />

        {/* Window controls */}
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleMinimize}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Minus className="w-4 h-4 text-white/70" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleMaximize}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Square className="w-3.5 h-3.5 text-white/70" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-red-500/20 transition-colors group"
          >
            <X className="w-4 h-4 text-white/70 group-hover:text-red-400" />
          </motion.button>
        </div>
      </div>
    </header>
  )
}
