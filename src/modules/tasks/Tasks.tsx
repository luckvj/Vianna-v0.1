import { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import {
  Plus,
  Check,
  Calendar,
  Flag,
  MoreHorizontal,
  List,
  Columns,
  ChevronRight,
  Inbox,
  Star,
  Trash2,
} from 'lucide-react'
import { format } from 'date-fns'
import type { Task, TaskList, TaskView } from '../../types'

// Sample data
const sampleLists: TaskList[] = [
  { id: 'inbox', name: 'Inbox', color: '#6366f1', icon: 'inbox', position: 0, created_at: Date.now() },
  { id: 'work', name: 'Work', color: '#3b82f6', icon: 'briefcase', position: 1, created_at: Date.now() },
  { id: 'personal', name: 'Personal', color: '#ec4899', icon: 'heart', position: 2, created_at: Date.now() },
  { id: 'shopping', name: 'Shopping', color: '#10b981', icon: 'cart', position: 3, created_at: Date.now() },
]

const sampleTasks: Task[] = [
  { id: '1', title: 'Review project proposal', list_id: 'work', priority: 3, completed: false, position: 0, created_at: Date.now(), updated_at: Date.now(), due_date: Date.now() + 86400000 },
  { id: '2', title: 'Send follow-up email to client', list_id: 'work', priority: 2, completed: false, position: 1, created_at: Date.now(), updated_at: Date.now() },
  { id: '3', title: 'Prepare presentation slides', list_id: 'work', priority: 2, completed: true, position: 2, created_at: Date.now(), updated_at: Date.now(), completed_at: Date.now() },
  { id: '4', title: 'Buy groceries', list_id: 'shopping', priority: 1, completed: false, position: 0, created_at: Date.now(), updated_at: Date.now() },
  { id: '5', title: 'Call mom', list_id: 'personal', priority: 1, completed: false, position: 0, created_at: Date.now(), updated_at: Date.now() },
  { id: '6', title: 'Gym workout', list_id: 'personal', priority: 0, completed: false, position: 1, created_at: Date.now(), updated_at: Date.now() },
]

function TaskItem({ task, onToggle, onDelete }: { task: Task; onToggle: () => void; onDelete: () => void }) {
  const priorityColors: Record<number, string> = {
    0: 'border-white/20',
    1: 'border-blue-400',
    2: 'border-yellow-400',
    3: 'border-red-400',
  }

  return (
    <Reorder.Item value={task} id={task.id}>
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className={`task-item group ${task.completed ? 'opacity-50' : ''}`}
      >
        {/* Checkbox */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggle}
          className={`task-checkbox ${priorityColors[task.priority]} ${task.completed ? 'checked' : ''}`}
        >
          {task.completed && <Check className="w-3 h-3 text-white" />}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-white ${task.completed ? 'line-through text-white/50' : ''}`}>
            {task.title}
          </p>
          {task.due_date && (
            <p className="text-xs text-white/50 flex items-center gap-1 mt-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(task.due_date), 'MMM d')}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 rounded hover:bg-white/10">
            <Star className="w-4 h-4 text-white/50" />
          </button>
          <button onClick={onDelete} className="p-1 rounded hover:bg-white/10">
            <Trash2 className="w-4 h-4 text-white/50" />
          </button>
          <button className="p-1 rounded hover:bg-white/10">
            <MoreHorizontal className="w-4 h-4 text-white/50" />
          </button>
        </div>
      </motion.div>
    </Reorder.Item>
  )
}

function ListView({ tasks, lists, selectedListId, onToggleTask, onDeleteTask, onReorder }: {
  tasks: Task[]
  lists: TaskList[]
  selectedListId: string | null
  onToggleTask: (id: string) => void
  onDeleteTask: (id: string) => void
  onReorder: (tasks: Task[]) => void
}) {
  const filteredTasks = selectedListId
    ? tasks.filter((t) => t.list_id === selectedListId)
    : tasks

  const incompleteTasks = filteredTasks.filter((t) => !t.completed)
  const completedTasks = filteredTasks.filter((t) => t.completed)

  return (
    <div className="space-y-4">
      {/* Incomplete tasks */}
      <Reorder.Group axis="y" values={incompleteTasks} onReorder={onReorder}>
        <AnimatePresence>
          {incompleteTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => onToggleTask(task.id)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>

      {/* Completed section */}
      {completedTasks.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3 text-white/50">
            <ChevronRight className="w-4 h-4" />
            <span className="text-sm font-medium">Completed ({completedTasks.length})</span>
          </div>
          <div className="space-y-1">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => onToggleTask(task.id)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function KanbanView({ tasks, lists, onToggleTask }: {
  tasks: Task[]
  lists: TaskList[]
  onToggleTask: (id: string) => void
}) {
  const columns = [
    { id: 'todo', title: 'To Do', tasks: tasks.filter((t) => !t.completed && t.priority <= 1) },
    { id: 'inprogress', title: 'In Progress', tasks: tasks.filter((t) => !t.completed && t.priority === 2) },
    { id: 'urgent', title: 'Urgent', tasks: tasks.filter((t) => !t.completed && t.priority === 3) },
    { id: 'done', title: 'Done', tasks: tasks.filter((t) => t.completed) },
  ]

  return (
    <div className="grid grid-cols-4 gap-4 h-[calc(100vh-250px)]">
      {columns.map((column) => (
        <div key={column.id} className="glass-card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-white">{column.title}</h3>
            <span className="text-sm text-white/50">{column.tasks.length}</span>
          </div>
          <div className="flex-1 overflow-auto space-y-2">
            {column.tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all"
              >
                <div className="flex items-start gap-2">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className={`mt-0.5 task-checkbox ${task.completed ? 'checked' : ''}`}
                  >
                    {task.completed && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <div className="flex-1">
                    <p className={`text-sm text-white ${task.completed ? 'line-through opacity-50' : ''}`}>
                      {task.title}
                    </p>
                    {task.due_date && (
                      <p className="text-xs text-white/50 mt-1">
                        {format(new Date(task.due_date), 'MMM d')}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks)
  const [lists] = useState<TaskList[]>(sampleLists)
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [view, setView] = useState<TaskView>('list')
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, completed: !t.completed, completed_at: !t.completed ? Date.now() : undefined }
          : t
      )
    )
  }

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      list_id: selectedListId || 'inbox',
      priority: 0,
      completed: false,
      position: tasks.length,
      created_at: Date.now(),
      updated_at: Date.now(),
    }
    setTasks((prev) => [...prev, newTask])
    setNewTaskTitle('')
  }

  const handleReorder = (reorderedTasks: Task[]) => {
    setTasks((prev) => {
      const otherTasks = prev.filter(
        (t) => !reorderedTasks.find((rt) => rt.id === t.id)
      )
      return [...otherTasks, ...reorderedTasks.map((t, i) => ({ ...t, position: i }))]
    })
  }

  return (
    <div className="max-w-7xl mx-auto flex gap-6 h-[calc(100vh-150px)]">
      {/* Sidebar with lists */}
      <div className="w-64 flex-shrink-0">
        <div className="glass-card h-full">
          <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-4">
            Lists
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedListId(null)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                selectedListId === null
                  ? 'bg-indigo-500/20 text-white'
                  : 'text-white/70 hover:bg-white/5'
              }`}
            >
              <Inbox className="w-5 h-5" />
              <span>All Tasks</span>
              <span className="ml-auto text-sm text-white/50">{tasks.length}</span>
            </button>
            {lists.map((list) => {
              const count = tasks.filter((t) => t.list_id === list.id).length
              return (
                <button
                  key={list.id}
                  onClick={() => setSelectedListId(list.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                    selectedListId === list.id
                      ? 'bg-indigo-500/20 text-white'
                      : 'text-white/70 hover:bg-white/5'
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: list.color }}
                  />
                  <span>{list.name}</span>
                  <span className="ml-auto text-sm text-white/50">{count}</span>
                </button>
              )
            })}
          </div>

          {/* Add list button */}
          <button className="w-full flex items-center gap-3 px-3 py-2 mt-4 rounded-xl text-white/50 hover:bg-white/5 transition-all">
            <Plus className="w-5 h-5" />
            <span>New List</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {selectedListId
              ? lists.find((l) => l.id === selectedListId)?.name
              : 'All Tasks'}
          </h2>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex glass rounded-xl p-1">
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-lg transition-all ${
                  view === 'list' ? 'bg-indigo-500 text-white' : 'text-white/60'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('kanban')}
                className={`p-2 rounded-lg transition-all ${
                  view === 'kanban' ? 'bg-indigo-500 text-white' : 'text-white/60'
                }`}
              >
                <Columns className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Add task input */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            className="glass-input flex-1"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddTask}
            className="glass-button-primary px-6"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Tasks view */}
        <div className="flex-1 overflow-auto glass-card">
          {view === 'list' ? (
            <ListView
              tasks={tasks}
              lists={lists}
              selectedListId={selectedListId}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onReorder={handleReorder}
            />
          ) : (
            <KanbanView
              tasks={tasks}
              lists={lists}
              onToggleTask={handleToggleTask}
            />
          )}
        </div>
      </div>
    </div>
  )
}
