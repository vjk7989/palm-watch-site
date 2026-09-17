import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const sourceSchema = z.object({
  label: z.string(),
  url: z.url(),
  publisher: z.string(),
  year: z.number().int(),
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    author: z.literal("PalmWatch Research Team"),
    tags: z.array(z.string()).min(1),
    heroImage: z.string(),
    heroAlt: z.string(),
    readingMinutes: z.number().int().positive(),
    featured: z.boolean().default(false),
    sources: z.array(sourceSchema).min(1),
    faqs: z.array(faqSchema).default([]),
  }),
});

export const collections = { blog };
