-- ShieldCRM Mock Data Seed Script
-- This script populates the database with realistic mock data for testing

-- Insert mock profiles (These would normally be created via Supabase Auth)
-- Note: You'll need to create actual auth users first, then update these with real auth_ids
INSERT INTO profiles (id, auth_id, first_name, last_name, email, role) VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'John', 'Smith', 'john.smith@shieldcrm.com', 'admin'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Sarah', 'Johnson', 'sarah.johnson@shieldcrm.com', 'sales_rep'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'Mike', 'Williams', 'mike.williams@shieldcrm.com', 'project_manager')
ON CONFLICT (auth_id) DO NOTHING;

-- Insert mock contacts (clients, leads, vendors, adjusters)
INSERT INTO contacts (id, first_name, last_name, email, phone, address_line_1, city, state_iso, zip_code, contact_type, lead_source, lead_status, user_id) VALUES
  -- Clients
  ('10000000-0000-0000-0000-000000000001', 'Robert', 'Anderson', 'robert.anderson@email.com', '555-0101', '123 Oak Street', 'Dallas', 'TX', '75001', 'client', 'referral', 'converted', '00000000-0000-0000-0000-000000000002'),
  ('10000000-0000-0000-0000-000000000002', 'Jennifer', 'Martinez', 'jennifer.martinez@email.com', '555-0102', '456 Maple Avenue', 'Fort Worth', 'TX', '76101', 'client', 'website', 'converted', '00000000-0000-0000-0000-000000000002'),
  ('10000000-0000-0000-0000-000000000003', 'David', 'Thompson', 'david.thompson@email.com', '555-0103', '789 Pine Road', 'Arlington', 'TX', '76001', 'client', 'storm_chase', 'converted', '00000000-0000-0000-0000-000000000002'),
  
  -- Active Leads
  ('10000000-0000-0000-0000-000000000004', 'Emily', 'Davis', 'emily.davis@email.com', '555-0104', '321 Elm Street', 'Plano', 'TX', '75024', 'lead', 'door_knock', 'contacted', '00000000-0000-0000-0000-000000000002'),
  ('10000000-0000-0000-0000-000000000005', 'Michael', 'Brown', 'michael.brown@email.com', '555-0105', '654 Cedar Lane', 'Irving', 'TX', '75038', 'lead', 'social_media', 'qualified', '00000000-0000-0000-0000-000000000002'),
  ('10000000-0000-0000-0000-000000000006', 'Lisa', 'Wilson', 'lisa.wilson@email.com', '555-0106', '987 Birch Drive', 'Garland', 'TX', '75040', 'lead', 'paid_ads', 'new', '00000000-0000-0000-0000-000000000002'),
  
  -- Vendors/Subcontractors
  ('10000000-0000-0000-0000-000000000007', 'ABC', 'Roofing Supply', 'orders@abcroofing.com', '555-0201', '100 Industrial Blvd', 'Dallas', 'TX', '75234', 'vendor', NULL, NULL, NULL),
  ('10000000-0000-0000-0000-000000000008', 'Elite', 'Gutters Inc', 'contact@elitegutters.com', '555-0202', '200 Commerce Street', 'Dallas', 'TX', '75201', 'subcontractor', NULL, NULL, NULL),
  
  -- Insurance Adjusters
  ('10000000-0000-0000-0000-000000000009', 'James', 'Parker', 'james.parker@stateins.com', '555-0301', '500 Insurance Plaza', 'Dallas', 'TX', '75202', 'adjuster', NULL, NULL, NULL),
  ('10000000-0000-0000-0000-000000000010', 'Patricia', 'Collins', 'patricia.collins@nationwide.com', '555-0302', '600 Claims Center', 'Dallas', 'TX', '75203', 'adjuster', NULL, NULL, NULL);

-- Insert mock properties
INSERT INTO properties (id, contact_id, address_line_1, city, state_iso, zip_code, latitude, longitude, stories, year_built, pitch_angle, roof_sqft, squares, roof_type, hoa_required) VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '123 Oak Street', 'Dallas', 'TX', '75001', 32.7767, -96.7970, 2, 1995, 6.5, 2400, 24, 'Composition Shingle', false),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '456 Maple Avenue', 'Fort Worth', 'TX', '76101', 32.7555, -97.3308, 1, 2005, 5.0, 1800, 18, 'Architectural Shingle', true),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', '789 Pine Road', 'Arlington', 'TX', '76001', 32.7357, -97.1081, 2, 1988, 7.0, 3200, 32, 'Metal', false),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', '321 Elm Street', 'Plano', 'TX', '75024', 33.0198, -96.6989, 2, 2010, 6.0, 2200, 22, 'Composition Shingle', true),
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', '654 Cedar Lane', 'Irving', 'TX', '75038', 32.8140, -96.9489, 1, 2000, 4.5, 1600, 16, 'Tile', false),
  ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000006', '987 Birch Drive', 'Garland', 'TX', '75040', 32.9126, -96.6389, 2, 1992, 6.5, 2600, 26, 'Composition Shingle', false);

-- Insert mock jobs
INSERT INTO jobs (id, name, property_id, contact_id, job_type, stage, category, priority, lead_source, contract_amount, expected_revenue, actual_cost, scheduled_date, start_date, expected_closing_date, permit_status, user_id) VALUES
  -- Active Jobs
  ('30000000-0000-0000-0000-000000000001', 'Full Roof Replacement - Oak Street', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'roof_replacement', 'production', 'residential', 'high', 'referral', 18500.00, 18500.00, 12300.00, '2026-02-15', '2026-02-15', '2026-03-01', 'approved', '00000000-0000-0000-0000-000000000003'),
  ('30000000-0000-0000-0000-000000000002', 'Insurance Claim - Maple Avenue', '20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'insurance_claim', 'negotiation', 'residential', 'critical', 'website', 22000.00, 22000.00, NULL, '2026-02-20', NULL, '2026-03-15', 'pending', '00000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000003', 'Roof Repair - Pine Road', '20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'roof_repair', 'billing', 'residential', 'medium', 'storm_chase', 4500.00, 4500.00, 2800.00, '2026-01-20', '2026-01-20', '2026-02-05', 'not_required', '00000000-0000-0000-0000-000000000003'),
  
  -- Lead Stage Jobs
  ('30000000-0000-0000-0000-000000000004', 'New Lead - Elm Street', '20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 'roof_replacement', 'inspection', 'residential', 'medium', 'door_knock', NULL, 16000.00, NULL, '2026-02-10', NULL, '2026-03-20', 'not_required', '00000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000005', 'Estimate Needed - Cedar Lane', '20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', 'gutters', 'estimating', 'residential', 'low', 'social_media', NULL, 3200.00, NULL, NULL, NULL, '2026-02-28', 'not_required', '00000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000006', 'Initial Contact - Birch Drive', '20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000006', 'roof_replacement', 'lead', 'residential', 'low', 'paid_ads', NULL, 19000.00, NULL, NULL, NULL, '2026-03-10', 'not_required', '00000000-0000-0000-0000-000000000002');

-- Insert mock tasks
INSERT INTO tasks (id, task_title, task_description, task_status, priority, due_date, contact_id, job_id) VALUES
  ('40000000-0000-0000-0000-000000000001', 'Schedule final inspection', 'Coordinate with city inspector for final roof inspection', 'in_progress', 'high', '2026-02-28', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001'),
  ('40000000-0000-0000-0000-000000000002', 'Follow up with insurance adjuster', 'Call Patricia Collins regarding supplement approval', 'to_do', 'critical', '2026-02-05', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002'),
  ('40000000-0000-0000-0000-000000000003', 'Send final invoice', 'Generate and send final invoice for Pine Road repair', 'to_do', 'medium', '2026-02-03', '10000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000003'),
  ('40000000-0000-0000-0000-000000000004', 'Schedule inspection appointment', 'Call Emily Davis to schedule roof inspection', 'to_do', 'medium', '2026-02-08', '10000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000004'),
  ('40000000-0000-0000-0000-000000000005', 'Prepare estimate', 'Create detailed estimate for gutter installation', 'in_progress', 'low', '2026-02-12', '10000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000005'),
  ('40000000-0000-0000-0000-000000000006', 'Initial contact call', 'Make first contact with Lisa Wilson regarding her inquiry', 'to_do', 'low', '2026-02-02', '10000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000006'),
  ('40000000-0000-0000-0000-000000000007', 'Order materials', 'Order shingles from ABC Roofing Supply', 'completed', 'high', '2026-02-10', NULL, '30000000-0000-0000-0000-000000000001'),
  ('40000000-0000-0000-0000-000000000008', 'Update customer on progress', 'Send progress photos to Robert Anderson', 'completed', 'medium', '2026-02-20', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001');

-- Insert mock invoices
INSERT INTO invoices (id, job_id, customer_id, invoice_number, status, issue_date, due_date, subtotal, tax_total, total_amount, balance_due) VALUES
  ('50000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'INV-2026-001', 'partial', '2026-02-15', '2026-03-15', 18500.00, 1517.50, 20017.50, 10000.00),
  ('50000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'INV-2026-002', 'sent', '2026-02-01', '2026-03-01', 4500.00, 369.00, 4869.00, 4869.00);

-- Insert mock estimates
INSERT INTO estimates (id, job_id, estimate_amount, estimate_status, expiration_date) VALUES
  ('60000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 18500.00, 'approved', '2026-03-01'),
  ('60000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 22000.00, 'approved', '2026-03-15'),
  ('60000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000003', 4500.00, 'approved', '2026-02-10'),
  ('60000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000004', 16000.00, 'pending', '2026-03-01');

-- Insert mock insurance claims
INSERT INTO insurance (id, job_id, adjuster_id, claim_status, carrier_name, policy_number, claim_number, date_of_loss, loss_type, deductible, acv_amount, rcv_amount, recoverable_depreciation, supplement_status) VALUES
  ('70000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000010', 'approved', 'Nationwide Insurance', 'POL-123456', 'CLM-789012', '2025-12-15', 'hail', 1000.00, 18000.00, 22000.00, 4000.00, 'pending');

-- Insert mock notes
INSERT INTO notes (id, entity_type, entity_id, body, note_type, created_by) VALUES
  ('80000000-0000-0000-0000-000000000001', 'job', '30000000-0000-0000-0000-000000000001', 'Customer very happy with progress. Requested additional gutter work for future.', 'general', '00000000-0000-0000-0000-000000000003'),
  ('80000000-0000-0000-0000-000000000002', 'contact', '10000000-0000-0000-0000-000000000002', 'Prefers email communication. Available weekdays after 5pm.', 'general', '00000000-0000-0000-0000-000000000002'),
  ('80000000-0000-0000-0000-000000000003', 'job', '30000000-0000-0000-0000-000000000002', 'Waiting on supplement approval from insurance. Follow up needed.', 'follow_up', '00000000-0000-0000-0000-000000000002'),
  ('80000000-0000-0000-0000-000000000004', 'contact', '10000000-0000-0000-0000-000000000001', 'Excellent customer - referred 3 neighbors already!', 'kudos', '00000000-0000-0000-0000-000000000002');

-- Insert mock payments
INSERT INTO payments (id, customer_id, amount, payment_date, payment_method, reference_number) VALUES
  ('90000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 10017.50, '2026-02-15', 'check', 'CHK-1001'),
  ('90000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', 4869.00, '2026-02-05', 'credit_card', 'CC-2001');

-- Insert mock inspections
INSERT INTO inspections (id, job_id, inspector_id, inspection_type, damage_assessment, photo_count, weather_conditions, scheduled_date, completed_date) VALUES
  ('a0000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'Initial Damage Assessment', 'Significant hail damage on north and west facing slopes. 60% of shingles affected.', 45, 'Clear, 72°F', '2026-01-15', '2026-01-15'),
  ('a0000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Insurance Adjuster Walk', 'Confirmed hail damage. Approved full replacement.', 32, 'Partly Cloudy, 68°F', '2026-01-20', '2026-01-20');

-- Insert mock material orders
INSERT INTO material_orders (id, job_id, supplier_id, po_number, order_date, expected_delivery, status, material_type, total_cost) VALUES
  ('b0000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000007', 'PO-2026-001', '2026-02-05', '2026-02-12', 'delivered', 'Architectural Shingles - Charcoal', 8500.00),
  ('b0000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000007', 'PO-2026-002', '2026-02-01', '2026-02-18', 'ordered', 'Premium Shingles - Driftwood', 9200.00);

-- Insert mock products
INSERT INTO products (id, name, description, sku, unit_price, unit_of_measure, category) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Architectural Shingle - Charcoal', 'Premium architectural shingles with 30-year warranty', 'SHGL-ARCH-CHAR', 95.00, 'bundle', 'Roofing'),
  ('c0000000-0000-0000-0000-000000000002', 'Architectural Shingle - Driftwood', 'Premium architectural shingles with 30-year warranty', 'SHGL-ARCH-DRFT', 95.00, 'bundle', 'Roofing'),
  ('c0000000-0000-0000-0000-000000000003', 'Standard 3-Tab Shingle - Black', 'Economy 3-tab shingles with 25-year warranty', 'SHGL-3TAB-BLK', 72.00, 'bundle', 'Roofing'),
  ('c0000000-0000-0000-0000-000000000004', 'Ice & Water Shield', 'Self-adhering waterproof underlayment', 'UNDR-ICEW-STD', 125.00, 'roll', 'Underlayment'),
  ('c0000000-0000-0000-0000-000000000005', 'Synthetic Underlayment', 'Lightweight synthetic roof underlayment', 'UNDR-SYNT-STD', 85.00, 'roll', 'Underlayment'),
  ('c0000000-0000-0000-0000-000000000006', 'Ridge Vent - 4ft', 'Continuous ridge ventilation system', 'VENT-RIDGE-4FT', 32.00, 'piece', 'Ventilation'),
  ('c0000000-0000-0000-0000-000000000007', 'Aluminum Gutter - 5"', 'Seamless aluminum gutter with baked enamel finish', 'GUTR-ALUM-5IN', 12.50, 'linear_foot', 'Gutters'),
  ('c0000000-0000-0000-0000-000000000008', 'Downspout - 3x4', 'Aluminum downspout', 'DOWN-ALUM-3X4', 8.75, 'linear_foot', 'Gutters');

-- Insert mock activity logs
INSERT INTO activity_logs (user_id, job_id, contact_id, action, details) VALUES
  ('00000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'job_updated', 'Changed job stage from "estimating" to "production"'),
  ('00000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'job_created', 'Created new insurance claim job'),
  ('00000000-0000-0000-0000-000000000002', NULL, '10000000-0000-0000-0000-000000000004', 'contact_created', 'New lead added from door knocking campaign'),
  ('00000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', NULL, 'invoice_sent', 'Sent invoice INV-2026-001 to customer'),
  ('00000000-0000-0000-0000-000000000002', NULL, '10000000-0000-0000-0000-000000000001', 'note_added', 'Added note about customer satisfaction');

-- Create a view for common job queries with related data
CREATE OR REPLACE VIEW v_jobs_with_details AS
SELECT 
  j.*,
  p.address_line_1 as property_address,
  p.city as property_city,
  p.state_iso as property_state,
  p.zip_code as property_zip,
  c.first_name || ' ' || c.last_name as customer_name,
  c.email as customer_email,
  c.phone as customer_phone,
  pr.first_name || ' ' || pr.last_name as assigned_to,
  COUNT(DISTINCT t.id) as task_count,
  COUNT(DISTINCT CASE WHEN t.task_status = 'completed' THEN t.id END) as completed_tasks,
  COUNT(DISTINCT i.id) as invoice_count,
  SUM(i.total_amount) as total_invoiced
FROM jobs j
LEFT JOIN properties p ON j.property_id = p.id
LEFT JOIN contacts c ON j.contact_id = c.id
LEFT JOIN profiles pr ON j.user_id = pr.id
LEFT JOIN tasks t ON j.id = t.job_id AND t.deleted_at IS NULL
LEFT JOIN invoices i ON j.id = i.job_id AND i.deleted_at IS NULL
WHERE j.deleted_at IS NULL
GROUP BY j.id, p.id, c.id, pr.id;
