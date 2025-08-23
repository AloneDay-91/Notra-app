'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Keyboard, X } from "lucide-react"

interface KeyboardShortcutsProps {
  isVisible: boolean
  onClose: () => void
}

export default function KeyboardShortcuts({ isVisible, onClose }: KeyboardShortcutsProps) {
  if (!isVisible) return null

  const shortcuts = [
    { keys: ['Ctrl', 'S'], description: 'Sauvegarder la note' },
    { keys: ['Ctrl', 'P'], description: 'Basculer en mode aperçu' },
    { keys: ['Ctrl', 'Shift', 'Enter'], description: 'Mode plein écran' },
    { keys: ['Ctrl', 'B'], description: 'Texte en gras' },
    { keys: ['Ctrl', 'I'], description: 'Texte en italique' },
    { keys: ['Ctrl', 'U'], description: 'Texte souligné' },
    { keys: ['Ctrl', 'Z'], description: 'Annuler' },
    { keys: ['Ctrl', 'Y'], description: 'Refaire' },
    { keys: ['/'], description: 'Commandes rapides' },
    { keys: ['Ctrl', 'Alt', '1'], description: 'Titre 1' },
    { keys: ['Ctrl', 'Alt', '2'], description: 'Titre 2' },
    { keys: ['Ctrl', 'Alt', '3'], description: 'Titre 3' },
  ]

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-40 shadow-lg border bg-background/95 backdrop-blur animate-in slide-in-from-bottom-2">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm flex items-center gap-2">
          <Keyboard className="h-4 w-4" />
          Raccourcis clavier
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {shortcuts.map((shortcut, index) => (
          <div key={index} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{shortcut.description}</span>
            <div className="flex gap-1">
              {shortcut.keys.map((key, keyIndex) => (
                <Badge key={keyIndex} variant="outline" className="text-xs px-1 py-0">
                  {key}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
