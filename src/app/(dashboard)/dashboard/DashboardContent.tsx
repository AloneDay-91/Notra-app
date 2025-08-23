"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import Link from "next/link"
import NewClasseForm from "./NewClasseForm"

interface DashboardContentProps {
  user: {
    name?: string | null
    email?: string | null
  }
  recentNotes: Array<{
    id: string
    title: string
    cours: {
      name: string
      classe: {
        name: string
      }
    }
  }>
}

export default function DashboardContent({ user, recentNotes }: DashboardContentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">
          Bienvenue, {user.name?.split(" ")[0] || "utilisateur"}
        </h1>
        <p className="text-muted-foreground">
          Organisez vos cours et prenez des notes facilement
        </p>
      </div>

      {/* Quick Action Button */}
      <div className="text-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              Créer une nouvelle classe
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle classe</DialogTitle>
              <DialogDescription>
                Ajoutez une nouvelle classe pour organiser vos cours
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <NewClasseForm onSuccess={() => setIsDialogOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Recent Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes récentes</CardTitle>
          <CardDescription>Vos dernières modifications</CardDescription>
        </CardHeader>
        <CardContent>
          {recentNotes.length > 0 ? (
            <div className="space-y-2">
              {recentNotes.map((note) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className="block p-3 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-sm truncate">{note.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {note.cours.classe.name} • {note.cours.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune note pour le moment</p>
              <p className="text-xs mt-1">
                Créez votre première classe pour commencer
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
