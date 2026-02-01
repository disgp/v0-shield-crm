'use client'

import { AppLayout } from '@/components/app-layout'
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import type { Contact } from '@/lib/supabase/types'

export default function EditContactPage({ params }: { params: { id: string } }) {
  const [contact, setContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [propertyType, setPropertyType] = useState('residential')
  const [newsletter, setNewsletter] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function fetchContact() {
      try {
        console.log('[v0] Fetching contact with id:', params.id)
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) {
          console.error('[v0] Error fetching contact:', error)
          throw error
        }

        console.log('[v0] Contact data received:', data)
        setContact(data)
      } catch (error) {
        console.error('[v0] Failed to fetch contact:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContact()
  }, [params.id, supabase])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData(e.currentTarget)
      
      const updates = {
        first_name: formData.get('firstName') as string,
        last_name: formData.get('lastName') as string,
        email: formData.get('email') as string || null,
        phone: formData.get('phone') as string || null,
        address_line_1: formData.get('street') as string || null,
        city: formData.get('city') as string || null,
        state_iso: formData.get('state') as string || null,
        zip_code: formData.get('zip') as string || null,
        updated_at: new Date().toISOString(),
      }

      console.log('[v0] Updating contact with data:', updates)

      const { error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', params.id)

      if (error) {
        console.error('[v0] Error updating contact:', error)
        throw error
      }

      console.log('[v0] Contact updated successfully')
      router.push(`/contacts/${params.id}`)
    } catch (error) {
      console.error('[v0] Failed to update contact:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <AppHeader title="Edit Contact" />
        <div className="flex min-h-[400px] items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    )
  }

  if (!contact) {
    return (
      <AppLayout>
        <AppHeader title="Edit Contact" />
        <div className="p-6">
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Contact not found</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <AppHeader title="Edit Contact" />
      <div className="p-6">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
          {/* Contact Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    id="firstName" 
                    name="firstName"
                    placeholder="John" 
                    defaultValue={contact.first_name} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    id="lastName" 
                    name="lastName"
                    placeholder="Doe" 
                    defaultValue={contact.last_name} 
                    required 
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    defaultValue={contact.email || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone"
                    type="tel" 
                    placeholder="(555) 555-5555" 
                    defaultValue={contact.phone || ''} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input 
                  id="street" 
                  name="street"
                  placeholder="123 Main St" 
                  defaultValue={contact.address_line_1 || ''} 
                />
              </div>

              <div className="grid gap-4 md:grid-cols-6">
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    name="city"
                    placeholder="Austin" 
                    defaultValue={contact.city || ''} 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state" 
                    name="state"
                    placeholder="TX" 
                    defaultValue={contact.state_iso || ''} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">Zip</Label>
                  <Input 
                    id="zip" 
                    name="zip"
                    placeholder="78701" 
                    defaultValue={contact.zip_code || ''} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Property Type</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={propertyType === 'residential' ? 'default' : 'outline'}
                    onClick={() => setPropertyType('residential')}
                    className="flex-1"
                  >
                    Residential
                  </Button>
                  <Button
                    type="button"
                    variant={propertyType === 'commercial' ? 'default' : 'outline'}
                    onClick={() => setPropertyType('commercial')}
                    className="flex-1"
                  >
                    Commercial
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" placeholder="Homeowner" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spouse">Spouse/Secondary Contact</Label>
                  <Input id="spouse" placeholder="Jane Doe" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="secondaryPhone">Secondary Phone</Label>
                  <Input id="secondaryPhone" type="tel" placeholder="(555) 555-5556" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gateCode">Gate Code/Access Info</Label>
                  <Input id="gateCode" placeholder="#1234" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountManager">
                  Account Manager <span className="text-destructive">*</span>
                </Label>
                <Select defaultValue="john">
                  <SelectTrigger>
                    <SelectValue placeholder="Select account manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john">John Doe</SelectItem>
                    <SelectItem value="jane">Jane Smith</SelectItem>
                    <SelectItem value="bob">Bob Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Marketing Card */}
          <Card>
            <CardHeader>
              <CardTitle>Marketing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">in/</span>
                  <Input id="linkedin" placeholder="sarahjohnson" className="flex-1" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="leadSource">Lead Source</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lead source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="advertising">Advertising</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="newsletter">Newsletter Subscription</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive monthly updates about roofing tips and special offers
                  </p>
                </div>
                <Switch id="newsletter" checked={newsletter} onCheckedChange={setNewsletter} />
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="sticky bottom-0 flex justify-end border-t border-border bg-background py-4">
            <Button size="lg" className="min-w-[200px]">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
