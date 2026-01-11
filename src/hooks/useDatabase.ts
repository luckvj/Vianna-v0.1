import { useState, useEffect, useCallback } from 'react'

export function useDatabase() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Check if electron API is available
    if (window.electron?.db) {
      setIsReady(true)
    }
  }, [])

  const query = useCallback(async <T = any>(sql: string, params?: any[]): Promise<T[]> => {
    if (!window.electron?.db) {
      console.warn('Database not available')
      return []
    }
    try {
      const result = await window.electron.db.query(sql, params)
      return result as T[]
    } catch (error) {
      console.error('Database query error:', error)
      throw error
    }
  }, [])

  const get = useCallback(async <T = any>(sql: string, params?: any[]): Promise<T | null> => {
    if (!window.electron?.db) {
      console.warn('Database not available')
      return null
    }
    try {
      const result = await window.electron.db.get(sql, params)
      return result as T | null
    } catch (error) {
      console.error('Database get error:', error)
      throw error
    }
  }, [])

  const execute = useCallback(async (sql: string, params?: any[]) => {
    if (!window.electron?.db) {
      console.warn('Database not available')
      return null
    }
    try {
      return await window.electron.db.query(sql, params)
    } catch (error) {
      console.error('Database execute error:', error)
      throw error
    }
  }, [])

  return {
    isReady,
    query,
    get,
    execute,
  }
}

// Typed query helpers
export function useEvents() {
  const { query, execute } = useDatabase()

  return {
    getAll: () => query('SELECT * FROM events ORDER BY start_time'),
    getById: (id: string) => query('SELECT * FROM events WHERE id = ?', [id]),
    create: (event: any) =>
      execute(
        `INSERT INTO events (id, title, description, start_time, end_time, all_day, category, color, location, recurrence)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [event.id, event.title, event.description, event.start_time, event.end_time, event.all_day ? 1 : 0, event.category, event.color, event.location, event.recurrence]
      ),
    update: (id: string, updates: any) =>
      execute(
        `UPDATE events SET title = ?, description = ?, start_time = ?, end_time = ?, updated_at = ? WHERE id = ?`,
        [updates.title, updates.description, updates.start_time, updates.end_time, Date.now(), id]
      ),
    delete: (id: string) => execute('DELETE FROM events WHERE id = ?', [id]),
  }
}

export function useTasks() {
  const { query, execute } = useDatabase()

  return {
    getAll: () => query('SELECT * FROM tasks ORDER BY position'),
    getByList: (listId: string) =>
      query('SELECT * FROM tasks WHERE list_id = ? ORDER BY position', [listId]),
    create: (task: any) =>
      execute(
        `INSERT INTO tasks (id, title, description, due_date, priority, list_id, position)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [task.id, task.title, task.description, task.due_date, task.priority, task.list_id, task.position]
      ),
    update: (id: string, updates: any) =>
      execute(
        `UPDATE tasks SET title = ?, completed = ?, completed_at = ?, updated_at = ? WHERE id = ?`,
        [updates.title, updates.completed ? 1 : 0, updates.completed_at, Date.now(), id]
      ),
    delete: (id: string) => execute('DELETE FROM tasks WHERE id = ?', [id]),
  }
}
