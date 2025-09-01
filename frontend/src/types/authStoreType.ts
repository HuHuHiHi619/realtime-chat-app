
import type z from "zod"
import type { loginSchema, registerSchema, userSchema } from "@shared/schema/auth.schema.schema"

export type User = z.infer<typeof userSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

interface AuthStateBase  {
    user: User | null,
    isAuthenticated: boolean,
    isLoading: boolean,
    apiError: string,
    fieldErrors: Record<string , string>,
    activeControllers: Set<AbortController>
}

interface AuthAction {
    // LOGIC FUNCTION
    register : (data : RegisterInput) => Promise<void>
    login : (data : LoginInput) => Promise<void>
    logout : () => Promise<void>
   
    // UI FUNCTION
    setIsLoading: (isLoading: boolean) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void

    // CONTROLLER FUNCTION
    addController : (controller : AbortController) => void
    removeController : (controller : AbortController) => void
}

export type AuthState = AuthStateBase & AuthAction
   
