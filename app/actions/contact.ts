"use server";

export type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactActionResult =
  | { success: true }
  | { success: false; error: string };

export async function submitContactForm(
  data: ContactFormData
): Promise<ContactActionResult> {
  // Phase 4 will write to Supabase and send a Resend notification.
  // For now, log the payload and return success.
  console.log("[contact form]", data);
  return { success: true };
}
