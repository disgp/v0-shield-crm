'use client'

import { AppLayout } from '@/components/app-layout'
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface LineItem {
  id: string
  service: string
  description: string
  quantity: number
  unitPrice: number
}

export default function NewEstimatePage() {
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', service: 'Roof Inspection', description: 'Complete roof assessment', quantity: 1, unitPrice: 250 },
    { id: '2', service: 'Shingle Replacement', description: 'Remove and replace damaged shingles', quantity: 500, unitPrice: 8 },
  ])

  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const tax = subtotal * 0.0825 // 8.25% tax
  const total = subtotal + tax

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: Date.now().toString(),
        service: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
      },
    ])
  }

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id))
  }

  return (
    <AppLayout>
      <AppHeader title="New Estimate" />
      <div className="p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Header Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer / Job</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Sarah Johnson - Roof Repair</SelectItem>
                      <SelectItem value="2">Michael Chen - Commercial Restoration</SelectItem>
                      <SelectItem value="3">Emily Rodriguez - Residential Re-roof</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Badge variant="secondary" className="mt-2 block w-fit">
                    Draft
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiration">Expiration Date</Label>
                  <input
                    id="expiration"
                    type="date"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Line Items</CardTitle>
              <Button variant="outline" size="sm" onClick={addLineItem}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-muted-foreground">
                  <div className="col-span-3">Service</div>
                  <div className="col-span-4">Description</div>
                  <div className="col-span-2">Qty</div>
                  <div className="col-span-2">Unit Price</div>
                  <div className="col-span-1">Total</div>
                </div>

                <Separator />

                {/* Line Items */}
                {lineItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4">
                    <div className="col-span-3">
                      <Input placeholder="Service" defaultValue={item.service} />
                    </div>
                    <div className="col-span-4">
                      <Input placeholder="Description" defaultValue={item.description} />
                    </div>
                    <div className="col-span-2">
                      <Input type="number" defaultValue={item.quantity} />
                    </div>
                    <div className="col-span-2">
                      <Input type="number" defaultValue={item.unitPrice} />
                    </div>
                    <div className="col-span-1 flex items-center justify-between">
                      <span className="text-sm font-medium">${(item.quantity * item.unitPrice).toFixed(2)}</span>
                      <Button variant="ghost" size="icon" onClick={() => removeLineItem(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Totals and Signature Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Left: Signature */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Additional notes or terms..."
                      className="mt-2 min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Customer Signature</Label>
                    <div className="h-24 rounded-md border-2 border-dashed border-muted bg-muted/20" />
                    <p className="text-xs text-muted-foreground">Sign above to accept this estimate</p>
                  </div>
                </div>

                {/* Right: Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (8.25%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Grand Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Save Draft
                    </Button>
                    <Button className="flex-1">Send Estimate</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
