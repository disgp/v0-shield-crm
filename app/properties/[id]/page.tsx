import { AppLayout } from '@/components/app-layout'
import { AppHeader } from '@/components/app-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Home, Edit } from 'lucide-react'

const property = {
  id: '1',
  address: '1234 Oak Street, Austin, TX 78701',
  type: 'Residential',
  roofArea: '2,450 sq ft',
  roofPitch: '6:12',
  roofMaterial: 'Asphalt Shingle',
  stories: '2',
  yearBuilt: '1998',
  owner: {
    name: 'Michael Johnson',
    email: 'michael.j@email.com',
    phone: '(555) 123-4567',
  },
}

export default function PropertyDetailPage() {
  return (
    <AppLayout>
      <AppHeader
        title="Property Details"
        action={
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Property
          </Button>
        }
      />
      <div className="p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Map Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Property Address</p>
                <p className="font-medium">{property.address}</p>
              </div>
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                    property.address
                  )}&zoom=17&maptype=satellite`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Property Location"
                />
              </div>
            </CardContent>
          </Card>

          {/* Roof Passport Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Roof Passport
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Roof Area</p>
                  <p className="font-medium">{property.roofArea}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Roof Pitch</p>
                  <p className="font-medium">{property.roofPitch}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Roof Material</p>
                  <p className="font-medium">{property.roofMaterial}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stories</p>
                  <p className="font-medium">{property.stories}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Year Built</p>
                  <p className="font-medium">{property.yearBuilt}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Property Type</p>
                  <Badge variant="secondary">{property.type}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ownership Card */}
          <Card>
            <CardHeader>
              <CardTitle>Property Owner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{property.owner.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{property.owner.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{property.owner.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
