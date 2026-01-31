import { AppLayout } from '@/components/app-layout'
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Calendar } from 'lucide-react'

const tasks = [
  {
    id: '1',
    title: 'Follow up with Sarah Johnson',
    status: 'To Do',
    dueDate: '2024-02-15',
    priority: 'High',
    assignee: 'JD',
  },
  {
    id: '2',
    title: 'Send estimate to Michael Chen',
    status: 'In Progress',
    dueDate: '2024-02-12',
    priority: 'High',
    assignee: 'JS',
  },
  {
    id: '3',
    title: 'Schedule roof inspection',
    status: 'To Do',
    dueDate: '2024-02-18',
    priority: 'Medium',
    assignee: 'BW',
  },
  {
    id: '4',
    title: 'Review insurance claim documents',
    status: 'In Progress',
    dueDate: '2024-02-14',
    priority: 'High',
    assignee: 'JD',
  },
  {
    id: '5',
    title: 'Update project timeline',
    status: 'Completed',
    dueDate: '2024-02-10',
    priority: 'Low',
    assignee: 'AB',
  },
  {
    id: '6',
    title: 'Call David Thompson for site access',
    status: 'To Do',
    dueDate: '2024-02-16',
    priority: 'Medium',
    assignee: 'JS',
  },
]

const getPriorityVariant = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'destructive'
    case 'Medium':
      return 'default'
    case 'Low':
      return 'secondary'
    default:
      return 'secondary'
  }
}

export default function TasksPage() {
  return (
    <AppLayout>
      <AppHeader
        title="Tasks"
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        }
      />
      <div className="p-6">
        <Card className="overflow-hidden">
          <div className="divide-y divide-border">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50">
                <Badge variant={getPriorityVariant(task.priority)} className="shrink-0">
                  {task.priority}
                </Badge>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 font-semibold text-foreground">{task.title}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{task.dueDate}</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge variant="secondary" className="hidden sm:flex">
                    {task.status}
                  </Badge>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {task.assignee}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
