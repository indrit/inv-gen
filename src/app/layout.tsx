import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { APP_NAME, DEFAULT_LOGO } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import PwaRegistration from '@/components/pwa/PwaRegistration';
import { CookieBanner } from '@/components/layout/CookieBanner';

const viewport: Viewport = {
  themeColor: '#2E3A87',
};

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: 'Free Online Invoice Generator - Create and download professional invoices and estimates for free. Fast, simple, and SEO-optimized for your business needs.',
  keywords: [
    'Free online generator',
    'free invoice generator',
    'free estimate generator',
    'free online estimate generator',
    'free invoice maker',
    'free estimate maker',
    'professional invoice creator',
    'billing software free',
    'online invoicing tool',
    'small business invoice',
    'invoice template free',
    'estimate template free',
    'business documents generator'
  ],
  icons: {
    icon: DEFAULT_LOGO,
    apple: DEFAULT_LOGO,
  },
  manifest: '/manifest.json',
  metadataBase: new URL('https://freeonline-invoice-generator.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://freeonline-invoice-generator.com',
    siteName: APP_NAME,
    title: 'Free Online Invoice Generator - Create Professional Invoices Fast',
    description: 'Create and download professional invoices and estimates for free. Fast, simple, and SEO-optimized for your business needs.',
    images: [
      {
        url: DEFAULT_LOGO,
        width: 512,
        height: 512,
        alt: APP_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Invoice Generator',
    description: 'Create and download professional invoices and estimates for free. Fast, simple, and SEO-optimized for your business needs.',
    images: [DEFAULT_LOGO],
  },
  other: {
    'google-site-verification': 'your-verification-code', // User should replace this
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': APP_NAME,
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={DEFAULT_LOGO} />
        <link rel="apple-touch-icon" href={DEFAULT_LOGO} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <meta name="google-adsense-account" content="ca-pub-2333095168156324" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2333095168156324"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body 
        className={cn('font-body antialiased')}
        suppressHydrationWarning={true}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-C3PJRS5J0T"
          strategy="afterInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17986047423"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-C3PJRS5J0T');
            gtag('config', 'AW-17986047423');
          `}
        </Script>
        <PwaRegistration />
        <FirebaseClientProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
          <CookieBanner />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
