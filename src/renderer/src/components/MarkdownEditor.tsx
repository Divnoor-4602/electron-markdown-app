import React, { useState, useEffect, useRef, useCallback } from 'react'
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import { useMarkdownEditor } from '@renderer/hooks/useMarkdownEditor'
import { useNoteStore } from '@renderer/store/store'
import { throttle } from 'lodash'

export const MarkdownEditor = (): React.JSX.Element => {
  const { selectedNote, saveNote } = useMarkdownEditor()
  const notes = useNoteStore((state) => state.notes)

  // Default content when no notes exist at all
  const welcomeContent = `# Welcome to DivNotes! 📝

You don't have any notes yet. Let's get you started!

## Getting Started

1. **Create your first note** by clicking the **New Note** button (📄) in the sidebar
2. **Start writing** - DivNotes supports full Markdown syntax
3. **Switch between modes** using keyboard shortcuts:
   - \`Cmd + E\` → Edit Mode
   - \`Cmd + P\` → Preview Mode

## Features

- ✨ **Real-time preview** - See your formatting as you type
- 🎯 **Auto-save** - Your notes are automatically saved
- ⌨️ **Keyboard shortcuts** - Work efficiently with hotkeys
- 🌙 **Dark mode** - Easy on your eyes

---

**Ready to start?** Click the **New Note** button to create your first note!

---

# Markdown Syntax Guide

## Headings

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

## Text Emphasis

**Bold text** or __bold text__
*Italic text* or _italic text_
***Bold and italic*** or ___bold and italic___
~~Strikethrough text~~

## Lists

### Unordered Lists
- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
- Item 3

### Ordered Lists
1. First item
2. Second item
   1. Nested item 2.1
   2. Nested item 2.2
3. Third item

### Task Lists
- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task

## Links and Images

[DivNotes Website](https://example.com)
[Link with title](https://example.com "Title text")

## Code

### Inline Code
Use \`inline code\` for small snippets.

### Code Blocks

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet("World");
\`\`\`

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
\`\`\`

\`\`\`json
{
  "name": "DivNotes",
  "version": "1.0.0",
  "description": "A beautiful markdown note-taking app"
}
\`\`\`

## Quotes

> This is a blockquote.
> It can span multiple lines.

> ### Nested Quote
> 
> > This is a nested blockquote.
> > 
> > **Author Name**

## Tables

| Feature | Description | Status |
|---------|-------------|--------|
| Auto-save | Saves notes automatically | ✅ |
| Dark mode | Easy on the eyes | ✅ |
| Shortcuts | Keyboard navigation | ✅ |
| Export | Multiple formats | 🔄 |

## Horizontal Rules

You can create horizontal rules with three or more:

---
***
___

## Mathematical Expressions

Inline math: $E = mc^2$

Block math:
$$
\\frac{1}{n} \\sum_{i=1}^{n} x_i = \\bar{x}
$$

## Special Characters & Emojis

You can use emojis: 🎉 📝 ⭐ 🚀 💡 🔥 ✨ 📊 🎯 🌟

## Footnotes

Here's a sentence with a footnote[^1].

[^1]: This is the footnote text.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| \`Cmd + E\` | Switch to Edit mode |
| \`Cmd + P\` | Switch to Preview mode |
| \`Cmd + S\` | Manual save (auto-save is enabled) |

## Tips & Tricks

💡 **Pro Tip**: Start typing to replace this content with your own notes!

🎯 **Focus Mode**: The editor automatically switches to preview after 10 seconds of inactivity.

⚡ **Quick Start**: Use the shortcuts above for faster navigation between edit and preview modes.

---

*Start creating your first note to see the magic happen! All your notes are automatically saved to your local filesystem.*`

  // Content when notes exist but none is selected
  const selectNoteContent =
    '# Select a Note to Start Editing ✏️\n\nYou have notes available in the sidebar. Click on any note to start editing.\n\n## Quick Actions\n\n- **Select a note** from the sidebar to view and edit it\n- **Create a new note** using the New Note button (📄)\n- **Use keyboard shortcuts** for quick navigation:\n  - `Cmd + E` → Edit Mode\n  - `Cmd + P` → Preview Mode\n\n---\n\n*Choose a note from the sidebar to begin editing.*'

  // Determine what content to show
  const getDefaultContent = (): string => {
    if (notes.length === 0) {
      return welcomeContent // No notes exist
    } else {
      return selectNoteContent // Notes exist but none selected
    }
  }

  const [value, setValue] = useState<string>(selectedNote?.content || getDefaultContent())
  const [isEditing, setIsEditing] = useState<boolean>(false) // Start in preview mode
  const [hasFocus, setHasFocus] = useState<boolean>(false)
  const [isFirstEdit, setIsFirstEdit] = useState<boolean>(true) // Track if this is the first time editing
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  // Check if we have a selected note
  const hasSelectedNote = selectedNote !== null

  // Create throttled auto-save function
  const throttledAutoSave = useCallback(
    throttle(
      async (content: string) => {
        if (hasSelectedNote && selectedNote) {
          try {
            await saveNote(content)
            console.info('Note auto-saved successfully')
          } catch (error) {
            console.error('Auto-save failed:', error)
          }
        }
      },
      3000,
      { leading: false, trailing: true }
    ),
    [hasSelectedNote, selectedNote, saveNote]
  )

  // Update value when selectedNote changes or notes array changes
  useEffect(() => {
    if (selectedNote?.content) {
      setValue(selectedNote.content)
      setIsFirstEdit(false) // Don't clear content if we have a real note
    } else {
      setValue(getDefaultContent())
      setIsFirstEdit(true) // Reset first edit flag for default content
      setIsEditing(false) // Force preview mode when no note selected
    }
  }, [selectedNote, notes.length])

  // Cleanup throttled function on unmount
  useEffect(() => {
    return () => {
      throttledAutoSave.cancel()
    }
  }, [throttledAutoSave])

  const clearInactivityTimeout = (): void => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current)
    }
  }

  const setInactivityTimeout = (): void => {
    clearInactivityTimeout()

    // Only set timeout if we have focus (caret is active) and have a selected note
    if (hasFocus && hasSelectedNote) {
      inactivityTimeoutRef.current = setTimeout(() => {
        // Only switch to preview if still focused (caret still active but inactive)
        if (hasFocus) {
          setIsEditing(false)
        }
      }, 10500) // 10.5 seconds of inactivity
    }
  }

  const focusEditor = (): void => {
    // Only allow focusing if we have a selected note
    if (!hasSelectedNote) return

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
    // Only allow changes if we have a selected note
    if (!hasSelectedNote) return

    const newValue = val || ''
    setValue(newValue)

    // Trigger auto-save when content changes
    if (hasSelectedNote) {
      throttledAutoSave(newValue)
    }

    // User is actively typing
    if (hasFocus) {
      setIsEditing(true)
      setInactivityTimeout()
    }
  }

  const handleTextareaFocus = (): void => {
    // Only allow focus if we have a selected note
    if (!hasSelectedNote) return

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
    // Only allow editing if we have a selected note
    if (!hasSelectedNote) return

    // When clicking anywhere on the editor in preview mode, switch to edit mode
    if (!isEditing) {
      setIsEditing(true)
      focusEditor()
    }
  }

  const handleKeyboardShortcut = (event: KeyboardEvent): void => {
    // Only allow shortcuts if we have a selected note
    if (!hasSelectedNote) return

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
  }, [hasSelectedNote])

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
            overflow-y: auto !important;
            max-height: 100% !important;
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
          .w-md-editor-text-textarea,
          .w-md-editor-text-input,
          .w-md-editor-text {
            overflow-y: auto !important;
          }
          ${
            !hasSelectedNote
              ? `
          .w-md-editor {
            pointer-events: none !important;
          }
          .w-md-editor-preview {
            pointer-events: auto !important;
            opacity: 0.8;
          }
          .w-md-editor-text-textarea,
          .w-md-editor-text-input,
          .w-md-editor-text {
            pointer-events: none !important;
          }
          `
              : ''
          }
        `}
      </style>
      <MDEditor
        key={selectedNote?.title || 'no-note'}
        ref={editorRef}
        value={value}
        onChange={handleChange}
        data-color-mode="dark"
        hideToolbar
        visibleDragbar={false}
        preview={hasSelectedNote ? (isEditing ? 'edit' : 'preview') : 'preview'} // Always show preview when no note selected, otherwise use isEditing state
        height="100%"
        style={
          {
            backgroundColor: 'transparent',
            '--color-canvas-default': 'transparent',
            '--color-canvas-subtle': 'transparent',
            '--color-border-default': 'transparent',
            '--color-border-muted': 'transparent',
            '--color-neutral-muted': 'transparent'
          } as React.CSSProperties
        }
        textareaProps={{
          placeholder: hasSelectedNote ? 'Start typing your markdown...' : '',
          onFocus: handleTextareaFocus,
          onBlur: handleTextareaBlur,
          readOnly: !hasSelectedNote, // Make read-only when no note selected
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
            minHeight: '200px'
          }
        }}
      />
    </div>
  )
}
