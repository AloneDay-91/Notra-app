"use client"

import { useState } from "react"
import { NotionSidebar } from "@/components/NotionSidebar"

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Note {
  id: string;
  title: string;
}

interface Course {
  id: string;
  name: string;
  notes: Note[];
}

interface Classe {
  id: string;
  name: string;
  courses: Course[];
}

interface DashboardLayoutClientProps {
  user: User
  navigationData: Classe[]
  children: React.ReactNode
}

export default function DashboardLayoutClient({
  user,
  navigationData,
  children
}: DashboardLayoutClientProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <NotionSidebar
        user={user}
        navigationData={navigationData}
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  )
}
