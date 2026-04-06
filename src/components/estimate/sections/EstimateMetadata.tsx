'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormField, FormItem } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { type EstimateFormValues } from '@/lib/schemas/estimate';

interface EstimateMetadataProps {
  form: UseFormReturn<EstimateFormValues>;
  isMounted: boolean;
}

export function EstimateMetadata({ form, isMounted }: EstimateMetadataProps) {
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
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {isMounted && field.value ? format(field.value, 'yyyy-MM-dd') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
          <Label className="text-right text-gray-500 font-normal">Expiry Date</Label>
          <FormField
            control={form.control}
            name="expiryDate"
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
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {isMounted && field.value ? format(field.value, 'yyyy-MM-dd') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
