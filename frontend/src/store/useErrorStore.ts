import { create } from "zustand";
import type { ErrorStateBase , ErrorMethods } from "../types/errorTypes";


export const useErrorStore = create<ErrorStateBase & ErrorMethods>((set, get) => ({
  // state fields
  error: null,
  formErrors: {},
  pageErrors: {},
  
  // methods
  setError: (error) => set({ error }),

  setFormErrors: (formName, errors) =>
    set((state) => ({
      formErrors: {
        ...state.formErrors,
        [formName]: errors,
      },
    })),

  clearFormErrors: (formName) =>
    set((state) => ({
      formErrors: {
        ...state.formErrors,
        [formName]: {},
      },
    })),

  setPageErrors: (pageName, error) =>
    set((state) => ({
      pageErrors: {
        ...state.pageErrors,
        [pageName]: error || "",
      },
    })),

  clearAllErrors: () => set({ error: null, formErrors: {}, pageErrors: {} }),

  getFieldErrors: (formName, fieldName) => {
    const formErrors = get().formErrors[formName];
    return formErrors ? formErrors[fieldName] : undefined;
  },
  getPageErrors: (pageName) => get().pageErrors[pageName],

  hasFieldErrors: (formName, fieldName) => {
    return !!get().getFieldErrors(formName, fieldName);
  },

  hasFormErrors: (formName) => {
    const formErrors = get().formErrors[formName];
    return formErrors ? Object.keys(formErrors).length > 0 : false;
  },



}));
