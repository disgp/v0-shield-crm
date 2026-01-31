import { AppLayout } from '@/components/app-layout'
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Phone, Plus } from 'lucide-react'
import Link from 'next/link'

// Mock data
const contacts = [
  {
    id: '1',
    name: 'Sarah Johnson',
    address: {
      street: '123 Main Street',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
    },
    phone: '(512) 555-0123',
    propertyType: 'Residential',
  },
  {
    id: '2',
    name: 'Michael Chen',
    address: {
      street: '456 Oak Avenue',
      city: 'Houston',
      state: 'TX',
      zip: '77002',
    },
    phone: '(713) 555-0456',
    propertyType: 'Commercial',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    address: {
      street: '789 Pine Road',
      city: 'Dallas',
      state: 'TX',
      zip: '75201',
    },
    phone: '(214) 555-0789',
    propertyType: 'Residential',
  },
  {
    id: '4',
    name: 'David Thompson',
    address: {
      street: '321 Elm Boulevard',
      city: 'San Antonio',
      state: 'TX',
      zip: '78205',
    },
    phone: '(210) 555-0321',
    propertyType: 'Commercial',
  },
]

export default function ContactsPage() {
  return (
    <AppLayout>
      <AppHeader
        title="Contacts"
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        }
      />
      <div className="p-6">
        <Card className="overflow-hidden">
          <div className="divide-y divide-border">
            {contacts.map((contact) => (
              <Link
                key={contact.id}
                href={`/contacts/${contact.id}`}
                className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50"
              >
                <Checkbox />
                <div className="flex-1">
                  <div className="mb-1 font-semibold text-foreground">{contact.name}</div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      {contact.address.street}, {contact.address.city}, {contact.address.state}{' '}
                      {contact.address.zip}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {contact.propertyType}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{contact.phone}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
