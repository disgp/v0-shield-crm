import { createClient } from '@/lib/supabase/client'

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('[v0] Error signing out:', error)
    throw error
  }
}

export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('[v0] Error getting user:', error)
    return null
  }
  
  return user
}
