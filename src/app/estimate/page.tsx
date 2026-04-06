import { Metadata } from 'next';
import EstimatePage from './EstimatePage';

export const metadata: Metadata = {
  title: 'Free Estimate Generator - Professional Business Estimates',
  description: 'Create professional estimates for your clients in seconds. Free, easy to use, and SEO-optimized for your business needs.',
  keywords: 'Free online generator, free estimate generator, free online estimate generator, free estimate maker, professional business estimates, business quotes, professional quotes',
};

export default function Page() {
  return <EstimatePage />;
}
