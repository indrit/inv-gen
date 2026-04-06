'use client';

import Image from 'next/image';
import { PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface SharedHeaderProps {
  form: UseFormReturn<any>;
  logo: string | null;
  handleLogoClick: () => void;
  logoInputRef: React.RefObject<HTMLInputElement | null>;
  handleLogoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type: 'invoice' | 'estimate';
  isPremium?: boolean;
}

export function SharedHeader({
  form,
  logo,
  handleLogoClick,
  logoInputRef,
  handleLogoChange,
  type,
  isPremium = false,
}: SharedHeaderProps) {
  const isInvoice = type === 'invoice';
  const numberFieldName = isInvoice ? 'invoiceNumber' : 'estimateNumber';
  const defaultTitle = isInvoice ? 'INVOICE' : 'ESTIMATE';

  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
      <div className="space-y-4 w-full max-w-sm">
        <div
          onClick={handleLogoClick}
          className="relative flex justify-center items-center w-48 h-32 border-2 border-dashed rounded-md cursor-pointer hover:border-primary text-muted-foreground bg-gray-50"
        >
          {logo ? (
            <Image src={logo} alt="Company Logo" fill className="object-contain p-2" />
          ) : (
            <div className="space-y-1 text-center">
              <PlusCircle className="mx-auto h-6 w-6 text-gray-400" />
              <p className="text-xs">Add Your Logo</p>
            </div>
          )}
        </div>
        <input
          ref={logoInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoChange}
        />

        <FormField
          control={form.control}
          name="from"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Your Company Name (e.g. Acme Corp)&#10;Your Business Address&#10;City, State, Zip"
                  className="min-h-[80px] border-gray-200 resize-none font-medium"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="text-right space-y-4 w-full md:w-auto">
        <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-3">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border-2 ${isPremium ? 'text-primary border-primary bg-primary/5' : 'text-gray-400 border-gray-100 bg-gray-50'}`}>
                    {isPremium ? 'Premium Plan' : 'Free Plan'}
                </span>
                <FormField
                control={form.control}
                name="documentTitle"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Input
                        placeholder={defaultTitle}
                        {...field}
                        className="h-auto w-full min-w-[250px] text-right border-0 bg-transparent p-0 text-4xl lg:text-5xl font-black tracking-tight shadow-none focus-visible:ring-0 uppercase text-gray-900"
                        />
                    </FormControl>
                    </FormItem>
                )}
                />
            </div>
            {!isPremium && (
                <p className="text-[10px] text-gray-400 font-medium">1 image max • Standard Support • Watermark included</p>
            )}
            {isPremium && (
                <p className="text-[10px] text-primary font-bold">Unlimited Images • No Ads • No Watermark • Priority Support</p>
            )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-4">
          <span className="text-gray-400 text-lg font-bold">#</span>
          <FormField
            control={form.control}
            name={numberFieldName}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="0001"
                    {...field}
                    className="w-32 text-right h-12 border-gray-200 font-black text-lg bg-white"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
