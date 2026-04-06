import * as z from 'zod';

export const lineItemSchema = z.object({
  description: z.string().min(1, 'Description is required.'),
  quantity: z.coerce.number().min(0, 'Quantity must be positive.'),
  rate: z.coerce.number().min(0, 'Rate must be positive.'),
});

export const emailFormSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export type EmailFormValues = z.infer<typeof emailFormSchema>;
