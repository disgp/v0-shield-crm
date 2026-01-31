import { ReactNode } from 'react'
import { AppSidebar } from './app-sidebar'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-64 flex-1">
        {children}
      </main>
    </div>
  )
}
