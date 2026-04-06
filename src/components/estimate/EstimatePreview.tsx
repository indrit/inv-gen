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

interface EstimatePreviewProps {
  data: {
    documentTitle: string;
    from: string;
    to: string;
    shipTo?: string;
    estimateNumber?: string;
    date: Date;
    expiryDate: Date;
    lineItems: LineItem[];
    taxLabel?: string;
    taxRate?: number;
    notes?: string;
    currency?: string;
    images?: string[];
  };
  logo?: string | null;
  isPremium?: boolean;
  watermark?: boolean;
}

export function EstimatePreview({ data, logo, isPremium = false, watermark = false }: EstimatePreviewProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

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
  const total = subtotal + tax;

  return (
    <div className="bg-white p-12 text-black font-sans max-w-[850px] mx-auto border shadow-sm relative overflow-hidden" id="estimate-pdf-content">
      {watermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[100] opacity-[0.15] rotate-[-45deg]">
          <div className="text-[100px] font-bold whitespace-nowrap border-[15px] border-black p-10 rounded-xl uppercase tracking-widest">
            {APP_NAME}
          </div>
        </div>
      )}
      {/* Header Section */}
      <div className="flex justify-between items-start mb-12">
        <div className="space-y-6 w-1/2">
          {logo ? (
            <div className="relative w-48 h-24">
              <img src={logo} alt="Logo" className="object-contain w-full h-full" crossOrigin="anonymous" />
            </div>
          ) : (
            <div className="w-48 h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-300 text-xs">
              LOGO
            </div>
          )}
          <div className="whitespace-pre-wrap text-lg font-medium">
            {data.from}
          </div>
        </div>
        <div className="text-right w-1/2">
          <h1 className="text-5xl font-normal uppercase tracking-tight mb-4">{data.documentTitle || 'ESTIMATE'}</h1>
          <div className="flex items-center justify-end gap-2 text-lg">
            <span className="text-gray-400">#</span>
            <span className="font-medium">{data.estimateNumber}</span>
          </div>
        </div>
      </div>

      {/* Bill To / Ship To Section */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <h2 className="text-sm font-normal text-gray-500 mb-2">Bill To</h2>
          <div className="whitespace-pre-wrap text-base">
            {data.to}
          </div>
        </div>
        <div>
          {data.shipTo && (
            <>
              <h2 className="text-sm font-normal text-gray-500 mb-2">Ship To</h2>
              <div className="whitespace-pre-wrap text-base">
                {data.shipTo}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Metadata Section */}
      <div className="flex justify-end mb-12">
        <div className="w-full max-w-[300px] space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <span className="text-right text-gray-500">Date</span>
            <span className="text-right">{isMounted && format(data.date, 'yyyy-MM-dd')}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <span className="text-right text-gray-500">Expiry Date</span>
            <span className="text-right">{isMounted && format(data.expiryDate, 'yyyy-MM-dd')}</span>
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="rounded-md overflow-hidden border border-gray-100 mb-12">
        <Table>
          <TableHeader className="bg-[#1a2b4b]">
            <TableRow className="hover:bg-[#1a2b4b] border-0">
              <TableHead className="text-white font-medium py-4">Item</TableHead>
              <TableHead className="text-white font-medium py-4 text-right">Quantity</TableHead>
              <TableHead className="text-white font-medium py-4 text-right">Rate</TableHead>
              <TableHead className="text-white font-medium py-4 text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.lineItems.map((item, index) => (
              <TableRow key={index} className="border-gray-50">
                <TableCell className="py-6 text-base">{item.description}</TableCell>
                <TableCell className="text-right py-6 text-base">{item.quantity}</TableCell>
                <TableCell className="text-right py-6 text-base">
                  {currentCurrency.symbol}{item.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right py-6 font-medium text-base">
                  {currentCurrency.symbol}{(item.quantity * item.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-[1fr_300px] gap-12 mb-12">
        <div className="space-y-8">
          {data.notes && (
            <div>
              <h2 className="text-sm font-normal text-gray-500 mb-2">Notes & Terms</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{data.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>{currentCurrency.symbol}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          {data.taxRate !== undefined && data.taxRate > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{data.taxLabel || 'Tax'} ({data.taxRate}%)</span>
              <span>{currentCurrency.symbol}{tax.toFixed(2)}</span>
            </div>
          )}
          <Separator className="my-2" />
          <div className="flex justify-between font-bold text-xl pt-1">
            <span>Total</span>
            <span>{currentCurrency.symbol}{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Images Display Section */}
      {data.images && data.images.length > 0 && (
        <div className="mt-12 pt-12 border-t border-gray-100">
          <h2 className="text-sm font-normal text-gray-500 mb-4">Attachments / Pictures</h2>
          <div className="grid grid-cols-2 gap-4">
            {data.images.map((img, idx) => (
              <div key={idx} className="border rounded-md overflow-hidden bg-gray-50">
                <img src={img} alt={`Attachment ${idx + 1}`} className="w-full h-auto object-contain" crossOrigin="anonymous" />
              </div>
            ))}
          </div>
        </div>
      )}

      {!isPremium && (
        <div className="mt-24 text-center text-xs text-gray-300">
          Generated by {APP_NAME}
        </div>
      )}
    </div>
  );
}
