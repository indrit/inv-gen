'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { APP_NAME } from '@/lib/constants';

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
}

interface SharedPreviewProps {
  data: {
    documentTitle: string;
    from: string;
    to: string;
    shipTo?: string;
    invoiceNumber?: string;
    estimateNumber?: string;
    date: Date;
    dueDate?: Date;
    expiryDate?: Date;
    paymentTerms?: string;
    poNumber?: string;
    lineItems: LineItem[];
    taxLabel?: string;
    taxRate?: number;
    discount?: number;
    shipping?: number;
    amountPaid?: number;
    notes?: string;
    terms?: string;
    currency?: string;
    images?: string[];
  };
  logo?: string | null;
  isPremium?: boolean;
  watermark?: boolean;
  type: 'invoice' | 'estimate';
}

export function SharedPreview({ data, logo, isPremium = false, watermark = false, type }: SharedPreviewProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const isInvoice = type === 'invoice';
  const docNumber = isInvoice ? data.invoiceNumber : data.estimateNumber;
  
  const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'CAD', symbol: 'CA$' },
    { code: 'AUD', symbol: 'A$' },
    { code: 'JPY', symbol: '¥' },
    { code: 'CNY', symbol: '¥' },
    { code: 'INR', symbol: '₹' },
  ];

  const currentCurrency = currencies.find(c => c.code === data.currency) || currencies[0];

  const subtotal = data.lineItems.reduce((acc, item) => acc + (item.quantity || 0) * (item.rate || 0), 0);
  const tax = subtotal * ((data.taxRate || 0) / 100);
  const total = subtotal + tax - (data.discount || 0) + (data.shipping || 0);
  const balanceDue = total - (data.amountPaid || 0);

  return (
    <div className="bg-white p-12 text-black font-sans max-w-[850px] mx-auto border shadow-sm relative overflow-hidden" id={`${type}-pdf-content`}>
      {watermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[100] opacity-[0.08] rotate-[-45deg]">
          <div className="text-[100px] font-bold whitespace-nowrap border-[15px] border-black p-10 rounded-xl uppercase tracking-widest">
            {APP_NAME}
          </div>
        </div>
      )}
      
      {/* Header Section */}
      <div className="flex justify-between items-start mb-16">
        <div className="space-y-6 w-1/2">
          {logo ? (
            <div className="relative w-48 h-24">
              <img src={logo} alt="Logo" className="object-contain w-full h-full" crossOrigin="anonymous" />
            </div>
          ) : (
            <div className="w-48 h-24 bg-gray-50 border-2 border-dashed border-gray-100 rounded flex items-center justify-center text-gray-300 text-xs tracking-widest font-bold">
              LOGO
            </div>
          )}
          <div className="whitespace-pre-wrap text-lg font-medium leading-relaxed">
            {data.from}
          </div>
        </div>
        <div className="text-right w-1/2">
          <h1 className="text-5xl font-light uppercase tracking-tight mb-4 text-gray-900">{data.documentTitle || defaultTitle}</h1>
          <div className="flex items-center justify-end gap-2 text-xl">
            <span className="text-gray-300">#</span>
            <span className="font-semibold">{docNumber || '---'}</span>
          </div>
        </div>
      </div>

      {/* Bill To / Ship To Section */}
      <div className="grid grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Bill To</h2>
          <div className="whitespace-pre-wrap text-base leading-relaxed">
            {data.to}
          </div>
        </div>
        <div>
          {data.shipTo && (
            <>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Ship To</h2>
              <div className="whitespace-pre-wrap text-base leading-relaxed">
                {data.shipTo}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Metadata Section */}
      <div className="flex justify-end mb-16">
        <div className="w-full max-w-[320px] space-y-2.5">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <span className="text-right text-gray-400 font-medium">Date</span>
            <span className="text-right font-medium">{isMounted && data.date ? format(data.date, 'MMMM d, yyyy') : '---'}</span>
          </div>
          
          {isInvoice ? (
            <>
              {data.paymentTerms && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <span className="text-right text-gray-400 font-medium">Payment Terms</span>
                  <span className="text-right font-medium">{data.paymentTerms}</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <span className="text-right text-gray-400 font-medium">Due Date</span>
                <span className="text-right font-bold">{isMounted && data.dueDate ? format(data.dueDate, 'MMMM d, yyyy') : '---'}</span>
              </div>
              {data.poNumber && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <span className="text-right text-gray-400 font-medium">PO Number</span>
                  <span className="text-right font-medium">{data.poNumber}</span>
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <span className="text-right text-gray-400 font-medium">Expiration Date</span>
              <span className="text-right font-bold">{isMounted && data.expiryDate ? format(data.expiryDate, 'MMMM d, yyyy') : '---'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Line Items Table */}
      <div className="rounded-xl overflow-hidden border border-gray-100 mb-16 shadow-sm">
        <Table>
          <TableHeader className="bg-gray-900 border-0">
            <TableRow className="hover:bg-gray-900 border-0">
              <TableHead className="text-white font-semibold py-5 px-6 uppercase tracking-wider text-xs">Item Description</TableHead>
              <TableHead className="text-white font-semibold py-5 px-6 text-right uppercase tracking-wider text-xs w-[120px]">Quantity</TableHead>
              <TableHead className="text-white font-semibold py-5 px-6 text-right uppercase tracking-wider text-xs w-[140px]">Rate</TableHead>
              <TableHead className="text-white font-semibold py-5 px-6 text-right uppercase tracking-wider text-xs w-[140px]">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.lineItems.map((item, index) => (
              <TableRow key={index} className="border-gray-50 last:border-0">
                <TableCell className="py-8 px-6 text-base font-medium text-gray-800">{item.description}</TableCell>
                <TableCell className="text-right py-8 px-6 text-base text-gray-600">{item.quantity}</TableCell>
                <TableCell className="text-right py-8 px-6 text-base text-gray-600">
                  {currentCurrency.symbol}{item.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right py-8 px-6 font-bold text-base text-gray-900">
                  {currentCurrency.symbol}{(item.quantity * item.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-[1fr_320px] gap-12 mb-16">
        <div className="space-y-12">
          {data.notes && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 underline decoration-gray-200 underline-offset-4">Notes</h2>
              <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{data.notes}</p>
            </div>
          )}
          {data.terms && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 underline decoration-gray-200 underline-offset-4">Terms & Conditions</h2>
              <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{data.terms}</p>
            </div>
          )}
        </div>

        <div className="space-y-4 bg-gray-50/50 p-6 rounded-xl border border-gray-100 h-fit">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-500">Subtotal</span>
            <span className="font-semibold">{currentCurrency.symbol}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          {data.taxRate !== undefined && data.taxRate > 0 && (
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-500">{data.taxLabel || 'Tax'} ({data.taxRate}%)</span>
              <span className="font-semibold">{currentCurrency.symbol}{tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          )}
          {data.discount !== undefined && data.discount > 0 && (
            <div className="flex justify-between text-sm text-red-600">
              <span className="font-medium">Discount</span>
              <span className="font-semibold">-{currentCurrency.symbol}{data.discount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          )}
          {data.shipping !== undefined && data.shipping > 0 && (
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-500">Shipping</span>
              <span className="font-semibold">{currentCurrency.symbol}{data.shipping.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-extrabold text-xl text-gray-900 leading-none">
              {currentCurrency.symbol}{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {isInvoice && data.amountPaid !== undefined && data.amountPaid > 0 && (
            <div className="flex justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
              <span className="font-medium">Amount Paid</span>
              <span className="font-semibold">{currentCurrency.symbol}{data.amountPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          )}

          {isInvoice && (
            <div className="flex justify-between items-center pt-4 border-t-2 border-gray-900">
              <span className="font-black uppercase tracking-tighter text-sm">Balance Due</span>
              <span className="font-black text-2xl text-gray-900 leading-none">
                {currentCurrency.symbol}{balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Images Display Section */}
      {data.images && data.images.length > 0 && (
        <div className="mt-16 pt-16 border-t border-gray-200">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Attachments & Pictures</h2>
          <div className="grid grid-cols-2 gap-8">
            {data.images.map((img, idx) => (
              <div key={idx} className="border-4 border-gray-50 rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-100">
                <img src={img} alt={`Attachment ${idx + 1}`} className="w-full h-auto object-contain" crossOrigin="anonymous" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Branding / Watermark */}
      {!isPremium && (
        <div className="mt-32 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-200 mb-1">Created with</p>
            <div className="text-xs font-black text-gray-300 opacity-50 tracking-wide uppercase">{APP_NAME}</div>
        </div>
      )}
    </div>
  );
}

const defaultTitle = 'DOCUMENT';
