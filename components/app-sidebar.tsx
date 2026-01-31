'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Users,
  Briefcase,
  Home as HomeIcon,
  FileText,
  Receipt,
  LayoutDashboard,
  UserPlus,
  CheckSquare,
  TrendingUp,
  BookOpen,
  Shield,
} from 'lucide-react'

const navigation = [
  {
    name: 'CRM',
    items: [
      { name: 'Contacts', href: '/contacts', icon: Users },
      { name: 'Jobs', href: '/jobs', icon: Briefcase },
      { name: 'Properties', href: '/properties', icon: HomeIcon },
    ],
  },
  {
    name: 'Finance',
    items: [
      { name: 'Estimates', href: '/estimates', icon: FileText },
      { name: 'Invoices', href: '/invoices', icon: Receipt },
    ],
  },
  {
    name: 'Marketing',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Leads', href: '/leads', icon: UserPlus },
      { name: 'Tasks', href: '/tasks', icon: CheckSquare },
      { name: 'Rankings', href: '/rankings', icon: TrendingUp },
      { name: 'Resources', href: '/resources', icon: BookOpen },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <Shield className="h-8 w-8 text-sidebar-primary" />
          <span className="text-lg font-bold text-sidebar-foreground">ShieldCRM</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
          {navigation.map((group) => (
            <div key={group.name}>
              <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.name}
              </h3>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Footer */}
        <div className="border-t border-sidebar-border p-4">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              JD
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">Settings</p>
            </div>
          </Link>
        </div>
      </div>
    </aside>
  )
}
