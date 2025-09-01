import {
  createCommentRepoSchema,
  createCommentSchema,
  getCommentQuerySchema,
  getCommentRepoSchema,
  paramsCommentSchema,
} from "@shared/schema/post/comment.schema";
import z from "zod";
export type GetCommentServiceDTO = z.infer<typeof paramsCommentSchema> &
  z.infer<typeof getCommentQuerySchema> & {
    author_id: number;
  };

export type CreateCommentServiceDTO = z.infer<typeof paramsCommentSchema> &
  z.infer<typeof createCommentSchema> & {
    author_id: number;
  };
export type GetCommentRepoDTO = z.infer<typeof getCommentRepoSchema>;
export type CreateCommentRepoDTO = z.infer<typeof createCommentRepoSchema>;
