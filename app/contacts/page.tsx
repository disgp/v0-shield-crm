'use client';

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
      <div className="p-4 sm:p-6">
        <Card className="overflow-hidden">
          {/* Select All Header */}
          <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-3 py-2.5 sm:px-4 sm:py-3">
            <Checkbox id="select-all" />
            <label htmlFor="select-all" className="text-sm font-medium">
              Select All
            </label>
          </div>
          
          {/* Contacts List */}
          <div className="divide-y divide-border">
            {contacts.map((contact) => (
              <Link
                key={contact.id}
                href={`/contacts/${contact.id}`}
                className="flex items-start gap-3 p-3 transition-colors hover:bg-muted/50 sm:items-center sm:gap-4 sm:p-4"
              >
                <Checkbox onClick={(e) => e.preventDefault()} className="mt-0.5 sm:mt-0" />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 font-semibold text-foreground">{contact.name}</div>
                  <div className="flex flex-col gap-1.5 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
                    <span className="break-words">
                      {contact.address.street}, {contact.address.city}, {contact.address.state}{' '}
                      {contact.address.zip}
                    </span>
                    <Badge variant="secondary" className="w-fit text-xs">
                      {contact.propertyType}
                    </Badge>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground sm:hidden">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{contact.phone}</span>
                  </div>
                </div>
                <div className="hidden shrink-0 items-center gap-2 text-sm text-muted-foreground sm:flex">
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
