"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { NotionSidebar } from "@/components/NotionSidebar"
import { UserMenu } from "@/components/UserMenu"
import Image from "next/image";


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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Fermer la sidebar mobile lors du changement de route
  useEffect(() => {
    setIsMobileSidebarOpen(false)
  }, [pathname])

  // Déterminer le style d'overflow selon la page
  const isNotePage = pathname.includes('/notes/')
  const overflowClass = isNotePage ? 'overflow-auto' : 'overflow-auto'

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile by default, shown as overlay when opened */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-0
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <NotionSidebar
          user={user}
          navigationData={navigationData}
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header - Amélioré pour une meilleure visibilité */}
        <div className="lg:hidden flex items-center justify-between p-3 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-30">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Ouvrir le menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

            <div className="flex items-center gap-3">
                <Image
                    className="dark:hidden"
                    src="/Logo white.png"
                    width={80}
                    height={30}
                    alt="Logo Notra"
                />
                <Image
                    className="hidden dark:block"
                    src="/Logo dark.png"
                    width={80}
                    height={30}
                    alt="Logo Notra"
                />
            </div>

          <div className="flex items-center gap-1">
            <UserMenu user={user} />
          </div>
        </div>

        {/* Content Area */}
        <div className={`flex-1 ${overflowClass}`}>
          {children}
        </div>
      </div>
    </div>
  )
}
