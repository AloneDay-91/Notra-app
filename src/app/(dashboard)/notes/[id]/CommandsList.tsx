import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Editor, Range } from '@tiptap/core'

interface CommandItem {
  title: string;
  icon: React.ElementType;
  command: (props: { editor: Editor, range: Range }) => void;
}

interface CommandsListProps {
  items: CommandItem[];
  command: (item: CommandItem) => void;
}

const CommandsList = forwardRef<{ onKeyDown: (props: { event: React.KeyboardEvent }) => boolean }, CommandsListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = props.items[index]
    if (item) {
      props.command(item)
    }
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: React.KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
        return true
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % props.items.length)
        return true
      }
      if (event.key === 'Enter') {
        selectItem(selectedIndex)
        return true
      }
      return false
    },
  }))

  return (
    <div className="z-50 max-h-80 w-72 overflow-y-auto rounded-md bg-background p-1 shadow-md">
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            key={index}
            className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm ${index === selectedIndex ? 'bg-accent text-accent-foreground' : 'text-foreground'}`}
            onClick={() => selectItem(index)}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </button>
        ))
      ) : (
        <div className="text-sm text-muted-foreground p-2">No results</div>
      )}
    </div>
  )
})

CommandsList.displayName = 'CommandsList'

export default CommandsList
