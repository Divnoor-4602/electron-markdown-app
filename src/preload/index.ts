import { contextBridge } from 'electron'

// check if context isolation is enabled
if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    // the navigator is an api that returns full information about the user os
    locale: navigator.language
  })
} catch (error) {
  console.error(error)
}
