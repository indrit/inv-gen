'use client';

import { Save, Eye, Download, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import Link from 'next/link';

interface SharedActionsBarProps {
  form: UseFormReturn<any>;
  user: any;
  currencies: { code: string; symbol: string }[];
  handleSave: () => void;
  setIsPreviewOpen: (open: boolean) => void;
  handleDownload: () => void;
  type: 'invoice' | 'estimate';
}

export function SharedActionsBar({
  form,
  user,
  currencies,
  handleSave,
  setIsPreviewOpen,
  handleDownload,
  type,
}: SharedActionsBarProps) {
  const isInvoice = type === 'invoice';
  const backPath = isInvoice ? '/dashboard/invoices' : '/dashboard/estimates';

  return (
    <div className="flex flex-col md:flex-row justify-between items-center bg-white border-b sticky top-0 z-30 px-3 sm:px-6 py-2 sm:py-3 gap-3 shadow-md">
      <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
        {user && (
          <Link href={backPath}>
            <Button variant="ghost" size="sm" className="h-8 sm:h-9 px-2 text-gray-500 hover:text-primary whitespace-nowrap">
              <ChevronLeft className="h-4 w-4 mr-0.5" />
              <span className="hidden sm:inline text-xs font-semibold">Back</span>
            </Button>
          </Link>
        )}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:inline">Currency</span>
          <div className="w-[85px] sm:w-[100px]">
            <Select
              value={form.watch('currency')}
              onValueChange={(value) => form.setValue('currency', value)}
            >
              <SelectTrigger className="h-8 sm:h-9 border-gray-200 text-xs font-bold focus:ring-1 focus:ring-primary bg-gray-50/50">
                <SelectValue placeholder="USD" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code} className="text-xs">
                    {currency.code} ({currency.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-1.5 sm:gap-2 w-full md:w-auto">
        <a 
          href="mailto:indritzaganjori@gmail.com?subject=Help%20Request%20-%20Invoice%20Generator"
          className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 hover:text-primary transition-colors px-2 py-1 border border-gray-100 rounded-full bg-gray-50/50"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
          </span>
          <span className="hidden xs:inline">Need Help?</span>
        </a>
        <Button
          variant="outline"
          size="sm"
          className="h-8 sm:h-9 px-2 sm:px-4 border-gray-200 text-gray-600 hover:bg-gray-50 flex-1 sm:flex-none text-xs font-bold"
          onClick={() => setIsPreviewOpen(true)}
        >
          <Eye className="mr-1.5 h-3.5 w-3.5" />
          Preview
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 sm:h-9 px-2 sm:px-3 lg:px-4 border-gray-200 text-gray-600 hover:bg-gray-50 flex-1 sm:flex-none text-xs font-bold"
          onClick={handleSave}
        >
          <Save className="mr-1.5 h-3.5 w-3.5" />
          Save
        </Button>
        <Button
          size="sm"
          className="h-8 sm:h-9 px-3 sm:px-6 bg-[#00a67e] hover:bg-[#00a67e]/90 text-white shadow-lg shadow-[#00a67e]/10 flex-1 sm:flex-none text-xs font-black"
          onClick={handleDownload}
        >
          <Download className="mr-1.5 h-3.5 w-3.5" />
          <span className="hidden xs:inline">Download</span> PDF
        </Button>
      </div>
    </div>
  );
}
