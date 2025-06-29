import { useNoteStore } from '@renderer/store/store'
import { NoteInfo } from '@shared/models'

export const useMarkdownEditor = (): {
  selectedNote: NoteInfo | null
  saveNote: (content: string) => Promise<void>
} => {
  const selectedNote = useNoteStore((state) => state.selectedNote)
  const saveNote = useNoteStore((state) => state.saveNote)
  return { selectedNote, saveNote }
}
