import { useNoteStore } from '@renderer/store/store'
import { NoteInfo } from '@shared/models'

export const useMarkdownEditor = (): { selectedNote: NoteInfo | null } => {
  const selectedNote = useNoteStore((state) => state.selectedNote)
  return { selectedNote }
}
