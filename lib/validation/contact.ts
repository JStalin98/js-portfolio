import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be 100 characters or fewer"),
  email: z.string().email("Please enter a valid email address").max(200, "Email must be 200 characters or fewer"),
  subject: z.string().trim().min(3, "Subject must be at least 3 characters").max(200, "Subject must be 200 characters or fewer"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000, "Message must be 5000 characters or fewer"),
  website_url: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
