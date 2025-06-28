import React, { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const FloatingNoteTitle = ({
  className,
  ...props
}: ComponentProps<'div'>): React.JSX.Element => {
  const title = 'note title'
  return (
    <div className={twMerge('flex justify-center', className)} {...props}>
      <span className="text-gray-400">{title}</span>
    </div>
  )
}
