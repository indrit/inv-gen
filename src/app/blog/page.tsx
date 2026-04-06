import { Metadata } from 'next';
import BlogListing from './BlogListing';

export const metadata: Metadata = {
  title: 'Our Blog - Invoicing Tips and Business Growth Insights',
  description: 'Read our latest articles on invoicing, business management, and productivity. Expert advice for freelancers and small businesses.',
  keywords: 'Free online generator, invoicing tips, business growth, freelance advice, small business management, invoice maker blog, professional invoicing advice',
};

export default function Page() {
  return <BlogListing />;
}
