-- ShieldCRM Database Schema v2.0
-- Complete schema migration script

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- ====================
-- ENUM TYPE DEFINITIONS
-- ====================

CREATE TYPE contact_type_enum AS ENUM ('client', 'lead', 'vendor', 'adjuster', 'subcontractor');
CREATE TYPE lead_source_enum AS ENUM ('referral', 'website', 'door_knock', 'storm_chase', 'social_media', 'paid_ads', 'other');
CREATE TYPE lead_status_enum AS ENUM ('new', 'contacted', 'qualified', 'unqualified', 'converted', 'lost');
CREATE TYPE job_stage_enum AS ENUM ('lead', 'inspection', 'estimating', 'negotiation', 'production', 'billing', 'closed', 'lost');
CREATE TYPE job_type_enum AS ENUM ('roof_replacement', 'roof_repair', 'gutters', 'siding', 'windows', 'insurance_claim', 'retail');
CREATE TYPE job_category_enum AS ENUM ('residential', 'commercial', 'multi_family');
CREATE TYPE job_priority_enum AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE permit_status_enum AS ENUM ('not_required', 'pending', 'approved', 'denied', 'expired');
CREATE TYPE invoice_status_enum AS ENUM ('draft', 'sent', 'partial', 'paid', 'overdue', 'void');
CREATE TYPE payment_method_enum AS ENUM ('check', 'credit_card', 'ach', 'cash', 'financing', 'insurance_check', 'other');
CREATE TYPE supplement_status_enum AS ENUM ('none', 'pending', 'submitted', 'approved', 'denied');
CREATE TYPE claim_status_enum AS ENUM ('pending', 'approved', 'denied', 'closed', 'under_review', 'supplement_pending');
CREATE TYPE task_status_enum AS ENUM ('to_do', 'in_progress', 'needs_review', 'completed', 'cancelled');
CREATE TYPE task_priority_enum AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE note_type_enum AS ENUM ('general', 'follow_up', 'complaint', 'kudos', 'internal');
CREATE TYPE entity_type_enum AS ENUM ('contact', 'job', 'property', 'invoice', 'estimate');
CREATE TYPE user_role_enum AS ENUM ('admin', 'owner', 'sales_rep', 'project_manager', 'office_staff', 'viewer');
CREATE TYPE invitation_status_enum AS ENUM ('pending', 'accepted', 'expired', 'revoked');
CREATE TYPE loss_type_enum AS ENUM ('storm', 'fire', 'vandalism', 'wind', 'hail', 'other');
CREATE TYPE adjuster_role_enum AS ENUM ('primary', 'field', 'desk');
CREATE TYPE material_status_enum AS ENUM ('draft', 'ordered', 'delivered', 'partial_delivery', 'returned');

-- ====================
-- PROFILES TABLE
-- ====================

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    email CITEXT,
    role user_role_enum,
    theme TEXT DEFAULT 'light',
    notifications JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================
-- CONTACTS TABLE
-- ====================

CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email CITEXT,
    phone TEXT,
    address_line_1 TEXT,
    address_line_2 TEXT,
    city TEXT,
    state_iso VARCHAR(2),
    zip_code VARCHAR(10),
    contact_type contact_type_enum NOT NULL,
    lead_source lead_source_enum,
    lead_status lead_status_enum,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    user_id UUID REFERENCES profiles(id)
);

CREATE INDEX idx_contacts_active ON contacts (id) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_contacts_email_active ON contacts (email) WHERE deleted_at IS NULL;

-- ====================
-- PROPERTIES TABLE
-- ====================

CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES contacts(id),
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    city TEXT,
    state_iso VARCHAR(2),
    zip_code VARCHAR(10),
    latitude NUMERIC(9,6) CHECK (latitude >= -90 AND latitude <= 90),
    longitude NUMERIC(9,6) CHECK (longitude >= -180 AND longitude <= 180),
    geog GEOGRAPHY(Point, 4326) GENERATED ALWAYS AS (
        CASE WHEN latitude IS NOT NULL AND longitude IS NOT NULL 
        THEN ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography 
        ELSE NULL END
    ) STORED,
    stories INTEGER,
    year_built INTEGER,
    pitch_angle NUMERIC(4,1) CHECK (pitch_angle >= 0 AND pitch_angle <= 90),
    roof_sqft NUMERIC(10,2) CHECK (roof_sqft >= 0),
    squares NUMERIC(8,2) GENERATED ALWAYS AS (roof_sqft / 100) STORED,
    roof_pitch TEXT,
    roof_pitch_ratio TEXT,
    roof_type TEXT,
    hoa_required BOOLEAN,
    hoa_contact_info TEXT,
    access_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_properties_geog ON properties USING GIST (geog);
CREATE INDEX idx_properties_contact ON properties (contact_id);
CREATE INDEX idx_properties_active ON properties (id) WHERE deleted_at IS NULL;

-- ====================
-- JOBS TABLE
-- ====================

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    description TEXT,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE RESTRICT,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    job_type job_type_enum,
    stage job_stage_enum,
    category job_category_enum,
    permit_status permit_status_enum,
    permit_number TEXT,
    permit_expiration_date DATE,
    lead_source lead_source_enum,
    scheduled_date TIMESTAMP WITH TIME ZONE,
    completion_date TIMESTAMP WITH TIME ZONE,
    expected_closing_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    sort_order INTEGER,
    access_notes TEXT,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    priority job_priority_enum,
    status TEXT,
    contract_amount DECIMAL(12,2),
    expected_revenue DECIMAL(12,2),
    actual_cost DECIMAL(12,2),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    CONSTRAINT check_end_after_start CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

CREATE INDEX idx_jobs_property ON jobs (property_id);
CREATE INDEX idx_jobs_stage_property ON jobs (stage, property_id);
CREATE INDEX idx_jobs_user_stage ON jobs (user_id, stage);
CREATE INDEX idx_jobs_active ON jobs (id) WHERE deleted_at IS NULL;

-- ====================
-- INVITATIONS TABLE
-- ====================

CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    role user_role_enum NOT NULL,
    status invitation_status_enum NOT NULL,
    invited_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================
-- ESTIMATES TABLE
-- ====================

CREATE TABLE estimates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    estimate_amount DECIMAL(12,2) NOT NULL,
    estimate_status TEXT,
    expiration_date DATE,
    signature_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_estimates_job ON estimates (job_id);
CREATE INDEX idx_estimates_active ON estimates (id) WHERE deleted_at IS NULL;

-- ====================
-- TAX_RATES TABLE
-- ====================

CREATE TABLE tax_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    rate DECIMAL(5,4) NOT NULL,
    qbo_tax_code_id TEXT,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================
-- ESTIMATE_ITEMS TABLE
-- ====================

CREATE TABLE estimate_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estimate_id UUID NOT NULL REFERENCES estimates(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    total_price NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    tax_rate_id UUID REFERENCES tax_rates(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_estimate_items_estimate ON estimate_items (estimate_id);

-- ====================
-- INSPECTIONS TABLE
-- ====================

CREATE TABLE inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    inspector_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    inspection_type TEXT,
    damage_assessment TEXT,
    photo_count INTEGER CHECK (photo_count >= 0),
    weather_conditions TEXT,
    scheduled_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_inspections_job ON inspections (job_id);
CREATE INDEX idx_inspections_inspector ON inspections (inspector_id);
CREATE INDEX idx_inspections_job_type ON inspections (job_id, inspection_type);
CREATE INDEX idx_inspections_active ON inspections (id) WHERE deleted_at IS NULL;

-- ====================
-- INSURANCE TABLE
-- ====================

CREATE TABLE insurance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    adjuster_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    claim_status claim_status_enum,
    carrier_name TEXT,
    policy_number TEXT,
    claim_number TEXT,
    date_of_loss DATE,
    loss_type loss_type_enum,
    deductible DECIMAL(12,2) CHECK (deductible >= 0),
    acv_amount DECIMAL(12,2) CHECK (acv_amount >= 0),
    rcv_amount DECIMAL(12,2) CHECK (rcv_amount >= 0),
    recoverable_depreciation DECIMAL(12,2) CHECK (recoverable_depreciation >= 0),
    non_recoverable_depreciation DECIMAL(12,2) CHECK (non_recoverable_depreciation >= 0),
    supplement_status supplement_status_enum,
    supplement_amount DECIMAL(12,2) CHECK (supplement_amount >= 0),
    submission_date DATE,
    adjuster_assigned_at TIMESTAMP WITH TIME ZONE,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT check_rcv_ge_acv CHECK (rcv_amount IS NULL OR acv_amount IS NULL OR rcv_amount >= acv_amount),
    CONSTRAINT check_recoverable_depreciation CHECK (
        recoverable_depreciation IS NULL OR 
        rcv_amount IS NULL OR 
        acv_amount IS NULL OR 
        recoverable_depreciation <= (rcv_amount - acv_amount)
    )
);

CREATE INDEX idx_insurance_claim_number ON insurance (claim_number);
CREATE INDEX idx_insurance_job ON insurance (job_id);
CREATE INDEX idx_insurance_adjuster ON insurance (adjuster_id);
CREATE INDEX idx_insurance_job_status ON insurance (job_id, claim_status);
CREATE INDEX idx_insurance_active ON insurance (id) WHERE deleted_at IS NULL;

-- ====================
-- INSURANCE_SUPPLEMENTS TABLE
-- ====================

CREATE TABLE insurance_supplements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    insurance_id UUID NOT NULL REFERENCES insurance(id) ON DELETE CASCADE,
    supplement_number INTEGER NOT NULL,
    amount DECIMAL(12,2) CHECK (amount >= 0),
    status supplement_status_enum,
    submission_date DATE,
    approval_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (insurance_id, supplement_number)
);

CREATE INDEX idx_insurance_supplements_insurance ON insurance_supplements (insurance_id);

-- ====================
-- INSURANCE_ADJUSTERS TABLE
-- ====================

CREATE TABLE insurance_adjusters (
    insurance_id UUID REFERENCES insurance(id) ON DELETE CASCADE,
    adjuster_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    role adjuster_role_enum NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (insurance_id, adjuster_id)
);

CREATE INDEX idx_insurance_adjusters_adjuster ON insurance_adjusters (adjuster_id);

-- ====================
-- PRODUCTS TABLE
-- ====================

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    sku TEXT,
    unit_price DECIMAL(12,2),
    unit_of_measure TEXT,
    category TEXT,
    income_account_ref TEXT,
    expense_account_ref TEXT,
    qbo_id TEXT,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================
-- INVOICES TABLE
-- ====================

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE RESTRICT,
    customer_id UUID REFERENCES contacts(id) ON DELETE RESTRICT,
    invoice_number TEXT NOT NULL,
    status invoice_status_enum,
    issue_date DATE,
    due_date DATE,
    subtotal DECIMAL(12,2),
    tax_total DECIMAL(12,2),
    total_amount DECIMAL(12,2),
    balance_due DECIMAL(12,2),
    qbo_id TEXT,
    sync_token TEXT,
    sync_status TEXT,
    last_synced_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT check_due_after_issue CHECK (due_date IS NULL OR issue_date IS NULL OR due_date >= issue_date)
);

CREATE INDEX idx_invoices_job ON invoices (job_id);
CREATE INDEX idx_invoices_customer ON invoices (customer_id);
CREATE INDEX idx_invoices_status_due ON invoices (status, due_date);
CREATE INDEX idx_invoices_active ON invoices (id) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_invoices_number_active ON invoices (invoice_number) WHERE deleted_at IS NULL;

-- ====================
-- INVOICE_ITEMS TABLE
-- ====================

CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    amount NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    tax_rate_id UUID REFERENCES tax_rates(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================
-- PAYMENTS TABLE
-- ====================

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES contacts(id) ON DELETE RESTRICT,
    amount DECIMAL(12,2) NOT NULL,
    payment_date DATE,
    payment_method payment_method_enum NOT NULL,
    reference_number TEXT,
    qbo_id TEXT,
    sync_status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ====================
-- PAYMENT_ALLOCATIONS TABLE
-- ====================

CREATE TABLE payment_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    amount_applied DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payment_allocations_payment ON payment_allocations (payment_id);
CREATE INDEX idx_payment_allocations_invoice ON payment_allocations (invoice_id);

-- ====================
-- JOB_CONTACTS TABLE
-- ====================

CREATE TABLE job_contacts (
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    is_primary BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (job_id, contact_id)
);

-- ====================
-- JOB_FILES TABLE
-- ====================

CREATE TABLE job_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    inspection_id UUID REFERENCES inspections(id) ON DELETE SET NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    category TEXT,
    tags TEXT[],
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_job_files_job ON job_files (job_id);
CREATE INDEX idx_job_files_inspection ON job_files (inspection_id);

-- ====================
-- MATERIAL_ORDERS TABLE
-- ====================

CREATE TABLE material_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    po_number TEXT,
    order_date DATE,
    expected_delivery DATE,
    delivery_tracking TEXT,
    status material_status_enum,
    material_type TEXT,
    total_cost DECIMAL(12,2) CHECK (total_cost >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_material_orders_job ON material_orders (job_id);
CREATE INDEX idx_material_orders_supplier ON material_orders (supplier_id);
CREATE INDEX idx_material_orders_active ON material_orders (id) WHERE deleted_at IS NULL;

-- ====================
-- MATERIAL_ORDER_ITEMS TABLE
-- ====================

CREATE TABLE material_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES material_orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_of_measure TEXT,
    unit_price DECIMAL(12,2),
    line_total NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_material_order_items_order ON material_order_items (order_id);
CREATE INDEX idx_material_order_items_product ON material_order_items (product_id);

-- ====================
-- NOTES TABLE
-- ====================

CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type entity_type_enum NOT NULL,
    entity_id UUID NOT NULL,
    body TEXT NOT NULL,
    note_type note_type_enum DEFAULT 'general',
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_notes_entity ON notes (entity_type, entity_id);
CREATE INDEX idx_notes_created_by ON notes (created_by);
CREATE INDEX idx_notes_active ON notes (id) WHERE deleted_at IS NULL;

-- ====================
-- TASKS TABLE
-- ====================

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_title TEXT NOT NULL,
    task_description TEXT,
    task_status task_status_enum,
    priority task_priority_enum,
    due_date TIMESTAMP WITH TIME ZONE,
    done_date TIMESTAMP WITH TIME ZONE,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_tasks_job ON tasks (job_id);
CREATE INDEX idx_tasks_contact ON tasks (contact_id);
CREATE INDEX idx_tasks_job_status_due ON tasks (job_id, task_status, due_date);
CREATE INDEX idx_tasks_active ON tasks (id) WHERE deleted_at IS NULL;

-- ====================
-- ACTIVITY_LOGS TABLE
-- ====================

CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    contact_id UUID REFERENCES contacts(id),
    job_id UUID REFERENCES jobs(id),
    property_id UUID REFERENCES properties(id),
    action TEXT NOT NULL,
    details TEXT,
    metadata JSONB,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT check_entity_exists CHECK (
        contact_id IS NOT NULL OR 
        job_id IS NOT NULL OR 
        property_id IS NOT NULL
    )
);

CREATE INDEX idx_activity_logs_user ON activity_logs (user_id);
CREATE INDEX idx_activity_logs_created ON activity_logs (created_at);
CREATE INDEX idx_activity_logs_job ON activity_logs (job_id, created_at DESC) WHERE job_id IS NOT NULL;
CREATE INDEX idx_activity_logs_contact ON activity_logs (contact_id, created_at DESC) WHERE contact_id IS NOT NULL;

-- ====================
-- JOB_STAGE_HISTORY TABLE
-- ====================

CREATE TABLE job_stage_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    old_stage job_stage_enum,
    new_stage job_stage_enum NOT NULL,
    changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_job_stage_history_changed_by ON job_stage_history (changed_by);
CREATE INDEX idx_job_stage_history_job ON job_stage_history (job_id);

-- ====================
-- WARRANTIES TABLE
-- ====================

CREATE TABLE warranties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    warranty_type TEXT,
    warranty_number TEXT,
    coverage_amount DECIMAL(12,2),
    expiration_date DATE,
    terms_url TEXT,
    renewal_reminders BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_warranties_job ON warranties (job_id);
CREATE INDEX idx_warranties_provider ON warranties (provider_id);
CREATE INDEX idx_warranties_active ON warranties (id) WHERE deleted_at IS NULL;

-- ====================
-- VIEWS
-- ====================

-- v_invoice_totals: Calculated invoice subtotals from line items
CREATE OR REPLACE VIEW v_invoice_totals AS
SELECT 
    invoice_id,
    SUM(amount) as calc_subtotal
FROM invoice_items
GROUP BY invoice_id;

-- v_invoice_balance: Calculated invoice balance due from payments
CREATE OR REPLACE VIEW v_invoice_balance AS
SELECT 
    i.id as invoice_id,
    i.total_amount,
    COALESCE(SUM(pa.amount_applied), 0) as total_paid,
    i.total_amount - COALESCE(SUM(pa.amount_applied), 0) as calc_balance_due
FROM invoices i
LEFT JOIN payment_allocations pa ON i.id = pa.invoice_id
GROUP BY i.id, i.total_amount;

-- v_job_costs: Calculated actual costs for jobs from material orders
CREATE OR REPLACE VIEW v_job_costs AS
SELECT 
    mo.job_id,
    SUM(moi.quantity * moi.unit_price) as calc_material_cost
FROM material_orders mo
JOIN material_order_items moi ON mo.id = moi.order_id
WHERE mo.deleted_at IS NULL
GROUP BY mo.job_id;

-- v_job_dashboard: Flattened view for Job Board (Kanban)
CREATE OR REPLACE VIEW v_job_dashboard AS
SELECT 
    j.id as job_id,
    j.name as job_name,
    j.stage,
    j.priority,
    j.scheduled_date,
    j.expected_closing_date,
    j.contract_amount,
    c.id as customer_id,
    c.first_name || ' ' || c.last_name as customer_name,
    c.phone as customer_phone,
    p.address_line_1 as property_address,
    p.city as property_city,
    (SELECT SUM(estimate_amount) FROM estimates WHERE job_id = j.id AND deleted_at IS NULL) as total_estimate_amount,
    (SELECT task_title FROM tasks WHERE job_id = j.id AND task_status != 'completed' ORDER BY due_date ASC LIMIT 1) as next_task_title,
    (SELECT due_date FROM tasks WHERE job_id = j.id AND task_status != 'completed' ORDER BY due_date ASC LIMIT 1) as next_task_due_date,
    (SELECT file_url FROM job_files WHERE job_id = j.id AND file_type LIKE 'image%' ORDER BY created_at DESC LIMIT 1) as primary_photo_url
FROM jobs j
LEFT JOIN contacts c ON j.contact_id = c.id
LEFT JOIN properties p ON j.property_id = p.id
WHERE j.deleted_at IS NULL;

-- v_customer_360: Aggregated customer detail view
CREATE OR REPLACE VIEW v_customer_360 AS
SELECT 
    c.id as contact_id,
    c.first_name,
    c.last_name,
    c.first_name || ' ' || c.last_name as full_name,
    c.email,
    c.phone,
    c.address_line_1,
    c.address_line_2,
    c.city,
    c.state_iso,
    c.zip_code,
    c.contact_type,
    c.lead_source,
    c.lead_status,
    c.created_at,
    (SELECT json_agg(json_build_object(
        'action', al.action,
        'details', al.details,
        'created_at', al.created_at
    ) ORDER BY al.created_at DESC)
     FROM (SELECT * FROM activity_logs WHERE contact_id = c.id LIMIT 10) al
    ) as recent_activities,
    (SELECT json_agg(json_build_object(
        'id', j.id,
        'name', j.name,
        'stage', j.stage,
        'contract_amount', j.contract_amount
    ))
     FROM jobs j WHERE j.contact_id = c.id AND j.deleted_at IS NULL
    ) as jobs,
    (SELECT json_agg(json_build_object(
        'id', i.id,
        'invoice_number', i.invoice_number,
        'total_amount', i.total_amount,
        'balance_due', i.balance_due,
        'status', i.status
    ))
     FROM invoices i WHERE i.customer_id = c.id AND i.status NOT IN ('paid', 'void') AND i.deleted_at IS NULL
    ) as open_invoices,
    (SELECT json_agg(json_build_object(
        'id', p.id,
        'address_line_1', p.address_line_1,
        'city', p.city,
        'state_iso', p.state_iso
    ))
     FROM properties p WHERE p.contact_id = c.id AND p.deleted_at IS NULL
    ) as properties
FROM contacts c
WHERE c.deleted_at IS NULL;

-- ====================
-- TRIGGERS FOR updated_at
-- ====================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_estimates_updated_at BEFORE UPDATE ON estimates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_estimate_items_updated_at BEFORE UPDATE ON estimate_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inspections_updated_at BEFORE UPDATE ON inspections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insurance_updated_at BEFORE UPDATE ON insurance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insurance_supplements_updated_at BEFORE UPDATE ON insurance_supplements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_material_orders_updated_at BEFORE UPDATE ON material_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_allocations_updated_at BEFORE UPDATE ON payment_allocations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tax_rates_updated_at BEFORE UPDATE ON tax_rates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_warranties_updated_at BEFORE UPDATE ON warranties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_contacts_updated_at BEFORE UPDATE ON job_contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_files_updated_at BEFORE UPDATE ON job_files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
