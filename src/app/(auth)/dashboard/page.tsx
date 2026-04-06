'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/firebase/utils';
import { clientSchema, type Client, type ClientValues } from '@/lib/clients';
import { Invoice } from '@/lib/invoices';
import { Estimate } from '@/lib/estimates';
import { Loader2, Users, FileText, FileBarChart, PlusCircle, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const StatCard = ({ title, value, icon, action }: { title: string; value: string | number; icon: React.ReactNode; action?: React.ReactNode }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
      {action && <CardFooter className="pt-0">{action}</CardFooter>}
    </Card>
);

const AddClientDialog = ({ onClientAdded }: { onClientAdded: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
  
    const form = useForm<ClientValues>({
      resolver: zodResolver(clientSchema),
      defaultValues: { name: '', email: '', phone: '', billingAddressLine1: '', billingAddressLine2: '', billingCity: '', billingStateProvince: '', billingPostalCode: '', billingCountry: '', shippingAddressLine1: '', shippingAddressLine2: '', shippingCity: '', shippingStateProvince: '', shippingPostalCode: '', shippingCountry: '' },
    });
    const { isSubmitting } = form.formState;
  
    const clientsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, 'users', user.uid, 'clients');
    }, [user, firestore]);

    const handleAddClient = async (values: ClientValues) => {
      if (!firestore || !user || !clientsQuery) return;
      try {
        await addDoc(clientsQuery, {
          ...values,
          userId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        toast({ title: 'Client Added', description: `${values.name} has been saved.` });
        form.reset();
        setIsOpen(false);
        onClientAdded();
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, clientsQuery.path);
        toast({ title: 'Error', description: 'Could not save client.', variant: 'destructive' });
      }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="link" className="p-0 h-auto">
                + New Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>Add a new client to your records.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddClient)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-6">
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
                        <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Client
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
          </DialogContent>
        </Dialog>
    );
}

// Main component
export default function DashboardPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [searchTerm, setSearchTerm] = useState('');
    const [rerender, setRerender] = useState(0);

    // Queries for stats (all documents)
    const allInvoicesQuery = useMemoFirebase(() => user && firestore ? collection(firestore, 'users', user.uid, 'invoices') : null, [user, firestore]);
    const allEstimatesQuery = useMemoFirebase(() => user && firestore ? collection(firestore, 'users', user.uid, 'estimates') : null, [user, firestore]);
    const allClientsQuery = useMemoFirebase(() => user && firestore ? collection(firestore, 'users', user.uid, 'clients') : null, [user, firestore, rerender]);

    // Queries for recent items lists (latest 5)
    const latestInvoicesQuery = useMemoFirebase(() => user && firestore ? query(collection(firestore, 'users', user.uid, 'invoices'), orderBy('createdAt', 'desc'), limit(5)) : null, [user, firestore]);
    const latestEstimatesQuery = useMemoFirebase(() => user && firestore ? query(collection(firestore, 'users', user.uid, 'estimates'), orderBy('createdAt', 'desc'), limit(5)) : null, [user, firestore]);
    const latestClientsQuery = useMemoFirebase(() => user && firestore ? query(collection(firestore, 'users', user.uid, 'clients'), orderBy('createdAt', 'desc'), limit(5)) : null, [user, firestore, rerender]);

    const { data: allInvoices } = useCollection<Invoice>(allInvoicesQuery);
    const { data: allEstimates } = useCollection<Estimate>(allEstimatesQuery);
    const { data: allClients } = useCollection<Client>(allClientsQuery);
    
    const { data: latestInvoices, isLoading: isLoadingInvoices } = useCollection<Invoice>(latestInvoicesQuery);
    const { data: latestEstimates, isLoading: isLoadingEstimates } = useCollection<Estimate>(latestEstimatesQuery);
    const { data: latestClients, isLoading: isLoadingClients } = useCollection<Client>(latestClientsQuery);

    const totalRevenue = useMemo(() => allInvoices?.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0) || 0, [allInvoices]);
    const totalEstimated = useMemo(() => allEstimates?.reduce((acc, est) => acc + (est.totalAmount || 0), 0) || 0, [allEstimates]);

    const clientMap = useMemo(() => {
        const map = new Map<string, string>();
        if (allClients) {
            allClients.forEach(client => map.set(client.id, client.name));
        }
        return map;
    }, [allClients]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const renderLoading = () => (
        <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
    );
    
    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.displayName || 'User'}. Here's what's happening with your business.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={<FileText className="text-blue-600" />} action={
                    <Button asChild size="sm" variant="link" className="p-0 h-auto text-blue-600">
                        <Link href="/">+ New Invoice</Link>
                    </Button>
                } />
                <StatCard title="Total Estimated" value={formatCurrency(totalEstimated)} icon={<FileBarChart className="text-green-600" />} action={
                    <Button asChild size="sm" variant="link" className="p-0 h-auto text-green-600">
                        <Link href="/estimate">+ New Estimate</Link>
                    </Button>
                } />
                <StatCard title="Total Clients" value={allClients?.length ?? 0} icon={<Users className="text-purple-600" />} action={
                    <AddClientDialog onClientAdded={() => setRerender(r => r + 1)} />
                } />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Invoices */}
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
                        <div>
                            <CardTitle className="text-lg font-bold">Recent Invoices</CardTitle>
                            <CardDescription>Your most recently created invoices.</CardDescription>
                        </div>
                        <Button asChild variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <Link href="/dashboard/invoices">View All</Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {isLoadingInvoices ? renderLoading() : latestInvoices && latestInvoices.length > 0 ? (
                            <div className="space-y-6">
                                {latestInvoices.map(invoice => (
                                    <div key={invoice.id} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                                                {clientMap.get(invoice.clientId || '')?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{clientMap.get(invoice.clientId || '') || 'Unknown Client'}</p>
                                                <p className="text-sm text-gray-500">#{invoice.invoiceNumber || 'N/A'} &middot; {format(new Date(invoice.issueDate), 'PP')}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">{formatCurrency(invoice.totalAmount || 0)}</p>
                                            <Badge variant="outline" className={cn(
                                                "mt-1 border-none",
                                                invoice.status === 'Paid' ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-700"
                                            )}>
                                                {invoice.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <FileText className="mx-auto h-12 w-12 text-gray-200" />
                                <p className="mt-4 text-gray-500">No invoices yet.</p>
                                <Button asChild variant="outline" size="sm" className="mt-4">
                                    <Link href="/">Create your first invoice</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Clients */}
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
                        <div>
                            <CardTitle className="text-lg font-bold">Recent Clients</CardTitle>
                            <CardDescription>Your most recently added clients.</CardDescription>
                        </div>
                        <Button asChild variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <Link href="/dashboard/clients">View All</Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="pt-6">
                       {isLoadingClients ? renderLoading() : latestClients && latestClients.length > 0 ? (
                             <div className="space-y-6">
                                {latestClients.map(client => (
                                    <div key={client.id} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 font-bold">
                                                {client.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{client.name}</p>
                                                <p className="text-sm text-gray-500">{client.email}</p>
                                            </div>
                                        </div>
                                        <Button asChild variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/?clientId=${client.id}`}>New Invoice</Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Users className="mx-auto h-12 w-12 text-gray-200" />
                                <p className="mt-4 text-gray-500">No clients yet.</p>
                                <AddClientDialog onClientAdded={() => setRerender(r => r + 1)} />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
