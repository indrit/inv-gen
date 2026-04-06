import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - Invoice Generator',
  description: 'Terms and conditions for using our professional invoice generator service.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <p className="text-gray-500 mb-12 italic">Last Updated: April 6, 2026</p>
      
      <div className="prose prose-blue max-w-none space-y-8 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using our Invoice Generator platform, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
          <p>
            We provide a web-based tool for creating, managing, and downloading invoices and estimates. The "Free" version is supported by advertisements and may include watermarks on generated documents. The "Premium" version provides an ad-free experience and additional customization.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Conduct</h2>
          <p>
            You are solely responsible for the content of the invoices you generate. You agree not to use the service for any illegal purposes or to create fraudulent documents.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Intellectual Property</h2>
          <p>
            The service and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Limitation of Liability</h2>
          <p>
            Our service is provided "as is" without warranty of any kind. In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of any changes by updating the "Last Updated" date at the top of this page.
          </p>
        </section>

        <div className="pt-12 border-t font-medium">
          <Link href="/" className="text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
