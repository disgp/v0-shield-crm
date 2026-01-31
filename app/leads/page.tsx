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
    statusColor: 'bg-blue-500',
  },
  {
    id: '2',
    name: 'Linda Martinez',
    status: 'Contacted',
    phone: '(555) 234-5678',
    email: 'linda.m@email.com',
    source: 'Referral',
    statusColor: 'bg-yellow-500',
  },
  {
    id: '3',
    name: 'James Wilson',
    status: 'Qualified',
    phone: '(555) 345-6789',
    email: 'james.w@email.com',
    source: 'Organic Search',
    statusColor: 'bg-green-500',
  },
  {
    id: '4',
    name: 'Patricia Lee',
    status: 'Proposal Sent',
    phone: '(555) 456-7890',
    email: 'patricia.l@email.com',
    source: 'Social Media',
    statusColor: 'bg-purple-500',
  },
  {
    id: '5',
    name: 'Michael Brown',
    status: 'New',
    phone: '(555) 567-8901',
    email: 'michael.b@email.com',
    source: 'Google Ads',
    statusColor: 'bg-blue-500',
  },
]

export default function LeadsPage() {
  return (
    <AppLayout>
      <AppHeader
        title="Leads"
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Lead
          </Button>
        }
      />
      <div className="p-6">
        <Card className="overflow-hidden">
          <div className="divide-y divide-border">
            {leads.map((lead) => (
              <div key={lead.id} className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50">
                <Checkbox />
                <div className="flex h-2 w-2 rounded-full" style={{ backgroundColor: lead.statusColor }} />
                <div className="flex-1">
                  <div className="mb-1 font-semibold text-foreground">{lead.name}</div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{lead.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span>{lead.email}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{lead.status}</Badge>
                  <span className="text-sm text-muted-foreground">{lead.source}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
