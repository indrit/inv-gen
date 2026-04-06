'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, User, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CRMManager() {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [contactsRes, leadsRes] = await Promise.all([
        fetch('/api/crm/contacts'),
        fetch('/api/crm/leads')
      ]);
      
      if (!contactsRes.ok || !leadsRes.ok) {
        throw new Error(`Failed to fetch CRM data: ${contactsRes.status} ${leadsRes.status}`);
      }
      
      const [contactsData, leadsData] = await Promise.all([
        contactsRes.json(),
        leadsRes.json()
      ]);
      setContacts(contactsData);
      setLeads(leadsData);
    } catch (error) {
      console.error('Failed to fetch CRM data:', error);
      toast({ title: 'Error', description: 'Failed to fetch CRM data. Please check if the API endpoints are correctly configured.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/crm/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create contact');
      toast({ title: 'Contact Added', description: 'New contact has been successfully added.' });
      fetchData();
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add contact.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create lead');
      toast({ title: 'Lead Added', description: 'New lead has been successfully added.' });
      fetchData();
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add lead.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Tabs defaultValue="contacts" className="space-y-6">
      <TabsList>
        <TabsTrigger value="contacts" className="flex items-center gap-2">
          <User className="h-4 w-4" /> Contacts
        </TabsTrigger>
        <TabsTrigger value="leads" className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" /> Leads
        </TabsTrigger>
      </TabsList>

      <TabsContent value="contacts" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Contact</CardTitle>
            <CardDescription>Enter contact details to add to your CRM.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddContact} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" name="company" />
              </div>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Contact
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contacts</CardTitle>
            <CardDescription>A list of all your CRM contacts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={4} className="h-12 animate-pulse bg-muted/50" />
                    </TableRow>
                  ))
                ) : contacts.length > 0 ? (
                  contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.firstName} {contact.lastName}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.company || '-'}</TableCell>
                      <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No contacts found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="leads" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Lead</CardTitle>
            <CardDescription>Track a new business opportunity.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddLead} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="contactId">Contact ID</Label>
                <Input id="contactId" name="contactId" required placeholder="Paste contact ID" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select name="status" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="lost">Lost</option>
                  <option value="won">Won</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Value ($)</Label>
                <Input id="value" name="value" type="number" step="0.01" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input id="source" name="source" placeholder="e.g., Website, Referral" />
              </div>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Lead
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leads</CardTitle>
            <CardDescription>Active leads and opportunities.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5} className="h-12 animate-pulse bg-muted/50" />
                    </TableRow>
                  ))
                ) : leads.length > 0 ? (
                  leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-mono text-xs">{lead.contactId}</TableCell>
                      <TableCell>
                        <Badge variant={lead.status === 'won' ? 'default' : lead.status === 'lost' ? 'destructive' : 'secondary'}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell>${Number(lead.value).toLocaleString()}</TableCell>
                      <TableCell>{lead.source || '-'}</TableCell>
                      <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No leads found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
