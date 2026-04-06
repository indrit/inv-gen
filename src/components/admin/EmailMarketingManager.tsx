'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Mail, Users, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export default function EmailMarketingManager() {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [campaignsRes, subscribersRes] = await Promise.all([
        fetch('/api/email/campaigns'),
        fetch('/api/email/subscribers')
      ]);
      
      if (!campaignsRes.ok || !subscribersRes.ok) {
        throw new Error(`Failed to fetch Email Marketing data: ${campaignsRes.status} ${subscribersRes.status}`);
      }
      
      const [campaignsData, subscribersData] = await Promise.all([
        campaignsRes.json(),
        subscribersRes.json()
      ]);
      setCampaigns(campaignsData);
      setSubscribers(subscribersData);
    } catch (error) {
      console.error('Failed to fetch Email Marketing data:', error);
      toast({ title: 'Error', description: 'Failed to fetch Email Marketing data. Please check if the API endpoints are correctly configured.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCampaign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/email/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create campaign');
      toast({ title: 'Campaign Created', description: 'New campaign has been successfully created.' });
      fetchData();
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create campaign.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSubscriber = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/email/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create subscriber');
      toast({ title: 'Subscriber Added', description: 'New subscriber has been successfully added.' });
      fetchData();
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add subscriber.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Tabs defaultValue="campaigns" className="space-y-6">
      <TabsList>
        <TabsTrigger value="campaigns" className="flex items-center gap-2">
          <Mail className="h-4 w-4" /> Campaigns
        </TabsTrigger>
        <TabsTrigger value="subscribers" className="flex items-center gap-2">
          <Users className="h-4 w-4" /> Subscribers
        </TabsTrigger>
      </TabsList>

      <TabsContent value="campaigns" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Campaign</CardTitle>
            <CardDescription>Compose a new email campaign for your subscribers.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCampaign} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input id="name" name="name" required placeholder="e.g., Monthly Newsletter" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input id="subject" name="subject" required placeholder="e.g., Check out our latest updates!" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Email Content (HTML or Plain Text)</Label>
                <Textarea id="content" name="content" required className="min-h-[200px]" placeholder="Compose your email here..." />
              </div>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                Create Campaign
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaigns</CardTitle>
            <CardDescription>Manage your email marketing campaigns.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
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
                ) : campaigns.length > 0 ? (
                  campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>{campaign.subject}</TableCell>
                      <TableCell>
                        <Badge variant={campaign.status === 'sent' ? 'default' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(campaign.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No campaigns found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="subscribers" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Subscriber</CardTitle>
            <CardDescription>Manually add a subscriber to your mailing list.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSubscriber} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" required placeholder="e.g., user@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name (Optional)</Label>
                <Input id="firstName" name="firstName" />
              </div>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Subscriber
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscribers</CardTitle>
            <CardDescription>A list of all your email subscribers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscribed At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={3} className="h-12 animate-pulse bg-muted/50" />
                    </TableRow>
                  ))
                ) : subscribers.length > 0 ? (
                  subscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-medium">{subscriber.email}</TableCell>
                      <TableCell>
                        <Badge variant={subscriber.status === 'active' ? 'default' : 'destructive'}>
                          {subscriber.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(subscriber.subscribedAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      No subscribers found.
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
