import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  Calendar,
  CheckSquare,
  Clock,
  TrendingUp,
  Sun,
  Moon,
  Cloud,
  Zap,
  Target,
  Activity
} from 'lucide-react'

// Widget components
function GreetingWidget() {
  const hour = new Date().getHours()
  let greeting = 'Good morning'
  let Icon = Sun

  if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon'
    Icon = Sun
  } else if (hour >= 17 || hour < 5) {
    greeting = 'Good evening'
    Icon = Moon
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-2 glass-card bg-gradient-to-br from-indigo-500/20 to-purple-500/20"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Icon className="w-6 h-6 text-yellow-400" />
            <span className="text-white/60">{greeting},</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-1">Vincent</h2>
          <p className="text-white/60">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-5xl font-light text-white">
            {format(new Date(), 'h:mm')}
          </p>
          <p className="text-white/60">{format(new Date(), 'a')}</p>
        </div>
      </div>
    </motion.div>
  )
}

function TodayScheduleWidget() {
  const events = [
    { id: 1, title: 'Team standup', time: '9:00 AM', color: '#3b82f6' },
    { id: 2, title: 'Project review', time: '11:00 AM', color: '#8b5cf6' },
    { id: 3, title: 'Lunch with Sarah', time: '12:30 PM', color: '#ec4899' },
    { id: 4, title: 'Client call', time: '3:00 PM', color: '#f97316' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card"
    >
      <div className="widget-header">
        <span className="widget-title">Today's Schedule</span>
        <Calendar className="w-4 h-4 text-white/50" />
      </div>
      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="flex items-center gap-3">
            <div
              className="w-1 h-10 rounded-full"
              style={{ backgroundColor: event.color }}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{event.title}</p>
              <p className="text-xs text-white/50">{event.time}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function UpcomingTasksWidget() {
  const tasks = [
    { id: 1, title: 'Finish project proposal', priority: 'high', due: 'Today' },
    { id: 2, title: 'Review pull requests', priority: 'medium', due: 'Today' },
    { id: 3, title: 'Update documentation', priority: 'low', due: 'Tomorrow' },
  ]

  const priorityColors: Record<string, string> = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card"
    >
      <div className="widget-header">
        <span className="widget-title">Upcoming Tasks</span>
        <CheckSquare className="w-4 h-4 text-white/50" />
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-3">
            <div className="task-checkbox" />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{task.title}</p>
              <p className="text-xs text-white/50">{task.due}</p>
            </div>
            <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} />
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function HabitTrackerWidget() {
  const habits = [
    { id: 1, name: 'Exercise', streak: 7, completed: true, color: '#10b981' },
    { id: 2, name: 'Read 30 mins', streak: 12, completed: false, color: '#6366f1' },
    { id: 3, name: 'Meditate', streak: 5, completed: true, color: '#ec4899' },
    { id: 4, name: 'Drink water', streak: 21, completed: false, color: '#3b82f6' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card"
    >
      <div className="widget-header">
        <span className="widget-title">Habits</span>
        <Zap className="w-4 h-4 text-white/50" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              habit.completed
                ? 'bg-white/10 border-white/20'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: habit.color }}
              />
              {habit.completed && (
                <CheckSquare className="w-4 h-4 text-green-400" />
              )}
            </div>
            <p className="text-sm font-medium text-white">{habit.name}</p>
            <p className="text-xs text-white/50">{habit.streak} day streak</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function StatsWidget() {
  const stats = [
    { label: 'Tasks Done', value: '12', icon: CheckSquare, color: 'text-green-400' },
    { label: 'Events Today', value: '4', icon: Calendar, color: 'text-blue-400' },
    { label: 'Goals Progress', value: '67%', icon: Target, color: 'text-purple-400' },
    { label: 'Productivity', value: '85%', icon: TrendingUp, color: 'text-yellow-400' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="col-span-2 glass-card"
    >
      <div className="widget-header">
        <span className="widget-title">Today's Stats</span>
        <Activity className="w-4 h-4 text-white/50" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="text-center">
              <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-white/50">{stat.label}</p>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

function QuickNotesWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card"
    >
      <div className="widget-header">
        <span className="widget-title">Quick Notes</span>
        <Clock className="w-4 h-4 text-white/50" />
      </div>
      <div className="space-y-3">
        <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-sm text-white">Remember to call mom!</p>
          <p className="text-xs text-white/50 mt-1">2 hours ago</p>
        </div>
        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <p className="text-sm text-white">Meeting notes from yesterday...</p>
          <p className="text-xs text-white/50 mt-1">Yesterday</p>
        </div>
      </div>
    </motion.div>
  )
}

function RecentActivityWidget() {
  const activities = [
    { id: 1, action: 'Completed task', item: 'Update README', time: '10 min ago' },
    { id: 2, action: 'Added event', item: 'Team lunch', time: '1 hour ago' },
    { id: 3, action: 'Created note', item: 'Project ideas', time: '2 hours ago' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass-card"
    >
      <div className="widget-header">
        <span className="widget-title">Recent Activity</span>
        <Activity className="w-4 h-4 text-white/50" />
      </div>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-indigo-400" />
            <div className="flex-1">
              <p className="text-sm text-white">
                <span className="text-white/60">{activity.action}:</span>{' '}
                {activity.item}
              </p>
              <p className="text-xs text-white/50">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Greeting - spans 2 columns */}
        <GreetingWidget />

        {/* Weather placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card flex items-center justify-center"
        >
          <div className="text-center">
            <Cloud className="w-12 h-12 mx-auto mb-2 text-blue-300" />
            <p className="text-3xl font-light text-white">72°F</p>
            <p className="text-sm text-white/50">Partly Cloudy</p>
          </div>
        </motion.div>

        {/* Today's Schedule */}
        <TodayScheduleWidget />

        {/* Upcoming Tasks */}
        <UpcomingTasksWidget />

        {/* Habit Tracker */}
        <HabitTrackerWidget />

        {/* Stats - spans 2 columns */}
        <StatsWidget />

        {/* Quick Notes */}
        <QuickNotesWidget />

        {/* Recent Activity */}
        <RecentActivityWidget />
      </div>
    </div>
  )
}
