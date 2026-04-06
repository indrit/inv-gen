'use client';

import { Label } from '@/components/ui/label';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';

interface InvoicePartiesProps {
  form: UseFormReturn<any>;
}

export function InvoiceParties({ form }: InvoicePartiesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-2">
        <Label className="text-gray-500 font-normal">Bill To</Label>
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Client Company Name&#10;Client Billing Address&#10;City, State, Zip"
                  className="min-h-[100px] border-gray-200 resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-500 font-normal">Ship To</Label>
        <FormField
          control={form.control}
          name="shipTo"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Shipping Destination Name&#10;Shipping Address&#10;City, State, Zip"
                  className="min-h-[100px] border-gray-200 resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
