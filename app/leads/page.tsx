import { AppLayout } from '@/components/app-layout'
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Phone, Mail, Plus } from 'lucide-react'

const leads = [
  {
    id: '1',
    name: 'Robert Anderson',
    status: 'New',
    phone: '(555) 123-4567',
    email: 'robert.a@email.com',
    source: 'Google Ads',
  },
  {
    id: '2',
    name: 'Linda Martinez',
    status: 'Contacted',
    phone: '(555) 234-5678',
    email: 'linda.m@email.com',
    source: 'Referral',
  },
  {
    id: '3',
    name: 'James Wilson',
    status: 'Qualified',
    phone: '(555) 345-6789',
    email: 'james.w@email.com',
    source: 'Organic Search',
  },
  {
    id: '4',
    name: 'Patricia Lee',
    status: 'Converted',
    phone: '(555) 456-7890',
    email: 'patricia.l@email.com',
    source: 'Social Media',
  },
  {
    id: '5',
    name: 'Michael Brown',
    status: 'Unqualified',
    phone: '(555) 567-8901',
    email: 'michael.b@email.com',
    source: 'Google Ads',
  },
  {
    id: '6',
    name: 'Sarah Davis',
    status: 'Lost',
    phone: '(555) 678-9012',
    email: 'sarah.d@email.com',
    source: 'Referral',
  },
]

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'New':
      return 'default'
    case 'Contacted':
      return 'secondary'
    case 'Qualified':
      return 'default'
    case 'Unqualified':
      return 'secondary'
    case 'Converted':
      return 'default'
    case 'Lost':
      return 'destructive'
    default:
      return 'secondary'
  }
}

export default function LeadsPage() {
  return (
    <AppLayout>
      <AppHeader
        title="Leads"
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        }
      />
      <div className="p-6">
        <Card className="overflow-hidden">
          <div className="divide-y divide-border">
            {leads.map((lead) => (
              <div key={lead.id} className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50">
                <Badge variant={getStatusVariant(lead.status)} className="shrink-0">
                  {lead.status}
                </Badge>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 font-semibold text-foreground">{lead.name}</div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span className="truncate">{lead.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{lead.email}</span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 text-sm text-muted-foreground">
                  <span className="hidden sm:inline">{lead.source}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
