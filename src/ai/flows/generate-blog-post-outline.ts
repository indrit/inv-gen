'use server';
/**
 * @fileOverview A Genkit flow for generating a structured, SEO-optimized blog post outline
 * based on a user-provided topic.
 *
 * - generateBlogPostOutline - A function that handles the blog post outline generation process.
 * - GenerateBlogPostOutlineInput - The input type for the generateBlogPostOutline function.
 * - GenerateBlogPostOutlineOutput - The return type for the generateBlogPostOutline function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateBlogPostOutlineInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate a blog post outline.'),
});
export type GenerateBlogPostOutlineInput = z.infer<typeof GenerateBlogPostOutlineInputSchema>;

const GenerateBlogPostOutlineOutputSchema = z.object({
  title: z.string().describe('A catchy and SEO-friendly title for the blog post.'),
  metaDescription: z.string().describe('A concise and engaging meta description for SEO.'),
  keywords: z.array(z.string()).describe('An array of relevant SEO keywords.'),
  sections: z.array(
    z.object({
      heading: z.string().describe('The heading for this section of the blog post.'),
      points: z.array(z.string()).describe('An array of key points to cover in this section.'),
    }),
  ).describe('An array of sections, each with a heading and key points.'),
  conclusion: z.array(z.string()).describe('Key takeaways or a call to action for the conclusion.'),
});
export type GenerateBlogPostOutlineOutput = z.infer<typeof GenerateBlogPostOutlineOutputSchema>;

export async function generateBlogPostOutline(input: GenerateBlogPostOutlineInput): Promise<GenerateBlogPostOutlineOutput> {
  return generateBlogPostOutlineFlow(input);
}

const generateBlogPostOutlinePrompt = ai.definePrompt({
  name: 'generateBlogPostOutlinePrompt',
  input: { schema: GenerateBlogPostOutlineInputSchema },
  output: { schema: GenerateBlogPostOutlineOutputSchema },
  prompt: `You are an expert SEO specialist and blog content strategist. Your task is to create a detailed, SEO-optimized blog post outline based on the provided topic.

The outline should include:
1.  A compelling and SEO-friendly title.
2.  A concise and engaging meta description for search engines.
3.  A list of relevant keywords to target.
4.  A structured list of main sections, each with a clear heading.
5.  Under each section heading, list 3-5 key points or sub-topics that should be covered to make the content comprehensive and valuable.
6.  A conclusion section with key takeaways or a call to action.

Topic: {{{topic}}}`,
});

const generateBlogPostOutlineFlow = ai.defineFlow(
  {
    name: 'generateBlogPostOutlineFlow',
    inputSchema: GenerateBlogPostOutlineInputSchema,
    outputSchema: GenerateBlogPostOutlineOutputSchema,
  },
  async (input) => {
    const { output } = await generateBlogPostOutlinePrompt(input);
    return output!;
  },
);
