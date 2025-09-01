import { z } from "zod";

// 🔹 Subschemas
export const participantUserSchema = z.object({
  id: z.number().int(),
  username: z.string(),
});

export const previewMessageSchema = z.object({
  id: z.number(),
  content: z.string(),
  sent_at: z.string().transform((str) => new Date(str)),
  sender_id: z.number(),
});

// 🔹 Input (used from client)
export const createConversationSchema = z.object({
  type: z.enum(["PRIVATE", "GROUP"]),
  name: z.string().optional().nullable(),
  user_id: z.number(),
  participants: z
    .array(z.number().int().positive())
    .min(1, "participants must be at least 1"),
});

// 🔹 Query / Params 
export const paramsConversationSchema = z.object({
  conversation_id: z
    .string()
    .regex(/^\d+$/, "conversation_id must be a number")
    .transform((val) => parseInt(val))
});

export const queryConversationSchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, "page must be a number")
    .optional()
    .transform((val) => parseInt(val || "1")),
});



// ===== FRONTEND =====
export const conversationSchema = z.object({
    conversation_id: z.number(),
    friend: participantUserSchema,
    last_message: previewMessageSchema.optional().nullable(),
  
});

export const activeConversationSchema = z.object({
  conversation_id: z.number(),
  conversation_name: z.string(),
  conversation_type: z.enum(["PRIVATE", "GROUP"]),
  participants: z.array(participantUserSchema),
  last_message: previewMessageSchema.optional().nullable(),
});
