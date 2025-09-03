import z from "zod";
import type { apiErrorSchema } from "../schema/error/stateSchema";

export type ApiError = z.infer<typeof apiErrorSchema>

export type ErrorStateBase = {
  error : ApiError | null;
  formErrors : Record<string, Record<string, string>>;
  pageErrors : Record<string, string>;

}

export type ErrorMethods = {
  setError : (error : ApiError | null) => void
  setFormErrors : (formName :string , errors : Record<string, string>) => void 
  clearFormErrors : (formName :string) => void
  setPageErrors : (pageName : string , errors : string | null) => void
  
  clearAllErrors : () => void

  getFieldErrors : (formName : string , fieldName : string) => string | undefined
  hasFieldErrors : (formName : string , fieldName : string) => boolean
  hasFormErrors : (formName : string ) => boolean
  
  getPageErrors : (pageName : string ) => string | undefined
}

