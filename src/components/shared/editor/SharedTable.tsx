'use client';

import { Trash2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UseFormReturn } from 'react-hook-form';

interface SharedTableProps {
  form: UseFormReturn<any>;
  fields: any[];
  append: (item: any) => void;
  remove: (index: number) => void;
  watchedLineItems: any[];
  currentCurrency: { code: string; symbol: string };
}

export function SharedTable({
  form,
  fields,
  append,
  remove,
  watchedLineItems,
  currentCurrency,
}: SharedTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50/30 shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <div className="min-w-[700px] md:min-w-full">
            <Table>
              <TableHeader className="bg-[#1a2b4b]">
                <TableRow className="hover:bg-[#1a2b4b] border-0">
                  <TableHead className="text-white font-black py-4 px-4 uppercase tracking-widest text-[10px]">Item & Description</TableHead>
                  <TableHead className="text-white font-black py-4 px-4 w-[100px] text-right uppercase tracking-widest text-[10px]">Qty</TableHead>
                  <TableHead className="text-white font-black py-4 px-4 w-[140px] text-right uppercase tracking-widest text-[10px]">Rate</TableHead>
                  <TableHead className="text-white font-black py-4 px-4 w-[140px] text-right uppercase tracking-widest text-[10px]">Amount</TableHead>
                  <TableHead className="text-white font-black py-4 px-4 w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id} className="group border-gray-100 bg-white hover:bg-gray-50/50 transition-colors">
                    <TableCell className="py-4 px-4 align-top">
                      <FormField
                        control={form.control}
                        name={`lineItems.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="Description of service or product..."
                                className="min-h-[40px] border-gray-200 resize-none py-2 text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="py-4 px-4 align-top">
                      <FormField
                        control={form.control}
                        name={`lineItems.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                step="any"
                                className="text-right h-10 border-gray-200 text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="py-4 px-4 align-top">
                      <FormField
                        control={form.control}
                        name={`lineItems.${index}.rate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-[10px]">
                                  {currentCurrency.symbol}
                                </span>
                                <Input
                                  type="number"
                                  min="0"
                                  step="any"
                                  className="text-right h-10 border-gray-200 pl-6 text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="py-4 px-4 align-top text-right">
                      <div className="h-10 flex items-center justify-end font-black text-sm text-gray-900 pr-2">
                        {currentCurrency.symbol}
                        {((watchedLineItems[index]?.quantity || 0) * (watchedLineItems[index]?.rate || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4 align-top">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        className="h-10 w-10 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ description: '', quantity: 1, rate: 0 })}
        className="w-full sm:w-auto h-10 border-dashed border-2 border-gray-200 text-gray-400 hover:text-primary hover:border-primary hover:bg-primary/5 font-bold rounded-xl transition-all"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add Line Item
      </Button>
    </div>
  );
}
