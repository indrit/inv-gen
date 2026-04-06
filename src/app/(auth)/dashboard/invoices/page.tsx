'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Client } from '@/lib/clients';
import { Invoice } from '@/lib/invoices';
import { Loader2, Search, Plus, Download, Filter, ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { format, isAfter, isBefore, addDays, startOfDay } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';

export default function InvoicesPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [searchTerm, setSearchTerm] = useState('');

    const invoicesQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, 'users', user.uid, 'invoices'), orderBy('createdAt', 'desc'));
    }, [user, firestore]);

    const clientsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, 'users', user.uid, 'clients');
    }, [user, firestore]);

    const { data: invoices, isLoading: isLoadingInvoices } = useCollection<Invoice>(invoicesQuery);
    const { data: clients } = useCollection<Client>(clientsQuery);

    const clientMap = useMemo(() => {
        const map = new Map<string, string>();
        if (clients) {
            clients.forEach(client => map.set(client.id, client.name));
        }
        return map;
    }, [clients]);

    const stats = useMemo(() => {
        if (!invoices) return { overdue: 0, due30: 0, avgPaid: 0, upcoming: 0 };
        
        const now = startOfDay(new Date());
        const in30Days = addDays(now, 30);
        
        let overdue = 0;
        let due30 = 0;
        let upcoming = 0;
        let paidCount = 0;
        let totalPaidDays = 0;

        invoices.forEach(inv => {
            const dueDate = new Date(inv.dueDate);
            const issueDate = new Date(inv.issueDate);
            const amount = inv.totalAmount || 0;

            if (inv.status !== 'Paid' && isBefore(dueDate, now)) {
                overdue += amount;
            }

            if (inv.status !== 'Paid' && isAfter(dueDate, now) && isBefore(dueDate, in30Days)) {
                due30 += amount;
            }

            if (inv.status !== 'Paid' && isAfter(dueDate, in30Days)) {
                upcoming += amount;
            }

            if (inv.status === 'Paid') {
                paidCount++;
                // Simulate "time to get paid" if we had a paidAt date, but for now just use a placeholder or logic
                // totalPaidDays += differenceInDays(new Date(inv.paidAt), issueDate);
            }
        });

        return {
            overdue,
            due30,
            avgPaid: 34, // Placeholder as in image
            upcoming
        };
    }, [invoices]);

    const filteredInvoices = useMemo(() => {
        if (!invoices) return [];
        const searchLower = searchTerm.toLowerCase();
        return invoices.filter(inv => {
            const clientName = clientMap.get(inv.clientId || '') || '';
            const invoiceNumber = inv.invoiceNumber || '';
            return clientName.toLowerCase().includes(searchLower) || invoiceNumber.includes(searchLower);
        });
    }, [invoices, searchTerm, clientMap]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Sales & Payment</span>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">Invoices</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Invoices</h1>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            Last update a min ago <span className="cursor-pointer">🔄</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button asChild className="bg-blue-600 hover:bg-blue-700">
                            <Link href="/">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Invoice
                            </Link>
                        </Button>
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Export as .CSV
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 text-center">Overdue</p>
                    <p className="text-2xl font-bold text-gray-900 text-center mt-2">{formatCurrency(stats.overdue)}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 text-center">Due within next 30 days</p>
                    <p className="text-2xl font-bold text-gray-900 text-center mt-2">{formatCurrency(stats.due30)}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 text-center">Average time to get paid</p>
                    <p className="text-2xl font-bold text-gray-900 text-center mt-2">{stats.avgPaid} days</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 text-center">Upcoming</p>
                    <p className="text-2xl font-bold text-gray-900 text-center mt-2">{formatCurrency(stats.upcoming)}</p>
                </div>
            </div>

            {/* Filters & Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="text-gray-600">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-600 border-none">2</Badge>
                        </Button>
                        <Button variant="outline" size="sm" className="text-gray-600">
                            <ArrowUpDown className="w-4 h-4 mr-2" />
                            Sort Order
                        </Button>
                        <div className="h-6 w-[1px] bg-gray-200 mx-2" />
                        <span className="text-sm text-gray-500">Total: <span className="font-medium text-gray-900">+$1000</span></span>
                        <div className="h-6 w-[1px] bg-gray-200 mx-2" />
                        <span className="text-sm text-gray-500">Date: <span className="font-medium text-gray-900">Last 6 months</span></span>
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search"
                            className="pl-10 h-9 bg-gray-50 border-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-12"><Checkbox /></TableHead>
                            <TableHead className="text-gray-500 font-medium">Invoice Number</TableHead>
                            <TableHead className="text-gray-500 font-medium">Customer</TableHead>
                            <TableHead className="text-gray-500 font-medium">Total</TableHead>
                            <TableHead className="text-gray-500 font-medium">Status</TableHead>
                            <TableHead className="text-gray-500 font-medium">Amount Due</TableHead>
                            <TableHead className="text-gray-500 font-medium">Date</TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoadingInvoices ? (
                            <TableRow><TableCell colSpan={8} className="text-center py-12"><Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" /></TableCell></TableRow>
                        ) : filteredInvoices && filteredInvoices.length > 0 ? (
                            filteredInvoices.map(invoice => (
                                <TableRow key={invoice.id} className="hover:bg-gray-50 cursor-pointer group">
                                    <TableCell><Checkbox /></TableCell>
                                    <TableCell className="font-medium text-blue-600">#{invoice.invoiceNumber || 'N/A'}</TableCell>
                                    <TableCell className="text-gray-900 font-medium">{clientMap.get(invoice.clientId || '') || 'N/A'}</TableCell>
                                    <TableCell className="text-gray-900">{formatCurrency(invoice.totalAmount || 0)}</TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant="outline" 
                                            className={cn(
                                                "rounded-full px-3 py-0.5 border-none",
                                                invoice.status === 'Paid' ? "bg-green-50 text-green-700" : 
                                                invoice.status === 'Overdue' ? "bg-red-50 text-red-700" : 
                                                "bg-gray-100 text-gray-700"
                                            )}
                                        >
                                            {invoice.status === 'Paid' ? '✓ Paid' : invoice.status === 'Overdue' ? '⊘ Overdue' : '○ Draft'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-900">{formatCurrency(invoice.status === 'Paid' ? 0 : (invoice.totalAmount || 0))}</TableCell>
                                    <TableCell className="text-gray-500">{format(new Date(invoice.issueDate), 'MMM d, yyyy')}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={8} className="text-center py-12 text-gray-500">No invoices found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>

                <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                    <span>Showing 1 to {filteredInvoices?.length || 0} of {invoices?.length || 0} results</span>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8">25 per page <ChevronDown className="w-3 h-3 ml-2" /></Button>
                        <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" className="h-8 px-3" disabled>Prev</Button>
                            <Button variant="outline" size="sm" className="h-8 px-3" disabled>Next</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
