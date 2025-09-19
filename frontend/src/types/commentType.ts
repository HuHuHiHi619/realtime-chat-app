import type z from "zod"
import type { Pagination } from "./chatStoreType"
import type { commentSchema, createCommentRepoSchema } from "@shared/schema/post/comment.schema"


export type Comments = z.infer<typeof commentSchema> 
export type ClientComments = z.infer<typeof commentSchema> & { isLiked? : boolean }
export type CreateCommentReq = 
z.infer<typeof createCommentRepoSchema>;

interface CommentStateBase {
    commentsByIds : Record<number , ClientComments>,
    commentIdsByPostId : Record<number , number[]>
    replyIdsByCommentId : Record<number , number[]>
    pagination: Record<string, Pagination>;
}
interface CommentAction {
    // Post action
    fetchComments : (post_id : number , comment_id? : number) => Promise<void>
   
    createComment : (data : CreateCommentReq) => Promise<void>
}


export type CommentState = CommentStateBase & CommentAction