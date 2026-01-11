import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Target,
  Flame,
  Check,
  ChevronRight,
  Calendar,
  Trophy,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'
import type { Goal, Habit, HabitLog } from '../../types'

// Sample data
const sampleGoals: Goal[] = [
  {
    id: '1',
    title: 'Read 24 books this year',
    description: 'Expand knowledge and develop reading habit',
    category: 'personal',
    progress: 67,
    target_date: Date.now() + 86400000 * 180,
    color: '#8b5cf6',
    milestones: [
      { id: 'm1', title: 'Read 6 books', completed: true },
      { id: 'm2', title: 'Read 12 books', completed: true },
      { id: 'm3', title: 'Read 18 books', completed: false },
      { id: 'm4', title: 'Read 24 books', completed: false },
    ],
    created_at: Date.now() - 86400000 * 60,
    updated_at: Date.now(),
  },
  {
    id: '2',
    title: 'Save $10,000 emergency fund',
    description: 'Build financial security',
    category: 'finance',
    progress: 45,
    target_date: Date.now() + 86400000 * 365,
    color: '#10b981',
    created_at: Date.now() - 86400000 * 90,
    updated_at: Date.now(),
  },
  {
    id: '3',
    title: 'Run a half marathon',
    description: 'Complete 13.1 miles',
    category: 'health',
    progress: 30,
    target_date: Date.now() + 86400000 * 120,
    color: '#f97316',
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now(),
  },
]

const sampleHabits: Habit[] = [
  { id: '1', name: 'Exercise', frequency: 'daily', color: '#10b981', icon: 'dumbbell', target_count: 1, current_streak: 7, longest_streak: 21, created_at: Date.now() },
  { id: '2', name: 'Read 30 mins', frequency: 'daily', color: '#8b5cf6', icon: 'book', target_count: 1, current_streak: 12, longest_streak: 30, created_at: Date.now() },
  { id: '3', name: 'Meditate', frequency: 'daily', color: '#ec4899', icon: 'brain', target_count: 1, current_streak: 5, longest_streak: 14, created_at: Date.now() },
  { id: '4', name: 'Drink 8 glasses water', frequency: 'daily', color: '#3b82f6', icon: 'droplet', target_count: 8, current_streak: 21, longest_streak: 45, created_at: Date.now() },
  { id: '5', name: 'No social media', frequency: 'daily', color: '#f59e0b', icon: 'ban', target_count: 1, current_streak: 3, longest_streak: 7, created_at: Date.now() },
]

// Generate sample logs for the week
const today = new Date()
const weekStart = startOfWeek(today)
const sampleLogs: HabitLog[] = []

sampleHabits.forEach((habit) => {
  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i)
    if (date <= today && Math.random() > 0.3) {
      sampleLogs.push({
        id: `${habit.id}-${i}`,
        habit_id: habit.id,
        date: date.getTime(),
        count: 1,
      })
    }
  }
})

function GoalCard({ goal }: { goal: Goal }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="glass-card cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${goal.color}20` }}
          >
            <Target className="w-5 h-5" style={{ color: goal.color }} />
          </div>
          <div>
            <h3 className="font-medium text-white">{goal.title}</h3>
            <p className="text-xs text-white/50">{goal.category}</p>
          </div>
        </div>
        {goal.target_date && (
          <span className="text-xs text-white/50 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {format(new Date(goal.target_date), 'MMM d')}
          </span>
        )}
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/50">Progress</span>
          <span className="text-sm font-bold text-white">{goal.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${goal.progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full"
            style={{ backgroundColor: goal.color }}
          />
        </div>
      </div>

      {/* Milestones */}
      {goal.milestones && goal.milestones.length > 0 && (
        <div className="space-y-2">
          {goal.milestones.slice(0, 3).map((milestone) => (
            <div
              key={milestone.id}
              className="flex items-center gap-2 text-sm"
            >
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  milestone.completed
                    ? 'bg-green-500'
                    : 'border border-white/20'
                }`}
              >
                {milestone.completed && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <span
                className={
                  milestone.completed ? 'text-white/50 line-through' : 'text-white/70'
                }
              >
                {milestone.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

function HabitTracker({ habits, logs }: { habits: Habit[]; logs: HabitLog[] }) {
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const isCompleted = (habitId: string, date: Date) => {
    return logs.some(
      (log) => log.habit_id === habitId && isSameDay(new Date(log.date), date)
    )
  }

  return (
    <div className="glass-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Weekly Habits</h3>
        <div className="flex items-center gap-2 text-sm text-white/50">
          <Flame className="w-4 h-4 text-orange-400" />
          <span>Best streak: 45 days</span>
        </div>
      </div>

      {/* Week header */}
      <div className="grid grid-cols-8 gap-2 mb-4">
        <div /> {/* Empty cell for habit names */}
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className={`text-center text-xs ${
              isSameDay(day, today) ? 'text-indigo-400 font-bold' : 'text-white/50'
            }`}
          >
            <div>{format(day, 'EEE')}</div>
            <div>{format(day, 'd')}</div>
          </div>
        ))}
      </div>

      {/* Habits grid */}
      <div className="space-y-3">
        {habits.map((habit) => (
          <div key={habit.id} className="grid grid-cols-8 gap-2 items-center">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: habit.color }}
              />
              <span className="text-sm text-white truncate">{habit.name}</span>
            </div>
            {weekDays.map((day) => {
              const completed = isCompleted(habit.id, day)
              const isFuture = day > today
              return (
                <motion.button
                  key={day.toISOString()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={isFuture}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto transition-all ${
                    isFuture
                      ? 'bg-white/5 cursor-not-allowed'
                      : completed
                      ? ''
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                  style={{
                    backgroundColor: completed ? habit.color : undefined,
                  }}
                >
                  {completed && <Check className="w-4 h-4 text-white" />}
                </motion.button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Add habit button */}
      <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl text-white/50 hover:bg-white/5 transition-colors">
        <Plus className="w-4 h-4" />
        Add Habit
      </button>
    </div>
  )
}

function StatsOverview({ habits }: { habits: Habit[] }) {
  const totalStreaks = habits.reduce((sum, h) => sum + h.current_streak, 0)
  const bestStreak = Math.max(...habits.map((h) => h.longest_streak))

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card text-center"
      >
        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mx-auto mb-3">
          <Flame className="w-6 h-6 text-orange-400" />
        </div>
        <p className="text-2xl font-bold text-white">{totalStreaks}</p>
        <p className="text-sm text-white/50">Total Streak Days</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card text-center"
      >
        <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center mx-auto mb-3">
          <Trophy className="w-6 h-6 text-yellow-400" />
        </div>
        <p className="text-2xl font-bold text-white">{bestStreak}</p>
        <p className="text-sm text-white/50">Best Streak</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card text-center"
      >
        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-3">
          <TrendingUp className="w-6 h-6 text-green-400" />
        </div>
        <p className="text-2xl font-bold text-white">85%</p>
        <p className="text-sm text-white/50">Completion Rate</p>
      </motion.div>
    </div>
  )
}

export default function Goals() {
  const [goals] = useState<Goal[]>(sampleGoals)
  const [habits] = useState<Habit[]>(sampleHabits)
  const [logs] = useState<HabitLog[]>(sampleLogs)
  const [activeTab, setActiveTab] = useState<'goals' | 'habits'>('habits')

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">Goals & Habits</h2>
          <div className="flex glass rounded-xl p-1">
            <button
              onClick={() => setActiveTab('habits')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'habits'
                  ? 'bg-indigo-500 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 inline mr-2" />
              Habits
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'goals'
                  ? 'bg-indigo-500 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Target className="w-4 h-4 inline mr-2" />
              Goals
            </button>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-button-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {activeTab === 'habits' ? 'New Habit' : 'New Goal'}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'habits' ? (
          <motion.div
            key="habits"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {/* Stats */}
            <StatsOverview habits={habits} />

            {/* Habit tracker */}
            <HabitTracker habits={habits} logs={logs} />
          </motion.div>
        ) : (
          <motion.div
            key="goals"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Goals grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
