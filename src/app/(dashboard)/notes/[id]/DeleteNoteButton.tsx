"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface DeleteNoteButtonProps {
  noteId: string
  noteTitle: string
}

export default function DeleteNoteButton({ noteId, noteTitle }: DeleteNoteButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success("Note supprimée avec succès")
        setIsOpen(false)
        router.push("/dashboard")
        router.refresh()
      } else {
        const error = await response.text()
        toast.error(`Erreur lors de la suppression: ${error}`)
      }
    } catch (error) {
      console.error('Error deleting note:', error)
      toast.error("Erreur lors de la suppression")
    }
    setIsDeleting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer la note</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer &quot;{noteTitle}&quot; ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
