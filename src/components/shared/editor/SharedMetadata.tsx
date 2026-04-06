'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FormField, FormItem, FormControl, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

interface SharedMetadataProps {
  form: UseFormReturn<any>;
  isMounted: boolean;
  type: 'invoice' | 'estimate';
}

export function SharedMetadata({ form, isMounted, type }: SharedMetadataProps) {
  const isInvoice = type === 'invoice';
  
  return (
    <div className="flex flex-col md:flex-row justify-end space-y-4 md:space-y-0 md:space-x-8 pb-8 border-b">
      <div className="space-y-4 w-full md:w-auto min-w-[240px]">
        {/* Issue Date */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
          <FormLabel className="text-right text-gray-500 font-normal">Date</FormLabel>
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal border-gray-200 h-10",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value && isMounted ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
        </div>

        {/* Due/Expiry Date */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
          <FormLabel className="text-right text-gray-500 font-normal">
            {isInvoice ? 'Due Date' : 'Expiry Date'}
          </FormLabel>
          <FormField
            control={form.control}
            name={isInvoice ? 'dueDate' : 'expiryDate'}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal border-gray-200 h-10",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value && isMounted ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4 w-full md:w-auto min-w-[240px]">
        {isInvoice ? (
          <>
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
              <FormLabel className="text-right text-gray-500 font-normal">Terms</FormLabel>
              <FormField
                control={form.control}
                name="paymentTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Net 30" {...field} className="h-10 border-gray-200" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
              <FormLabel className="text-right text-gray-500 font-normal">PO #</FormLabel>
              <FormField
                control={form.control}
                name="poNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="PO-123" {...field} className="h-10 border-gray-200" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </>
        ) : (
          <div className="grid grid-cols-[100px_1fr] items-center gap-4">
             <FormLabel className="text-right text-gray-500 font-normal">Status</FormLabel>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Draft" {...field} className="h-10 border-gray-200" readOnly />
                    </FormControl>
                  </FormItem>
                )}
              />
          </div>
        )}
      </div>
    </div>
  );
}
