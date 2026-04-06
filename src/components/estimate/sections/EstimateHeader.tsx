'use client';

import Image from 'next/image';
import { PlusCircle } from 'lucide-react';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';

interface EstimateHeaderProps {
  form: UseFormReturn<any>;
  logo: string | null;
  handleLogoClick: () => void;
  logoInputRef: React.RefObject<HTMLInputElement | null>;
  handleLogoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function EstimateHeader({
  form,
  logo,
  handleLogoClick,
  logoInputRef,
  handleLogoChange,
}: EstimateHeaderProps) {
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
                  className="min-h-[80px] border-gray-200 resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="text-right space-y-4 w-full md:w-auto">
        <FormField
          control={form.control}
          name="documentTitle"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="ESTIMATE"
                  {...field}
                  className="h-auto w-full text-right border-0 bg-transparent p-0 text-4xl font-normal tracking-tight shadow-none focus-visible:ring-0"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-2">
          <span className="text-gray-400">#</span>
          <FormField
            control={form.control}
            name="estimateNumber"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="001376" {...field} className="w-32 text-right h-9 border-gray-200" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
