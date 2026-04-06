'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { type Client } from '@/lib/clients';

interface EstimatePartiesProps {
  form: UseFormReturn<any>;
  user: any;
  clients: Client[] | null | undefined;
  formatClientAsString: (client: Client) => string;
}

export function EstimateParties({
  form,
  user,
  clients,
  formatClientAsString,
}: EstimatePartiesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-2">
        <Label className="text-gray-500 font-normal">Bill To</Label>
        {user && clients ? (
          <div className="space-y-2">
            <Select
              onValueChange={(value) => {
                const selectedClient = clients.find((c) => c.id === value);
                if (selectedClient) {
                  form.setValue('to', formatClientAsString(selectedClient));
                  form.setValue('clientId', selectedClient.id);
                }
              }}
            >
              <SelectTrigger className="border-gray-200">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        ) : (
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
        )}
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
