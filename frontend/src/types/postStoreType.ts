import type z from "zod"
import type { Pagination } from "./chatStoreType"
import type { createPostRepoSchema,  postSchema } from "@shared/schema/post/post.schema"
import type { P } from "node_modules/tailwindcss/dist/resolve-config-QUZ9b-Gn.d.mts";

export type Posts = z.infer<typeof postSchema> 
export type ClientPosts = z.infer<typeof postSchema> & { isLiked? : boolean }
export type CreatePostReq = 
z.infer<typeof createPostRepoSchema>;

interface PostStateBase {
    postIds : number[],
    postsById : Record<number,ClientPosts>,
    pagination : Pagination
    inputPost : string
  
}
interface PostAction {
    // Post action
    fetchPostById : (post_id : number) => Promise<void>
    fetchPosts : () => Promise<void>
    createPost : (data : CreatePostReq) => Promise<void>
    deletePost : (post_id : number) => Promise<void>

    // Like action
    toggleLike : (post_id : number) => Promise<void>
   
}


export type PostState = PostStateBase & PostAction