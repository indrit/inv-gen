// This file defines the shape of an invoice object fetched from Firestore.

export interface Invoice {
  id: string;
  userId: string;
  clientId?: string;
  invoiceNumber?: string;
  issueDate: string; // ISO date string
  dueDate: string; // ISO date string
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
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
