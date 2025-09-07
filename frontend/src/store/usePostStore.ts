import { postApi } from "@/api/post";
import { likeApi } from "@/api/like";
import { withAbortController } from "@/helper/withAbortController";
import { create } from "zustand";
import type { CreatePostReq, Posts, PostState } from "@/types/postStoreType";
import { useUiStore } from "./useUiStore";

export const usePostStore = create<PostState>((set, get) => ({
  postIds: [],
  postsById: {},
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
          const postsById = response.posts.reduce(
            (acc: Record<number, Posts>, post: Posts) => {
              acc[post.id] = {
                ...state.postsById[post.id],
                ...post,
              };
              return acc;
            },
            {}
          );

          const postIds = response.posts.map((post: Posts) => post.id);

          return {
            postsById,
            postIds,
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
        useUiStore.getState().togglePostInputOpen();
      });
    } catch (error) {
      console.error("Error creating post from zustand", error);
    }
  },

  deletePost: async (post_id: number) => {
    const prevPosts = {
      postsById: get().postsById,
      postIds: get().postIds,
    };
    try {
      set((state) => {
        const newPostsById = { ...state.postsById };
        delete newPostsById[post_id];

        return {
          postsById: newPostsById,
          postIds: state.postIds.filter((id) => id !== post_id),
        };
      });

      await withAbortController(async (signal) => {
        const response = await postApi.clientDeletePost(post_id, signal);
        if (!response) throw new Error("No response posts from zustand");
      });
    } catch (error) {
      console.error("Error deleting post from zustand", error);
      set(prevPosts);
    }
  },

  toggleLike: async (post_id: number) => {
    const state = get();
    const post = state.postsById[post_id];
    if (!post) return;
   
    const isCurrentlyLiked = post.isLiked ?? false;
    const prevPost = { ...post };

    set((state) => ({
      postsById: {
        ...state.postsById,
        [post_id]: {
          ...post,
          isLiked: !isCurrentlyLiked,
          likes: post.likes + (isCurrentlyLiked ? -1 : 1),
        },
      },
    }));
    try {
      await withAbortController(async (signal) => {
        const response = await likeApi.clientToggleLike(post_id, signal);
        if (!response) throw new Error("No response posts from zustand");
      });
    } catch (error) {
      console.error("Error toggling like:", error);
      set((state) => ({
        postsById: {
          ...state.postsById,
          [post_id]: prevPost,
        },
      }));
    }
  },
}));
