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

export const trackingSchema = z.object({
  path: z.string().min(1).max(2048),
  language: z.enum(["en", "fr", "skt", "lin", "swa", "tsh"]),
  user_id: z.string().uuid().optional().or(z.null()),
  session_id: z.string().optional().or(z.null()),
  referrer: z.string().max(2048).optional().or(z.null()),
  user_agent: z.string().optional().or(z.null()),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const pushSubscribeSchema = z.object({
  endpoint: z.string().url(),
  p256dh: z.string(),
  auth: z.string(),
});

export const pushUnsubscribeSchema = z.object({
  endpoint: z.string().url(),
});

export const contributionRequestSchema = z.object({
  requestType: z.enum(["article_writer", "contributor"]),
  message: z.string().max(5000).optional().or(z.literal("")).or(z.null()),
});

export const chatMessageDeleteSchema = z.object({
  mode: z.enum(["self", "all"]),
});

export const chatMessageEditSchema = z.object({
  content: z.string().min(1, "Message requis").max(5000, "Max 5000 caractères"),
});

export const emailNotifySchema = z.object({
  subject: z.string().min(1).max(200).optional(),
  updateType: z.string().min(1).max(100),
});

export const pushNotifySchema = z.object({
  subscription: z.object({
    endpoint: z.string().url(),
    keys: z.object({
      p256dh: z.string(),
      auth: z.string(),
    }),
  }),
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(500),
  icon: z.string().url().optional(),
  badge: z.string().url().optional(),
  tag: z.string().max(100).optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export const stripeCheckoutSchema = z.object({
  priceId: z.string().min(1),
  mode: z.enum(["subscription", "payment"]).optional(),
});

export const stripePortalSchema = z.object({
  returnUrl: z.string().url(),
});

export const stripeVerifySessionSchema = z.object({
  sessionId: z.string().min(1),
});

export const revalidateSchema = z.object({
  tag: z.string().min(1).optional(),
  path: z.string().min(1).optional(),
}).refine(obj => obj.tag || obj.path, {
  message: "Either tag or path must be provided",
});

export const ecoleSemanticContentSchema = z.object({
  chapter: z.string().min(1).max(1000),
  gradeLevel: z.string().optional(),
});

export const pushNotifyRouteSchema = z.object({
  conversationId: z.string().uuid("ID de conversation invalide"),
  senderName: z.string().min(1, "Nom de l'expéditeur requis").max(200),
  messagePreview: z.string().max(500).optional(),
  senderId: z.string().uuid("ID de l'expéditeur invalide"),
});

export type AuthFormData = z.infer<typeof authSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ChatInputData = z.infer<typeof chatInputSchema>;
export type ArticleFormData = z.infer<typeof articleSchema>;
export type TrackingData = z.infer<typeof trackingSchema>;
export type PushSubscribeData = z.infer<typeof pushSubscribeSchema>;
export type PushUnsubscribeData = z.infer<typeof pushUnsubscribeSchema>;
export type ContributionRequestData = z.infer<typeof contributionRequestSchema>;
export type ChatMessageDeleteData = z.infer<typeof chatMessageDeleteSchema>;
export type ChatMessageEditData = z.infer<typeof chatMessageEditSchema>;
export type EmailNotifyData = z.infer<typeof emailNotifySchema>;
export type PushNotifyData = z.infer<typeof pushNotifySchema>;
export type StripeCheckoutData = z.infer<typeof stripeCheckoutSchema>;
export type StripePortalData = z.infer<typeof stripePortalSchema>;
export type StripeVerifySessionData = z.infer<typeof stripeVerifySessionSchema>;
export type RevalidateData = z.infer<typeof revalidateSchema>;
export type EcoleSemanticContentData = z.infer<typeof ecoleSemanticContentSchema>;
