import type z from "zod"
import type { Pagination } from "./chatStoreType"
import type { createPostRepoSchema,  postSchema } from "@shared/schema/post/post.schema"
import type { P } from "node_modules/tailwindcss/dist/resolve-config-QUZ9b-Gn.d.mts";

export type Posts = z.infer<typeof postSchema>
export type CreatePostReq = 
z.infer<typeof createPostRepoSchema>;

interface PostStateBase {
    posts : Posts[],
    pagination : Pagination
    inputPost : string
}
interface PostAction {
    // Post action
    fetchPosts : () => Promise<void>
    createPost : (data : CreatePostReq) => Promise<void>
    deletePost : (post_id : number) => Promise<void>

    // Like action
    createLike : (post_id : number) => Promise<void>
    deleteLike : (post_id    : number) => Promise<void>

}


export type PostState = PostStateBase & PostAction