import { AppLayout } from '@/components/app-layout'
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, MapPin, Home } from 'lucide-react'
import Link from 'next/link'

const properties = [
  {
    id: '1',
    address: '123 Main Street',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    type: 'Residential',
    owner: 'Sarah Johnson',
    sqft: '2,400',
  },
  {
    id: '2',
    address: '456 Oak Avenue',
    city: 'Houston',
    state: 'TX',
    zip: '77002',
    type: 'Commercial',
    owner: 'Michael Chen',
    sqft: '12,500',
  },
  {
    id: '3',
    address: '789 Pine Road',
    city: 'Dallas',
    state: 'TX',
    zip: '75201',
    type: 'Residential',
    owner: 'Emily Rodriguez',
    sqft: '3,100',
  },
  {
    id: '4',
    address: '321 Elm Boulevard',
    city: 'San Antonio',
    state: 'TX',
    zip: '78205',
    type: 'Commercial',
    owner: 'David Thompson',
    sqft: '8,750',
  },
  {
    id: '5',
    address: '567 Cedar Lane',
    city: 'Fort Worth',
    state: 'TX',
    zip: '76102',
    type: 'Residential',
    owner: 'Jennifer Garcia',
    sqft: '2,850',
  },
]

export default function PropertiesPage() {
  return (
    <AppLayout>
      <AppHeader
        title="Properties"
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        }
      />
      <div className="p-6">
        <Card className="overflow-hidden">
          <div className="divide-y divide-border">
            {properties.map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Home className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-semibold text-foreground">{property.address}</span>
                    <Badge variant="secondary" className="text-xs">
                      {property.type}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">
                        {property.city}, {property.state} {property.zip}
                      </span>
                    </div>
                    <span>•</span>
                    <span>{property.sqft} sq ft</span>
                  </div>
                </div>
                <div className="shrink-0 text-sm text-muted-foreground">
                  <span className="hidden sm:inline">{property.owner}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
