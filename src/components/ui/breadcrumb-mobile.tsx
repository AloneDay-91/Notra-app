"use client"

import Link from "next/link"
import { ChevronRight, Home, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

interface BreadcrumbMobileProps {
  items: BreadcrumbItem[]
  className?: string
}

export function BreadcrumbMobile({ items, className }: BreadcrumbMobileProps) {
  const hiddenItems = items.length > 3 ? items.slice(1, -2) : []

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-1", className)}>
      {/* Version desktop - affiche tous les éléments */}
      <div className="hidden sm:flex items-center space-x-1">
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground mx-1 flex-shrink-0" />
            )}
            {item.href && !item.isActive ? (
              <Link
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors truncate"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  "text-sm truncate",
                  item.isActive ? "text-foreground font-medium" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Version mobile - compacte */}
      <div className="sm:hidden flex items-center space-x-1 w-full">
        {/* Bouton home */}
        {items[0]?.href && (
          <Link href={items[0].href}>
            <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
              <Home className="h-4 w-4" />
            </Button>
          </Link>
        )}

        {items.length > 1 && (
          <>
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />

            {/* Menu dropdown pour les éléments cachés */}
            {hiddenItems.length > 0 && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {hiddenItems.map((item, index) => (
                      <DropdownMenuItem key={index} asChild>
                        {item.href ? (
                          <Link href={item.href} className="w-full">
                            {item.label}
                          </Link>
                        ) : (
                          <span>{item.label}</span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </>
            )}

            {/* Élément avant-dernier (si pas d'éléments cachés) ou dernier visible */}
            {items.length > 2 && hiddenItems.length === 0 && (
              <>
                {items[items.length - 2].href ? (
                  <Link
                    href={items[items.length - 2].href!}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors truncate max-w-[80px]"
                  >
                    {items[items.length - 2].label}
                  </Link>
                ) : (
                  <span className="text-sm text-muted-foreground truncate max-w-[80px]">
                    {items[items.length - 2].label}
                  </span>
                )}
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </>
            )}

            {/* Dernier élément (actuel) */}
            <span className="text-sm text-foreground font-medium truncate flex-1 min-w-0">
              {items[items.length - 1].label}
            </span>
          </>
        )}
      </div>
    </nav>
  )
}
