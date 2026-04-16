import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("Email invalide").min(5).max(255),
  password: z.string().min(8, "Min. 8 caractères").max(255),
  firstName: z.string().min(1, "Prénom requis").max(100).optional(),
  lastName: z.string().min(1, "Nom requis").max(100).optional(),
});

export const profileSchema = z.object({
  first_name: z.string().max(100, "Max 100 caractères").optional().or(z.literal("")),
  last_name: z.string().max(100, "Max 100 caractères").optional().or(z.literal("")),
  nickname: z.string().max(100, "Max 100 caractères").optional().or(z.literal("")),
  username: z.string().min(3, "Min 3 caractères").max(50, "Max 50 caractères").optional().or(z.literal("")),
  bio: z.string().max(500, "Max 500 caractères").optional().or(z.literal("")),
  location: z.string().max(100, "Max 100 caractères").optional().or(z.literal("")),
});

export const chatInputSchema = z.object({
  content: z.string().min(1, "Message requis").max(5000, "Max 5000 caractères"),
});

export const articleSchema = z.object({
  title: z.string().min(5, "Min 5 caractères").max(200, "Max 200 caractères"),
  slug: z.string().min(3, "Min 3 caractères").max(100, "Max 100 caractères").regex(/^[a-z0-9-]+$/, "Slug invalide"),
  category: z.string().min(1, "Catégorie requise"),
  summary: z.string().min(10, "Min 10 caractères").max(500, "Max 500 caractères").optional().or(z.literal("")),
  is_premium: z.boolean().optional(),
});

export type AuthFormData = z.infer<typeof authSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ChatInputData = z.infer<typeof chatInputSchema>;
export type ArticleFormData = z.infer<typeof articleSchema>;
