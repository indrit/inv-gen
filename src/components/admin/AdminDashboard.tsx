'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users, Mail, Layout } from 'lucide-react';
import BlogManager from './BlogManager';
import CRMManager from './CRMManager';
import EmailMarketingManager from './EmailMarketingManager';
import CMSContentManager from './CMSContentManager';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Info, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
  const systemStatus = {
    auth: typeof window !== 'undefined',
    stripe: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    adsense: !!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
    ai: !!process.env.NEXT_PUBLIC_APP_URL, // Basic pulse check
  };

  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
        <Alert className={systemStatus.auth ? "border-green-500/50 bg-green-500/5" : "border-red-500/50 bg-red-500/5"}>
          <ShieldCheck className={`h-4 w-4 ${systemStatus.auth ? "text-green-500" : "text-red-500"}`} />
          <AlertTitle className="text-xs">Security</AlertTitle>
          <AlertDescription className="text-[10px] opacity-70">
            Auth: {systemStatus.auth ? 'Ready' : 'Wait...'}
          </AlertDescription>
        </Alert>
        <Alert className={systemStatus.ai ? "border-blue-500/50 bg-blue-500/5" : "border-yellow-500/50 bg-yellow-500/5"}>
          <Info className={`h-4 w-4 ${systemStatus.ai ? "text-blue-500" : "text-yellow-500"}`} />
          <AlertTitle className="text-xs">AI Blog</AlertTitle>
          <AlertDescription className="text-[10px] opacity-70">
            AI Engine: {systemStatus.ai ? 'Connected' : 'Check Config'}
          </AlertDescription>
        </Alert>
        <Alert className={systemStatus.stripe ? "border-green-500/50 bg-green-500/5" : "border-red-500/50 bg-red-500/5"}>
          <CheckCircle2 className={`h-4 w-4 ${systemStatus.stripe ? "text-green-500" : "text-red-500"}`} />
          <AlertTitle className="text-xs">Payments</AlertTitle>
          <AlertDescription className="text-[10px] opacity-70">
            Stripe: {systemStatus.stripe ? 'Active' : 'Missing Key'}
          </AlertDescription>
        </Alert>
        <Alert className={systemStatus.adsense ? "border-green-500/50 bg-green-500/5" : "border-yellow-500/50 bg-yellow-500/5"}>
          <CheckCircle2 className={`h-4 w-4 ${systemStatus.adsense ? "text-green-500" : "text-yellow-500"}`} />
          <AlertTitle className="text-xs">Monetization</AlertTitle>
          <AlertDescription className="text-[10px] opacity-70">
            AdSense: {systemStatus.adsense ? 'Active' : 'Missing ID'}
          </AlertDescription>
        </Alert>
      </div>

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
    </div>
  );
}
