import { create } from 'zustand'
import { notesMock } from './mocks'
import { NoteInfo } from '@shared/models'

type NotesStore = {
  notes: NoteInfo[]
  selectedNodeIndex: number | null
  selectedNote: NoteInfo | null
  setNotes: (notes: NoteInfo[]) => void
  setSelectedNoteIndex: (index: number) => void
}

export const useNoteStore = create<NotesStore>((set, get) => ({
  // set default notes for the app to use
  notes: notesMock,
  selectedNodeIndex: null,
  selectedNote: null,
  // set notes action
  setNotes: (notes: NoteInfo[]) => set({ notes }),
  // set selected note index
  setSelectedNoteIndex: (index: number) => {
    const { notes } = get()
    const selectedNote = notes[index]
    set({ selectedNodeIndex: index, selectedNote })
  }
}))
