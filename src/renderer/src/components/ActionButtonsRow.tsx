import React, { ComponentProps } from 'react'
import { DeleteNoteButton, NewNoteButton } from '@/components'

export const ActionButtonsRow = ({ ...props }: ComponentProps<'div'>): React.JSX.Element => {
  return (
    <div {...props}>
      <NewNoteButton />
      <DeleteNoteButton />
    </div>
  )
}
