'use server';
/**
 * @fileOverview A Genkit flow for generating SEO keywords based on a blog post topic.
 *
 * - generateSeoKeywords - A function that handles the SEO keyword generation process.
 * - GenerateSeoKeywordsInput - The input type for the generateSeoKeywords function.
 * - GenerateSeoKeywordsOutput - The return type for the generateSeoKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSeoKeywordsInputSchema = z.object({
  blogPostTopic: z.string().describe('The topic of the blog post for which to generate SEO keywords.'),
});
export type GenerateSeoKeywordsInput = z.infer<typeof GenerateSeoKeywordsInputSchema>;

const GenerateSeoKeywordsOutputSchema = z.object({
  keywords: z.array(z.string()).describe('A list of relevant and high-ranking SEO keywords for the given blog post topic.'),
});
export type GenerateSeoKeywordsOutput = z.infer<typeof GenerateSeoKeywordsOutputSchema>;

export async function generateSeoKeywords(input: GenerateSeoKeywordsInput): Promise<GenerateSeoKeywordsOutput> {
  return generateSeoKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSeoKeywordsPrompt',
  input: {schema: GenerateSeoKeywordsInputSchema},
  output: {schema: GenerateSeoKeywordsOutputSchema},
  prompt: `You are an expert SEO specialist. Your task is to generate a list of relevant and high-ranking SEO keywords for a given blog post topic.

The keywords should be highly discoverable and target potential customers.

Blog Post Topic: {{{blogPostTopic}}}

Provide the keywords as a JSON array of strings.`,
});

const generateSeoKeywordsFlow = ai.defineFlow(
  {
    name: 'generateSeoKeywordsFlow',
    inputSchema: GenerateSeoKeywordsInputSchema,
    outputSchema: GenerateSeoKeywordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
