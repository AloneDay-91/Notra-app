"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const Toolbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-1", className)}
    {...props}
  />
))
Toolbar.displayName = "Toolbar"

const ToolbarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <>
    <div
      ref={ref}
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      {children}
    </div>
    <Separator orientation="vertical" className="h-6" />
  </>
))
ToolbarGroup.displayName = "ToolbarGroup"

export { Toolbar, ToolbarGroup }
