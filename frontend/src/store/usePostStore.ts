import { postApi } from "@/api/post";
import { withAbortController } from "@/helper/withAbortController";
import { create } from "zustand";
import type { CreatePostReq, Posts, PostState } from "@/types/postStoreType";

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasMore: false,
  },
  inputPost: "",
  fetchPosts: async () => {
    try {
      await withAbortController(async (signal) => {
        const response = await postApi.clientGetPosts(signal);
        if (!response) throw new Error("No response posts from zustand");

        set((state) => {
          const existingId = new Set(state.posts.map((post) => post.id));
          const newPosts = response.posts.filter(
            (p: Posts) => !existingId.has(p.id)
          );
          return {
            posts: [...newPosts, ...state.posts],
            pagination: response.pagination,
          };
        });
      });
    } catch (error) {
      console.error("Error fetching post from zustand", error);
    }
  },
  createPost: async (data: CreatePostReq) => {
    try {
      await withAbortController(async (signal) => {
        const response = await postApi.clientCreatePost(data, signal);
        if (!response) throw new Error("No response posts from zustand");
        await get().fetchPosts();
      });
    } catch (error) {
      console.error("Error creating post from zustand", error);
    }
  },
}));
