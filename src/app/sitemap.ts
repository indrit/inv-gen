import { MetadataRoute } from 'next';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
import { Post } from '@/lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://freeonline-invoice-generator.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/estimate`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  try {
    const postsQuery = query(collection(db, 'blogPosts'), where('status', '==', 'Published'));
    const snapshot = await getDocs(postsQuery);
    const blogRoutes: MetadataRoute.Sitemap = snapshot.docs.map((doc) => {
      const post = doc.data() as Post;
      return {
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.publishDate || post.createdAt),
        changeFrequency: 'monthly',
        priority: 0.6,
      };
    });

    return [...staticRoutes, ...blogRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticRoutes;
  }
}
