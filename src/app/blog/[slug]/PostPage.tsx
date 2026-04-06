'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Post } from '@/lib/blog';
import { Calendar, Loader2, ShieldAlert } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { collection, doc, increment, updateDoc, query, where, limit, getDocs } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/firebase/utils';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState, useMemo } from 'react';
import AdSense from '@/components/ads/AdSense';

export default function PostPage({ slug }: { slug: string }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const isAdmin = user?.email === 'indritzaganjori@gmail.com';
  
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewCountIncremented, setViewCountIncremented] = useState(false);

  useEffect(() => {
    if (!firestore || !slug) {
      setIsLoading(false);
      return;
    }

    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const postQuery = query(collection(firestore, 'blogPosts'), where('slug', '==', slug), limit(1));
        const snapshot = await getDocs(postQuery);

        if (snapshot.empty) {
          setPost(null);
        } else {
          const postData = { ...snapshot.docs[0].data() as Post, id: snapshot.docs[0].id };
          setPost(postData);
        }
      } catch (error) {
        console.error("Failed to fetch post. This might be due to a missing Firestore index. Please check the browser console for a link to create it.", error);
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [firestore, slug]);

  useEffect(() => {
    if (post && !isLoading && !viewCountIncremented && firestore) {
      // Only increment for published posts viewed by a logged-in, non-admin user.
      if (user && post.status === 'Published' && !isAdmin) {
        const postRef = doc(firestore, 'blogPosts', post.id);
        updateDoc(postRef, {
          viewCount: increment(1)
        }).then(() => {
          setViewCountIncremented(true);
        }).catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, postRef.path);
          setViewCountIncremented(true); // Prevent retries
        });
      } else {
        setViewCountIncremented(true);
      }
    }
  }, [post, isLoading, viewCountIncremented, firestore, user, isAdmin]);

  const contentWithAds = useMemo(() => {
    if (!post?.content) return null;
    
    const paragraphs = post.content.split('</p>');
    const result = [];
    
    for (let i = 0; i < paragraphs.length; i++) {
      if (paragraphs[i].trim()) {
        const html = paragraphs[i] + '</p>';
        result.push(
          <div 
            key={`chunk-${i}`} 
            dangerouslySetInnerHTML={{ __html: html }} 
          />
        );
      }
      
      // Insert horizontal ad after every 4 paragraphs
      if ((i + 1) % 4 === 0 && i !== paragraphs.length - 1) {
        result.push(<AdSense key={`ad-in-content-${i}`} adSlot="7503131866" />);
      }
    }
    return result;
  }, [post?.content]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  if (post.status !== 'Published' && !isAdmin) {
    notFound();
  }

  const isDraft = post.status === 'Draft';

  return (
    <article className="container mx-auto px-4 py-8 sm:py-12 max-w-[1600px]">
      <div className="flex flex-col xl:flex-row gap-8 items-start justify-center">
        {/* Left Side Vertical Ad */}
        <div className="hidden xl:block w-[160px] flex-shrink-0 sticky top-24 pt-32">
          <AdSense adSlot="1686135305" className="my-0" />
        </div>

        <div className="flex-1 w-full max-w-3xl">
          {isDraft && isAdmin && (
            <div className="mb-6 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-yellow-500 bg-yellow-50 p-4 text-yellow-700">
              <ShieldAlert className="h-5 w-5" />
              <p className="text-sm font-medium">This is a draft preview. This post is not visible to the public.</p>
            </div>
          )}
          
          <div className="mb-8">
            <h1 className="mb-4 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(post.publishDate || post.createdAt), 'PPP')}</span>
              </div>
              {isDraft && <Badge variant="destructive">Draft</Badge>}
            </div>
          </div>

          <AdSense adSlot="7503131866" className="mb-8" />

          <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg md:h-96">
            <Image
              src={post.featuredImageUri}
              alt={post.title}
              fill
              className="object-cover"
              priority
              data-ai-hint="blog post"
            />
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 font-body">
            {contentWithAds}
          </div>

          <AdSense adSlot="7503131866" className="mt-8" />
        </div>

        {/* Right Side Vertical Ad */}
        <div className="hidden xl:block w-[160px] flex-shrink-0 sticky top-24 pt-32">
          <AdSense adSlot="1686135305" className="my-0" />
        </div>
      </div>
    </article>
  );
}
