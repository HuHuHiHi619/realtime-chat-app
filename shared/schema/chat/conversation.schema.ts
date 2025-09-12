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

// 🔹 Input 
export const createConversationSchema = z.discriminatedUnion('type',[
  z.object({
    type: z.literal("PRIVATE"),
    participants : z.array(z.number().int().positive()).length(1, "PRIVATE must have exactly 1 participant"),
    name : z.never().optional()
  }),
  z.object({
    type : z.literal("GROUP"),
    participants : z.array(z.number().int().positive()).min(2, "GROUP must have at least 2 participants"),
    name : z.string().min(1 , 'Group name must be at least 1 character')
  })
])

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
