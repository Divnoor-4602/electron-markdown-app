import { useNoteStore } from '@renderer/store/store'
import React, { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const FloatingNoteTitle = ({
  className,
  ...props
}: ComponentProps<'div'>): React.JSX.Element => {
  const selectedNote = useNoteStore((state) => state.selectedNote)
  return (
    <div className={twMerge('flex justify-center', className)} {...props}>
      <span className="text-gray-400">{selectedNote?.title || 'hey there 👋'}</span>
    </div>
  )
}
