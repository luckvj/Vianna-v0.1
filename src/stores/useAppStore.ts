import { create } from 'zustand'
import type { Settings, ActivityLog } from '../types'

interface AppState {
  // Settings
  settings: Settings
  updateSettings: (settings: Partial<Settings>) => void

  // Activity log
  recentActivity: ActivityLog[]
  addActivity: (activity: Omit<ActivityLog, 'id' | 'created_at'>) => void

  // UI state
  isLoading: boolean
  setLoading: (loading: boolean) => void

  // Search
  globalSearchQuery: string
  setGlobalSearchQuery: (query: string) => void

  // Modals
  activeModal: string | null
  openModal: (modalId: string) => void
  closeModal: () => void
}

const defaultSettings: Settings = {
  theme: 'dark',
  accentColor: '#6366f1',
  userName: 'User',
  showWeather: true,
  defaultCalendarView: 'week',
  startOfWeek: 'sunday',
  timeFormat: '12h',
  dateFormat: 'MM/DD/YYYY',
}

export const useAppStore = create<AppState>((set) => ({
  // Settings
  settings: defaultSettings,
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  // Activity log
  recentActivity: [],
  addActivity: (activity) =>
    set((state) => ({
      recentActivity: [
        {
          ...activity,
          id: crypto.randomUUID(),
          created_at: Date.now(),
        },
        ...state.recentActivity.slice(0, 49), // Keep last 50 activities
      ],
    })),

  // UI state
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),

  // Search
  globalSearchQuery: '',
  setGlobalSearchQuery: (query) => set({ globalSearchQuery: query }),

  // Modals
  activeModal: null,
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
}))
