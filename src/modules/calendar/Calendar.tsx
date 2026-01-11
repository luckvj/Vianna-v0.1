import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  setHours,
  getHours,
} from 'date-fns'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
} from 'lucide-react'
import type { CalendarView, Event } from '../../types'

// Sample events
const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Team Standup',
    start_time: setHours(new Date(), 9).getTime(),
    end_time: setHours(new Date(), 10).getTime(),
    all_day: false,
    category: 'work',
    color: '#3b82f6',
    created_at: Date.now(),
    updated_at: Date.now(),
  },
  {
    id: '2',
    title: 'Lunch with Sarah',
    start_time: setHours(new Date(), 12).getTime(),
    end_time: setHours(new Date(), 13).getTime(),
    all_day: false,
    category: 'social',
    color: '#ec4899',
    location: 'Cafe Milano',
    created_at: Date.now(),
    updated_at: Date.now(),
  },
  {
    id: '3',
    title: 'Project Review',
    start_time: setHours(new Date(), 15).getTime(),
    end_time: setHours(new Date(), 16).getTime(),
    all_day: false,
    category: 'work',
    color: '#8b5cf6',
    created_at: Date.now(),
    updated_at: Date.now(),
  },
]

function MonthView({ currentDate, selectedDate, onSelectDate, events }: {
  currentDate: Date
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
  events: Event[]
}) {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getEventsForDay = (date: Date) => {
    return events.filter((e) => isSameDay(new Date(e.start_time), date))
  }

  return (
    <div className="glass-card p-6">
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-white/50 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isToday = isSameDay(day, new Date())
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const dayEvents = getEventsForDay(day)

          return (
            <motion.button
              key={day.toISOString()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectDate(day)}
              className={`
                calendar-day relative
                ${!isCurrentMonth ? 'opacity-30' : ''}
                ${isToday ? 'today' : ''}
                ${isSelected ? 'selected' : ''}
              `}
            >
              <span className={`text-lg ${isToday || isSelected ? 'font-bold' : ''}`}>
                {format(day, 'd')}
              </span>
              {dayEvents.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: event.color }}
                    />
                  ))}
                </div>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

function WeekView({ currentDate, events }: { currentDate: Date; events: Event[] }) {
  const weekStart = startOfWeek(currentDate)
  const days = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(currentDate),
  })

  const hours = Array.from({ length: 24 }, (_, i) => i)

  const getEventsForDayAndHour = (date: Date, hour: number) => {
    return events.filter((e) => {
      const eventDate = new Date(e.start_time)
      return isSameDay(eventDate, date) && getHours(eventDate) === hour
    })
  }

  return (
    <div className="glass-card p-4 overflow-auto max-h-[calc(100vh-250px)]">
      {/* Header with days */}
      <div className="grid grid-cols-8 gap-2 mb-4 sticky top-0 bg-black/20 backdrop-blur-md -mx-4 px-4 py-2 z-10">
        <div className="text-sm text-white/50">Time</div>
        {days.map((day) => {
          const isToday = isSameDay(day, new Date())
          return (
            <div key={day.toISOString()} className="text-center">
              <div className="text-sm text-white/50">{format(day, 'EEE')}</div>
              <div
                className={`text-lg font-medium ${
                  isToday ? 'text-indigo-400' : 'text-white'
                }`}
              >
                {format(day, 'd')}
              </div>
            </div>
          )
        })}
      </div>

      {/* Time grid */}
      <div className="space-y-0">
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-8 gap-2">
            <div className="text-xs text-white/40 py-4">
              {format(setHours(new Date(), hour), 'h a')}
            </div>
            {days.map((day) => {
              const dayEvents = getEventsForDayAndHour(day, hour)
              return (
                <div
                  key={day.toISOString()}
                  className="border-t border-white/5 py-1 min-h-[48px] relative"
                >
                  {dayEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-x-0 p-2 rounded-lg text-xs cursor-pointer hover:brightness-110 transition-all z-10"
                      style={{ backgroundColor: event.color }}
                    >
                      <p className="font-medium text-white truncate">
                        {event.title}
                      </p>
                      <p className="text-white/70">
                        {format(new Date(event.start_time), 'h:mm a')}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function DayView({ currentDate, events }: { currentDate: Date; events: Event[] }) {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const getEventsForHour = (hour: number) => {
    return events.filter((e) => {
      const eventDate = new Date(e.start_time)
      return isSameDay(eventDate, currentDate) && getHours(eventDate) === hour
    })
  }

  return (
    <div className="glass-card p-4 overflow-auto max-h-[calc(100vh-250px)]">
      {/* Day header */}
      <div className="text-center mb-6 sticky top-0 bg-black/20 backdrop-blur-md -mx-4 px-4 py-4 z-10">
        <div className="text-sm text-white/50">{format(currentDate, 'EEEE')}</div>
        <div className="text-3xl font-bold text-white">
          {format(currentDate, 'MMMM d, yyyy')}
        </div>
      </div>

      {/* Time slots */}
      <div className="space-y-0">
        {hours.map((hour) => {
          const hourEvents = getEventsForHour(hour)
          return (
            <div key={hour} className="flex gap-4 border-t border-white/5">
              <div className="w-20 text-right text-sm text-white/40 py-4 flex-shrink-0">
                {format(setHours(new Date(), hour), 'h:mm a')}
              </div>
              <div className="flex-1 py-2 min-h-[60px] relative">
                {hourEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 rounded-xl mb-2 cursor-pointer hover:brightness-110 transition-all"
                    style={{ backgroundColor: event.color }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-white">{event.title}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-white/70">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(event.start_time), 'h:mm a')}
                            {event.end_time &&
                              ` - ${format(new Date(event.end_time), 'h:mm a')}`}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [view, setView] = useState<CalendarView>('week')
  const [events] = useState<Event[]>(sampleEvents)

  const navigatePrevious = () => {
    if (view === 'month') setCurrentDate(subMonths(currentDate, 1))
    else if (view === 'week') setCurrentDate(subWeeks(currentDate, 1))
    else setCurrentDate(subDays(currentDate, 1))
  }

  const navigateNext = () => {
    if (view === 'month') setCurrentDate(addMonths(currentDate, 1))
    else if (view === 'week') setCurrentDate(addWeeks(currentDate, 1))
    else setCurrentDate(addDays(currentDate, 1))
  }

  const goToToday = () => setCurrentDate(new Date())

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={navigatePrevious}
            className="p-2 rounded-xl glass hover:bg-white/10"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </motion.button>
          <h2 className="text-2xl font-bold text-white min-w-[200px] text-center">
            {view === 'month' && format(currentDate, 'MMMM yyyy')}
            {view === 'week' &&
              `${format(startOfWeek(currentDate), 'MMM d')} - ${format(
                endOfWeek(currentDate),
                'MMM d, yyyy'
              )}`}
            {view === 'day' && format(currentDate, 'MMMM d, yyyy')}
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={navigateNext}
            className="p-2 rounded-xl glass hover:bg-white/10"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToToday}
            className="px-4 py-2 rounded-xl glass hover:bg-white/10 text-sm font-medium text-white"
          >
            Today
          </motion.button>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex glass rounded-xl p-1">
            {(['day', 'week', 'month'] as CalendarView[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === v
                    ? 'bg-indigo-500 text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>

          {/* Add event button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Event
          </motion.button>
        </div>
      </div>

      {/* Calendar view */}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {view === 'month' && (
            <MonthView
              currentDate={currentDate}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              events={events}
            />
          )}
          {view === 'week' && (
            <WeekView currentDate={currentDate} events={events} />
          )}
          {view === 'day' && (
            <DayView currentDate={currentDate} events={events} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
