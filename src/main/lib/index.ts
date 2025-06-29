import { homedir } from 'os'
import { ensureDir, readdir, stat, readFile, writeFile, unlink } from 'fs-extra'
import { appDirectoryName, fileEncoding } from '../../shared/constants'
import { NoteInfo } from '../../shared/models'
import { CreateNote, GetNotes, DeleteNote } from '../../shared/types'
import { dialog } from 'electron'
import path from 'path'

export const getRootDir = (): string => {
  return `${homedir}/${appDirectoryName}`
}

export const getNotes: GetNotes = async (): Promise<NoteInfo[]> => {
  const rootDir = getRootDir()

  await ensureDir(rootDir)

  const notesFileNames = await readdir(rootDir, {
    encoding: fileEncoding,
    withFileTypes: false
  })

  const notes = notesFileNames.filter((fileName) => fileName.endsWith('.md'))

  return Promise.all(notes.map(getNoteInfoFromFilename))
}

export const getNoteInfoFromFilename = async (filename: string): Promise<NoteInfo> => {
  const fileStats = await stat(`${getRootDir()}/${filename}`)

  // Read the actual file content
  const content = await readFile(`${getRootDir()}/${filename}`, { encoding: fileEncoding })

  return {
    title: filename.replace(/\.md$/, ''),
    content,
    lastEditTime: fileStats.mtimeMs
  }
}

export const writeNote = async (filename: string, content: string): Promise<void> => {
  const rootDir = getRootDir()

  console.info(`Writing note ${filename}`)

  return writeFile(`${rootDir}/${filename}.md`, content, { encoding: fileEncoding })
}

export const createNote: CreateNote = async () => {
  const rootDir = getRootDir()

  await ensureDir(rootDir)

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'New note',
    defaultPath: `${rootDir}/Untitled.md`,
    buttonLabel: 'Create',
    properties: ['showOverwriteConfirmation'],
    showsTagField: true,
    filters: [{ name: 'Markdown', extensions: ['md'] }]
  })

  if (canceled || !filePath) {
    console.log('note creation failed')
    return false
  }

  const { name: filename, dir: parentDir } = path.parse(filePath)

  if (parentDir != rootDir) {
    await dialog.showMessageBox({
      type: 'error',
      title: 'Creation failed',
      message: 'All notes must be saved under root directory'
    })
    return false
  }

  console.info(`Creating note: ${filePath}`)
  await writeFile(filePath, '')

  return filename
}

export const deleteNote: DeleteNote = async (filename: string) => {
  const rootDir = getRootDir()
  const filePath = `${rootDir}/${filename}.md`

  // Show confirmation dialog
  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: 'Delete Note',
    message: `Are you sure you want to delete "${filename}"?`,
    detail: 'This action cannot be undone.',
    buttons: ['Delete', 'Cancel'],
    defaultId: 1, // Default to Cancel
    cancelId: 1
  })

  if (response === 1) {
    // User clicked Cancel
    console.info(`Note deletion cancelled: ${filename}`)
    return false
  }

  try {
    // User clicked Delete, proceed with deletion
    await unlink(filePath)
    console.info(`Note deleted successfully: ${filename}`)
    return true
  } catch (error) {
    console.error(`Failed to delete note: ${filename}`, error)

    // Show error dialog
    await dialog.showMessageBox({
      type: 'error',
      title: 'Deletion Failed',
      message: `Failed to delete "${filename}".`,
      detail: error instanceof Error ? error.message : 'Unknown error occurred.'
    })

    return false
  }
}
