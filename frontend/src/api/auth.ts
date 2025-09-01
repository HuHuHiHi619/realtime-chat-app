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
  }
}








/*export const clientRegister = async (
  registerData: RegisterInput
): Promise<RegisterResponse> => {
  try {
    const response = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const rawData = await response.json();
    const validateData = registerResponseSchema.parse(rawData);

    return validateData;
  } catch (error: unknown) {
    console.error(error);
    throw new Error(`Error during registration: ${getErrorMessage(error)}`);
  }
};

export const clientLogin = async (
  loginData: LoginInput
): Promise<LoginResponse> => {
  try {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(loginData),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const rawData = await response.json();
    const validateData = loginResponseSchema.parse(rawData);

    return validateData;
  } catch (error: unknown) {
    console.error(error);
    throw new Error(`Error during login: ${getErrorMessage(error)}`);
  }
};

export const clientLogout = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const rawData = await response.json();
    const validateData = logoutResponseSchema.parse(rawData);

    return validateData;
  } catch (error) {
    console.error(error);

    throw new Error(`Error during login: ${getErrorMessage(error)}`);
  }
};*/
