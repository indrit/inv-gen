import * as z from 'zod';
import { lineItemSchema } from './shared';

export const estimateSchema = z.object({
  documentTitle: z.string().min(1, 'Title is required.'),
  from: z.string().min(1, 'Sender information is required.'),
  to: z.string().min(1, 'Client information is required.'),
  shipTo: z.string().optional(),
  clientId: z.string().optional(),
  estimateNumber: z.string().optional().default(''),
  date: z.date(),
  expiryDate: z.date(),
  lineItems: z.array(lineItemSchema).min(1, 'At least one line item is required.'),
  taxLabel: z.string().optional(),
  taxRate: z.coerce.number().min(0).max(100).optional().default(0),
  discount: z.coerce.number().min(0).optional().default(0),
  shipping: z.coerce.number().min(0).optional().default(0),
  amountPaid: z.coerce.number().min(0).optional().default(0),
  notes: z.string().optional(),
  terms: z.string().optional(),
  currency: z.string().optional().default('USD'),
  status: z.enum(['Draft', 'Sent', 'Accepted', 'Declined', 'Expired']).default('Draft'),
  logo: z.string().optional(),
  images: z.array(z.string()).optional().default([]),
});

export type EstimateFormValues = z.infer<typeof estimateSchema>;
