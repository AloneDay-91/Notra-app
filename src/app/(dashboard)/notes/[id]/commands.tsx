import { Editor, Extension, Range } from '@tiptap/core'
import { ReactRenderer } from '@tiptap/react'
import { Suggestion, SuggestionProps } from '@tiptap/suggestion'
import tippy, { Instance } from 'tippy.js'
import {
  Heading1, Heading2, Heading3, List, ListOrdered, TextQuote, Code, CheckSquare
} from 'lucide-react'

import CommandsList from './CommandsList'

interface CommandItem {
  title: string;
  icon: React.ElementType;
  command: ({ editor, range }: { editor: Editor, range: Range }) => void;
}

const commandItems: CommandItem[] = [
  { title: 'Heading 1', icon: Heading1, command: ({ editor, range }) => { editor.chain().focus().deleteRange(range).toggleHeading({ level: 1 }).run() } },
  { title: 'Heading 2', icon: Heading2, command: ({ editor, range }) => { editor.chain().focus().deleteRange(range).toggleHeading({ level: 2 }).run() } },
  { title: 'Heading 3', icon: Heading3, command: ({ editor, range }) => { editor.chain().focus().deleteRange(range).toggleHeading({ level: 3 }).run() } },
  { title: 'Bullet List', icon: List, command: ({ editor, range }) => { editor.chain().focus().deleteRange(range).toggleBulletList().run() } },
  { title: 'Numbered List', icon: ListOrdered, command: ({ editor, range }) => { editor.chain().focus().deleteRange(range).toggleOrderedList().run() } },
  { title: 'Task List', icon: CheckSquare, command: ({ editor, range }) => { editor.chain().focus().deleteRange(range).toggleTaskList().run() } },
  { title: 'Blockquote', icon: TextQuote, command: ({ editor, range }) => { editor.chain().focus().deleteRange(range).toggleBlockquote().run() } },
  { title: 'Code Block', icon: Code, command: ({ editor, range }) => { editor.chain().focus().deleteRange(range).toggleCodeBlock().run() } },
]

const Commands = Extension.create({
  name: 'slash-command',

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '/',
        command: ({ editor, range, props }: { editor: Editor, range: Range, props: CommandItem }) => {
          props.command({ editor, range });
        },
        items: ({ query }: { query: string }) => {
          return commandItems.filter(item => item.title.toLowerCase().startsWith(query.toLowerCase())).slice(0, 10)
        },
        render: () => {
          let component: ReactRenderer
          let popup: Instance

          return {
            onStart: (props: SuggestionProps) => {
              component = new ReactRenderer(CommandsList, {
                props,
                editor: props.editor,
              })

              const getReferenceClientRect = () => {
                if (props.clientRect) {
                  const rect = props.clientRect()
                  return rect || {
                    width: 0,
                    height: 0,
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    x: 0,
                    y: 0,
                    toJSON: () => ({})
                  } as DOMRect
                }
                return {
                  width: 0,
                  height: 0,
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  x: 0,
                  y: 0,
                  toJSON: () => ({})
                } as DOMRect
              }

              popup = tippy(document.body, {
                getReferenceClientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              })
            },
            onUpdate(props: SuggestionProps) {
              component.updateProps(props)

              const getReferenceClientRect = () => {
                if (props.clientRect) {
                  const rect = props.clientRect()
                  return rect || {
                    width: 0,
                    height: 0,
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    x: 0,
                    y: 0,
                    toJSON: () => ({})
                  } as DOMRect
                }
                return {
                  width: 0,
                  height: 0,
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  x: 0,
                  y: 0,
                  toJSON: () => ({})
                } as DOMRect
              }

              popup.setProps({ getReferenceClientRect })
            },
            onKeyDown(props: { event: KeyboardEvent }) {
              if (props.event.key === 'Escape') {
                popup.hide()
                return true
              }
              return (component.ref as { onKeyDown?: (props: { event: KeyboardEvent }) => boolean })?.onKeyDown?.(props) ?? false
            },
            onExit() {
              popup.destroy()
              component.destroy()
            },
          }
        },
      }),
    ]
  },
})

export default Commands
