import { postApi } from "@/api/post";
import { likeApi } from "@/api/like";
import { withAbortController } from "@/helper/withAbortController";
import { create } from "zustand";
import type { CreatePostReq, Posts, PostState } from "@/types/postStoreType";
import { useUiStore } from "./useUiStore";

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
        useUiStore.getState().togglePostInputOpen()
      });
    } catch (error) {
      console.error("Error creating post from zustand", error);
    }
  },

  deletePost: async(post_id : number) => {
    try{
      await withAbortController(async (signal) => {
        const response = await postApi.clientDeletePost(post_id, signal);
        if(!response) throw new Error('No response posts from zustand');
        set((state) => ({
          posts : state.posts.filter(post => post.id !== post_id)
        }))
      })
    }catch(error){ 
      console.error("Error deleting post from zustand", error);
    }
  },

  createLike : async (post_id : number) => {
    const prevPosts = get().posts
    try{
      set((state) => ({
          posts : state.posts.map((post) => post.id === post_id 
            ? { ...post, likes : post.likes + 1 }
            : post
          )
        }))

      await withAbortController(async (signal) => {
        const response = await likeApi.clientCreateLike(post_id , signal);
        if(!response) throw new Error('No response posts from zustand');
        
      })
    }catch(error){ 
      console.error("Error deleting post from zustand", error);
      set({ posts : prevPosts })
    }
  },

  deleteLike : async (post_id : number) => {
    try{
      await withAbortController(async (signal) => {
        const response = await likeApi.clientDeleteLike(post_id , signal);
        if(!response) throw new Error('No response posts from zustand');
        set((state) => ({
          posts : state.posts.map((post) => post.id === post_id 
            ? { ...post, likes : post.likes - 1 }
            : post
          )
        }))
      })
    }catch(error){
       console.error("Error deleting post from zustand", error);
    }
  }


}));
