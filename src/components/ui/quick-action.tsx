"use client"

import * as React from "react"
import { Plus, FileText, Folder, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface QuickActionProps {
  onNewPage?: () => void
  onNewClass?: () => void
  onNewCourse?: () => void
}

export const QuickAction = React.forwardRef<HTMLButtonElement, QuickActionProps>(
  ({ onNewPage, onNewClass, onNewCourse }, ref) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            ref={ref}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-accent"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem onClick={onNewPage}>
            <FileText className="mr-2 h-4 w-4" />
            Nouvelle note
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onNewCourse}>
            <BookOpen className="mr-2 h-4 w-4" />
            Nouveau cours
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onNewClass}>
            <Folder className="mr-2 h-4 w-4" />
            Nouvelle classe
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)
QuickAction.displayName = "QuickAction"
