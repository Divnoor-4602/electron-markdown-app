import React, { ComponentProps } from 'react'
import { notesMock } from '@/store/mocks'
import { NotePreview } from '@/components'
import { twMerge } from 'tailwind-merge'
import { useNotesList } from '@renderer/hooks/useNotesList'

export const NotePreviewList = ({
  className,
  ...props
}: ComponentProps<'ul'>): React.JSX.Element => {
  const { notes, selectedNoteIndex, handleNoteSelect } = useNotesList({})

  // In case there are no notes to show

  if (notes.length === 0) {
    return (
      <ul className={twMerge('text-center pt-4', className)} {...props}>
        <span>No Notes Yet!</span>
      </ul>
    )
  }

  return (
    <ul {...props} className={className}>
      {notesMock.map((note, index) => (
        <NotePreview
          {...note}
          key={note.title + note.lastEditTime}
          onClick={() => handleNoteSelect(index)}
          isActive={selectedNoteIndex === index}
        />
      ))}
    </ul>
  )
}
