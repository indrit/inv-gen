'use client';

import { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, getDocs, where } from 'firebase/firestore';
import BlogPostCard from '@/components/blog/BlogPostCard';
import { Post } from '@/lib/blog';
import { Skeleton } from '@/components/ui/skeleton';
import AdSense from '@/components/ads/AdSense';

export default function BlogListing() {
  const firestore = useFirestore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!firestore) {
      setIsLoading(false);
      return;
    }

    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const postsQuery = query(
          collection(firestore, 'blogPosts'),
          where('status', '==', 'Published')
        );
        const snapshot = await getDocs(postsQuery);
        
        let publishedPosts = snapshot.docs.map(doc => ({ ...doc.data() as Post, id: doc.id }));
        publishedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setPosts(publishedPosts);
      } catch (error) {
        console.error("Failed to fetch blog posts. This might be due to a missing Firestore index. Please check the browser console for a link to create it.", error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [firestore]);


  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <div className="text-center mb-8">
        <AdSense adSlot="7503131866" className="my-0" />
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Our Blog</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Tips, tricks, and insights on invoicing and growing your business.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[225px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
         {!isLoading && posts.length === 0 && (
            <p className="md:col-span-3 text-center text-muted-foreground">No blog posts found.</p>
        )}
      </div>

      <AdSense adSlot="7503131866" />
    </div>
  );
}
