import React from 'react'
import { ActionButton, ActionButtonProps } from '@/components'
import { LuFile } from 'react-icons/lu'

export const NewNoteButton = ({ ...props }: ActionButtonProps): React.JSX.Element => {
  return (
    <ActionButton {...props}>
      <LuFile className="w-4 h-4 text-zinc-300" />
    </ActionButton>
  )
}
