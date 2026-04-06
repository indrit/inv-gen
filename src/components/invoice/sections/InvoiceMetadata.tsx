'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { UseFormReturn } from 'react-hook-form';

interface InvoiceMetadataProps {
  form: UseFormReturn<any>;
  isMounted: boolean;
}

export function InvoiceMetadata({ form, isMounted }: InvoiceMetadataProps) {
  return (
    <div className="flex justify-end">
      <div className="w-full max-w-xs space-y-3">
        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
          <Label className="text-right text-gray-500 font-normal">Date</Label>
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      ref={field.ref}
                      variant={'outline'}
                      className={cn(
                        'h-9 justify-start text-left font-normal border-gray-200',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {isMounted && field.value ? (
                        format(field.value, 'yyyy-MM-dd')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
          <Label className="text-right text-gray-500 font-normal">Payment Terms</Label>
          <FormField
            control={form.control}
            name="paymentTerms"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} className="h-9 border-gray-200" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
          <Label className="text-right text-gray-500 font-normal">Due Date</Label>
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      ref={field.ref}
                      variant={'outline'}
                      className={cn(
                        'h-9 justify-start text-left font-normal border-gray-200',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {isMounted && field.value ? (
                        format(field.value, 'yyyy-MM-dd')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
          <Label className="text-right text-gray-500 font-normal">PO Number</Label>
          <FormField
            control={form.control}
            name="poNumber"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} className="h-9 border-gray-200" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
