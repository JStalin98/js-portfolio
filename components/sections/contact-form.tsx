"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { submitContact } from "@/app/actions/contact";
import { contactFormSchema, type ContactFormValues } from "@/lib/validation/contact";
import { IconSend } from "@tabler/icons-react";

const inputClass =
  "w-full bg-transparent border border-[rgba(139,146,165,0.3)] rounded-[8px] px-4 py-2.5 text-sm text-bone placeholder:text-ash focus:outline-none focus:border-plasma transition-colors duration-150 aria-[invalid=true]:border-[rgba(255,107,107,0.6)]";

const labelClass = "block text-[12px] text-ash mb-1.5";
const errorClass = "mt-1 text-[12px] text-[rgba(255,107,107,0.85)]";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) });

  async function onSubmit(data: ContactFormValues) {
    const result = await submitContact(data);
    if (result.success) {
      reset();
      toast.success("Thanks — your message is on its way.");
    } else if (result.error === "Please wait a moment before submitting again") {
      toast.warning(result.error);
    } else {
      toast.error("Something went wrong. Try again or email me directly.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Honeypot — hidden from real users, expected to be empty */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
      >
        <label aria-hidden="true">Leave this field empty</label>
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-hidden="true"
          {...register("website_url")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={inputClass}
            {...register("name")}
          />
          {errors.name && (
            <p id="contact-name-error" role="alert" className={errorClass}>
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={inputClass}
            {...register("email")}
          />
          {errors.email && (
            <p id="contact-email-error" role="alert" className={errorClass}>
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className={labelClass}>
          Subject
        </label>
        <input
          id="contact-subject"
          type="text"
          placeholder="What is this about?"
          aria-invalid={errors.subject ? "true" : undefined}
          aria-describedby={errors.subject ? "contact-subject-error" : undefined}
          className={inputClass}
          {...register("subject")}
        />
        {errors.subject && (
          <p id="contact-subject-error" role="alert" className={errorClass}>
            {errors.subject.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          placeholder="Tell me about your project or opportunity…"
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={`${inputClass} resize-none`}
          {...register("message")}
        />
        {errors.message && (
          <p id="contact-message-error" role="alert" className={errorClass}>
            {errors.message.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={isSubmitting}
        className="w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-plasma focus-visible:outline-offset-2"
      >
        <IconSend size={15} stroke={1.5} />
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
