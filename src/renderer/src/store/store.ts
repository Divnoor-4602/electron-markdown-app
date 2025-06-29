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
  addNewNote: (noteData: { title: string; content: string }) => void
  removeNote: (index: number) => void
  loadNotesFromFileSystem: () => Promise<void>
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
  // create and delete actions
  addNewNote: ({ title, content }) => {
    const { notes } = get()
    const newNote: NoteInfo = {
      title,
      content,
      lastEditTime: new Date().getTime()
    }
    const updatedNotes = [newNote, ...notes] // Add new note at the beginning
    const newSelectedIndex = 0 // Select the newly created note
    set({
      notes: updatedNotes,
      selectedNodeIndex: newSelectedIndex,
      selectedNote: newNote
    })
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
  }
}))
