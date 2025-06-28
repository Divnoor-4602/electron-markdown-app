import { Content, MarkdownEditor, NotePreviewList, RootLayout, Sidebar } from '@/components'
import { DraggableTopBar } from '@/components'
import { ActionButtonsRow } from '@/components'
import { FloatingNoteTitle } from './components/FloatingNoteTitle'

const App = (): React.JSX.Element => {
  return (
    <>
      <DraggableTopBar />
      <RootLayout>
        <Sidebar className="p-2 ">
          <ActionButtonsRow className="flex justify-between mt-1" />
          {/* note preview list */}
          <NotePreviewList className="mt-3 space-y-1" />
        </Sidebar>
        <Content className="border-l bg-zinc-900/50 border-l-white/20">
          <FloatingNoteTitle className="pt-2" />
          <MarkdownEditor />
        </Content>
      </RootLayout>
    </>
  )
}

export default App
