'use server'

import { revalidatePath } from 'next/cache'
import { getAdminStatus } from '@/lib/auth/get-admin-status'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  personalInfoSchema,
  aboutSchema,
  type PersonalInfoInput,
  type AboutInput,
} from '@/lib/validation/admin'

export type AdminActionResult =
  | { success: true }
  | { success: false; error: string }

export async function updatePersonalInfo(
  values: PersonalInfoInput
): Promise<AdminActionResult> {
  const { isAdmin } = await getAdminStatus()
  if (!isAdmin) {
    return { success: false, error: 'Unauthorized' }
  }

  const parsed = personalInfoSchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid data' }
  }

  const { data } = parsed

  const db = createAdminClient()

  // Singleton table — fetch the row ID first, then update it.
  const { data: existing, error: fetchError } = await db
    .from('personal_info')
    .select('id')
    .single()

  if (fetchError || !existing) {
    return { success: false, error: 'Could not locate personal info record.' }
  }

  const { error } = await db
    .from('personal_info')
    .update({
      full_name: data.full_name,
      headline: data.headline,
      tagline: data.tagline,
      email: data.email,
      location: data.location || null,
      linkedin_url: data.linkedin_url || null,
      github_url: data.github_url || null,
      availability_status: data.availability_status || null,
      hero_metrics: data.hero_metrics,
      updated_at: new Date().toISOString(),
    })
    .eq('id', existing.id)

  if (error) {
    console.error('[updatePersonalInfo] DB error:', error)
    return { success: false, error: 'Failed to save. Please try again.' }
  }

  revalidatePath('/')
  return { success: true }
}

export async function updateAbout(values: AboutInput): Promise<AdminActionResult> {
  const { isAdmin } = await getAdminStatus()
  if (!isAdmin) {
    return { success: false, error: 'Unauthorized' }
  }

  const parsed = aboutSchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid data' }
  }

  const { data } = parsed

  const db = createAdminClient()

  const { data: existing, error: fetchError } = await db
    .from('about')
    .select('id')
    .single()

  if (fetchError || !existing) {
    return { success: false, error: 'Could not locate about record.' }
  }

  const { error } = await db
    .from('about')
    .update({
      content: data.content,
      quick_facts: data.quick_facts,
    })
    .eq('id', existing.id)

  if (error) {
    console.error('[updateAbout] DB error:', error)
    return { success: false, error: 'Failed to save. Please try again.' }
  }

  revalidatePath('/')
  return { success: true }
}
