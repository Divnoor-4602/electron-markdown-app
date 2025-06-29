import { ActionButton, ActionButtonProps } from '@/components'
import { useNoteStore } from '@renderer/store/store'
import { FaRegTrashCan } from 'react-icons/fa6'

export const DeleteNoteButton = ({ ...props }: ActionButtonProps): React.JSX.Element => {
  const deleteNote = useNoteStore((state) => state.removeNote)
  const selectedNoteIndex = useNoteStore((state) => state.selectedNodeIndex)

  const handleDeleteNote = (): void => {
    if (selectedNoteIndex !== null) {
      deleteNote(selectedNoteIndex)
    }
  }

  return (
    <ActionButton {...props} onClick={handleDeleteNote} disabled={selectedNoteIndex === null}>
      <FaRegTrashCan className="size-4 text-zinc-300" />
    </ActionButton>
  )
}
