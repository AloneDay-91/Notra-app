"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ placeholder = "Rechercher...", onSearch, className }, ref) => {
    const [query, setQuery] = React.useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setQuery(value)
      onSearch?.(value)
    }

    return (
      <div className={cn("relative", className)}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          className="pl-9 h-8 text-sm"
        />
      </div>
    )
  }
)
SearchBar.displayName = "SearchBar"
