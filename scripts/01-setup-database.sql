-- ShieldCRM Database Setup Script
-- This script creates all tables, enums, and relationships for the CRM

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (careful with this in production!)
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS material_orders CASCADE;
DROP TABLE IF EXISTS inspections CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS insurance CASCADE;
DROP TABLE IF EXISTS estimates CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Drop existing types if they exist
DROP TYPE IF EXISTS contact_type CASCADE;
DROP TYPE IF EXISTS lead_source CASCADE;
DROP TYPE IF EXISTS lead_status CASCADE;
DROP TYPE IF EXISTS job_stage CASCADE;
DROP TYPE IF EXISTS job_type CASCADE;
DROP TYPE IF EXISTS job_category CASCADE;
DROP TYPE IF EXISTS job_priority CASCADE;
DROP TYPE IF EXISTS permit_status CASCADE;
DROP TYPE IF EXISTS invoice_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS supplement_status CASCADE;
DROP TYPE IF EXISTS claim_status CASCADE;
DROP TYPE IF EXISTS task_status CASCADE;
DROP TYPE IF EXISTS task_priority CASCADE;
DROP TYPE IF EXISTS note_type CASCADE;
DROP TYPE IF EXISTS entity_type CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS loss_type CASCADE;
DROP TYPE IF EXISTS adjuster_role CASCADE;
DROP TYPE IF EXISTS material_status CASCADE;

-- Create ENUM types
CREATE TYPE contact_type AS ENUM ('client', 'lead', 'vendor', 'adjuster', 'subcontractor');
CREATE TYPE lead_source AS ENUM ('referral', 'website', 'door_knock', 'storm_chase', 'social_media', 'paid_ads', 'other');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'unqualified', 'converted', 'lost');
CREATE TYPE job_stage AS ENUM ('lead', 'inspection', 'estimating', 'negotiation', 'production', 'billing', 'closed', 'lost');
CREATE TYPE job_type AS ENUM ('roof_replacement', 'roof_repair', 'gutters', 'siding', 'windows', 'insurance_claim', 'retail');
CREATE TYPE job_category AS ENUM ('residential', 'commercial', 'multi_family');
CREATE TYPE job_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE permit_status AS ENUM ('not_required', 'pending', 'approved', 'denied', 'expired');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'partial', 'paid', 'overdue', 'void');
CREATE TYPE payment_method AS ENUM ('check', 'credit_card', 'ach', 'cash', 'financing', 'insurance_check', 'other');
CREATE TYPE supplement_status AS ENUM ('none', 'pending', 'submitted', 'approved', 'denied');
CREATE TYPE claim_status AS ENUM ('pending', 'approved', 'denied', 'closed', 'under_review', 'supplement_pending');
CREATE TYPE task_status AS ENUM ('to_do', 'in_progress', 'needs_review', 'completed', 'cancelled');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE note_type AS ENUM ('general', 'follow_up', 'complaint', 'kudos', 'internal');
CREATE TYPE entity_type AS ENUM ('contact', 'job', 'property', 'invoice', 'estimate');
CREATE TYPE user_role AS ENUM ('admin', 'owner', 'sales_rep', 'project_manager', 'office_staff', 'viewer');
CREATE TYPE loss_type AS ENUM ('storm', 'fire', 'vandalism', 'wind', 'hail', 'other');
CREATE TYPE adjuster_role AS ENUM ('primary', 'field', 'desk');
CREATE TYPE material_status AS ENUM ('draft', 'ordered', 'delivered', 'partial_delivery', 'returned');

-- Create profiles table (linked to Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  role user_role DEFAULT 'viewer',
  theme TEXT DEFAULT 'system',
  notifications JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create contacts table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address_line_1 TEXT,
  address_line_2 TEXT,
  city TEXT,
  state_iso TEXT,
  zip_code TEXT,
  contact_type contact_type NOT NULL DEFAULT 'lead',
  lead_source lead_source,
  lead_status lead_status DEFAULT 'new',
  user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Create properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT,
  state_iso TEXT,
  zip_code TEXT,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  stories INTEGER,
  year_built INTEGER,
  pitch_angle NUMERIC(5, 2),
  roof_sqft NUMERIC(10, 2),
  squares NUMERIC(10, 2),
  roof_type TEXT,
  hoa_required BOOLEAN DEFAULT FALSE,
  hoa_contact_info TEXT,
  access_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Create jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  description TEXT,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  job_type job_type,
  stage job_stage DEFAULT 'lead',
  category job_category,
  permit_status permit_status DEFAULT 'not_required',
  permit_number TEXT,
  permit_expiration_date DATE,
  lead_source lead_source,
  scheduled_date DATE,
  completion_date DATE,
  expected_closing_date DATE,
  priority job_priority DEFAULT 'medium',
  status TEXT,
  contract_amount NUMERIC(12, 2),
  expected_revenue NUMERIC(12, 2),
  actual_cost NUMERIC(12, 2),
  start_date DATE,
  end_date DATE,
  sort_order INTEGER,
  access_notes TEXT,
  user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_title TEXT NOT NULL,
  task_description TEXT,
  task_status task_status DEFAULT 'to_do',
  priority task_priority DEFAULT 'medium',
  due_date DATE,
  done_date DATE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Create invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  status invoice_status DEFAULT 'draft',
  issue_date DATE,
  due_date DATE,
  subtotal NUMERIC(12, 2),
  tax_total NUMERIC(12, 2),
  total_amount NUMERIC(12, 2),
  balance_due NUMERIC(12, 2),
  qbo_id TEXT,
  sync_token TEXT,
  sync_status TEXT,
  last_synced_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Create estimates table
CREATE TABLE estimates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  estimate_amount NUMERIC(12, 2) NOT NULL,
  estimate_status TEXT,
  expiration_date DATE,
  signature_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Create insurance table
CREATE TABLE insurance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  adjuster_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  claim_status claim_status DEFAULT 'pending',
  carrier_name TEXT,
  policy_number TEXT,
  claim_number TEXT,
  date_of_loss DATE,
  loss_type loss_type,
  deductible NUMERIC(12, 2),
  acv_amount NUMERIC(12, 2),
  rcv_amount NUMERIC(12, 2),
  recoverable_depreciation NUMERIC(12, 2),
  non_recoverable_depreciation NUMERIC(12, 2),
  supplement_status supplement_status DEFAULT 'none',
  supplement_amount NUMERIC(12, 2),
  submission_date DATE,
  adjuster_assigned_at TIMESTAMPTZ,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Create notes table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type entity_type NOT NULL,
  entity_id UUID NOT NULL,
  body TEXT NOT NULL,
  note_type note_type DEFAULT 'general',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Create activity logs table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details TEXT,
  metadata JSONB,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  amount NUMERIC(12, 2) NOT NULL,
  payment_date DATE,
  payment_method payment_method NOT NULL,
  reference_number TEXT,
  qbo_id TEXT,
  sync_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Create inspections table
CREATE TABLE inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  inspector_id UUID REFERENCES profiles(id),
  inspection_type TEXT,
  damage_assessment TEXT,
  photo_count INTEGER,
  weather_conditions TEXT,
  scheduled_date DATE,
  completed_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Create material orders table
CREATE TABLE material_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  po_number TEXT,
  order_date DATE,
  expected_delivery DATE,
  delivery_tracking TEXT,
  status material_status DEFAULT 'draft',
  material_type TEXT,
  total_cost NUMERIC(12, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT UNIQUE,
  unit_price NUMERIC(12, 2),
  unit_of_measure TEXT,
  category TEXT,
  income_account_ref TEXT,
  expense_account_ref TEXT,
  qbo_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Create indexes for better query performance
CREATE INDEX idx_contacts_type ON contacts(contact_type);
CREATE INDEX idx_contacts_status ON contacts(lead_status);
CREATE INDEX idx_contacts_deleted ON contacts(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_properties_contact ON properties(contact_id);
CREATE INDEX idx_properties_deleted ON properties(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_property ON jobs(property_id);
CREATE INDEX idx_jobs_contact ON jobs(contact_id);
CREATE INDEX idx_jobs_stage ON jobs(stage);
CREATE INDEX idx_jobs_deleted ON jobs(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_contact ON tasks(contact_id);
CREATE INDEX idx_tasks_job ON tasks(job_id);
CREATE INDEX idx_tasks_status ON tasks(task_status);
CREATE INDEX idx_invoices_job ON invoices(job_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_notes_entity ON notes(entity_type, entity_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow authenticated users to access data)
CREATE POLICY "Allow authenticated users to read profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow users to update own profile" ON profiles FOR UPDATE TO authenticated USING (auth_id = auth.uid());

CREATE POLICY "Allow authenticated users full access to contacts" ON contacts FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users full access to properties" ON properties FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users full access to jobs" ON jobs FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users full access to tasks" ON tasks FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users full access to invoices" ON invoices FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users full access to estimates" ON estimates FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users full access to insurance" ON insurance FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users full access to notes" ON notes FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users full access to activity_logs" ON activity_logs FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users full access to payments" ON payments FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users full access to inspections" ON inspections FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users full access to material_orders" ON material_orders FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users full access to products" ON products FOR ALL TO authenticated USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to update updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_estimates_updated_at BEFORE UPDATE ON estimates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_insurance_updated_at BEFORE UPDATE ON insurance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inspections_updated_at BEFORE UPDATE ON inspections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_material_orders_updated_at BEFORE UPDATE ON material_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
