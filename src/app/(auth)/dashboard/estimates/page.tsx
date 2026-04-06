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
import { Estimate } from '@/lib/estimates';
import { Loader2, Search, Plus, Download, Filter, ArrowUpDown, MoreHorizontal, ChevronDown } from 'lucide-react';
import { format, isAfter, isBefore, addDays, startOfDay } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export default function EstimatesPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [searchTerm, setSearchTerm] = useState('');

    const estimatesQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, 'users', user.uid, 'estimates'), orderBy('createdAt', 'desc'));
    }, [user, firestore]);

    const clientsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, 'users', user.uid, 'clients');
    }, [user, firestore]);

    const { data: estimates, isLoading: isLoadingEstimates } = useCollection<Estimate>(estimatesQuery);
    const { data: clients } = useCollection<Client>(clientsQuery);

    const clientMap = useMemo(() => {
        const map = new Map<string, string>();
        if (clients) {
            clients.forEach(client => map.set(client.id, client.name));
        }
        return map;
    }, [clients]);

    const stats = useMemo(() => {
        if (!estimates) return { pending: 0, accepted: 0, expired: 0, total: 0 };
        
        const now = startOfDay(new Date());
        
        let pending = 0;
        let accepted = 0;
        let expired = 0;
        let total = 0;

        estimates.forEach(est => {
            const expiryDate = new Date(est.expiryDate);
            const amount = est.totalAmount || 0;
            total += amount;

            if (est.status === 'Accepted') {
                accepted += amount;
            } else if (isBefore(expiryDate, now)) {
                expired += amount;
            } else {
                pending += amount;
            }
        });

        return { pending, accepted, expired, total };
    }, [estimates]);

    const filteredEstimates = useMemo(() => {
        if (!estimates) return [];
        const searchLower = searchTerm.toLowerCase();
        return estimates.filter(est => {
            const clientName = clientMap.get(est.clientId || '') || '';
            const estimateNumber = est.estimateNumber || '';
            return clientName.toLowerCase().includes(searchLower) || estimateNumber.includes(searchLower);
        });
    }, [estimates, searchTerm, clientMap]);

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
                    <span className="text-gray-900 font-medium">Estimates</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Estimates</h1>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            Last update a min ago <span className="cursor-pointer">🔄</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button asChild className="bg-blue-600 hover:bg-blue-700">
                            <Link href="/estimate">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Estimate
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
                    <p className="text-sm font-medium text-gray-500 text-center">Pending</p>
                    <p className="text-2xl font-bold text-gray-900 text-center mt-2">{formatCurrency(stats.pending)}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 text-center">Accepted</p>
                    <p className="text-2xl font-bold text-gray-900 text-center mt-2">{formatCurrency(stats.accepted)}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 text-center">Expired</p>
                    <p className="text-2xl font-bold text-gray-900 text-center mt-2">{formatCurrency(stats.expired)}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 text-center">Total Value</p>
                    <p className="text-2xl font-bold text-gray-900 text-center mt-2">{formatCurrency(stats.total)}</p>
                </div>
            </div>

            {/* Filters & Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="text-gray-600">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-600 border-none">1</Badge>
                        </Button>
                        <Button variant="outline" size="sm" className="text-gray-600">
                            <ArrowUpDown className="w-4 h-4 mr-2" />
                            Sort Order
                        </Button>
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
                            <TableHead className="text-gray-500 font-medium">Estimate Number</TableHead>
                            <TableHead className="text-gray-500 font-medium">Customer</TableHead>
                            <TableHead className="text-gray-500 font-medium">Total</TableHead>
                            <TableHead className="text-gray-500 font-medium">Status</TableHead>
                            <TableHead className="text-gray-500 font-medium">Expiry Date</TableHead>
                            <TableHead className="text-gray-500 font-medium">Date</TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoadingEstimates ? (
                            <TableRow><TableCell colSpan={8} className="text-center py-12"><Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" /></TableCell></TableRow>
                        ) : filteredEstimates && filteredEstimates.length > 0 ? (
                            filteredEstimates.map(estimate => (
                                <TableRow key={estimate.id} className="hover:bg-gray-50 cursor-pointer group">
                                    <TableCell><Checkbox /></TableCell>
                                    <TableCell className="font-medium text-blue-600">#{estimate.estimateNumber || 'N/A'}</TableCell>
                                    <TableCell className="text-gray-900 font-medium">{clientMap.get(estimate.clientId || '') || 'N/A'}</TableCell>
                                    <TableCell className="text-gray-900">{formatCurrency(estimate.totalAmount || 0)}</TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant="outline" 
                                            className={cn(
                                                "rounded-full px-3 py-0.5 border-none",
                                                estimate.status === 'Accepted' ? "bg-green-50 text-green-700" : 
                                                estimate.status === 'Expired' ? "bg-red-50 text-red-700" : 
                                                "bg-gray-100 text-gray-700"
                                            )}
                                        >
                                            {estimate.status === 'Accepted' ? '✓ Accepted' : estimate.status === 'Expired' ? '⊘ Expired' : '○ Draft'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-500">{format(new Date(estimate.expiryDate), 'MMM d, yyyy')}</TableCell>
                                    <TableCell className="text-gray-500">{format(new Date(estimate.issueDate), 'MMM d, yyyy')}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={8} className="text-center py-12 text-gray-500">No estimates found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>

                <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                    <span>Showing 1 to {filteredEstimates?.length || 0} of {estimates?.length || 0} results</span>
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
