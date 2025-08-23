"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Key,
  LogOut,
  Trash2,
  AlertTriangle,
  Save,
  Edit
} from "lucide-react"
import { toast } from "sonner"
import { getGravatarUrl } from "@/lib/gravatar"

interface SettingsContentProps {
  user: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export default function SettingsContent({ user }: SettingsContentProps) {
  const router = useRouter()
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [name, setName] = useState(user.name || "")
  const [email, setEmail] = useState(user.email || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateProfile = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Veuillez remplir tous les champs")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
        }),
      })

      if (response.ok) {
        toast.success("Profil mis à jour avec succès")
        setIsEditingProfile(false)
        router.refresh()
      } else {
        toast.error("Erreur lors de la mise à jour")
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error("Erreur lors de la mise à jour")
    }
    setIsLoading(false)
  }

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" })
      toast.success("Déconnexion réussie")
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error("Erreur lors de la déconnexion")
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Veuillez remplir tous les champs")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas")
      return
    }

    if (newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      if (response.ok) {
        toast.success("Mot de passe modifié avec succès")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setIsChangePasswordOpen(false)
      } else {
        const errorText = await response.text()
        if (response.status === 400 && errorText.includes("incorrect")) {
          toast.error("Mot de passe actuel incorrect")
        } else {
          toast.error("Erreur lors de la modification du mot de passe")
        }
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error("Erreur lors de la modification du mot de passe")
    }
    setIsLoading(false)
  }

  const handleDeleteAccount = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success("Compte supprimé avec succès")
        await signOut({ callbackUrl: "/" })
      } else {
        toast.error("Erreur lors de la suppression du compte")
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error("Erreur lors de la suppression du compte")
    }
    setIsLoading(false)
  }

  const avatarUrl = getGravatarUrl(user.email, 64, 'identicon')

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8 p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Paramètres</h1>
          <p className="text-muted-foreground mt-2">
            Gérez votre compte et vos préférences
          </p>
        </div>

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil utilisateur
            </CardTitle>
            <CardDescription>
              Informations de votre compte personnel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-lg">
                  {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium text-lg">{user.name || "Utilisateur"}</h3>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Avatar fourni par Gravatar
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsEditingProfile(true)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Modifier
              </Button>
            </div>

            {isEditingProfile && (
              <div className="space-y-4 p-4 border rounded-lg bg-accent/5">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre nom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleUpdateProfile}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isLoading ? "Sauvegarde..." : "Sauvegarder"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditingProfile(false)
                      setName(user.name || "")
                      setEmail(user.email || "")
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Sécurité
            </CardTitle>
            <CardDescription>
              Gérez la sécurité de votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Mot de passe</h4>
                <p className="text-sm text-muted-foreground">
                  Modifiez votre mot de passe de connexion
                </p>
              </div>
              <Button variant="outline" onClick={() => setIsChangePasswordOpen(true)}>
                Changer le mot de passe
              </Button>
            </div>

            {isChangePasswordOpen && (
              <div className="space-y-4 p-4 border rounded-lg bg-accent/5">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Mot de passe actuel</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe actuel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Entrez votre nouveau mot de passe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmez votre nouveau mot de passe"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleChangePassword}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isLoading ? "Modification..." : "Modifier le mot de passe"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsChangePasswordOpen(false)
                      setCurrentPassword("")
                      setNewPassword("")
                      setConfirmPassword("")
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions Section */}
        <Card>
          <CardHeader>
            <CardTitle>Actions du compte</CardTitle>
            <CardDescription>
              Actions importantes concernant votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <LogOut className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Se déconnecter</h4>
                  <p className="text-sm text-muted-foreground">
                    Déconnectez-vous de votre session actuelle
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                Se déconnecter
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
              <div className="flex items-center gap-3">
                <Trash2 className="h-5 w-5 text-destructive" />
                <div>
                  <h4 className="font-medium text-destructive">Supprimer le compte</h4>
                  <p className="text-sm text-muted-foreground">
                    Supprimez définitivement votre compte et toutes vos données
                  </p>
                </div>
              </div>
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    Supprimer le compte
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-5 w-5" />
                      Supprimer le compte
                    </DialogTitle>
                    <DialogDescription>
                      Cette action est irréversible. Toutes vos classes, cours et notes seront définitivement supprimés.
                      Êtes-vous absolument sûr de vouloir continuer ?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(false)}
                      disabled={isLoading}
                    >
                      Annuler
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={isLoading}
                    >
                      {isLoading ? "Suppression..." : "Supprimer définitivement"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
