/// <reference types="vite/client" />

interface ElectronAPI {
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

export {}
