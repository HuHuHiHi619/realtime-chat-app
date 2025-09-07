import z from "zod";

// ===== PARAMS SCHEMAS =====
export const paramsCommentSchema = z.object({
  post_id: z.string().transform((val) => parseInt(val)), // ✅ เพิ่ม transform
});

// ===== QUERY SCHEMAS =====
export const getCommentQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, "Page ต้องเป็นตัวเลข")
    .transform((val) => parseInt(val))
    .default(1), // ✅ default เป็น string ก่อน transform

  limit: z
    .string()
    .regex(/^\d+$/, "Limit ต้องเป็นตัวเลข")
    .transform((val) => parseInt(val))
    .refine((val) => val <= 50, "Limit ไม่ควรเกิน 50") // ✅ เพิ่ม limit protection
    .default(2), // ✅ default เป็น string ก่อน transform
});

// ===== BODY SCHEMAS =====

export const commentSchema = z
  .object({
    id: z.number().int().positive(),
    content: z.string().min(1).max(5000),
    created_at: z.string().transform((str) => new Date(str)),
    updated_at: z
      .string()
      .transform((str) => new Date(str))
      .nullable(),
    author_id: z.number().int().positive(),
    post_id: z.number().int().positive(),
    _count: z.object({
      likes: z.number(), // Like ของ Comment
    }),
  })
  .transform((data) => ({
    ...data,
    likes: data._count.likes,
  }));

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "เนื้อหา Comment ไม่สามารถว่างเปล่าได้")
    .max(2000, "เนื้อหา Comment ต้องไม่เกิน 2000 ตัวอักษร")
    .trim(),
});

// ===== REPOSITORY LAYER SCHEMAS =====
export const getCommentRepoSchema = z.object({
  author_id: z.number(),
  post_id: z.number(),
  skip: z.number().min(0),
  take: z.number().min(1).max(50), // ✅ เปลี่ยนจาก limit เป็น take + เพิ่ม validation
});

export const createCommentRepoSchema = z.object({
  author_id: z.number(),
  post_id: z.number(),
  content: z.string().min(1).max(2000),
});

// ===== VALIDATION SCHEMAS =====
export const validateGetCommentsRequest = {
  params: paramsCommentSchema,
  query: getCommentQuerySchema,
};

export const validateCreateCommentRequest = {
  params: paramsCommentSchema, // ถ้าใช้ POST /posts/:post_id/comments
  body: createCommentSchema,
};

// หรือถ้าใช้ POST /comments (post_id ใน body)
export const validateCreateCommentDirectRequest = {
  body: createCommentSchema,
};
