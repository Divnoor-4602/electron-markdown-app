import { create } from 'zustand'
import { notesMock } from './mocks'
import { NoteInfo } from '@shared/models'

type NotesStore = {
  notes: NoteInfo[]
  selectedNodeIndex: number | null
  setNotes: (notes: NoteInfo[]) => void
  setSelectedNoteIndex: (index: number) => void
  getNote: (selectedNodeIndex: number) => NoteInfo | undefined
}

export const useNoteStore = create<NotesStore>((set, get) => ({
  // set default notes for the app to use
  notes: notesMock,
  selectedNodeIndex: null,
  // set notes action
  setNotes: (notes: NoteInfo[]) => set({ notes }),
  // set selected note index
  setSelectedNoteIndex: (index: number) => set({ selectedNodeIndex: index }),
  // get selected note action
  getNote: (selectedNodeIndex: number) => {
    const { notes } = get()
    const selectedNote = notes[selectedNodeIndex]

    return { ...selectedNote, content: `Hello from note${selectedNodeIndex}` }
  }
}))
