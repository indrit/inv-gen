'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Bot, Loader2, Wand2, Sparkles, Save, Send, UploadCloud, FilePlus, Edit, Trash2 } from 'lucide-react';
import { addDoc, collection, doc, orderBy, query, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { handleFirestoreError, OperationType } from '@/firebase/utils';
import Image from 'next/image';
import { format } from 'date-fns';

import {
  generateBlogPostOutline,
  GenerateBlogPostOutlineOutput,
} from '@/ai/flows/generate-blog-post-outline';
import {
  generateBlogSectionDraft
} from '@/ai/flows/generate-blog-section-draft';
import { Post } from '@/lib/blog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Skeleton } from '../ui/skeleton';

const topicSchema = z.object({
  topic: z.string().min(10, 'Please provide a more detailed topic.'),
});

type SectionDrafts = { [key: string]: string };

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

export default function BlogManager() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [outline, setOutline] = useState<GenerateBlogPostOutlineOutput | null>(null);
  const [drafts, setDrafts] = useState<SectionDrafts>({});
  const [featuredImageUri, setFeaturedImageUri] = useState('');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  
  const [loadingOutline, setLoadingOutline] = useState(false);
  const [loadingSection, setLoadingSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  
  const imageInputRef = useRef<HTMLInputElement>(null);

  const refetchPosts = () => setFetchTrigger(v => v + 1);

  useEffect(() => {
    if (!firestore || !user) {
        setIsLoadingPosts(false);
        return;
    }

    const fetchPosts = async () => {
        setIsLoadingPosts(true);
        try {
            const postsQuery = query(
                collection(firestore, 'blogPosts'),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(postsQuery);
            const fetchedPosts = snapshot.docs
              .map(doc => ({ ...doc.data() as Post, id: doc.id }))
              .filter(post => post.authorId === user.uid); // Filter client-side
            setPosts(fetchedPosts);
        } catch (error) {
            console.error("Failed to fetch user posts:", error);
            setPosts([]);
        } finally {
            setIsLoadingPosts(false);
        }
    };

    fetchPosts();
  }, [firestore, user, fetchTrigger]);

  const form = useForm<z.infer<typeof topicSchema>>({
    resolver: zodResolver(topicSchema),
    defaultValues: { topic: '' },
  });

  const handleGenerateOutline = async (values: z.infer<typeof topicSchema>) => {
    setLoadingOutline(true);
    setOutline(null);
    setDrafts({});
    setEditingPostId(null); // Stop editing when generating new
    try {
      const result = await generateBlogPostOutline(values);
      setOutline(result);
      toast({ title: 'Outline Generated!', description: 'Your blog post outline is ready.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to generate outline.', variant: 'destructive' });
    } finally {
      setLoadingOutline(false);
    }
  };
  
  const handleGenerateSectionDraft = async (heading: string, points: string[]) => {
    const sectionKey = heading.replace(/\s+/g, '-').toLowerCase();
    setLoadingSection(sectionKey);
    try {
        const result = await generateBlogSectionDraft({
            outlinePoint: `${heading}: ${points.join(', ')}`,
            keywords: outline?.keywords.join(', '),
        });
        setDrafts(prev => ({...prev, [sectionKey]: result.sectionDraft}));
        toast({ title: `Draft for "${heading}" generated.` });
    } catch (error) {
        console.error(error);
        toast({ title: 'Error', description: 'Failed to generate section draft.', variant: 'destructive' });
    } finally {
        setLoadingSection(null);
    }
  }

  const handleImageUploadClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Image too large',
          description: 'Please upload an image smaller than 5MB.',
          variant: 'destructive',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImageUri(reader.result as string);
        toast({ title: 'Image Selected', description: 'Your image will be used for the blog post.' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateNew = () => {
    setEditingPostId(null);
    setOutline(null);
    setDrafts({});
    setFeaturedImageUri('');
    form.reset();
  }

  const handleEdit = (post: Post) => {
    if (post.outline && post.drafts) {
      setEditingPostId(post.id);
      // Create a deep copy to avoid direct mutation of useCollection data
      setOutline(JSON.parse(JSON.stringify(post.outline)));
      setDrafts(JSON.parse(JSON.stringify(post.drafts)));
      setFeaturedImageUri(post.featuredImageUri);
      form.setValue('topic', '');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast({
        title: "Cannot Edit This Post",
        description: "This post was created before the edit feature was available and can't be edited in this view.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (postId: string) => {
    if (!firestore || !window.confirm("Are you sure you want to delete this post? This cannot be undone.")) return;
    setIsSaving(true);
    const postRef = doc(firestore, 'blogPosts', postId);
    try {
      await deleteDoc(postRef);
      toast({ title: "Post Deleted", description: "The post has been successfully deleted." });
      refetchPosts();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, postRef.path);
    } finally {
       setIsSaving(false);
    }
  }

  const handleSavePost = (status: 'Draft' | 'Published') => {
    if (!outline || !user || !firestore) {
      toast({
        title: 'Error',
        description: 'Cannot save post. Missing data, user session, or Firestore instance.',
        variant: 'destructive',
      });
      return;
    }
    setIsSaving(true);

    const contentHtml = outline.sections
      .map((section) => {
        const sectionKey = section.heading.replace(/\s+/g, '-').toLowerCase();
        const draft = drafts[sectionKey];
        const sectionContent = draft
          ? `<p>${draft.replace(/\n/g, '</p><p>')}</p>`
          : `<ul>${section.points.map((p) => `<li>${p}</li>`).join('')}</ul>`;
        return `<h2>${section.heading}</h2>\n${sectionContent}`;
      })
      .join('\n');

    const conclusionHtml = `<h2>Conclusion</h2><ul>${outline.conclusion.map((p) => `<li>${p}</li>`).join('')}</ul>`;
    const fullContent = `${contentHtml}\n${conclusionHtml}`;

    const postPayload = {
      title: outline.title,
      slug: slugify(outline.title),
      content: fullContent,
      excerpt: outline.metaDescription,
      seoTitle: outline.title,
      seoDescription: outline.metaDescription,
      seoKeywords: outline.keywords.join(', '),
      featuredImageUri: featuredImageUri || `https://picsum.photos/seed/${slugify(outline.title)}/1200/800`,
      status: status,
      authorId: user.uid,
      publishDate: status === 'Published' ? new Date().toISOString() : '',
      updatedAt: new Date().toISOString(),
      outline: outline, // Save the outline structure
      drafts: drafts, // Save the drafts
    };

    if (editingPostId) {
      // Update existing post
      const postRef = doc(firestore, 'blogPosts', editingPostId);
      updateDoc(postRef, postPayload)
        .then(() => {
          toast({ title: 'Post Updated!', description: `Your post "${outline.title}" has been saved.` });
          handleCreateNew();
          refetchPosts();
        })
        .catch((serverError) => {
          handleFirestoreError(serverError, OperationType.UPDATE, postRef.path);
        })
        .finally(() => setIsSaving(false));
    } else {
      // Create new post
      const blogPostsCollection = collection(firestore, 'blogPosts');
      const newPostPayload = { ...postPayload, createdAt: new Date().toISOString(), viewCount: 0 };
      addDoc(blogPostsCollection, newPostPayload)
        .then(() => {
          toast({
            title: `Post ${status === 'Published' ? 'Published' : 'Saved'}!`,
            description: `Your post "${outline.title}" has been created.`,
          });
          handleCreateNew();
          refetchPosts();
        })
        .catch((serverError) => {
          handleFirestoreError(serverError, OperationType.CREATE, blogPostsCollection.path);
        })
        .finally(() => setIsSaving(false));
    }
  };


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bot /> {editingPostId ? `Editing Post` : 'AI Content Generator'}
              </CardTitle>
              <CardDescription>
                {editingPostId 
                  ? "Modify the generated content below or generate new drafts for sections."
                  : "Start by entering a topic for your blog post. Our AI will generate a complete, SEO-optimized outline."
                }
              </CardDescription>
            </div>
            {editingPostId && (
               <Button variant="outline" onClick={handleCreateNew}>
                 <FilePlus className="mr-2 h-4 w-4" /> Create New Post
               </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerateOutline)} className="flex items-start gap-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel className="sr-only">Blog Post Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'The importance of cash flow for small businesses'" {...field} disabled={!!editingPostId} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loadingOutline || !!editingPostId}>
                {loadingOutline ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate Outline
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {outline && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Post</CardTitle>
            <CardDescription>Review and edit the generated content below. You can generate drafts for each section and then publish.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={outline.title} onChange={(e) => setOutline(prev => prev ? ({...prev, title: e.target.value}) : null)} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea id="metaDescription" value={outline.metaDescription} onChange={(e) => setOutline(prev => prev ? ({...prev, metaDescription: e.target.value}) : null)} />
            </div>
            <div className="space-y-2">
              <Label>Featured Image</Label>
              <div
                onClick={handleImageUploadClick}
                className="relative flex justify-center items-center w-full h-64 border-2 border-dashed rounded-md cursor-pointer hover:border-primary text-muted-foreground"
              >
                {featuredImageUri ? (
                  <Image
                    src={featuredImageUri}
                    alt="Featured image preview"
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-8 w-8" />
                    <p className="text-sm">Upload an Image</p>
                    <p className="text-xs">Click to browse (max 700KB)</p>
                  </div>
                )}
              </div>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
             <div className="space-y-2">
                <Label>SEO Keywords</Label>
                <div className="flex flex-wrap gap-2">
                    {outline.keywords.map(kw => <Badge key={kw} variant="secondary">{kw}</Badge>)}
                </div>
            </div>

            <Accordion type="single" collapsible className="w-full" defaultValue={outline.sections.length > 0 ? outline.sections[0].heading.replace(/\s+/g, '-').toLowerCase() : undefined}>
              {outline.sections.map((section) => {
                const sectionKey = section.heading.replace(/\s+/g, '-').toLowerCase();
                return (
                  <AccordionItem value={sectionKey} key={sectionKey}>
                    <AccordionTrigger>{section.heading}</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                        {section.points.map(point => <li key={point}>{point}</li>)}
                      </ul>
                      
                      <Button variant="outline" size="sm" onClick={() => handleGenerateSectionDraft(section.heading, section.points)} disabled={loadingSection === sectionKey}>
                        {loadingSection === sectionKey ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                        Generate Section Draft
                      </Button>
                      
                      {drafts[sectionKey] && (
                        <div className="space-y-2 pt-4">
                            <Label htmlFor={`draft-${sectionKey}`}>Generated Draft</Label>
                            <Textarea id={`draft-${sectionKey}`} value={drafts[sectionKey]} className="h-48" onChange={(e) => setDrafts(prev => ({...prev, [sectionKey]: e.target.value}))}/>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
              <AccordionItem value="conclusion">
                    <AccordionTrigger>Conclusion</AccordionTrigger>
                    <AccordionContent>
                         <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                            {outline.conclusion.map(point => <li key={point}>{point}</li>)}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
          </CardContent>
          <CardFooter className='flex justify-end gap-4'>
            <Button variant="outline" onClick={() => handleSavePost('Draft')} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save />}
              Save Draft
            </Button>
             <Button onClick={() => handleSavePost('Published')} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send />}
              {editingPostId ? 'Publish Changes' : 'Publish Post'}
            </Button>
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Blog Posts</CardTitle>
          <CardDescription>Manage your existing blog posts here.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingPosts && (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              )}
              {posts && posts.length > 0 ? (
                posts.map(post => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell><Badge variant={post.status === 'Published' ? 'default' : 'secondary'}>{post.status}</Badge></TableCell>
                    <TableCell>{post.viewCount || 0}</TableCell>
                    <TableCell>{format(new Date(post.createdAt), 'PP')}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(post)} className="mr-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)} disabled={isSaving}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                !isLoadingPosts && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      You haven't created any posts yet.
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
