"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { contactFormSchema, type ContactFormValues } from "@/lib/validation/contact";

export type ContactActionResult =
  | { success: true }
  | { success: false; error: string };

// Simple in-memory rate limit: IP → timestamp of last submission
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 30_000;

export async function submitContact(
  values: ContactFormValues
): Promise<ContactActionResult> {
  // 1. Parse and validate
  const parsed = contactFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" };
  }
  const { name, email, subject, message, website_url } = parsed.data;

  // 2. Honeypot — silently succeed to fool bots
  if (website_url && website_url.length > 0) {
    return { success: true };
  }

  // 3. Rate limit by IP
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  const realIp = headerStore.get("x-real-ip");
  const ip = (forwarded ? forwarded.split(",")[0].trim() : realIp) ?? "unknown";

  const lastSubmit = rateLimitMap.get(ip);
  const now = Date.now();
  if (lastSubmit && now - lastSubmit < RATE_LIMIT_MS) {
    return { success: false, error: "Please wait a moment before submitting again" };
  }
  rateLimitMap.set(ip, now);

  // 4. Insert into Supabase
  const { error: dbError } = await createAdminClient()
    .from("contact_messages")
    .insert({ name, email, subject, message, is_read: false });

  if (dbError) {
    console.error("[contact] DB insert failed:", dbError);
    return {
      success: false,
      error: "Could not send your message. Please try again or email directly.",
    };
  }

  // 5. Send notification email via Resend
  const resend = new Resend(process.env.RESEND_API_KEY);
  const truncatedSubject = subject.length > 80 ? subject.slice(0, 80) : subject;
  const timestamp = new Date().toISOString();
  const messageHtml = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:monospace,monospace;color:#111111;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:40px auto;border:1px solid #dddddd;border-collapse:collapse;">
    <tr>
      <td style="padding:32px 40px;border-bottom:1px solid #eeeeee;">
        <p style="margin:0;font-size:11px;letter-spacing:0.08em;color:#888888;text-transform:uppercase;">New contact message</p>
        <p style="margin:8px 0 0;font-size:18px;font-weight:600;color:#111111;">JStalin. portfolio</p>
      </td>
    </tr>
    <tr>
      <td style="padding:32px 40px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:0 0 16px;width:100px;vertical-align:top;font-size:12px;color:#888888;font-family:monospace,monospace;">Name</td>
            <td style="padding:0 0 16px;font-size:14px;color:#111111;font-family:monospace,monospace;">${name}</td>
          </tr>
          <tr>
            <td style="padding:0 0 16px;vertical-align:top;font-size:12px;color:#888888;font-family:monospace,monospace;">Email</td>
            <td style="padding:0 0 16px;font-size:14px;color:#111111;font-family:monospace,monospace;"><a href="mailto:${email}" style="color:#111111;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding:0 0 24px;vertical-align:top;font-size:12px;color:#888888;font-family:monospace,monospace;">Subject</td>
            <td style="padding:0 0 24px;font-size:14px;color:#111111;font-family:monospace,monospace;">${subject}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding:0 0 8px;font-size:12px;color:#888888;font-family:monospace,monospace;">Message</td>
          </tr>
          <tr>
            <td colspan="2" style="padding:0 0 32px;font-size:14px;color:#111111;font-family:monospace,monospace;line-height:1.7;border-left:2px solid #dddddd;padding-left:16px;">${messageHtml}</td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 40px;border-top:1px solid #eeeeee;font-size:11px;color:#aaaaaa;font-family:monospace,monospace;">
        Sent from js-portfolio-silk.vercel.app at ${timestamp}
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `New contact message — JStalin. portfolio\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n\n---\nSent from js-portfolio-silk.vercel.app at ${timestamp}`;

  const { error: resendError } = await resend.emails.send({
    from: "JStalin portfolio <onboarding@resend.dev>",
    to: process.env.ADMIN_EMAIL!,
    replyTo: email,
    subject: `New contact: ${truncatedSubject}`,
    html,
    text,
  });

  if (resendError) {
    // DB insert succeeded — message is not lost. Log and return success.
    console.error("[contact] Resend send failed:", resendError);
  }

  return { success: true };
}
