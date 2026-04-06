'use server';
/**
 * @fileOverview A Genkit flow for generating an initial draft for a specific section of a blog post.
 *
 * - generateBlogSectionDraft - A function that handles the blog section draft generation process.
 * - GenerateBlogSectionDraftInput - The input type for the generateBlogSectionDraft function.
 * - GenerateBlogSectionDraftOutput - The return type for the generateBlogSectionDraft function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogSectionDraftInputSchema = z.object({
  outlinePoint: z
    .string()
    .describe('The specific outline point for which to generate a draft.'),
  keywords: z
    .string()
    .optional()
    .describe('Optional keywords to include in the section draft, comma-separated.'),
});
export type GenerateBlogSectionDraftInput = z.infer<
  typeof GenerateBlogSectionDraftInputSchema
>;

const GenerateBlogSectionDraftOutputSchema = z.object({
  sectionDraft: z.string().describe('The generated draft for the blog post section.'),
});
export type GenerateBlogSectionDraftOutput = z.infer<
  typeof GenerateBlogSectionDraftOutputSchema
>;

export async function generateBlogSectionDraft(
  input: GenerateBlogSectionDraftInput
): Promise<GenerateBlogSectionDraftOutput> {
  return generateBlogSectionDraftFlow(input);
}

const generateBlogSectionDraftPrompt = ai.definePrompt({
  name: 'generateBlogSectionDraftPrompt',
  input: {schema: GenerateBlogSectionDraftInputSchema},
  output: {schema: GenerateBlogSectionDraftOutputSchema},
  prompt: `You are an AI assistant specialized in writing engaging and SEO-friendly blog post sections.
Your task is to write a detailed and coherent draft for a specific section of a blog post based on the provided outline point and optional keywords.
Ensure the draft is well-structured and uses clear, concise language.

Outline Point: {{{outlinePoint}}}

{{#if keywords}}
Keywords to include: {{{keywords}}}
{{/if}}

Write the section draft below, incorporating the outline point and keywords naturally.`,
});

const generateBlogSectionDraftFlow = ai.defineFlow(
  {
    name: 'generateBlogSectionDraftFlow',
    inputSchema: GenerateBlogSectionDraftInputSchema,
    outputSchema: GenerateBlogSectionDraftOutputSchema,
  },
  async input => {
    const {output} = await generateBlogSectionDraftPrompt(input);
    return output!;
  }
);
