"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, FileText, Folder, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface Classe {
  id: string
  name: string
  courses: Course[]
}

interface Course {
  id: string
  name: string
}

interface QuickActionAdvancedProps {
  navigationData: Classe[]
  onRefresh?: () => void
}

export const QuickActionAdvanced = React.forwardRef<HTMLButtonElement, QuickActionAdvancedProps>(
  ({ navigationData, onRefresh }, ref) => {
    const router = useRouter()
    const [isCreateClassOpen, setIsCreateClassOpen] = useState(false)
    const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false)
    const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false)
    const [className_, setClassName_] = useState("")
    const [courseName, setCourseName] = useState("")
    const [noteTitle, setNoteTitle] = useState("")
    const [selectedClassId, setSelectedClassId] = useState("")
    const [selectedCourseId, setSelectedCourseId] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleCreateClass = async () => {
      if (!className_.trim()) {
        toast.error("Veuillez entrer un nom de classe")
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch('/api/classes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: className_.trim(),
          }),
        })

        if (response.ok) {
          toast.success("Classe créée avec succès")
          setClassName_("")
          setIsCreateClassOpen(false)
          onRefresh?.()
          router.refresh()
        } else {
          toast.error("Erreur lors de la création de la classe")
        }
      } catch (error) {
        console.error('Error creating class:', error)
        toast.error("Erreur lors de la création de la classe")
      }
      setIsLoading(false)
    }

    const handleCreateCourse = async () => {
      if (!courseName.trim() || !selectedClassId) {
        toast.error("Veuillez remplir tous les champs")
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch('/api/cours', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: courseName.trim(),
            classeId: selectedClassId,
          }),
        })

        if (response.ok) {
          toast.success("Cours créé avec succès")
          setCourseName("")
          setSelectedClassId("")
          setIsCreateCourseOpen(false)
          onRefresh?.()
          router.refresh()
        } else {
          toast.error("Erreur lors de la création du cours")
        }
      } catch (error) {
        console.error('Error creating course:', error)
        toast.error("Erreur lors de la création du cours")
      }
      setIsLoading(false)
    }

    const handleCreateNote = async () => {
      if (!noteTitle.trim() || !selectedCourseId) {
        toast.error("Veuillez remplir tous les champs")
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: noteTitle.trim(),
            coursId: selectedCourseId,
          }),
        })

        if (response.ok) {
          const note = await response.json()
          toast.success("Note créée avec succès")
          setNoteTitle("")
          setSelectedCourseId("")
          setIsCreateNoteOpen(false)
          router.push(`/notes/${note.id}`)
          onRefresh?.()
        } else {
          toast.error("Erreur lors de la création de la note")
        }
      } catch (error) {
        console.error('Error creating note:', error)
        toast.error("Erreur lors de la création de la note")
      }
      setIsLoading(false)
    }

    // Obtenir tous les cours pour la sélection de note
    const allCourses = navigationData.flatMap(classe =>
      classe.courses.map(course => ({
        ...course,
        className: classe.name,
        classeId: classe.id
      }))
    )

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
          <Dialog open={isCreateNoteOpen} onOpenChange={setIsCreateNoteOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <FileText className="mr-2 h-4 w-4" />
                Nouvelle note
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer une nouvelle note</DialogTitle>
                <DialogDescription>
                  Choisissez un cours et donnez un titre à votre note
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="course-select">Cours</Label>
                  <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un cours" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCourses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.className} • {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="note-title">Titre de la note</Label>
                  <Input
                    id="note-title"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Entrez le titre de la note"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateNoteOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleCreateNote}
                    disabled={isLoading}
                  >
                    {isLoading ? "Création..." : "Créer"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <DropdownMenuSeparator />

          <Dialog open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <BookOpen className="mr-2 h-4 w-4" />
                Nouveau cours
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un nouveau cours</DialogTitle>
                <DialogDescription>
                  Choisissez une classe et donnez un nom à votre cours
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="class-select">Classe</Label>
                  <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une classe" />
                    </SelectTrigger>
                    <SelectContent>
                      {navigationData.map((classe) => (
                        <SelectItem key={classe.id} value={classe.id}>
                          {classe.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="course-name">Nom du cours</Label>
                  <Input
                    id="course-name"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="Entrez le nom du cours"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateCourseOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleCreateCourse}
                    disabled={isLoading}
                  >
                    {isLoading ? "Création..." : "Créer"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateClassOpen} onOpenChange={setIsCreateClassOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Folder className="mr-2 h-4 w-4" />
                Nouvelle classe
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer une nouvelle classe</DialogTitle>
                <DialogDescription>
                  Donnez un nom à votre nouvelle classe
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="class-name">Nom de la classe</Label>
                  <Input
                    id="class-name"
                    value={className_}
                    onChange={(e) => setClassName_(e.target.value)}
                    placeholder="Entrez le nom de la classe"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateClassOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleCreateClass}
                    disabled={isLoading}
                  >
                    {isLoading ? "Création..." : "Créer"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)
QuickActionAdvanced.displayName = "QuickActionAdvanced"
