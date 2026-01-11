import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'
import fs from 'fs'

let db: Database.Database | null = null

export function initDatabase(): Database.Database {
  if (db) return db

  // Get the user data path for storing the database
  const userDataPath = app.getPath('userData')
  const dbPath = path.join(userDataPath, 'vianna.db')

  // Create directory if it doesn't exist
  if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true })
  }

  // Create database connection
  db = new Database(dbPath)

  // Enable foreign keys
  db.pragma('foreign_keys = ON')

  // Enable WAL mode for better performance
  db.pragma('journal_mode = WAL')

  // Read and execute schema
  const isDev = !app.isPackaged
  let schemaPath: string

  if (isDev) {
    // In development, look relative to the project root
    schemaPath = path.join(process.cwd(), 'electron', 'database', 'schema.sql')
  } else {
    // In production, look in the app resources
    schemaPath = path.join(process.resourcesPath, 'electron', 'database', 'schema.sql')
  }

  // Backup/Fallback: check adjacent to current file if first check fails
  if (!fs.existsSync(schemaPath)) {
    schemaPath = path.join(__dirname, 'schema.sql')
  }

  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf-8')
    db.exec(schema)
    console.log('Database initialized with schema from:', schemaPath)
  } else {
    console.error('Could not find schema.sql at:', schemaPath)
    throw new Error('Database schema not found')
  }

  console.log('Database initialized at:', dbPath)
  return db
}

export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.')
  }
  return db
}

export function closeDatabase(): void {
  if (db) {
    db.close()
    db = null
  }
}
