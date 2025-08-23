'use client'

import type { Editor } from '@tiptap/react'
import { 
  Bold, Strikethrough, Italic, List, ListOrdered, Heading2, Quote, Code, ListTodo,
  Underline, Highlighter, Undo, Redo,
  Type, Heading1, Heading3
} from 'lucide-react'
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ToolbarProps {
  editor: Editor | null
}

export default function EditorToolbar({ editor }: ToolbarProps) {
  if (!editor) {
    return null
  }

  return (
    <div className="flex items-center gap-1 p-2 overflow-x-auto min-w-max">
      {/* Undo/Redo - toujours visibles */}
      <div className="flex items-center gap-1 mr-2 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0"
          title="Annuler"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0"
          title="Refaire"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Séparateur */}
      <div className="w-px h-6 bg-border mx-1 flex-shrink-0" />

      {/* Formatage du texte - compacte sur mobile */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Toggle
          size="sm"
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          className="h-8 w-8 p-0"
          title="Gras"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          className="h-8 w-8 p-0"
          title="Italique"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('underline')}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          className="h-8 w-8 p-0"
          title="Souligné"
        >
          <Underline className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('strike')}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          className="h-8 w-8 p-0"
          title="Barré"
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('highlight')}
          onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
          className="h-8 w-8 p-0"
          title="Surligné"
        >
          <Highlighter className="h-4 w-4" />
        </Toggle>
      </div>

      {/* Séparateur */}
      <div className="w-px h-6 bg-border mx-1 flex-shrink-0" />

      {/* Titres - dropdown compact sur mobile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 flex-shrink-0">
            <Type className="h-4 w-4" />
            <span className="hidden sm:ml-1 sm:inline">Style</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={editor.isActive('paragraph') ? 'bg-accent' : ''}
          >
            Paragraphe
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}
          >
            <Heading1 className="h-4 w-4 mr-2" />
            Titre 1
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
          >
            <Heading2 className="h-4 w-4 mr-2" />
            Titre 2
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''}
          >
            <Heading3 className="h-4 w-4 mr-2" />
            Titre 3
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Séparateur */}
      <div className="w-px h-6 bg-border mx-1 flex-shrink-0" />

      {/* Listes - essentielles, toujours visibles */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Toggle
          size="sm"
          pressed={editor.isActive('bulletList')}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          className="h-8 w-8 p-0"
          title="Liste à puces"
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('orderedList')}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          className="h-8 w-8 p-0"
          title="Liste numérotée"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('taskList')}
          onPressedChange={() => editor.chain().focus().toggleTaskList().run()}
          className="h-8 w-8 p-0"
          title="Liste de tâches"
        >
          <ListTodo className="h-4 w-4" />
        </Toggle>
      </div>

      {/* Autres éléments - masqués sur très petits écrans */}
      <div className="hidden sm:flex items-center gap-1 ml-1 flex-shrink-0">
        <div className="w-px h-6 bg-border mx-1" />
        <Toggle
          size="sm"
          pressed={editor.isActive('blockquote')}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
          className="h-8 w-8 p-0"
          title="Citation"
        >
          <Quote className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('codeBlock')}
          onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
          className="h-8 w-8 p-0"
          title="Bloc de code"
        >
          <Code className="h-4 w-4" />
        </Toggle>
      </div>
    </div>
  )
}
