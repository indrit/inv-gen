import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - Invoice Generator',
  description: 'How we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Privacy Policy</h1>
      <p className="text-gray-500 mb-12 italic text-sm">Last Updated: April 6, 2026</p>
      
      <div className="prose prose-blue max-w-none space-y-10 text-gray-700">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">1. Information We Collect</h2>
          <p className="leading-relaxed mb-4">
            We collect information you provide directly to us when you create an account, generate an invoice, or communicate with us. This may include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><span className="font-semibold text-gray-900">Account Information:</span> Your name, email address, and account settings.</li>
            <li><span className="font-semibold text-gray-900">Document Data:</span> Information you enter into invoices, including client names, addresses, and line item details.</li>
            <li><span className="font-semibold text-gray-900">Payment Information:</span> If you upgrade to a premium plan, payment details are processed by Stripe. We do not store your full credit card information.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">2. How We Use Information</h2>
          <p className="leading-relaxed">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our services.</li>
            <li>Generate your invoices and estimates.</li>
            <li>Process transactions and send related information.</li>
            <li>Send you technical notices, updates, security alerts, and support messages.</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our services.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">3. Cookies and Advertising</h2>
          <p className="leading-relaxed">
            We use cookies to improve your user experience and for advertising purposes. We use Google AdSense to serve ads on our site. Google uses cookies to serve ads based on your previous visits to our website or other websites. You may opt-out of personalized advertising by visiting Ad Settings or your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">4. Third Parties</h2>
          <p className="leading-relaxed mb-4">
            We may share information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf, such as:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Stripe for payment processing.</li>
            <li>Google for authentication and advertising.</li>
            <li>Firebase for database and hosting.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">5. Data Security</h2>
          <p className="leading-relaxed">
            We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">6. Data Retention</h2>
          <p className="leading-relaxed">
            We store the information we collect for as long as it is necessary for the purposes for which we originally collected it. For guest users, data may be stored based on IP addresses for a limited time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">7. Contact Us</h2>
          <p className="leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at privacy@example.com (replace with your support email).
          </p>
        </section>

        <div className="pt-12 border-t font-medium">
          <Link href="/" className="text-primary hover:underline font-bold">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
