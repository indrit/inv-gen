import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/blog';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPostCardProps {
  post: Post;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const displayDate = post.publishDate || post.createdAt;

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <Card className="flex h-full flex-col overflow-hidden transition-all group-hover:shadow-xl group-hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={post.featuredImageUri}
              alt={post.title}
              fill
              className="object-cover"
              data-ai-hint="blog post"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-6">
          <CardTitle className="mb-2 text-xl font-bold leading-snug font-headline group-hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
          <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
        </CardContent>
        <CardFooter className="p-6 pt-0">
           <div className="flex items-center justify-between w-full text-sm">
                <p className="text-muted-foreground">{format(new Date(displayDate), 'PPP')}</p>
                <div className="flex items-center font-semibold text-primary">
                    Read more
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
            </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
