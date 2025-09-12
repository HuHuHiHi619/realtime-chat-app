import { getLikesSchema } from "@shared/schema/post/like.schema";
import { createPostRepoSchema, createPostSchema, getPostQuerySchema, getPostRepoSchema, paramsPostSchema } from "@shared/schema/post/post.schema";
import z from "zod";

export type GetSinglePostServiceDTO = z.infer<typeof paramsPostSchema> & { author_id : number }

export type GetPostsServiceDTO =
z.infer<typeof getPostQuerySchema> & {
    author_id: number
}

export type CreatePostServiceDTO = z.infer<typeof createPostSchema> & {
  author_id: number;
};

export type GetPostRepoDTO = z.infer<typeof getPostRepoSchema>
export type CreatePostRepoDTO = z.infer<typeof createPostRepoSchema>



export type LikeDTO = z.infer<typeof getLikesSchema>;
