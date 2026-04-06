import AdminDashboard from '@/components/admin/AdminDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage your blog, CRM, email marketing, and CMS content.',
};

export default function AdminPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Admin Dashboard</h1>
      <AdminDashboard />
    </div>
  );
}
