"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Home,
  FileText,
  FolderOpen,
  Book,
  ChevronRight,
  ChevronLeft,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CommandPalette } from "@/components/CommandPalette"
import { QuickActionAdvanced } from "@/components/ui/quick-action-advanced"
import { Tree, TreeItem } from "@/components/ui/tree"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

interface Note {
  id: string
  title: string
}

interface Course {
  id: string
  name: string
  notes: Note[]
  className?: string
  classeId?: string
}

interface Classe {
  id: string
  name: string
  courses: Course[]
}

interface NotionSidebarProps {
  user: User
  navigationData: Classe[]
  isCollapsed?: boolean
  onToggle?: () => void
  onMobileClose?: () => void
  className?: string
}

export function NotionSidebar({
  user,
  navigationData,
  isCollapsed = false,
  onToggle,
  onMobileClose,
  className
}: NotionSidebarProps) {
  const router = useRouter()
  const [editDialog, setEditDialog] = useState<{ isOpen: boolean; item: TreeItem | null }>({
    isOpen: false,
    item: null
  })
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; item: TreeItem | null }>({
    isOpen: false,
    item: null
  })
  const [newName, setNewName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Transformer les données en format TreeItem
  const treeData: TreeItem[] = [
    {
      id: "dashboard",
      name: "Tableau de bord",
      icon: <Home className="h-4 w-4" />,
      href: "/dashboard",
      type: "dashboard"
    },
    {
      id: "settings",
      name: "Paramètres",
      icon: <Settings className="h-4 w-4" />,
      href: "/settings",
      type: "settings"
    },
    ...navigationData.map((classe) => ({
      id: classe.id,
      name: classe.name,
      icon: <FolderOpen className="h-4 w-4" />,
      type: "classe" as const,
      children: classe.courses.map((cours: Course) => ({
        id: cours.id,
        name: cours.name,
        icon: <Book className="h-4 w-4" />,
        type: "cours" as const,
        children: cours.notes.map((note: Note) => ({
          id: note.id,
          name: note.title,
          icon: <FileText className="h-4 w-4" />,
          href: `/notes/${note.id}`,
          type: "note" as const
        }))
      }))
    }))
  ]

  const handleTreeSelect = (item: TreeItem) => {
    if (item.href) {
      router.push(item.href)
      // Fermer la sidebar mobile après navigation
      if (onMobileClose) {
        onMobileClose()
      }
    }
  }

  const handleRefresh = () => {
    router.refresh()
  }

  const handleDelete = async (item: TreeItem) => {
    setDeleteDialog({ isOpen: true, item })
  }

  const confirmDelete = async () => {
    const item = deleteDialog.item
    if (!item) return

    setIsLoading(true)
    try {
      let endpoint = ""
      let successMessage = ""

      switch (item.type) {
        case "classe":
          endpoint = `/api/classes/${item.id}`
          successMessage = "Classe supprimée avec succès"
          break
        case "cours":
          endpoint = `/api/cours/${item.id}`
          successMessage = "Cours supprimé avec succès"
          break
        case "note":
          endpoint = `/api/notes/${item.id}`
          successMessage = "Note supprimée avec succès"
          break
        default:
          toast.error("Type d'élément non supporté")
          return
      }

      const response = await fetch(endpoint, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success(successMessage)
        setDeleteDialog({ isOpen: false, item: null })
        router.refresh()

        // Rediriger vers le dashboard si on était sur l'élément supprimé
        if (window.location.pathname.includes(item.id)) {
          router.push("/dashboard")
        }
      } else {
        const error = await response.text()
        toast.error(`Erreur lors de la suppression: ${error}`)
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error("Erreur lors de la suppression")
    }
    setIsLoading(false)
  }

  const handleEdit = (item: TreeItem) => {
    setNewName(item.name)
    setEditDialog({ isOpen: true, item })
  }

  const handleSaveEdit = async () => {
    if (!editDialog.item || !newName.trim()) {
      toast.error("Le nom ne peut pas être vide")
      return
    }

    setIsLoading(true)
    try {
      let endpoint = ""
      let successMessage = ""

      switch (editDialog.item.type) {
        case "classe":
          endpoint = `/api/classes/${editDialog.item.id}`
          successMessage = "Classe renommée avec succès"
          break
        case "cours":
          endpoint = `/api/cours/${editDialog.item.id}`
          successMessage = "Cours renommé avec succès"
          break
        case "note":
          endpoint = `/api/notes/${editDialog.item.id}`
          successMessage = "Note renommée avec succès"
          break
        default:
          toast.error("Type d'élément non supporté")
          return
      }

      const updateData = editDialog.item.type === "note"
        ? { title: newName.trim() }
        : { name: newName.trim() }

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        toast.success(successMessage)
        setEditDialog({ isOpen: false, item: null })
        setNewName("")
        router.refresh()
      } else {
        const error = await response.text()
        toast.error(`Erreur lors de la modification: ${error}`)
      }
    } catch (error) {
      console.error('Error updating item:', error)
      toast.error("Erreur lors de la modification")
    }
    setIsLoading(false)
  }

  if (isCollapsed) {
    return (
      <div className={cn(
        "flex flex-col h-full w-16 bg-background border-r border-border",
        className
      )}>
        <div className="p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="w-full h-10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "flex flex-col h-full w-64 bg-background border-r border-border",
      className
    )}>
      {/* Logo Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center">
          {/* Logo pour le mode clair */}
          <Image
            className="dark:hidden"
            src="/Logo white.png"
            width={120}
            height={40}
            alt="Logo Notra"
            priority
          />
          {/* Logo pour le mode sombre */}
          <Image
            className="hidden dark:block"
            src="/Logo dark.png"
            width={120}
            height={40}
            alt="Logo Notra"
            priority
          />
        </div>
        {/* Bouton de fermeture pour mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileClose}
          className="lg:hidden h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <span className="text-sm font-medium text-muted-foreground">Actions rapides</span>
        <QuickActionAdvanced
          navigationData={navigationData}
          onRefresh={handleRefresh}
        />
      </div>

      {/* Command Palette Search */}
      <div className="p-2">
        <CommandPalette
          navigationData={navigationData.map(classe => ({
            ...classe,
            courses: classe.courses.map(course => ({
              ...course,
              className: classe.name,
              classeId: classe.id
            }))
          }))}
          user={{ ...user, id: user.name || user.email || "unknown" }}
          onRefresh={handleRefresh}
        />
      </div>

      {/* Navigation Tree */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        <div className="space-y-1">
          <Tree
            data={treeData}
            onSelect={handleTreeSelect}
            onDelete={handleDelete}
            onEdit={handleEdit}
            className="w-full"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full justify-start h-8 text-xs text-muted-foreground lg:flex hidden"
        >
          <ChevronLeft className="mr-2 h-3 w-3" />
          Réduire
        </Button>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialog.isOpen} onOpenChange={(open) => !open && setEditDialog({ isOpen: false, item: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renommer {editDialog.item?.type}</DialogTitle>
            <DialogDescription>
              Entrez un nouveau nom pour cette {editDialog.item?.type}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="item-name">Nouveau nom</Label>
              <Input
                id="item-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Entrez le nouveau nom"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveEdit()
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setEditDialog({ isOpen: false, item: null })}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={isLoading}
              >
                {isLoading ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => !open && setDeleteDialog({ isOpen: false, item: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer {deleteDialog.item?.type}</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer &quot;{deleteDialog.item?.name}&quot; ?{" "}
              {deleteDialog.item?.type === 'classe' && "Tous les cours et notes associés seront également supprimés."}
              {deleteDialog.item?.type === 'cours' && "Toutes les notes associées seront également supprimées."}
              {deleteDialog.item?.type === 'note' && "Cette action est irréversible."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ isOpen: false, item: null })}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isLoading}
            >
              {isLoading ? "Suppression..." : "Supprimer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
