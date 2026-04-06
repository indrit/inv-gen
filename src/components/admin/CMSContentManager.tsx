'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, FileText, Layout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

export default function CMSContentManager() {
  const { toast } = useToast();
  const [contentBlocks, setContentBlocks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/cms/content');
      if (!res.ok) {
        throw new Error(`Failed to fetch CMS content: ${res.status}`);
      }
      const data = await res.json();
      setContentBlocks(data);
    } catch (error) {
      console.error('Failed to fetch CMS content:', error);
      toast({ title: 'Error', description: 'Failed to fetch CMS content. Please check if the API endpoints are correctly configured.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/cms/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create content');
      toast({ title: 'Content Created', description: 'New content block has been successfully created.' });
      fetchContent();
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create content.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Content Block</CardTitle>
          <CardDescription>Define a new content block for your website.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddContent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required placeholder="e.g., About Us Section" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (Unique Identifier)</Label>
                <Input id="slug" name="slug" required placeholder="e.g., about-us" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content (HTML or Plain Text)</Label>
              <Textarea id="content" name="content" required className="min-h-[200px]" placeholder="Enter the content block content here..." />
            </div>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
              Create Content Block
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Blocks</CardTitle>
          <CardDescription>Manage your website's content blocks.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={3} className="h-12 animate-pulse bg-muted/50" />
                  </TableRow>
                ))
              ) : contentBlocks.length > 0 ? (
                contentBlocks.map((block) => (
                  <TableRow key={block.id}>
                    <TableCell className="font-medium">{block.title}</TableCell>
                    <TableCell className="font-mono text-xs">{block.slug}</TableCell>
                    <TableCell>{new Date(block.updatedAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                    No content blocks found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
