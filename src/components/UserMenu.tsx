"use client"

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Settings, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { getGravatarUrl } from "@/lib/gravatar"

interface UserMenuProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" })
      toast.success("Déconnexion réussie")
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error("Erreur lors de la déconnexion")
    }
  }

  const handleSettings = () => {
    router.push("/settings")
  }

  const avatarUrl = getGravatarUrl(user.email, 32, 'identicon')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} alt={user.name || ""} />
            <AvatarFallback>
              {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && (
              <p className="font-medium">{user.name}</p>
            )}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSettings}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Paramètres</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
