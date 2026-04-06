'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface SharedSummaryProps {
  form: UseFormReturn<any>;
  subtotal: number;
  tax: number;
  total: number;
  balanceDue?: number;
  currentCurrency: { code: string; symbol: string };
  showDiscount?: boolean;
  setShowDiscount?: (show: boolean) => void;
  showShipping?: boolean;
  setShowShipping?: (show: boolean) => void;
  type: 'invoice' | 'estimate';
}

export function SharedSummary({
  form,
  subtotal,
  tax,
  total,
  balanceDue,
  currentCurrency,
  showDiscount = false,
  setShowDiscount,
  showShipping = false,
  setShowShipping,
  type,
}: SharedSummaryProps) {
  const isInvoice = type === 'invoice';

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-12 pt-12 border-t mt-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-gray-500 font-normal uppercase tracking-wider text-xs">Notes</Label>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Notes - any relevant information not already covered"
                    className="min-h-[100px] border-gray-200 resize-none text-sm"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-500 font-normal uppercase tracking-wider text-xs">Terms & Conditions</Label>
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Terms and conditions - late fees, payment methods, delivery schedule"
                    className="min-h-[100px] border-gray-200 resize-none text-sm"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4 bg-gray-50/50 p-6 rounded-lg border border-gray-100 h-fit">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium">
            {currentCurrency.symbol}
            {subtotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="flex justify-between items-center gap-4">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="taxLabel"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className="h-8 border-none bg-transparent p-0 text-gray-500 text-sm focus-visible:ring-0 hover:bg-gray-100 px-1 rounded transition-colors"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="taxRate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        {...field}
                        className="h-9 w-16 text-right border-gray-200 pr-5 text-sm"
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">%</span>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {showDiscount && setShowDiscount && (
          <div className="flex justify-between items-center gap-4">
            <span className="text-gray-500 text-sm">Discount</span>
            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                          {currentCurrency.symbol}
                        </span>
                        <Input
                          type="number"
                          {...field}
                          className="h-9 w-24 text-right border-gray-200 pl-6 text-sm"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-red-600"
                onClick={() => {
                  setShowDiscount(false);
                  form.setValue('discount', 0);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {showShipping && setShowShipping && (
          <div className="flex justify-between items-center gap-4">
            <span className="text-gray-500 text-sm">Shipping</span>
            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="shipping"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                          {currentCurrency.symbol}
                        </span>
                        <Input
                          type="number"
                          {...field}
                          className="h-9 w-24 text-right border-gray-200 pl-6 text-sm"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-red-600"
                onClick={() => {
                  setShowShipping(false);
                  form.setValue('shipping', 0);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {setShowDiscount && setShowShipping && (
          <div className="flex justify-start gap-4 py-1">
            {!showDiscount && (
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-[#00a67e] text-xs font-medium decoration-[#00a67e]/30"
                onClick={() => setShowDiscount(true)}
              >
                + Discount
              </Button>
            )}
            {!showShipping && (
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-[#00a67e] text-xs font-medium decoration-[#00a67e]/30"
                onClick={() => setShowShipping(true)}
              >
                + Shipping
              </Button>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <span className="text-gray-900 font-semibold text-base">Total</span>
          <span className="font-bold text-lg">
            {currentCurrency.symbol}
            {total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        {isInvoice && balanceDue !== undefined && (
          <>
            <div className="grid grid-cols-[100px_1fr] items-center gap-4 pt-2">
              <Label className="text-right text-gray-500 font-normal text-xs uppercase tracking-tight">Amount Paid</Label>
              <FormField
                control={form.control}
                name="amountPaid"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                          {currentCurrency.symbol}
                        </span>
                        <Input
                          type="number"
                          {...field}
                          className="h-9 border-gray-200 pl-6 text-right text-sm"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between items-center pt-4 border-t-2 border-primary/20">
              <span className="text-primary font-bold text-base">Balance Due</span>
              <span className="font-extrabold text-xl text-primary">
                {currentCurrency.symbol}
                {balanceDue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
