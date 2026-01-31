// Database types for ShieldCRM
// Update these types to match your Supabase database schema

export type Contact = {
  id: string
  name: string
  email: string
  phone: string
  street: string
  city: string
  state: string
  zip: string
  property_type: string
  created_at: string
  updated_at: string
}

export type Lead = {
  id: string
  name: string
  email: string
  phone: string
  status: 'New' | 'Contacted' | 'Qualified' | 'Unqualified' | 'Converted' | 'Lost'
  source: string
  created_at: string
  updated_at: string
}

export type Job = {
  id: string
  contact_id: string
  property_id: string
  status: 'Draft' | 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled'
  start_date: string
  completion_date?: string
  value: number
  created_at: string
  updated_at: string
}

export type Property = {
  id: string
  contact_id: string
  address: string
  city: string
  state: string
  zip: string
  property_type: string
  square_footage?: number
  year_built?: number
  created_at: string
  updated_at: string
}

export type Task = {
  id: string
  title: string
  description?: string
  status: 'To Do' | 'In Progress' | 'Completed'
  priority: 'Low' | 'Medium' | 'High'
  due_date: string
  assignee_id?: string
  created_at: string
  updated_at: string
}
