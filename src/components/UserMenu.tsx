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
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 hover:bg-accent/50">
          <Avatar className="h-8 w-8 border border-border/20">
            <AvatarImage src={avatarUrl} alt={user.name || ""} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 mr-2"
        align="end"
        forceMount
        sideOffset={8}
      >
        <div className="flex items-center justify-start gap-3 p-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarUrl} alt={user.name || ""} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && (
              <p className="font-medium text-sm">{user.name}</p>
            )}
            {user.email && (
              <p className="w-[160px] truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSettings}
          className="gap-3 py-2.5 cursor-pointer"
        >
          <Settings className="h-4 w-4" />
          <span>Paramètres</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive gap-3 py-2.5 cursor-pointer focus:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
