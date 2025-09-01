import z from "zod";
import { paginationSchema } from "../chat/message.schema";

// ===== PARAMS SCHEMAS =====
export const paramsPostSchema = z.object({
  post_id: z.string().transform((val) => parseInt(val)),
});

// ===== QUERY SCHEMAS =====
export const getPostQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, "Page ต้องเป็นตัวเลข")
    .transform((val) => parseInt(val))
    .default(1),

  limit: z
    .string()
    .regex(/^\d+$/, "Limit ต้องเป็นตัวเลข")
    .transform((val) => parseInt(val))
    .refine((val) => val <= 50, "Limit ไม่ควรเกิน 50")
    .default(20),
});

// ===== BODY SCHEMAS =====
export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "เนื้อหาโพสต์ไม่สามารถว่างเปล่าได้")
    .max(5000, "เนื้อหาโพสต์ต้องไม่เกิน 5000 ตัวอักษร")
    .trim(),
});

// ===== REPOSITORY LAYER SCHEMAS =====
export const getPostRepoSchema = z.object({
  author_id: z.number(),
  skip: z.number().min(0),
  take: z.number().min(1).max(50),
});

export const createPostRepoSchema = z.object({
  author_id: z.number(),
  content: z.string().min(1).max(5000),
});

// ===== ENTITY SCHEMA =====
export const postSchema = z.object({
  id: z.number().int().positive(),
  content: z.string().min(1).max(5000),
  created_at: z.date(),
  updated_at: z.date().nullable(),
  author_id: z.number().int().positive(),
});

// ===== VALIDATION SCHEMAS =====
export const validateGetPostsRequest = {
  query: getPostQuerySchema,
};

export const validateGetPostByIdRequest = {
  params: paramsPostSchema,
};

export const validateCreatePostRequest = {
  body: createPostSchema,
};

// ===== FRONTEND =====
export const paginatedPostSchema = z.object({
   pagination : paginationSchema,
   posts : z.array(postSchema)
});

