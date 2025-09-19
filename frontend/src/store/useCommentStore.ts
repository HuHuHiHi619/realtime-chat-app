import { commentApi } from "@/api/comment";
import { withAbortController } from "@/helper/withAbortController";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import type {
  Comments,
  CommentState,
  CreateCommentReq,
} from "@/types/commentType";

export const useCommentStore = create<CommentState>((set, get) => ({
  commentsByIds: {},
  commentIdsByPostId: {},
  replyIdsByCommentId: {},
  pagination: {},

  fetchComments: async (post_id: number, comment_id?: number) => {
    try {
      await withAbortController(async (signal) => {
        const response = await commentApi.clientGetComments(
          post_id,
          signal,
          comment_id
        );
        if (!response) throw new Error("No response comments from zustand");
       
        const isReply = !!comment_id;

        const user = useAuthStore.getState().user;
        const data =  isReply ? response.replies : response.comments;
        if (!user || !data) return;
  
        set((state) => {
          const commentsByIds = { ...state.commentsByIds };
          const commentIdsByPostId = { ...state.commentIdsByPostId };
          const replyIdsByCommentId = { ...state.replyIdsByCommentId };
          const key = comment_id ? `comment:${comment_id}` : `post:${post_id}`;
          const items: number[] = [];


          data.forEach((comment: Comments) => {
            commentsByIds[comment.id] = {
              ...commentsByIds[comment.id],
              ...comment,
            };
            items.push(comment.id);
          });

          if (isReply) {
            const prev = replyIdsByCommentId[comment_id] || [];
            replyIdsByCommentId[comment_id] = Array.from(
              new Set([...items, ...prev])
            ); // กัน id ซ้ำ
          } else {
            const prev = commentIdsByPostId[post_id] || [];
            commentIdsByPostId[post_id] = Array.from(
              new Set([...items, ...prev])
            );
          }

          return {
            commentsByIds,
            commentIdsByPostId,
            replyIdsByCommentId,
            pagination: {
              ...state.pagination,
              [key]: response.pagination,
            },
          };
        });
      });
    } catch (error) {
      console.error("Error fetching comments from zustand", error);
    }
  },

  createComment: async (data: CreateCommentReq) => {
    try {
      await withAbortController(async (signal) => {
        const response = await commentApi.clientCreateComment(data, signal);
        if (!response) throw new Error("No response comments from zustand");
      });
    } catch (error) {
      console.error("Error creating comments from zustand", error);
    }
  },
}));
