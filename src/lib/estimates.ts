// This file defines the shape of an estimate object fetched from Firestore.

export interface Estimate {
  id: string;
  userId: string;
  clientId?: string;
  estimateNumber?: string;
  issueDate: string; // ISO date string
  expiryDate: string; // ISO date string
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined' | 'Expired';
  subtotal: number;
  taxAmount: number;
  taxLabel?: string;
  totalAmount: number;
  notes?: string;
  senderCompanyName: string;
  senderAddressLine1: string;
  senderCity: string;
  images?: string[];
  createdAt: any; // serverTimestamp
  updatedAt: any; // serverTimestamp
}
