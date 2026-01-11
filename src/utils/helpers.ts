import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday } from 'date-fns'

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return crypto.randomUUID()
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | number, formatStr = 'MMM d, yyyy'): string {
  const d = typeof date === 'number' ? new Date(date) : date
  return format(d, formatStr)
}

/**
 * Format a date relative to now
 */
export function formatRelativeDate(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date

  if (isToday(d)) return 'Today'
  if (isTomorrow(d)) return 'Tomorrow'
  if (isYesterday(d)) return 'Yesterday'

  return formatDistanceToNow(d, { addSuffix: true })
}

/**
 * Format time
 */
export function formatTime(date: Date | number, use24Hour = false): string {
  const d = typeof date === 'number' ? new Date(date) : date
  return format(d, use24Hour ? 'HH:mm' : 'h:mm a')
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Get greeting based on time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Generate a random color from a predefined palette
 */
export function getRandomColor(): string {
  const colors = [
    '#6366f1', // Indigo
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#3b82f6', // Blue
    '#06b6d4', // Cyan
    '#10b981', // Green
    '#f97316', // Orange
    '#ef4444', // Red
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * Get color based on string (for consistent avatar colors)
 */
export function getColorFromString(str: string): string {
  const colors = [
    '#6366f1',
    '#8b5cf6',
    '#ec4899',
    '#3b82f6',
    '#06b6d4',
    '#10b981',
    '#f97316',
    '#ef4444',
  ]
  const index = str.charCodeAt(0) % colors.length
  return colors[index]
}

/**
 * Check if a date is overdue
 */
export function isOverdue(date: Date | number): boolean {
  const d = typeof date === 'number' ? new Date(date) : date
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return d < now
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/**
 * Parse tags from a string (e.g., "#work #urgent")
 */
export function parseTags(text: string): string[] {
  const matches = text.match(/#\w+/g)
  return matches ? matches.map((tag) => tag.slice(1)) : []
}
