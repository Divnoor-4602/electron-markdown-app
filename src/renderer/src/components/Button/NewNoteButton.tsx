import React from 'react'
import { ActionButton, ActionButtonProps } from '@/components'
import { LuFile } from 'react-icons/lu'
import { useNoteStore } from '@renderer/store/store'

export const NewNoteButton = ({ ...props }: ActionButtonProps): React.JSX.Element => {
  const createEmptyNote = useNoteStore((state) => state.addNewNote)

  const handleCreation = async (): Promise<void> => {
    try {
      await createEmptyNote({
        content: `# New Note\n\nStart writing your thoughts here...\n\n`
      })
    } catch (error) {
      console.error('Failed to create new note:', error)
    }
  }

  return (
    <ActionButton {...props} onClick={handleCreation}>
      <LuFile className="w-4 h-4 text-zinc-300" />
    </ActionButton>
  )
}
