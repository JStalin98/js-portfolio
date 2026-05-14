'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type SignInResult =
  | { success: true }
  | { success: false; error: string }

export async function signIn(
  email: string,
  password: string
): Promise<SignInResult> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    // Never expose Supabase's raw error messages — always return a generic message.
    return { success: false, error: 'Invalid credentials' }
  }

  return { success: true }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
