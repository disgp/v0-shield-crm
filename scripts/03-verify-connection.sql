-- ShieldCRM Database Verification Script
-- Run this to verify your database schema and data

-- Check if all tables exist
SELECT 
  'Table Count' as check_type,
  COUNT(*) as count,
  'Should be 14' as expected
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE';

-- List all tables
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check data counts
SELECT 'profiles' as table_name, COUNT(*) as record_count FROM profiles
UNION ALL
SELECT 'contacts', COUNT(*) FROM contacts
UNION ALL
SELECT 'properties', COUNT(*) FROM properties
UNION ALL
SELECT 'jobs', COUNT(*) FROM jobs
UNION ALL
SELECT 'tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'invoices', COUNT(*) FROM invoices
UNION ALL
SELECT 'estimates', COUNT(*) FROM estimates
UNION ALL
SELECT 'insurance', COUNT(*) FROM insurance
UNION ALL
SELECT 'notes', COUNT(*) FROM notes
UNION ALL
SELECT 'payments', COUNT(*) FROM payments
UNION ALL
SELECT 'inspections', COUNT(*) FROM inspections
UNION ALL
SELECT 'material_orders', COUNT(*) FROM material_orders
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'activity_logs', COUNT(*) FROM activity_logs
ORDER BY table_name;

-- Verify relationships
SELECT 
  'Jobs with Properties' as relationship,
  COUNT(*) as count
FROM jobs j
INNER JOIN properties p ON j.property_id = p.id;

SELECT 
  'Jobs with Contacts' as relationship,
  COUNT(*) as count
FROM jobs j
INNER JOIN contacts c ON j.contact_id = c.id;

SELECT 
  'Tasks linked to Jobs' as relationship,
  COUNT(*) as count
FROM tasks t
INNER JOIN jobs j ON t.job_id = j.id;

-- Sample data query
SELECT 
  j.name as job_name,
  j.stage,
  p.address_line_1,
  c.first_name || ' ' || c.last_name as customer_name,
  pr.first_name || ' ' || pr.last_name as assigned_to
FROM jobs j
LEFT JOIN properties p ON j.property_id = p.id
LEFT JOIN contacts c ON j.contact_id = c.id
LEFT JOIN profiles pr ON j.user_id = pr.id
WHERE j.deleted_at IS NULL
ORDER BY j.created_at DESC
LIMIT 10;
