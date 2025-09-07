import { create } from "zustand";
import type { UiStateBase, UiStateMethods } from "../types/uiTypes";

type UiState = UiStateBase & UiStateMethods;

export const useUiStore = create<UiState>((set, get) => ({
  currentView: "Post",
  activePostId: null,
  isPostOpen: false,
  isPostInputOpen: false,

  setCurrentView: (view: UiState["currentView"]) => {
    set({ currentView: view });
  },

  openPost: (postId: number) => {
    set({ isPostOpen: true, activePostId: postId });
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
  
  resetUi: () =>
    set({
      currentView: "Post",
      isPostOpen: false,
      isPostInputOpen: false,
      activePostId: null,
    }),
}));
