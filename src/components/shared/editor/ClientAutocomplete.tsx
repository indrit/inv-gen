'use client';

import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { type Client } from '@/lib/clients';

interface ClientAutocompleteProps {
  field: any;
  clients: Client[];
  onSelect: (client: Client) => void;
  placeholder?: string;
}

export function ClientAutocomplete({
  field,
  clients,
  onSelect,
  placeholder,
}: ClientAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  // Filter clients based on search value (first line of textarea usually)
  const filteredClients = React.useMemo(() => {
    if (!searchValue || searchValue.trim() === '') return [];
    return clients.filter((client) =>
      client.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [clients, searchValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    field.onChange(e);
    const firstLine = e.target.value.split('\n')[0];
    setSearchValue(firstLine);
    if (firstLine.length > 1) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="w-full">
          <Textarea
            {...field}
            placeholder={placeholder}
            className="min-h-[120px] border-gray-200 resize-none font-medium text-base shadow-none focus-visible:ring-1 focus-visible:ring-primary"
            onChange={handleChange}
            onFocus={() => {
              const firstLine = field.value?.split('\n')[0] || '';
              if (firstLine.length > 1) setOpen(true);
            }}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[300px] p-0" 
        align="start" 
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {filteredClients.length > 0 ? (
          <div className="max-h-[300px] overflow-y-auto py-1">
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b bg-gray-50/50">
              Suggested Clients
            </div>
            {filteredClients.map((client) => (
              <button
                key={client.id}
                className="w-full text-left px-3 py-2.5 text-sm hover:bg-primary hover:text-white transition-colors flex flex-col gap-0.5 group"
                onClick={() => {
                  onSelect(client);
                  setOpen(false);
                }}
              >
                <span className="font-semibold">{client.name}</span>
                <span className="text-xs text-muted-foreground group-hover:text-primary-foreground/80 line-clamp-1">
                  {client.billingAddressLine1}, {client.billingCity}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No matching clients found.
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
