import * as React from "react"
import { Sidebar } from "./Sidebar"
import { AppHeader } from "./AppHeader"
import { MobileNavigation } from "./MobileNavigation"

export function AppShell({
  children,
  headerTitle,
}: {
  children: React.ReactNode
  headerTitle?: string
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-h-screen flex-col md:pl-64">
        <AppHeader title={headerTitle} />
        <main className="flex-1 pb-20 md:pb-8">
          {children}
        </main>
      </div>
      <MobileNavigation />
    </div>
  )
}
