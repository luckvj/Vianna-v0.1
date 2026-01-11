import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // Window controls
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close'),
  },

  // Database operations
  db: {
    query: (sql: string, params?: any[]) => ipcRenderer.invoke('db:query', sql, params),
    get: (sql: string, params?: any[]) => ipcRenderer.invoke('db:get', sql, params),
  },

  // Theme
  theme: {
    get: () => ipcRenderer.invoke('theme:get'),
    set: (dark: boolean) => ipcRenderer.send('theme:set', dark),
  },

  // App info
  app: {
    version: () => ipcRenderer.invoke('app:version'),
    getPath: (name: 'home' | 'appData' | 'userData' | 'desktop' | 'documents') =>
      ipcRenderer.invoke('app:path', name),
  },

  // Platform info
  platform: process.platform,
})

// Type definitions for the exposed API
export interface ElectronAPI {
  window: {
    minimize: () => void
    maximize: () => void
    close: () => void
  }
  db: {
    query: (sql: string, params?: any[]) => Promise<any>
    get: (sql: string, params?: any[]) => Promise<any>
  }
  theme: {
    get: () => Promise<boolean>
    set: (dark: boolean) => void
  }
  app: {
    version: () => Promise<string>
    getPath: (name: 'home' | 'appData' | 'userData' | 'desktop' | 'documents') => Promise<string>
  }
  platform: NodeJS.Platform
}

declare global {
  interface Window {
    electron: ElectronAPI
  }
}
