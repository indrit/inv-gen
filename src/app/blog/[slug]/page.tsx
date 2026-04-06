import { Metadata } from 'next';
import PostPage from './PostPage';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { Post } from '@/lib/blog';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    // Note: Using client SDK on server side for public data
    const postQuery = query(collection(db, 'blogPosts'), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(postQuery);

    if (snapshot.empty) {
      return {
        title: 'Post Not Found',
      };
    }

    const post = snapshot.docs[0].data() as Post;

    return {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.title,
      keywords: post.seoKeywords || '',
      openGraph: {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.title,
        images: [post.featuredImageUri],
        type: 'article',
        publishedTime: post.publishDate || post.createdAt,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.title,
        images: [post.featuredImageUri],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post',
    };
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <PostPage slug={slug} />;
}
