import { create } from 'zustand'
import type { Event, CalendarView } from '../types'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

interface CalendarState {
  // Events
  events: Event[]
  setEvents: (events: Event[]) => void
  addEvent: (event: Event) => void
  updateEvent: (id: string, updates: Partial<Event>) => void
  deleteEvent: (id: string) => void

  // View state
  currentDate: Date
  setCurrentDate: (date: Date) => void
  view: CalendarView
  setView: (view: CalendarView) => void

  // Selection
  selectedDate: Date | null
  setSelectedDate: (date: Date | null) => void
  selectedEvent: Event | null
  setSelectedEvent: (event: Event | null) => void

  // Helpers
  getEventsForDate: (date: Date) => Event[]
  getEventsForRange: (start: Date, end: Date) => Event[]
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  // Events
  events: [],
  setEvents: (events) => set({ events }),
  addEvent: (event) =>
    set((state) => ({ events: [...state.events, event] })),
  updateEvent: (id, updates) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === id ? { ...e, ...updates, updated_at: Date.now() } : e
      ),
    })),
  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
    })),

  // View state
  currentDate: new Date(),
  setCurrentDate: (date) => set({ currentDate: date }),
  view: 'week',
  setView: (view) => set({ view }),

  // Selection
  selectedDate: null,
  setSelectedDate: (date) => set({ selectedDate: date }),
  selectedEvent: null,
  setSelectedEvent: (event) => set({ selectedEvent: event }),

  // Helpers
  getEventsForDate: (date) => {
    const { events } = get()
    const dayStart = startOfDay(date).getTime()
    const dayEnd = endOfDay(date).getTime()
    return events.filter((e) => {
      const eventStart = e.start_time
      const eventEnd = e.end_time || e.start_time
      return eventStart <= dayEnd && eventEnd >= dayStart
    })
  },
  getEventsForRange: (start, end) => {
    const { events } = get()
    const rangeStart = start.getTime()
    const rangeEnd = end.getTime()
    return events.filter((e) => {
      const eventStart = e.start_time
      const eventEnd = e.end_time || e.start_time
      return eventStart <= rangeEnd && eventEnd >= rangeStart
    })
  },
}))
