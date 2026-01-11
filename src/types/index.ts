// Vianna Type Definitions

export interface Event {
  id: string
  title: string
  description?: string
  start_time: number
  end_time?: number
  all_day: boolean
  category: EventCategory
  color?: string
  location?: string
  recurrence?: string
  reminder?: number
  created_at: number
  updated_at: number
}

export type EventCategory = 'work' | 'school' | 'personal' | 'health' | 'social' | 'finance'

export interface Task {
  id: string
  title: string
  description?: string
  due_date?: number
  priority: TaskPriority
  completed: boolean
  completed_at?: number
  list_id?: string
  parent_id?: string
  position: number
  tags?: string[]
  created_at: number
  updated_at: number
}

export type TaskPriority = 0 | 1 | 2 | 3 // none, low, medium, high

export interface TaskList {
  id: string
  name: string
  color: string
  icon: string
  position: number
  created_at: number
}

export interface Note {
  id: string
  title?: string
  content?: string
  folder_id?: string
  pinned: boolean
  tags?: string[]
  color?: string
  created_at: number
  updated_at: number
}

export interface NoteFolder {
  id: string
  name: string
  color: string
  parent_id?: string
  position: number
  created_at: number
}

export interface Contact {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  photo?: string
  company?: string
  job_title?: string
  birthday?: number
  notes?: string
  category: string
  favorite: boolean
  created_at: number
  updated_at: number
}

export interface Project {
  id: string
  name: string
  description?: string
  status: ProjectStatus
  color: string
  icon: string
  deadline?: number
  progress: number
  // Property fields
  is_property: boolean
  property_address?: string
  property_price?: number
  property_beds?: number
  property_baths?: number
  property_sqft?: number
  property_year_built?: number
  property_lot_size?: string
  property_hoa?: number
  property_status?: PropertyStatus
  created_at: number
  updated_at: number
}

export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'archived'
export type PropertyStatus = 'available' | 'under_contract' | 'sold' | 'off_market'

export interface File {
  id: string
  name: string
  path: string
  type?: string
  size?: number
  folder_id?: string
  tags?: string[]
  thumbnail?: string
  created_at: number
}

export interface FileFolder {
  id: string
  name: string
  color: string
  parent_id?: string
  position: number
  created_at: number
}

export interface Goal {
  id: string
  title: string
  description?: string
  category: string
  target_date?: number
  progress: number
  milestones?: Milestone[]
  color: string
  created_at: number
  updated_at: number
}

export interface Milestone {
  id: string
  title: string
  completed: boolean
  completed_at?: number
}

export interface Habit {
  id: string
  name: string
  description?: string
  frequency: 'daily' | 'weekly' | 'monthly'
  color: string
  icon: string
  target_count: number
  current_streak: number
  longest_streak: number
  created_at: number
}

export interface HabitLog {
  id: string
  habit_id: string
  date: number
  count: number
  notes?: string
}

export interface Settings {
  theme: 'dark' | 'light'
  accentColor: string
  userName: string
  showWeather: boolean
  defaultCalendarView: 'day' | 'week' | 'month'
  startOfWeek: 'sunday' | 'monday'
  timeFormat: '12h' | '24h'
  dateFormat: string
}

export interface ActivityLog {
  id: string
  action: 'create' | 'update' | 'delete' | 'complete'
  entity_type: 'event' | 'task' | 'note' | 'contact' | 'project' | 'goal' | 'habit'
  entity_id: string
  entity_title?: string
  details?: string
  created_at: number
}

// View types
export type CalendarView = 'day' | 'week' | 'month'
export type TaskView = 'list' | 'kanban'
export type SidebarSection = 'dashboard' | 'calendar' | 'tasks' | 'notes' | 'files' | 'contacts' | 'projects' | 'goals' | 'settings'

// Widget types for dashboard
export interface Widget {
  id: string
  type: WidgetType
  position: { x: number; y: number }
  size: { width: number; height: number }
}

export type WidgetType =
  | 'today-schedule'
  | 'upcoming-tasks'
  | 'quick-notes'
  | 'habit-tracker'
  | 'recent-activity'
  | 'weather'
  | 'goals-progress'
  | 'calendar-mini'
