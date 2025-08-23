"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Home,
  FileText,
  BookOpen,
  Folder,
  Plus,
  Settings,
  Search
} from "lucide-react"
import { toast } from "sonner"

interface Note {
  id: string
  title: string
  courseName: string
  className: string
  classeId: string
  coursId: string
}

interface Course {
  id: string
  name: string
  className: string
  classeId: string
  notes: { id: string; title: string }[]
}

interface Classe {
  id: string
  name: string
  courses: Course[]
}

interface User {
  id: string
  name?: string | null
  email?: string | null
}

interface CommandPaletteProps {
  navigationData: Classe[]
  user: User
  onRefresh?: () => void
}

export function CommandPalette({ navigationData, onRefresh }: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Créer la liste de toutes les notes pour la recherche
  const allNotes: Note[] = navigationData.flatMap(classe =>
    classe.courses.flatMap((course: Course) =>
      course.notes.map((note) => ({
        ...note,
        courseName: course.name,
        className: classe.name,
        classeId: classe.id,
        coursId: course.id,
      }))
    )
  )

  // Créer la liste de tous les cours
  const allCourses: Course[] = navigationData.flatMap(classe =>
    classe.courses.map((course) => ({
      ...course,
      className: classe.name,
      classeId: classe.id,
    }))
  )

  const handleCreateClass = async (name: string) => {
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })

      if (response.ok) {
        toast.success("Classe créée avec succès")
        onRefresh?.()
        router.refresh()
        setOpen(false)
      } else {
        toast.error("Erreur lors de la création de la classe")
      }
    } catch {
      toast.error("Erreur lors de la création de la classe")
    }
  }

  const handleCreateCourse = async (name: string, classeId: string) => {
    try {
      const response = await fetch('/api/cours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, classeId }),
      })

      if (response.ok) {
        toast.success("Cours créé avec succès")
        onRefresh?.()
        router.refresh()
        setOpen(false)
      } else {
        toast.error("Erreur lors de la création du cours")
      }
    } catch {
      toast.error("Erreur lors de la création du cours")
    }
  }

  const handleCreateNote = async (title: string, coursId: string) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, coursId }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success("Note créée avec succès")
        router.push(`/notes/${data.id}`)
        setOpen(false)
      } else {
        toast.error("Erreur lors de la création de la note")
      }
    } catch {
      toast.error("Erreur lors de la création de la note")
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative w-full justify-start text-muted-foreground"
      >
        <Search className="h-4 w-4" />
        <span>Rechercher...</span>
        <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Tapez une commande ou recherchez..." />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>

          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => { router.push('/dashboard'); setOpen(false) }}>
              <Home className="mr-2 h-4 w-4" />
              <span>Tableau de bord</span>
            </CommandItem>
            <CommandItem onSelect={() => { router.push('/settings'); setOpen(false) }}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </CommandItem>
          </CommandGroup>

          {navigationData.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Classes">
                {navigationData.map((classe) => (
                  <CommandItem
                    key={classe.id}
                    onSelect={() => { router.push(`/classes/${classe.id}`); setOpen(false) }}
                  >
                    <Folder className="mr-2 h-4 w-4" />
                    <span>{classe.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {allCourses.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Cours">
                {allCourses.map((cours) => (
                  <CommandItem
                    key={cours.id}
                    onSelect={() => { router.push(`/cours/${cours.id}`); setOpen(false) }}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>{cours.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {cours.className}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {allNotes.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Notes">
                {allNotes.map((note) => (
                  <CommandItem
                    key={note.id}
                    onSelect={() => { router.push(`/notes/${note.id}`); setOpen(false) }}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    <span>{note.title}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {note.className} • {note.courseName}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          <CommandSeparator />
          <CommandGroup heading="Actions rapides">
            <CommandItem onSelect={() => handleCreateClass("Nouvelle classe")}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Créer une nouvelle classe</span>
            </CommandItem>
            {navigationData.length > 0 && (
              <CommandItem onSelect={() => handleCreateCourse("Nouveau cours", navigationData[0].id)}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Créer un nouveau cours</span>
              </CommandItem>
            )}
            {allCourses.length > 0 && (
              <CommandItem onSelect={() => handleCreateNote("Nouvelle note", allCourses[0].id)}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Créer une nouvelle note</span>
              </CommandItem>
            )}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
