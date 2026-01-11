import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Dashboard from './modules/dashboard/Dashboard'
import Calendar from './modules/calendar/Calendar'
import Tasks from './modules/tasks/Tasks'
import Notes from './modules/notes/Notes'
import Files from './modules/files/Files'
import Contacts from './modules/contacts/Contacts'
import Projects from './modules/projects/Projects'
import Goals from './modules/goals/Goals'
import Settings from './modules/settings/Settings'
import Editor from './modules/editor/Editor'
import SplashScreen from './components/SplashScreen'

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Show splash for 2.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2500)

    // Mark as loaded after a brief delay
    const loadTimer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    return () => {
      clearTimeout(timer)
      clearTimeout(loadTimer)
    }
  }, [])

  if (showSplash) {
    return <SplashScreen isLoaded={isLoaded} />
  }

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/files" element={<Files />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </MainLayout>
    </Router>
  )
}

export default App
