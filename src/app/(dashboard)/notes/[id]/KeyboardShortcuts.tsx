import { Extension } from '@tiptap/core'

const KeyboardShortcuts = Extension.create({
  name: 'keyboardShortcuts',

  addKeyboardShortcuts() {
    return {
      // Titres avec priorité élevée
      'Mod-Alt-1': () => {
        return this.editor.chain().focus().toggleHeading({ level: 1 }).run()
      },
      'Mod-Alt-2': () => {
        return this.editor.chain().focus().toggleHeading({ level: 2 }).run()
      },
      'Mod-Alt-3': () => {
        return this.editor.chain().focus().toggleHeading({ level: 3 }).run()
      },
      'Mod-Alt-4': () => {
        return this.editor.chain().focus().toggleHeading({ level: 4 }).run()
      },
      'Mod-Alt-5': () => {
        return this.editor.chain().focus().toggleHeading({ level: 5 }).run()
      },
      'Mod-Alt-6': () => {
        return this.editor.chain().focus().toggleHeading({ level: 6 }).run()
      },

      // Retour au paragraphe
      'Mod-Alt-0': () => {
        return this.editor.chain().focus().setParagraph().run()
      },

      // Listes
      'Mod-Shift-8': () => {
        return this.editor.chain().focus().toggleBulletList().run()
      },
      'Mod-Shift-7': () => {
        return this.editor.chain().focus().toggleOrderedList().run()
      },
      'Mod-Shift-9': () => {
        return this.editor.chain().focus().toggleTaskList().run()
      },

      // Formatage
      'Mod-u': () => {
        return this.editor.chain().focus().toggleUnderline().run()
      },
      'Mod-Shift-h': () => {
        return this.editor.chain().focus().toggleHighlight().run()
      },

      // Blocs
      'Mod-Shift-b': () => {
        return this.editor.chain().focus().toggleBlockquote().run()
      },
      'Mod-Alt-c': () => {
        return this.editor.chain().focus().toggleCodeBlock().run()
      },

      // Alignement
      'Mod-Shift-l': () => {
        return this.editor.chain().focus().setTextAlign('left').run()
      },
      'Mod-Shift-e': () => {
        return this.editor.chain().focus().setTextAlign('center').run()
      },
      'Mod-Shift-r': () => {
        return this.editor.chain().focus().setTextAlign('right').run()
      },
    }
  },
})

export default KeyboardShortcuts
