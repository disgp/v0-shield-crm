import { AppLayout } from '@/components/app-layout'
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, MapPin, Calendar } from 'lucide-react'
import Link from 'next/link'

const jobs = [
  {
    id: '1',
    title: 'Roof Replacement',
    customer: 'Sarah Johnson',
    address: '123 Main Street, Austin, TX',
    status: 'In Progress',
    startDate: '2024-02-10',
    statusVariant: 'default' as const,
  },
  {
    id: '2',
    title: 'Storm Damage Repair',
    customer: 'Michael Chen',
    address: '456 Oak Avenue, Houston, TX',
    status: 'Scheduled',
    startDate: '2024-02-15',
    statusVariant: 'secondary' as const,
  },
  {
    id: '3',
    title: 'Commercial Roof Inspection',
    customer: 'Emily Rodriguez',
    address: '789 Pine Road, Dallas, TX',
    status: 'Completed',
    startDate: '2024-01-28',
    statusVariant: 'default' as const,
  },
  {
    id: '4',
    title: 'Gutter Installation',
    customer: 'David Thompson',
    address: '321 Elm Boulevard, San Antonio, TX',
    status: 'Pending',
    startDate: '2024-02-20',
    statusVariant: 'secondary' as const,
  },
  {
    id: '5',
    title: 'Roof Maintenance',
    customer: 'Jennifer Garcia',
    address: '567 Cedar Lane, Fort Worth, TX',
    status: 'In Progress',
    startDate: '2024-02-08',
    statusVariant: 'default' as const,
  },
]

export default function JobsPage() {
  return (
    <AppLayout>
      <AppHeader
        title="Jobs"
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Job
          </Button>
        }
      />
      <div className="p-6">
        <Card className="overflow-hidden">
          <div className="divide-y divide-border">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-semibold text-foreground">{job.title}</span>
                    <Badge variant={job.statusVariant}>{job.status}</Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{job.customer}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{job.address}</span>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">{job.startDate}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
