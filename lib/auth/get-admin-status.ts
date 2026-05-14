import { createClient } from '@/lib/supabase/server'

export interface AdminStatus {
  isAdmin: boolean
  userEmail: string | null
}

/**
 * Single source of truth for admin status.
 * Used by Server Components and passed as initial props to AdminProvider.
 * Returns isAdmin: true only when a valid authenticated session exists.
 */
export async function getAdminStatus(): Promise<AdminStatus> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return { isAdmin: false, userEmail: null }
  }

  // Any authenticated user is the admin — single-user site.
  // Role 'authenticated' is assigned by Supabase to all signed-in users.
  const isAdmin = user.role === 'authenticated'

  return {
    isAdmin,
    userEmail: user.email ?? null,
  }
}
