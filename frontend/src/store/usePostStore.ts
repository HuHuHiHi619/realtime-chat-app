import { postApi } from "@/api/post";
import { likeApi } from "@/api/like";
import { withAbortController } from "@/helper/withAbortController";
import { create } from "zustand";
import type { CreatePostReq, Posts, PostState } from "@/types/postStoreType";
import { useUiStore } from "./useUiStore";
import { useAuthStore } from "./useAuthStore";
import { li } from "motion/react-client";

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
  togglingLike: {},

  fetchPostById: async (post_id: number) => {
    try {
      await withAbortController(async (signal) => {
        const response = await postApi.clientGetSinglePost(post_id, signal);
        if (!response) throw new Error("No response posts from zustand");

        set((state) => {
          const prev = state.postsById[response.id] ?? {};
          return {
            postsById: {
              ...state.postsById,
              [response.id]: {
                ...state.postsById[response.id],
                ...response,
                ...prev,
              },
            },
            postIds: state.postIds.includes(response.id)
              ? state.postIds
              : [...state.postIds, response.id],
          };
        });
      });
    } catch (error) {
      console.error("Error fetching post from zustand", error);
    }
  },

  fetchPosts: async () => {
    try {
      await withAbortController(async (signal) => {
        const response = await postApi.clientGetPosts(signal);
        if (!response) throw new Error("No response posts from zustand");

        set((state) => {
          const postsById = { ...state.postsById };

          response.posts.forEach((post: Posts) => {
            const user = useAuthStore.getState().user;

            if (!user) return;

            postsById[post.id] = {
              ...postsById[post.id],
              ...post,
            };
          });

          return {
            postsById,
            postIds: response.posts.map((p) => p.id),
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
    if (state.togglingLike[post_id]) return;

    const prevPost = { ...post };

    console.log("🟡 ก่อน toggle:", {
      post_id,
      isLiked: prevPost.isLiked,
      likesCount: prevPost.likesCount,
    });

    set((state) => {
      const current = state.postsById[post_id];
      const updated = {
        ...current,
        isLiked: !current.isLiked,
        likesCount: current.isLiked
          ? current.likesCount - 1
          : current.likesCount + 1,
      };

      console.log("🟠 หลัง toggle (optimistic):", {
        post_id,
        isLiked: updated.isLiked,
        likesCount: updated.likesCount,
      });

      return {
        postsById: {
          ...state.postsById,
          [post_id]: updated,
        },
        togglingLike: { ...state.togglingLike, [post_id]: true },
      };
    });

    try {
      await withAbortController(async (signal) => {
        const response = await likeApi.clientToggleLike(post_id, signal);
        if (!response) throw new Error("No response posts from zustand");

        set((state) => ({
          ...state,
          postsById: {
            ...state.postsById,
            [post_id]: {
              ...state.postsById[post_id],
              isLiked: response.isLiked,
              likesCount: response.likesCount,
            },
          },
          togglingLike: { ...state.togglingLike, [post_id]: false }, // ✅ reset flag
        }));

        console.log("🟢 หลัง response จาก BE:", {
          post_id,
          isLiked: response.isLiked,
          likesCount: response.likesCount,
        });
      });
    } catch (error) {
      console.error("Error toggling like:", error);
      set((state) => ({
        postsById: {
          ...state.postsById,
          [post_id]: prevPost,
        },
        togglingLike: { ...state.togglingLike, [post_id]: false }, // ✅ reset flag
      }));
    }
  },
}));
