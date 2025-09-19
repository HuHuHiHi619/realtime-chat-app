import { z } from "zod";

// 🔹 Reusable sub-schemas
const authorBaseSchema = z.object({
  id: z.number().int().positive(),
  username: z.string(),
  display_name: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
});

const likeSchema = z.object({
  id: z.number().int().positive(),
  created_at: z.string().transform((str) => new Date(str)),
  author_id: z.number().int().positive(),
  post_id: z.number().int().positive().nullable(),
  comment_id: z.number().int().positive().nullable(),
  author: authorBaseSchema.pick({ id: true, username: true }),
});

// 🔹 Comment + Reply
const replySchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.number().int().positive(),
    content: z.string(),
    created_at: z.string().transform((str) => new Date(str)),
    updated_at: z.string().transform((str) => new Date(str)).nullable(),
    author_id: z.number().int().positive(),
    post_id: z.number().int().positive(),
    parent_id: z.number().int().positive().nullable(),
    author: authorBaseSchema,
    likes: z.array(likeSchema),
  })
);

const commentSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.number().int().positive(),
    content: z.string(),
    created_at: z.string().transform((str) => new Date(str)),
    updated_at: z.string().transform((str) => new Date(str)).nullable(),
    author_id: z.number().int().positive(),
    post_id: z.number().int().positive(),
    parent_id: z.number().int().positive().nullable(),
    author: authorBaseSchema,
    likes: z.array(likeSchema),
    replies: z.array(replySchema),
  })
);

// 🔹 SinglePost schema
export const singlePostSchema = z.object({
  id: z.number().int().positive(),
  content: z.string().min(1).max(5000),
  created_at: z.string().transform((str) => new Date(str)),
  updated_at: z.string().transform((str) => new Date(str)).nullable(),
  author_id: z.number().int().positive(),
  author: authorBaseSchema,
  medias: z.array(z.any()), // ถ้ามี schema media ให้ใส่แทนได้เลย
  likes: z.array(likeSchema),
  comments: z.array(commentSchema),
  _count: z.object({
    likes: z.number(),
    comments: z.number(),
  }),
}).transform((data) => ({
  ...data,
  likesCount: data._count.likes,
  commentsCount: data._count.comments,
}));
