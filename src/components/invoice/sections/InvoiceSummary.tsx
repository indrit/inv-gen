'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface InvoiceSummaryProps {
  form: UseFormReturn<any>;
  subtotal: number;
  tax: number;
  total: number;
  balanceDue: number;
  currentCurrency: { code: string; symbol: string };
  showDiscount: boolean;
  setShowDiscount: (show: boolean) => void;
  showShipping: boolean;
  setShowShipping: (show: boolean) => void;
}

export function InvoiceSummary({
  form,
  subtotal,
  tax,
  total,
  balanceDue,
  currentCurrency,
  showDiscount,
  setShowDiscount,
  showShipping,
  setShowShipping,
}: InvoiceSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-12 pt-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-gray-500 font-normal">Notes</Label>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Notes - any relevant information not already covered"
                    className="min-h-[100px] border-gray-200 resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-500 font-normal">Terms</Label>
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Terms and conditions - late fees, payment methods, delivery schedule"
                    className="min-h-[100px] border-gray-200 resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span>
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
                      className="h-8 border-none bg-transparent p-0 text-gray-500 text-sm focus-visible:ring-0 hover:bg-gray-50 px-1"
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
                    <Input
                      type="number"
                      {...field}
                      className="h-9 w-16 text-right border-gray-200"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <span className="text-gray-400 text-sm">%</span>
          </div>
        </div>

        {showDiscount && (
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
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                          {currentCurrency.symbol}
                        </span>
                        <Input
                          type="number"
                          {...field}
                          className="h-9 w-24 text-right border-gray-200 pl-7"
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
                className="h-8 w-8 text-gray-400"
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

        {showShipping && (
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
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                          {currentCurrency.symbol}
                        </span>
                        <Input
                          type="number"
                          {...field}
                          className="h-9 w-24 text-right border-gray-200 pl-7"
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
                className="h-8 w-8 text-gray-400"
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

        <div className="flex justify-end gap-4">
          {!showDiscount && (
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-[#00a67e] text-sm font-normal"
              onClick={() => setShowDiscount(true)}
            >
              + Discount
            </Button>
          )}
          {!showShipping && (
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-[#00a67e] text-sm font-normal"
              onClick={() => setShowShipping(true)}
            >
              + Shipping
            </Button>
          )}
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-gray-500 text-sm">Total</span>
          <span className="font-medium">
            {currentCurrency.symbol}
            {total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
          <Label className="text-right text-gray-500 font-normal text-sm">Amount Paid</Label>
          <FormField
            control={form.control}
            name="amountPaid"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      {currentCurrency.symbol}
                    </span>
                    <Input
                      type="number"
                      {...field}
                      className="h-9 border-gray-200 pl-7 text-right"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between items-center pt-2 font-bold">
          <span className="text-gray-500 text-sm">Balance Due</span>
          <span>
            {currentCurrency.symbol}
            {balanceDue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
