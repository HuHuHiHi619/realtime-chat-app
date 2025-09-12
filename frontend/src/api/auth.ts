import type { LoginInput, RegisterInput } from "@/types/authStoreType";
import { apiClient } from "../helper/apiClient";
import { loginResponseSchema, registerSchema } from "@shared/schema/auth.schema.schema";

const baseUrl = "http://localhost:5000/api";

export const authApi = {
  clientRegister : (data : RegisterInput, signal : AbortSignal)  => {
    return apiClient({
      url: `${baseUrl}/register`,
      method: "POST",
      body: data,
      schema: (data) => registerSchema.parse(data),
      signal : signal
    })
  },

  clientLogin : (data : LoginInput, signal : AbortSignal) => {
    return apiClient({
      url: `${baseUrl}/login`,
      method: "POST",
      body: data,
      schema: (data) => loginResponseSchema.parse(data),
      signal : signal
    })
  },

  clientLogout : ( signal : AbortSignal)  => {
    return apiClient({
      url: `${baseUrl}/logout`,
      method: "POST",
      schema: (data) => data,
      signal : signal
    })
  },

  clientGetTokenSocket : (signal : AbortSignal) => {
    return apiClient({
      url: `${baseUrl}/refreshToken`,
      method: "GET",
      schema: (data) => data,
      signal : signal
    })
  }
}







