// This file defines the shape of a blog post object fetched from Firestore.

export interface Post {
  id: string; // The document ID from Firestore.
  authorId: string;
  title: string;
  slug: string;
  content: string; // Should be an HTML string.
  excerpt: string;
  featuredImageUri: string;
  publishDate: string; // ISO date string.
  status: 'Draft' | 'Published';
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  createdAt: string; // ISO date string.
  updatedAt: string; // ISO date string.
  // Properties for the editor
  outline?: any; 
  drafts?: any;
  // Engagement tracking
  viewCount?: number;
}
