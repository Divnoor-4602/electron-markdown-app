import { Content, RootLayout, Sidebar } from '@/components'
import { DraggableTopBar } from '@/components'
import { ActionButtonsRow } from '@/components'

const App = (): React.JSX.Element => {
  return (
    <>
      <DraggableTopBar />
      <RootLayout>
        <Sidebar className="p-2 ">
          <ActionButtonsRow className="flex justify-between mt-1" />
        </Sidebar>
        <Content className="border-l bg-zinc-900/50 border-l-white/20">Content</Content>
      </RootLayout>
    </>
  )
}

export default App
