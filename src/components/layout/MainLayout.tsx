import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import QuickAdd from '../shared/QuickAdd'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with window controls */}
        <TopBar />

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 content-area">
          {children}
        </main>
      </div>

      {/* Quick Add FAB */}
      <QuickAdd />
    </div>
  )
}
