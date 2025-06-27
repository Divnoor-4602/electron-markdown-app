import { ActionButton, ActionButtonProps } from '@/components'
import { FaRegTrashCan } from 'react-icons/fa6'

export const DeleteNoteButton = ({ ...props }: ActionButtonProps): React.JSX.Element => {
  return (
    <ActionButton {...props}>
      <FaRegTrashCan className="size-4 text-zinc-300" />
    </ActionButton>
  )
}
