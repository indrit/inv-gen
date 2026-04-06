'use client';

import { Trash2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FormField } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface InvoiceTableProps {
  form: UseFormReturn<any>;
  fields: any[];
  append: (value: any) => void;
  remove: (index: number) => void;
  watchedLineItems: any[];
  currentCurrency: { code: string; symbol: string };
}

export function InvoiceTable({
  form,
  fields,
  append,
  remove,
  watchedLineItems,
  currentCurrency,
}: InvoiceTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md overflow-hidden border border-gray-200">
        <Table>
          <TableHeader className="bg-[#1a2b4b]">
            <TableRow className="hover:bg-[#1a2b4b] border-0">
              <TableHead className="text-white font-medium py-3">Item</TableHead>
              <TableHead className="text-white font-medium py-3 text-right">Quantity</TableHead>
              <TableHead className="text-white font-medium py-3 text-right">Rate</TableHead>
              <TableHead className="text-white font-medium py-3 text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id} className="border-gray-100">
                <TableCell className="py-4">
                  <FormField
                    control={form.control}
                    name={`lineItems.${index}.description`}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Item description (e.g. Consulting)"
                        className="border-gray-200 h-10"
                      />
                    )}
                  />
                </TableCell>
                <TableCell className="py-4 w-24">
                  <FormField
                    control={form.control}
                    name={`lineItems.${index}.quantity`}
                    render={({ field }) => (
                      <Input
                        type="number"
                        {...field}
                        className="border-gray-200 h-10 text-right"
                      />
                    )}
                  />
                </TableCell>
                <TableCell className="py-4 w-32">
                  <FormField
                    control={form.control}
                    name={`lineItems.${index}.rate`}
                    render={({ field }) => (
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                          {currentCurrency.symbol}
                        </span>
                        <Input
                          type="number"
                          {...field}
                          placeholder="0.00"
                          className="border-gray-200 h-10 pl-7 text-right"
                        />
                      </div>
                    )}
                  />
                </TableCell>
                <TableCell className="py-4 text-right font-medium w-32">
                  {currentCurrency.symbol}
                  {(
                    (watchedLineItems[index]?.quantity || 0) * (watchedLineItems[index]?.rate || 0)
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell className="py-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length <= 1}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="text-[#00a67e] border-[#00a67e] hover:bg-[#00a67e]/10"
        onClick={() => append({ description: '', quantity: 1, rate: 0 })}
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Line Item
      </Button>
    </div>
  );
}
