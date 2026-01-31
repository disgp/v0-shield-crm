// Database types for ShieldCRM - Generated from schema_new.md

// Enum Types
export type ContactType = 'client' | 'lead' | 'vendor' | 'adjuster' | 'subcontractor'
export type LeadSource = 'referral' | 'website' | 'door_knock' | 'storm_chase' | 'social_media' | 'paid_ads' | 'other'
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted' | 'lost'
export type JobStage = 'lead' | 'inspection' | 'estimating' | 'negotiation' | 'production' | 'billing' | 'closed' | 'lost'
export type JobType = 'roof_replacement' | 'roof_repair' | 'gutters' | 'siding' | 'windows' | 'insurance_claim' | 'retail'
export type JobCategory = 'residential' | 'commercial' | 'multi_family'
export type JobPriority = 'low' | 'medium' | 'high' | 'critical'
export type PermitStatus = 'not_required' | 'pending' | 'approved' | 'denied' | 'expired'
export type InvoiceStatus = 'draft' | 'sent' | 'partial' | 'paid' | 'overdue' | 'void'
export type PaymentMethod = 'check' | 'credit_card' | 'ach' | 'cash' | 'financing' | 'insurance_check' | 'other'
export type SupplementStatus = 'none' | 'pending' | 'submitted' | 'approved' | 'denied'
export type ClaimStatus = 'pending' | 'approved' | 'denied' | 'closed' | 'under_review' | 'supplement_pending'
export type TaskStatus = 'to_do' | 'in_progress' | 'needs_review' | 'completed' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'
export type NoteType = 'general' | 'follow_up' | 'complaint' | 'kudos' | 'internal'
export type EntityType = 'contact' | 'job' | 'property' | 'invoice' | 'estimate'
export type UserRole = 'admin' | 'owner' | 'sales_rep' | 'project_manager' | 'office_staff' | 'viewer'
export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'revoked'
export type LossType = 'storm' | 'fire' | 'vandalism' | 'wind' | 'hail' | 'other'
export type AdjusterRole = 'primary' | 'field' | 'desk'
export type MaterialStatus = 'draft' | 'ordered' | 'delivered' | 'partial_delivery' | 'returned'

// Table Types
export type Contact = {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  address_line_1?: string
  address_line_2?: string
  city?: string
  state_iso?: string
  zip_code?: string
  contact_type: ContactType
  lead_source?: LeadSource
  lead_status?: LeadStatus
  created_at: string
  updated_at: string
  deleted_at?: string
  user_id?: string
}

export type Property = {
  id: string
  contact_id?: string
  address_line_1: string
  address_line_2?: string
  city?: string
  state_iso?: string
  zip_code?: string
  latitude?: number
  longitude?: number
  stories?: number
  year_built?: number
  pitch_angle?: number
  roof_sqft?: number
  squares?: number
  roof_type?: string
  hoa_required?: boolean
  hoa_contact_info?: string
  access_notes?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export type Job = {
  id: string
  name?: string
  description?: string
  property_id: string
  contact_id?: string
  job_type?: JobType
  stage?: JobStage
  category?: JobCategory
  permit_status?: PermitStatus
  permit_number?: string
  permit_expiration_date?: string
  lead_source?: LeadSource
  scheduled_date?: string
  completion_date?: string
  expected_closing_date?: string
  created_at: string
  updated_at: string
  deleted_at?: string
  sort_order?: number
  access_notes?: string
  user_id?: string
  priority?: JobPriority
  status?: string
  contract_amount?: number
  expected_revenue?: number
  actual_cost?: number
  start_date?: string
  end_date?: string
}

export type Task = {
  id: string
  task_title: string
  task_description?: string
  task_status?: TaskStatus
  priority?: TaskPriority
  due_date?: string
  done_date?: string
  contact_id?: string
  job_id?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export type Invoice = {
  id: string
  job_id: string
  customer_id?: string
  invoice_number: string
  status?: InvoiceStatus
  issue_date?: string
  due_date?: string
  subtotal?: number
  tax_total?: number
  total_amount?: number
  balance_due?: number
  qbo_id?: string
  sync_token?: string
  sync_status?: string
  last_synced_at?: string
  notes?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export type Estimate = {
  id: string
  job_id: string
  estimate_amount: number
  estimate_status?: string
  expiration_date?: string
  signature_data?: any
  created_at: string
  updated_at: string
  deleted_at?: string
}

export type Insurance = {
  id: string
  job_id?: string
  adjuster_id?: string
  claim_status?: ClaimStatus
  carrier_name?: string
  policy_number?: string
  claim_number?: string
  date_of_loss?: string
  loss_type?: LossType
  deductible?: number
  acv_amount?: number
  rcv_amount?: number
  recoverable_depreciation?: number
  non_recoverable_depreciation?: number
  supplement_status?: SupplementStatus
  supplement_amount?: number
  submission_date?: string
  adjuster_assigned_at?: string
  details?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export type Note = {
  id: string
  entity_type: EntityType
  entity_id: string
  body: string
  note_type?: NoteType
  created_by?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export type Profile = {
  id: string
  auth_id: string
  first_name?: string
  last_name?: string
  email?: string
  role?: UserRole
  theme?: string
  notifications?: any
  created_at: string
  updated_at: string
}

export type ActivityLog = {
  id: string
  user_id?: string
  contact_id?: string
  job_id?: string
  property_id?: string
  action: string
  details?: string
  metadata?: any
  old_data?: any
  new_data?: any
  created_at: string
}

export type Payment = {
  id: string
  customer_id?: string
  amount: number
  payment_date?: string
  payment_method: PaymentMethod
  reference_number?: string
  qbo_id?: string
  sync_status?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export type Inspection = {
  id: string
  job_id: string
  inspector_id?: string
  inspection_type?: string
  damage_assessment?: string
  photo_count?: number
  weather_conditions?: string
  scheduled_date?: string
  completed_date?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export type MaterialOrder = {
  id: string
  job_id?: string
  supplier_id?: string
  po_number?: string
  order_date?: string
  expected_delivery?: string
  delivery_tracking?: string
  status?: MaterialStatus
  material_type?: string
  total_cost?: number
  created_at: string
  updated_at: string
  deleted_at?: string
}

export type Product = {
  id: string
  name: string
  description?: string
  sku?: string
  unit_price?: number
  unit_of_measure?: string
  category?: string
  income_account_ref?: string
  expense_account_ref?: string
  qbo_id?: string
  deleted_at?: string
  created_at: string
  updated_at: string
}

// Database interface
export type Database = {
  public: {
    Tables: {
      contacts: { Row: Contact }
      properties: { Row: Property }
      jobs: { Row: Job }
      tasks: { Row: Task }
      invoices: { Row: Invoice }
      estimates: { Row: Estimate }
      insurance: { Row: Insurance }
      notes: { Row: Note }
      profiles: { Row: Profile }
      activity_logs: { Row: ActivityLog }
      payments: { Row: Payment }
      inspections: { Row: Inspection }
      material_orders: { Row: MaterialOrder }
      products: { Row: Product }
    }
  }
}
