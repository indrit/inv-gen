import { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';
import InvoicePage from './InvoicePage';

export const metadata: Metadata = {
  title: 'Free Invoice Generator - Create Professional Invoices Online',
  description: `Generate professional invoices for free with ${APP_NAME}. No registration required for your first downloads. Fast, simple, and customizable.`,
  keywords: 'Free online generator, free invoice generator, free invoice maker, professional invoice creator, billing software free, online invoicing tool, small business invoice, invoice template free, business documents generator',
};

export default function Home() {
  return <InvoicePage />;
}
