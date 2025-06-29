import React from 'react'
import { ActionButton, ActionButtonProps } from '@/components'
import { LuFile } from 'react-icons/lu'
import { useNoteStore } from '@renderer/store/store'

export const NewNoteButton = ({ ...props }: ActionButtonProps): React.JSX.Element => {
  const createEmptyNote = useNoteStore((state) => state.addNewNote)

  const handleCreation = (): void => {
    createEmptyNote({
      title: 'new note',
      content: 'hello world'
    })
  }
  return (
    <ActionButton {...props} onClick={handleCreation}>
      <LuFile className="w-4 h-4 text-zinc-300" />
    </ActionButton>
  )
}
