import { z } from "zod";

export const MESSAGE_TYPE = z.enum([
  "TEXT",
  "IMAGE",
  "VIDEO",
  "FILE",
  "SYSTEM",
]);

// ===== PARAMS SCHEMA =====
export const paramsMessageSchema = z.object({
  conversation_id: z
    .string()
    .regex(/^\d+$/, "conversation_id must be a number")
    .transform((val) => parseInt(val))
});

// ===== QUERY SCHEMAS =====
export const getMessageQuerySchema = z.object({
    page: z
        .string()
        .regex(/^\d+$/, "Page ต้องเป็นตัวเลข")
        .transform((val) => parseInt(val))
        .default(1),  // ✅ default เป็น string ก่อน transform
    
    limit: z
        .string()
        .regex(/^\d+$/, "Limit ต้องเป็นตัวเลข")
        .transform((val) => parseInt(val))
        .refine((val) => val <= 50, "Limit ไม่ควรเกิน 50")  // ✅ เพิ่ม limit protection
        .default(20)  // ✅ default เป็น string ก่อน transform
})

// ===== BODY SCHEMAS =====
export const createMessageSchema = z.object({
    content: z
        .string()
        .min(1, "เนื้อหา Comment ไม่สามารถว่างเปล่าได้")
        .max(2000, "เนื้อหา Comment ต้องไม่เกิน 2000 ตัวอักษร")
        .trim(),
    sender_id: z.number().int().positive(),
    message_type: MESSAGE_TYPE.default("TEXT"),
})

// ===== REPOSITORY LAYER SCHEMAS =====
export const getMessageRepoSchema = z.object({
    skip: z.number().min(0),
    take: z.number().min(1).max(50)  // ✅ เปลี่ยนจาก limit เป็น take + เพิ่ม validation
})

export const createMessageRepoSchema = z.object({
    sender_id : z.number(),
    content: z.string().min(1).max(2000),
    message_type : MESSAGE_TYPE
})


// ===== VALIDATION SCHEMAS =====
export const validateGetPostsRequest = {
  params : paramsMessageSchema,
  query: getMessageQuerySchema,
};


export const validateCreatePostRequest = {
  params : paramsMessageSchema,
  body: createMessageSchema,
};

// ===== FRONTEND SCHEMAS =====
export const messageSchema = z.object({
    id: z.number(),
    content: z.string(),
    sender_id: z.number(),  // อาจจะเป็น string
    message_type: MESSAGE_TYPE,
    sent_at: z.string(),
})

export const paginationSchema = z.object({
    page: z.number().default(1),
    limit: z.number().max(50).default(20),
    total: z.number(),
    hasMore: z.boolean(),
})
export const paginatedMessageSchema = z.object({
   pagination : paginationSchema,
   messages : z.array(messageSchema)
});

