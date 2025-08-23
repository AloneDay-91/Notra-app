"use client"

import * as React from "react"
import { ChevronRight, ChevronDown, Trash2, Edit } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"

export interface TreeItem {
  id: string
  name: string
  icon?: React.ReactNode
  children?: TreeItem[]
  href?: string
  type?: 'folder' | 'file' | 'classe' | 'cours' | 'note' | 'dashboard' | 'settings'
}

interface TreeProps {
  data: TreeItem[]
  onSelect?: (item: TreeItem) => void
  onDelete?: (item: TreeItem) => void
  onEdit?: (item: TreeItem) => void
  className?: string
}

interface TreeNodeProps {
  item: TreeItem
  level?: number
  onSelect?: (item: TreeItem) => void
  onDelete?: (item: TreeItem) => void
  onEdit?: (item: TreeItem) => void
}

const TreeNode = React.forwardRef<HTMLDivElement, TreeNodeProps>(
  ({ item, level = 0, onSelect, onDelete, onEdit }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [isHovered, setIsHovered] = React.useState(false)
    const hasChildren = item.children && item.children.length > 0

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (hasChildren) {
        setIsOpen(!isOpen)
      }
      onSelect?.(item)
    }

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation()
      onDelete?.(item)
    }

    const handleEdit = (e: React.MouseEvent) => {
      e.stopPropagation()
      onEdit?.(item)
    }

    const nodeContent = (
      <div
        className={cn(
          "flex items-center gap-2 py-1.5 px-3 cursor-pointer hover:bg-accent/70 transition-all duration-200 group",
          "text-sm relative",
          isOpen && hasChildren && "bg-accent/30",
          // Styles pour les autres types
          item.type === 'classe' && "font-semibold text-foreground",
          item.type === 'cours' && "font-medium text-foreground/90",
          item.type === 'dashboard' && "font-medium",
          item.type === 'settings' && "font-medium border-b border-border mb-2 pb-3"
        )}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {hasChildren ? (
          <div className="flex items-center justify-center w-4 h-4">
            {isOpen ? (
              <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform" />
            ) : (
              <ChevronRight className="h-3 w-3 text-muted-foreground transition-transform" />
            )}
          </div>
        ) : (
          <div className="w-4 h-4" />
        )}

        {item.icon && (
          <span className={cn(
            "flex items-center justify-center w-4 h-4",
            item.type === 'note' ? "text-yellow-400 dark:text-yellow-300" : "text-muted-foreground"
          )}>
            {item.icon}
          </span>
        )}

        <span className={cn(
          "truncate flex-1",
          item.type === 'note' && "font-normal text-foreground/95",
          item.type === 'classe' && "font-semibold",
          item.type === 'cours' && "font-medium",
          item.type === 'dashboard' && "font-medium",
          item.type === 'settings' && "font-medium",
        )}>
          {item.name}
        </span>

        {/* Indicateur visuel pour les notes */}
        {item.type === 'note' && (
          <div className="w-2 h-2 rounded-full bg-yellow-400 dark:bg-yellow-400 opacity-600 transition-opacity" />
        )}

        {/* Action buttons - simpler and more discrete */}
        {isHovered && item.type !== 'dashboard' && item.type !== 'settings' && (onEdit || onDelete) && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 hover:bg-accent-foreground/10"
                onClick={handleEdit}
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    )

    return (
      <div ref={ref} className="select-none">
        {item.type === 'dashboard' ? (
          nodeContent
        ) : (
          <ContextMenu>
            <ContextMenuTrigger asChild>
              {nodeContent}
            </ContextMenuTrigger>
            <ContextMenuContent className="w-48">
              {onEdit && (
                <ContextMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Renommer
                </ContextMenuItem>
              )}
              {onDelete && (
                <>
                  <ContextMenuSeparator />
                  <ContextMenuItem
                    onClick={handleDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </ContextMenuItem>
                </>
              )}
            </ContextMenuContent>
          </ContextMenu>
        )}

        {hasChildren && isOpen && (
          <div className="mt-1">
            {item.children?.map((child) => (
              <TreeNode
                key={child.id}
                item={child}
                level={level + 1}
                onSelect={onSelect}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}
      </div>
    )
  }
)
TreeNode.displayName = "TreeNode"

export const Tree = React.forwardRef<HTMLDivElement, TreeProps>(
  ({ data, onSelect, onDelete, onEdit, className }, ref) => {
    return (
      <div ref={ref} className={cn("w-full space-y-1", className)}>
        {data.map((item) => (
          <TreeNode
            key={item.id}
            item={item}
            onSelect={onSelect}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    )
  }
)
Tree.displayName = "Tree"
