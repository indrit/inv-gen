import { z } from 'zod';

// Zod schema for client form validation
export const clientSchema = z.object({
  name: z.string().min(1, 'Client name is required.'),
  email: z.string().email('Invalid email address.').optional().or(z.literal('')),
  phone: z.string().optional(),
  billingAddressLine1: z.string().optional(),
  billingAddressLine2: z.string().optional(),
  billingCity: z.string().optional(),
  billingStateProvince: z.string().optional(),
  billingPostalCode: z.string().optional(),
  billingCountry: z.string().optional(),
  shippingAddressLine1: z.string().optional(),
  shippingAddressLine2: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingStateProvince: z.string().optional(),
  shippingPostalCode: z.string().optional(),
  shippingCountry: z.string().optional(),
});

// Type for the client form values
export type ClientValues = z.infer<typeof clientSchema>;

// Type for the client object fetched from Firestore
export type Client = ClientValues & {
  id: string;
  userId: string;
  createdAt: any; // serverTimestamp
  updatedAt: any; // serverTimestamp
};

    