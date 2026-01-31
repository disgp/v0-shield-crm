import { AppLayout } from '@/components/app-layout'
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, Video, Link as LinkIcon, Download } from 'lucide-react'

const resources = [
  {
    id: '1',
    title: 'Insurance Claim Process Guide',
    type: 'PDF',
    category: 'Documentation',
    size: '2.4 MB',
    icon: FileText,
  },
  {
    id: '2',
    title: 'Roofing Materials Comparison',
    type: 'PDF',
    category: 'Sales Materials',
    size: '1.8 MB',
    icon: FileText,
  },
  {
    id: '3',
    title: 'Safety Training Video',
    type: 'Video',
    category: 'Training',
    size: '45 MB',
    icon: Video,
  },
  {
    id: '4',
    title: 'Warranty Information Sheet',
    type: 'PDF',
    category: 'Documentation',
    size: '856 KB',
    icon: FileText,
  },
  {
    id: '5',
    title: 'Brand Guidelines',
    type: 'PDF',
    category: 'Marketing',
    size: '3.2 MB',
    icon: FileText,
  },
]

const links = [
  {
    id: '1',
    title: 'Weather Tracking Dashboard',
    url: 'weather.example.com',
    category: 'Tools',
  },
  {
    id: '2',
    title: 'Material Supplier Portal',
    url: 'supplier.example.com',
    category: 'Vendors',
  },
  {
    id: '3',
    title: 'Industry News & Updates',
    url: 'industry.example.com',
    category: 'News',
  },
]

export default function ResourcesPage() {
  return (
    <AppLayout>
      <AppHeader
        title="Resources"
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Upload Resource
          </Button>
        }
      />
      <div className="p-6">
        <div className="space-y-6">
          {/* Documents & Files */}
          <Card>
            <CardHeader>
              <CardTitle>Documents & Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <resource.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 font-semibold text-foreground">{resource.title}</div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                          {resource.category}
                        </Badge>
                        <span>•</span>
                        <span>{resource.size}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0">
                      <Download className="h-4 w-4" />
                      <span className="ml-2 hidden sm:inline">Download</span>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {links.map((link) => (
                  <a
                    key={link.id}
                    href={`https://${link.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 py-4 transition-colors hover:text-accent first:pt-0 last:pb-0"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <LinkIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 font-semibold text-foreground">{link.title}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                          {link.category}
                        </Badge>
                        <span>•</span>
                        <span className="truncate">{link.url}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
