import { Button } from '@/components/ui/button'
import { ReactNode } from 'react'

interface AppHeaderProps {
  title: string
  action?: ReactNode
}

export function AppHeader({ title, action }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      {action && <div>{action}</div>}
    </header>
  )
}
