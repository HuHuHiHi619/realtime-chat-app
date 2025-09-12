import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "../api/auth";
import { withAbortController } from "../helper/withAbortController";
import type { AuthState, LoginInput, RegisterInput } from "@/types/authStoreType";
import { useUiStore } from "./useUiStore";

export const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      apiError: "",
      fieldErrors: {},
      activeControllers: new Set(),

  // LOGIC METHOD
      register: async (credentials : RegisterInput) => {
        set({ isLoading: true, apiError: "", fieldErrors: {} });
        try {
          await withAbortController(async (signal) => {
            const response = await authApi.clientRegister(
              credentials,
              signal
            );
            
           
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      login: async (credentials : LoginInput) => {
        set({ isLoading: true });
        try {
          await withAbortController( async (signal) => {
    
            const response = await authApi.clientLogin(
              credentials,
              signal
            );
         
            set({
              user: response,
              isAuthenticated: true,
              isLoading: false,
            });
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await withAbortController( async (signal) => {
            const response = await authApi.clientLogout(signal);
            if (response) {
              set({ user: null, isAuthenticated: false });
            }
            useUiStore.getState().resetUi()
          });
        } catch (error) {
          throw error;
        }
      },

  // UI METHOD
      setIsLoading: (loading) => set({ isLoading: loading }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),


  // CONTROLLER METHOD
      addController: (controller) => {
      
        set((state) => ({
          ...state,
          activeControllers: new Set(state.activeControllers).add(controller),
        }));
      
      },

      removeController: (controller) => {
        set((state) => {
          const newController = new Set(state.activeControllers);
          newController.delete(controller);
          return { activeControllers: newController };
        });
      },
    }),

    {
      name: "auth-storage",
      partialize: (state) => ({ ...state }),
    }
  )
);
