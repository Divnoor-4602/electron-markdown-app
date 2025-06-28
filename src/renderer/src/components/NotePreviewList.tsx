import React, { ComponentProps } from 'react'
import { notesMock } from '@/store/mocks'
import { NotePreview } from '@/components'
import { twMerge } from 'tailwind-merge'

export const NotePreviewList = ({
  className,
  ...props
}: ComponentProps<'ul'>): React.JSX.Element => {
  // In case there are no notes to show

  if (notesMock.length === 0) {
    return (
      <ul className={twMerge('text-center pt-4', className)} {...props}>
        <span>No Notes Yet!</span>
      </ul>
    )
  }

  return (
    <ul {...props} className={className}>
      {notesMock.map((note) => (
        <NotePreview {...note} key={note.title + note.lastEditTime} />
      ))}
    </ul>
  )
}
