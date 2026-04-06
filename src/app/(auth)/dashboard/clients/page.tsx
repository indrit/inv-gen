'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/firebase/utils';
import { clientSchema, type Client, type ClientValues } from '@/lib/clients';
import { Loader2, Edit2, Search, Plus, UserPlus, MoreHorizontal, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const EditClientDialog = ({ client, onUpdate }: { client: Client, onUpdate: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const firestore = useFirestore();
    const { toast } = useToast();
  
    const form = useForm<ClientValues>({
      resolver: zodResolver(clientSchema),
      defaultValues: { ...client },
    });
  
    const { isSubmitting } = form.formState;
  
    useEffect(() => {
      form.reset(client);
    }, [client, form]);
  
    const handleUpdateClient = async (values: ClientValues) => {
      if (!firestore) return;
      const clientRef = doc(firestore, 'users', client.userId, 'clients', client.id);
      try {
        await updateDoc(clientRef, {
          ...values,
          updatedAt: serverTimestamp(),
        });
        toast({ title: 'Client Updated', description: `${values.name} has been updated.` });
        setIsOpen(false);
        onUpdate();
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, clientRef.path);
        toast({ title: 'Error', description: 'Could not update client.', variant: 'destructive' });
      }
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon"><Edit2 className="h-4 w-4" /></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>Update the details for {client.name}.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateClient)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Client Name</FormLabel><FormControl><Input placeholder="Acme Inc." {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="contact@acme.com" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl><FormMessage /></FormItem> )} />
              </div>
  
              <h3 className="text-lg font-semibold pt-4">Billing Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="billingAddressLine1" render={({ field }) => ( <FormItem><FormLabel>Address Line 1</FormLabel><FormControl><Input placeholder="123 Billing St" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="billingAddressLine2" render={({ field }) => ( <FormItem><FormLabel>Address Line 2</FormLabel><FormControl><Input placeholder="Suite 100" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="billingCity" render={({ field }) => ( <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Billville" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="billingStateProvince" render={({ field }) => ( <FormItem><FormLabel>State / Province</FormLabel><FormControl><Input placeholder="CA" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="billingPostalCode" render={({ field }) => ( <FormItem><FormLabel>ZIP / Postal Code</FormLabel><FormControl><Input placeholder="12345" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="billingCountry" render={({ field }) => ( <FormItem><FormLabel>Country</FormLabel><FormControl><Input placeholder="USA" {...field} /></FormControl><FormMessage /></FormItem> )} />
              </div>
  
              <h3 className="text-lg font-semibold pt-4">Shipping Address</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="shippingAddressLine1" render={({ field }) => ( <FormItem><FormLabel>Address Line 1</FormLabel><FormControl><Input placeholder="456 Shipping Rd" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="shippingAddressLine2" render={({ field }) => ( <FormItem><FormLabel>Address Line 2</FormLabel><FormControl><Input placeholder="Apt B" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="shippingCity" render={({ field }) => ( <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Shipburg" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="shippingStateProvince" render={({ field }) => ( <FormItem><FormLabel>State / Province</FormLabel><FormControl><Input placeholder="NY" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="shippingPostalCode" render={({ field }) => ( <FormItem><FormLabel>ZIP / Postal Code</FormLabel><FormControl><Input placeholder="54321" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="shippingCountry" render={({ field }) => ( <FormItem><FormLabel>Country</FormLabel><FormControl><Input placeholder="USA" {...field} /></FormControl><FormMessage /></FormItem> )} />
              </div>
               <DialogFooter className="pt-4">
                  <DialogClose asChild>
                      <Button type="button" variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                  </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    )
}

export default function ClientsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');
  const [forceRerender, setForceRerender] = useState(0);

  const clientsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'clients');
  }, [user, firestore, forceRerender]);

  const { data: clients, isLoading: isLoadingClients } = useCollection<Client>(clientsQuery);
  
  const filteredClients = useMemo(() => {
    if (!clients) return [];
    const searchLower = searchTerm.toLowerCase();
    return clients.filter(c => 
        c.name.toLowerCase().includes(searchLower) || 
        (c.email && c.email.toLowerCase().includes(searchLower))
    );
  }, [clients, searchTerm]);

  const getFullAddress = (client: Client) => {
    const parts = [
      client.billingAddressLine1,
      client.billingCity,
      client.billingStateProvince,
      client.billingCountry,
    ];
    return parts.filter(Boolean).join(', ');
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Sales & Payment</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Clients</span>
        </div>
        <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Clients</h1>
                <p className="text-sm text-gray-500">Manage your customers and their contact information.</p>
            </div>
            <div className="flex items-center gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Client
                </Button>
            </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="text-gray-600">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                </Button>
            </div>
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search clients..."
                    className="pl-10 h-9 bg-gray-50 border-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <Table>
            <TableHeader className="bg-gray-50">
                <TableRow className="hover:bg-transparent">
                    <TableHead className="text-gray-500 font-medium">Client Name</TableHead>
                    <TableHead className="text-gray-500 font-medium">Email Address</TableHead>
                    <TableHead className="text-gray-500 font-medium">Location</TableHead>
                    <TableHead className="text-gray-500 font-medium text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoadingClients ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-12"><Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" /></TableCell></TableRow>
                ) : filteredClients && filteredClients.length > 0 ? (
                    filteredClients.map(client => (
                        <TableRow key={client.id} className="hover:bg-gray-50 cursor-pointer group">
                            <TableCell className="font-medium text-gray-900">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                                        {client.name.charAt(0)}
                                    </div>
                                    {client.name}
                                </div>
                            </TableCell>
                            <TableCell className="text-gray-500">{client.email}</TableCell>
                            <TableCell className="text-gray-500">{getFullAddress(client)}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button asChild variant="outline" size="sm" className="h-8">
                                        <Link href={`/estimate?clientId=${client.id}`}>Estimate</Link>
                                    </Button>
                                    <Button asChild size="sm" className="h-8 bg-blue-600 hover:bg-blue-700">
                                        <Link href={`/?clientId=${client.id}`}>Invoice</Link>
                                    </Button>
                                    <EditClientDialog client={client} onUpdate={() => setForceRerender(v => v + 1)} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow><TableCell colSpan={4} className="text-center py-12 text-gray-500">No clients found.</TableCell></TableRow>
                )}
            </TableBody>
        </Table>

        <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
            <span>Showing {filteredClients?.length || 0} clients</span>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 px-3" disabled>Prev</Button>
                <Button variant="outline" size="sm" className="h-8 px-3" disabled>Next</Button>
            </div>
        </div>
      </div>
    </div>
  );
}
