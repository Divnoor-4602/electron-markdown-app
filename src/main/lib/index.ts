import { homedir } from 'os'
import { ensureDir, readdir, stat, readFile } from 'fs-extra'
import { appDirectoryName, fileEncoding } from '../../shared/constants'
import { NoteInfo } from '../../shared/models'
import { GetNotes } from '../../shared/types'

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
