import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()

    // Insert mock users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .insert([
        {
          email: 'admin@shieldcrm.com',
          full_name: 'Admin User',
          role: 'admin',
          is_active: true
        },
        {
          email: 'john.manager@shieldcrm.com',
          full_name: 'John Manager',
          role: 'manager',
          is_active: true
        },
        {
          email: 'sarah.agent@shieldcrm.com',
          full_name: 'Sarah Agent',
          role: 'agent',
          is_active: true
        }
      ])
      .select()

    if (usersError) throw usersError

    // Get user IDs for relationships
    const adminId = users?.[0]?.id
    const managerId = users?.[1]?.id
    const agentId = users?.[2]?.id

    // Insert mock companies
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .insert([
        {
          name: 'Acme Corporation',
          industry: 'Technology',
          website: 'https://acme.com',
          email: 'contact@acme.com',
          phone: '+1-555-0100',
          address: '123 Tech Street',
          city: 'San Francisco',
          state: 'CA',
          zip_code: '94105',
          country: 'USA',
          owner_id: managerId
        },
        {
          name: 'Global Dynamics',
          industry: 'Manufacturing',
          website: 'https://globaldynamics.com',
          email: 'info@globaldynamics.com',
          phone: '+1-555-0200',
          address: '456 Industrial Ave',
          city: 'Chicago',
          state: 'IL',
          zip_code: '60601',
          country: 'USA',
          owner_id: agentId
        },
        {
          name: 'Innovate Solutions',
          industry: 'Consulting',
          website: 'https://innovatesolutions.com',
          email: 'hello@innovatesolutions.com',
          phone: '+1-555-0300',
          address: '789 Business Blvd',
          city: 'New York',
          state: 'NY',
          zip_code: '10001',
          country: 'USA',
          owner_id: managerId
        }
      ])
      .select()

    if (companiesError) throw companiesError

    // Insert mock contacts
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .insert([
        {
          first_name: 'Michael',
          last_name: 'Johnson',
          email: 'mjohnson@acme.com',
          phone: '+1-555-1001',
          title: 'CTO',
          company_id: companies?.[0]?.id,
          owner_id: managerId
        },
        {
          first_name: 'Emily',
          last_name: 'Davis',
          email: 'edavis@acme.com',
          phone: '+1-555-1002',
          title: 'VP of Engineering',
          company_id: companies?.[0]?.id,
          owner_id: agentId
        },
        {
          first_name: 'Robert',
          last_name: 'Wilson',
          email: 'rwilson@globaldynamics.com',
          phone: '+1-555-2001',
          title: 'CEO',
          company_id: companies?.[1]?.id,
          owner_id: agentId
        },
        {
          first_name: 'Jennifer',
          last_name: 'Brown',
          email: 'jbrown@innovatesolutions.com',
          phone: '+1-555-3001',
          title: 'Managing Director',
          company_id: companies?.[2]?.id,
          owner_id: managerId
        }
      ])
      .select()

    if (contactsError) throw contactsError

    // Insert mock deals
    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .insert([
        {
          title: 'Enterprise Software License',
          description: 'Annual enterprise license for 500 users',
          value: 150000,
          stage: 'proposal',
          priority: 'high',
          probability: 75,
          expected_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          company_id: companies?.[0]?.id,
          contact_id: contacts?.[0]?.id,
          owner_id: managerId
        },
        {
          title: 'Manufacturing Equipment',
          description: 'New production line equipment',
          value: 500000,
          stage: 'negotiation',
          priority: 'urgent',
          probability: 85,
          expected_close_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          company_id: companies?.[1]?.id,
          contact_id: contacts?.[2]?.id,
          owner_id: agentId
        },
        {
          title: 'Consulting Services',
          description: '6-month digital transformation consulting',
          value: 250000,
          stage: 'qualified',
          priority: 'medium',
          probability: 60,
          expected_close_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          company_id: companies?.[2]?.id,
          contact_id: contacts?.[3]?.id,
          owner_id: managerId
        }
      ])
      .select()

    if (dealsError) throw dealsError

    // Insert mock tasks
    const { error: tasksError } = await supabase
      .from('tasks')
      .insert([
        {
          title: 'Follow up on proposal',
          description: 'Call Michael to discuss proposal terms',
          status: 'todo',
          priority: 'high',
          due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          deal_id: deals?.[0]?.id,
          contact_id: contacts?.[0]?.id,
          assigned_to: managerId,
          created_by: adminId
        },
        {
          title: 'Prepare contract',
          description: 'Draft final contract for equipment purchase',
          status: 'in_progress',
          priority: 'urgent',
          due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          deal_id: deals?.[1]?.id,
          assigned_to: agentId,
          created_by: managerId
        },
        {
          title: 'Schedule discovery call',
          description: 'Set up initial discovery meeting',
          status: 'completed',
          priority: 'medium',
          due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          completed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          deal_id: deals?.[2]?.id,
          contact_id: contacts?.[3]?.id,
          assigned_to: managerId,
          created_by: adminId
        }
      ])

    if (tasksError) throw tasksError

    // Insert mock notes
    const { error: notesError } = await supabase
      .from('notes')
      .insert([
        {
          content: 'Great initial meeting. Customer is very interested in our solution and timeline aligns well.',
          deal_id: deals?.[0]?.id,
          contact_id: contacts?.[0]?.id,
          company_id: companies?.[0]?.id,
          created_by: managerId
        },
        {
          content: 'Discussed pricing options. Will send revised proposal by end of week.',
          deal_id: deals?.[1]?.id,
          company_id: companies?.[1]?.id,
          created_by: agentId
        },
        {
          content: 'Contact requested additional case studies and references.',
          deal_id: deals?.[2]?.id,
          contact_id: contacts?.[3]?.id,
          created_by: managerId
        }
      ])

    if (notesError) throw notesError

    // Insert mock activities
    const { error: activitiesError } = await supabase
      .from('activities')
      .insert([
        {
          type: 'call',
          title: 'Discovery call with Michael Johnson',
          description: 'Discussed requirements and timeline',
          deal_id: deals?.[0]?.id,
          contact_id: contacts?.[0]?.id,
          company_id: companies?.[0]?.id,
          user_id: managerId
        },
        {
          type: 'email',
          title: 'Sent proposal to Robert Wilson',
          description: 'Sent detailed equipment proposal with pricing',
          deal_id: deals?.[1]?.id,
          contact_id: contacts?.[2]?.id,
          company_id: companies?.[1]?.id,
          user_id: agentId
        },
        {
          type: 'meeting',
          title: 'Initial consultation with Jennifer Brown',
          description: 'Introductory meeting to understand needs',
          deal_id: deals?.[2]?.id,
          contact_id: contacts?.[3]?.id,
          company_id: companies?.[2]?.id,
          user_id: managerId
        }
      ])

    if (activitiesError) throw activitiesError

    return NextResponse.json({
      success: true,
      message: 'Database seeded with mock data successfully',
      data: {
        users: users?.length || 0,
        companies: companies?.length || 0,
        contacts: contacts?.length || 0,
        deals: deals?.length || 0
      }
    })
  } catch (error: any) {
    console.error('[v0] Seed error:', error)
    return NextResponse.json(
      { error: 'Failed to seed database', details: error.message },
      { status: 500 }
    )
  }
}
