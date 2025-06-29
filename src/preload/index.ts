import { contextBridge, ipcRenderer } from 'electron'
import { GetNotes, WriteNote, CreateNote, DeleteNote } from '../shared/types'

// check if context isolation is enabled
if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    // the navigator is an api that returns full information about the user os
    locale: navigator.language,
    // get notes invoker
    getNotes: (...args: Parameters<GetNotes>) => ipcRenderer.invoke('getNotes', ...args),
    // write notes invoker between the main and the renderer, exposes the ipc to the window.context
    writeNote: (...args: Parameters<WriteNote>) => ipcRenderer.invoke('writeNote', ...args),
    // create note invoker
    createNote: (...args: Parameters<CreateNote>) => ipcRenderer.invoke('createNote', ...args),
    // delete note invoker
    deleteNote: (...args: Parameters<DeleteNote>) => ipcRenderer.invoke('deleteNote', ...args)
  })
} catch (error) {
  console.error(error)
}
