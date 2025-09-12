import z from "zod";
import { paginationSchema } from "../chat/message.schema";

// ===== PARAMS SCHEMAS =====
export const paramsPostSchema = z.object({
  post_id: z.coerce.number().int().positive(),
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
  created_at: z.string().transform((str) => new Date(str)),
  updated_at: z.string().transform((str) => new Date(str)).nullable(),
  author: z.object({
     id: z.number().int().positive(),
                username : z.string(),
                display_name: z.string().nullable(),
                avatar_url: z.string().nullable()
  }),
  _count : z.object({
    likes : z.number(),
    comments : z.number()
  })
}).transform((data) => ({
  ...data,
  likes: data._count.likes,
  comments: data._count.comments,
}));


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

