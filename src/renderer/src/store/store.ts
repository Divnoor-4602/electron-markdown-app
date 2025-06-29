import { create } from 'zustand'
import { NoteInfo } from '@shared/models'

const loadNotes = async (): Promise<NoteInfo[]> => {
  const notes = await window.context.getNotes()
  return notes.sort((a, b) => b.lastEditTime - a.lastEditTime)
}

type NotesStore = {
  notes: NoteInfo[]
  selectedNodeIndex: number | null
  selectedNote: NoteInfo | null
  isLoading: boolean
  setNotes: (notes: NoteInfo[]) => void
  setSelectedNoteIndex: (index: number) => void
  addNewNote: (noteData: { content: string }) => Promise<void>
  removeNote: (index: number) => void
  deleteNote: () => Promise<void>
  loadNotesFromFileSystem: () => Promise<void>
  saveNote: (content: string) => Promise<void>
}

export const useNoteStore = create<NotesStore>((set, get) => ({
  // Initialize with empty array, will be loaded from file system
  notes: [],
  selectedNodeIndex: null,
  selectedNote: null,
  isLoading: false,
  // set notes action
  setNotes: (notes: NoteInfo[]) => set({ notes }),
  // set selected note index
  setSelectedNoteIndex: (index: number) => {
    const { notes } = get()
    const selectedNote = notes[index]
    set({ selectedNodeIndex: index, selectedNote })
  },
  // load notes from file system
  loadNotesFromFileSystem: async () => {
    set({ isLoading: true })
    try {
      const notes = await loadNotes()
      set({ notes, isLoading: false })
    } catch (error) {
      console.error('Failed to load notes:', error)
      set({ isLoading: false })
    }
  },
  // save note to file system
  saveNote: async (content: string) => {
    const { selectedNote, selectedNodeIndex, notes } = get()

    if (!selectedNote || selectedNodeIndex === null) {
      console.warn('No note selected to save')
      return
    }

    try {
      // Save to file system
      await window.context.writeNote(selectedNote.title, content)

      // Update the note in the store with new content and lastEditTime
      const updatedNotes = [...notes]
      const updatedNote: NoteInfo = {
        ...selectedNote,
        content,
        lastEditTime: new Date().getTime()
      }

      updatedNotes[selectedNodeIndex] = updatedNote

      // Update store state
      set({
        notes: updatedNotes,
        selectedNote: updatedNote
      })

      console.info(`Note "${selectedNote.title}" saved successfully`)
    } catch (error) {
      console.error('Failed to save note:', error)
      throw error // Re-throw so calling code can handle the error
    }
  },
  // create and delete actions
  addNewNote: async ({ content }) => {
    try {
      // Use createNote to show save dialog and create the file
      const filename = await window.context.createNote()

      if (!filename) {
        // User cancelled the creation dialog
        console.info('Note creation cancelled by user')
        return
      }

      const { notes } = get()
      const newNote: NoteInfo = {
        title: filename, // Use the filename returned by createNote
        content,
        lastEditTime: new Date().getTime()
      }

      // Save the content to the newly created file
      await window.context.writeNote(filename, content)

      const updatedNotes = [newNote, ...notes] // Add new note at the beginning
      const newSelectedIndex = 0 // Select the newly created note
      set({
        notes: updatedNotes,
        selectedNodeIndex: newSelectedIndex,
        selectedNote: newNote
      })

      console.info(`New note "${filename}" created and saved successfully`)
    } catch (error) {
      console.error('Failed to create new note:', error)
      throw error // Re-throw so calling code can handle the error
    }
  },
  removeNote: (index: number) => {
    const { notes, selectedNodeIndex } = get()
    if (index < 0 || index >= notes.length) return // Invalid index

    const updatedNotes = notes.filter((_, i) => i !== index)

    // Handle selected note index after deletion
    let newSelectedIndex: number | null = selectedNodeIndex
    let newSelectedNote: NoteInfo | null = null

    if (selectedNodeIndex === index) {
      // If the deleted note was selected, select another note or null
      if (updatedNotes.length > 0) {
        // Select the note at the same index, or the last note if index is out of bounds
        newSelectedIndex = index < updatedNotes.length ? index : updatedNotes.length - 1
        newSelectedNote = updatedNotes[newSelectedIndex]
      } else {
        // No notes left
        newSelectedIndex = null
        newSelectedNote = null
      }
    } else if (selectedNodeIndex !== null && selectedNodeIndex > index) {
      // If the selected note is after the deleted note, adjust the index
      newSelectedIndex = selectedNodeIndex - 1
      newSelectedNote = updatedNotes[newSelectedIndex]
    } else if (selectedNodeIndex !== null) {
      // Selected note is before the deleted note, keep the same note but update reference
      newSelectedNote = updatedNotes[selectedNodeIndex]
    }

    set({
      notes: updatedNotes,
      selectedNodeIndex: newSelectedIndex,
      selectedNote: newSelectedNote
    })
  },
  deleteNote: async () => {
    const { selectedNote, selectedNodeIndex, notes } = get()

    if (!selectedNote || selectedNodeIndex === null) {
      console.warn('No note selected to delete')
      return
    }

    try {
      // Show confirmation dialog and delete from file system
      const confirmed = await window.context.deleteNote(selectedNote.title)

      if (!confirmed) {
        console.info('Note deletion cancelled by user')
        return
      }

      // Remove from store
      const updatedNotes = notes.filter((_, i) => i !== selectedNodeIndex)

      // Handle selected note index after deletion
      let newSelectedIndex: number | null = null
      let newSelectedNote: NoteInfo | null = null

      if (updatedNotes.length > 0) {
        // Select the note at the same index, or the last note if index is out of bounds
        newSelectedIndex =
          selectedNodeIndex < updatedNotes.length ? selectedNodeIndex : updatedNotes.length - 1
        newSelectedNote = updatedNotes[newSelectedIndex]
      }

      set({
        notes: updatedNotes,
        selectedNodeIndex: newSelectedIndex,
        selectedNote: newSelectedNote
      })

      console.info(`Note "${selectedNote.title}" deleted successfully`)
    } catch (error) {
      console.error('Failed to delete note:', error)
      throw error // Re-throw so calling code can handle the error
    }
  }
}))
