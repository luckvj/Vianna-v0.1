import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import path from 'path'
import { initDatabase, getDatabase } from './database/db'

let mainWindow: BrowserWindow | null = null

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    frame: false,
    transparent: true,
    vibrancy: 'under-window',
    visualEffectState: 'active',
    backgroundColor: '#00000000',
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 20, y: 20 },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  // Initialize database
  initDatabase()

  if (isDev) {
    if (process.env.VITE_DEV_SERVER_URL) {
      mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    } else {
      mainWindow.loadURL('http://localhost:5173')
    }
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Window controls
ipcMain.on('window:minimize', () => mainWindow?.minimize())
ipcMain.on('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})
ipcMain.on('window:close', () => mainWindow?.close())

// Database operations
ipcMain.handle('db:query', async (_, sql: string, params?: any[]) => {
  const db = getDatabase()
  try {
    const stmt = db.prepare(sql)
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return params ? stmt.all(...params) : stmt.all()
    } else {
      return params ? stmt.run(...params) : stmt.run()
    }
  } catch (error) {
    console.error('Database error:', error)
    throw error
  }
})

ipcMain.handle('db:get', async (_, sql: string, params?: any[]) => {
  const db = getDatabase()
  try {
    const stmt = db.prepare(sql)
    return params ? stmt.get(...params) : stmt.get()
  } catch (error) {
    console.error('Database error:', error)
    throw error
  }
})

// Theme
ipcMain.handle('theme:get', () => nativeTheme.shouldUseDarkColors)
ipcMain.on('theme:set', (_, dark: boolean) => {
  nativeTheme.themeSource = dark ? 'dark' : 'light'
})

// App info
ipcMain.handle('app:version', () => app.getVersion())
ipcMain.handle('app:path', (_, name: 'home' | 'appData' | 'userData' | 'desktop' | 'documents') => {
  return app.getPath(name)
})
