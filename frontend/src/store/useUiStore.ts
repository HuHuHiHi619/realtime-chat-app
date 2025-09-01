import { create } from "zustand";
import type { UiStateBase, UiStateMethods } from "../types/ui/uiTypes";

type UiState = UiStateBase & UiStateMethods

export const useUiStore = create<UiState>((set,get) => ({
    currentView : 'Post',
    isPostOpen : false,


    setCurrentView : (view : UiState['currentView']) => {
        set({ currentView : view })
    },

    togglePostOpen : () => {
        set((state) => ({ isPostOpen : !state.isPostOpen }))
    },

    resetUi: () => set({
    currentView: 'Post',
    isPostOpen: false
  })

}))