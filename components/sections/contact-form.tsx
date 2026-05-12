"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { submitContactForm } from "@/app/actions/contact";
import { IconSend, IconCheck } from "@tabler/icons-react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(4, "Subject must be at least 4 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type FormData = z.infer<typeof schema>;

const inputClass =
  "w-full bg-transparent border border-[rgba(139,146,165,0.3)] rounded-[8px] px-4 py-2.5 text-sm text-bone placeholder:text-ash focus:outline-none focus:border-plasma transition-colors duration-150";

const labelClass = "block text-[12px] text-ash mb-1.5";
const errorClass = "mt-1 text-[12px] text-[#ff6b6b]";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setServerError(null);
    const result = await submitContactForm(data);
    if (result.success) {
      setSent(true);
      reset();
    } else {
      setServerError(result.error);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-3 py-10">
        <span className="flex items-center gap-2 text-plasma font-mono text-sm">
          <IconCheck size={18} stroke={1.5} />
          Message sent
        </span>
        <p className="text-[13px] text-ash leading-[1.7]">
          Thanks for reaching out. I&apos;ll get back to you as soon as possible.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-2 text-[13px] text-ash hover:text-bone underline underline-offset-2 transition-colors duration-150"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
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
            className={inputClass}
            {...register("name")}
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
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
            className={inputClass}
            {...register("email")}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
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
          className={inputClass}
          {...register("subject")}
        />
        {errors.subject && (
          <p className={errorClass}>{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          placeholder="Tell me about your project or opportunity..."
          className={`${inputClass} resize-none`}
          {...register("message")}
        />
        {errors.message && (
          <p className={errorClass}>{errors.message.message}</p>
        )}
      </div>

      {serverError && <p className={errorClass}>{serverError}</p>}

      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={isSubmitting}
        className="w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <IconSend size={15} stroke={1.5} />
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
