'use client'

import { ReactNode, useState } from 'react'
import { AppSidebar, SidebarContent } from './app-sidebar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      {/* Mobile Menu Button */}
      <div className="fixed left-4 top-4 z-50 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-background">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      <main className="w-full flex-1 lg:ml-64">
        {children}
      </main>
    </div>
  )
}
