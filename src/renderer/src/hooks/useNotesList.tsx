import { useNoteStore } from '@renderer/store/store'
import { NoteInfo } from '@shared/models'

type NoteList = {
  notes: NoteInfo[]
  selectedNoteIndex: number | null
  handleNoteSelect: (index: number) => void
}

export const useNotesList = ({ onSelect }: { onSelect?: () => void }): NoteList => {
  // get the notes list from the store
  const notes: NoteInfo[] = useNoteStore((state) => state.notes)

  // the selected note index
  const selectedNoteIndex = useNoteStore((state) => state.selectedNodeIndex)

  // get the select note index action
  const setSelectedNoteIndex = useNoteStore((state) => state.setSelectedNoteIndex)

  const handleNoteSelect = (index: number): void => {
    setSelectedNoteIndex(index)
  }

  if (onSelect) onSelect()

  return { notes, selectedNoteIndex, handleNoteSelect }
}
