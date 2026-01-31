import { AppLayout } from '@/components/app-layout'
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Textarea } from '@/components/ui/textarea'
import { Edit, Phone, Mail, MapPin, Plus, Briefcase, FileText, Calendar } from 'lucide-react'
import Link from 'next/link'

// Mock data
const contact = {
  id: '1',
  name: 'Sarah Johnson',
  address: {
    street: '123 Main Street',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
  },
  phone: '(512) 555-0123',
  email: 'sarah.johnson@email.com',
  propertyType: 'Residential',
}

const activities = [
  {
    id: '1',
    type: 'note',
    title: 'Initial Contact',
    description: 'Spoke with Sarah about roof inspection. She mentioned recent storm damage.',
    date: '2024-01-15',
    user: 'John Doe',
  },
  {
    id: '2',
    type: 'estimate',
    title: 'Estimate Sent',
    description: 'Sent estimate #EST-001 for roof replacement - $15,000',
    date: '2024-01-18',
    user: 'John Doe',
  },
]

export default function ContactDetailPage({ params }: { params: { id: string } }) {
  return (
    <AppLayout>
      <AppHeader
        title={contact.name}
        action={
          <Link href={`/contacts/${params.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Contact
            </Button>
          </Link>
        }
      />
      <div className="p-4 sm:p-6">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6 lg:col-span-2">
            {/* Contact Info Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Contact Information</CardTitle>
                <Link href={`/contacts/${params.id}/edit`}>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {contact.address.street}
                      <br />
                      {contact.address.city}, {contact.address.state} {contact.address.zip}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Notes</CardTitle>
                <Button variant="ghost" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add a note about this contact..."
                  className="min-h-[120px]"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Map Card */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(
                      `${contact.address.street}, ${contact.address.city}, ${contact.address.state} ${contact.address.zip}`
                    )}`}
                    allowFullScreen
                    title="Contact Location"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-2 sm:gap-3">
                <Button variant="outline" className="h-16 flex-col gap-1.5 bg-transparent text-xs sm:h-20 sm:gap-2">
                  <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span>Jobs</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col gap-1.5 bg-transparent text-xs sm:h-20 sm:gap-2">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span>Estimate</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col gap-1.5 bg-transparent text-xs sm:h-20 sm:gap-2">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span>Schedule</span>
                </Button>
              </CardContent>
            </Card>

            {/* Activity Log Card */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {activities.map((activity) => (
                    <AccordionItem key={activity.id} value={activity.id}>
                      <AccordionTrigger className="text-sm">
                        <div className="text-left">
                          <div className="font-medium">{activity.title}</div>
                          <div className="text-xs text-muted-foreground">{activity.date}</div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <p className="mt-2 text-xs text-muted-foreground">By {activity.user}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
