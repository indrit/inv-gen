import AdminDashboard from '@/components/admin/AdminDashboard';
import { Metadata } from 'next';
import { isFirebaseAdminReady } from '@/server/firebase-admin';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage your blog, CRM, email marketing, and CMS content.',
};

export default function AdminPage() {
  const ready = isFirebaseAdminReady();

  if (!ready) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuration Required</AlertTitle>
          <AlertDescription>
            The Firebase Admin SDK is not properly initialized. This usually means the 
            <code>projectId</code> is missing from your configuration or environment variables.
            Please check your server logs for more details.
          </AlertDescription>
        </Alert>
        
        <div className="bg-muted p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">How to fix:</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Ensure <code>firebase-applet-config.json</code> exists and has a valid <code>projectId</code>.</li>
            <li>If using Firebase App Hosting, ensure the service account has the necessary permissions.</li>
            <li>Check that your environment variables are correctly set in your hosting provider's dashboard.</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Admin Dashboard</h1>
      <AdminDashboard />
    </div>
  );
}
