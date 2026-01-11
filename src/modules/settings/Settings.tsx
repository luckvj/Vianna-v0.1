import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Palette,
  Bell,
  Database,
  Keyboard,
  Info,
  Moon,
  Sun,
  Check,
  Download,
  Upload,
  Trash2,
  Heart,
} from 'lucide-react'

interface SettingsSection {
  id: string
  label: string
  icon: typeof User
}

const sections: SettingsSection[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'data', label: 'Data & Backup', icon: Database },
  { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard },
  { id: 'about', label: 'About', icon: Info },
]

const accentColors = [
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Green', value: '#10b981' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Red', value: '#ef4444' },
]

function ProfileSettings() {
  const [name, setName] = useState('Vincent')
  const [email, setEmail] = useState('vincent@example.com')

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Profile Settings</h3>
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
            V
          </div>
          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-button mb-2"
            >
              Change Photo
            </motion.button>
            <p className="text-sm text-white/50">JPG, PNG or GIF. Max 2MB.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-white/70 mb-2">Display Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="glass-input"
          />
        </div>
        <div>
          <label className="block text-sm text-white/70 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="glass-input"
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="glass-button-primary"
      >
        Save Changes
      </motion.button>
    </div>
  )
}

function AppearanceSettings() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [accentColor, setAccentColor] = useState('#6366f1')
  const [transparency, setTransparency] = useState(80)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Appearance</h3>
      </div>

      {/* Theme */}
      <div>
        <label className="block text-sm text-white/70 mb-3">Theme</label>
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTheme('dark')}
            className={`flex-1 p-4 rounded-xl border transition-all ${
              theme === 'dark'
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <Moon className="w-6 h-6 mx-auto mb-2 text-white" />
            <p className="text-sm font-medium text-white">Dark</p>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTheme('light')}
            className={`flex-1 p-4 rounded-xl border transition-all ${
              theme === 'light'
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <Sun className="w-6 h-6 mx-auto mb-2 text-white" />
            <p className="text-sm font-medium text-white">Light</p>
          </motion.button>
        </div>
      </div>

      {/* Accent color */}
      <div>
        <label className="block text-sm text-white/70 mb-3">Accent Color</label>
        <div className="flex flex-wrap gap-3">
          {accentColors.map((color) => (
            <motion.button
              key={color.value}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setAccentColor(color.value)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                accentColor === color.value ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''
              }`}
              style={{ backgroundColor: color.value }}
            >
              {accentColor === color.value && (
                <Check className="w-5 h-5 text-white" />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Transparency */}
      <div>
        <label className="block text-sm text-white/70 mb-3">
          Window Transparency: {transparency}%
        </label>
        <input
          type="range"
          min="50"
          max="100"
          value={transparency}
          onChange={(e) => setTransparency(Number(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  )
}

function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    taskReminders: true,
    eventReminders: true,
    habitReminders: true,
    goalUpdates: false,
    soundEnabled: true,
  })

  const toggleSetting = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Notifications</h3>

      <div className="space-y-4">
        {[
          { key: 'taskReminders', label: 'Task Reminders', desc: 'Get notified about upcoming tasks' },
          { key: 'eventReminders', label: 'Event Reminders', desc: 'Notifications for scheduled events' },
          { key: 'habitReminders', label: 'Habit Reminders', desc: 'Daily reminders for your habits' },
          { key: 'goalUpdates', label: 'Goal Updates', desc: 'Updates on goal progress' },
          { key: 'soundEnabled', label: 'Sound Effects', desc: 'Play sounds for notifications' },
        ].map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between p-4 rounded-xl bg-white/5"
          >
            <div>
              <p className="font-medium text-white">{item.label}</p>
              <p className="text-sm text-white/50">{item.desc}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleSetting(item.key as keyof typeof notifications)}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                notifications[item.key as keyof typeof notifications]
                  ? 'bg-indigo-500'
                  : 'bg-white/20'
              }`}
            >
              <motion.div
                animate={{
                  x: notifications[item.key as keyof typeof notifications] ? 22 : 2,
                }}
                className="w-5 h-5 rounded-full bg-white absolute top-1"
              />
            </motion.button>
          </div>
        ))}
      </div>
    </div>
  )
}

function DataSettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Data & Backup</h3>

      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium text-white">Export Data</p>
              <p className="text-sm text-white/50">Download all your data as JSON</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </motion.button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium text-white">Import Data</p>
              <p className="text-sm text-white/50">Restore from a backup file</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import
            </motion.button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-400">Delete All Data</p>
              <p className="text-sm text-white/50">Permanently delete all your data</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ShortcutsSettings() {
  const shortcuts = [
    { key: 'Ctrl + N', action: 'New item (task, event, note)' },
    { key: 'Ctrl + S', action: 'Save current item' },
    { key: 'Ctrl + F', action: 'Global search' },
    { key: 'Ctrl + 1-9', action: 'Switch between sections' },
    { key: 'Ctrl + ,', action: 'Open settings' },
    { key: 'Esc', action: 'Close modal / Go back' },
    { key: 'Space', action: 'Toggle task completion' },
    { key: 'Ctrl + D', action: 'Duplicate item' },
    { key: 'Delete', action: 'Delete selected item' },
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Keyboard Shortcuts</h3>

      <div className="space-y-2">
        {shortcuts.map((shortcut) => (
          <div
            key={shortcut.key}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5"
          >
            <span className="text-white/70">{shortcut.action}</span>
            <kbd className="px-3 py-1 rounded-lg bg-white/10 font-mono text-sm text-white">
              {shortcut.key}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  )
}

function AboutSettings() {
  const [version, setVersion] = useState('1.0.0')

  useEffect(() => {
    window.electron?.app.version().then(setVersion)
  }, [])

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl">
          <span className="text-4xl font-bold text-white">V</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Vianna</h2>
        <p className="text-white/50 mb-4">Version {version}</p>
        <p className="text-white/70 max-w-md mx-auto">
          Your personal life management hub. Organize everything in one beautiful place.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-white/10 text-center">
        <Heart className="w-8 h-8 mx-auto mb-3 text-pink-400" />
        <p className="text-white/80 italic">
          "Made with love by Vincent, for Savannah"
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
          <span className="text-white/70">Check for updates</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button"
          >
            Check Now
          </motion.button>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
          <span className="text-white/70">View on GitHub</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button"
          >
            Open
          </motion.button>
        </div>
      </div>

      <p className="text-center text-sm text-white/30">
        &copy; {new Date().getFullYear()} Vincent Haney Jr. All rights reserved.
      </p>
    </div>
  )
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile')

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings />
      case 'appearance':
        return <AppearanceSettings />
      case 'notifications':
        return <NotificationSettings />
      case 'data':
        return <DataSettings />
      case 'shortcuts':
        return <ShortcutsSettings />
      case 'about':
        return <AboutSettings />
      default:
        return <ProfileSettings />
    }
  }

  return (
    <div className="max-w-4xl mx-auto flex gap-6 h-[calc(100vh-150px)]">
      {/* Sidebar */}
      <div className="w-56 flex-shrink-0">
        <div className="glass-card h-full">
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <motion.button
                  key={section.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeSection === section.id
                      ? 'bg-indigo-500/20 text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </motion.button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 glass-card overflow-auto">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderSection()}
        </motion.div>
      </div>
    </div>
  )
}
