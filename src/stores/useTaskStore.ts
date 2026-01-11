import { create } from 'zustand'
import type { Task, TaskList, TaskView } from '../types'

interface TaskState {
  // Tasks
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void
  reorderTasks: (listId: string, taskIds: string[]) => void

  // Task lists
  lists: TaskList[]
  setLists: (lists: TaskList[]) => void
  addList: (list: TaskList) => void
  updateList: (id: string, updates: Partial<TaskList>) => void
  deleteList: (id: string) => void

  // View state
  view: TaskView
  setView: (view: TaskView) => void
  selectedListId: string | null
  setSelectedListId: (listId: string | null) => void

  // Filters
  showCompleted: boolean
  setShowCompleted: (show: boolean) => void
  filterPriority: number | null
  setFilterPriority: (priority: number | null) => void

  // Helpers
  getTasksByList: (listId: string) => Task[]
  getSubtasks: (parentId: string) => Task[]
  getTasksDueToday: () => Task[]
  getOverdueTasks: () => Task[]
}

export const useTaskStore = create<TaskState>((set, get) => ({
  // Tasks
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) =>
    set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates, updated_at: Date.now() } : t
      ),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id && t.parent_id !== id),
    })),
  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completed_at: !t.completed ? Date.now() : undefined,
              updated_at: Date.now(),
            }
          : t
      ),
    })),
  reorderTasks: (listId, taskIds) =>
    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.list_id !== listId) return t
        const newPosition = taskIds.indexOf(t.id)
        return newPosition >= 0 ? { ...t, position: newPosition } : t
      }),
    })),

  // Task lists
  lists: [
    {
      id: 'default',
      name: 'My Tasks',
      color: '#6366f1',
      icon: 'inbox',
      position: 0,
      created_at: Date.now(),
    },
  ],
  setLists: (lists) => set({ lists }),
  addList: (list) =>
    set((state) => ({ lists: [...state.lists, list] })),
  updateList: (id, updates) =>
    set((state) => ({
      lists: state.lists.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    })),
  deleteList: (id) =>
    set((state) => ({
      lists: state.lists.filter((l) => l.id !== id),
      tasks: state.tasks.map((t) =>
        t.list_id === id ? { ...t, list_id: 'default' } : t
      ),
    })),

  // View state
  view: 'list',
  setView: (view) => set({ view }),
  selectedListId: null,
  setSelectedListId: (listId) => set({ selectedListId: listId }),

  // Filters
  showCompleted: false,
  setShowCompleted: (show) => set({ showCompleted: show }),
  filterPriority: null,
  setFilterPriority: (priority) => set({ filterPriority: priority }),

  // Helpers
  getTasksByList: (listId) => {
    const { tasks, showCompleted } = get()
    return tasks
      .filter((t) => t.list_id === listId && !t.parent_id)
      .filter((t) => showCompleted || !t.completed)
      .sort((a, b) => a.position - b.position)
  },
  getSubtasks: (parentId) => {
    const { tasks } = get()
    return tasks
      .filter((t) => t.parent_id === parentId)
      .sort((a, b) => a.position - b.position)
  },
  getTasksDueToday: () => {
    const { tasks } = get()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return tasks.filter(
      (t) =>
        !t.completed &&
        t.due_date &&
        t.due_date >= today.getTime() &&
        t.due_date < tomorrow.getTime()
    )
  },
  getOverdueTasks: () => {
    const { tasks } = get()
    const now = Date.now()
    return tasks.filter(
      (t) => !t.completed && t.due_date && t.due_date < now
    )
  },
}))
