'use client';

import { Save, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface InvoiceActionsBarProps {
  form: UseFormReturn<any>;
  user: any;
  currencies: { code: string; symbol: string }[];
  handleSave: () => void;
  setIsPreviewOpen: (open: boolean) => void;
  handleDownload: () => void;
}

export function InvoiceActionsBar({
  form,
  user,
  currencies,
  handleSave,
  setIsPreviewOpen,
  handleDownload,
}: InvoiceActionsBarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 border rounded-lg shadow-sm">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Label className="text-gray-500 font-normal text-sm whitespace-nowrap">Currency:</Label>
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-gray-200 h-9 w-[100px] text-sm">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currencies.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-gray-500 font-normal text-sm whitespace-nowrap">Status:</Label>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-gray-200 h-9 w-[120px] text-sm">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Sent">Sent</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {user && (
          <Button
            type="button"
            onClick={handleSave}
            variant="outline"
            className="h-9 text-sm font-medium border-gray-200"
          >
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsPreviewOpen(true)}
          className="h-9 text-sm font-medium border-gray-200"
        >
          <Eye className="mr-2 h-4 w-4" /> Preview
        </Button>
        <Button
          type="button"
          onClick={handleDownload}
          className="flex-1 sm:flex-none bg-[#00a67e] hover:bg-[#00a67e]/90 h-9 text-sm font-medium"
        >
          <Download className="mr-2 h-4 w-4" /> Download
        </Button>
      </div>
    </div>
  );
}
