import { AppLayout } from '@/components/app-layout'
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

const invoices = [
  {
    id: 'INV-001',
    customer: 'Sarah Johnson',
    job: 'Roof Repair - 123 Main St',
    issueDate: '2024-01-15',
    dueDate: '2024-02-14',
    amount: 4250.0,
    balance: 0,
    status: 'Paid',
    statusColor: 'default',
  },
  {
    id: 'INV-002',
    customer: 'Michael Chen',
    job: 'Commercial Restoration',
    issueDate: '2024-01-20',
    dueDate: '2024-02-19',
    amount: 15750.0,
    balance: 15750.0,
    status: 'Pending',
    statusColor: 'secondary',
  },
  {
    id: 'INV-003',
    customer: 'Emily Rodriguez',
    job: 'Residential Re-roof',
    issueDate: '2024-01-10',
    dueDate: '2024-02-09',
    amount: 8900.0,
    balance: 8900.0,
    status: 'Overdue',
    statusColor: 'destructive',
  },
  {
    id: 'INV-004',
    customer: 'David Thompson',
    job: 'Storm Damage Assessment',
    issueDate: '2024-02-01',
    dueDate: '2024-03-01',
    amount: 1200.0,
    balance: 0,
    status: 'Paid',
    statusColor: 'default',
  },
  {
    id: 'INV-005',
    customer: 'Patricia Lee',
    job: 'Gutter Replacement',
    issueDate: '2024-01-25',
    dueDate: '2024-02-24',
    amount: 3400.0,
    balance: 1700.0,
    status: 'Partial',
    statusColor: 'secondary',
  },
]

export default function InvoicesPage() {
  return (
    <AppLayout>
      <AppHeader
        title="Invoices"
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        }
      />
      <div className="p-6">
        <Card className="overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 border-b border-border bg-muted/50 px-4 py-3 text-sm font-semibold">
            <div className="col-span-2">Invoice #</div>
            <div className="col-span-2">Customer</div>
            <div className="col-span-2">Job</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1" />
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-border">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="grid grid-cols-12 gap-4 px-4 py-4 transition-colors hover:bg-muted/50"
              >
                <div className="col-span-2">
                  <Link href={`/invoices/${invoice.id}`} className="font-medium text-foreground hover:underline">
                    {invoice.id}
                  </Link>
                </div>
                <div className="col-span-2">
                  <Link href={`/contacts/${invoice.id}`} className="text-sm text-muted-foreground hover:underline">
                    {invoice.customer}
                  </Link>
                </div>
                <div className="col-span-2 text-sm text-muted-foreground">{invoice.job}</div>
                <div className="col-span-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Issue: </span>
                    {invoice.issueDate}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Due: </span>
                    {invoice.dueDate}
                  </div>
                </div>
                <div className="col-span-2 text-sm">
                  <div className="font-medium">${invoice.amount.toFixed(2)}</div>
                  {invoice.balance > 0 && (
                    <div className="text-muted-foreground">
                      Balance: ${invoice.balance.toFixed(2)}
                    </div>
                  )}
                </div>
                <div className="col-span-1">
                  <Badge variant={invoice.statusColor as any}>{invoice.status}</Badge>
                </div>
                <div className="col-span-1 flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Receive Payment</DropdownMenuItem>
                      <DropdownMenuItem>Resend Invoice</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Void Invoice</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
