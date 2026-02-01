import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (testError && testError.code === '42P01') {
      // Table doesn't exist
      return NextResponse.json({
        success: false,
        connected: true,
        tablesExist: false,
        message: 'Connected to Supabase but tables do not exist. Please run setup.',
        error: testError.message
      })
    }

    if (testError) {
      return NextResponse.json({
        success: false,
        connected: false,
        message: 'Failed to connect to Supabase',
        error: testError.message
      }, { status: 500 })
    }

    // Get counts from all tables
    const tables = [
      'users',
      'companies',
      'contacts',
      'deals',
      'tasks',
      'notes',
      'proposals',
      'activities'
    ]

    const counts: Record<string, number> = {}

    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })

      if (!error) {
        counts[table] = count || 0
      } else {
        counts[table] = 0
      }
    }

    // Get sample data
    const { data: users } = await supabase
      .from('users')
      .select('*')
      .limit(5)

    const { data: companies } = await supabase
      .from('companies')
      .select('*')
      .limit(5)

    const { data: deals } = await supabase
      .from('deals')
      .select('*')
      .limit(5)

    return NextResponse.json({
      success: true,
      connected: true,
      tablesExist: true,
      message: 'Successfully connected to Supabase',
      counts,
      samples: {
        users: users || [],
        companies: companies || [],
        deals: deals || []
      }
    })
  } catch (error: any) {
    console.error('[v0] Verification error:', error)
    return NextResponse.json({
      success: false,
      connected: false,
      message: 'Failed to verify connection',
      error: error.message
    }, { status: 500 })
  }
}
