import { create } from "zustand";
import type { UiStateBase, UiStateMethods } from "../types/uiTypes";

type UiState = UiStateBase & UiStateMethods;

export const useUiStore = create<UiState>((set, get) => ({
  currentView: "Post",
  isPostOpen: false,
  isPostInputOpen: false,

  setCurrentView: (view: UiState["currentView"]) => {
    set({ currentView: view });
  },

  togglePostOpen: () => {
    set((state) => ({ isPostOpen: !state.isPostOpen }));
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
    }),
}));
