'use client';

import { Label } from '@/components/ui/label';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { type Client } from '@/lib/clients';
import { ClientAutocomplete } from './ClientAutocomplete';

interface SharedPartiesProps {
  form: UseFormReturn<any>;
  clients?: Client[] | null;
  formatClientAsString?: (client: Client) => string;
}

export function SharedParties({ 
  form, 
  clients = [], 
  formatClientAsString = (c) => c.name 
}: SharedPartiesProps) {
  
  const handleClientSelect = (client: Client, fieldName: string) => {
    form.setValue(fieldName, formatClientAsString(client));
    if (fieldName === 'to') {
      form.setValue('clientId', client.id);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-4">
        <Label className="text-gray-500 font-normal uppercase tracking-wider text-xs">Bill To</Label>
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ClientAutocomplete
                  field={field}
                  clients={clients || []}
                  onSelect={(client: Client) => handleClientSelect(client, 'to')}
                  placeholder="Client Business Name&#10;Client Billing Address&#10;City, State, Zip"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      <div className="space-y-4">
        <Label className="text-gray-500 font-normal uppercase tracking-wider text-xs">Ship To (Optional)</Label>
        <FormField
          control={form.control}
          name="shipTo"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ClientAutocomplete
                  field={field}
                  clients={clients || []}
                  onSelect={(client: Client) => handleClientSelect(client, 'shipTo')}
                  placeholder="Shipping Recipient&#10;Shipping Address&#10;City, State, Zip"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
