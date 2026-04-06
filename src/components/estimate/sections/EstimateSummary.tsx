'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { UseFormReturn } from 'react-hook-form';

interface EstimateSummaryProps {
  form: UseFormReturn<any>;
  subtotal: number;
  tax: number;
  total: number;
  currentCurrency: { code: string; symbol: string };
  children?: React.ReactNode; // For Attachments
}

export function EstimateSummary({
  form,
  subtotal,
  tax,
  total,
  currentCurrency,
  children,
}: EstimateSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-12">
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-500 font-normal">Notes / Terms</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional notes or payment terms."
                  className="min-h-[100px] border-gray-200 resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {children}
      </div>

      <div className="space-y-3 border-t md:border-t-0 pt-6 md:pt-0">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span>
            {currentCurrency.symbol}
            {subtotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <FormField
            control={form.control}
            name="taxLabel"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input {...field} className="h-8 border-gray-200 text-xs" />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex items-center gap-2 w-24">
            <FormField
              control={form.control}
              name="taxRate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      className="h-8 border-gray-200 text-right pr-6 text-xs"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <span className="text-gray-400 text-xs">%</span>
          </div>
          <span className="text-sm">
            {currentCurrency.symbol}
            {tax.toFixed(2)}
          </span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between font-bold text-xl pt-1">
          <span>Total</span>
          <span>
            {currentCurrency.symbol}
            {total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
