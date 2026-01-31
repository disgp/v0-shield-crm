import { Button } from '@/components/ui/button'
import { ReactNode } from 'react'

interface AppHeaderProps {
  title: string
  action?: ReactNode
}

export function AppHeader({ title, action }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background px-4 sm:h-16 sm:px-6 lg:pl-6">
      <h1 className="truncate text-xl font-bold text-foreground sm:text-2xl lg:ml-0 ml-12">{title}</h1>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}
