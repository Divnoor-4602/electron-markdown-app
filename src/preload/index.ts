import { contextBridge, ipcRenderer } from 'electron'
import { GetNotes } from '../shared/types'

// check if context isolation is enabled
if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    // the navigator is an api that returns full information about the user os
    locale: navigator.language,
    // get notes invoker
    getNotes: (...args: Parameters<GetNotes>) => ipcRenderer.invoke('getNotes', ...args)
  })
} catch (error) {
  console.error(error)
}
