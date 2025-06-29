import React, { useState, useEffect, useRef } from 'react'
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import { useMarkdownEditor } from '@renderer/hooks/useMarkdownEditor'

export const MarkdownEditor = (): React.JSX.Element => {
  const { selectedNote } = useMarkdownEditor()

  // Default content when no note is selected
  const defaultContent =
    "# What's on your mind today?\n\nClick anywhere to start writing your thoughts...\n\n## Keyboard Shortcuts\n\nSwitch between edit and preview modes:\n\n```javascript\nCmd + E  →  Edit Mode\nCmd + P  →  Preview Mode\n```\n\n*Start typing to delete all this and begin your note. The editor will automatically switch to preview mode after 10 seconds of inactivity.*"

  const [value, setValue] = useState<string>(selectedNote?.content || defaultContent)
  const [isEditing, setIsEditing] = useState<boolean>(false) // Start in preview mode
  const [hasFocus, setHasFocus] = useState<boolean>(false)
  const [isFirstEdit, setIsFirstEdit] = useState<boolean>(true) // Track if this is the first time editing
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  // Update value when selectedNote changes
  useEffect(() => {
    if (selectedNote?.content) {
      setValue(selectedNote.content)
      setIsFirstEdit(false) // Don't clear content if we have a real note
    } else {
      setValue(defaultContent)
      setIsFirstEdit(true) // Reset first edit flag for default content
    }
  }, [selectedNote])

  const clearInactivityTimeout = (): void => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current)
    }
  }

  const setInactivityTimeout = (): void => {
    clearInactivityTimeout()

    // Only set timeout if we have focus (caret is active)
    if (hasFocus) {
      inactivityTimeoutRef.current = setTimeout(() => {
        // Only switch to preview if still focused (caret still active but inactive)
        if (hasFocus) {
          setIsEditing(false)
        }
      }, 10500) // 10.5 seconds of inactivity
    }
  }

  const focusEditor = (): void => {
    // Find and focus the textarea within the MDEditor using a more reliable approach
    setTimeout(() => {
      // Try multiple selectors to find the textarea
      const selectors = [
        '.w-md-editor-text-textarea textarea',
        '.w-md-editor-text textarea',
        '.w-md-editor textarea',
        'textarea'
      ]

      for (const selector of selectors) {
        const textarea = document.querySelector(selector) as HTMLTextAreaElement
        if (textarea && textarea.closest('.w-md-editor')) {
          textarea.focus()
          // Position cursor at the end of text
          const length = textarea.value.length
          textarea.setSelectionRange(length, length)
          return
        }
      }
    }, 150) // Increased delay to ensure editor is fully rendered
  }

  const handleChange = (val: string | undefined): void => {
    setValue(val || '')

    // User is actively typing
    if (hasFocus) {
      setIsEditing(true)
      setInactivityTimeout()
    }
  }

  const handleTextareaFocus = (): void => {
    setHasFocus(true)
    setIsEditing(true)
    clearInactivityTimeout()

    // Clear intro text on first focus
    if (isFirstEdit) {
      setIsFirstEdit(false)
      setValue('')
    }
  }

  const handleTextareaBlur = (): void => {
    setHasFocus(false)
    clearInactivityTimeout()

    // Switch to preview when caret is no longer active
    setTimeout(() => {
      setIsEditing(false)
    }, 200) // Small delay to ensure blur is processed
  }

  const handleEditorClick = (): void => {
    // When clicking anywhere on the editor in preview mode, switch to edit mode
    if (!isEditing) {
      setIsEditing(true)
      focusEditor()
    }
  }

  const handleKeyboardShortcut = (event: KeyboardEvent): void => {
    // Check for Command key (metaKey on Mac) or Ctrl key (for Windows/Linux)
    if (event.metaKey || event.ctrlKey) {
      if (event.key.toLowerCase() === 'e') {
        event.preventDefault()
        setIsEditing(true)
        setHasFocus(true)
        clearInactivityTimeout()
        focusEditor()
      } else if (event.key.toLowerCase() === 'p') {
        event.preventDefault()
        setIsEditing(false)
        setHasFocus(false)
        clearInactivityTimeout()
      }
    }
  }

  // Cleanup timeout on unmount and setup keyboard shortcuts
  useEffect(() => {
    // Add keyboard shortcut listener
    document.addEventListener('keydown', handleKeyboardShortcut)

    return () => {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current)
      }
      // Remove keyboard shortcut listener
      document.removeEventListener('keydown', handleKeyboardShortcut)
    }
  }, [])

  return (
    <div className="h-full w-full pt-8" onClick={handleEditorClick}>
      <style>
        {`
          .w-md-editor {
            background-color: transparent !important;
          }
          .w-md-editor .w-md-editor-text {
            background-color: transparent !important;
          }
          .w-md-editor .w-md-editor-text-textarea {
            background-color: transparent !important;
          }
          .w-md-editor .w-md-editor-preview {
            background-color: transparent !important;
          }
          .w-md-editor .w-md-editor-text-input {
            background-color: transparent !important;
          }
          .w-md-editor .w-md-editor-text-area {
            background-color: transparent !important;
          }
          .w-md-editor-text, .w-md-editor-preview {
            background: transparent !important;
          }
          .wmde-markdown {
            background: transparent !important;
          }
          .wmde-markdown-var {
            background: transparent !important;
          }
        `}
      </style>
      <MDEditor
        key={selectedNote?.title}
        ref={editorRef}
        value={value}
        onChange={handleChange}
        data-color-mode="dark"
        hideToolbar
        visibleDragbar={false}
        preview={isEditing ? 'edit' : 'preview'}
        height="100%"
        style={
          {
            height: '100%',
            maxHeight: '100%',
            backgroundColor: 'transparent',
            '--color-canvas-default': 'transparent',
            '--color-canvas-subtle': 'transparent',
            '--color-border-default': 'transparent',
            '--color-border-muted': 'transparent',
            '--color-neutral-muted': 'transparent'
          } as React.CSSProperties
        }
        textareaProps={{
          placeholder: 'Start typing your markdown...',
          onFocus: handleTextareaFocus,
          onBlur: handleTextareaBlur,
          style: {
            fontSize: 14,
            lineHeight: 1.6,
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            resize: 'none',
            backgroundColor: 'transparent',
            color: 'inherit',
            border: 'none',
            outline: 'none',
            padding: '16px',
            width: '100%',
            height: '100%',
            maxHeight: '100%',
            overflow: 'auto'
          }
        }}
      />
    </div>
  )
}
