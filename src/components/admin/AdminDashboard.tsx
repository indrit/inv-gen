'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users, Mail, Layout } from 'lucide-react';
import BlogManager from './BlogManager';
import CRMManager from './CRMManager';
import EmailMarketingManager from './EmailMarketingManager';
import CMSContentManager from './CMSContentManager';

export default function AdminDashboard() {
  return (
    <Tabs defaultValue="blog" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="blog" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" /> Blog
        </TabsTrigger>
        <TabsTrigger value="crm" className="flex items-center gap-2">
          <Users className="h-4 w-4" /> CRM
        </TabsTrigger>
        <TabsTrigger value="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" /> Email
        </TabsTrigger>
        <TabsTrigger value="cms" className="flex items-center gap-2">
          <Layout className="h-4 w-4" /> CMS Content
        </TabsTrigger>
      </TabsList>

      <TabsContent value="blog">
        <BlogManager />
      </TabsContent>

      <TabsContent value="crm">
        <CRMManager />
      </TabsContent>

      <TabsContent value="email">
        <EmailMarketingManager />
      </TabsContent>

      <TabsContent value="cms">
        <CMSContentManager />
      </TabsContent>
    </Tabs>
  );
}
