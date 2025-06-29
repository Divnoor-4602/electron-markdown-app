import React, { ComponentProps } from 'react'
import { NotePreview } from '@/components'
import { twMerge } from 'tailwind-merge'
import { useNotesList } from '@renderer/hooks/useNotesList'
import { useNoteStore } from '@renderer/store/store'

export const NotePreviewList = ({
  className,
  ...props
}: ComponentProps<'ul'>): React.JSX.Element => {
  const { notes, selectedNoteIndex, handleNoteSelect } = useNotesList({})
  const isLoading = useNoteStore((state) => state.isLoading)

  // Show loading state
  if (isLoading) {
    return (
      <ul className={twMerge('text-center pt-4', className)} {...props}>
        <span className="text-zinc-400">Loading notes...</span>
      </ul>
    )
  }

  // In case there are no notes to show
  if (notes.length === 0) {
    return (
      <ul className={twMerge('text-center pt-4', className)} {...props}>
        <span className="text-zinc-400">No Notes Yet!</span>
      </ul>
    )
  }

  return (
    <ul {...props} className={className}>
      {notes.map((note, index) => (
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
