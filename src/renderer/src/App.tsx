import React, { useEffect } from 'react'
import { Content, MarkdownEditor, NotePreviewList, RootLayout, Sidebar } from '@/components'
import { DraggableTopBar } from '@/components'
import { ActionButtonsRow } from '@/components'
import { FloatingNoteTitle } from './components/FloatingNoteTitle'
import { useNoteStore } from '@renderer/store/store'

const App = (): React.JSX.Element => {
  const loadNotesFromFileSystem = useNoteStore((state) => state.loadNotesFromFileSystem)

  // Load notes from file system when app starts
  useEffect(() => {
    loadNotesFromFileSystem()
  }, [loadNotesFromFileSystem])

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
