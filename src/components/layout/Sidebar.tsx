import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  FileText,
  FolderOpen,
  Users,
  Briefcase,
  Target,
  Settings,
  Sparkles,
  FileCode,
} from 'lucide-react'

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/calendar', label: 'Calendar', icon: Calendar },
  { path: '/tasks', label: 'Tasks', icon: CheckSquare },
  { path: '/notes', label: 'Notes', icon: FileText },
  { path: '/files', label: 'Files', icon: FolderOpen },
  { path: '/editor', label: 'Editor', icon: FileCode },
  { path: '/contacts', label: 'Contacts', icon: Users },
  { path: '/projects', label: 'Projects', icon: Briefcase },
  { path: '/goals', label: 'Goals', icon: Target },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <aside className="w-64 glass-sidebar flex flex-col">
      {/* Logo */}
      <div className="p-6 title-bar">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Vianna</h1>
            <p className="text-xs text-white/50">Life Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon

          return (
            <motion.button
              key={item.path}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(item.path)}
              className={`sidebar-item w-full relative ${isActive ? 'active' : ''}`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full"
                />
              )}
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          )
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="p-3 border-t border-white/5">
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/settings')}
          className={`sidebar-item w-full relative ${location.pathname === '/settings' ? 'active' : ''}`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </motion.button>
      </div>

      {/* User info */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold">
            V
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Vincent</p>
            <p className="text-xs text-white/50">Ready to conquer the day</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
