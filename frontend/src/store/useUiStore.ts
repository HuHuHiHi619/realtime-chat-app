import { create } from "zustand";
import type { ConfirmOption, UiStateBase, UiStateMethods } from "../types/uiTypes";
import { usePostStore } from "./usePostStore";

type UiState = UiStateBase & UiStateMethods;

export const useUiStore = create<UiState>((set, get) => ({
  currentView: "Post",
  activePostId: null,
  isPostOpen: false,
  isPostInputOpen: false,
  confirm: {
    isOpen: false,
    options: null,
  },

  setCurrentView: (view: UiState["currentView"]) => {
    set({ currentView: view });
  },

  openPost : (postId : number) => {
      console.log('postAction id', postId);
     set({ isPostOpen: true, activePostId: postId });
     const { postsById , fetchPostById } = usePostStore.getState();
     if(!postsById[postId] || !postsById[postId].content) {
      fetchPostById(postId)
     }
  },

  closePost: () => {
    set({ isPostOpen: false, activePostId: null });
  },

  togglePostInputOpen: () => {
    set((state) => {
      const newValue = !state.isPostInputOpen;
      return { isPostInputOpen: newValue };
    });
  },

  toggleConfirmOpen: (options? : ConfirmOption) => {
    set((state) => {
      if(!state.confirm.isOpen) {
        return { confirm : { isOpen : true, options : options ?? null } }
      } else {
        return { confirm : { isOpen : false, options : null } }
      }
    })
  },
  
  resetUi: () =>
    set({
      currentView: "Post",
      isPostOpen: false,
      isPostInputOpen: false,
      activePostId: null,
    }),
}));
