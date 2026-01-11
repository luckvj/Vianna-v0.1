import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Calendar, CheckSquare, FileText, X } from 'lucide-react'

const quickActions = [
  { id: 'event', label: 'New Event', icon: Calendar, color: 'from-blue-500 to-cyan-500' },
  { id: 'task', label: 'New Task', icon: CheckSquare, color: 'from-green-500 to-emerald-500' },
  { id: 'note', label: 'Quick Note', icon: FileText, color: 'from-purple-500 to-pink-500' },
]

export default function QuickAdd() {
  const [isOpen, setIsOpen] = useState(false)

  const handleAction = (actionId: string) => {
    console.log('Quick action:', actionId)
    setIsOpen(false)
    // TODO: Open appropriate modal based on action
  }

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Quick action buttons */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed bottom-24 right-8 z-50 flex flex-col gap-3 items-end">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, x: 20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleAction(action.id)}
                  className="flex items-center gap-3 pl-4 pr-3 py-2 rounded-full glass hover:bg-white/10 transition-colors group"
                >
                  <span className="text-sm font-medium text-white/80 group-hover:text-white">
                    {action.label}
                  </span>
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </motion.button>
              )
            })}
          </div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fab"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Plus className="w-6 h-6 text-white" />
        )}
      </motion.button>
    </>
  )
}
